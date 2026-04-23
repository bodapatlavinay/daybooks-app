import { useEffect, useMemo, useState } from 'react';
import { C } from './styles';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export const PAYMENT_TYPES = [
  { value: 'cash', label: 'Cash', color: '#15803D', bg: '#F0FDF4', border: '#86EFAC' },
  { value: 'card', label: 'Card', color: '#1D4ED8', bg: '#EFF6FF', border: '#93C5FD' },
  { value: 'zelle', label: 'Zelle', color: '#6D28D9', bg: '#F5F3FF', border: '#C4B5FD' },
  { value: 'cashapp', label: 'Cash App', color: '#166534', bg: '#F0FDF4', border: '#6EE7B7' },
  { value: 'venmo', label: 'Venmo', color: '#0369A1', bg: '#EFF6FF', border: '#7DD3FC' },
  { value: 'check', label: 'Check', color: '#B45309', bg: '#FFFBEB', border: '#FCD34D' },
  { value: 'other', label: 'Other', color: '#6B6B6B', bg: '#F7F6F3', border: '#E8E6E1' },
];

export function paymentLabel(value) {
  return PAYMENT_TYPES.find((p) => p.value === value)?.label ?? 'Cash';
}

export function paymentStyle(value) {
  return PAYMENT_TYPES.find((p) => p.value === value) ?? PAYMENT_TYPES[0];
}

function normalizeInitialValues(initialValues, services) {
  const firstService = services[0]?.name || '';
  return {
    description: initialValues?.description ?? '',
    amount: initialValues?.amount != null ? String(initialValues.amount) : '',
    date: initialValues?.date || todayString(),
    serviceType: initialValues?.serviceType || firstService,
    paymentType: initialValues?.paymentType || 'cash',
    customerName: initialValues?.customerName ?? '',
    customerPhone: initialValues?.customerPhone ?? '',
    vehiclePlate: initialValues?.vehiclePlate ?? '',
    vehicleType: initialValues?.vehicleType ?? '',
    customerNotes: initialValues?.customerNotes ?? '',
    inventoryItemId: initialValues?.inventoryItemId ?? '',
  };
}

