import { useState, useMemo } from 'react';
import { C } from './styles';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function fmt(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function fmtShort(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
function toDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function inRange(dateStr, from, to) {
  if (!dateStr) return false;
  const date = toDate(dateStr);
  if (from && date < from) return false;
  if (to   && date > to)   return false;
  return true;
}

// Given a period key, return { from, to, label }
function getRange(period, customFrom, customTo) {
  const now = new Date(); now.setHours(23, 59, 59, 999);
  const today = new Date(); today.setHours(0, 0, 0, 0);

  if (period === 'custom') {
    const f = customFrom ? new Date(customFrom + 'T00:00:00') : null;
    const t = customTo   ? new Date(customTo   + 'T23:59:59') : null;
    const label = (customFrom && customTo)
      ? `${customFrom} → ${customTo}`
      : customFrom ? `From ${customFrom}` : 'Custom Range';
    return { from: f, to: t, label };
  }

  const s = new Date(today);

  if (period === 'today') {
    return { from: s, to: now, label: `Today — ${fmt(s)}` };
  }
  if (period === 'yesterday') {
    const y = new Date(today); y.setDate(y.getDate() - 1);
    const ye = new Date(y); ye.setHours(23,59,59,999);
    return { from: y, to: ye, label: `Yesterday — ${fmt(y)}` };
  }
  if (period === 'week') {
    s.setDate(s.getDate() - s.getDay()); // Sunday
    return { from: s, to: now, label: `This Week (${fmtShort(s)} – ${fmtShort(now)})` };
  }
  if (period === 'lastweek') {
    const end = new Date(today); end.setDate(end.getDate() - end.getDay() - 1); end.setHours(23,59,59,999);
    const start = new Date(end); start.setDate(start.getDate() - 6); start.setHours(0,0,0,0);
    return { from: start, to: end, label: `Last Week (${fmtShort(start)} – ${fmtShort(end)})` };
  }
  if (period === 'month') {
    s.setDate(1);
    return { from: s, to: now, label: `This Month — ${s.toLocaleString('default', { month: 'long', year: 'numeric' })}` };
  }
  if (period === 'lastmonth') {
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end   = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    return { from: start, to: end, label: `Last Month — ${start.toLocaleString('default', { month: 'long', year: 'numeric' })}` };
  }
  if (period === 'year') {
    s.setMonth(0); s.setDate(1);
    return { from: s, to: now, label: `This Year — ${now.getFullYear()}` };
  }
  if (period === 'lastyear') {
    const start = new Date(now.getFullYear() - 1, 0, 1);
    const end   = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59);
    return { from: start, to: end, label: `Last Year — ${now.getFullYear() - 1}` };
  }
  return { from: null, to: null, label: 'All Time' };
}

// Build weekly breakdown: given a date range, split into calendar weeks (Sun–Sat)
// Returns array of { label, from, to, entries, expenses, income, expense, profit }
function buildWeeks(from, to, allEntries, allExpenses) {
  if (!from || !to) return [];

  // Find the first Sunday on or before `from`
  const start = new Date(from);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);

  const weeks = [];
  let cursor = new Date(start);
  let weekNum = 1;

  while (cursor <= to) {
    const weekStart = new Date(cursor);
    const weekEnd   = new Date(cursor);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Clamp to our range
    const displayFrom = weekStart < from ? new Date(from) : weekStart;
    const displayTo   = weekEnd   > to   ? new Date(to)   : weekEnd;

    const wEntries  = allEntries.filter(i  => inRange(i.entry_date,   displayFrom, displayTo));
    const wExpenses = allExpenses.filter(i => inRange(i.expense_date, displayFrom, displayTo));

    const income  = wEntries.reduce((s, i) => s + Number(i.amount || 0), 0);
    const expense = wExpenses.reduce((s, i) => s + Number(i.amount || 0), 0);

    weeks.push({
      label:    `Week ${weekNum} · ${fmtShort(displayFrom)} – ${fmtShort(displayTo)}`,
      from:     displayFrom,
      to:       displayTo,
      entries:  wEntries,
      expenses: wExpenses,
      income,
      expense,
      profit:   income - expense,
    });

    cursor.setDate(cursor.getDate() + 7);
    weekNum++;
    if (weekNum > 60) break; // safety
  }

  return weeks.filter(w => w.entries.length > 0 || w.expenses.length > 0);
}

