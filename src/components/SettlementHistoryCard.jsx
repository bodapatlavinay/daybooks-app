import { C } from './styles';

function money(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

export default function SettlementHistoryCard({ periods = [] }) {
  return (
    <div style={s.wrap}>
      <div style={s.title}>Settlement history</div>
      {periods.length === 0 ? (
        <div style={s.empty}>No frozen settlement periods yet. Close a month to create a snapshot.</div>
      ) : (
        <div style={s.list}>
          {periods.map(period => (
            <div key={period.id} style={s.row}>
              <div>
                <div style={s.rowTitle}>{period.start_date} → {period.end_date}</div>
                <div style={s.rowMeta}>{period.status} • {period.created_at ? new Date(period.created_at).toLocaleString() : 'saved'}</div>
              </div>
              <div style={s.rowAmt}>{money(period.net_profit_cents)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  title: { fontSize: '14px', fontWeight: '800', color: C.dark },
  empty: { background: C.bg, color: C.muted, padding: '12px', borderRadius: '10px', fontSize: '13px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px' },
  rowTitle: { fontSize: '13px', fontWeight: '700', color: C.dark },
  rowMeta: { fontSize: '12px', color: C.muted, marginTop: '4px' },
  rowAmt: { fontSize: '15px', fontWeight: '900', color: C.greenText, whiteSpace: 'nowrap' },
};
