import { useEffect, useMemo, useState } from 'react';
import { C } from './styles';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export const PAYMENT_TYPES = [
  { value: 'cash',    label: 'Cash',     color: '#15803D', bg: '#F0FDF4', border: '#86EFAC' },
  { value: 'card',    label: 'Card',     color: '#1D4ED8', bg: '#EFF6FF', border: '#93C5FD' },
  { value: 'zelle',   label: 'Zelle',    color: '#6D28D9', bg: '#F5F3FF', border: '#C4B5FD' },
  { value: 'cashapp', label: 'Cash App', color: '#166534', bg: '#F0FDF4', border: '#6EE7B7' },
  { value: 'venmo',   label: 'Venmo',    color: '#0369A1', bg: '#EFF6FF', border: '#7DD3FC' },
  { value: 'check',   label: 'Check',    color: '#B45309', bg: '#FFFBEB', border: '#FCD34D' },
  { value: 'other',   label: 'Other',    color: '#6B6B6B', bg: '#F7F6F3', border: '#E8E6E1' },
];

export function paymentLabel(value) {
  return PAYMENT_TYPES.find(p => p.value === value)?.label ?? 'Cash';
}

export function paymentStyle(value) {
  return PAYMENT_TYPES.find(p => p.value === value) ?? PAYMENT_TYPES[0];
}

function normalizeInitialValues(initialValues, services) {
  const firstService = services[0]?.name || '';
  return {
    description: initialValues?.description ?? '',
    amount: initialValues?.amount != null ? String(initialValues.amount) : '',
    date: initialValues?.date || todayString(),
    serviceType: initialValues?.serviceType || firstService,
    paymentType: initialValues?.paymentType || 'cash',
  };
}

export default function EntryForm({
  onAddEntry,
  services = [],
  submitting,
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
    onAppliedInitialValues?.();
  }, [normalizedInitial, initialValues, services, onAppliedInitialValues]);

  function resetForm() {
    setDescription('');
    setAmount('');
    setDate(todayString());
    setPaymentType('cash');
    if (services.length > 0) setServiceType(services[0].name);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const finalDescription = description.trim() || `${serviceType || 'General'} job`;
    if (!amount || Number(amount) <= 0 || !serviceType) return;
    onAddEntry({ description: finalDescription, amount, date, serviceType, paymentType });
    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} style={{ ...s.form, gap: compact ? '10px' : '12px' }}>
      {compact ? (
        <div style={s.row2}>
          <Field label="Service type" id="ef-svc">
            <select id="ef-svc" name="ef-svc" value={serviceType}
              onChange={e => setServiceType(e.target.value)} style={s.input}>
              {services.map(sv => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
            </select>
          </Field>
          <Field label="Amount ($)" id="ef-amt">
            <input id="ef-amt" name="ef-amt" type="number" placeholder="0.00"
              value={amount} onChange={e => setAmount(e.target.value)}
              style={s.input} min="0.01" step="0.01" autoComplete="off" required />
          </Field>
        </div>
      ) : (
        <>
          <Field label="Service type" id="ef-svc">
            <select id="ef-svc" name="ef-svc" value={serviceType}
              onChange={e => setServiceType(e.target.value)} style={s.input}>
              {services.map(sv => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
            </select>
          </Field>
          <Field label="Description" id="ef-desc">
            <input id="ef-desc" name="ef-desc" type="text"
              placeholder="e.g. 2 tires fitted for Honda"
              value={description} onChange={e => setDescription(e.target.value)}
              style={s.input} autoComplete="off" required />
          </Field>
          <div style={s.row2}>
            <Field label="Amount ($)" id="ef-amt">
              <input id="ef-amt" name="ef-amt" type="number" placeholder="0.00"
                value={amount} onChange={e => setAmount(e.target.value)}
                style={s.input} min="0.01" step="0.01" autoComplete="off" required />
            </Field>
            <Field label="Date" id="ef-date">
              <input id="ef-date" name="ef-date" type="date" value={date}
                onChange={e => setDate(e.target.value)} style={s.input} />
            </Field>
          </div>
        </>
      )}

      {compact && (
        <div style={s.row2}>
          <Field label="Date" id="ef-date-compact">
            <input id="ef-date-compact" name="ef-date-compact" type="date" value={date}
              onChange={e => setDate(e.target.value)} style={s.input} />
          </Field>
          <Field label="Description (optional)" id="ef-desc-compact">
            <input id="ef-desc-compact" name="ef-desc-compact" type="text"
              placeholder="Optional note"
              value={description} onChange={e => setDescription(e.target.value)}
              style={s.input} autoComplete="off" />
          </Field>
        </div>
      )}

      <Field label="Payment method" id="ef-payment">
        <div style={s.pills}>
          {PAYMENT_TYPES.map(p => {
            const active = paymentType === p.value;
            return (
              <button key={p.value} type="button"
                onClick={() => setPaymentType(p.value)}
                style={{
                  ...s.pill,
                  background: active ? p.bg : C.surface,
                  color: active ? p.color : C.muted,
                  border: `1.5px solid ${active ? p.border : C.border}`,
                  fontWeight: active ? '700' : '500',
                }}>
                {p.label}
              </button>
            );
          })}
        </div>
      </Field>

      <button type="submit"
        style={{ ...s.btn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
        disabled={submitting}>
        {submitting ? 'Saving...' : (submitLabel || (compact ? '+ Quick Add Income' : '+ Add Income'))}
      </button>
    </form>
  );
}

function Field({ label, id, children }) {
  return (
    <div style={s.field}>
      <label htmlFor={id} style={s.label}>{label}</label>
      {children}
    </div>
  );
}

const s = {
  form:  { display: 'flex', flexDirection: 'column' },
  row2:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '13px', background: C.surface, outline: 'none', color: C.black, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },
  pills: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  pill:  { padding: '6px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", border: `1.5px solid ${C.border}`, transition: 'all 0.1s' },
  btn:   { padding: '11px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, fontWeight: '700', fontSize: '14px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
};
