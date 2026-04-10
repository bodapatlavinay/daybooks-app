    import { useEffect, useState } from 'react';
    import { formStyles } from './styles';

    function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    }

    const CATEGORIES = [
    { value: 'inventory', label: 'Inventory / Stock' },
    { value: 'rent',      label: 'Rent / Lease' },
    { value: 'labor',     label: 'Labor / Wages' },
    { value: 'utility',   label: 'Utility / Fuel' },
    { value: 'misc',      label: 'Miscellaneous' },
    ];

    export default function ExpenseForm({ onAddExpense, partners = [], currentUserEmail, submitting }) {
    const [description, setDescription] = useState('');
    const [amount, setAmount]           = useState('');
    const [category, setCategory]       = useState('misc');
    const [date, setDate]               = useState(todayString());
    const [paidBy, setPaidBy]           = useState('');

    useEffect(() => { setPaidBy(currentUserEmail || ''); }, [currentUserEmail]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!description.trim() || !amount || Number(amount) <= 0) return;
        onAddExpense({ description, amount, category, date, paidBy });
        setDescription('');
        setAmount('');
        setCategory('misc');
        setDate(todayString());
        setPaidBy(currentUserEmail || '');
    }

    return (
        <form onSubmit={handleSubmit} style={formStyles.formSection}>
        <h3 style={s.title}>Add Expense</h3>

        <div style={s.field}>
            <label htmlFor="exp-desc" style={s.label}>Description</label>
            <input
            id="exp-desc"
            name="exp-desc"
            type="text"
            placeholder="e.g. Bought 10 tires from supplier"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={formStyles.input}
            autoComplete="off"
            required
            />
        </div>

        <div style={s.field}>
            <label htmlFor="exp-amount" style={s.label}>Amount ($)</label>
            <input
            id="exp-amount"
            name="exp-amount"
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
            <label htmlFor="exp-category" style={s.label}>Category</label>
            <select
            id="exp-category"
            name="exp-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={formStyles.input}
            >
            {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
            ))}
            </select>
        </div>

        <div style={s.field}>
            <label htmlFor="exp-paid-by" style={s.label}>Paid By</label>
            <select
            id="exp-paid-by"
            name="exp-paid-by"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            style={formStyles.input}
            >
            <option value={currentUserEmail || ''}>Me ({currentUserEmail || 'Owner'})</option>
            {partners.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
            ))}
            </select>
        </div>

        <div style={s.field}>
            <label htmlFor="exp-date" style={s.label}>Date</label>
            <input
            id="exp-date"
            name="exp-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={formStyles.input}
            />
        </div>

        <button
            type="submit"
            style={{ ...formStyles.button, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
        >
            {submitting ? 'Saving...' : 'Add Expense'}
        </button>
        </form>
    );
    }

    const s = {
    title: { margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#111' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    };