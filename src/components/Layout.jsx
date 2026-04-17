import { useState, useEffect } from 'react';
import { C } from './styles';

const NAV = [
  { id: 'dashboard', label: 'Dashboard',  Icon: IconGrid },
  { id: 'entries',   label: 'Income',     Icon: IconIncome },
  { id: 'expenses',  label: 'Expenses',   Icon: IconExpense },
  { id: 'partners',  label: 'Partners',   Icon: IconPartners },
  { id: 'reports',   label: 'Reports',    Icon: IconReports },
  { id: 'settings',  label: 'Settings',   Icon: IconSettings },
];

export default function Layout({ shop, user, currentTab, setCurrentTab, onLogout, onQuickAdd, children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return isMobile
    ? <Mobile currentTab={currentTab} setCurrentTab={setCurrentTab} shop={shop} user={user} onQuickAdd={onQuickAdd} children={children} />
    : <Desktop currentTab={currentTab} setCurrentTab={setCurrentTab} shop={shop} user={user} onLogout={onLogout} children={children} />;
}

// ── Desktop ───────────────────────────────────────────────────────────────────

function Desktop({ currentTab, setCurrentTab, shop, user, onLogout, children }) {
  const activeLabel = NAV.find(n => n.id === currentTab)?.label || 'Dashboard';

  return (
    <div style={d.shell}>
      {/* ── Sidebar ── */}
      <aside style={d.sidebar}>
        {/* Logo */}
        <div style={d.logoArea}>
          <div style={d.logoMark}>
            <span style={d.logoLetter}>D</span>
          </div>
          <div>
            <div style={d.logoName}>DayBooks</div>
            <div style={d.logoSub}>Shop Ledger</div>
          </div>
        </div>

        {/* Shop pill */}
        {shop && (
          <div style={d.shopPill}>
            <div style={d.shopDot} />
            <div>
              <div style={d.shopName}>{shop.name}</div>
              <div style={d.shopType}>{shop.category || 'Auto Shop'}</div>
            </div>
          </div>
        )}

        {/* Nav label */}
        <div style={d.navGroup}>
          <div style={d.navGroupLabel}>Menu</div>
          {NAV.map(({ id, label, Icon }) => {
            const active = currentTab === id;
            return (
              <button key={id} onClick={() => setCurrentTab(id)} style={{
                ...d.navItem,
                background: active ? C.red : 'transparent',
                color: active ? '#FFFFFF' : C.sidebarText,
              }}>
                <span style={{ color: active ? '#FFFFFF' : '#555558' }}>
                  <Icon size={16} />
                </span>
                <span style={d.navLabel}>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom user area */}
        <div style={d.sidebarFooter}>
          <div style={d.userRow}>
            <div style={d.userAvatar}>
              {(user?.email?.[0] || 'U').toUpperCase()}
            </div>
            <div style={d.userInfo}>
              <div style={d.userName}>{user?.email?.split('@')[0]}</div>
              <div style={d.userRole}>Owner</div>
            </div>
          </div>
          <button onClick={onLogout} style={d.logoutBtn}>
            <IconLogout size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={d.main}>
        {/* Top bar */}
        <div style={d.topBar}>
          <div>
            <h1 style={d.pageTitle}>{activeLabel}</h1>
            {shop?.location && (
              <div style={d.locationRow}>
                <IconPin size={12} />
                <span style={d.locationText}>{shop.location}</span>
              </div>
            )}
          </div>
          <div style={d.topRight}>
            <div style={d.liveBadge}>
              <span style={d.liveDot} />
              <span>Live</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={d.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

// ── Mobile ────────────────────────────────────────────────────────────────────

function Mobile({ currentTab, setCurrentTab, shop, onQuickAdd, children }) {
  return (
    <div style={m.shell}>
      {/* Header */}
      <div style={m.header}>
        <div style={m.headerLeft}>
          <div style={m.logoMark}><span style={m.logoLetter}>D</span></div>
          <div>
            <div style={m.shopName}>{shop?.name || 'DayBooks'}</div>
            <div style={m.shopType}>{shop?.category || 'Auto Shop'}</div>
          </div>
        </div>
        <div style={m.liveBadge}>
          <span style={m.liveDot} />
          <span style={m.liveText}>Live</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={m.content}>{children}</div>

      {/* FAB — Income and Expenses tabs only */}
      {(currentTab === 'entries' || currentTab === 'expenses') && onQuickAdd && (
        <button onClick={() => onQuickAdd(currentTab)} style={m.fab} aria-label="Quick add">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>
      )}

      {/* Bottom nav */}
      <nav style={m.tabBar}>
        {NAV.map(({ id, label, Icon }) => {
          const active = currentTab === id;
          return (
            <button key={id} onClick={() => setCurrentTab(id)} style={m.tabBtn}>
              <span style={{ color: active ? C.red : '#AEAEB2' }}><Icon size={18} /></span>
              <span style={{ ...m.tabLabel, color: active ? C.red : '#AEAEB2', fontWeight: active ? '700' : '500' }}>{label}</span>
              {active && <div style={m.activeBar} />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

// ── Desktop styles ─────────────────────────────────────────────────────────────

const d = {
  shell: { display: 'flex', height: '100vh', background: C.bg, overflow: 'hidden', fontFamily: "'Outfit', system-ui, sans-serif" },

  sidebar: {
    width: '240px',
    flexShrink: 0,
    background: C.sidebarBg,
    display: 'flex',
    flexDirection: 'column',
    borderRight: `1px solid ${C.sidebarBorder}`,
  },

  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '24px 20px 20px',
    borderBottom: `1px solid ${C.sidebarBorder}`,
  },
  logoMark: {
    width: '36px', height: '36px',
    background: C.red,
    borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  logoLetter: { fontSize: '20px', fontWeight: '900', color: '#fff', fontFamily: "'Outfit', sans-serif" },
  logoName: { fontSize: '16px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.2px' },
  logoSub: { fontSize: '11px', color: C.sidebarText, marginTop: '1px' },

  shopPill: {
    display: 'flex', alignItems: 'center', gap: '10px',
    margin: '12px 16px',
    background: '#2C2C2E',
    borderRadius: '10px',
    padding: '10px 12px',
  },
  shopDot: { width: '8px', height: '8px', background: '#34C759', borderRadius: '50%', flexShrink: 0 },
  shopName: { fontSize: '13px', fontWeight: '700', color: '#E5E5EA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  shopType: { fontSize: '11px', color: '#636366', marginTop: '1px' },

  navGroup: { flex: 1, padding: '8px 12px', overflowY: 'auto' },
  navGroupLabel: { fontSize: '10px', fontWeight: '700', color: '#48484A', textTransform: 'uppercase', letterSpacing: '1px', padding: '8px 8px 6px' },
  navItem: {
    display: 'flex', alignItems: 'center', gap: '10px',
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: 'none', cursor: 'pointer', transition: 'background 0.12s',
    fontFamily: "'Outfit', sans-serif", marginBottom: '2px',
    textAlign: 'left',
  },
  navLabel: { fontSize: '13px', fontWeight: '600' },

  sidebarFooter: {
    padding: '12px 16px 20px',
    borderTop: `1px solid ${C.sidebarBorder}`,
    display: 'flex', flexDirection: 'column', gap: '8px',
  },
  userRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' },
  userAvatar: {
    width: '32px', height: '32px',
    background: '#3A3A3C', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', color: '#E5E5EA', flexShrink: 0,
  },
  userInfo: { flex: 1, minWidth: 0 },
  userName: { fontSize: '13px', fontWeight: '600', color: '#E5E5EA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  userRole: { fontSize: '11px', color: '#636366' },
  logoutBtn: {
    display: 'flex', alignItems: 'center', gap: '7px',
    padding: '8px 10px', borderRadius: '7px',
    border: `1px solid #2C2C2E`, background: 'transparent',
    color: '#636366', cursor: 'pointer', fontSize: '12px',
    fontFamily: "'Outfit', sans-serif", fontWeight: '500',
    width: '100%', transition: 'background 0.12s',
  },

  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 },

  topBar: {
    background: C.white,
    borderBottom: `1px solid ${C.border}`,
    padding: '16px 32px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    flexShrink: 0,
  },
  pageTitle: { fontSize: '20px', fontWeight: '800', color: C.dark, margin: 0, letterSpacing: '-0.4px' },
  locationRow: { display: 'flex', alignItems: 'center', gap: '4px', marginTop: '3px' },
  locationText: { fontSize: '12px', color: C.muted },
  topRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  liveBadge: {
    display: 'flex', alignItems: 'center', gap: '6px',
    background: C.greenBg, color: C.greenText,
    fontSize: '12px', fontWeight: '600',
    padding: '5px 12px', borderRadius: '20px',
    border: `1px solid ${C.greenBorder}`,
    fontFamily: "'Outfit', sans-serif",
  },
  liveDot: { width: '6px', height: '6px', background: C.green, borderRadius: '50%' },

  content: { flex: 1, overflowY: 'auto', padding: '28px 32px' },
};

// ── Mobile styles ──────────────────────────────────────────────────────────────

const m = {
  shell: { display: 'flex', flexDirection: 'column', height: '100vh', background: C.bg, fontFamily: "'Outfit', system-ui, sans-serif", position: 'relative' },
  header: {
    background: C.white, borderBottom: `1px solid ${C.border}`,
    padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoMark: { width: '32px', height: '32px', background: C.red, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  logoLetter: { fontSize: '17px', fontWeight: '900', color: '#fff' },
  shopName: { fontSize: '14px', fontWeight: '800', color: C.dark },
  shopType: { fontSize: '11px', color: C.muted },
  liveBadge: { display: 'flex', alignItems: 'center', gap: '5px', background: C.greenBg, padding: '4px 10px', borderRadius: '20px', border: `1px solid ${C.greenBorder}` },
  liveDot: { width: '6px', height: '6px', background: C.green, borderRadius: '50%' },
  liveText: { fontSize: '11px', fontWeight: '700', color: C.greenText },
  content: { flex: 1, overflowY: 'auto', padding: '16px' },
  tabBar: {
    background: C.white, borderTop: `1px solid ${C.border}`,
    display: 'flex', flexShrink: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
  },
  tabBtn: {
    flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', gap: '3px', padding: '9px 2px 8px',
    border: 'none', background: 'transparent', cursor: 'pointer', position: 'relative',
  },
  tabLabel: { fontSize: '10px', letterSpacing: '0.1px' },
  activeBar: { position: 'absolute', top: 0, left: '25%', right: '25%', height: '2px', background: C.red, borderRadius: '0 0 2px 2px' },
  fab:       { position: 'absolute', bottom: '72px', right: '18px', width: '52px', height: '52px', borderRadius: '50%', background: C.red, border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 50 },
};

// ── Icons (inline SVG, no dependency) ─────────────────────────────────────────

function Svg({ size = 16, children, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  );
}

function IconGrid({ size }) {
  return <Svg size={size}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></Svg>;
}
function IconIncome({ size }) {
  return <Svg size={size}><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></Svg>;
}
function IconExpense({ size }) {
  return <Svg size={size}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></Svg>;
}
function IconPartners({ size }) {
  return <Svg size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></Svg>;
}
function IconReports({ size }) {
  return <Svg size={size}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></Svg>;
}
function IconSettings({ size }) {
  return <Svg size={size}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></Svg>;
}
function IconLogout({ size }) {
  return <Svg size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></Svg>;
}
function IconPin({ size }) {
  return <Svg size={size}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></Svg>;
}