export default function EntryForm({
  onAddEntry,
  services = [],
  inventoryItems = [],
  submitting = false,
  initialValues = null,
  compact = false,
  submitLabel,
  onAppliedInitialValues,
}) {
  const normalizedInitial = useMemo(
    () => normalizeInitialValues(initialValues, services),
    [initialValues, services]
  );

  const [description, setDescription] = useState(normalizedInitial.description);
  const [amount, setAmount] = useState(normalizedInitial.amount);
  const [date, setDate] = useState(normalizedInitial.date);
  const [serviceType, setServiceType] = useState(normalizedInitial.serviceType);
  const [paymentType, setPaymentType] = useState(normalizedInitial.paymentType);

  const [customerName, setCustomerName] = useState(normalizedInitial.customerName);
  const [customerPhone, setCustomerPhone] = useState(normalizedInitial.customerPhone);
  const [vehiclePlate, setVehiclePlate] = useState(normalizedInitial.vehiclePlate);
  const [vehicleType, setVehicleType] = useState(normalizedInitial.vehicleType);
  const [customerNotes, setCustomerNotes] = useState(normalizedInitial.customerNotes);
  const [inventoryItemId, setInventoryItemId] = useState(normalizedInitial.inventoryItemId);

  useEffect(() => {
    if (!initialValues) {
      if (services.length > 0 && !serviceType) setServiceType(services[0].name);
      return;
    }

    setDescription(normalizedInitial.description);
    setAmount(normalizedInitial.amount);
    setDate(normalizedInitial.date);
    setServiceType(normalizedInitial.serviceType);
    setPaymentType(normalizedInitial.paymentType);
    setCustomerName(normalizedInitial.customerName);
    setCustomerPhone(normalizedInitial.customerPhone);
    setVehiclePlate(normalizedInitial.vehiclePlate);
    setVehicleType(normalizedInitial.vehicleType);
    setCustomerNotes(normalizedInitial.customerNotes);
    setInventoryItemId(normalizedInitial.inventoryItemId);

    onAppliedInitialValues?.();
  }, [normalizedInitial, initialValues, services, serviceType, onAppliedInitialValues]);

  const eligibleInventory = useMemo(() => {
    return inventoryItems.filter((item) => {
      const qty = Number(item.quantity_on_hand ?? item.quantity ?? 0);
      return qty > 0;
    });
  }, [inventoryItems]);

  function resetForm() {
    setDescription('');
    setAmount('');
    setDate(todayString());
    setPaymentType('cash');
    setCustomerName('');
    setCustomerPhone('');
    setVehiclePlate('');
    setVehicleType('');
    setCustomerNotes('');
    setInventoryItemId('');
    if (services.length > 0) setServiceType(services[0].name);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const finalDescription = description.trim() || `${serviceType || 'General'} job`;

    if (!amount || Number(amount) <= 0 || !serviceType) return;

    onAddEntry?.({
      description: finalDescription,
      amount,
      date,
      serviceType,
      paymentType,
      customerName: customerName.trim() || null,
      customerPhone: customerPhone.trim() || null,
      vehiclePlate: vehiclePlate.trim() || null,
      vehicleType: vehicleType.trim() || null,
      customerNotes: customerNotes.trim() || null,
      inventoryItemId: inventoryItemId || null,
    });

    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...s.form, gap: compact ? '10px' : '12px' }}>
      {compact ? (
        <>
          <div style={s.field}>
            <div style={s.label}>Service type</div>
            <div style={s.serviceBtns}>
              {services.map((sv) => (
                <button
                  key={sv.id}
                  type="button"
                  onClick={() => setServiceType(sv.name)}
                  style={{
                    ...s.serviceBtn,
                    background: serviceType === sv.name ? C.dark : C.surface,
                    color: serviceType === sv.name ? C.white : C.body,
                    border: `1.5px solid ${serviceType === sv.name ? C.dark : C.border}`,
                    fontWeight: serviceType === sv.name ? '700' : '500',
                  }}
                >
                  {sv.name}
                </button>
              ))}
            </div>
          </div>

          <div style={s.row2}>
            <Field label="Amount ($)" id="entry-amount-compact">
              <input
                id="entry-amount-compact"
                name="entry-amount-compact"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={s.input}
                autoComplete="off"
                required
              />
            </Field>

            <Field label="Payment" id="entry-payment-compact">
              <select
                id="entry-payment-compact"
                name="entry-payment-compact"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                style={s.input}
              >
                {PAYMENT_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {eligibleInventory.length > 0 && (
            <Field label="Inventory item (optional)" id="entry-inventory-compact">
              <select
                id="entry-inventory-compact"
                name="entry-inventory-compact"
                value={inventoryItemId}
                onChange={(e) => setInventoryItemId(e.target.value)}
                style={s.input}
              >
                <option value="">No stock item linked</option>
                {eligibleInventory.map((item) => {
                  const qty = Number(item.quantity_on_hand ?? item.quantity ?? 0);
                  const size = item.size ? ` • ${item.size}` : '';
                  const brand = item.brand ? ` • ${item.brand}` : '';
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}{brand}{size} • Qty {qty}
                    </option>
                  );
                })}
              </select>
            </Field>
          )}

          <button
            type="submit"
            style={{
              ...s.submitBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : submitLabel || '+ Add Income'}
          </button>
        </>
      ) : (
        <>
          <div style={s.row2}>
            <Field label="Service type" id="entry-service">
              <select
                id="entry-service"
                name="entry-service"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                style={s.input}
                required
              >
                {services.length === 0 ? (
                  <option value="">No services</option>
                ) : (
                  services.map((sv) => (
                    <option key={sv.id} value={sv.name}>
                      {sv.name}
                    </option>
                  ))
                )}
              </select>
            </Field>

            <Field label="Amount ($)" id="entry-amount">
              <input
                id="entry-amount"
                name="entry-amount"
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={s.input}
                autoComplete="off"
                required
              />
            </Field>
          </div>

          <div style={s.row2}>
            <Field label="Payment type" id="entry-payment">
              <select
                id="entry-payment"
                name="entry-payment"
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}
                style={s.input}
              >
                {PAYMENT_TYPES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date" id="entry-date">
              <input
                id="entry-date"
                name="entry-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={s.input}
              />
            </Field>
          </div>

          <Field label="Description (optional)" id="entry-description">
            <input
              id="entry-description"
              name="entry-description"
              type="text"
              placeholder="e.g. Front tire replacement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={s.input}
              autoComplete="off"
            />
          </Field>

          {eligibleInventory.length > 0 && (
            <Field label="Inventory item (optional)" id="entry-inventory">
              <select
                id="entry-inventory"
                name="entry-inventory"
                value={inventoryItemId}
                onChange={(e) => setInventoryItemId(e.target.value)}
                style={s.input}
              >
                <option value="">No stock item linked</option>
                {eligibleInventory.map((item) => {
                  const qty = Number(item.quantity_on_hand ?? item.quantity ?? 0);
                  const size = item.size ? ` • ${item.size}` : '';
                  const brand = item.brand ? ` • ${item.brand}` : '';
                  return (
                    <option key={item.id} value={item.id}>
                      {item.name}{brand}{size} • Qty {qty}
                    </option>
                  );
                })}
              </select>
            </Field>
          )}

          <div style={s.sectionTitle}>Customer & Vehicle (optional)</div>

          <div style={s.row2}>
            <Field label="Customer name" id="entry-customer-name">
              <input
                id="entry-customer-name"
                name="entry-customer-name"
                type="text"
                placeholder="e.g. John Smith"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                style={s.input}
                autoComplete="name"
              />
            </Field>

            <Field label="Customer phone" id="entry-customer-phone">
              <input
                id="entry-customer-phone"
                name="entry-customer-phone"
                type="tel"
                inputMode="tel"
                placeholder="e.g. 6175551234"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                style={s.input}
                autoComplete="tel"
              />
            </Field>
          </div>

          <div style={s.row2}>
            <Field label="Vehicle plate" id="entry-vehicle-plate">
              <input
                id="entry-vehicle-plate"
                name="entry-vehicle-plate"
                type="text"
                placeholder="e.g. MA 123ABC"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                style={s.input}
                autoComplete="off"
              />
            </Field>

            <Field label="Vehicle type" id="entry-vehicle-type">
              <input
                id="entry-vehicle-type"
                name="entry-vehicle-type"
                type="text"
                placeholder="e.g. Honda Civic"
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={s.input}
                autoComplete="off"
              />
            </Field>
          </div>

          <Field label="Customer notes" id="entry-customer-notes">
            <textarea
              id="entry-customer-notes"
              name="entry-customer-notes"
              placeholder="e.g. Wants rotation reminder next season"
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              style={s.textarea}
              rows={3}
            />
          </Field>

          <button
            type="submit"
            style={{
              ...s.submitBtn,
              opacity: submitting ? 0.7 : 1,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
            disabled={submitting}
          >
            {submitting ? 'Saving...' : submitLabel || '+ Add Income'}
          </button>
        </>
      )}
    </form>
  );
}

function Field({ label, id, children }) {
  return (
    <div style={s.field}>
      <label htmlFor={id} style={s.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

const s = {
  form: {
    display: 'flex',
    flexDirection: 'column',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },

  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  sectionTitle: {
    fontSize: '12px',
    fontWeight: '800',
    color: C.dark,
    marginTop: '2px',
    marginBottom: '-2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1.5px solid ${C.border}`,
    fontSize: '13px',
    background: C.surface,
    outline: 'none',
    color: C.black,
    fontFamily: "'Outfit', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
  },

  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1.5px solid ${C.border}`,
    fontSize: '13px',
    background: C.surface,
    outline: 'none',
    color: C.black,
    fontFamily: "'Outfit', sans-serif",
    width: '100%',
    boxSizing: 'border-box',
    resize: 'vertical',
    minHeight: '88px',
  },

  submitBtn: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: C.red,
    color: C.white,
    fontWeight: '700',
    fontSize: '14px',
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
  },

  serviceBtns: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },

  serviceBtn: {
    padding: '10px 12px',
    borderRadius: '10px',
    background: C.surface,
    color: C.body,
    border: `1.5px solid ${C.border}`,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },
};