import { useState, useEffect } from 'react';
import { C } from './styles';
import { resetPassword } from '../auth';

// ── Icons ─────────────────────────────────────────────────────────────────────

function Svg({ size = 20, color = 'currentColor', children }) {
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

function IconCheck({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <polyline points="20 6 9 17 4 12"/>
    </Svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function LoginForm({ mode, message, messageType, submitting, onSubmit, onToggleMode }) {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [localError, setLocalError] = useState('');

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const [forgotMode, setForgotMode]       = useState(false);
  const [forgotEmail, setForgotEmail]     = useState('');
  const [forgotSent, setForgotSent]       = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError]     = useState('');

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  useEffect(() => {
    setConfirm(''); setLocalError('');
    setForgotMode(false); setForgotSent(false);
    setForgotError(''); setForgotEmail('');
  }, [mode]);

  function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');
    if (mode === 'signup') {
      if (password.length < 6) { setLocalError('Password must be at least 6 characters.'); return; }
      if (password !== confirm) { setLocalError('Passwords do not match.'); return; }
    }
    onSubmit({ email, password });
  }

  async function handleForgotSubmit(e) {
    e.preventDefault();
    setForgotError('');
    if (!forgotEmail.trim()) { setForgotError('Please enter your email address.'); return; }
    setForgotLoading(true);
    const { error } = await resetPassword(forgotEmail.trim());
    setForgotLoading(false);
    if (error) { setForgotError(error.message); return; }
    setForgotSent(true);
  }

  const errorMsg   = localError || (messageType === 'error'   ? message : '');
  const successMsg = !localError && messageType === 'success' ? message : '';

  // ── Forgot password screen ────────────────────────────────────────────────
  if (forgotMode) {
    return (
      <div style={s.page}>
        <div style={s.wrapper}>
          {!isMobile && <BrandSection />}
          <div style={s.card}>
            {isMobile && <MobileLogo />}

            {forgotSent ? (
              <div style={s.sentWrap}>
                {/* Icon circle */}
                <div style={s.sentIconWrap}>
                  <IconMail size={28} color="#0284C7" />
                </div>

                <h2 style={s.cardTitle}>Check your inbox</h2>
                <p style={s.cardSub}>
                  We sent a password reset link to <strong>{forgotEmail}</strong>.
                  Click the link in the email to reset your password.
                </p>
                <p style={{ ...s.cardSub, fontSize: '12px', color: C.muted, marginTop: '4px' }}>
                  Don't see it? Check your spam or junk folder.
                </p>
                <button style={s.submitBtn}
                  onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail(''); }}>
                  Back to sign in
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} style={s.formBody}>
                <div style={s.cardHead}>
                  <h2 style={s.cardTitle}>Reset your password</h2>
                  <p style={s.cardSub}>Enter your email and we'll send you a reset link.</p>
                </div>

                <Field label="Email address" id="forgot-email">
                  <input id="forgot-email" name="email" type="email"
                    placeholder="you@example.com"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)}
                    style={s.input} autoComplete="email" required autoFocus />
                </Field>

                {forgotError && <div style={s.errorBox}>⚠ {forgotError}</div>}

                <button type="submit"
                  style={{ ...s.submitBtn, opacity: forgotLoading ? 0.7 : 1, cursor: forgotLoading ? 'not-allowed' : 'pointer' }}
                  disabled={forgotLoading}>
                  {forgotLoading ? 'Sending...' : 'Send reset link'}
                </button>

                <button type="button" style={s.toggleBtn} onClick={() => setForgotMode(false)}>
                  ← Back to sign in
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Login / Signup screen ─────────────────────────────────────────────────
  return (
    <div style={s.page}>
      <div style={s.wrapper}>
        {!isMobile && <BrandSection />}
        <form onSubmit={handleSubmit} style={s.card}>
          {isMobile && <MobileLogo />}

          <div style={s.cardHead}>
            <h2 style={s.cardTitle}>
              {mode === 'login' ? 'Welcome back' : 'Create your account'}
            </h2>
            <p style={s.cardSub}>
              {mode === 'login'
                ? 'Sign in to your shop ledger'
                : 'Free to start — set up your shop in minutes'}
            </p>
          </div>

          <Field label="Email address" id="auth-email">
            <input id="auth-email" name="email" type="email"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              style={s.input} autoComplete="email" required />
          </Field>

          <Field label="Password" id="auth-password">
            <input id="auth-password" name="password" type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
              value={password} onChange={e => setPassword(e.target.value)}
              style={s.input}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required />
          </Field>

          {mode === 'signup' && (
            <Field label="Confirm password" id="auth-confirm">
              <input id="auth-confirm" name="confirm-password" type="password"
                placeholder="Re-enter your password"
                value={confirm} onChange={e => setConfirm(e.target.value)}
                style={{ ...s.input, borderColor: confirm && confirm !== password ? C.red : C.border }}
                autoComplete="new-password" required />
              {confirm && confirm !== password && (
                <span style={s.fieldError}>Passwords don't match</span>
              )}
            </Field>
          )}

          {mode === 'login' && (
            <div style={s.forgotRow}>
              <button type="button" style={s.forgotBtn}
                onClick={() => { setForgotMode(true); setForgotEmail(email); }}>
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit"
            style={{ ...s.submitBtn, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}>
            {submitting
              ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
              : (mode === 'login' ? 'Sign in' : 'Create account')}
          </button>

          <button type="button" onClick={onToggleMode} style={s.toggleBtn} disabled={submitting}>
            {mode === 'login'
              ? "Don't have an account? Sign up free"
              : 'Already have an account? Sign in'}
          </button>

          {errorMsg && <div style={s.errorBox}>⚠ {errorMsg}</div>}
          {successMsg && <div style={s.successBox}>✓ {successMsg}</div>}

          {mode === 'signup' && !errorMsg && !successMsg && (
            <p style={s.hint}>
              After signing up, check your email to verify your account before logging in.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, id, children }) {
  return (
    <div style={s.field}>
      <label htmlFor={id} style={s.label}>{label}</label>
      {children}
    </div>
  );
}

function BrandSection() {
  return (
    <div style={s.brand}>
      <div style={s.logoMark}><span style={s.logoLetter}>D</span></div>
      <h1 style={s.brandName}>DayBooks</h1>
      <p style={s.brandTagline}>Your daily shop ledger</p>
      <div style={s.features}>
        {[
          'Track daily income & expenses',
          'See profit in real time',
          'Settle partner finances automatically',
        ].map(f => (
          <div key={f} style={s.featureRow}>
            <div style={s.featureCheck}><IconCheck size={11} color="#FF6B6B" /></div>
            <span style={s.featureText}>{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileLogo() {
  return (
    <div style={s.mobileLogoRow}>
      <div style={s.mobileLogoMark}>D</div>
      <span style={s.mobileLogoText}>DayBooks</span>
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  page:    { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111110', padding: '24px 16px', boxSizing: 'border-box', fontFamily: "'Outfit', system-ui, sans-serif" },
  wrapper: { width: '100%', maxWidth: '860px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '64px' },

  brand:        { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center', gap: '16px', minWidth: 0 },
  logoMark:     { width: '52px', height: '52px', background: C.red, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoLetter:   { fontSize: '28px', fontWeight: '900', color: '#fff', lineHeight: 1 },
  brandName:    { fontSize: '38px', fontWeight: '900', color: '#fff', letterSpacing: '-1px', margin: 0 },
  brandTagline: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', margin: 0 },
  features:     { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' },
  featureRow:   { display: 'flex', alignItems: 'center', gap: '10px' },
  featureCheck: { width: '20px', height: '20px', background: 'rgba(200,8,21,0.25)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  featureText:  { fontSize: '14px', color: 'rgba(255,255,255,0.6)' },

  card:     { width: '100%', maxWidth: '400px', flexShrink: 0, background: '#fff', borderRadius: '16px', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 32px 80px rgba(0,0,0,0.45)' },
  formBody: { display: 'flex', flexDirection: 'column', gap: '16px' },

  mobileLogoRow:  { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
  mobileLogoMark: { width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '17px', fontWeight: '900', color: '#fff' },
  mobileLogoText: { fontSize: '18px', fontWeight: '800', color: '#0A0A0A', letterSpacing: '-0.3px' },

  cardHead:  { marginBottom: '4px' },
  cardTitle: { fontSize: '22px', fontWeight: '800', color: '#0A0A0A', margin: '0 0 4px', letterSpacing: '-0.3px' },
  cardSub:   { fontSize: '14px', color: '#6B6B6B', margin: 0, lineHeight: '1.5' },

  field:      { display: 'flex', flexDirection: 'column', gap: '6px' },
  label:      { fontSize: '11px', fontWeight: '700', color: '#3D3D3D', textTransform: 'uppercase', letterSpacing: '0.6px' },
  fieldError: { fontSize: '12px', color: C.red, fontWeight: '500' },
  input:      { padding: '12px 14px', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: '#FAFAF8', outline: 'none', color: '#0A0A0A', fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },

  forgotRow: { display: 'flex', justifyContent: 'flex-end', marginTop: '-8px' },
  forgotBtn: { background: 'none', border: 'none', color: C.mid, fontSize: '13px', cursor: 'pointer', padding: 0, fontFamily: "'Outfit', sans-serif", textDecoration: 'underline', textUnderlineOffset: '2px' },

  submitBtn: { padding: '13px', borderRadius: '9px', border: 'none', background: C.red, color: '#fff', fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", marginTop: '4px', cursor: 'pointer' },
  toggleBtn: { padding: '11px', borderRadius: '9px', border: `1.5px solid ${C.border}`, background: 'transparent', color: '#6B6B6B', fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', textAlign: 'center' },

  errorBox:   { padding: '10px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: '600', background: C.redLight, color: C.red, border: `1px solid ${C.redMid}`, lineHeight: '1.5' },
  successBox: { padding: '10px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: '600', background: C.greenBg, color: C.greenText, border: `1px solid ${C.greenBorder}` },
  hint:       { fontSize: '12px', color: C.muted, margin: 0, textAlign: 'center', lineHeight: '1.6' },

  sentWrap:     { display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', textAlign: 'center', padding: '8px 0' },
  sentIconWrap: { width: '64px', height: '64px', borderRadius: '18px', background: '#F0F9FF', border: '1px solid #BAE6FD', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};