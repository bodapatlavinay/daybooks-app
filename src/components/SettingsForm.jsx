    import { useEffect, useState } from 'react';
    import { formStyles } from './styles';

    const CATEGORIES = [
    'Tire Shop',
    'Auto Repair',
    'Oil Change',
    'Car Wash',
    'Battery Shop',
    'Brake & Exhaust',
    'Other Auto',
    ];

    export default function SettingsForm({ shop, onSaveShop, submitting }) {
    const [name, setName]         = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        setName(shop?.name || '');
        setCategory(shop?.category || '');
        setLocation(shop?.location || '');
    }, [shop]);

    function handleSubmit(e) {
        e.preventDefault();
        onSaveShop({ name, category, location });
    }

    return (
        <form onSubmit={handleSubmit} style={formStyles.formSection}>
        <h3 style={s.title}>Shop Settings</h3>

        <div style={s.field}>
            <label htmlFor="shop-name" style={s.label}>Business Name</label>
            <input
            id="shop-name"
            name="shop-name"
            type="text"
            placeholder="e.g. Mike's Tire & Auto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={formStyles.input}
            autoComplete="organization"
            required
            />
        </div>

        <div style={s.field}>
            <label htmlFor="shop-category" style={s.label}>Business Type</label>
            <select
            id="shop-category"
            name="shop-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={formStyles.input}
            >
            <option value="">Select type...</option>
            {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
            ))}
            </select>
        </div>

        <div style={s.field}>
            <label htmlFor="shop-location" style={s.label}>Location (optional)</label>
            <input
            id="shop-location"
            name="shop-location"
            type="text"
            placeholder="e.g. 123 Main St, Dallas TX"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            style={formStyles.input}
            autoComplete="street-address"
            />
        </div>

        <button
            type="submit"
            style={{ ...formStyles.button, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
        >
            {submitting ? 'Saving...' : 'Save Settings'}
        </button>
        </form>
    );
    }

    const s = {
    title: { margin: '0 0 4px', fontSize: '15px', fontWeight: '800', color: '#111' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    };