import { useState, useMemo } from 'react';
import { C } from './styles';

// ── Date filter helpers ───────────────────────────────────────────────────────

function getDateRange(period, customFrom, customTo) {
  const now = new Date();
  now.setHours(23, 59, 59, 999);

  if (period === 'custom') {
    return {
      from: customFrom ? new Date(customFrom + 'T00:00:00') : null,
      to:   customTo   ? new Date(customTo   + 'T23:59:59') : null,
      label: customFrom && customTo ? `${customFrom} to ${customTo}` : 'Custom range',
    };
  }

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  if (period === 'today') {
    return { from: start, to: now, label: `Today — ${fmt(start)}` };
  }
  if (period === 'week') {
    start.setDate(start.getDate() - start.getDay());
    return { from: start, to: now, label: `This Week (${fmt(start)} – ${fmt(now)})` };
  }
  if (period === 'month') {
    start.setDate(1);
    return { from: start, to: now, label: `This Month — ${start.toLocaleString('default', { month: 'long', year: 'numeric' })}` };
  }
  if (period === 'lastmonth') {
    const s = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const e = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return { from: s, to: e, label: `Last Month — ${s.toLocaleString('default', { month: 'long', year: 'numeric' })}` };
  }
  if (period === 'year') {
    start.setMonth(0); start.setDate(1);
    return { from: start, to: now, label: `This Year — ${now.getFullYear()}` };
  }
  if (period === 'lastyear') {
    const s = new Date(now.getFullYear() - 1, 0, 1);
    const e = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    return { from: s, to: e, label: `Last Year — ${now.getFullYear() - 1}` };
  }
  // all
  return { from: null, to: null, label: 'All Time' };
}

