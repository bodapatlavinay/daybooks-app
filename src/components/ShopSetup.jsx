    import { useState } from 'react';
    import { formStyles } from './styles';

    export default function ShopSetup({ user, message, messageType, submitting, onCreateShop, onLogout }) {
    const [shopName, setShopName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        onCreateShop(shopName);
    }

    return (
        <div style={formStyles.page}>
        <form onSubmit={handleSubmit} style={formStyles.card}>

            <div style={{ textAlign: 'center' }}>
            <div style={s.logo}>DayBooks</div>
            <h2 style={s.heading}>Create Your Shop</h2>
            <p style={s.welcome}>Welcome, {user.email}</p>
            </div>

            <p style={s.hint}>
            Enter your business name. We'll automatically add common tire &amp; auto
            service types so you can start recording income straight away.
            </p>

            <div style={s.field}>
            <label htmlFor="shop-name-setup" style={s.label}>Business Name</label>
            <input
                id="shop-name-setup"
                name="shop-name"
                type="text"
                placeholder="e.g. Mike's Tire & Auto"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                style={formStyles.input}
                autoComplete="organization"
                autoFocus
                required
            />
            </div>

            <button
            type="submit"
            style={{ ...formStyles.button, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
            >
            {submitting ? 'Setting up shop...' : 'Create Shop'}
            </button>

            <button
            type="button"
            onClick={onLogout}
            style={formStyles.secondaryButton}
            disabled={submitting}
            >
            Logout
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
    logo:    { fontSize: '28px', fontWeight: '900', color: '#c80815', letterSpacing: '-1px', marginBottom: '8px' },
    heading: { margin: '0 0 4px', fontSize: '20px', fontWeight: '800', color: '#111' },
    welcome: { margin: 0, fontSize: '13px', color: '#888' },
    field:   { display: 'flex', flexDirection: 'column', gap: '5px' },
    label:   { fontSize: '12px', fontWeight: '700', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' },
    hint:    { margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6', background: '#f9f9f9', border: '1px solid #eee', borderRadius: '10px', padding: '12px 14px' },
    message: { padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600' },
    };