// ─────────────────────────────────────────────────────────────────────────────
// Print / PDF
// ─────────────────────────────────────────────────────────────────────────────

function printReport(shopName, label, entries, expenses, weeks) {
  const totalIncome  = entries.reduce((s, i) => s + Number(i.amount), 0);
  const totalExpense = expenses.reduce((s, i) => s + Number(i.amount), 0);
  const profit       = totalIncome - totalExpense;

  const incomeRows = entries.map(i => `
    <tr>
      <td>${i.entry_date || ''}</td>
      <td>${i.service_type || 'General'}</td>
      <td>${i.description || ''}</td>
      <td style="text-align:right;color:#15803D;font-weight:600">+$${Number(i.amount).toFixed(2)}</td>
    </tr>`).join('');

  const expenseRows = expenses.map(i => `
    <tr>
      <td>${i.expense_date || ''}</td>
      <td style="text-transform:capitalize">${i.category || 'misc'}</td>
      <td>${i.description || ''} ${i.paid_by ? `<span style="color:#9E9E9E;font-size:11px">(${i.paid_by})</span>` : ''}</td>
      <td style="text-align:right;color:#C80815;font-weight:600">-$${Number(i.amount).toFixed(2)}</td>
    </tr>`).join('');

  const weeklyTable = weeks.length > 1 ? `
    <h2>Weekly Breakdown</h2>
    <table>
      <thead><tr><th>Week</th><th style="text-align:right">Income</th><th style="text-align:right">Expenses</th><th style="text-align:right">Net Profit</th><th style="text-align:right">Transactions</th></tr></thead>
      <tbody>
        ${weeks.map(w => `
          <tr>
            <td>${w.label}</td>
            <td style="text-align:right;color:#15803D">+$${w.income.toFixed(2)}</td>
            <td style="text-align:right;color:#C80815">-$${w.expense.toFixed(2)}</td>
            <td style="text-align:right;color:${w.profit >= 0 ? '#15803D' : '#C80815'};font-weight:700">${w.profit >= 0 ? '+' : ''}$${w.profit.toFixed(2)}</td>
            <td style="text-align:right">${w.entries.length + w.expenses.length}</td>
          </tr>`).join('')}
      </tbody>
    </table>` : '';

  const html = `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<title>DayBooks Report — ${shopName}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #1A1A1A; padding: 28px; max-width: 900px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #C80815; padding-bottom: 14px; margin-bottom: 20px; }
  .logo { font-size: 20px; font-weight: 900; color: #C80815; }
  .shop { font-size: 16px; font-weight: 700; margin-top: 2px; }
  .meta { font-size: 11px; color: #9E9E9E; text-align: right; line-height: 1.7; }
  .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
  .stat { border: 1px solid #E8E6E1; border-radius: 8px; padding: 12px 14px; }
  .stat-label { font-size: 10px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 5px; }
  .stat-value { font-size: 18px; font-weight: 900; letter-spacing: -0.5px; }
  .green { color: #15803D; } .red { color: #C80815; } .dark { color: #1A1A1A; }
  h2 { font-size: 12px; font-weight: 700; color: #1A1A1A; margin: 20px 0 8px; padding-bottom: 5px; border-bottom: 1px solid #E8E6E1; text-transform: uppercase; letter-spacing: 0.6px; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; }
  th { font-size: 10px; font-weight: 600; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.4px; padding: 7px 10px; text-align: left; background: #F7F6F3; border-bottom: 1px solid #E8E6E1; }
  td { padding: 8px 10px; border-bottom: 1px solid #F4F3EE; vertical-align: top; }
  .total-row td { font-weight: 700; background: #F7F6F3; font-size: 12px; border-top: 2px solid #E8E6E1; }
  .final { margin-top: 20px; border: 2px solid #E8E6E1; border-radius: 8px; padding: 14px 16px; }
  .final-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
  .final-row.profit { font-weight: 900; font-size: 16px; padding-top: 10px; border-top: 2px solid #E8E6E1; margin-top: 5px; }
  .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #E8E6E1; font-size: 10px; color: #9E9E9E; display: flex; justify-content: space-between; }
  @media print {
    body { padding: 12px; }
    .summary { grid-template-columns: repeat(4, 1fr); }
  }
</style>
</head><body>

<div class="header">
  <div>
    <div class="logo">DayBooks</div>
    <div class="shop">${shopName}</div>
  </div>
  <div class="meta">
    <div><strong>Period:</strong> ${label}</div>
    <div><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
    <div><strong>Income records:</strong> ${entries.length} &nbsp; <strong>Expenses:</strong> ${expenses.length}</div>
  </div>
</div>

<div class="summary">
  <div class="stat"><div class="stat-label">Total Income</div><div class="stat-value green">$${totalIncome.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Total Expenses</div><div class="stat-value red">$${totalExpense.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Net Profit</div><div class="stat-value ${profit >= 0 ? 'green' : 'red'}">${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</div></div>
  <div class="stat"><div class="stat-label">Transactions</div><div class="stat-value dark">${entries.length + expenses.length}</div></div>
</div>

${weeklyTable}

<h2>Income Entries (${entries.length})</h2>
<table>
  <thead><tr><th>Date</th><th>Service</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${incomeRows || '<tr><td colspan="4" style="color:#9E9E9E;text-align:center;padding:12px">No income for this period</td></tr>'}
    <tr class="total-row"><td colspan="3">Total Income</td><td style="text-align:right;color:#15803D">+$${totalIncome.toFixed(2)}</td></tr>
  </tbody>
</table>

<h2>Expenses (${expenses.length})</h2>
<table>
  <thead><tr><th>Date</th><th>Category</th><th>Description</th><th style="text-align:right">Amount</th></tr></thead>
  <tbody>
    ${expenseRows || '<tr><td colspan="4" style="color:#9E9E9E;text-align:center;padding:12px">No expenses for this period</td></tr>'}
    <tr class="total-row"><td colspan="3">Total Expenses</td><td style="text-align:right;color:#C80815">-$${totalExpense.toFixed(2)}</td></tr>
  </tbody>
</table>

<div class="final">
  <div class="final-row"><span>Total Income</span><span class="green">+$${totalIncome.toFixed(2)}</span></div>
  <div class="final-row"><span>Total Expenses</span><span class="red">-$${totalExpense.toFixed(2)}</span></div>
  <div class="final-row profit"><span>Net Profit / Loss</span><span class="${profit >= 0 ? 'green' : 'red'}">${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}</span></div>
</div>

<div class="footer">
  <span>DayBooks — Daily Shop Ledger</span>
  <span>Confidential · ${shopName}</span>
</div>
</body></html>`;

  const w = window.open('', '_blank');
  w.document.write(html);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 600);
}

