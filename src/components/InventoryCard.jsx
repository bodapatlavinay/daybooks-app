import { useMemo, useState } from 'react';
import { C } from './styles';

function moneyFromCents(cents) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function emptyForm() {
  return {
    name: '',
    brand: '',
    size: '',
    quantity: '',
    cost_price: '',
    sell_price: '',
    low_stock_threshold: '',
  };
}

export default function InventoryCard({
  items = [],
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  submitting = false,
}) {
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState(emptyForm());

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aq = Number(a.quantity_on_hand || 0);
      const bq = Number(b.quantity_on_hand || 0);
      return aq - bq;
    });
  }, [items]);

  function updateForm(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateEdit(key, value) {
    setEditDraft((f) => ({ ...f, [key]: value }));
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    onAddItem?.({
      name: form.name.trim(),
      brand: form.brand.trim(),
      size: form.size.trim(),
      quantity: Number(form.quantity || 0),
      cost_price: Number(form.cost_price || 0),
      sell_price: Number(form.sell_price || 0),
      low_stock_threshold: Number(form.low_stock_threshold || 0),
    });

    setForm(emptyForm());
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditDraft({
      name: item.name || '',
      brand: item.brand || '',
      size: item.size || '',
      quantity: String(item.quantity_on_hand ?? ''),
      cost_price: String((Number(item.cost_cents || 0) / 100).toFixed(2)),
      sell_price: String((Number(item.sell_price_cents || 0) / 100).toFixed(2)),
      low_stock_threshold: String(item.low_stock_threshold ?? ''),
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(emptyForm());
  }

  function saveEdit(id) {
    if (!editDraft.name.trim()) return;

    onUpdateItem?.(id, {
      name: editDraft.name.trim(),
      brand: editDraft.brand.trim(),
      size: editDraft.size.trim(),
      quantity: Number(editDraft.quantity || 0),
      cost_price: Number(editDraft.cost_price || 0),
      sell_price: Number(editDraft.sell_price || 0),
      low_stock_threshold: Number(editDraft.low_stock_threshold || 0),
    });

    setEditingId(null);
    setEditDraft(emptyForm());
  }

  return (
    <div style={s.wrap}>
      <div style={s.grid}>
        <div style={s.card}>
          <div style={s.head}>
            <div style={s.eyebrow}>Inventory</div>
            <h3 style={s.title}>Add Inventory Item</h3>
            <p style={s.sub}>
              Track stock, cost, selling price, and low-stock warning levels.
            </p>
          </div>

          <form onSubmit={handleAdd} style={s.form} name="inventory-add-form">
            <div style={s.row2}>
              <Field label="Item name" id="inv-name">
                <input
                  id="inv-name"
                  name="inv-name"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="e.g. Tire"
                  style={s.input}
                  autoComplete="off"
                  required
                />
              </Field>

              <Field label="Brand" id="inv-brand">
                <input
                  id="inv-brand"
                  name="inv-brand"
                  value={form.brand}
                  onChange={(e) => updateForm('brand', e.target.value)}
                  placeholder="e.g. Michelin"
                  style={s.input}
                  autoComplete="off"
                />
              </Field>
            </div>

            <div style={s.row2}>
              <Field label="Size" id="inv-size">
                <input
                  id="inv-size"
                  name="inv-size"
                  value={form.size}
                  onChange={(e) => updateForm('size', e.target.value)}
                  placeholder="e.g. 225/65R17"
                  style={s.input}
                  autoComplete="off"
                />
              </Field>

              <Field label="Quantity" id="inv-qty">
                <input
                  id="inv-qty"
                  name="inv-qty"
                  type="number"
                  min="0"
                  value={form.quantity}
                  onChange={(e) => updateForm('quantity', e.target.value)}
                  placeholder="0"
                  style={s.input}
                />
              </Field>
            </div>

            <div style={s.row3}>
              <Field label="Cost price" id="inv-cost">
                <input
                  id="inv-cost"
                  name="inv-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.cost_price}
                  onChange={(e) => updateForm('cost_price', e.target.value)}
                  placeholder="0.00"
                  style={s.input}
                />
              </Field>

              <Field label="Sell price" id="inv-sell">
                <input
                  id="inv-sell"
                  name="inv-sell"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sell_price}
                  onChange={(e) => updateForm('sell_price', e.target.value)}
                  placeholder="0.00"
                  style={s.input}
                />
              </Field>

              <Field label="Low stock alert" id="inv-low">
                <input
                  id="inv-low"
                  name="inv-low"
                  type="number"
                  min="0"
                  value={form.low_stock_threshold}
                  onChange={(e) => updateForm('low_stock_threshold', e.target.value)}
                  placeholder="e.g. 4"
                  style={s.input}
                />
              </Field>
            </div>

            <button
              type="submit"
              style={{
                ...s.primaryBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              disabled={submitting}
            >
              {submitting ? 'Adding...' : '+ Add inventory item'}
            </button>
          </form>
        </div>

        <div style={s.card}>
          <div style={s.head}>
            <div style={s.eyebrow}>Inventory List</div>
            <h3 style={s.title}>Current Stock</h3>
            <p style={s.sub}>
              Items with the lowest stock appear first so you can spot risk quickly.
            </p>
          </div>

          {sortedItems.length === 0 ? (
            <div style={s.empty}>
              <div style={s.emptyTitle}>No inventory items yet</div>
              <div style={s.emptySub}>
                Add your first product to start tracking stock levels.
              </div>
            </div>
          ) : (
            <div style={s.list}>
              {sortedItems.map((item) => {
                const isEditing = editingId === item.id;
                const qty = Number(item.quantity_on_hand || 0);
                const low = Number(item.low_stock_threshold || 0);
                const isLow = low > 0 && qty <= low;

                return (
                  <div key={item.id} style={s.itemCard}>
                    {isEditing ? (
                      <>
                        <div style={s.row2}>
                          <Field label="Item name" id={`edit-name-${item.id}`}>
                            <input
                              id={`edit-name-${item.id}`}
                              name={`edit-name-${item.id}`}
                              value={editDraft.name}
                              onChange={(e) => updateEdit('name', e.target.value)}
                              style={s.input}
                              autoComplete="off"
                            />
                          </Field>

                          <Field label="Brand" id={`edit-brand-${item.id}`}>
                            <input
                              id={`edit-brand-${item.id}`}
                              name={`edit-brand-${item.id}`}
                              value={editDraft.brand}
                              onChange={(e) => updateEdit('brand', e.target.value)}
                              style={s.input}
                              autoComplete="off"
                            />
                          </Field>
                        </div>

                        <div style={s.row2}>
                          <Field label="Size" id={`edit-size-${item.id}`}>
                            <input
                              id={`edit-size-${item.id}`}
                              name={`edit-size-${item.id}`}
                              value={editDraft.size}
                              onChange={(e) => updateEdit('size', e.target.value)}
                              style={s.input}
                              autoComplete="off"
                            />
                          </Field>

                          <Field label="Quantity" id={`edit-qty-${item.id}`}>
                            <input
                              id={`edit-qty-${item.id}`}
                              name={`edit-qty-${item.id}`}
                              type="number"
                              value={editDraft.quantity}
                              onChange={(e) => updateEdit('quantity', e.target.value)}
                              style={s.input}
                            />
                          </Field>
                        </div>

                        <div style={s.row3}>
                          <Field label="Cost price" id={`edit-cost-${item.id}`}>
                            <input
                              id={`edit-cost-${item.id}`}
                              name={`edit-cost-${item.id}`}
                              type="number"
                              step="0.01"
                              value={editDraft.cost_price}
                              onChange={(e) => updateEdit('cost_price', e.target.value)}
                              style={s.input}
                            />
                          </Field>

                          <Field label="Sell price" id={`edit-sell-${item.id}`}>
                            <input
                              id={`edit-sell-${item.id}`}
                              name={`edit-sell-${item.id}`}
                              type="number"
                              step="0.01"
                              value={editDraft.sell_price}
                              onChange={(e) => updateEdit('sell_price', e.target.value)}
                              style={s.input}
                            />
                          </Field>

                          <Field label="Low stock" id={`edit-low-${item.id}`}>
                            <input
                              id={`edit-low-${item.id}`}
                              name={`edit-low-${item.id}`}
                              type="number"
                              value={editDraft.low_stock_threshold}
                              onChange={(e) => updateEdit('low_stock_threshold', e.target.value)}
                              style={s.input}
                            />
                          </Field>
                        </div>

                        <div style={s.itemActions}>
                          <button type="button" style={s.primaryBtn} onClick={() => saveEdit(item.id)}>
                            Save
                          </button>
                          <button type="button" style={s.secondaryBtn} onClick={cancelEdit}>
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={s.itemTop}>
                          <div>
                            <div style={s.itemName}>{item.name}</div>
                            <div style={s.itemMeta}>
                              {[item.brand, item.size].filter(Boolean).join(' • ') || '—'}
                            </div>
                          </div>

                          <div
                            style={{
                              ...s.stockBadge,
                              background: isLow ? C.redLight : C.greenBg,
                              color: isLow ? C.red : C.greenText,
                              border: `1px solid ${isLow ? C.redMid : C.greenBorder}`,
                            }}
                          >
                            {isLow ? 'Low Stock' : 'In Stock'}
                          </div>
                        </div>

                        <div style={s.stats}>
                          <div style={s.statBox}>
                            <div style={s.statLabel}>Qty</div>
                            <div style={s.statValue}>{qty}</div>
                          </div>

                          <div style={s.statBox}>
                            <div style={s.statLabel}>Cost</div>
                            <div style={s.statValue}>{moneyFromCents(item.cost_cents)}</div>
                          </div>

                          <div style={s.statBox}>
                            <div style={s.statLabel}>Sell</div>
                            <div style={s.statValue}>{moneyFromCents(item.sell_price_cents)}</div>
                          </div>

                          <div style={s.statBox}>
                            <div style={s.statLabel}>Low Alert</div>
                            <div style={s.statValue}>{Number(item.low_stock_threshold || 0)}</div>
                          </div>
                        </div>

                        <div style={s.itemActions}>
                          <button type="button" style={s.secondaryBtn} onClick={() => startEdit(item)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            style={s.dangerBtn}
                            onClick={() => onDeleteItem?.(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, id, children }) {
  return (
    <div style={s.field}>
      <label htmlFor={id} style={s.label}>
        {label}
      </label>
      {children}
    </div>
  );
}

const s = {
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '16px',
  },

  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },

  head: {
    padding: '18px 18px 14px',
    borderBottom: `1px solid ${C.border}`,
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

  form: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },

  row3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  label: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  },

  input: {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '10px',
    border: `1px solid ${C.border}`,
    background: C.surface,
    color: C.dark,
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', sans-serif",
  },

  list: {
    padding: '16px 18px 18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  itemCard: {
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  itemTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '12px',
  },

  itemName: {
    fontSize: '15px',
    fontWeight: '800',
    color: C.dark,
  },

  itemMeta: {
    fontSize: '12px',
    color: C.muted,
    marginTop: '4px',
  },

  stockBadge: {
    borderRadius: '999px',
    padding: '6px 10px',
    fontSize: '11px',
    fontWeight: '800',
    whiteSpace: 'nowrap',
  },

  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(92px, 1fr))',
    gap: '10px',
  },

  statBox: {
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '10px',
    background: C.surface,
  },

  statLabel: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    marginBottom: '6px',
  },

  statValue: {
    fontSize: '14px',
    fontWeight: '800',
    color: C.dark,
  },

  itemActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },

  primaryBtn: {
    padding: '11px 14px',
    borderRadius: '10px',
    border: 'none',
    background: C.red,
    color: C.white,
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  secondaryBtn: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${C.border}`,
    background: C.white,
    color: C.dark,
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  dangerBtn: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: `1px solid ${C.redMid}`,
    background: C.redLight,
    color: C.red,
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  empty: {
    padding: '20px 18px 22px',
  },

  emptyTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: C.dark,
    marginBottom: '6px',
  },

  emptySub: {
    fontSize: '13px',
    color: C.mid,
    lineHeight: '1.5',
  },
};