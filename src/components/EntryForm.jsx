import { useEffect, useState } from 'react';
import { C } from './styles';

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

export default function EntryForm({ onAddEntry, services = [], submitting }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount]           = useState('');
  const [date, setDate]               = useState(todayString());
  const [serviceType, setServiceType] = useState('');

  useEffect(() => {
    if (services.length > 0 && !serviceType) setServiceType(services[0].name);
  }, [services]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim() || !amount || Number(amount) <= 0) return;
    onAddEntry({ description, amount, date, serviceType });
    setDescription('');
    setAmount('');
    setDate(todayString());
    if (services.length > 0) setServiceType(services[0].name);
  }

  return (
    <form onSubmit={handleSubmit} style={s.form}>
      <Field label="Service type" id="ef-svc">
        <select id="ef-svc" name="ef-svc" value={serviceType} onChange={(e) => setServiceType(e.target.value)} style={s.input}>
          {services.map((sv) => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
        </select>
      </Field>

      <Field label="Description" id="ef-desc">
        <input id="ef-desc" name="ef-desc" type="text" placeholder="e.g. 2 tires fitted for Honda" value={description} onChange={(e) => setDescription(e.target.value)} style={s.input} autoComplete="off" required />
      </Field>

      <div style={s.row2}>
        <Field label="Amount ($)" id="ef-amt">
          <input id="ef-amt" name="ef-amt" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} style={s.input} min="0.01" step="0.01" autoComplete="off" required />
        </Field>
        <Field label="Date" id="ef-date">
          <input id="ef-date" name="ef-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.input} />
        </Field>
      </div>

      <button type="submit" style={{ ...s.btn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }} disabled={submitting}>
        {submitting ? 'Saving...' : '+ Add Income'}
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
  form:  { display: 'flex', flexDirection: 'column', gap: '12px' },
  row2:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '13px', background: C.surface, outline: 'none', color: C.black, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },
  btn:   { padding: '11px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, fontWeight: '700', fontSize: '14px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
};