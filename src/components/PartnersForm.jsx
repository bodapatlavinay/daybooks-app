    import { useState } from 'react';
    import { formStyles } from './styles';

    export default function PartnersForm({ onAddPartner, submitting }) {
    const [name, setName]           = useState('');
    const [equityPct, setEquityPct] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim() || !equityPct) return;
        onAddPartner({ name, equityPct });
        setName('');
        setEquityPct('');
    }

    return (
        <form onSubmit={handleSubmit} style={formStyles.formSection}>
        <h3 style={s.title}>Add Partner</h3>

        <p style={s.hint}>
            Add each business owner with their equity percentage. All partners should total 100%.
        </p>

        <div style={s.field}>
            <label htmlFor="partner-name" style={s.label}>Partner Name</label>
            <input
            id="partner-name"
            name="partner-name"
            type="text"
            placeholder="e.g. Mike, Jason"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={formStyles.input}
            autoComplete="off"
            required
            />
        </div>

        <div style={s.field}>
            <label htmlFor="partner-equity" style={s.label}>Equity %</label>
            <input
            id="partner-equity"
            name="partner-equity"
            type="number"
            placeholder="e.g. 50"
            value={equityPct}
            onChange={(e) => setEquityPct(e.target.value)}
            style={formStyles.input}
            min="1"
            max="100"
            step="1"
            autoComplete="off"
            required
            />
        </div>

        <button
            type="submit"
            style={{ ...formStyles.button, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
        >
            {submitting ? 'Adding...' : 'Add Partner'}
        </button>
        </form>
    );
    }

    const s = {
    title: { margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#111' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    hint: { margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.5', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '10px 12px' },
    };