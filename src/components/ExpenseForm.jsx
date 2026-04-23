import { useEffect, useState } from 'react';
import { C } from './styles';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const CATEGORIES = [
  { value: 'inventory', label: 'Inventory / Stock' },
  { value: 'rent', label: 'Rent / Lease' },
  { value: 'labor', label: 'Labor / Wages' },
  { value: 'utility', label: 'Utility / Fuel' },
  { value: 'misc', label: 'Miscellaneous' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'check', label: 'Check' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'ach', label: 'ACH' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseForm({
  onAddExpense,
  partners = [],
  currentUserEmail,
  submitting,
}) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('misc');
  const [date, setDate] = useState(todayString());
  const [paidBy, setPaidBy] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [notes, setNotes] = useState('');
  const [receiptUrl, setReceiptUrl] = useState('');

  useEffect(() => {
    setPaidBy(currentUserEmail || '');
  }, [currentUserEmail]);

  function resetForm() {
    setDescription('');
    setAmount('');
    setCategory('misc');
    setDate(todayString());
    setPaidBy(currentUserEmail || '');
    setVendorName('');
    setPaymentMethod('cash');
    setNotes('');
    setReceiptUrl('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!description.trim() || !amount || Number(amount) <= 0) return;

    onAddExpense?.({
      description: description.trim(),
      amount,
      category,
      date,
      paidBy,
      vendorName: vendorName.trim() || null,
      paymentMethod,
      notes: notes.trim() || null,
      receiptUrl: receiptUrl.trim() || null,
    });

    resetForm();
  }

  return (
    <form onSubmit={handleSubmit} style={s.form} name="expense-form">
      <Field label="Description" id="xf-desc">
        <input
          id="xf-desc"
          name="xf-desc"
          type="text"
          placeholder="e.g. Bought 10 tires from supplier"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={s.input}
          autoComplete="off"
          required
        />
      </Field>

      <div style={s.row2}>
        <Field label="Amount ($)" id="xf-amt">
          <input
            id="xf-amt"
            name="xf-amt"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={s.input}
            min="0.01"
            step="0.01"
            inputMode="decimal"
            autoComplete="off"
            required
          />
        </Field>

        <Field label="Category" id="xf-cat">
          <select
            id="xf-cat"
            name="xf-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={s.input}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div style={s.row2}>
        <Field label="Vendor" id="xf-vendor">
          <input
            id="xf-vendor"
            name="xf-vendor"
            type="text"
            placeholder="e.g. AutoZone"
            value={vendorName}
            onChange={(e) => setVendorName(e.target.value)}
            style={s.input}
            autoComplete="organization"
          />
        </Field>

        <Field label="Payment method" id="xf-method">
          <select
            id="xf-method"
            name="xf-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={s.input}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div style={s.row2}>
        <Field label="Paid by" id="xf-paid">
          <select
            id="xf-paid"
            name="xf-paid"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            style={s.input}
          >
            <option value={currentUserEmail || ''}>Me</option>
            {partners.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date" id="xf-date">
          <input
            id="xf-date"
            name="xf-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={s.input}
          />
        </Field>
      </div>

      <Field label="Receipt URL (optional for now)" id="xf-receipt">
        <input
          id="xf-receipt"
          name="xf-receipt"
          type="url"
          placeholder="https://..."
          value={receiptUrl}
          onChange={(e) => setReceiptUrl(e.target.value)}
          style={s.input}
          autoComplete="url"
        />
      </Field>

      <Field label="Notes" id="xf-notes">
        <textarea
          id="xf-notes"
          name="xf-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={s.textarea}
          placeholder="Anything to remember for taxes or disputes"
          rows={3}
        />
      </Field>

      <button
        type="submit"
        style={{
          ...s.btn,
          opacity: submitting ? 0.7 : 1,
          cursor: submitting ? 'not-allowed' : 'pointer',
        }}
        disabled={submitting}
      >
        {submitting ? 'Saving...' : '+ Add Expense'}
      </button>
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
    gap: '12px',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
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
    minHeight: '72px',
    resize: 'vertical',
  },

  btn: {
    padding: '11px',
    borderRadius: '8px',
    border: 'none',
    background: C.red,
    color: C.white,
    fontWeight: '700',
    fontSize: '14px',
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
  },
};