    import { useEffect, useState } from 'react';
    import { formStyles } from './styles';

    function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    export default function EntryForm({ onAddEntry, services = [], submitting }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(todayString());
    const [serviceType, setServiceType] = useState('');

    useEffect(() => {
        if (services.length > 0 && !serviceType) {
        setServiceType(services[0].name);
        }
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

    const noServices = services.length === 0;

    return (
        <form onSubmit={handleSubmit} style={formStyles.formSection}>
        <h3 style={s.title}>Add Income Entry</h3>

        <div style={s.field}>
            <label htmlFor="entry-service" style={s.label}>Service Type</label>
            <select
            id="entry-service"
            name="entry-service"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            style={formStyles.input}
            disabled={noServices}
            >
            {noServices
                ? <option value="">No services — add in Settings first</option>
                : services.map((sv) => (
                    <option key={sv.id} value={sv.name}>{sv.name}</option>
                ))}
            </select>
        </div>

        <div style={s.field}>
            <label htmlFor="entry-desc" style={s.label}>Description</label>
            <input
            id="entry-desc"
            name="entry-desc"
            type="text"
            placeholder="e.g. 2 tires fitted for Honda Civic"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={formStyles.input}
            autoComplete="off"
            required
            />
        </div>

        <div style={s.field}>
            <label htmlFor="entry-amount" style={s.label}>Amount ($)</label>
            <input
            id="entry-amount"
            name="entry-amount"
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={formStyles.input}
            min="0.01"
            step="0.01"
            autoComplete="off"
            required
            />
        </div>

        <div style={s.field}>
            <label htmlFor="entry-date" style={s.label}>Date</label>
            <input
            id="entry-date"
            name="entry-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={formStyles.input}
            />
        </div>

        <button
            type="submit"
            style={{ ...formStyles.button, opacity: (noServices || submitting) ? 0.6 : 1, cursor: (noServices || submitting) ? 'not-allowed' : 'pointer' }}
            disabled={noServices || submitting}
        >
            {submitting ? 'Saving...' : 'Add Income'}
        </button>

        {noServices && (
            <p style={s.hint}>Go to Settings → Service Types to add your first service.</p>
        )}
        </form>
    );
    }

    const s = {
    title: { margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#111' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    hint: { margin: 0, fontSize: '12px', color: '#c80815', background: '#fff0f0', border: '1px solid #fccaca', borderRadius: '8px', padding: '8px 12px' },
    };