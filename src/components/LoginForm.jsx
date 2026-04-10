    import { useState } from 'react';
    import { formStyles, C } from './styles';

    export default function LoginForm({ mode, message, messageType, submitting, onSubmit, onToggleMode }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <div style={formStyles.page}>
        <div style={s.wrapper}>
            {/* Brand side */}
            <div style={s.brand}>
            <div style={s.logo}>
                <span style={s.logoD}>D</span>
            </div>
            <h1 style={s.brandName}>DayBooks</h1>
            <p style={s.brandTagline}>Your daily shop ledger</p>
            <div style={s.brandFeatures}>
                {['Track daily income & expenses', 'See profit in real time', 'Settle partner finances automatically'].map((f) => (
                <div key={f} style={s.featureRow}>
                    <span style={s.featureDot}>✓</span>
                    <span style={s.featureText}>{f}</span>
                </div>
                ))}
            </div>
            </div>

            {/* Auth card */}
            <form onSubmit={handleSubmit} style={s.card}>
            <div style={s.cardHeader}>
                <h2 style={s.cardTitle}>
                {mode === 'login' ? 'Welcome back' : 'Get started free'}
                </h2>
                <p style={s.cardSub}>
                {mode === 'login' ? 'Sign in to your shop ledger' : 'Create your account in seconds'}
                </p>
            </div>

            <div style={s.field}>
                <label htmlFor="auth-email" style={s.label}>Email address</label>
                <input
                id="auth-email" name="email" type="email"
                placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                style={s.input} autoComplete="email" required
                />
            </div>

            <div style={s.field}>
                <label htmlFor="auth-password" style={s.label}>Password</label>
                <input
                id="auth-password" name="password" type="password"
                placeholder="Your password"
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={s.input}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                />
            </div>

            <button type="submit" style={{
                ...s.submitBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
            }} disabled={submitting}>
                {submitting
                ? (mode === 'login' ? 'Signing in...' : 'Creating account...')
                : (mode === 'login' ? 'Sign in' : 'Create account')}
            </button>

            <button type="button" onClick={onToggleMode} style={s.toggleBtn} disabled={submitting}>
                {mode === 'login'
                ? "Don't have an account? Sign up free"
                : 'Already have an account? Sign in'}
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
        </div>
    );
    }

    const s = {
    wrapper: {
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        gap: '48px',
        alignItems: 'center',
    },
    // Brand left side
    brand: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', '@media(max-width:640px)': { display: 'none' } },
    logo: { width: '56px', height: '56px', background: C.red, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    logoD: { fontSize: '32px', fontWeight: '900', color: C.white, fontFamily: "'Outfit', sans-serif", lineHeight: 1 },
    brandName: { fontSize: '36px', fontWeight: '900', color: C.white, letterSpacing: '-1px', margin: 0 },
    brandTagline: { fontSize: '16px', color: 'rgba(255,255,255,0.55)', margin: 0 },
    brandFeatures: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' },
    featureRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    featureDot: { width: '20px', height: '20px', background: 'rgba(200,8,21,0.3)', color: C.red, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', flexShrink: 0 },
    featureText: { fontSize: '14px', color: 'rgba(255,255,255,0.65)' },
    // Card
    card: { flex: 1, background: C.white, borderRadius: '20px', padding: '36px', display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', maxWidth: '400px', width: '100%' },
    cardHeader: { marginBottom: '4px' },
    cardTitle: { fontSize: '22px', fontWeight: '800', color: C.black, margin: '0 0 4px', letterSpacing: '-0.3px' },
    cardSub: { fontSize: '14px', color: C.mid, margin: 0 },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '12px', fontWeight: '600', color: C.dark, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: { padding: '12px 14px', borderRadius: '10px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: C.surface, outline: 'none', color: C.black, fontFamily: "'Outfit', sans-serif", transition: 'border-color 0.15s', width: '100%', boxSizing: 'border-box' },
    submitBtn: { padding: '13px', borderRadius: '10px', border: 'none', background: C.red, color: C.white, fontWeight: '700', fontSize: '15px', fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2px', cursor: 'pointer', marginTop: '4px' },
    toggleBtn: { padding: '10px', borderRadius: '10px', border: `1.5px solid ${C.border}`, background: 'transparent', color: C.mid, fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer', textAlign: 'center' },
    msg: { padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif" },
    };