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

    const TABS_WITH_FILTER = ['dashboard', 'entries', 'expenses', 'reports'];

    export default function Dashboard({
    user,
    shop,
    entries,
    expenses,
    allExpenses,   // unfiltered — used for settlement
    partners,
    services,
    totals,
    message,
    messageType,
    submitting,
    filter,
    setFilter,
    onAddEntry,
    onDeleteEntry,
    onAddExpense,
    onDeleteExpense,
    onAddPartner,
    onDeletePartner,
    onAddService,
    onDeleteService,
    onSaveShop,
    onLogout,
    }) {
    const [tab, setTab] = useState('dashboard');
    const [confirmDelete, setConfirmDelete] = useState(null); // { type, id, label }

    function requestDelete(type, id, label) {
        setConfirmDelete({ type, id, label });
    }

    function cancelDelete() {
        setConfirmDelete(null);
    }

    async function confirmDeleteAction() {
        if (!confirmDelete) return;
        const { type, id } = confirmDelete;
        setConfirmDelete(null);
        if (type === 'entry') await onDeleteEntry(id);
        else if (type === 'expense') await onDeleteExpense(id);
        else if (type === 'partner') await onDeletePartner(id);
        else if (type === 'service') await onDeleteService(id);
    }

    const equityTotal = partners.reduce((sum, p) => sum + Number(p.equity_pct || 0), 0);
    const showEquityWarning = partners.length > 0 && Math.abs(equityTotal - 100) > 0.01;

    return (
        <div style={formStyles.page}>
        <div style={formStyles.card}>

            {/* Header */}
            <div style={styles.header}>
            <div style={styles.headerBadge}>● Live</div>
            <h1 style={styles.headerTitle}>DayBooks</h1>
            <p style={styles.shopName}>{shop.name}</p>
            <p style={styles.meta}>
                {shop.category || 'Auto Shop'} {shop.location ? `· ${shop.location}` : ''}
            </p>
            </div>

            <Navbar currentTab={tab} setCurrentTab={setTab} />

            {/* Filter bar — only on relevant tabs */}
            {TABS_WITH_FILTER.includes(tab) && (
            <div style={styles.filterRow}>
                {['today', 'week', 'month', 'all'].map((item) => (
                <button
                    key={item}
                    onClick={() => setFilter(item)}
                    style={{
                    ...styles.filterBtn,
                    background: filter === item ? '#c80815' : '#fff',
                    color: filter === item ? '#fff' : '#333',
                    border: filter === item ? '1px solid #c80815' : '1px solid #e4e4e4',
                    }}
                >
                    {item.toUpperCase()}
                </button>
                ))}
            </div>
            )}

            {/* ── DASHBOARD TAB ── */}
            {tab === 'dashboard' && (
            <>
                <SummaryCard
                totalIncome={totals.totalIncome}
                totalExpense={totals.totalExpense}
                profit={totals.profit}
                />

                <h3 style={styles.sectionTitle}>Recent Income</h3>
                {entries.length === 0 ? (
                <EmptyState
                    icon="💰"
                    text="No income recorded yet"
                    hint={`Switch to the Entries tab and tap "Add Income" to record your first sale.`}
                />
                ) : (
                entries.slice(0, 5).map((item) => (
                    <EntryRow
                    key={item.id}
                    item={item}
                    onDelete={() =>
                        requestDelete('entry', item.id, item.description)
                    }
                    />
                ))
                )}

                <h3 style={styles.sectionTitle}>Recent Expenses</h3>
                {expenses.length === 0 ? (
                <EmptyState
                    icon="🧾"
                    text="No expenses recorded yet"
                    hint={`Switch to the Expenses tab to log what the shop has spent.`}
                />
                ) : (
                expenses.slice(0, 5).map((item) => (
                    <ExpenseRow
                    key={item.id}
                    item={item}
                    onDelete={() =>
                        requestDelete('expense', item.id, item.description)
                    }
                    />
                ))
                )}
            </>
            )}

            {/* ── ENTRIES TAB ── */}
            {tab === 'entries' && (
            <>
                {services.length === 0 ? (
                <EmptyState
                    icon="⚙️"
                    text="No service types yet"
                    hint="Go to Settings → Service Types and add your first service (e.g. Tire Sale) before recording income."
                />
                ) : (
                <EntryForm
                    onAddEntry={onAddEntry}
                    services={services}
                    submitting={submitting}
                />
                )}

                <h3 style={styles.sectionTitle}>All Entries</h3>
                {entries.length === 0 ? (
                <EmptyState
                    icon="💰"
                    text="No income entries for this period"
                    hint="Change the filter above or add a new income entry."
                />
                ) : (
                entries.map((item) => (
                    <EntryRow
                    key={item.id}
                    item={item}
                    onDelete={() =>
                        requestDelete('entry', item.id, item.description)
                    }
                    />
                ))
                )}
            </>
            )}

            {/* ── EXPENSES TAB ── */}
            {tab === 'expenses' && (
            <>
                <ExpenseForm
                onAddExpense={onAddExpense}
                partners={partners}
                currentUserEmail={user.email}
                submitting={submitting}
                />

                <h3 style={styles.sectionTitle}>All Expenses</h3>
                {expenses.length === 0 ? (
                <EmptyState
                    icon="🧾"
                    text="No expenses for this period"
                    hint="Change the filter above or log a new expense."
                />
                ) : (
                expenses.map((item) => (
                    <ExpenseRow
                    key={item.id}
                    item={item}
                    onDelete={() =>
                        requestDelete('expense', item.id, item.description)
                    }
                    />
                ))
                )}
            </>
            )}

            {/* ── PARTNERS TAB ── */}
            {tab === 'partners' && (
            <>
                <PartnersForm onAddPartner={onAddPartner} submitting={submitting} />

                {showEquityWarning && (
                <div style={styles.warning}>
                    ⚠️ Partner equity totals {equityTotal.toFixed(0)}% — should be exactly 100% for accurate settlement.
                </div>
                )}

                <h3 style={styles.sectionTitle}>Partners</h3>
                {partners.length === 0 ? (
                <EmptyState
                    icon="🤝"
                    text="No partners added yet"
                    hint="Add each owner above with their name and equity percentage. They should add up to 100%."
                />
                ) : (
                partners.map((partner) => (
                    <div key={partner.id} style={styles.actionItem}>
                    <span>
                        <strong>{partner.name}</strong>{' '}
                        <span style={styles.badge}>{Number(partner.equity_pct).toFixed(0)}%</span>
                    </span>
                    <button
                        style={styles.deleteBtn}
                        onClick={() => requestDelete('partner', partner.id, partner.name)}
                    >
                        Remove
                    </button>
                    </div>
                ))
                )}

                {/* Settlement always uses ALL expenses, not filtered */}
                <SettlementCard partners={partners} expenses={allExpenses} />
            </>
            )}

            {/* ── REPORTS TAB ── */}
            {tab === 'reports' && (
            <ReportsCard
                entries={entries}
                expenses={expenses}
                totals={totals}
                filter={filter}
            />
            )}

            {/* ── SETTINGS TAB ── */}
            {tab === 'settings' && (
            <>
                <SettingsForm shop={shop} onSaveShop={onSaveShop} submitting={submitting} />

                <h3 style={styles.sectionTitle}>Service Types</h3>
                <ServicesForm onAddService={onAddService} submitting={submitting} />

                {services.length === 0 ? (
                <EmptyState
                    icon="⚙️"
                    text="No service types yet"
                    hint="Add your services above — these will appear when recording income."
                />
                ) : (
                services.map((service) => (
                    <div key={service.id} style={styles.actionItem}>
                    <span>{service.name}</span>
                    <button
                        style={styles.deleteBtn}
                        onClick={() => requestDelete('service', service.id, service.name)}
                    >
                        Delete
                    </button>
                    </div>
                ))
                )}
            </>
            )}

            {/* Logout */}
            <button
            onClick={onLogout}
            style={{ ...formStyles.secondaryButton, marginTop: '8px' }}
            disabled={submitting}
            >
            Logout
            </button>

            {/* Message */}
            {message && (
            <div
                style={{
                ...styles.message,
                background: messageType === 'error' ? '#fff0f0' : '#f0faf4',
                color: messageType === 'error' ? '#c80815' : '#15803d',
                border: `1px solid ${messageType === 'error' ? '#fccaca' : '#bbf0d4'}`,
                }}
            >
                {messageType === 'error' ? '⚠️ ' : '✓ '}
                {message}
            </div>
            )}

            {/* Delete confirmation dialog */}
            {confirmDelete && (
            <div style={styles.overlay}>
                <div style={styles.dialog}>
                <p style={styles.dialogText}>
                    Delete <strong>"{confirmDelete.label}"</strong>?
                </p>
                <p style={styles.dialogSub}>This cannot be undone.</p>
                <div style={styles.dialogButtons}>
                    <button style={styles.cancelBtn} onClick={cancelDelete}>
                    Cancel
                    </button>
                    <button style={styles.confirmBtn} onClick={confirmDeleteAction}>
                    Delete
                    </button>
                </div>
                </div>
            </div>
            )}
        </div>
        </div>
    );
    }

    // ── Sub-components ──────────────────────────────────────────────────────────

    function EntryRow({ item, onDelete }) {
    return (
        <div style={styles.actionItem}>
        <div style={styles.itemLeft}>
            <span style={styles.itemService}>{item.service_type || 'General'}</span>
            <span style={styles.itemDesc}>{item.description}</span>
            <span style={styles.itemDate}>{item.entry_date}</span>
        </div>
        <div style={styles.actionRight}>
            <strong style={{ color: '#15803d' }}>${Number(item.amount).toFixed(2)}</strong>
            <button style={styles.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
        </div>
    );
    }

    function ExpenseRow({ item, onDelete }) {
    return (
        <div style={styles.actionItem}>
        <div style={styles.itemLeft}>
            <span style={styles.itemDesc}>{item.description}</span>
            <span style={styles.itemDate}>
            {item.category} · {item.paid_by || 'Unknown'} · {item.expense_date}
            </span>
        </div>
        <div style={styles.actionRight}>
            <strong style={{ color: '#c80815' }}>${Number(item.amount).toFixed(2)}</strong>
            <button style={styles.deleteBtn} onClick={onDelete}>Delete</button>
        </div>
        </div>
    );
    }

    function EmptyState({ icon, text, hint }) {
    return (
        <div style={styles.emptyState}>
        <span style={styles.emptyIcon}>{icon}</span>
        <p style={styles.emptyText}>{text}</p>
        {hint && <p style={styles.emptyHint}>{hint}</p>}
        </div>
    );
    }

    // ── Styles ──────────────────────────────────────────────────────────────────

    const styles = {
    header: {
        textAlign: 'center',
        marginBottom: '4px',
    },
    headerBadge: {
        display: 'inline-block',
        background: '#f0faf4',
        color: '#15803d',
        fontSize: '11px',
        fontWeight: '700',
        padding: '3px 10px',
        borderRadius: '20px',
        marginBottom: '6px',
        border: '1px solid #bbf0d4',
    },
    headerTitle: {
        margin: '0 0 4px',
        fontSize: '28px',
        fontWeight: '900',
        color: '#c80815',
        letterSpacing: '-0.5px',
    },
    shopName: {
        margin: '0 0 2px',
        fontWeight: '700',
        fontSize: '16px',
        color: '#111',
    },
    meta: {
        margin: 0,
        fontSize: '13px',
        color: '#888',
    },
    filterRow: {
        display: 'flex',
        gap: '8px',
        marginBottom: '4px',
        flexWrap: 'wrap',
    },
    filterBtn: {
        padding: '8px 14px',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '12px',
        transition: 'all 0.15s',
    },
    sectionTitle: {
        margin: '12px 0 6px',
        fontSize: '16px',
        fontWeight: '800',
        color: '#111',
    },
    actionItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 14px',
        border: '1px solid #ececec',
        borderRadius: '12px',
        background: '#fafafa',
        marginBottom: '6px',
    },
    itemLeft: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        flex: 1,
        minWidth: 0,
    },
    itemService: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#111',
    },
    itemDesc: {
        fontSize: '13px',
        color: '#444',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    itemDate: {
        fontSize: '11px',
        color: '#999',
    },
    actionRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
    },
    deleteBtn: {
        padding: '5px 10px',
        borderRadius: '8px',
        border: '1px solid #c80815',
        background: '#fff',
        color: '#c80815',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '700',
    },
    badge: {
        background: '#fff3f3',
        color: '#c80815',
        fontSize: '12px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: '20px',
        border: '1px solid #fccaca',
        marginLeft: '6px',
    },
    warning: {
        background: '#fffbea',
        border: '1px solid #f5d77a',
        color: '#7a5c00',
        borderRadius: '10px',
        padding: '10px 14px',
        fontSize: '13px',
        fontWeight: '600',
    },
    message: {
        padding: '10px 14px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '600',
        marginTop: '4px',
    },
    emptyState: {
        textAlign: 'center',
        padding: '24px 16px',
        border: '1.5px dashed #e4e4e4',
        borderRadius: '14px',
        background: '#fafafa',
        marginBottom: '8px',
    },
    emptyIcon: {
        fontSize: '28px',
        display: 'block',
        marginBottom: '8px',
    },
    emptyText: {
        margin: '0 0 6px',
        fontWeight: '700',
        color: '#333',
        fontSize: '14px',
    },
    emptyHint: {
        margin: 0,
        color: '#888',
        fontSize: '13px',
        lineHeight: '1.5',
    },
    // Confirmation dialog
    overlay: {
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
    },
    dialog: {
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '340px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        textAlign: 'center',
    },
    dialogText: {
        margin: '0 0 6px',
        fontSize: '16px',
        color: '#111',
    },
    dialogSub: {
        margin: '0 0 20px',
        fontSize: '13px',
        color: '#888',
    },
    dialogButtons: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'center',
    },
    cancelBtn: {
        flex: 1,
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid #e4e4e4',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '14px',
        color: '#333',
    },
    confirmBtn: {
        flex: 1,
        padding: '10px',
        borderRadius: '10px',
        border: 'none',
        background: '#c80815',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: '700',
        fontSize: '14px',
    },
    };