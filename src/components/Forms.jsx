import { useState, useEffect } from 'react';
    import { C } from './styles';

    // ── Shared ────────────────────────────────────────────────────────────────────

    function Field({ label, id, children }) {
    return (
        <div style={s.field}>
        <label htmlFor={id} style={s.label}>{label}</label>
        {children}
        </div>
    );
    }

    const s = {
    form:      { display: 'flex', flexDirection: 'column', gap: '12px' },
    row2:      { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    field:     { display: 'flex', flexDirection: 'column', gap: '5px' },
    label:     { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input:     { padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '13px', background: C.surface, outline: 'none', color: C.black, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },
    btn:       { padding: '11px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, fontWeight: '700', fontSize: '14px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
    hint:      { fontSize: '12px', color: C.muted, background: C.surface, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 12px', lineHeight: '1.5' },
    inlineRow: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
    srOnly:    { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 },
    };

    // ── Partners form ─────────────────────────────────────────────────────────────

    export function PartnersForm({ onAddPartner, submitting }) {
    const [name, setName]     = useState('');
    const [equity, setEquity] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim() || !equity) return;
        onAddPartner({ name, equityPct: equity });
        setName('');
        setEquity('');
    }

    return (
        <form onSubmit={handleSubmit} style={s.form}>
        <p style={s.hint}>
            Add each business owner with their ownership %. All partners should total 100%.
        </p>
        <div style={s.row2}>
            <Field label="Partner name" id="pf-name">
            <input
                id="pf-name" name="pf-name" type="text"
                placeholder="e.g. Mike"
                value={name} onChange={e => setName(e.target.value)}
                style={s.input} autoComplete="off" required
            />
            </Field>
            <Field label="Equity %" id="pf-equity">
            <input
                id="pf-equity" name="pf-equity" type="number"
                placeholder="50"
                value={equity} onChange={e => setEquity(e.target.value)}
                style={s.input} min="1" max="100" step="1" autoComplete="off" required
            />
            </Field>
        </div>
        <button
            type="submit"
            style={{ ...s.btn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
        >
            {submitting ? 'Adding...' : '+ Add Partner'}
        </button>
        </form>
    );
    }

    // ── Services form ─────────────────────────────────────────────────────────────

    export function ServicesForm({ onAddService, submitting }) {
    const [name, setName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;
        onAddService(name);
        setName('');
    }

    return (
        <form onSubmit={handleSubmit} style={{ ...s.form, marginBottom: '4px' }}>
        <div style={s.inlineRow}>
            <div style={{ flex: 1 }}>
            <label htmlFor="svf-name" style={s.srOnly}>Service name</label>
            <input
                id="svf-name" name="svf-name" type="text"
                placeholder="e.g. Oil Change, Tire Rotation..."
                value={name} onChange={e => setName(e.target.value)}
                style={s.input} autoComplete="off" required
            />
            </div>
            <button
            type="submit"
            style={{ ...s.btn, padding: '10px 18px', flexShrink: 0, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
            >
            {submitting ? '...' : 'Add'}
            </button>
        </div>
        </form>
    );
    }

    // ── Settings form ─────────────────────────────────────────────────────────────

    const CATEGORIES = [
    'Tire Shop', 'Auto Repair', 'Oil Change',
    'Car Wash', 'Battery Shop', 'Brake & Exhaust', 'Other Auto',
    ];

    export const CURRENCIES = [
    { value: 'USD', symbol: '$',   label: 'USD ($) — US Dollar' },
    { value: 'INR', symbol: '₹',   label: 'INR (₹) — Indian Rupee' },
    { value: 'GBP', symbol: '£',   label: 'GBP (£) — British Pound' },
    { value: 'EUR', symbol: '€',   label: 'EUR (€) — Euro' },
    { value: 'AED', symbol: 'د.إ', label: 'AED (د.إ) — UAE Dirham' },
    { value: 'MXN', symbol: '$',   label: 'MXN ($) — Mexican Peso' },
    ];

    export function SettingsForm({ shop, onSaveShop, submitting }) {
    const [name, setName]         = useState(shop?.name || '');
    const [category, setCategory] = useState(shop?.category || '');
    const [location, setLocation] = useState(shop?.location || '');
    const [currency, setCurrency] = useState(shop?.currency || 'USD');

    // FIX 1: Was incorrectly using useState instead of useEffect.
    // This means fields were always empty when navigating to Settings.
    useEffect(() => {
        setName(shop?.name || '');
        setCategory(shop?.category || '');
        setLocation(shop?.location || '');
        setCurrency(shop?.currency || 'USD');
    }, [shop]);

    function handleSubmit(e) {
        e.preventDefault();
        onSaveShop({ name, category, location, currency });
    }

    return (
        <form onSubmit={handleSubmit} style={s.form}>
        <Field label="Business name" id="sf-name">
            <input
            id="sf-name" name="sf-name" type="text"
            placeholder="e.g. Mike's Tire & Auto"
            value={name} onChange={e => setName(e.target.value)}
            style={s.input} autoComplete="organization" required
            />
        </Field>

        <div style={s.row2}>
            <Field label="Business type" id="sf-cat">
            <select
                id="sf-cat" name="sf-cat"
                value={category} onChange={e => setCategory(e.target.value)}
                style={s.input}
            >
                <option value="">Select type...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            </Field>
            <Field label="Location (optional)" id="sf-loc">
            <input
                id="sf-loc" name="sf-loc" type="text"
                placeholder="City, State"
                value={location} onChange={e => setLocation(e.target.value)}
                style={s.input} autoComplete="street-address"
            />
            </Field>
        </div>

        <Field label="Currency" id="sf-currency">
            <select id="sf-currency" name="sf-currency" value={currency} onChange={e => setCurrency(e.target.value)} style={s.input}>
            {CURRENCIES.map(cur => <option key={cur.value} value={cur.value}>{cur.label}</option>)}
            </select>
        </Field>

        <button
            type="submit"
            style={{ ...s.btn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
        >
            {submitting ? 'Saving...' : 'Save settings'}
        </button>
        </form>
    );
    }