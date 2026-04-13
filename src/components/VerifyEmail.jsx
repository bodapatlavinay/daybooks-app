import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { C } from './styles';

export default function VerifyEmail({ email, onLogout, onConfirmed }) {
  const [resending, setResending]     = useState(false);
  const [resendMsg, setResendMsg]     = useState('');
  const [resendError, setResendError] = useState('');
  const [checking, setChecking]       = useState(false);
  const [confirmed, setConfirmed]     = useState(false);

  // Inject spinner keyframes once
  useEffect(() => {
    if (!document.getElementById('db-spin')) {
      const el = document.createElement('style');
      el.id = 'db-spin';
      el.textContent = '@keyframes db-spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(el);
    }
  }, []);

  // Poll every 5s — if confirmed in another tab/device, auto-advance
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        clearInterval(interval);
        setConfirmed(true);
        setTimeout(() => onConfirmed && onConfirmed(), 1500);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  async function handleCheckNow() {
    setChecking(true);
    setResendError('');
    await supabase.auth.refreshSession();
    const { data: { user } } = await supabase.auth.getUser();
    setChecking(false);
    if (user?.email_confirmed_at) {
      setConfirmed(true);
      // Tell App.jsx to refresh the user object and advance to ShopSetup
      setTimeout(() => onConfirmed && onConfirmed(), 1500);
    } else {
      setResendError("Not confirmed yet — click the link in your email first, then tap this button.");
    }
  }

  async function handleResend() {
    setResendMsg(''); setResendError('');
    setResending(true);
    const { error } = await supabase.auth.resend({ type: 'signup', email });
    setResending(false);
    if (error) { setResendError(error.message); return; }
    setResendMsg('New confirmation email sent! Check your inbox.');
    setTimeout(() => setResendMsg(''), 6000);
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ ...s.iconWrap, background: C.greenBg, border: `1px solid ${C.greenBorder}` }}>
            <span style={{ fontSize: '28px' }}>✅</span>
          </div>
          <div style={s.textBlock}>
            <h1 style={s.title}>Email confirmed!</h1>
            <p style={s.body}>Your account is verified. Taking you to shop setup now...</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <div style={{
              width: '28px', height: '28px',
              border: `3px solid ${C.greenBg}`,
              borderTop: `3px solid ${C.green}`,
              borderRadius: '50%',
              animation: 'db-spin 0.8s linear infinite',
            }} />
          </div>
        </div>
      </div>
    );
  }

  // ── Waiting ───────────────────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.card}>

        <div style={s.iconWrap}>
          <span style={{ fontSize: '28px' }}>✉️</span>
        </div>

        <div style={s.textBlock}>
          <h1 style={s.title}>Verify your email</h1>
          <p style={s.body}>We sent a confirmation link to:</p>
          <div style={s.emailPill}>{email}</div>
          <p style={s.body}>
            Open the email and click <strong>"Confirm my account"</strong>, then come back here.
          </p>
        </div>

        <div style={s.steps}>
          {[
            'Open your inbox (check spam folder too)',
            'Click "Confirm my account" in the email',
            'Come back here and tap the button below',
          ].map((text, i) => (
            <div key={i} style={s.stepRow}>
              <div style={s.stepNum}>{i + 1}</div>
              <span style={s.stepText}>{text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleCheckNow}
          style={{ ...s.primaryBtn, opacity: checking ? 0.7 : 1, cursor: checking ? 'not-allowed' : 'pointer' }}
          disabled={checking}
        >
          {checking ? 'Checking...' : "✓  I've confirmed — continue"}
        </button>

        {resendError && (
          <div style={{ ...s.msg, background: C.redLight, color: C.red, border: `1px solid ${C.redMid}` }}>
            ⚠ {resendError}
          </div>
        )}
        {resendMsg && (
          <div style={{ ...s.msg, background: C.greenBg, color: C.greenText, border: `1px solid ${C.greenBorder}` }}>
            ✓ {resendMsg}
          </div>
        )}

        <div style={s.resendRow}>
          <span style={s.resendLabel}>Didn't get the email?</span>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{ ...s.resendBtn, opacity: resending ? 0.6 : 1 }}
          >
            {resending ? 'Sending...' : 'Resend'}
          </button>
        </div>

        <button onClick={onLogout} style={s.signoutBtn}>
          Use a different account
        </button>
      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: '#111110', padding: '24px 16px', boxSizing: 'border-box',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
  card: {
    width: '100%', maxWidth: '440px', background: '#fff',
    borderRadius: '20px', padding: '40px 36px',
    display: 'flex', flexDirection: 'column', gap: '20px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
  },
  iconWrap: {
    width: '56px', height: '56px', background: '#F0F9FF',
    borderRadius: '14px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', border: '1px solid #BAE6FD',
  },
  textBlock: { display: 'flex', flexDirection: 'column', gap: '8px' },
  title:     { fontSize: '22px', fontWeight: '800', color: '#0A0A0A', margin: 0, letterSpacing: '-0.3px' },
  body:      { fontSize: '14px', color: '#6B6B6B', margin: 0, lineHeight: '1.6' },
  emailPill: {
    background: '#F7F6F3', border: '1px solid #E8E6E1', borderRadius: '8px',
    padding: '8px 14px', fontSize: '14px', fontWeight: '600', color: '#1A1A1A', wordBreak: 'break-all',
  },
  steps:    { display: 'flex', flexDirection: 'column', gap: '10px' },
  stepRow:  { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  stepNum:  {
    width: '24px', height: '24px', flexShrink: 0, background: C.red, color: '#fff',
    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '800', marginTop: '1px',
  },
  stepText: { fontSize: '14px', color: '#3D3D3D', lineHeight: '1.5', paddingTop: '2px' },
  primaryBtn: {
    padding: '14px', borderRadius: '10px', border: 'none', background: C.red,
    color: '#fff', fontWeight: '700', fontSize: '15px',
    fontFamily: "'Outfit', sans-serif", cursor: 'pointer',
  },
  msg:          { padding: '10px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: '600', lineHeight: '1.5' },
  resendRow:    { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  resendLabel:  { fontSize: '13px', color: '#9E9E9E' },
  resendBtn:    {
    background: 'none', border: 'none', color: C.red, fontSize: '13px',
    fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px',
  },
  signoutBtn: {
    background: 'none', border: 'none', color: '#9E9E9E', fontSize: '13px',
    cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
    padding: '4px', textAlign: 'center', textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
};