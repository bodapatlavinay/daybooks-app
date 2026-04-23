import { C } from './styles';

export default function AccountCard({ user, shop, onLogout }) {
  return (
    <div style={s.card}>
      <div style={s.head}>
        <div style={s.eyebrow}>Account</div>
        <h3 style={s.title}>Owner access</h3>
      </div>

      <div style={s.body}>
        <InfoRow label="Email" value={user?.email || '—'} />
        <InfoRow label="Shop" value={shop?.name || '—'} />
        <InfoRow label="Type" value={shop?.category || '—'} />
      </div>

      <button type="button" onClick={onLogout} style={s.signOutBtn}>
        Sign out
      </button>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={s.infoRow}>
      <div style={s.infoLabel}>{label}</div>
      <div style={s.infoValue}>{value}</div>
    </div>
  );
}

const s = {
  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    minHeight: '210px',
    display: 'flex',
    flexDirection: 'column',
  },

  head: {
    padding: '18px 20px 14px',
    borderBottom: `1px solid ${C.border}`,
  },

  eyebrow: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    marginBottom: '6px',
  },

  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
    color: C.dark,
    letterSpacing: '-0.3px',
  },

  body: {
    padding: '10px 20px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
  },

  infoRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    paddingBottom: '10px',
    borderBottom: `1px solid ${C.border}`,
  },

  infoLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },

  infoValue: {
    fontSize: '14px',
    fontWeight: '700',
    color: C.dark,
    wordBreak: 'break-word',
    lineHeight: '1.5',
  },

  signOutBtn: {
    margin: '0 20px 20px',
    border: `1px solid ${C.border}`,
    background: C.white,
    color: C.dark,
    borderRadius: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
};