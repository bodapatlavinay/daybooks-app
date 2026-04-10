    import { useState } from 'react';
    import { formStyles } from './styles';

    export default function LoginForm({ mode, message, messageType, submitting, onSubmit, onToggleMode }) {
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onSubmit({ email, password });
    }

    return (
        <div style={formStyles.page}>
        <form onSubmit={handleSubmit} style={formStyles.card}>

            <div style={{ textAlign: 'center' }}>
            <div style={s.logo}>DayBooks</div>
            <p style={s.tagline}>Your daily shop ledger</p>
            </div>

            <div style={s.field}>
            <label htmlFor="auth-email" style={s.label}>Email</label>
            <input
                id="auth-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={formStyles.input}
                autoComplete="email"
                required
            />
            </div>

            <div style={s.field}>
            <label htmlFor="auth-password" style={s.label}>Password</label>
            <input
                id="auth-password"
                name="password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={formStyles.input}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
            />
            </div>

            <button
            type="submit"
            style={{ ...formStyles.button, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
            >
            {submitting
                ? (mode === 'login' ? 'Logging in...' : 'Creating account...')
                : (mode === 'login' ? 'Login' : 'Create Account')}
            </button>

            <button
            type="button"
            onClick={onToggleMode}
            style={formStyles.secondaryButton}
            disabled={submitting}
            >
            {mode === 'login' ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
            </button>

            {message && (
            <div style={{
                ...s.message,
                background: messageType === 'error' ? '#fff0f0' : '#f0faf4',
                color:      messageType === 'error' ? '#c80815' : '#15803d',
                border:     `1px solid ${messageType === 'error' ? '#fccaca' : '#bbf0d4'}`,
            }}>
                {messageType === 'error' ? '⚠️ ' : '✓ '}{message}
            </div>
            )}
        </form>
        </div>
    );
    }

    const s = {
    logo:    { fontSize: '32px', fontWeight: '900', color: '#c80815', letterSpacing: '-1px', marginBottom: '4px' },
    tagline: { fontSize: '14px', color: '#888', margin: '0 0 8px' },
    field:   { display: 'flex', flexDirection: 'column', gap: '5px' },
    label:   { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    message: { padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600' },
    };