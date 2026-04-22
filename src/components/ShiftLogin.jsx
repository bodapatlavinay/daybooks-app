import { useState } from 'react';
import { C } from './styles';

export default function ShiftLogin({ shop, staffList, onShiftLogin, onOwnerLogout, onOwnerAccess, submitting }) {
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [pin, setPin]                     = useState('');
  const [error, setError]                 = useState('');
  const [pinVisible, setPinVisible]       = useState(false);

  const managers = staffList.filter(s => s.role === 'manager' && s.is_active);
  const workers  = staffList.filter(s => s.role === 'staff'   && s.is_active);

  function selectStaff(member) {
    setSelectedStaff(member);
    setPin('');
    setError('');
  }

  function handlePinDigit(digit) {
    if (pin.length >= 6) return;
    setPin(p => p + digit);
    setError('');
  }

  function handleBackspace() {
    setPin(p => p.slice(0, -1));
    setError('');
  }

  function handleLogin() {
    if (!selectedStaff) return;
    if (!pin) { setError('Enter your PIN'); return; }
    if (pin !== selectedStaff.pin) {
      setError('Wrong PIN. Try again.');
      setPin('');
      return;
    }
    setError('');
    onShiftLogin(selectedStaff);
  }

  function handleCancel() {
    setSelectedStaff(null);
    setPin('');
    setError('');
  }

  // ── PIN entry screen ──────────────────────────────────────────────────────
  if (selectedStaff) {
    return (
      <div style={s.page}>
        <div style={s.pinCard}>
          <div style={s.pinHeader}>
            <button onClick={handleCancel} style={s.backBtn}>← Back</button>
          </div>

          <div style={s.pinAvatar}>
            <span style={s.pinAvatarLetter}>{selectedStaff.name[0].toUpperCase()}</span>
          </div>
          <div style={s.pinName}>{selectedStaff.name}</div>
          <div style={s.pinId}>ID #{selectedStaff.display_id} · {selectedStaff.role === 'manager' ? 'Manager' : 'Staff'}</div>

          {/* PIN dots */}
          <div style={s.pinDots}>
            {[0,1,2,3,4,5].map(i => (
              <div key={i} style={{
                ...s.pinDot,
                background: i < pin.length ? C.dark : 'transparent',
                border: `2px solid ${i < pin.length ? C.dark : C.border}`,
              }} />
            ))}
          </div>

          {error && <div style={s.pinError}>{error}</div>}

          {/* Numpad */}
          <div style={s.numpad}>
            {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
              <button key={i} style={{
                ...s.numKey,
                background: d === '' ? 'transparent' : C.white,
                border: d === '' ? 'none' : `1px solid ${C.border}`,
                cursor: d === '' ? 'default' : 'pointer',
              }}
                onClick={() => {
                  if (d === '⌫') handleBackspace();
                  else if (d !== '') handlePinDigit(d);
                }}
                disabled={d === ''}
              >
                {d === '⌫' ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.dark} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                    <line x1="18" y1="9" x2="12" y2="15"/><line x1="12" y1="9" x2="18" y2="15"/>
                  </svg>
                ) : d}
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={pin.length === 0 || submitting}
            style={{ ...s.loginBtn, opacity: pin.length === 0 ? 0.4 : 1 }}
          >
            {submitting ? 'Signing in...' : 'Start shift'}
          </button>
        </div>
      </div>
    );
  }

  // ── Staff picker screen ───────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.pickerCard}>

        {/* Shop header */}
        <div style={s.shopHeader}>
          <div style={s.logoMark}><span style={s.logoLetter}>D</span></div>
          <div>
            <div style={s.shopName}>{shop?.name || 'DayBooks'}</div>
            <div style={s.shopSub}>Who's starting their shift?</div>
          </div>
        </div>

        {/* Managers */}
        {managers.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionLabel}>Managers</div>
            <div style={s.staffGrid}>
              {managers.map(m => (
                <button key={m.id} onClick={() => selectStaff(m)} style={s.staffCard}>
                  <div style={{ ...s.staffAvatar, background: '#1D4ED8', color: '#fff' }}>
                    {m.name[0].toUpperCase()}
                  </div>
                  <div style={s.staffCardName}>{m.name}</div>
                  <div style={s.staffCardId}>#{m.display_id}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Staff */}
        {workers.length > 0 && (
          <div style={s.section}>
            <div style={s.sectionLabel}>Staff</div>
            <div style={s.staffGrid}>
              {workers.map(m => (
                <button key={m.id} onClick={() => selectStaff(m)} style={s.staffCard}>
                  <div style={{ ...s.staffAvatar, background: C.dark, color: '#fff' }}>
                    {m.name[0].toUpperCase()}
                  </div>
                  <div style={s.staffCardName}>{m.name}</div>
                  <div style={s.staffCardId}>#{m.display_id}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {staffList.filter(s => s.is_active).length === 0 && (
          <div style={s.empty}>
            <div style={s.emptyTitle}>No staff members yet</div>
            <div style={s.emptySub}>Add staff from Settings → Staff to get started.</div>
          </div>
        )}

        {/* Owner access */}
        <div style={s.ownerRow}>
          <button onClick={onOwnerAccess} style={s.ownerAccessBtn}>
            ⚙ Owner / Manager access
          </button>
        </div>

        {/* Complete logout */}
        <div style={s.logoutRow}>
          <button onClick={onOwnerLogout} style={s.ownerLogoutBtn}>
            Sign out of {shop?.name || 'DayBooks'}
          </button>
        </div>
      </div>
    </div>
  );
}

const s = {
  page: { minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Outfit', system-ui, sans-serif" },

  // Picker
  pickerCard:  { width: '100%', maxWidth: '480px', background: C.white, borderRadius: '20px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  shopHeader:  { display: 'flex', alignItems: 'center', gap: '14px', paddingBottom: '16px', borderBottom: `1px solid ${C.border}` },
  logoMark:    { width: '44px', height: '44px', background: C.red, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoLetter:  { fontSize: '24px', fontWeight: '900', color: '#fff' },
  shopName:    { fontSize: '18px', fontWeight: '800', color: C.dark, letterSpacing: '-0.3px' },
  shopSub:     { fontSize: '13px', color: C.muted, marginTop: '2px' },

  section:      { display: 'flex', flexDirection: 'column', gap: '10px' },
  sectionLabel: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.7px' },
  staffGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' },
  staffCard:    { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '16px 8px', borderRadius: '12px', border: `1.5px solid ${C.border}`, background: C.surface, cursor: 'pointer', transition: 'all 0.12s', fontFamily: "'Outfit', sans-serif" },
  staffAvatar:  { width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', flexShrink: 0 },
  staffCardName:{ fontSize: '13px', fontWeight: '700', color: C.dark, textAlign: 'center' },
  staffCardId:  { fontSize: '11px', color: C.muted },

  empty:      { textAlign: 'center', padding: '20px 0' },
  emptyTitle: { fontSize: '15px', fontWeight: '700', color: C.mid, marginBottom: '6px' },
  emptySub:   { fontSize: '13px', color: C.muted },

  ownerRow:       { display: 'flex', justifyContent: 'center' },
  ownerAccessBtn: { background: C.dark, border: 'none', color: C.white, fontSize: '13px', fontWeight: '700', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: '10px 20px', borderRadius: '8px' },
  logoutRow:      { paddingTop: '4px', display: 'flex', justifyContent: 'center' },
  ownerLogoutBtn: { background: 'none', border: 'none', color: C.muted, fontSize: '12px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", textDecoration: 'underline', textUnderlineOffset: '2px', padding: '4px' },

  // PIN screen
  pinCard:   { width: '100%', maxWidth: '340px', background: C.white, borderRadius: '20px', padding: '28px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 8px 40px rgba(0,0,0,0.1)' },
  pinHeader: { width: '100%', display: 'flex', alignItems: 'center' },
  backBtn:   { background: 'none', border: 'none', color: C.muted, fontSize: '13px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0 },
  pinAvatar: { width: '64px', height: '64px', borderRadius: '50%', background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  pinAvatarLetter: { fontSize: '28px', fontWeight: '900', color: '#fff' },
  pinName:   { fontSize: '20px', fontWeight: '800', color: C.dark, letterSpacing: '-0.3px' },
  pinId:     { fontSize: '12px', color: C.muted },
  pinDots:   { display: 'flex', gap: '10px', margin: '4px 0' },
  pinDot:    { width: '14px', height: '14px', borderRadius: '50%', transition: 'all 0.1s' },
  pinError:  { fontSize: '13px', color: C.red, fontWeight: '600' },

  numpad:  { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', width: '100%' },
  numKey:  { height: '60px', borderRadius: '12px', fontSize: '22px', fontWeight: '600', color: C.dark, cursor: 'pointer', fontFamily: "'Outfit', sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.1s' },

  loginBtn: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: C.red, color: '#fff', fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
};