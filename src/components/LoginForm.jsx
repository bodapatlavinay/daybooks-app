    import { useState, useEffect } from 'react';
    import { C } from './styles';

    export default function LoginForm({ mode, message, messageType, submitting, onSubmit, onToggleMode }) {
    const [email, setEmail]           = useState('');
    const [password, setPassword]     = useState('');
    const [confirm, setConfirm]       = useState('');
    const [localError, setLocalError] = useState('');
    const [isMobile, setIsMobile]     = useState(window.innerWidth < 768);

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    // Clear confirm + error when switching modes
    useEffect(() => {
        setConfirm('');
        setLocalError('');
    }, [mode]);

    function handleSubmit(e) {
        e.preventDefault();
        setLocalError('');

        if (mode === 'signup') {
        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirm) {
            setLocalError('Passwords do not match. Please try again.');
            return;
        }
        }

        onSubmit({ email, password });
    }

    const errorMsg  = localError || (messageType === 'error' ? message : '');
    const successMsg = !localError && messageType === 'success' ? message : '';

    return (
        <div style={s.page}>
        <div style={s.wrapper}>

            {/* Brand — desktop only */}
            {!isMobile && (
            <div style={s.brand}>
                <div style={s.logoMark}>
                <span style={s.logoLetter}>D</span>
                </div>
                <h1 style={s.brandName}>DayBooks</h1>
                <p style={s.brandTagline}>Your daily shop ledger</p>
                <div style={s.features}>
                {[
                    'Track daily income & expenses',
                    'See profit in real time',
                    'Settle partner finances automatically',
                ].map((f) => (
                    <div key={f} style={s.featureRow}>
                    <div style={s.featureCheck}>✓</div>
                    <span style={s.featureText}>{f}</span>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Auth card */}
            <form onSubmit={handleSubmit} style={s.card}>

            {isMobile && (
                <div style={s.mobileLogoRow}>
                <div style={s.mobileLogoMark}>D</div>
                <span style={s.mobileLogoText}>DayBooks</span>
                </div>
            )}

            <div style={s.cardHead}>
                <h2 style={s.cardTitle}>
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p style={s.cardSub}>
                {mode === 'login' ? 'Sign in to your shop ledger' : 'Get started in seconds, free forever'}
                </p>
            </div>

            <Field label="Email address" id="auth-email">
                <input
                id="auth-email" name="email" type="email"
                placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                style={s.input} autoComplete="email" required
                />
            </Field>

            <Field label="Password" id="auth-password">
                <input
                id="auth-password" name="password" type="password"
                placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                value={password} onChange={e => setPassword(e.target.value)}
                style={s.input}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
                />
            </Field>

            {/* Confirm password — signup only */}
            {mode === 'signup' && (
                <Field label="Confirm password" id="auth-confirm">
                <input
                    id="auth-confirm" name="confirm-password" type="password"
                    placeholder="Re-enter your password"
                    value={confirm} onChange={e => setConfirm(e.target.value)}
                    style={{
                    ...s.input,
                    borderColor: confirm && confirm !== password ? C.red : undefined,
                    }}
                    autoComplete="new-password"
                    required
                />
                {confirm && confirm !== password && (
                    <span style={s.fieldError}>Passwords don't match</span>
                )}
                </Field>
            )}

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

            {errorMsg && (
                <div style={{ ...s.msg, background: C.redLight, color: C.red, border: `1px solid ${C.redMid}` }}>
                ⚠ {errorMsg}
                </div>
            )}
            {successMsg && (
                <div style={{ ...s.msg, background: C.greenBg, color: C.green, border: `1px solid ${C.greenBorder}` }}>
                ✓ {successMsg}
                </div>
            )}
            </form>
        </div>
        </div>
    );
    }

    function Field({ label, id, children }) {
    return (
        <div style={s.field}>
        <label htmlFor={id} style={s.label}>{label}</label>
        {children}
        </div>
    );
    }

    const s = {
    page: {
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#111110',
        padding: '24px 16px', boxSizing: 'border-box',
        fontFamily: "'Outfit', system-ui, sans-serif",
    },
    wrapper: {
        width: '100%', maxWidth: '860px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: '64px',
    },
    brand: {
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-start', justifyContent: 'center', gap: '16px', minWidth: 0,
    },
    logoMark: {
        width: '52px', height: '52px', background: C.red, borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoLetter: { fontSize: '28px', fontWeight: '900', color: '#fff', fontFamily: "'Outfit', sans-serif", lineHeight: 1 },
    brandName: { fontSize: '38px', fontWeight: '900', color: '#fff', letterSpacing: '-1px', margin: 0 },
    brandTagline: { fontSize: '15px', color: 'rgba(255,255,255,0.45)', margin: 0 },
    features: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' },
    featureRow: { display: 'flex', alignItems: 'center', gap: '10px' },
    featureCheck: {
        width: '20px', height: '20px', background: 'rgba(200,8,21,0.25)', color: '#FF6B6B',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '11px', fontWeight: '800', flexShrink: 0,
    },
    featureText: { fontSize: '14px', color: 'rgba(255,255,255,0.6)' },

    card: {
        width: '100%', maxWidth: '400px', flexShrink: 0,
        background: '#fff', borderRadius: '16px', padding: '36px 32px',
        display: 'flex', flexDirection: 'column', gap: '16px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
    },
    mobileLogoRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' },
    mobileLogoMark: {
        width: '32px', height: '32px', background: C.red, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '17px', fontWeight: '900', color: '#fff',
    },
    mobileLogoText: { fontSize: '18px', fontWeight: '800', color: '#0A0A0A', letterSpacing: '-0.3px' },

    cardHead: { marginBottom: '4px' },
    cardTitle: { fontSize: '22px', fontWeight: '800', color: '#0A0A0A', margin: '0 0 4px', letterSpacing: '-0.3px' },
    cardSub: { fontSize: '14px', color: '#6B6B6B', margin: 0 },

    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '11px', fontWeight: '700', color: '#3D3D3D', textTransform: 'uppercase', letterSpacing: '0.6px' },
    input: {
        padding: '12px 14px', borderRadius: '9px', border: '1.5px solid #E8E6E1',
        fontSize: '14px', background: '#FAFAF8', outline: 'none', color: '#0A0A0A',
        fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    },
    fieldError: { fontSize: '12px', color: C.red, fontWeight: '500' },

    submitBtn: {
        padding: '13px', borderRadius: '9px', border: 'none',
        background: C.red, color: '#fff', fontWeight: '700', fontSize: '15px',
        fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2px', marginTop: '4px',
    },
    toggleBtn: {
        padding: '11px', borderRadius: '9px', border: '1.5px solid #E8E6E1',
        background: 'transparent', color: '#6B6B6B', fontWeight: '500', fontSize: '13px',
        fontFamily: "'Outfit', sans-serif", cursor: 'pointer', textAlign: 'center',
    },
    msg: { padding: '10px 14px', borderRadius: '9px', fontSize: '13px', fontWeight: '600' },
    };