function fmt(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function inRange(dateStr, from, to) {
  if (!dateStr) return false;
  if (!from && !to) return true;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  if (from && date < from) return false;
  if (to   && date > to)   return false;
  return true;
}

// ── Print / PDF helper ────────────────────────────────────────────────────────

function printReport(shop, label, income, expenses, totals) {
  const totalIncome  = income.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = expenses.reduce((s, i) => s + Number(i.amount), 0);
  const profit       = totalIncome - totalExpense;

  const rows = (items, type) => items.map(i => `
    <tr>
      <td>${type === 'income' ? (i.entry_date || '') : (i.expense_date || '')}</td>
      <td>${type === 'income' ? (i.service_type || 'General') : (i.category || 'misc')}</td>
      <td>${i.description || ''}</td>
      <td style="text-align:right; color:${type === 'income' ? '#15803D' : '#C80815'}">
        ${type === 'income' ? '+' : '-'}$${Number(i.amount).toFixed(2)}
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head>
<title>DayBooks Report — ${shop}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #1A1A1A; padding: 32px; }
  .header { border-bottom: 3px solid #C80815; padding-bottom: 16px; margin-bottom: 24px; }
  .logo { font-size: 22px; font-weight: 900; color: #C80815; letter-spacing: -0.5px; }
  .shop { font-size: 18px; font-weight: 700; color: #1A1A1A; margin-top: 4px; }
  .period { font-size: 13px; color: #6B6B6B; margin-top: 4px; }
  .summary { display: flex; gap: 16px; margin-bottom: 28px; }
  .stat { flex: 1; border: 1px solid #E8E6E1; border-radius: 8px; padding: 14px 16px; }
  .stat-label { font-size: 11px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 6px; }
  .stat-value { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
  .green { color: #15803D; } .red { color: #C80815; } .dark { color: #1A1A1A; }
  h2 { font-size: 14px; font-weight: 700; color: #1A1A1A; margin: 24px 0 10px; padding-bottom: 6px; border-bottom: 1px solid #E8E6E1; text-transform: uppercase; letter-spacing: 0.6px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
  th { font-size: 11px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; background: #F7F6F3; }
  td { padding: 9px 10px; border-bottom: 1px solid #F0EEE9; font-size: 12px; }
  tr:last-child td { border-bottom: none; }
  .total-row td { font-weight: 700; background: #F7F6F3; font-size: 13px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #E8E6E1; font-size: 11px; color: #9E9E9E; display: flex; justify-content: space-between; }
  @media print { body { padding: 16px; } }
</style>
</head><body>
<div class="header">
  <div class="logo">DayBooks</div>
  <div class="shop">${shop}</div>
  <div class="period">Report Period: ${label}</div>
  <div class="period">Generated: ${new Date().toLocaleString()}</div>
</div>

<div class="summary">
  <div class="stat"><div class="stat-label">Total Income</div><div class="stat-value green">$${totalIncome.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Total Expenses</div><div class="stat-value red">$${totalExpense.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Net Profit</div><div class="stat-value ${profit >= 0 ? 'green' : 'red'}">${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Transactions</div><div class="stat-value dark">${income.length + expenses.length}</div></div>
</div>

<h2>Income Entries (${income.length})</h2>
<table>
  <thead><tr><th>Date</th><th>Service</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${rows(income, 'income')}
    <tr class="total-row">
      <td colspan="3">Total Income</td>
      <td style="text-align:right; color:#15803D">+$${totalIncome.toFixed(2)}</td>
    </tr>
  </tbody>
</table>

<h2>Expenses (${expenses.length})</h2>
<table>
  <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${rows(expenses, 'expense')}
    <tr class="total-row">
      <td colspan="3">Total Expenses</td>
      <td style="text-align:right; color:#C80815">-$${totalExpense.toFixed(2)}</td>
    </tr>
  </tbody>
</table>

<h2>Summary</h2>
<table>
  <tbody>
    <tr><td>Total Income</td><td style="text-align:right; color:#15803D; font-weight:700">+$${totalIncome.toFixed(2)}</td></tr>
    <tr><td>Total Expenses</td><td style="text-align:right; color:#C80815; font-weight:700">-$${totalExpense.toFixed(2)}</td></tr>
    <tr class="total-row"><td>Net Profit / Loss</td><td style="text-align:right; color:${profit >= 0 ? '#15803D' : '#C80815'}; font-weight:900; font-size:15px">${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</td></tr>
  </tbody>
</table>

<div class="footer">
  <span>DayBooks — Daily Shop Ledger</span>
  <span>Printed ${new Date().toLocaleDateString()}</span>
</div>
</body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 500);
}

// ── CSV download ──────────────────────────────────────────────────────────────

// function downloadCSV(entries, expenses, label, shopName) {
//   const rows = [];
//   entries.forEach(e => rows.push({
//     Type: 'Income', Date: e.entry_date, Description: e.description,
//     Service: e.service_type || 'General', Amount: Number(e.amount).toFixed(2),
//     Category: '', PaidBy: '',
//   }));
//   expenses.forEach(e => rows.push({
//     Type: 'Expense', Date: e.expense_date, Description: e.description,
//     Service: '', Amount: Number(e.amount).toFixed(2),
//     Category: e.category || 'misc', PaidBy: e.paid_by || '',
//   }));
//   rows.sort((a, b) => b.Date.localeCompare(a.Date));

//   const header = Object.keys(rows[0] || {}).join(',');
//   const body   = rows.map(r =>
//     Object.values(r).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')
//   ).join('\n');

//   const safe = shopName.replace(/[^a-z0-9]/gi, '_');
//   const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
//   const url  = URL.createObjectURL(blob);
//   const a    = document.createElement('a');
//   a.href = url; a.download = `DayBooks_${safe}_${label.replace(/[^a-z0-9]/gi,'_')}.csv`;
//   a.click();
//   URL.revokeObjectURL(url);
// }

// ── Component ─────────────────────────────────────────────────────────────────

const PERIODS = [
  { val: 'today',     label: 'Today' },
  { val: 'week',      label: 'This Week' },
  { val: 'month',     label: 'This Month' },
  { val: 'lastmonth', label: 'Last Month' },
  { val: 'year',      label: 'This Year' },
  { val: 'lastyear',  label: 'Last Year' },
  { val: 'all',       label: 'All Time' },
  { val: 'custom',    label: 'Custom' },
];

export default function ReportsCard({ entries: allEntries, expenses: allExpenses, shopName, shop }) {
  const [period, setPeriod]     = useState('month');
  const [customFrom, setFrom]   = useState('');
  const [customTo, setTo]       = useState('');

  const range = useMemo(() => getDateRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const entries  = useMemo(() => allEntries.filter(i  => inRange(i.entry_date,   range.from, range.to)), [allEntries,  range]);
  const expenses = useMemo(() => allExpenses.filter(i => inRange(i.expense_date, range.from, range.to)), [allExpenses, range]);

  const totalIncome  = entries.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, i) => s + Number(i.amount || 0), 0);
  const profit       = totalIncome - totalExpense;

  const svcRev = entries.reduce((a, i) => {
    const k = i.service_type || 'General';
    a[k] = (a[k] || 0) + Number(i.amount || 0); return a;
  }, {});
  const svcCount = entries.reduce((a, i) => {
    const k = i.service_type || 'General';
    a[k] = (a[k] || 0) + 1; return a;
  }, {});
  const expCat = expenses.reduce((a, i) => {
    const k = i.category || 'misc';
    a[k] = (a[k] || 0) + Number(i.amount || 0); return a;
  }, {});

  const totalSvcRev = Object.values(svcRev).reduce((s, v) => s + v, 0);
  const totalExpAmt = Object.values(expCat).reduce((s, v) => s + v, 0);
  const hasData     = entries.length > 0 || expenses.length > 0;
  const name        = shopName || shop?.name || 'Shop';

  return (
    <div style={s.wrap}>

      {/* Period selector */}
      <div style={s.filterCard}>
        <div style={s.filterTop}>
          <div>
            <div style={s.filterTitle}>Report Period</div>
            <div style={s.filterSub}>{range.label}</div>
          </div>
          <div style={s.actions}>
            {/* <button
              style={s.actionBtn}
              onClick={() => downloadCSV(entries, expenses, range.label, name)}
              disabled={!hasData}
            >
              ↓ CSV
            </button> */}
            <button
              style={{ ...s.actionBtn, background: C.dark, color: C.white, border: `1px solid ${C.dark}` }}
              onClick={() => printReport(name, range.label, entries, expenses, { totalIncome, totalExpense, profit })}
              disabled={!hasData}
            >
              🖨 Print / PDF
            </button>
          </div>
        </div>

        <div style={s.pills}>
          {PERIODS.map(p => (
            <button key={p.val} onClick={() => setPeriod(p.val)} style={{
              ...s.pill,
              background: period === p.val ? C.dark : C.white,
              color:      period === p.val ? C.white : C.mid,
              border:     `1px solid ${period === p.val ? C.dark : C.border}`,
              fontWeight: period === p.val ? '600' : '400',
            }}>{p.label}</button>
          ))}
        </div>

        {period === 'custom' && (
          <div style={s.customRow}>
            <div style={s.customField}>
              <label style={s.customLabel}>From</label>
              <input type="date" value={customFrom} onChange={e => setFrom(e.target.value)} style={s.customInput} />
            </div>
            <div style={s.customField}>
              <label style={s.customLabel}>To</label>
              <input type="date" value={customTo} onChange={e => setTo(e.target.value)} style={s.customInput} />
            </div>
          </div>
        )}
      </div>

      {!hasData ? (
        <div style={s.emptyPage}>
          <div style={s.emptyIcon}>📊</div>
          <p style={s.emptyTitle}>No data for this period</p>
          <p style={s.emptySub}>Try selecting a different date range, or add some income and expenses first.</p>
        </div>
      ) : (
        <>
          {/* Summary metrics */}
          <div style={s.metrics}>
            {[
              { label: 'Total Income',   value: `$${totalIncome.toFixed(2)}`,  color: C.green,  accent: C.green },
              { label: 'Total Expenses', value: `$${totalExpense.toFixed(2)}`, color: C.red,    accent: C.red },
              { label: 'Net Profit',     value: `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`, color: profit >= 0 ? C.green : C.red, accent: C.dark },
              { label: 'Transactions',   value: `${entries.length + expenses.length}`, color: C.dark, accent: '#7C3AED' },
            ].map(({ label, value, color, accent }) => (
              <div key={label} style={s.metric}>
                <div style={{ ...s.metricBar, background: accent }} />
                <div style={s.metricLabel}>{label}</div>
                <div style={{ ...s.metricValue, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Service + category breakdown */}
          <div style={s.breakdowns}>
            <div style={s.breakdown}>
              <div style={s.breakdownTitle}>Income by Service</div>
              {Object.keys(svcRev).length === 0
                ? <p style={s.empty}>No income this period</p>
                : Object.entries(svcRev).sort((a,b) => b[1]-a[1]).map(([svc, rev]) => (
                    <div key={svc} style={s.barRow}>
                      <div style={s.barLeft}>
                        <span style={s.barName}>{svc}</span>
                        <span style={s.barCount}>{svcCount[svc]} job{svcCount[svc] !== 1 ? 's' : ''}</span>
                      </div>
                      <div style={s.barTrack}>
                        <div style={{ ...s.barFill, width: `${totalSvcRev > 0 ? (rev/totalSvcRev)*100 : 0}%`, background: C.green }} />
                      </div>
                      <span style={{ ...s.barAmt, color: C.green }}>${rev.toFixed(2)}</span>
                    </div>
                  ))}
            </div>

            <div style={s.breakdown}>
              <div style={s.breakdownTitle}>Expenses by Category</div>
              {Object.keys(expCat).length === 0
                ? <p style={s.empty}>No expenses this period</p>
                : Object.entries(expCat).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
                    <div key={cat} style={s.barRow}>
                      <div style={s.barLeft}>
                        <span style={{ ...s.barName, textTransform: 'capitalize' }}>{cat}</span>
                      </div>
                      <div style={s.barTrack}>
                        <div style={{ ...s.barFill, width: `${totalExpAmt > 0 ? (amt/totalExpAmt)*100 : 0}%`, background: C.red }} />
                      </div>
                      <span style={{ ...s.barAmt, color: C.red }}>${amt.toFixed(2)}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* All income entries */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Income Entries</div>
              <span style={s.tableCount}>{entries.length} records</span>
            </div>
            {entries.length === 0
              ? <div style={s.emptyRow}>No income for this period</div>
              : entries.map(item => (
                  <div key={item.id} style={s.tableRow}>
                    <div style={s.rowLeft}>
                      <span style={s.rowTag}>{item.service_type || 'General'}</span>
                      <span style={s.rowDesc}>{item.description}</span>
                    </div>
                    <div style={s.rowRight}>
                      <span style={s.rowDate}>{item.entry_date}</span>
                      <span style={{ ...s.rowAmt, color: C.green }}>+${Number(item.amount).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Total Income</span>
              <span style={{ ...s.totalAmt, color: C.green }}>+${totalIncome.toFixed(2)}</span>
            </div>
          </div>

          {/* All expense entries */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Expenses</div>
              <span style={s.tableCount}>{expenses.length} records</span>
            </div>
            {expenses.length === 0
              ? <div style={s.emptyRow}>No expenses for this period</div>
              : expenses.map(item => (
                  <div key={item.id} style={s.tableRow}>
                    <div style={s.rowLeft}>
                      <span style={s.rowCatTag}>{item.category || 'misc'}</span>
                      <div>
                        <div style={s.rowDesc}>{item.description}</div>
                        <div style={s.rowMeta}>Paid by: {item.paid_by || 'Unknown'}</div>
                      </div>
                    </div>
                    <div style={s.rowRight}>
                      <span style={s.rowDate}>{item.expense_date}</span>
                      <span style={{ ...s.rowAmt, color: C.red }}>-${Number(item.amount).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
            <div style={s.totalRow}>
              <span style={s.totalLabel}>Total Expenses</span>
              <span style={{ ...s.totalAmt, color: C.red }}>-${totalExpense.toFixed(2)}</span>
            </div>
          </div>

          {/* Bottom summary */}
          <div style={s.summaryBox}>
            <div style={s.summaryRow}>
              <span style={s.summaryLabel}>Total Income</span>
              <span style={{ ...s.summaryVal, color: C.green }}>+${totalIncome.toFixed(2)}</span>
            </div>
            <div style={s.summaryRow}>
              <span style={s.summaryLabel}>Total Expenses</span>
              <span style={{ ...s.summaryVal, color: C.red }}>-${totalExpense.toFixed(2)}</span>
            </div>
            <div style={s.summaryDivider} />
            <div style={s.summaryRow}>
              <span style={{ ...s.summaryLabel, fontWeight: '700', color: C.dark, fontSize: '15px' }}>Net Profit</span>
              <span style={{ ...s.summaryVal, color: profit >= 0 ? C.green : C.red, fontSize: '20px', fontWeight: '900' }}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '16px' },

  filterCard: { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  filterTop:  { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  filterTitle:{ fontSize: '15px', fontWeight: '800', color: C.dark, letterSpacing: '-0.2px' },
  filterSub:  { fontSize: '12px', color: C.muted, marginTop: '3px' },
  actions:    { display: 'flex', gap: '8px' },
  actionBtn:  { padding: '8px 16px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.white, color: C.dark, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", whiteSpace: 'nowrap' },
  pills:      { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  pill:       { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", transition: 'all 0.1s' },
  customRow:  { display: 'flex', gap: '12px', marginTop: '14px', flexWrap: 'wrap' },
  customField:{ display: 'flex', flexDirection: 'column', gap: '4px' },
  customLabel:{ fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  customInput:{ padding: '8px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '13px', fontFamily: "'Outfit', sans-serif", outline: 'none', color: C.dark },

  metrics: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  metric:  { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  metricBar:   { position: 'absolute', top: 0, left: 0, right: 0, height: '3px' },
  metricLabel: { fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' },
  metricValue: { fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' },

  breakdowns: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' },
  breakdown:  { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  breakdownTitle: { fontSize: '12px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` },
  barRow:  { display: 'flex', alignItems: 'center', gap: '10px' },
  barLeft: { display: 'flex', flexDirection: 'column', gap: '1px', width: '110px', flexShrink: 0 },
  barName: { fontSize: '12px', fontWeight: '600', color: C.body },
  barCount:{ fontSize: '10px', color: C.muted },
  barTrack:{ flex: 1, height: '5px', background: C.bg, borderRadius: '10px', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: '10px', minWidth: '4px' },
  barAmt:  { fontSize: '12px', fontWeight: '800', width: '70px', textAlign: 'right', flexShrink: 0 },

  table:     { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  tableHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: `1px solid ${C.border}` },
  tableTitle:{ fontSize: '13px', fontWeight: '700', color: C.dark },
  tableCount:{ fontSize: '11px', color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${C.border}` },
  tableRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 20px', borderBottom: `1px solid ${C.border}`, gap: '12px' },
  rowLeft:   { display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 },
  rowRight:  { display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 },
  rowTag:    { fontSize: '11px', fontWeight: '600', color: C.greenText, background: C.greenBg, padding: '2px 8px', borderRadius: '4px', flexShrink: 0 },
  rowCatTag: { fontSize: '11px', fontWeight: '600', color: '#6D28D9', background: '#F5F3FF', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, textTransform: 'capitalize' },
  rowDesc:   { fontSize: '13px', color: C.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' },
  rowMeta:   { fontSize: '11px', color: C.muted, marginTop: '2px' },
  rowDate:   { fontSize: '11px', color: C.muted },
  rowAmt:    { fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px' },
  emptyRow:  { padding: '20px', fontSize: '13px', color: C.muted },
  totalRow:  { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: C.bg, borderTop: `1px solid ${C.border}` },
  totalLabel:{ fontSize: '13px', fontWeight: '700', color: C.dark },
  totalAmt:  { fontSize: '15px', fontWeight: '900', letterSpacing: '-0.3px' },

  summaryBox: { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel:{ fontSize: '13px', color: C.mid },
  summaryVal: { fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px' },
  summaryDivider: { height: '1px', background: C.border },

  emptyPage:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', background: C.white, borderRadius: '12px', border: `1px solid ${C.border}` },
  emptyIcon:  { fontSize: '40px', marginBottom: '16px' },
  emptyTitle: { fontSize: '17px', fontWeight: '800', color: C.dark, margin: '0 0 8px' },
  emptySub:   { fontSize: '14px', color: C.muted, margin: 0, maxWidth: '320px', lineHeight: '1.6' },
  empty:      { fontSize: '12px', color: C.muted, margin: 0 },
};