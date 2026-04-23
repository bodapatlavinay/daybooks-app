import { useState } from 'react';
import EntryForm from './EntryForm';
import { C } from './styles';
import { paymentLabel, paymentStyle } from './EntryForm';

// ── Inline SVG icons ──────────────────────────────────────────────────────────
function Svg({ size = 16, children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}
function IconIncome({ size }) {
  return <Svg size={size}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>;
}
function IconLogout({ size }) {
  return <Svg size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
}

export default function StaffDashboard({
  user, shop, services, staffMember,
  entries,        // only today's entries by this staff member
  submitting, message, messageType,
  onAddEntry, onLogout,
}) {
  const [added, setAdded] = useState(false);

  function todayStr() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  const today = todayStr();
  const todayEntries = entries.filter(e => e.entry_date === today);
  const staffName = staffMember?.name || user?.email?.split('@')[0] || 'Staff';

  return (
    <div style={s.shell}>

      {/* ── Header ── */}
      <div style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.logoMark}><span style={s.logoLetter}>D</span></div>
          <div>
            <div style={s.shopName}>{shop?.name || 'DayBooks'}</div>
            <div style={s.shopSub}>Staff view</div>
          </div>
        </div>
        <div style={s.headerRight}>
          <div style={s.staffChip}>
            <div style={s.staffDot} />
            <span style={s.staffName}>{staffName}</span>
          </div>
          <button onClick={onLogout} style={s.logoutBtn} title="Sign out">
            <IconLogout size={15} />
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={s.content}>

        {/* Today's progress chip */}
        <div style={s.todayBar}>
          <div style={s.todayLeft}>
            <div style={s.todayIcon}><IconIncome size={14} /></div>
            <div>
              <div style={s.todayTitle}>
                {today} · {todayEntries.length} {todayEntries.length === 1 ? 'job' : 'jobs'} recorded today
              </div>
              {todayEntries.length > 0 && (
                <div style={s.todaySub}>
                  Total: ${todayEntries.reduce((s, e) => s + Number(e.amount || 0), 0).toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Add income form */}
        <div style={s.formCard}>
          <div style={s.formCardTitle}>Record a Job</div>
          <div style={s.formCardBody}>
            {services.length === 0 ? (
              <div style={s.empty}>
                <p style={s.emptyText}>No services set up yet.</p>
                <p style={s.emptySub}>Ask the shop owner to add services in Settings.</p>
              </div>
            ) : (
              <EntryForm
                onAddEntry={(data) => {
                  onAddEntry(data);
                  setAdded(true);
                  setTimeout(() => setAdded(false), 3000);
                }}
                services={services}
                submitting={submitting}
                submitLabel="✓ Record this job"
              />
            )}
          </div>
        </div>

        {/* Today's entries by this staff member */}
        {todayEntries.length > 0 && (
          <div style={s.listCard}>
            <div style={s.listCardTitle}>Your jobs today</div>
            {todayEntries.map(item => {
              const ps = paymentStyle(item.payment_type || 'cash');
              return (
                <div key={item.id} style={s.row}>
                  <div style={s.rowMain}>
                    <div style={s.rowTop}>
                      <span style={s.rowTag}>{item.service_type || 'General'}</span>
                      <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 7px', borderRadius: '4px', flexShrink: 0, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
                        {paymentLabel(item.payment_type || 'cash')}
                      </span>
                      <span style={s.rowDesc}>{item.description}</span>
                    </div>
                    <span style={s.rowMeta}>{item.entry_date}</span>
                  </div>
                  <span style={s.rowAmt}>${Number(item.amount).toFixed(2)}</span>
                </div>
              );
            })}
            <div style={s.listTotal}>
              <span style={s.listTotalLabel}>Your total today</span>
              <span style={s.listTotalVal}>
                ${todayEntries.reduce((s, e) => s + Number(e.amount || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

      </div>

      {/* Toast */}
      {message && (
        <div style={{
          ...s.toast,
          background: messageType === 'error' ? '#1C0A0A' : '#0A1C10',
          color:      messageType === 'error' ? '#FF6B6B' : '#4ADE80',
          border:     `1px solid ${messageType === 'error' ? '#3D0F0F' : '#14532D'}`,
        }}>
          {messageType === 'error' ? '⚠ ' : '✓ '}{message}
        </div>
      )}
    </div>
  );
}

const s = {
  shell:   { display: 'flex', flexDirection: 'column', minHeight: '100vh', background: C.bg, fontFamily: "'Outfit', system-ui, sans-serif" },

  header:      { background: C.white, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 },
  headerLeft:  { display: 'flex', alignItems: 'center', gap: '12px' },
  logoMark:    { width: '36px', height: '36px', background: C.red, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoLetter:  { fontSize: '20px', fontWeight: '900', color: '#fff', fontFamily: "'Outfit', sans-serif" },
  shopName:    { fontSize: '15px', fontWeight: '800', color: C.dark, letterSpacing: '-0.2px' },
  shopSub:     { fontSize: '11px', color: C.muted, marginTop: '1px' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  staffChip:   { display: 'flex', alignItems: 'center', gap: '7px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '20px', padding: '5px 12px' },
  staffDot:    { width: '7px', height: '7px', background: '#16A34A', borderRadius: '50%', flexShrink: 0 },
  staffName:   { fontSize: '13px', fontWeight: '600', color: C.dark },
  logoutBtn:   { width: '32px', height: '32px', border: `1px solid ${C.border}`, background: 'transparent', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.muted },

  content: { flex: 1, padding: '12px 16px', maxWidth: '560px', width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' },

  todayBar:   { background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  todayLeft:  { display: 'flex', alignItems: 'center', gap: '12px' },
  todayIcon:  { width: '32px', height: '32px', background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, flexShrink: 0 },
  todayTitle: { fontSize: '13px', fontWeight: '700', color: C.dark },
  todaySub:   { fontSize: '12px', color: C.green, fontWeight: '600', marginTop: '2px' },

  formCard:      { background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  formCardTitle: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '14px 20px 0' },
  formCardBody:  { padding: '14px 20px 20px' },

  empty:    { textAlign: 'center', padding: '20px 0' },
  emptyText:{ fontSize: '14px', fontWeight: '600', color: C.mid, margin: '0 0 4px' },
  emptySub: { fontSize: '13px', color: C.muted, margin: 0 },

  listCard:      { background: C.white, border: `1px solid ${C.border}`, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  listCardTitle: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '14px 20px', borderBottom: `1px solid ${C.border}` },

  row:     { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 20px', borderBottom: `1px solid ${C.border}` },
  rowMain: { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 },
  rowTop:  { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', minWidth: 0 },
  rowTag:  { fontSize: '11px', fontWeight: '600', color: C.greenText, background: C.greenBg, padding: '2px 7px', borderRadius: '4px', flexShrink: 0 },
  rowDesc: { fontSize: '13px', color: C.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1, minWidth: 0 },
  rowMeta: { fontSize: '11px', color: C.muted },
  rowAmt:  { fontSize: '15px', fontWeight: '800', color: C.green, letterSpacing: '-0.3px', flexShrink: 0 },

  listTotal:      { display: 'flex', justifyContent: 'space-between', padding: '12px 20px', background: C.bg, borderTop: `1px solid ${C.border}` },
  listTotalLabel: { fontSize: '13px', fontWeight: '700', color: C.dark },
  listTotalVal:   { fontSize: '15px', fontWeight: '900', color: C.green, letterSpacing: '-0.3px' },

  toast: { position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif", zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' },
};