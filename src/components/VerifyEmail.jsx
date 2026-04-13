import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase';
import { C } from './styles';

export default function VerifyEmail({ email, onLogout, onConfirmed }) {
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [resendError, setResendError] = useState('');
  const [checking, setChecking] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const advancedRef = useRef(false);

  useEffect(() => {
    if (!document.getElementById('db-spin')) {
      const el = document.createElement('style');
      el.id = 'db-spin';
      el.textContent = '@keyframes db-spin { to { transform: rotate(360deg); } }';
      document.head.appendChild(el);
    }
  }, []);

  const advance = () => {
  if (
        advancedRef.current) return;
    advancedRef.current = true;
    setConfirmed(true);
    setTimeout(() => {
      if (onConfirmed) onConfirmed();
    }, 1200);
  };

  const checkConfirmedUser = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) throw error;

    if (user?.email_confirmed_at) {
      advance();
      return true;
    }

    return false;
  };

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === 'SIGNED_IN' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED') &&
        session?.user?.email_confirmed_at
      ) {
        advance();
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [onConfirmed]);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const ok = await checkConfirmedUser();
        if (ok) clearInterval(interval);
      } catch {}
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  async function handleCheckNow() {
    setChecking(true);
    setResendError('');
    setResendMsg('');

    try {
      const ok = await checkConfirmedUser();

      if (ok) {
        setChecking(false);
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData?.session) {
        setResendError(
          'Your email may be confirmed, but your session is not active yet. Please sign in again and continue.'
        );
        setChecking(false);
        return;
      }

      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        setResendError(
          'Your email may be confirmed, but the app needs a fresh session. Please sign out and sign back in.'
        );
        setChecking(false);
        return;
      }

      const confirmedNow = await checkConfirmedUser();

      if (!confirmedNow) {
        setResendError(
          "Your email isn't confirmed yet. Open the email we sent you, click the confirmation link, then come back and try again."
        );
      }
    } catch (err) {
      setResendError(err?.message || 'Something went wrong. Please try again.');
    }

    setChecking(false);
  }

  async function handleResend() {
    setResendMsg('');
    setResendError('');
    setResending(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        setResendError(error.message);
      } else {
        setResendMsg('New confirmation email sent! Check your inbox and spam folder.');
        setTimeout(() => setResendMsg(''), 8000);
      }
    } catch {
      setResendError('Failed to resend. Please try again.');
    }

    setResending(false);
  }

  if (confirmed) {
    return (
      <div style={s.page}>
        <div style={s.card}>
          <div
            style={{
              ...s.iconWrap,
              background: C.greenBg,
              border: `1px solid ${C.greenBorder}`,
            }}
          >
            <span style={{ fontSize: '32px' }}>✅</span>
          </div>

          <div style={s.textBlock}>
            <h1 style={s.title}>Email confirmed!</h1>
            <p style={s.body}>Your account is verified. Taking you to set up your shop now...</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
            <div
              style={{
                width: '28px',
                height: '28px',
                border: `3px solid ${C.greenBg}`,
                borderTop: `3px solid ${C.green}`,
                borderRadius: '50%',
                animation: 'db-spin 0.8s linear infinite',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.iconWrap}>
          <span style={{ fontSize: '28px' }}>✉️</span>
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
            { n: '3', text: 'Come back here and tap the button below' },
          ].map(({ n, text }) => (
            <div key={n} style={s.stepRow}>
              <div style={s.stepNum}>{n}</div>
              <span style={s.stepText}>{text}</span>
            </div>
          ))}
        </div>

        <div style={s.spamNote}>
          💡 Don't see it? Check your <strong>spam or junk folder</strong>.
        </div>

        <button
          onClick={handleCheckNow}
          style={{
            ...s.primaryBtn,
            opacity: checking ? 0.7 : 1,
            cursor: checking ? 'not-allowed' : 'pointer',
          }}
          disabled={checking}
        >
          {checking ? 'Checking...' : "✓  I've confirmed my email — continue"}
        </button>

        {resendError && (
          <div
            style={{
              ...s.msg,
              background: C.redLight,
              color: C.red,
              border: `1px solid ${C.redMid}`,
            }}
          >
            {resendError}
          </div>
        )}

        {resendMsg && (
          <div
            style={{
              ...s.msg,
              background: C.greenBg,
              color: C.greenText,
              border: `1px solid ${C.greenBorder}`,
            }}
          >
            ✓ {resendMsg}
          </div>
        )}

        <div style={s.resendRow}>
          <span style={s.resendLabel}>Didn't receive the email?</span>
          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              ...s.resendBtn,
              opacity: resending ? 0.6 : 1,
              cursor: resending ? 'not-allowed' : 'pointer',
            }}
          >
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
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111110',
    padding: '24px 16px',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '440px',
    background: '#fff',
    borderRadius: '20px',
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
  },
  iconWrap: {
    width: '56px',
    height: '56px',
    background: '#F0F9FF',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid #BAE6FD',
  },
  textBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#0A0A0A',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  body: {
    fontSize: '14px',
    color: '#6B6B6B',
    margin: 0,
    lineHeight: '1.6',
  },
  emailPill: {
    background: '#F7F6F3',
    border: '1px solid #E8E6E1',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1A1A1A',
    wordBreak: 'break-all',
  },
  steps: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  stepRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  stepNum: {
    width: '24px',
    height: '24px',
    flexShrink: 0,
    background: C.red,
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '800',
    marginTop: '1px',
  },
  stepText: {
    fontSize: '14px',
    color: '#3D3D3D',
    lineHeight: '1.5',
    paddingTop: '2px',
  },
  spamNote: {
    fontSize: '13px',
    color: C.mid,
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: '8px',
    padding: '10px 14px',
  },
  primaryBtn: {
    padding: '14px',
    borderRadius: '10px',
    border: 'none',
    background: C.red,
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
    fontFamily: "'Outfit', sans-serif",
    cursor: 'pointer',
  },
  msg: {
    padding: '10px 14px',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '600',
    lineHeight: '1.6',
  },
  resendRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
  },
  resendLabel: {
    fontSize: '13px',
    color: '#9E9E9E',
  },
  resendBtn: {
    background: 'none',
    border: 'none',
    color: C.red,
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    padding: 0,
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  signoutBtn: {
    background: 'none',
    border: 'none',
    color: '#9E9E9E',
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
    padding: '4px',
    textAlign: 'center',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
};