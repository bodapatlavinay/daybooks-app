import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { C } from './styles';

// ── Icons ─────────────────────────────────────────────────────────────────────

function Svg({ size = 24, color = 'currentColor', children }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function IconMail({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </Svg>
  );
}

function IconCheckCircle({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function VerifyEmail({ email, onLogout, onConfirmed }) {
  const [resending, setResending]     = useState(false);
  const [resendMsg, setResendMsg]     = useState('');
  const [resendError, setResendError] = useState('');
  const [checking, setChecking]       = useState(false);
  const [confirmed, setConfirmed]     = useState(false);
  const advancedRef                   = useRef(false);

  // Spinner keyframes
  useEffect(() => {
    if (!document.getElementById('db-spin')) {
      const el = document.createElement('style');
      el.id = 'db-spin';
      el.textContent = '@keyframes db-spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(el);
    }
  }, []);

  function advance() {
    if (advancedRef.current) return;
    advancedRef.current = true;
    setConfirmed(true);
    setTimeout(() => { if (onConfirmed) onConfirmed(); }, 1200);
  }

  async function checkConfirmedUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (user?.email_confirmed_at) { advance(); return true; }
    return false;
  }

  // Listen for auth state changes (e.g. user confirms in another tab)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (['SIGNED_IN','TOKEN_REFRESHED','USER_UPDATED'].includes(event) && session?.user?.email_confirmed_at) {
        advance();
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  // Poll every 4s as fallback
  useEffect(() => {
    const interval = setInterval(async () => {
      try { const ok = await checkConfirmedUser(); if (ok) clearInterval(interval); } catch {}
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  async function handleCheckNow() {
    setChecking(true);
    setResendError('');
    setResendMsg('');
    try {
      const ok = await checkConfirmedUser();
      if (ok) { setChecking(false); return; }

      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        setResendError('Your email may be confirmed but your session is not active. Please sign in again.');
        setChecking(false); return;
      }

      await supabase.auth.refreshSession();
      const confirmedNow = await checkConfirmedUser();
      if (!confirmedNow) {
        setResendError("Your email isn't confirmed yet. Open the email we sent you, click the confirmation link, then try again.");
      }
    } catch (err) {
      setResendError(err?.message || 'Something went wrong. Please try again.');
    }
    setChecking(false);
  }

  async function handleResend() {
    setResendMsg(''); setResendError('');
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) { setResendError(error.message); }
      else {
        setResendMsg('New confirmation email sent! Check your inbox and spam folder.');
        setTimeout(() => setResendMsg(''), 8000);
      }
    } catch { setResendError('Failed to resend. Please try again.'); }
    setResending(false);
  }

  // ── Confirmed ─────────────────────────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div style={{ ...s.iconWrap, background: C.greenBg, border: `1px solid ${C.greenBorder}` }}>
            <IconCheckCircle size={28} color={C.green} />
          </div>
          <div style={s.textBlock}>
            <h1 style={s.title}>Email confirmed!</h1>
            <p style={s.body}>Your account is verified. Taking you to set up your shop now...</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <div style={{ width: '28px', height: '28px', border: `3px solid ${C.greenBg}`, borderTop: `3px solid ${C.green}`, borderRadius: '50%', animation: 'db-spin 0.8s linear infinite' }} />
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
          <IconMail size={26} color="#0284C7" />
        </div>

        <div style={s.textBlock}>
          <h1 style={s.title}>Check your email</h1>
          <p style={s.body}>We sent a confirmation link to:</p>
          <div style={s.emailPill}>{email}</div>
        </div>

        <div style={s.steps}>
          {[
            { n: '1', text: 'Open your email inbox' },
            { n: '2', text: 'Click "Confirm my account" in the email' },
            
          ].map(({ n, text }) => (
            <div key={n} style={s.stepRow}>
              <div style={s.stepNum}>{n}</div>
              <span style={s.stepText}>{text}</span>
            </div>
          ))}
        </div>

        <div style={s.spamNote}>
          <IconMail size={14} color={C.mid} />
          &nbsp; Don't see it? Check your <strong>spam or junk folder</strong>.
        </div>

        {/* <button onClick={handleCheckNow}
          style={{ ...s.primaryBtn, opacity: checking ? 0.7 : 1, cursor: checking ? 'not-allowed' : 'pointer' }}
          disabled={checking}>
          {checking ? 'Checking...' : "✓  I've confirmed my email — continue"}
        </button> */}

        {resendError && (
          <div style={{ ...s.msg, background: C.redLight, color: C.red, border: `1px solid ${C.redMid}` }}>
            {resendError}
          </div>
        )}
        {resendMsg && (
          <div style={{ ...s.msg, background: C.greenBg, color: C.greenText, border: `1px solid ${C.greenBorder}` }}>
            ✓ {resendMsg}
          </div>
        )}

        <div style={s.resendRow}>
          <span style={s.resendLabel}>Didn't receive the email?</span>
          <button onClick={handleResend} disabled={resending}
            style={{ ...s.resendBtn, opacity: resending ? 0.6 : 1, cursor: resending ? 'not-allowed' : 'pointer' }}>
            {resending ? 'Sending...' : 'Resend email'}
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
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111110', padding: '24px 16px', boxSizing: 'border-box', fontFamily: "'Outfit', system-ui, sans-serif" },
  card: { width: '100%', maxWidth: '440px', background: '#fff', borderRadius: '20px', padding: '40px 36px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' },
  iconWrap: { width: '56px', height: '56px', background: '#F0F9FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #BAE6FD' },
  textBlock: { display: 'flex', flexDirection: 'column', gap: '8px' },
  title:     { fontSize: '22px', fontWeight: '800', color: '#0A0A0A', margin: 0, letterSpacing: '-0.3px' },
  body:      { fontSize: '14px', color: '#6B6B6B', margin: 0, lineHeight: '1.6' },
  emailPill: { background: '#F7F6F3', border: '1px solid #E8E6E1', borderRadius: '8px', padding: '8px 14px', fontSize: '14px', fontWeight: '600', color: '#1A1A1A', wordBreak: 'break-all' },
  steps:     { display: 'flex', flexDirection: 'column', gap: '10px' },
  stepRow:   { display: 'flex', alignItems: 'flex-start', gap: '12px' },
  stepNum:   { width: '24px', height: '24px', flexShrink: 0, background: C.red, color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', marginTop: '1px' },
  stepText:  { fontSize: '14px', color: '#3D3D3D', lineHeight: '1.5', paddingTop: '2px' },
  spamNote:  { display: 'flex', alignItems: 'center', fontSize: '13px', color: C.mid, background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 14px', gap: '4px' },
  primaryBtn:{ padding: '14px', borderRadius: '10px', border: 'none', background: C.red, color: '#fff', fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
  msg:       { padding: '10px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: '600', lineHeight: '1.6' },
  resendRow: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' },
  resendLabel:{ fontSize: '13px', color: '#9E9E9E' },
  resendBtn: { background: 'none', border: 'none', color: C.red, fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: 0, textDecoration: 'underline', textUnderlineOffset: '2px' },
  signoutBtn:{ background: 'none', border: 'none', color: '#9E9E9E', fontSize: '13px', cursor: 'pointer', fontFamily: "'Outfit', sans-serif", padding: '4px', textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '2px' },
};