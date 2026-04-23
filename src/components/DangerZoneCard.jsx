import { useState } from 'react';
import { C } from './styles';

export default function DangerZoneCard({ onDeleteAccount }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={s.card}>
      <div style={s.head}>
        <div style={s.eyebrow}>Danger Zone</div>
        <h3 style={s.title}>Permanent actions</h3>
        <p style={s.sub}>
          Use this only if you want to remove your entire shop and all data.
        </p>
      </div>

      {!open ? (
        <div style={s.closedRow}>
          <button type="button" onClick={() => setOpen(true)} style={s.revealBtn}>
            Show delete option
          </button>
        </div>
      ) : (
        <div style={s.openArea}>
          <div style={s.warningBox}>
            This will permanently remove your shop, staff, services, entries, expenses,
            and related records. This cannot be undone.
          </div>

          <div style={s.actions}>
            <button type="button" onClick={() => setOpen(false)} style={s.cancelBtn}>
              Cancel
            </button>
            <button type="button" onClick={onDeleteAccount} style={s.deleteBtn}>
              Delete account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  card: {
    background: '#FFF7F7',
    border: '1px solid #F7C9C9',
    borderRadius: '16px',
    overflow: 'hidden',
    minHeight: '210px',
    display: 'flex',
    flexDirection: 'column',
  },

  head: {
    padding: '18px 20px 14px',
    borderBottom: '1px solid #F3D4D4',
  },

  eyebrow: {
    fontSize: '11px',
    fontWeight: '800',
    color: '#C80815',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    marginBottom: '6px',
  },

  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
    color: '#7F1D1D',
    letterSpacing: '-0.3px',
  },

  sub: {
    margin: '8px 0 0',
    fontSize: '13px',
    color: '#7F1D1D',
    lineHeight: '1.5',
  },

  closedRow: {
    padding: '18px 20px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 1,
  },

  revealBtn: {
    border: '1px solid #F1B8B8',
    background: '#FFF0F0',
    color: '#C80815',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  openArea: {
    padding: '16px 20px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    flex: 1,
  },

  warningBox: {
    background: '#FFFDFD',
    border: '1px solid #F4C2C2',
    color: '#7F1D1D',
    borderRadius: '12px',
    padding: '12px 14px',
    fontSize: '13px',
    lineHeight: '1.55',
  },

  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },

  cancelBtn: {
    border: '1px solid #E5D5D5',
    background: '#FFFFFF',
    color: '#6B6B6B',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  deleteBtn: {
    border: 'none',
    background: '#C80815',
    color: '#FFFFFF',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
};