    import { C } from './styles';

    export default function SummaryCard({ totalIncome, totalExpense, profit }) {
    const profitPos = profit >= 0;
    return (
        <div style={s.wrap}>
        <Row label="Total Income" value={`$${totalIncome.toFixed(2)}`} valueColor={C.green} />
        <Row label="Total Expenses" value={`$${totalExpense.toFixed(2)}`} valueColor={C.red} />
        <div style={s.divider} />
        <div style={s.profitRow}>
            <span style={s.profitLabel}>Net Profit</span>
            <span style={{ ...s.profitValue, color: profitPos ? C.green : C.red }}>
            {profitPos ? '+' : ''}${profit.toFixed(2)}
            </span>
        </div>
        </div>
    );
    }

    function Row({ label, value, valueColor }) {
    return (
        <div style={s.row}>
        <span style={s.label}>{label}</span>
        <span style={{ ...s.value, color: valueColor }}>{value}</span>
        </div>
    );
    }

    const s = {
    wrap: {
        background: C.white, borderRadius: '12px',
        border: `1px solid ${C.border}`,
        padding: '20px',
        display: 'flex', flexDirection: 'column', gap: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    row:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontSize: '13px', color: C.mid, fontWeight: '500' },
    value: { fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px' },
    divider: { height: '1px', background: C.border },
    profitRow:   { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    profitLabel: { fontSize: '13px', fontWeight: '700', color: C.dark },
    profitValue: { fontSize: '20px', fontWeight: '900', letterSpacing: '-0.5px' },
    };