    import { useState } from 'react';
    import Layout from './Layout';
    import SummaryCard from './SummaryCard';
    import EntryForm from './EntryForm';
    import ExpenseForm from './ExpenseForm';
    import SettlementCard from './SettlementCard';
    import ReportsCard from './ReportsCard';
    import { PartnersForm, ServicesForm, SettingsForm } from './Forms';
    import { C } from './styles';

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
    onSaveShop, onLogout, onDeleteAccount,
    }) {
    const [tab, setTab]                     = useState('dashboard');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
    const [deleteAccountInput, setDeleteAccountInput]     = useState('');
    const [editingEntry, setEditingEntry]     = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [editingPartner, setEditingPartner] = useState(null);
    const [editingService, setEditingService] = useState(null);

    const equityTotal       = partners.reduce((s, p) => s + Number(p.equity_pct || 0), 0);
    const showEquityWarning = partners.length > 0 && Math.abs(equityTotal - 100) > 0.01;

    function requestDelete(type, id, label) { setConfirmDelete({ type, id, label }); }
    function cancelDelete() { setConfirmDelete(null); }
    async function doDelete() {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        setConfirmDelete(null);
        if (type === 'entry')   return onDeleteEntry(id);
        if (type === 'expense') return onDeleteExpense(id);
        if (type === 'partner') return onDeletePartner(id);
        if (type === 'service') return onDeleteService(id);
    }

    // Delete account — requires typing "DELETE" to confirm
    function openDeleteAccount() {
        setDeleteAccountInput('');
        setConfirmDeleteAccount(true);
    }
    function closeDeleteAccount() {
        setConfirmDeleteAccount(false);
        setDeleteAccountInput('');
    }
    async function doDeleteAccount() {
        if (deleteAccountInput !== 'DELETE') return;
        closeDeleteAccount();
        await onDeleteAccount();
    }

    return (
        <Layout shop={shop} user={user} currentTab={tab} setCurrentTab={setTab} onLogout={onLogout}>

        {/* Filter bar */}
        {TABS_WITH_FILTER.includes(tab) && (
            <div style={s.filterBar}>
            {[
                { val: 'today', label: 'Today' },
                { val: 'week',  label: 'This Week' },
                { val: 'month', label: 'This Month' },
                { val: 'all',   label: 'All Time' },
            ].map(({ val, label }) => (
                <button key={val} onClick={() => setFilter(val)} style={{
                ...s.filterBtn,
                background: filter === val ? C.dark : C.white,
                color:      filter === val ? C.white : C.mid,
                border:     `1px solid ${filter === val ? C.dark : C.border}`,
                fontWeight: filter === val ? '600' : '400',
                }}>{label}</button>
            ))}
            </div>
        )}

        {/* ── DASHBOARD ────────────────────────────────────────────── */}
        {tab === 'dashboard' && (
            <div style={s.dashPage}>
            {/* Period strip — 3 equal cards */}
            <div style={s.periodStrip}>
                {[
                { label: 'Today',      pd: periodTotals.today },
                { label: 'This Week',  pd: periodTotals.week  },
                { label: 'This Month', pd: periodTotals.month },
                ].map(({ label, pd }) => (
                <div key={label} style={s.periodCard}>
                    <div style={s.periodTop}>
                    <span style={s.periodLabel}>{label}</span>
                    <span style={{
                        ...s.periodBadge,
                        color:      pd.profit >= 0 ? C.greenText : C.red,
                        background: pd.profit >= 0 ? C.greenBg   : C.redLight,
                        border:     `1px solid ${pd.profit >= 0 ? C.greenBorder : C.redMid}`,
                    }}>
                        {pd.profit >= 0 ? '+' : ''}${pd.profit.toFixed(2)}
                    </span>
                    </div>
                    <div style={s.periodIncome}>${pd.income.toFixed(2)}</div>
                    <div style={s.periodBottom}>
                    <span style={s.periodExpLabel}>Expenses</span>
                    <span style={s.periodExpVal}>${pd.expense.toFixed(2)}</span>
                    </div>
                </div>
                ))}
            </div>

            {/* Two columns: left = summary, right = recent activity */}
            <div style={s.dashGrid}>
                {/* Left — summary totals */}
                <div style={s.dashLeft}>
                <SummaryCard
                    totalIncome={totals.totalIncome}
                    totalExpense={totals.totalExpense}
                    profit={totals.profit}
                />
                </div>

                {/* Right — recent income + recent expenses stacked */}
                <div style={s.dashRight}>
                <TableSection title="Recent Income" count={entries.length} accentColor={C.green}>
                    {entries.length === 0
                    ? <EmptyRow text="No income recorded yet" hint="Go to Income tab to add your first entry." />
                    : entries.slice(0, 5).map(item => (
                        <EntryRow key={item.id} item={item} services={services}
                            isEditing={editingEntry === item.id}
                            onEdit={() => setEditingEntry(item.id)}
                            onCancelEdit={() => setEditingEntry(null)}
                            onSaveEdit={d => { onEditEntry(item.id, d); setEditingEntry(null); }}
                            onDelete={() => requestDelete('entry', item.id, item.description)}
                            submitting={submitting} />
                        ))}
                </TableSection>

                <TableSection title="Recent Expenses" count={expenses.length} accentColor={C.red}>
                    {expenses.length === 0
                    ? <EmptyRow text="No expenses logged yet" hint="Go to Expenses tab to log spending." />
                    : expenses.slice(0, 5).map(item => (
                        <ExpenseRow key={item.id} item={item} partners={partners} currentUserEmail={user.email}
                            isEditing={editingExpense === item.id}
                            onEdit={() => setEditingExpense(item.id)}
                            onCancelEdit={() => setEditingExpense(null)}
                            onSaveEdit={d => { onEditExpense(item.id, d); setEditingExpense(null); }}
                            onDelete={() => requestDelete('expense', item.id, item.description)}
                            submitting={submitting} />
                        ))}
                </TableSection>
                </div>
            </div>
            </div>
        )}

        {/* ── INCOME ───────────────────────────────────────────────── */}
        {tab === 'entries' && (
            <div style={s.twoCol}>
            <div style={s.leftCol}>
                <Panel title="Record Income">
                {services.length === 0
                    ? <EmptyCard icon="⚙️" text="No services yet" hint="Add services in Settings first." />
                    : <EntryForm onAddEntry={onAddEntry} services={services} submitting={submitting} />}
                </Panel>
            </div>
            <div style={s.rightCol}>
                <TableSection title="All Income" count={entries.length} accentColor={C.green}>
                {entries.length === 0
                    ? <EmptyRow text="No entries for this period" hint="Try a different filter or add income." />
                    : entries.map(item => (
                        <EntryRow key={item.id} item={item} services={services}
                        isEditing={editingEntry === item.id}
                        onEdit={() => setEditingEntry(item.id)}
                        onCancelEdit={() => setEditingEntry(null)}
                        onSaveEdit={d => { onEditEntry(item.id, d); setEditingEntry(null); }}
                        onDelete={() => requestDelete('entry', item.id, item.description)}
                        submitting={submitting} />
                    ))}
                </TableSection>
            </div>
            </div>
        )}

        {/* ── EXPENSES ─────────────────────────────────────────────── */}
        {tab === 'expenses' && (
            <div style={s.twoCol}>
            <div style={s.leftCol}>
                <Panel title="Log Expense">
                <ExpenseForm onAddExpense={onAddExpense} partners={partners}
                    currentUserEmail={user.email} submitting={submitting} />
                </Panel>
            </div>
            <div style={s.rightCol}>
                <TableSection title="All Expenses" count={expenses.length} accentColor={C.red}>
                {expenses.length === 0
                    ? <EmptyRow text="No expenses for this period" hint="Try a different filter or log one." />
                    : expenses.map(item => (
                        <ExpenseRow key={item.id} item={item} partners={partners} currentUserEmail={user.email}
                        isEditing={editingExpense === item.id}
                        onEdit={() => setEditingExpense(item.id)}
                        onCancelEdit={() => setEditingExpense(null)}
                        onSaveEdit={d => { onEditExpense(item.id, d); setEditingExpense(null); }}
                        onDelete={() => requestDelete('expense', item.id, item.description)}
                        submitting={submitting} />
                    ))}
                </TableSection>
            </div>
            </div>
        )}

        {/* ── PARTNERS ─────────────────────────────────────────────── */}
        {tab === 'partners' && (
            <div style={s.twoCol}>
            <div style={s.leftCol}>
                <Panel title="Add Partner">
                <PartnersForm onAddPartner={onAddPartner} submitting={submitting} />
                </Panel>
                {showEquityWarning && (
                <div style={s.warningBanner}>
                    ⚠ Equity totals {equityTotal.toFixed(0)}% — should be exactly 100%
                </div>
                )}
            </div>
            <div style={s.rightCol}>
                <TableSection title="Partners" count={partners.length} accentColor={C.dark}>
                {partners.length === 0
                    ? <EmptyRow text="No partners yet" hint="Add each owner with their equity %." />
                    : partners.map(p => (
                        <PartnerRow key={p.id} partner={p}
                        isEditing={editingPartner === p.id}
                        onEdit={() => setEditingPartner(p.id)}
                        onCancelEdit={() => setEditingPartner(null)}
                        onSaveEdit={d => { onEditPartner(p.id, d); setEditingPartner(null); }}
                        onDelete={() => requestDelete('partner', p.id, p.name)}
                        submitting={submitting} />
                    ))}
                </TableSection>
                <SettlementCard partners={partners} expenses={allExpenses} />
            </div>
            </div>
        )}

        {/* ── REPORTS ──────────────────────────────────────────────── */}
        {tab === 'reports' && (
            <ReportsCard entries={entries} expenses={expenses} totals={totals} filter={filter} />
        )}

        {/* ── SETTINGS ─────────────────────────────────────────────── */}
        {tab === 'settings' && (
            <div style={s.twoCol}>
            <div style={s.leftCol}>
                <Panel title="Shop Settings">
                <SettingsForm shop={shop} onSaveShop={onSaveShop} submitting={submitting} />
                </Panel>
                <Panel title="Service Types">
                <ServicesForm onAddService={onAddService} submitting={submitting} />
                {services.length === 0
                    ? <EmptyCard icon="⚙️" text="No services yet" hint="Add services to use when recording income." />
                    : services.map(sv => (
                        <ServiceRow key={sv.id} service={sv}
                        isEditing={editingService === sv.id}
                        onEdit={() => setEditingService(sv.id)}
                        onCancelEdit={() => setEditingService(null)}
                        onSaveEdit={n => { onEditService(sv.id, n); setEditingService(null); }}
                        onDelete={() => requestDelete('service', sv.id, sv.name)}
                        submitting={submitting} />
                    ))}
                </Panel>
            </div>
            <div style={s.rightCol}>
                <Panel title="Account">
                <div style={s.accountItem}>
                    <span style={s.accountLabel}>Email</span>
                    <span style={s.accountValue}>{user.email}</span>
                </div>
                <div style={s.accountItem}>
                    <span style={s.accountLabel}>Shop</span>
                    <span style={s.accountValue}>{shop.name}</span>
                </div>
                {shop.category && (
                    <div style={s.accountItem}>
                    <span style={s.accountLabel}>Type</span>
                    <span style={s.accountValue}>{shop.category}</span>
                    </div>
                )}
                <button onClick={onLogout} style={s.signoutBtn} disabled={submitting}>
                    Sign out
                </button>
                </Panel>

                {/* Danger zone */}
                <div style={s.dangerPanel}>
                <div style={s.dangerHeader}>
                    <span style={s.dangerTitle}>Danger Zone</span>
                </div>
                <div style={s.dangerBody}>
                    <div style={s.dangerRow}>
                    <div>
                        <div style={s.dangerItemTitle}>Delete account</div>
                        <div style={s.dangerItemDesc}>
                        Permanently deletes your shop, all income, expenses, partners, and services. This cannot be undone.
                        </div>
                    </div>
                    <button onClick={openDeleteAccount} style={s.dangerBtn} disabled={submitting}>
                        Delete account
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

        {/* Toast */}
        {message && (
            <div style={{
            ...s.toast,
            background: messageType === 'error' ? '#1C0A0A' : '#0A1C10',
            color:      messageType === 'error' ? '#FF6B6B' : '#4ADE80',
            border:     `1px solid ${messageType === 'error' ? '#3D0F0F' : '#14532D'}`,
            }}>
            {messageType === 'error' ? '⚠ ' : '✓ '}{message}
            </div>
        )}

        {/* Delete record dialog */}
        {confirmDelete && (
            <div style={s.overlay}>
            <div style={s.dialog}>
                <div style={s.dialogIconWrap}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                </div>
                <p style={s.dialogTitle}>Delete this record?</p>
                <p style={s.dialogSub}>"{confirmDelete.label}"</p>
                <p style={s.dialogNote}>This cannot be undone.</p>
                <div style={s.dialogBtns}>
                <button style={s.dialogCancel} onClick={cancelDelete}>Cancel</button>
                <button style={s.dialogConfirm} onClick={doDelete}>Delete</button>
                </div>
            </div>
            </div>
        )}

        {/* Delete account dialog — requires typing DELETE */}
        {confirmDeleteAccount && (
            <div style={s.overlay}>
            <div style={{ ...s.dialog, maxWidth: '420px' }}>
                <div style={{ ...s.dialogIconWrap, background: '#FFF0F0' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                </div>
                <p style={s.dialogTitle}>Delete your account?</p>
                <p style={{ ...s.dialogNote, marginBottom: '16px', textAlign: 'left', paddingLeft: 0 }}>
                This will permanently delete <strong>{shop?.name}</strong> and all its data — income records, expenses, partners, and services. This action <strong>cannot be undone</strong>.
                </p>
                <div style={s.deleteAccountField}>
                <label htmlFor="delete-confirm-input" style={s.deleteAccountLabel}>
                    Type <strong>DELETE</strong> to confirm
                </label>
                <input
                    id="delete-confirm-input"
                    value={deleteAccountInput}
                    onChange={e => setDeleteAccountInput(e.target.value)}
                    placeholder="DELETE"
                    style={{
                    ...s.deleteAccountInput,
                    borderColor: deleteAccountInput && deleteAccountInput !== 'DELETE' ? C.red : C.border,
                    }}
                    autoComplete="off"
                />
                </div>
                <div style={s.dialogBtns}>
                <button style={s.dialogCancel} onClick={closeDeleteAccount}>Cancel</button>
                <button
                    style={{
                    ...s.dialogConfirm,
                    opacity: deleteAccountInput === 'DELETE' ? 1 : 0.4,
                    cursor: deleteAccountInput === 'DELETE' ? 'pointer' : 'not-allowed',
                    }}
                    onClick={doDeleteAccount}
                    disabled={deleteAccountInput !== 'DELETE' || submitting}
                >
                    {submitting ? 'Deleting...' : 'Delete account'}
                </button>
                </div>
            </div>
            </div>
        )}
        </Layout>
    );
    }

    // ── Layout wrappers ───────────────────────────────────────────────────────────

    function Panel({ title, children }) {
    return (
        <div style={s.panel}>
        {title && <div style={s.panelTitle}>{title}</div>}
        <div style={s.panelBody}>{children}</div>
        </div>
    );
    }

    function TableSection({ title, count, accentColor, children }) {
    return (
        <div style={s.tableSection}>
        <div style={s.tableSectionHead}>
            <div style={{ ...s.tableSectionAccent, background: accentColor }} />
            <span style={s.tableSectionTitle}>{title}</span>
            {count > 0 && <span style={s.tableCount}>{count}</span>}
        </div>
        <div>{children}</div>
        </div>
    );
    }

    // ── Row components ─────────────────────────────────────────────────────────────

    function EntryRow({ item, services, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [desc, setDesc] = useState(item.description);
    const [amt, setAmt]   = useState(String(item.amount));
    const [date, setDate] = useState(item.entry_date);
    const [svc, setSvc]   = useState(item.service_type || '');

    if (isEditing) return (
        <EditCard
        fields={[
            { label: 'Service',     id: `ee-svc-${item.id}`,  el: <select  id={`ee-svc-${item.id}`}  value={svc}  onChange={e => setSvc(e.target.value)}  style={s.editInput}>{services.map(sv => <option key={sv.id} value={sv.name}>{sv.name}</option>)}</select> },
            { label: 'Description', id: `ee-desc-${item.id}`, el: <input   id={`ee-desc-${item.id}`} value={desc} onChange={e => setDesc(e.target.value)} style={s.editInput} /> },
            { label: 'Amount ($)',  id: `ee-amt-${item.id}`,  el: <input   id={`ee-amt-${item.id}`}  type="number" min="0.01" step="0.01" value={amt} onChange={e => setAmt(e.target.value)} style={s.editInput} /> },
            { label: 'Date',        id: `ee-date-${item.id}`, el: <input   id={`ee-date-${item.id}`} type="date"  value={date} onChange={e => setDate(e.target.value)} style={s.editInput} /> },
        ]}
        onCancel={onCancelEdit}
        onSave={() => onSaveEdit({ description: desc, amount: amt, date, serviceType: svc })}
        submitting={submitting}
        />
    );

    return (
        <div style={s.tableRow}>
        <div style={s.rowMain}>
            <div style={s.rowTop}>
            <span style={s.rowTag}>{item.service_type || 'General'}</span>
            <span style={s.rowDesc}>{item.description}</span>
            </div>
            <span style={s.rowMeta}>{item.entry_date}</span>
        </div>
        <div style={s.rowRight}>
            <span style={{ ...s.rowAmt, color: C.green }}>${Number(item.amount).toFixed(2)}</span>
            <RowBtns onEdit={onEdit} onDelete={onDelete} />
        </div>
        </div>
    );
    }

    function ExpenseRow({ item, partners, currentUserEmail, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [desc, setDesc] = useState(item.description);
    const [amt, setAmt]   = useState(String(item.amount));
    const [cat, setCat]   = useState(item.category || 'misc');
    const [date, setDate] = useState(item.expense_date);
    const [paid, setPaid] = useState(item.paid_by || currentUserEmail);

    if (isEditing) return (
        <EditCard
        fields={[
            { label: 'Description', id: `ex-desc-${item.id}`, el: <input  id={`ex-desc-${item.id}`} value={desc} onChange={e => setDesc(e.target.value)} style={s.editInput} /> },
            { label: 'Amount ($)',  id: `ex-amt-${item.id}`,  el: <input  id={`ex-amt-${item.id}`}  type="number" min="0.01" step="0.01" value={amt}  onChange={e => setAmt(e.target.value)}  style={s.editInput} /> },
            { label: 'Category',   id: `ex-cat-${item.id}`,  el: <select id={`ex-cat-${item.id}`}  value={cat}  onChange={e => setCat(e.target.value)}  style={s.editInput}>{EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select> },
            { label: 'Paid By',    id: `ex-paid-${item.id}`, el: <select id={`ex-paid-${item.id}`} value={paid} onChange={e => setPaid(e.target.value)} style={s.editInput}><option value={currentUserEmail}>Me</option>{partners.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}</select> },
            { label: 'Date',       id: `ex-date-${item.id}`, el: <input  id={`ex-date-${item.id}`} type="date"  value={date} onChange={e => setDate(e.target.value)} style={s.editInput} /> },
        ]}
        onCancel={onCancelEdit}
        onSave={() => onSaveEdit({ description: desc, amount: amt, category: cat, date, paidBy: paid })}
        submitting={submitting}
        />
    );

    return (
        <div style={s.tableRow}>
        <div style={s.rowMain}>
            <div style={s.rowTop}>
            <span style={s.rowCatTag}>{item.category || 'misc'}</span>
            <span style={s.rowDesc}>{item.description}</span>
            </div>
            <span style={s.rowMeta}>{item.paid_by || 'Unknown'} · {item.expense_date}</span>
        </div>
        <div style={s.rowRight}>
            <span style={{ ...s.rowAmt, color: C.red }}>${Number(item.amount).toFixed(2)}</span>
            <RowBtns onEdit={onEdit} onDelete={onDelete} />
        </div>
        </div>
    );
    }

    function PartnerRow({ partner, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [name, setName] = useState(partner.name);
    const [eq, setEq]     = useState(String(partner.equity_pct));

    if (isEditing) return (
        <EditCard
        fields={[
            { label: 'Name',     id: `pt-name-${partner.id}`, el: <input id={`pt-name-${partner.id}`} value={name} onChange={e => setName(e.target.value)} style={s.editInput} /> },
            { label: 'Equity %', id: `pt-eq-${partner.id}`,   el: <input id={`pt-eq-${partner.id}`}   type="number" min="1" max="100" step="1" value={eq} onChange={e => setEq(e.target.value)} style={s.editInput} /> },
        ]}
        onCancel={onCancelEdit}
        onSave={() => onSaveEdit({ name, equityPct: eq })}
        submitting={submitting}
        />
    );

    return (
        <div style={s.tableRow}>
        <div style={s.rowMain}>
            <span style={s.rowDesc}><strong>{partner.name}</strong></span>
        </div>
        <div style={s.rowRight}>
            <span style={s.equityChip}>{Number(partner.equity_pct).toFixed(0)}%</span>
            <RowBtns onEdit={onEdit} onDelete={onDelete} deleteLabel="Remove" />
        </div>
        </div>
    );
    }

    function ServiceRow({ service, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
    const [name, setName] = useState(service.name);

    if (isEditing) return (
        <EditCard
        fields={[{ label: 'Service name', id: `sv-${service.id}`, el: <input id={`sv-${service.id}`} value={name} onChange={e => setName(e.target.value)} style={s.editInput} autoFocus /> }]}
        onCancel={onCancelEdit}
        onSave={() => onSaveEdit(name)}
        submitting={submitting}
        />
    );

    return (
        <div style={s.tableRow}>
        <span style={s.rowDesc}>{service.name}</span>
        <RowBtns onEdit={onEdit} onDelete={onDelete} />
        </div>
    );
    }

    // ── Micro components ───────────────────────────────────────────────────────────

    function EditCard({ fields, onCancel, onSave, submitting }) {
    return (
        <div style={s.editCard}>
        <div style={s.editFields}>
            {fields.map(({ label, id, el }) => (
            <div key={id} style={s.editField}>
                <label htmlFor={id} style={s.editLabel}>{label}</label>
                {el}
            </div>
            ))}
        </div>
        <div style={s.editActions}>
            <button style={s.editCancelBtn} onClick={onCancel}>Cancel</button>
            <button style={s.editSaveBtn} onClick={onSave} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save changes'}
            </button>
        </div>
        </div>
    );
    }

    function RowBtns({ onEdit, onDelete, deleteLabel = 'Delete' }) {
    return (
        <div style={s.rowBtns}>
        <button style={s.editBtn} onClick={onEdit}>Edit</button>
        <button style={s.deleteBtn} onClick={onDelete}>{deleteLabel}</button>
        </div>
    );
    }

    function EmptyRow({ text, hint }) {
    return (
        <div style={s.emptyRow}>
        <div style={s.emptyRowText}>{text}</div>
        {hint && <div style={s.emptyRowHint}>{hint}</div>}
        </div>
    );
    }

    function EmptyCard({ icon, text, hint }) {
    return (
        <div style={s.emptyCard}>
        <span style={s.emptyCardIcon}>{icon}</span>
        <p style={s.emptyCardText}>{text}</p>
        {hint && <p style={s.emptyCardHint}>{hint}</p>}
        </div>
    );
    }

    // ── Styles ─────────────────────────────────────────────────────────────────────

    const s = {
    // ── Dashboard layout ──
    dashPage:    { display: 'flex', flexDirection: 'column', gap: '20px' },
    periodStrip: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
    // Fixed: dashGrid uses fixed left column + flex right column, no overlap
    dashGrid:  { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' },
    dashLeft:  { display: 'flex', flexDirection: 'column', gap: '12px' },
    dashRight: { display: 'flex', flexDirection: 'column', gap: '16px' },

    // ── Two-col pages (Income, Expenses, Partners, Settings) ──
    // Fixed: left col is fixed 340px, right col takes remaining space
    twoCol:   { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', alignItems: 'start' },
    leftCol:  { display: 'flex', flexDirection: 'column', gap: '16px' },
    rightCol: { display: 'flex', flexDirection: 'column', gap: '16px' },

    // Filter bar
    filterBar: { display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' },
    filterBtn: {
        padding: '7px 16px', borderRadius: '7px', cursor: 'pointer',
        fontSize: '13px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.12s',
    },

    // Period cards
    periodCard: {
        background: C.white, borderRadius: '12px', padding: '20px',
        border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    },
    periodTop:    { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
    periodLabel:  { fontSize: '12px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px' },
    periodBadge:  { fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' },
    periodIncome: { fontSize: '26px', fontWeight: '800', color: C.dark, letterSpacing: '-0.5px', marginBottom: '10px' },
    periodBottom: { display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px solid ${C.border}` },
    periodExpLabel: { fontSize: '12px', color: C.muted },
    periodExpVal:   { fontSize: '12px', fontWeight: '600', color: C.red },

    // Panel
    panel:      { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    panelTitle: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '14px 20px 0' },
    panelBody:  { padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' },

    // Table section
    tableSection:     { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
    tableSectionHead: { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderBottom: `1px solid ${C.border}` },
    tableSectionAccent: { width: '3px', height: '16px', borderRadius: '2px', flexShrink: 0 },
    tableSectionTitle:  { fontSize: '13px', fontWeight: '700', color: C.dark, flex: 1 },
    tableCount: { fontSize: '11px', fontWeight: '700', color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${C.border}` },

    // Table rows
    tableRow:  { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 20px', borderBottom: `1px solid ${C.border}` },
    rowMain:   { display: 'flex', flexDirection: 'column', gap: '3px', flex: 1, minWidth: 0 },
    rowTop:    { display: 'flex', alignItems: 'center', gap: '8px' },
    rowTag:    { fontSize: '11px', fontWeight: '600', color: C.greenText, background: C.greenBg, padding: '2px 7px', borderRadius: '4px', flexShrink: 0 },
    rowCatTag: { fontSize: '11px', fontWeight: '600', color: '#6D28D9', background: '#F5F3FF', padding: '2px 7px', borderRadius: '4px', flexShrink: 0, textTransform: 'capitalize' },
    rowDesc:   { fontSize: '13px', color: C.body, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' },
    rowMeta:   { fontSize: '11px', color: C.muted },
    rowRight:  { display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 },
    rowAmt:    { fontSize: '14px', fontWeight: '800', letterSpacing: '-0.3px' },
    rowBtns:   { display: 'flex', gap: '4px' },
    equityChip:{ fontSize: '12px', fontWeight: '700', color: C.mid, background: C.bg, padding: '3px 10px', borderRadius: '20px', border: `1px solid ${C.border}` },

    editBtn:   { padding: '5px 11px', borderRadius: '6px', border: `1px solid ${C.border}`, background: C.white, color: C.mid, cursor: 'pointer', fontSize: '12px', fontWeight: '500', fontFamily: "'Outfit', sans-serif" },
    deleteBtn: { padding: '5px 11px', borderRadius: '6px', border: `1px solid ${C.redMid}`, background: C.redLight, color: C.red, cursor: 'pointer', fontSize: '12px', fontWeight: '500', fontFamily: "'Outfit', sans-serif" },

    // Inline edit
    editCard:    { margin: '0 16px 4px', background: C.bg, borderRadius: '10px', padding: '14px', border: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '10px' },
    editFields:  { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
    editField:   { display: 'flex', flexDirection: 'column', gap: '4px' },
    editLabel:   { fontSize: '10px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
    editInput:   { padding: '8px 11px', borderRadius: '7px', border: `1px solid ${C.border}`, fontSize: '13px', background: C.white, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'Outfit', sans-serif", color: C.dark },
    editActions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
    editSaveBtn:   { padding: '8px 18px', borderRadius: '7px', border: 'none', background: C.dark, color: C.white, cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit', sans-serif" },
    editCancelBtn: { padding: '8px 14px', borderRadius: '7px', border: `1px solid ${C.border}`, background: C.white, color: C.mid, cursor: 'pointer', fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif" },

    // Account section
    accountItem:  { display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '10px', borderBottom: `1px solid ${C.border}` },
    accountLabel: { fontSize: '10px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
    accountValue: { fontSize: '14px', color: C.dark, fontWeight: '500' },
    signoutBtn:   { padding: '9px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'transparent', color: C.mid, cursor: 'pointer', fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif", marginTop: '4px', width: '100%' },

    // Danger zone panel
    dangerPanel:  { borderRadius: '12px', border: `1px solid ${C.redMid}`, overflow: 'hidden' },
    dangerHeader: { background: C.redLight, padding: '12px 20px', borderBottom: `1px solid ${C.redMid}` },
    dangerTitle:  { fontSize: '12px', fontWeight: '700', color: C.red, textTransform: 'uppercase', letterSpacing: '0.8px' },
    dangerBody:   { background: C.white, padding: '16px 20px' },
    dangerRow:    { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' },
    dangerItemTitle: { fontSize: '14px', fontWeight: '700', color: C.dark, marginBottom: '4px' },
    dangerItemDesc:  { fontSize: '12px', color: C.muted, lineHeight: '1.5', maxWidth: '220px' },
    dangerBtn: { padding: '8px 14px', borderRadius: '8px', border: `1px solid ${C.redMid}`, background: C.redLight, color: C.red, cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit', sans-serif", flexShrink: 0, whiteSpace: 'nowrap' },

    // Delete account dialog
    deleteAccountField: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
    deleteAccountLabel: { fontSize: '13px', color: C.mid },
    deleteAccountInput: { padding: '11px 14px', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: C.surface, outline: 'none', color: C.dark, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box', letterSpacing: '2px', fontWeight: '700' },

    // Misc
    warningBanner: { background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '600' },
    emptyRow:     { padding: '20px', display: 'flex', flexDirection: 'column', gap: '3px' },
    emptyRowText: { fontSize: '13px', fontWeight: '600', color: C.mid },
    emptyRowHint: { fontSize: '12px', color: C.muted },
    emptyCard:     { textAlign: 'center', padding: '20px 16px' },
    emptyCardIcon: { fontSize: '24px', display: 'block', marginBottom: '8px', opacity: 0.5 },
    emptyCardText: { fontSize: '13px', fontWeight: '600', color: C.mid, margin: '0 0 4px' },
    emptyCardHint: { fontSize: '12px', color: C.muted, margin: 0 },

    // Toast
    toast: { position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif", zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' },

    // Dialogs
    overlay:       { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    dialog:        { background: C.white, borderRadius: '14px', padding: '24px', maxWidth: '380px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' },
    dialogIconWrap:{ width: '40px', height: '40px', background: C.redLight, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' },
    dialogTitle:   { fontSize: '17px', fontWeight: '800', color: C.dark, margin: '0 0 6px', letterSpacing: '-0.2px' },
    dialogSub:     { fontSize: '13px', color: C.mid, margin: '0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' },
    dialogNote:    { fontSize: '13px', color: C.muted, margin: '8px 0 20px' },
    dialogBtns:    { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
    dialogCancel:  { padding: '10px 20px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.white, color: C.mid, cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: "'Outfit', sans-serif" },
    dialogConfirm: { padding: '10px 20px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: "'Outfit', sans-serif" },
    };