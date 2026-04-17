import { useState } from 'react';
import { C } from './styles';

const PERIODS = [
  { val: 'week',  label: 'This Week' },
  { val: 'month', label: 'This Month' },
  { val: 'year',  label: 'This Year' },
  { val: 'all',   label: 'All Time' },
];

function inPeriod(dateStr, period) {
  if (period === 'all') return true;
  if (!dateStr) return false;
  const [y, mo, d] = dateStr.split('-').map(Number);
  const item = new Date(y, mo - 1, d);
  const now  = new Date(); now.setHours(0,0,0,0);
  if (period === 'week') {
    const ws = new Date(now); ws.setDate(now.getDate() - now.getDay());
    return item >= ws;
  }
  if (period === 'month') return item >= new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'year')  return item >= new Date(now.getFullYear(), 0, 1);
  return true;
}

export default function SettlementCard({ partners, expenses = [], entries = [] }) {
  const [period, setPeriod] = useState('all');
  if (!partners.length) return null;

  const filteredExp = expenses.filter(e => inPeriod(e.expense_date, period));
  const filteredInc = entries.filter(e  => inPeriod(e.entry_date,   period));
  const totalExp    = filteredExp.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalIncome = filteredInc.reduce((s, i) => s + Number(i.amount || 0), 0);

  const paidMap = {};
  filteredExp.forEach(e => {
    const k = (e.paid_by || '').trim().toLowerCase();
    paidMap[k] = (paidMap[k] || 0) + Number(e.amount || 0);
  });
  const eqTotal = partners.reduce((s, p) => s + Number(p.equity_pct || 0), 0);

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <span style={s.title}>Partner Settlement</span>
        <span style={s.totalLabel}>${totalIncome.toFixed(2)} income · ${totalExp.toFixed(2)} expenses</span>
      </div>

      <div style={s.tabs}>
        {PERIODS.map(p => (
          <button key={p.val} onClick={() => setPeriod(p.val)} style={{
            ...s.tab,
            background: period === p.val ? C.dark : C.white,
            color:      period === p.val ? C.white : C.mid,
            border:     `1px solid ${period === p.val ? C.dark : C.border}`,
            fontWeight: period === p.val ? '700' : '400',
          }}>{p.label}</button>
        ))}
      </div>

      {Math.abs(eqTotal - 100) > 0.01 && (
        <div style={s.warning}>⚠ Equity totals {eqTotal.toFixed(0)}% — should be 100%</div>
      )}

      {partners.map(p => {
        const equity           = Number(p.equity_pct || 0);
        const fairExpShare     = (totalExp * equity) / 100;
        const incomeShare      = (totalIncome * equity) / 100;
        const paid             = paidMap[p.name.trim().toLowerCase()] || 0;
        const reimbBalance     = paid - fairExpShare;
        const netEntitlement   = incomeShare - fairExpShare;
        const reimbPos = reimbBalance >= 0;
        const netPos   = netEntitlement >= 0;

        return (
          <div key={p.id} style={s.card}>
            <div style={s.cardTop}>
              <div style={s.avatar}>{p.name.charAt(0).toUpperCase()}</div>
              <div style={s.info}>
                <span style={s.name}>{p.name}</span>
                <span style={s.stake}>{equity.toFixed(0)}% ownership</span>
              </div>
              <div style={{ ...s.badge, color: reimbPos ? C.greenText : C.red, background: reimbPos ? C.greenBg : C.redLight, border: `1px solid ${reimbPos ? C.greenBorder : C.redMid}` }}>
                {reimbPos ? 'To Receive' : 'To Contribute'}
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
                <span style={s.statVal}>${fairExpShare.toFixed(2)}</span>
              </div>
              <div style={{ ...s.statRow, borderTop: `1px solid ${C.border}`, paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ ...s.statLabel, fontWeight: '700', color: C.dark }}>Expense settlement</span>
                <span style={{ ...s.statVal, fontWeight: '800', color: reimbPos ? C.greenText : C.red }}>
                  {reimbPos ? '+' : '-'}${Math.abs(reimbBalance).toFixed(2)}
                </span>
              </div>
              <div style={{ ...s.statRow, borderTop: `1px dashed ${C.border}`, paddingTop: '8px', marginTop: '2px' }}>
                <span style={{ ...s.statLabel, fontWeight: '700', color: C.dark }}>Net entitlement</span>
                <span style={{ ...s.statVal, fontWeight: '900', color: netPos ? C.greenText : C.red }}>
                  {netPos ? '+' : '-'}${Math.abs(netEntitlement).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <p style={s.note}>Based on {PERIODS.find(p=>p.val===period)?.label.toLowerCase()} data.</p>
    </div>
  );
}

const s = {
  wrap:    { display: 'flex', flexDirection: 'column', gap: '10px' },
  header:  { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '4px 0', gap: '8px', flexWrap: 'wrap' },
  title:   { fontSize: '13px', fontWeight: '700', color: C.dark },
  totalLabel: { fontSize: '11px', color: C.muted },
  tabs:    { display: 'flex', gap: '5px', flexWrap: 'wrap' },
  tab:     { padding: '5px 11px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.12s' },
  warning: { background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, borderRadius: '8px', padding: '8px 12px', fontSize: '12px', fontWeight: '600' },
  card:    { background: C.white, border: `1px solid ${C.border}`, borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '10px' },
  avatar:  { width: '34px', height: '34px', background: C.dark, color: C.white, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '800', flexShrink: 0 },
  info:    { flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' },
  name:    { fontSize: '14px', fontWeight: '700', color: C.dark },
  stake:   { fontSize: '11px', color: C.muted },
  badge:   { fontSize: '11px', fontWeight: '700', padding: '3px 9px', borderRadius: '6px' },
  rows:    { display: 'flex', flexDirection: 'column', gap: '6px' },
  statRow: { display: 'flex', justifyContent: 'space-between', fontSize: '13px', gap: '10px' },
  statLabel: { color: C.muted },
  statVal:   { fontWeight: '600', color: C.dark },
  note:    { fontSize: '11px', color: C.faint, margin: 0, textAlign: 'center' },
};