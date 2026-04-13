    import { useState } from 'react';
    import { formStyles } from './styles';

    export default function ServicesForm({ onAddService, submitting }) {
    const [serviceName, setServiceName] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (!serviceName.trim()) return;
        onAddService(serviceName);
        setServiceName('');
    }

    return (
        <form onSubmit={handleSubmit} style={{ ...formStyles.formSection, borderTop: 'none', paddingTop: 0 }}>
        <div style={s.row}>
            <div style={{ flex: 1 }}>
            <label htmlFor="service-name" style={s.srOnly}>Service name</label>
            <input
                id="service-name"
                name="service-name"
                type="text"
                placeholder="e.g. Tire Sale, Balancing, Oil Change..."
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                style={{ ...formStyles.input, marginBottom: 0 }}
                autoComplete="off"
                required
            />
            </div>
            <button
            type="submit"
            style={{ ...formStyles.button, padding: '13px 20px', flexShrink: 0, opacity: submitting ? 0.7 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}
            disabled={submitting}
            >
            {submitting ? '...' : 'Add'}
            </button>
        </div>
        </form>
    );
    }

    const s = {
    row: { display: 'flex', gap: '8px', alignItems: 'center' },
    // Visually hidden but readable by screen readers and satisfies the label requirement
    srOnly: { position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 },
    };