// ─────────────────────────────────────────────────────────────────────────────
// CSV
// ─────────────────────────────────────────────────────────────────────────────

function downloadCSV(entries, expenses, label, shopName) {
  const rows = [
    ...entries.map(e => ({
      Type: 'Income', Date: e.entry_date, Description: e.description,
      Service: e.service_type || 'General', Amount: `+${Number(e.amount).toFixed(2)}`,
      Category: '', PaidBy: '',
    })),
    ...expenses.map(e => ({
      Type: 'Expense', Date: e.expense_date, Description: e.description,
      Service: '', Amount: `-${Number(e.amount).toFixed(2)}`,
      Category: e.category || 'misc', PaidBy: e.paid_by || '',
    })),
  ].sort((a, b) => b.Date.localeCompare(a.Date));

  if (!rows.length) return;
  const header = Object.keys(rows[0]).join(',');
  const body   = rows.map(r => Object.values(r).map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const safe   = shopName.replace(/[^a-z0-9]/gi, '_');
  const safeLabel = label.replace(/[^a-z0-9]/gi, '_').slice(0, 40);
  const blob = new Blob([`${header}\n${body}`], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `DayBooks_${safe}_${safeLabel}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const PERIODS = [
  { val: 'today',     label: 'Today' },
  { val: 'yesterday', label: 'Yesterday' },
  { val: 'week',      label: 'This Week' },
  { val: 'lastweek',  label: 'Last Week' },
  { val: 'month',     label: 'This Month' },
  { val: 'lastmonth', label: 'Last Month' },
  { val: 'year',      label: 'This Year' },
  { val: 'lastyear',  label: 'Last Year' },
  { val: 'all',       label: 'All Time' },
  { val: 'custom',    label: '📅 Custom' },
];

export default function ReportsCard({ entries: allEntries, expenses: allExpenses, shopName, shop }) {
  const [period, setPeriod]   = useState('month');
  const [customFrom, setFrom] = useState('');
  const [customTo,   setTo]   = useState('');
  const [expandedWeek, setExpandedWeek] = useState(null);

  const range = useMemo(() => getRange(period, customFrom, customTo), [period, customFrom, customTo]);

  const entries  = useMemo(() => allEntries.filter(i  => inRange(i.entry_date,   range.from, range.to)), [allEntries,  range]);
  const expenses = useMemo(() => allExpenses.filter(i => inRange(i.expense_date, range.from, range.to)), [allExpenses, range]);

  const totalIncome  = entries.reduce((s, i) => s + Number(i.amount || 0), 0);
  const totalExpense = expenses.reduce((s, i) => s + Number(i.amount || 0), 0);
  const profit       = totalIncome - totalExpense;
  const hasData      = entries.length > 0 || expenses.length > 0;

  // Weekly breakdown — only meaningful if period spans > 1 week
  const weeks = useMemo(() => buildWeeks(range.from, range.to, allEntries, allExpenses), [range, allEntries, allExpenses]);
  const showWeeks = weeks.length > 1;

  // Service + category aggregates
  const svcRev = entries.reduce((a, i) => { const k = i.service_type || 'General'; a[k] = (a[k]||0) + Number(i.amount||0); return a; }, {});
  const svcCount = entries.reduce((a, i) => { const k = i.service_type || 'General'; a[k] = (a[k]||0)+1; return a; }, {});
  const expCat = expenses.reduce((a, i) => { const k = i.category || 'misc'; a[k] = (a[k]||0) + Number(i.amount||0); return a; }, {});
  const totalSvcRev = Object.values(svcRev).reduce((s,v)=>s+v,0);
  const totalExpAmt = Object.values(expCat).reduce((s,v)=>s+v,0);

  const name = shopName || shop?.name || 'Shop';

  return (
    <div style={s.wrap}>

      {/* ── Period selector ── */}
      <div style={s.filterCard}>
        <div style={s.filterTop}>
          <div>
            <div style={s.filterTitle}>📊 Reports</div>
            <div style={s.filterSub}>{range.label}</div>
          </div>
          <div style={s.actions}>
            <button style={s.csvBtn} disabled={!hasData}
              onClick={() => downloadCSV(entries, expenses, range.label, name)}>
              ↓ CSV
            </button>
            <button style={s.printBtn} disabled={!hasData}
              onClick={() => printReport(name, range.label, entries, expenses, weeks)}>
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
              fontWeight: period === p.val ? '700' : '400',
            }}>{p.label}</button>
          ))}
        </div>

        {/* Custom date range — shown when custom selected */}
        {period === 'custom' && (
          <div style={s.customBox}>
            <div style={s.customBoxTitle}>Select date range</div>
            <div style={s.customRow}>
              <div style={s.customField}>
                <label style={s.customLabel}>From</label>
                <input type="date" value={customFrom} onChange={e => setFrom(e.target.value)} style={s.customInput} />
              </div>
              <div style={s.customArrow}>→</div>
              <div style={s.customField}>
                <label style={s.customLabel}>To</label>
                <input type="date" value={customTo} onChange={e => setTo(e.target.value)} style={s.customInput} />
              </div>
            </div>
            {customFrom && customTo && (
              <div style={s.customConfirm}>
                Showing: <strong>{customFrom}</strong> to <strong>{customTo}</strong>
                {' · '}{entries.length + expenses.length} transactions
              </div>
            )}
          </div>
        )}
      </div>

      {!hasData ? (
        <div style={s.emptyPage}>
          <div style={s.emptyIcon}>📋</div>
          <p style={s.emptyTitle}>No data for this period</p>
          <p style={s.emptySub}>Try a different date range, or add some income and expenses first.</p>
        </div>
      ) : (
        <>
          {/* ── Summary metrics ── */}
          <div style={s.metrics}>
            {[
              { label: 'Total Income',   value: `$${totalIncome.toFixed(2)}`,  color: C.green,  accent: C.green },
              { label: 'Total Expenses', value: `$${totalExpense.toFixed(2)}`, color: C.red,    accent: C.red },
              { label: 'Net Profit',     value: `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`, color: profit >= 0 ? C.green : C.red, accent: '#1A1A1A' },
              { label: 'Transactions',   value: `${entries.length + expenses.length}`, color: '#1A1A1A', accent: '#7C3AED' },
            ].map(({ label, value, color, accent }) => (
              <div key={label} style={s.metric}>
                <div style={{ ...s.metricBar, background: accent }} />
                <div style={s.metricLabel}>{label}</div>
                <div style={{ ...s.metricValue, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* ── Weekly breakdown ── */}
          {showWeeks && (
            <div style={s.weekSection}>
              <div style={s.weekHeader}>
                <div style={s.weekHeaderTitle}>Weekly Breakdown</div>
                <div style={s.weekHeaderSub}>{weeks.length} weeks in this period · click a week to see details</div>
              </div>

              {/* Week summary bars */}
              <div style={s.weekGrid}>
                {weeks.map((w, i) => {
                  const maxVal = Math.max(...weeks.map(wk => Math.max(wk.income, wk.expense)), 1);
                  const isExpanded = expandedWeek === i;
                  return (
                    <div key={i} style={{ ...s.weekCard, border: isExpanded ? `2px solid ${C.dark}` : `1px solid ${C.border}` }}>
                      <button style={s.weekCardBtn} onClick={() => setExpandedWeek(isExpanded ? null : i)}>
                        <div style={s.weekCardTop}>
                          <div style={s.weekLabel}>{w.label}</div>
                          <div style={s.weekArrow}>{isExpanded ? '▲' : '▼'}</div>
                        </div>

                        {/* Mini bar chart */}
                        <div style={s.miniChart}>
                          <div style={s.miniBar}>
                            <div style={{ ...s.miniBarFill, width: `${(w.income/maxVal)*100}%`, background: C.green }} />
                          </div>
                          <div style={s.miniBar}>
                            <div style={{ ...s.miniBarFill, width: `${(w.expense/maxVal)*100}%`, background: C.red }} />
                          </div>
                        </div>

                        <div style={s.weekStats}>
                          <div>
                            <div style={s.weekStatLabel}>Income</div>
                            <div style={{ ...s.weekStatVal, color: C.green }}>${w.income.toFixed(2)}</div>
                          </div>
                          <div>
                            <div style={s.weekStatLabel}>Expenses</div>
                            <div style={{ ...s.weekStatVal, color: C.red }}>${w.expense.toFixed(2)}</div>
                          </div>
                          <div>
                            <div style={s.weekStatLabel}>Profit</div>
                            <div style={{ ...s.weekStatVal, color: w.profit >= 0 ? C.green : C.red }}>
                              {w.profit >= 0 ? '+' : ''}${w.profit.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <div style={s.weekStatLabel}>Txns</div>
                            <div style={{ ...s.weekStatVal, color: C.dark }}>{w.entries.length + w.expenses.length}</div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded week detail */}
                      {isExpanded && (
                        <div style={s.weekDetail}>
                          {w.entries.length > 0 && (
                            <>
                              <div style={s.weekDetailTitle}>Income ({w.entries.length})</div>
                              {w.entries.map(item => (
                                <div key={item.id} style={s.weekDetailRow}>
                                  <div style={s.weekDetailLeft}>
                                    <span style={s.rowTag}>{item.service_type || 'General'}</span>
                                    <span style={s.weekDetailDesc}>{item.description}</span>
                                  </div>
                                  <div style={s.weekDetailRight}>
                                    <span style={s.weekDetailDate}>{item.entry_date}</span>
                                    <span style={{ ...s.weekDetailAmt, color: C.green }}>+${Number(item.amount).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                          {w.expenses.length > 0 && (
                            <>
                              <div style={{ ...s.weekDetailTitle, marginTop: w.entries.length ? '12px' : 0 }}>Expenses ({w.expenses.length})</div>
                              {w.expenses.map(item => (
                                <div key={item.id} style={s.weekDetailRow}>
                                  <div style={s.weekDetailLeft}>
                                    <span style={s.rowCatTag}>{item.category || 'misc'}</span>
                                    <span style={s.weekDetailDesc}>{item.description}</span>
                                  </div>
                                  <div style={s.weekDetailRight}>
                                    <span style={s.weekDetailDate}>{item.expense_date}</span>
                                    <span style={{ ...s.weekDetailAmt, color: C.red }}>-${Number(item.amount).toFixed(2)}</span>
                                  </div>
                                </div>
                              ))}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Service + category breakdown charts ── */}
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

          {/* ── Full income table ── */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Income Entries</div>
              <span style={s.tableCount}>{entries.length} records · ${totalIncome.toFixed(2)}</span>
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

          {/* ── Full expense table ── */}
          <div style={s.table}>
            <div style={s.tableHead}>
              <div style={s.tableTitle}>All Expenses</div>
              <span style={s.tableCount}>{expenses.length} records · ${totalExpense.toFixed(2)}</span>
            </div>
            {expenses.length === 0
              ? <div style={s.emptyRow}>No expenses for this period</div>
              : expenses.map(item => (
                  <div key={item.id} style={s.tableRow}>
                    <div style={s.rowLeft}>
                      <span style={s.rowCatTag}>{item.category || 'misc'}</span>
                      <div>
                        <div style={s.rowDesc}>{item.description}</div>
                        <div style={s.rowMeta}>Paid by: {item.paid_by || '—'}</div>
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

          {/* ── Final summary ── */}
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
              <span style={{ ...s.summaryLabel, fontWeight: '800', color: C.dark, fontSize: '15px' }}>Net Profit / Loss</span>
              <span style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px', color: profit >= 0 ? C.green : C.red }}>
                {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '16px' },

  filterCard:  { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  filterTop:   { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' },
  filterTitle: { fontSize: '16px', fontWeight: '800', color: C.dark, letterSpacing: '-0.3px' },
  filterSub:   { fontSize: '12px', color: C.muted, marginTop: '4px' },
  actions:     { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  csvBtn:      { padding: '8px 16px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.white, color: C.dark, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" },
  printBtn:    { padding: '8px 16px', borderRadius: '8px', border: 'none', background: C.dark, color: C.white, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif" },
  pills:       { display: 'flex', gap: '6px', flexWrap: 'wrap' },
  pill:        { padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", border: `1px solid ${C.border}`, transition: 'all 0.1s' },

  customBox:      { marginTop: '16px', background: C.bg, borderRadius: '10px', border: `1px solid ${C.border}`, padding: '16px' },
  customBoxTitle: { fontSize: '12px', fontWeight: '700', color: C.dark, marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  customRow:      { display: 'flex', alignItems: 'flex-end', gap: '12px', flexWrap: 'wrap' },
  customArrow:    { fontSize: '18px', color: C.muted, paddingBottom: '8px' },
  customField:    { display: 'flex', flexDirection: 'column', gap: '4px' },
  customLabel:    { fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  customInput:    { padding: '9px 12px', borderRadius: '8px', border: `1px solid ${C.border}`, fontSize: '13px', fontFamily: "'Outfit', sans-serif", outline: 'none', color: C.dark, background: C.white },
  customConfirm:  { marginTop: '10px', fontSize: '12px', color: C.mid, background: C.white, padding: '8px 12px', borderRadius: '6px', border: `1px solid ${C.border}` },

  metrics:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px' },
  metric:      { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  metricBar:   { position: 'absolute', top: 0, left: 0, right: 0, height: '3px' },
  metricLabel: { fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' },
  metricValue: { fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' },

  // Weekly breakdown
  weekSection:    { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  weekHeader:     { padding: '16px 20px', borderBottom: `1px solid ${C.border}`, background: C.bg },
  weekHeaderTitle:{ fontSize: '13px', fontWeight: '700', color: C.dark },
  weekHeaderSub:  { fontSize: '12px', color: C.muted, marginTop: '2px' },
  weekGrid:       { display: 'flex', flexDirection: 'column' },
  weekCard:       { borderBottom: `1px solid ${C.border}`, overflow: 'hidden', transition: 'border 0.1s' },
  weekCardBtn:    { width: '100%', background: 'none', border: 'none', padding: '14px 20px', cursor: 'pointer', textAlign: 'left', fontFamily: "'Outfit', sans-serif" },
  weekCardTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  weekLabel:      { fontSize: '13px', fontWeight: '700', color: C.dark },
  weekArrow:      { fontSize: '10px', color: C.muted },
  miniChart:      { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' },
  miniBar:        { height: '5px', background: C.bg, borderRadius: '3px', overflow: 'hidden' },
  miniBarFill:    { height: '100%', borderRadius: '3px', minWidth: '3px', transition: 'width 0.3s' },
  weekStats:      { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' },
  weekStatLabel:  { fontSize: '10px', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' },
  weekStatVal:    { fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px' },
  weekDetail:     { padding: '0 20px 16px', borderTop: `1px solid ${C.border}`, background: '#FAFAF8' },
  weekDetailTitle:{ fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '12px 0 8px' },
  weekDetailRow:  { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: `1px solid ${C.border}`, gap: '10px' },
  weekDetailLeft: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 },
  weekDetailRight:{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  weekDetailDesc: { fontSize: '12px', color: C.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  weekDetailDate: { fontSize: '11px', color: C.muted },
  weekDetailAmt:  { fontSize: '13px', fontWeight: '800', letterSpacing: '-0.2px' },

  breakdowns:     { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' },
  breakdown:      { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  breakdownTitle: { fontSize: '12px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` },
  barRow:   { display: 'flex', alignItems: 'center', gap: '10px' },
  barLeft:  { display: 'flex', flexDirection: 'column', gap: '1px', width: '110px', flexShrink: 0 },
  barName:  { fontSize: '12px', fontWeight: '600', color: C.body },
  barCount: { fontSize: '10px', color: C.muted },
  barTrack: { flex: 1, height: '5px', background: C.bg, borderRadius: '10px', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: '10px', minWidth: '4px' },
  barAmt:   { fontSize: '12px', fontWeight: '800', width: '70px', textAlign: 'right', flexShrink: 0 },

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

  summaryBox:     { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '20px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column', gap: '12px' },
  summaryRow:     { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  summaryLabel:   { fontSize: '13px', color: C.mid },
  summaryVal:     { fontSize: '16px', fontWeight: '800', letterSpacing: '-0.3px' },
  summaryDivider: { height: '1px', background: C.border },

  emptyPage:  { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', textAlign: 'center', background: C.white, borderRadius: '12px', border: `1px solid ${C.border}` },
  emptyIcon:  { fontSize: '40px', marginBottom: '16px' },
  emptyTitle: { fontSize: '17px', fontWeight: '800', color: C.dark, margin: '0 0 8px' },
  emptySub:   { fontSize: '14px', color: C.muted, margin: 0, maxWidth: '320px', lineHeight: '1.6' },
  empty:      { fontSize: '12px', color: C.muted, margin: 0 },
};