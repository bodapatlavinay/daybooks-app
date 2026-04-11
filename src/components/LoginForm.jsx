    import { useState, useEffect } from 'react';
    import { C } from './styles';

    export default function LoginForm({ mode, message, messageType, submitting, onSubmit, onToggleMode }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const fn = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', fn);
        return () => window.removeEventListener('resize', fn);
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <div style={s.page}>
        <div style={s.wrapper}>

            {/* Brand — hidden on mobile */}
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
                    {/* Fix: use div not span for flex container */}
                    <div style={s.featureCheck}>✓</div>
                    <span style={s.featureText}>{f}</span>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Auth card */}
            <form onSubmit={handleSubmit} style={s.card}>

            {/* On mobile, show compact logo inside card */}
            {isMobile && (
                <div style={s.mobileLogoRow}>
                <div style={s.mobileLogoMark}>D</div>
                <span style={s.mobileLogoText}>DayBooks</span>
                </div>
            )}

            <div style={s.cardHead}>
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
    // Fix 1: page uses flex center both axes so wrapper is always centered
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',       // vertical center
        justifyContent: 'center',   // horizontal center
        background: '#111110',
        padding: '24px 16px',
        fontFamily: "'Outfit', system-ui, sans-serif",
        boxSizing: 'border-box',
    },

    // Fix 2: wrapper centers its children vertically too
    wrapper: {
        width: '100%',
        maxWidth: '860px',
        display: 'flex',
        alignItems: 'center',       // both columns aligned to their shared center
        justifyContent: 'center',
        gap: '64px',
    },

    // Brand column — fixed: uses flex column with justifyContent center
    brand: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: '16px',
        minWidth: 0,
    },
    logoMark: {
        width: '52px', height: '52px',
        background: C.red, borderRadius: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    logoLetter: {
        fontSize: '28px', fontWeight: '900', color: '#fff',
        fontFamily: "'Outfit', sans-serif", lineHeight: 1,
    },
    brandName: {
        fontSize: '38px', fontWeight: '900', color: '#fff',
        letterSpacing: '-1px', margin: 0,
        fontFamily: "'Outfit', sans-serif",
    },
    brandTagline: {
        fontSize: '15px', color: 'rgba(255,255,255,0.45)',
        margin: 0,
    },
    features: {
        display: 'flex', flexDirection: 'column', gap: '12px',
        marginTop: '8px',
    },
    featureRow: {
        display: 'flex', alignItems: 'center', gap: '10px',
    },
    // Fix 3: div instead of span so display:flex works correctly
    featureCheck: {
        width: '20px', height: '20px',
        background: 'rgba(200,8,21,0.25)',
        color: '#FF6B6B',
        borderRadius: '50%',
        display: 'flex',          // now works because it's a div
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px', fontWeight: '800',
        flexShrink: 0,
        fontFamily: "'Outfit', sans-serif",
    },
    featureText: {
        fontSize: '14px', color: 'rgba(255,255,255,0.6)',
    },

    // Card
    card: {
        width: '100%',
        maxWidth: '400px',
        flexShrink: 0,
        background: '#fff',
        borderRadius: '16px',
        padding: '36px 32px',
        display: 'flex', flexDirection: 'column', gap: '16px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.45)',
    },

    // Mobile logo inside card
    mobileLogoRow: {
        display: 'flex', alignItems: 'center', gap: '10px',
        marginBottom: '4px',
    },
    mobileLogoMark: {
        width: '32px', height: '32px',
        background: C.red, borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '17px', fontWeight: '900', color: '#fff',
        fontFamily: "'Outfit', sans-serif",
    },
    mobileLogoText: {
        fontSize: '18px', fontWeight: '800', color: '#0A0A0A',
        fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.3px',
    },

    cardHead: { marginBottom: '4px' },
    cardTitle: {
        fontSize: '22px', fontWeight: '800', color: '#0A0A0A',
        margin: '0 0 4px', letterSpacing: '-0.3px',
        fontFamily: "'Outfit', sans-serif",
    },
    cardSub: {
        fontSize: '14px', color: '#6B6B6B', margin: 0,
    },

    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: {
        fontSize: '11px', fontWeight: '700', color: '#3D3D3D',
        textTransform: 'uppercase', letterSpacing: '0.6px',
    },
    input: {
        padding: '12px 14px', borderRadius: '9px',
        border: '1.5px solid #E8E6E1',
        fontSize: '14px', background: '#FAFAF8',
        outline: 'none', color: '#0A0A0A',
        fontFamily: "'Outfit', sans-serif",
        width: '100%', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
    },
    submitBtn: {
        padding: '13px', borderRadius: '9px', border: 'none',
        background: C.red, color: '#fff',
        fontWeight: '700', fontSize: '15px',
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: '0.2px', marginTop: '4px',
    },
    toggleBtn: {
        padding: '11px', borderRadius: '9px',
        border: '1.5px solid #E8E6E1',
        background: 'transparent', color: '#6B6B6B',
        fontWeight: '500', fontSize: '13px',
        fontFamily: "'Outfit', sans-serif",
        cursor: 'pointer', textAlign: 'center',
    },
    msg: {
        padding: '10px 14px', borderRadius: '9px',
        fontSize: '13px', fontWeight: '600',
        fontFamily: "'Outfit', sans-serif",
    },
    };