import { useState } from 'react';
import { C } from './styles';

export default function ServiceTypesCard({
  services = [],
  onAddService,
  onEditService,
  onDeleteService,
  submitting = false,
}) {
  const [serviceName, setServiceName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [draftName, setDraftName] = useState('');

  function handleAdd(e) {
    e.preventDefault();
    if (!serviceName.trim()) return;
    onAddService?.(serviceName.trim());
    setServiceName('');
  }

  function startEdit(item) {
    setEditingId(item.id);
    setDraftName(item.name || '');
  }

  function cancelEdit() {
    setEditingId(null);
    setDraftName('');
  }

  function saveEdit(id) {
    if (!draftName.trim()) return;
    onEditService?.(id, draftName.trim());
    setEditingId(null);
    setDraftName('');
  }

  return (
    <div style={s.card}>
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>Shop & Services</div>
          <h3 style={s.title}>Service Types</h3>
          <p style={s.sub}>
            Keep high-frequency shop jobs visible and easy to manage.
          </p>
        </div>
      </div>

      <form onSubmit={handleAdd} style={s.addRow}>
        <div style={{ flex: 1 }}>
          <label htmlFor="service-name-add" style={s.srOnly}>
            Add service type
          </label>
          <input
            id="service-name-add"
            name="service-name-add"
            type="text"
            placeholder="e.g. Tire Sale, Balancing, Oil Change..."
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            style={s.addInput}
            autoComplete="off"
          />
        </div>

        <button
          type="submit"
          style={{
            ...s.addBtn,
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'not-allowed' : 'pointer',
          }}
          disabled={submitting}
        >
          {submitting ? '...' : 'Add'}
        </button>
      </form>

      <div style={s.listWrap}>
        {services.length === 0 ? (
          <div style={s.empty}>
            <div style={s.emptyTitle}>No services yet</div>
            <div style={s.emptySub}>
              Add your first service so staff can record jobs faster.
            </div>
          </div>
        ) : (
          services.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <div key={item.id} style={s.row}>
                <div style={s.left}>
                  {isEditing ? (
                    <div style={{ width: '100%' }}>
                      <label htmlFor={`service-edit-${item.id}`} style={s.srOnly}>
                        Edit service name
                      </label>
                      <input
                        id={`service-edit-${item.id}`}
                        name={`service-edit-${item.id}`}
                        type="text"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        style={s.editInput}
                        autoFocus
                        autoComplete="off"
                      />
                    </div>
                  ) : (
                    <span style={s.serviceName}>{item.name}</span>
                  )}
                </div>

                <div style={s.actions}>
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        onClick={() => saveEdit(item.id)}
                        style={s.saveBtn}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        style={s.cancelBtn}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        style={s.editBtn}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteService?.(item.id)}
                        style={s.deleteBtn}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const s = {
  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  eyebrow: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    marginBottom: '6px',
  },

  title: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '800',
    color: C.dark,
    letterSpacing: '-0.3px',
  },

  sub: {
    margin: '8px 0 0',
    fontSize: '13px',
    color: C.mid,
    lineHeight: '1.5',
  },

  addRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },

  addInput: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${C.border}`,
    background: C.surface,
    color: C.dark,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  addBtn: {
    border: 'none',
    background: C.red,
    color: C.white,
    borderRadius: '10px',
    padding: '12px 18px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
    flexShrink: 0,
  },

  listWrap: {
    display: 'flex',
    flexDirection: 'column',
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 0',
    borderTop: `1px solid ${C.border}`,
  },

  left: {
    flex: 1,
    minWidth: 0,
  },

  serviceName: {
    fontSize: '14px',
    fontWeight: '600',
    color: C.dark,
    wordBreak: 'break-word',
  },

  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexShrink: 0,
  },

  editInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: `1.5px solid ${C.borderMid}`,
    background: C.white,
    color: C.dark,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  editBtn: {
    border: `1px solid ${C.border}`,
    background: C.white,
    color: C.dark,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  saveBtn: {
    border: 'none',
    background: C.dark,
    color: C.white,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  cancelBtn: {
    border: `1px solid ${C.border}`,
    background: C.white,
    color: C.mid,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  deleteBtn: {
    border: `1px solid ${C.redMid}`,
    background: C.redLight,
    color: C.red,
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  empty: {
    borderTop: `1px solid ${C.border}`,
    padding: '18px 0 4px',
  },

  emptyTitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: C.dark,
    marginBottom: '6px',
  },

  emptySub: {
    fontSize: '13px',
    color: C.mid,
    lineHeight: '1.5',
  },

  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};