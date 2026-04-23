    import { C } from './styles';
    import { paymentLabel } from './EntryForm';
    import { useMemo, useState } from 'react';

    function cents(n) {
    return Math.round(Number(n || 0) * 100);
    }

    function money(c) {
    return `$${(Number(c || 0) / 100).toFixed(2)}`;
    }

    export default function CloseDayModal({ entries = [], expenses = [], date, onClose, onConfirm, submitting }) {
    const [actualCash, setActualCash] = useState('');
    const [notes, setNotes] = useState('');

    const summary = useMemo(() => {
        const dayEntries = entries.filter(e => e.entry_date === date);
        const dayExpenses = expenses.filter(e => e.expense_date === date);
        const byPayment = dayEntries.reduce((acc, item) => {
        const key = item.payment_type || 'cash';
        acc[key] = (acc[key] || 0) + cents(item.amount);
        return acc;
        }, {});
        const totalIncome = dayEntries.reduce((s, e) => s + cents(e.amount), 0);
        const totalExpense = dayExpenses.reduce((s, e) => s + cents(e.amount), 0);
        return { byPayment, totalIncome, totalExpense, expectedCash: byPayment.cash || 0 };
    }, [entries, expenses, date]);

    const actualCashCents = cents(actualCash || 0);
    const diff = actualCash ? actualCashCents - summary.expectedCash : 0;

    return (
        <div style={s.backdrop}>
        <div style={s.modal}>
            <div style={s.head}>
            <div>
                <div style={s.title}>Close Day</div>
                <div style={s.sub}>Freeze the day, reconcile cash, and save a permanent close record for {date}.</div>
            </div>
            </div>

            <div style={s.summaryGrid}>
            <Stat label="Income" value={money(summary.totalIncome)} positive />
            <Stat label="Expenses" value={money(summary.totalExpense)} />
            <Stat label="Expected cash" value={money(summary.expectedCash)} positive />
            <Stat label="Net" value={money(summary.totalIncome - summary.totalExpense)} positive={(summary.totalIncome - summary.totalExpense) >= 0} />
            </div>

            <div style={s.table}>
            {Object.entries(summary.byPayment).length === 0 ? (
                <div style={s.empty}>No income entries for this day yet.</div>
            ) : Object.entries(summary.byPayment).map(([key, value]) => (
                <div key={key} style={s.row}>
                <span>{paymentLabel(key)}</span>
                <strong>{money(value)}</strong>
                </div>
            ))}
            </div>

            <div style={s.row2}>
            <Field label="Actual cash counted" id="close-actual-cash">
                <input id="close-actual-cash" type="number" min="0" step="0.01" inputMode="decimal" value={actualCash}
                onChange={e => setActualCash(e.target.value)} style={s.input} placeholder="0.00" />
            </Field>
            <Field label="Difference" id="close-diff">
                <div id="close-diff" style={{ ...s.diffBox, color: diff === 0 ? C.dark : diff > 0 ? C.greenText : C.red }}>
                {actualCash ? `${diff >= 0 ? '+' : '-'}${money(Math.abs(diff))}` : 'Enter cash count'}
                </div>
            </Field>
            </div>

            <Field label="Close notes" id="close-notes">
            <textarea id="close-notes" value={notes} onChange={e => setNotes(e.target.value)} style={{ ...s.input, minHeight: '72px', resize: 'vertical' }} placeholder="Anything unusual about today?" />
            </Field>

            <div style={s.actions}>
            <button style={s.secondaryBtn} onClick={onClose}>Cancel</button>
            <button
                style={{ ...s.primaryBtn, opacity: actualCash === '' || submitting ? 0.6 : 1, cursor: actualCash === '' || submitting ? 'not-allowed' : 'pointer' }}
                onClick={() => onConfirm({ actualCashCents, notes, summary })}
                disabled={actualCash === '' || submitting}
            >
                {submitting ? 'Closing...' : 'Close day'}
            </button>
            </div>
        </div>
        </div>
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

    function Stat({ label, value, positive }) {
    return (
        <div style={s.stat}>
        <div style={s.statLabel}>{label}</div>
        <div style={{ ...s.statValue, color: positive ? C.greenText : C.dark }}>{value}</div>
        </div>
    );
    }

    const s = {
    backdrop: { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 999 },
    modal: { width: '100%', maxWidth: '720px', background: C.white, borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 24px 80px rgba(0,0,0,0.24)' },
    head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: '18px', fontWeight: '900', color: C.dark },
    sub: { fontSize: '13px', color: C.muted, marginTop: '4px', lineHeight: '1.6' },
    summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' },
    stat: { border: `1px solid ${C.border}`, background: C.surface, borderRadius: '12px', padding: '12px' },
    statLabel: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase' },
    statValue: { fontSize: '18px', fontWeight: '900', marginTop: '6px' },
    table: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${C.border}`, padding: '10px 12px', borderRadius: '10px' },
    empty: { background: C.bg, color: C.muted, padding: '12px', borderRadius: '10px' },
    row2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' },
    field: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase' },
    input: { padding: '11px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: C.surface, outline: 'none', fontFamily: "'Outfit', sans-serif" },
    diffBox: { minHeight: '45px', display: 'flex', alignItems: 'center', padding: '11px 12px', borderRadius: '8px', border: `1.5px dashed ${C.border}`, background: C.bg, fontWeight: '800' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
    secondaryBtn: { padding: '11px 14px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.white, color: C.dark, fontWeight: '700', cursor: 'pointer' },
    primaryBtn: { padding: '11px 14px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, fontWeight: '800', cursor: 'pointer' },
    };
