import { useState } from 'react';
import { formStyles, C } from './styles';

export default function ShopSetup({ user, message, messageType, submitting, onCreateShop, onLogout }) {
  const [shopName, setShopName] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onCreateShop(shopName);
  }

  return (
    <div style={formStyles.page}>
      <form onSubmit={handleSubmit} style={s.card}>
        <div style={s.logoRow}>
          <div style={s.logo}><span style={s.logoD}>D</span></div>
          <span style={s.logoLabel}>DayBooks</span>
        </div>

        <div>
          <h2 style={s.title}>Set up your shop</h2>
          <p style={s.sub}>Welcome, {user.email}</p>
        </div>

        <div style={s.hint}>
          <span style={s.hintIcon}>⚡</span>
          <span style={s.hintText}>
            We'll automatically add Tire Sale, Balancing, Oil Change, and other common services so you can start recording income right away.
          </span>
        </div>

        <div style={s.field}>
          <label htmlFor="shop-name-setup" style={s.label}>Business name</label>
          <input
            id="shop-name-setup" name="shop-name" type="text"
            placeholder="e.g. Mike's Tire & Auto"
            value={shopName} onChange={(e) => setShopName(e.target.value)}
            style={s.input} autoComplete="organization" autoFocus required
          />
        </div>

        <button type="submit" style={{
          ...s.submitBtn,
          opacity: submitting ? 0.7 : 1,
          cursor: submitting ? 'not-allowed' : 'pointer',
        }} disabled={submitting}>
          {submitting ? 'Setting up...' : 'Create my shop →'}
        </button>

        <button type="button" onClick={onLogout} style={s.logoutBtn} disabled={submitting}>
          Sign out
        </button>

        {message && (
          <div style={{
            ...s.msg,
            background: messageType === 'error' ? C.redLight : C.greenBg,
            color:      messageType === 'error' ? C.red      : C.green,
            border:     `1px solid ${messageType === 'error' ? C.redMid : C.greenBorder}`,
          }}>
            {messageType === 'error' ? '⚠ ' : '✓ '}{message}
          </div>
        )}
      </form>
    </div>
  );
}

const s = {
  card: { width: '100%', maxWidth: '420px', background: C.white, padding: '36px', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', display: 'flex', flexDirection: 'column', gap: '18px' },
  logoRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logo: { width: '36px', height: '36px', background: C.red, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoD: { fontSize: '20px', fontWeight: '900', color: C.white, lineHeight: 1 },
  logoLabel: { fontSize: '18px', fontWeight: '800', color: C.black, letterSpacing: '-0.3px' },
  title: { fontSize: '22px', fontWeight: '800', color: C.black, margin: '0 0 4px', letterSpacing: '-0.3px' },
  sub: { fontSize: '13px', color: C.muted, margin: 0 },
  hint: { display: 'flex', gap: '10px', background: '#f9f5ff', border: '1px solid #e4d4ff', borderRadius: '10px', padding: '12px 14px' },
  hintIcon: { fontSize: '16px', flexShrink: 0, marginTop: '1px' },
  hintText: { fontSize: '13px', color: '#5b3d9e', lineHeight: '1.5' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '12px', fontWeight: '600', color: C.dark, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { padding: '12px 14px', borderRadius: '10px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: C.surface, outline: 'none', color: C.black, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },
  submitBtn: { padding: '13px', borderRadius: '10px', border: 'none', background: C.red, color: C.white, fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
  logoutBtn: { padding: '10px', borderRadius: '10px', border: `1.5px solid ${C.border}`, background: 'transparent', color: C.muted, fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', textAlign: 'center' },
  msg: { padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600' },
};

// Export C so it's available
export { C };