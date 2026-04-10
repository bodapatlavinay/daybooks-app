import { C } from './styles';

export default function ReportsCard({ entries, expenses, totals, filter }) {
  const svcRev = entries.reduce((a, i) => {
    const k = i.service_type || 'General';
    a[k] = (a[k] || 0) + Number(i.amount || 0);
    return a;
  }, {});
  const svcCount = entries.reduce((a, i) => {
    const k = i.service_type || 'General';
    a[k] = (a[k] || 0) + 1;
    return a;
  }, {});
  const expCat = expenses.reduce((a, i) => {
    const k = i.category || 'misc';
    a[k] = (a[k] || 0) + Number(i.amount || 0);
    return a;
  }, {});

  const topSvc = Object.entries(svcRev).sort((a,b) => b[1]-a[1])[0];
  const topCat = Object.entries(expCat).sort((a,b) => b[1]-a[1])[0];
  const totalSvcRev = Object.values(svcRev).reduce((s,v) => s+v, 0);
  const totalExpAmt = Object.values(expCat).reduce((s,v) => s+v, 0);
  const label = { today:'Today', week:'This Week', month:'This Month', all:'All Time' }[filter] || filter;

  return (
    <div style={s.wrap}>
      {/* 4 metric cards */}
      <div style={s.metrics}>
        {[
          { label: 'Total Income',   value: `$${totals.totalIncome.toFixed(2)}`,  color: C.green, accent: C.green },
          { label: 'Total Expenses', value: `$${totals.totalExpense.toFixed(2)}`, color: C.red,   accent: C.red },
          { label: 'Net Profit',     value: `${totals.profit >= 0 ? '+' : ''}$${totals.profit.toFixed(2)}`, color: totals.profit >= 0 ? C.green : C.red, accent: C.dark },
          { label: 'Transactions',   value: `${entries.length + expenses.length}`, color: C.dark, accent: '#7C3AED' },
        ].map(({ label: l, value, color, accent }) => (
          <div key={l} style={s.metric}>
            <div style={{ ...s.metricBar, background: accent }} />
            <div style={s.metricLabel}>{l}</div>
            <div style={{ ...s.metricValue, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Insight row */}
      {(topSvc || topCat) && (
        <div style={s.insights}>
          {topSvc && (
            <div style={s.insightCard}>
              <div style={s.insightLeft}>
                <div style={s.insightTitle}>Top service · {label}</div>
                <div style={s.insightValue}>{topSvc[0]}</div>
                <div style={s.insightSub}>${topSvc[1].toFixed(2)} · {svcCount[topSvc[0]]} jobs</div>
              </div>
              <div style={{ ...s.insightBig, color: C.green }}>${topSvc[1].toFixed(2)}</div>
            </div>
          )}
          {topCat && (
            <div style={s.insightCard}>
              <div style={s.insightLeft}>
                <div style={s.insightTitle}>Top expense · {label}</div>
                <div style={{ ...s.insightValue, textTransform: 'capitalize' }}>{topCat[0]}</div>
                <div style={s.insightSub}>${topCat[1].toFixed(2)} spent</div>
              </div>
              <div style={{ ...s.insightBig, color: C.red }}>${topCat[1].toFixed(2)}</div>
            </div>
          )}
        </div>
      )}

      {/* Breakdowns */}
      <div style={s.breakdowns}>
        <div style={s.breakdown}>
          <div style={s.breakdownTitle}>Income by service</div>
          {Object.keys(svcRev).length === 0
            ? <p style={s.empty}>No income for this period.</p>
            : Object.entries(svcRev).sort((a,b) => b[1]-a[1]).map(([svc, rev]) => (
                <div key={svc} style={s.barRow}>
                  <div style={s.barRowLeft}>
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
          <div style={s.breakdownTitle}>Expenses by category</div>
          {Object.keys(expCat).length === 0
            ? <p style={s.empty}>No expenses for this period.</p>
            : Object.entries(expCat).sort((a,b) => b[1]-a[1]).map(([cat, amt]) => (
                <div key={cat} style={s.barRow}>
                  <div style={s.barRowLeft}>
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
    </div>
  );
}

const s = {
  wrap: { display: 'flex', flexDirection: 'column', gap: '16px' },

  metrics: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' },
  metric:  { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '18px 20px', position: 'relative', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  metricBar:   { position: 'absolute', top: 0, left: 0, right: 0, height: '3px' },
  metricLabel: { fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' },
  metricValue: { fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' },

  insights: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  insightCard: { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  insightLeft:  { display: 'flex', flexDirection: 'column', gap: '3px' },
  insightTitle: { fontSize: '11px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  insightValue: { fontSize: '16px', fontWeight: '800', color: C.dark },
  insightSub:   { fontSize: '12px', color: C.muted },
  insightBig:   { fontSize: '22px', fontWeight: '900', letterSpacing: '-0.5px' },

  breakdowns: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' },
  breakdown:  { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  breakdownTitle: { fontSize: '12px', fontWeight: '700', color: C.mid, textTransform: 'uppercase', letterSpacing: '0.6px', paddingBottom: '8px', borderBottom: `1px solid ${C.border}` },

  barRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  barRowLeft: { display: 'flex', flexDirection: 'column', gap: '1px', width: '110px', flexShrink: 0 },
  barName:  { fontSize: '12px', fontWeight: '600', color: C.body },
  barCount: { fontSize: '10px', color: C.muted },
  barTrack: { flex: 1, height: '5px', background: C.bg, borderRadius: '10px', overflow: 'hidden' },
  barFill:  { height: '100%', borderRadius: '10px', transition: 'width 0.4s ease', minWidth: '4px' },
  barAmt:   { fontSize: '12px', fontWeight: '800', width: '70px', textAlign: 'right', flexShrink: 0 },
  empty: { fontSize: '12px', color: C.muted, margin: 0 },
};