import { C } from './styles';

export default function SettlementCard({ partners, expenses = [], entries = [] }) {
  if (!partners.length) return null;

  const totalExp = expenses.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalIncome = entries.reduce((s, i) => s + Number(i.amount || 0), 0);
  const paidMap  = {};
  expenses.forEach(e => {
    const k = (e.paid_by || '').trim().toLowerCase();
    paidMap[k] = (paidMap[k] || 0) + Number(e.amount || 0);
  });
  const eqTotal = partners.reduce((s, p) => s + Number(p.equity_pct || 0), 0);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>Partner Settlement</span>
        <span style={s.totalLabel}>All time · ${totalIncome.toFixed(2)} income · ${totalExp.toFixed(2)} expenses</span>
      </div>

      {Math.abs(eqTotal - 100) > 0.01 && (
        <div style={s.warning}>⚠ Equity totals {eqTotal.toFixed(0)}% — should be 100%</div>
      )}

      {partners.map(p => {
        const equity = Number(p.equity_pct || 0);
        const fairExpenseShare = (totalExp * equity) / 100;
        const incomeShare = (totalIncome * equity) / 100;
        const paid = paidMap[p.name.trim().toLowerCase()] || 0;
        const reimbursementBalance = paid - fairExpenseShare;
        const netEntitlement = incomeShare - fairExpenseShare;
        const reimbursementPositive = reimbursementBalance >= 0;
        const netPositive = netEntitlement >= 0;

        return (
          <div key={p.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{p.name.charAt(0).toUpperCase()}</div>
              <div style={s.info}>
                <span style={s.name}>{p.name}</span>
                <span style={s.stake}>{equity.toFixed(0)}% ownership</span>
              </div>
              <div style={{ ...s.badge, color: reimbursementPositive ? C.greenText : C.red, background: reimbursementPositive ? C.greenBg : C.redLight, border: `1px solid ${reimbursementPositive ? C.greenBorder : C.redMid}` }}>
                {reimbursementPositive ? 'To Receive' : 'To Contribute'}
              </div>
            </div>
            <div style={s.rows}>
              <div style={s.statRow}>
                <span style={s.statLabel}>Income share</span>
                <span style={{ ...s.statVal, color: C.greenText }}>${incomeShare.toFixed(2)}</span>
              </div>
              <div style={s.statRow}>
                <span style={s.statLabel}>Expenses paid</span>
                <span style={s.statVal}>${paid.toFixed(2)}</span>
              </div>
              <div style={s.statRow}>
                <span style={s.statLabel}>Fair expense share</span>
                <span style={s.statVal}>${fairExpenseShare.toFixed(2)}</span>
              </div>
              <div style={{ ...s.statRow, borderTop: `1px solid ${C.border}`, paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ ...s.statLabel, fontWeight: '700', color: C.dark }}>Expense settlement</span>
                <span style={{ ...s.statVal, fontWeight: '800', color: reimbursementPositive ? C.greenText : C.red }}>
                  {reimbursementPositive ? '+' : '-'}${Math.abs(reimbursementBalance).toFixed(2)}
                </span>
              </div>
              <div style={{ ...s.statRow, borderTop: `1px dashed ${C.border}`, paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ ...s.statLabel, fontWeight: '700', color: C.dark }}>Net entitlement</span>
                <span style={{ ...s.statVal, fontWeight: '900', color: netPositive ? C.greenText : C.red }}>
                  {netPositive ? '+' : '-'}${Math.abs(netEntitlement).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <p style={s.note}>Income share is based on all recorded income. Expense settlement is based on all recorded expenses regardless of date filter.</p>
    </div>
  );
}

const s = {
  wrap:   { display: 'flex', flexDirection: 'column', gap: '10px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0', gap: '10px', flexWrap: 'wrap' },
  title:  { fontSize: '13px', fontWeight: '700', color: C.dark },
  totalLabel: { fontSize: '11px', color: C.muted },
  warning: { background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '600' },
  card: {
    background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px',
    padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
  cardTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar: { width: '34px', height: '34px', background: C.dark, color: C.white, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 },
  info:   { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  name:   { fontSize: '14px', fontWeight: '700', color: C.dark },
  stake:  { fontSize: '11px', color: C.muted },
  badge:  { fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px' },
  rows:   { display: 'flex', flexDirection: 'column', gap: '6px' },
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '10px' },
  statLabel: { color: C.muted },
  statVal:   { fontWeight: '600', color: C.dark },
  note: { fontSize: '11px', color: C.faint, margin: 0, textAlign: 'center' },
};
