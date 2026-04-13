    const TAB_CONFIG = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'entries',   label: 'Income',    icon: '💰' },
    { id: 'expenses',  label: 'Expenses',  icon: '🧾' },
    { id: 'partners',  label: 'Partners',  icon: '🤝' },
    { id: 'reports',   label: 'Reports',   icon: '📈' },
    { id: 'settings',  label: 'Settings',  icon: '⚙️' },
    ];

    export default function Navbar({ currentTab, setCurrentTab }) {
    return (
        <nav style={styles.nav} role="navigation" aria-label="Main navigation">
        {TAB_CONFIG.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
            <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                style={{
                ...styles.tab,
                background: isActive ? '#c80815' : '#fff',
                color: isActive ? '#fff' : '#555555',
                border: isActive ? '1px solid #c80815' : '1px solid #e6e6e6',
                boxShadow: isActive
                    ? '0 4px 12px rgba(200,8,21,0.2)'
                    : '0 2px 6px rgba(0,0,0,0.04)',
                }}
                aria-current={isActive ? 'page' : undefined}
            >
                <span style={styles.icon}>{tab.icon}</span>
                <span style={styles.label}>{tab.label}</span>
            </button>
            );
        })}
        </nav>
    );
    }

    const styles = {
    nav: {
        display: 'flex',
        gap: '6px',
        marginBottom: '12px',
        flexWrap: 'wrap',
    },
    tab: {
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '9px 12px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '12px',
        transition: 'all 0.15s ease',
        whiteSpace: 'nowrap',
    },
    icon: {
        fontSize: '14px',
        lineHeight: 1,
    },
    label: {
        letterSpacing: '0.2px',
    },
    };