    import { useState } from 'react';
    import Navbar from './Navbar';
    import SummaryCard from './SummaryCard';
    import EntryForm from './EntryForm';
    import ExpenseForm from './ExpenseForm';
    import SettingsForm from './SettingsForm';
    import PartnersForm from './PartnersForm';
    import ServicesForm from './ServicesForm';
    import SettlementCard from './SettlementCard';
    import ReportsCard from './ReportsCard';
    import { formStyles } from './styles';

    const TABS_WITH_FILTER = ['entries', 'expenses', 'reports'];
    const EXPENSE_CATEGORIES = [
    { value: 'inventory', label: 'Inventory / Stock' },
    { value: 'rent',      label: 'Rent / Lease' },
    { value: 'labor',     label: 'Labor / Wages' },
    { value: 'utility',   label: 'Utility / Fuel' },
    { value: 'misc',      label: 'Miscellaneous' },
    ];

    export default function Dashboard({
    user, shop,
    entries, expenses, allExpenses,
    partners, services,
    totals, periodTotals,
    message, messageType, submitting,
    filter, setFilter,
    onAddEntry, onEditEntry, onDeleteEntry,
    onAddExpense, onEditExpense, onDeleteExpense,
    onAddPartner, onEditPartner, onDeletePartner,
    onAddService, onEditService, onDeleteService,
    onSaveShop, onLogout,
    }) {
    const [tab, setTab] = useState('dashboard');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingEntry, setEditingEntry] = useState(null);   // entry id being edited
    const [editingExpense, setEditingExpense] = useState(null);
    const [editingPartner, setEditingPartner] = useState(null);
    const [editingService, setEditingService] = useState(null);

    function requestDelete(type, id, label) { setConfirmDelete({ type, id, label }); }
    function cancelDelete() { setConfirmDelete(null); }
    async function confirmDeleteAction() {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        setConfirmDelete(null);
        if (type === 'entry')   await onDeleteEntry(id);
        if (type === 'expense') await onDeleteExpense(id);
        if (type === 'partner') await onDeletePartner(id);
        if (type === 'service') await onDeleteService(id);
    }

    const equityTotal = partners.reduce((sum, p) => sum + Number(p.equity_pct || 0), 0);
    const showEquityWarning = partners.length > 0 && Math.abs(equityTotal - 100) > 0.01;

    return (
        <div style={formStyles.page}>
        <div style={formStyles.card}>

            {/* Header */}
            <div style={s.header}>
            <div style={s.liveBadge}>● Live</div>
            <h1 style={s.appTitle}>DayBooks</h1>
            <p style={s.shopName}>{shop.name}</p>
            <p style={s.meta}>{shop.category || 'Auto Shop'}{shop.location ? ` · ${shop.location}` : ''}</p>
            </div>

            <Navbar currentTab={tab} setCurrentTab={setTab} />

            {/* Filter bar — only tabs that use it */}
            {TABS_WITH_FILTER.includes(tab) && (
            <div style={s.filterRow}>
                {['today','week','month','all'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} style={{
                    ...s.filterBtn,
                    background: filter === f ? '#c80815' : '#fff',
                    color:      filter === f ? '#fff'     : '#333',
                    border:     filter === f ? '1px solid #c80815' : '1px solid #e4e4e4',
                }}>
                    {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : f === 'month' ? 'This Month' : 'All Time'}
                </button>
                ))}
            </div>
            )}

            {/* ── DASHBOARD TAB ─────────────────────────────────────────── */}
            {tab === 'dashboard' && (
            <>
                {/* Multi-period snapshot — always shows all three */}
                <PeriodStrip periodTotals={periodTotals} />

                <h3 style={s.sectionTitle}>Recent Income</h3>
                {allExpenses.length === 0 && entries.length === 0 ? (
                <EmptyState icon="💰" text="No income recorded yet"
                    hint='Go to the Income tab to record your first sale.' />
                ) : entries.length === 0 ? (
                <EmptyState icon="💰" text="No income today" hint="Switch to Income tab to add entries." />
                ) : (
                entries.slice(0, 5).map((item) => (
                    <EntryRow key={item.id} item={item} services={services}
                    isEditing={editingEntry === item.id}
                    onEdit={() => setEditingEntry(item.id)}
                    onCancelEdit={() => setEditingEntry(null)}
                    onSaveEdit={(data) => { onEditEntry(item.id, data); setEditingEntry(null); }}
                    onDelete={() => requestDelete('entry', item.id, item.description)}
                    submitting={submitting}
                    />
                ))
                )}

                <h3 style={s.sectionTitle}>Recent Expenses</h3>
                {expenses.length === 0 ? (
                <EmptyState icon="🧾" text="No expenses recorded yet"
                    hint="Go to the Expenses tab to log what the shop has spent." />
                ) : (
                expenses.slice(0, 5).map((item) => (
                    <ExpenseRow key={item.id} item={item} partners={partners} currentUserEmail={user.email}
                    isEditing={editingExpense === item.id}
                    onEdit={() => setEditingExpense(item.id)}
                    onCancelEdit={() => setEditingExpense(null)}
                    onSaveEdit={(data) => { onEditExpense(item.id, data); setEditingExpense(null); }}
                    onDelete={() => requestDelete('expense', item.id, item.description)}
                    submitting={submitting}
                    />
                ))
                )}
            </>
            )}

            {/* ── INCOME TAB ────────────────────────────────────────────── */}
            {tab === 'entries' && (
            <>
                {services.length === 0 ? (
                <EmptyState icon="⚙️" text="No service types yet"
                    hint="Go to Settings → Service Types to add your first service before recording income." />
                ) : (
                <EntryForm onAddEntry={onAddEntry} services={services} submitting={submitting} />
                )}
                <h3 style={s.sectionTitle}>All Income Entries</h3>
                {entries.length === 0 ? (
                <EmptyState icon="💰" text="No income entries for this period"
                    hint="Change the filter above or add a new income entry." />
                ) : (
                entries.map((item) => (
                    <EntryRow key={item.id} item={item} services={services}
                    isEditing={editingEntry === item.id}
                    onEdit={() => setEditingEntry(item.id)}
                    onCancelEdit={() => setEditingEntry(null)}
                    onSaveEdit={(data) => { onEditEntry(item.id, data); setEditingEntry(null); }}
                    onDelete={() => requestDelete('entry', item.id, item.description)}
                    submitting={submitting}
                    />
                ))
                )}
            </>
            )}

            {/* ── EXPENSES TAB ──────────────────────────────────────────── */}
            {tab === 'expenses' && (
            <>
                <ExpenseForm onAddExpense={onAddExpense} partners={partners}
                currentUserEmail={user.email} submitting={submitting} />
                <h3 style={s.sectionTitle}>All Expenses</h3>
                {expenses.length === 0 ? (
                <EmptyState icon="🧾" text="No expenses for this period"
                    hint="Change the filter above or log a new expense." />
                ) : (
                expenses.map((item) => (
                    <ExpenseRow key={item.id} item={item} partners={partners} currentUserEmail={user.email}
                    isEditing={editingExpense === item.id}
                    onEdit={() => setEditingExpense(item.id)}
                    onCancelEdit={() => setEditingExpense(null)}
                    onSaveEdit={(data) => { onEditExpense(item.id, data); setEditingExpense(null); }}
                    onDelete={() => requestDelete('expense', item.id, item.description)}
                    submitting={submitting}
                    />
                ))
                )}
            </>
            )}

            {/* ── PARTNERS TAB ──────────────────────────────────────────── */}
            {tab === 'partners' && (
            <>
                <PartnersForm onAddPartner={onAddPartner} submitting={submitting} />

                {showEquityWarning && (
                <div style={s.warning}>
                    ⚠️ Partner equity totals {equityTotal.toFixed(0)}% — should be exactly 100%.
                </div>
                )}

                <h3 style={s.sectionTitle}>Partners</h3>
                {partners.length === 0 ? (
                <EmptyState icon="🤝" text="No partners added yet"
                    hint="Add each owner with their equity %. They should total 100%." />
                ) : (
                partners.map((partner) => (
                    <PartnerRow key={partner.id} partner={partner}
                    isEditing={editingPartner === partner.id}
                    onEdit={() => setEditingPartner(partner.id)}
                    onCancelEdit={() => setEditingPartner(null)}
                    onSaveEdit={(data) => { onEditPartner(partner.id, data); setEditingPartner(null); }}
                    onDelete={() => requestDelete('partner', partner.id, partner.name)}
                    submitting={submitting}
                    />
                ))
                )}
                <SettlementCard partners={partners} expenses={allExpenses} />
            </>
            )}

            {/* ── REPORTS TAB ───────────────────────────────────────────── */}
            {tab === 'reports' && (
            <ReportsCard entries={entries} expenses={expenses} totals={totals} filter={filter} />
            )}

            {/* ── SETTINGS TAB ──────────────────────────────────────────── */}
            {tab === 'settings' && (
            <>
                <SettingsForm shop={shop} onSaveShop={onSaveShop} submitting={submitting} />

                <h3 style={s.sectionTitle}>Service Types</h3>
                <ServicesForm onAddService={onAddService} submitting={submitting} />

                {services.length === 0 ? (
                <EmptyState icon="⚙️" text="No service types yet"
                    hint="Add your services above — they appear when recording income." />
                ) : (
                services.map((service) => (
                    <ServiceRow key={service.id} service={service}
                    isEditing={editingService === service.id}
                    onEdit={() => setEditingService(service.id)}
                    onCancelEdit={() => setEditingService(null)}
                    onSaveEdit={(name) => { onEditService(service.id, name); setEditingService(null); }}
                    onDelete={() => requestDelete('service', service.id, service.name)}
                    submitting={submitting}
                    />
                ))
                )}
            </>
            )}

            {/* Logout */}
            <button onClick={onLogout} style={{ ...formStyles.secondaryButton, marginTop: '8px' }} disabled={submitting}>
            Logout
            </button>

            {/* Toast message */}
            {message && (
            <div style={{
                ...s.toast,
                background: messageType === 'error' ? '#fff0f0' : '#f0faf4',
                color:      messageType === 'error' ? '#c80815' : '#15803d',
                border:     `1px solid ${messageType === 'error' ? '#fccaca' : '#bbf0d4'}`,
            }}>
                {messageType === 'error' ? '⚠️ ' : '✓ '}{message}
            </div>
            )}

            {/* Delete confirmation */}
            {confirmDelete && (
            <div style={s.overlay}>
                <div style={s.dialog}>
                <p style={s.dialogTitle}>Delete <strong>"{confirmDelete.label}"</strong>?</p>
                <p style={s.dialogSub}>This cannot be undone.</p>
                <div style={s.dialogBtns}>
                    <button style={s.cancelBtn} onClick={cancelDelete}>Cancel</button>
                    <button style={s.confirmBtn} onClick={confirmDeleteAction}>Delete</button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }

    // ── Period strip ─────────────────────────────────────────────────────────────

    function PeriodStrip({ periodTotals }) {
    const periods = [
        { label: 'Today',      data: periodTotals.today },
        { label: 'This Week',  data: periodTotals.week  },
        { label: 'This Month', data: periodTotals.month },
    ];
    return (
        <div style={s.periodGrid}>
        {periods.map(({ label, data }) => (
            <div key={label} style={s.periodCard}>
            <div style={s.periodLabel}>{label}</div>
            <div style={s.periodIncome}>${data.income.toFixed(2)}</div>
            <div style={s.periodMeta}>
                <span style={{ color: '#c80815' }}>-${data.expense.toFixed(2)}</span>
                <span style={{ color: data.profit >= 0 ? '#15803d' : '#c80815', fontWeight: '800' }}>
                {data.profit >= 0 ? '+' : ''}${data.profit.toFixed(2)}
                </span>
            </div>
            </div>
        ))}
        </div>
    );
    }

    // ── Entry row with inline edit ────────────────────────────────────────────────

    function EntryRow({ item, services, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [desc, setDesc]    = useState(item.description);
    const [amt, setAmt]      = useState(String(item.amount));
    const [date, setDate]    = useState(item.entry_date);
    const [svcType, setSvc]  = useState(item.service_type || '');

    if (isEditing) {
        return (
        <div style={s.editCard}>
            <div style={s.editGrid}>
            <div style={s.field}>
                <label htmlFor={`ee-svc-${item.id}`} style={s.fieldLabel}>Service</label>
                <select id={`ee-svc-${item.id}`} value={svcType} onChange={(e) => setSvc(e.target.value)} style={s.editInput}>
                {services.map((sv) => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
                </select>
            </div>
            <div style={s.field}>
                <label htmlFor={`ee-desc-${item.id}`} style={s.fieldLabel}>Description</label>
                <input id={`ee-desc-${item.id}`} value={desc} onChange={(e) => setDesc(e.target.value)} style={s.editInput} />
            </div>
            <div style={s.field}>
                <label htmlFor={`ee-amt-${item.id}`} style={s.fieldLabel}>Amount ($)</label>
                <input id={`ee-amt-${item.id}`} type="number" min="0.01" step="0.01" value={amt} onChange={(e) => setAmt(e.target.value)} style={s.editInput} />
            </div>
            <div style={s.field}>
                <label htmlFor={`ee-date-${item.id}`} style={s.fieldLabel}>Date</label>
                <input id={`ee-date-${item.id}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.editInput} />
            </div>
            </div>
            <div style={s.editBtns}>
            <button style={s.cancelBtn} onClick={onCancelEdit}>Cancel</button>
            <button style={s.saveBtn} disabled={submitting}
                onClick={() => onSaveEdit({ description: desc, amount: amt, date, serviceType: svcType })}>
                {submitting ? 'Saving...' : 'Save'}
            </button>
            </div>
        </div>
        );
    }

    return (
        <div style={s.row}>
        <div style={s.rowLeft}>
            <span style={s.rowService}>{item.service_type || 'General'}</span>
            <span style={s.rowDesc}>{item.description}</span>
            <span style={s.rowDate}>{item.entry_date}</span>
        </div>
        <div style={s.rowRight}>
            <strong style={{ color: '#15803d' }}>${Number(item.amount).toFixed(2)}</strong>
            <button style={s.editBtn} onClick={onEdit}>Edit</button>
            <button style={s.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
        </div>
    );
    }

    // ── Expense row with inline edit ──────────────────────────────────────────────

    function ExpenseRow({ item, partners, currentUserEmail, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [desc, setDesc]   = useState(item.description);
    const [amt, setAmt]     = useState(String(item.amount));
    const [cat, setCat]     = useState(item.category || 'misc');
    const [date, setDate]   = useState(item.expense_date);
    const [paid, setPaid]   = useState(item.paid_by || currentUserEmail);

    if (isEditing) {
        return (
        <div style={s.editCard}>
            <div style={s.editGrid}>
            <div style={s.field}>
                <label htmlFor={`ex-desc-${item.id}`} style={s.fieldLabel}>Description</label>
                <input id={`ex-desc-${item.id}`} value={desc} onChange={(e) => setDesc(e.target.value)} style={s.editInput} />
            </div>
            <div style={s.field}>
                <label htmlFor={`ex-amt-${item.id}`} style={s.fieldLabel}>Amount ($)</label>
                <input id={`ex-amt-${item.id}`} type="number" min="0.01" step="0.01" value={amt} onChange={(e) => setAmt(e.target.value)} style={s.editInput} />
            </div>
            <div style={s.field}>
                <label htmlFor={`ex-cat-${item.id}`} style={s.fieldLabel}>Category</label>
                <select id={`ex-cat-${item.id}`} value={cat} onChange={(e) => setCat(e.target.value)} style={s.editInput}>
                {EXPENSE_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
            </div>
            <div style={s.field}>
                <label htmlFor={`ex-paid-${item.id}`} style={s.fieldLabel}>Paid By</label>
                <select id={`ex-paid-${item.id}`} value={paid} onChange={(e) => setPaid(e.target.value)} style={s.editInput}>
                <option value={currentUserEmail}>Me ({currentUserEmail})</option>
                {partners.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
            </div>
            <div style={s.field}>
                <label htmlFor={`ex-date-${item.id}`} style={s.fieldLabel}>Date</label>
                <input id={`ex-date-${item.id}`} type="date" value={date} onChange={(e) => setDate(e.target.value)} style={s.editInput} />
            </div>
            </div>
            <div style={s.editBtns}>
            <button style={s.cancelBtn} onClick={onCancelEdit}>Cancel</button>
            <button style={s.saveBtn} disabled={submitting}
                onClick={() => onSaveEdit({ description: desc, amount: amt, category: cat, date, paidBy: paid })}>
                {submitting ? 'Saving...' : 'Save'}
            </button>
            </div>
        </div>
        );
    }

    return (
        <div style={s.row}>
        <div style={s.rowLeft}>
            <span style={s.rowDesc}>{item.description}</span>
            <span style={s.rowDate}>{item.category} · {item.paid_by || 'Unknown'} · {item.expense_date}</span>
        </div>
        <div style={s.rowRight}>
            <strong style={{ color: '#c80815' }}>${Number(item.amount).toFixed(2)}</strong>
            <button style={s.editBtn} onClick={onEdit}>Edit</button>
            <button style={s.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
        </div>
    );
    }

    // ── Partner row with inline edit ──────────────────────────────────────────────

    function PartnerRow({ partner, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [name, setName]   = useState(partner.name);
    const [equity, setEq]   = useState(String(partner.equity_pct));

    if (isEditing) {
        return (
        <div style={s.editCard}>
            <div style={s.editGrid}>
            <div style={s.field}>
                <label htmlFor={`pt-name-${partner.id}`} style={s.fieldLabel}>Name</label>
                <input id={`pt-name-${partner.id}`} value={name} onChange={(e) => setName(e.target.value)} style={s.editInput} />
            </div>
            <div style={s.field}>
                <label htmlFor={`pt-eq-${partner.id}`} style={s.fieldLabel}>Equity %</label>
                <input id={`pt-eq-${partner.id}`} type="number" min="1" max="100" step="1" value={equity} onChange={(e) => setEq(e.target.value)} style={s.editInput} />
            </div>
            </div>
            <div style={s.editBtns}>
            <button style={s.cancelBtn} onClick={onCancelEdit}>Cancel</button>
            <button style={s.saveBtn} disabled={submitting}
                onClick={() => onSaveEdit({ name, equityPct: equity })}>
                {submitting ? 'Saving...' : 'Save'}
            </button>
            </div>
        </div>
        );
    }

    return (
        <div style={s.row}>
        <div style={s.rowLeft}>
            <span style={s.rowDesc}><strong>{partner.name}</strong></span>
        </div>
        <div style={s.rowRight}>
            <span style={s.badge}>{Number(partner.equity_pct).toFixed(0)}%</span>
            <button style={s.editBtn} onClick={onEdit}>Edit</button>
            <button style={s.deleteBtn} onClick={onDelete}>Remove</button>
        </div>
        </div>
    );
    }

    // ── Service row with inline edit ──────────────────────────────────────────────

    function ServiceRow({ service, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [name, setName] = useState(service.name);

    if (isEditing) {
        return (
        <div style={s.editCard}>
            <div style={s.field}>
            <label htmlFor={`sv-name-${service.id}`} style={s.fieldLabel}>Service name</label>
            <input id={`sv-name-${service.id}`} value={name} onChange={(e) => setName(e.target.value)} style={s.editInput} autoFocus />
            </div>
            <div style={s.editBtns}>
            <button style={s.cancelBtn} onClick={onCancelEdit}>Cancel</button>
            <button style={s.saveBtn} disabled={submitting} onClick={() => onSaveEdit(name)}>
                {submitting ? 'Saving...' : 'Save'}
            </button>
            </div>
        </div>
        );
    }

    return (
        <div style={s.row}>
        <span style={s.rowDesc}>{service.name}</span>
        <div style={s.rowRight}>
            <button style={s.editBtn} onClick={onEdit}>Edit</button>
            <button style={s.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
        </div>
    );
    }

    // ── Empty state ───────────────────────────────────────────────────────────────

    function EmptyState({ icon, text, hint }) {
    return (
        <div style={s.empty}>
        <span style={s.emptyIcon}>{icon}</span>
        <p style={s.emptyText}>{text}</p>
        {hint && <p style={s.emptyHint}>{hint}</p>}
        </div>
    );
    }

    // ── Styles ────────────────────────────────────────────────────────────────────

    const s = {
    header:    { textAlign: 'center', marginBottom: '4px' },
    liveBadge: { display: 'inline-block', background: '#f0faf4', color: '#15803d', fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', marginBottom: '6px', border: '1px solid #bbf0d4' },
    appTitle:  { margin: '0 0 4px', fontSize: '28px', fontWeight: '900', color: '#c80815', letterSpacing: '-0.5px' },
    shopName:  { margin: '0 0 2px', fontWeight: '700', fontSize: '16px', color: '#111' },
    meta:      { margin: 0, fontSize: '13px', color: '#888' },

    filterRow: { display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' },
    filterBtn: { padding: '7px 12px', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', transition: 'all 0.15s' },

    sectionTitle: { margin: '12px 0 6px', fontSize: '15px', fontWeight: '800', color: '#111' },

    // Period strip
    periodGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '4px' },
    periodCard: { background: '#fff', border: '1px solid #ececec', borderRadius: '14px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
    periodLabel:  { fontSize: '10px', fontWeight: '700', color: '#999', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' },
    periodIncome: { fontSize: '17px', fontWeight: '900', color: '#111', letterSpacing: '-0.3px', marginBottom: '4px' },
    periodMeta:   { display: 'flex', justifyContent: 'space-between', fontSize: '11px' },

    // Rows
    row:        { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '11px 13px', border: '1px solid #ececec', borderRadius: '12px', background: '#fafafa', marginBottom: '6px' },
    rowLeft:    { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1, minWidth: 0 },
    rowRight:   { display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 },
    rowService: { fontSize: '12px', fontWeight: '700', color: '#111' },
    rowDesc:    { fontSize: '13px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    rowDate:    { fontSize: '11px', color: '#999' },

    editBtn:   { padding: '5px 10px', borderRadius: '8px', border: '1px solid #ddd', background: '#fff', color: '#444', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
    deleteBtn: { padding: '5px 10px', borderRadius: '8px', border: '1px solid #c80815', background: '#fff', color: '#c80815', cursor: 'pointer', fontSize: '12px', fontWeight: '700' },
    badge:     { background: '#fff3f3', color: '#c80815', fontSize: '12px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', border: '1px solid #fccaca' },

    // Inline edit card
    editCard:   { border: '1.5px solid #c80815', borderRadius: '14px', padding: '14px', background: '#fff', marginBottom: '6px' },
    editGrid:   { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' },
    field:      { display: 'flex', flexDirection: 'column', gap: '4px' },
    fieldLabel: { fontSize: '11px', fontWeight: '700', color: '#888', textTransform: 'uppercase', letterSpacing: '0.4px' },
    editInput:  { padding: '9px 12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '13px', background: '#fafafa', outline: 'none', width: '100%', boxSizing: 'border-box' },
    editBtns:   { display: 'flex', gap: '8px' },
    saveBtn:    { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#c80815', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },
    cancelBtn:  { flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ddd', background: '#fff', color: '#444', cursor: 'pointer', fontWeight: '700', fontSize: '13px' },

    // Misc
    warning:  { background: '#fffbea', border: '1px solid #f5d77a', color: '#7a5c00', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '600' },
    toast:    { padding: '10px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '600', marginTop: '4px' },
    empty:     { textAlign: 'center', padding: '24px 16px', border: '1.5px dashed #e4e4e4', borderRadius: '14px', background: '#fafafa', marginBottom: '8px' },
    emptyIcon: { fontSize: '28px', display: 'block', marginBottom: '8px' },
    emptyText: { margin: '0 0 6px', fontWeight: '700', color: '#333', fontSize: '14px' },
    emptyHint: { margin: 0, color: '#888', fontSize: '13px', lineHeight: '1.5' },

    // Dialog
    overlay:    { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    dialog:     { background: '#fff', borderRadius: '16px', padding: '24px', maxWidth: '340px', width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', textAlign: 'center' },
    dialogTitle: { margin: '0 0 6px', fontSize: '16px', color: '#111' },
    dialogSub:  { margin: '0 0 20px', fontSize: '13px', color: '#888' },
    dialogBtns: { display: 'flex', gap: '10px', justifyContent: 'center' },
    confirmBtn: { flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: '#c80815', color: '#fff', cursor: 'pointer', fontWeight: '700', fontSize: '14px' },
    };