import { useMemo, useState } from 'react';
import { C } from './styles';

export default function CustomerSearchCard({ entries = [] }) {
  const [query, setQuery] = useState('');
  const normalized = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!normalized) return [];
    return entries.filter(e => {
      const hay = [e.customer_name, e.customer_phone, e.vehicle_plate, e.vehicle_type, e.description]
        .filter(Boolean).join(' ').toLowerCase();
      return hay.includes(normalized);
    }).slice(0, 30);
  }, [entries, normalized]);

  return (
    <div style={s.wrap}>
      <div style={s.head}>
        <div>
          <div style={s.title}>Customer history</div>
          <div style={s.sub}>Search by phone, plate, customer name, or job description.</div>
        </div>
      </div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="e.g. 6175550123, ABC123, Mike"
        style={s.input}
      />
      {!normalized ? (
        <div style={s.empty}>Start typing to search your shop history.</div>
      ) : results.length === 0 ? (
        <div style={s.empty}>No matching customer history found.</div>
      ) : (
        <div style={s.list}>
          {results.map(item => (
            <div key={item.id} style={s.row}>
              <div style={s.rowMain}>
                <div style={s.rowTitle}>{item.customer_name || item.vehicle_plate || item.description}</div>
                <div style={s.rowMeta}>
                  {[item.customer_phone, item.vehicle_plate, item.vehicle_type].filter(Boolean).join(' • ') || 'No customer details'}
                </div>
                <div style={s.rowDesc}>{item.entry_date} • {item.service_type || 'General'} • {item.description}</div>
              </div>
              <div style={s.rowAmt}>${Number(item.amount || 0).toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const s = {
  wrap: { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' },
  head: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' },
  title: { fontSize: '14px', fontWeight: '800', color: C.dark },
  sub: { fontSize: '12px', color: C.muted, marginTop: '2px' },
  input: { padding: '11px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, background: C.surface, fontSize: '14px', fontFamily: "'Outfit', sans-serif" },
  empty: { padding: '16px', borderRadius: '10px', background: C.bg, color: C.muted, fontSize: '13px' },
  list: { display: 'flex', flexDirection: 'column', gap: '8px' },
  row: { display: 'flex', justifyContent: 'space-between', gap: '12px', border: `1px solid ${C.border}`, borderRadius: '10px', padding: '12px' },
  rowMain: { display: 'flex', flexDirection: 'column', gap: '4px' },
  rowTitle: { fontSize: '13px', fontWeight: '700', color: C.dark },
  rowMeta: { fontSize: '12px', color: C.mid },
  rowDesc: { fontSize: '12px', color: C.muted },
  rowAmt: { fontSize: '15px', fontWeight: '800', color: C.greenText, whiteSpace: 'nowrap' },
};
