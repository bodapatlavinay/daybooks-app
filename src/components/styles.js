// ── Design System ─────────────────────────────────────────────────────────────
// One accent (red), everything else warm neutrals.
// Inspired by Stripe, Mercury, Linear dashboard aesthetics.

export const C = {
  // Brand accent — used sparingly
  red:        '#C80815',
  redHover:   '#A8060F',
  redLight:   '#FEF0F0',
  redMid:     '#FACACA',

  // Neutrals — warm, not cold
  bg:         '#F7F6F3',   // warm off-white page background
  bgSecond:   '#EFEDE8',   // slightly darker for depth
  white:      '#FFFFFF',
  black:      '#0A0A0A',
  charcoal:   '#1C1C1E',   // sidebar background
  dark:       '#1A1A1A',   // primary text
  body:       '#3D3D3D',   // body text
  mid:        '#6B6B6B',   // secondary text
  muted:      '#9E9E9E',   // placeholder / meta text
  faint:      '#C8C8C8',   // subtle borders

  // Borders
  border:     '#E8E6E1',   // warm border
  borderMid:  '#D4D1CB',   // slightly stronger

  // Surfaces
  surface:    '#FAFAF8',   // card inner bg

  // Semantic
  green:      '#16A34A',
  greenBg:    '#F0FDF4',
  greenBorder:'#86EFAC',
  greenText:  '#15803D',

  amber:      '#B45309',
  amberBg:    '#FFFBEB',
  amberBorder:'#FCD34D',

  // Sidebar
  sidebarBg:      '#1C1C1E',
  sidebarBorder:  '#2C2C2E',
  sidebarText:    '#8E8E93',
  sidebarHover:   '#2C2C2E',
  sidebarActive:  '#FFFFFF',
};

// ── Shared auth form styles ────────────────────────────────────────────────────
export const formStyles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#111110',
    padding: '24px 16px',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: C.white,
    padding: '40px 36px',
    borderRadius: '16px',
    boxShadow: '0 32px 80px rgba(0,0,0,0.35)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  input: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    background: C.surface,
    outline: 'none',
    color: C.dark,
    fontFamily: "'Outfit', system-ui, sans-serif",
    transition: 'border-color 0.15s',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    background: C.red,
    color: C.white,
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Outfit', system-ui, sans-serif",
    letterSpacing: '0.2px',
  },
  secondaryButton: {
    padding: '11px',
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    background: 'transparent',
    color: C.mid,
    fontWeight: '500',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};