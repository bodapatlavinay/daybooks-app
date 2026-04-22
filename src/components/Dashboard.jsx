import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Layout from './Layout';
import SummaryCard from './SummaryCard';
import EntryForm from './EntryForm';
import ExpenseForm from './ExpenseForm';
import SettlementCard from './SettlementCard';
import ReportsCard from './ReportsCard';
import { PartnersForm, ServicesForm, SettingsForm } from './Forms';
import { C } from './styles';
import { PAYMENT_TYPES, paymentLabel, paymentStyle } from './EntryForm';

const TABS_WITH_FILTER = ['entries', 'expenses'];

const EXPENSE_CATEGORIES = [
  { value: 'inventory', label: 'Inventory / Stock' },
  { value: 'rent',      label: 'Rent / Lease' },
  { value: 'labor',     label: 'Labor / Wages' },
  { value: 'utility',   label: 'Utility / Fuel' },
  { value: 'misc',      label: 'Miscellaneous' },
];

export default function Dashboard({
  user, shop,
  entries, expenses, allEntries, allExpenses,
  partners, services,
  totals, periodTotals,
  message, messageType, submitting,
  filter, setFilter,
  onAddEntry,   onEditEntry,   onDeleteEntry,
  onAddExpense, onEditExpense, onDeleteExpense,
  onAddPartner, onEditPartner, onDeletePartner,
  onAddService, onEditService, onDeleteService,
  onSaveShop, onLogout, onDeleteAccount,
  activeShift, staffList = [], onAddStaff, onRemoveStaff, onResetStaffPin,
}) {
  const [tab, setTab]                                   = useState('dashboard');
  const [confirmDelete, setConfirmDelete]               = useState(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deleteAccountInput, setDeleteAccountInput]     = useState('');
  const [editingEntry, setEditingEntry]                 = useState(null);
  const [editingExpense, setEditingExpense]             = useState(null);
  const [editingPartner, setEditingPartner]             = useState(null);
  const [editingService, setEditingService]             = useState(null);
  const [reportPeriod, setReportPeriod]                 = useState('week');
  const [settingsTab, setSettingsTab]                   = useState('shop');
  const [staffForm, setStaffForm]                       = useState({ displayId: '', name: '', pin: '', role: 'staff' });
  const [resetPinId, setResetPinId]                     = useState(null);
  const [resetPinVal, setResetPinVal]                   = useState('');
  const [entryDraft, setEntryDraft]                     = useState(null);
  const [isMobileView, setIsMobileView]               = useState(typeof window !== 'undefined' ? window.innerWidth < 900 : false);

  useEffect(() => {
    const onResize = () => setIsMobileView(window.innerWidth < 900);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);



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

  function openDeleteAccount()  { setDeleteAccountInput(''); setConfirmDeleteAccount(true); }
  function closeDeleteAccount() { setConfirmDeleteAccount(false); setDeleteAccountInput(''); }
  function openReportsFor(period) {
    setReportPeriod(period);
    setTab('reports');
  }

  function duplicateEntry(item) {
    setEntryDraft({
      description: item.description || '',
      amount: String(item.amount || ''),
      date: item.entry_date || new Date().toISOString().slice(0, 10),
      serviceType: item.service_type || services[0]?.name || '',
      paymentType: item.payment_type || 'cash',
    });
    setTab('entries');
    setFilter('all');
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

      {/* ── DASHBOARD ── */}
      {tab === 'dashboard' && (
        <div style={s.dashPage}>
          <div style={s.periodStrip}>
            {[
              { label: 'Today',      pd: periodTotals.today, period: 'today' },
              { label: 'This Week',  pd: periodTotals.week,  period: 'week' },
              { label: 'This Month', pd: periodTotals.month, period: 'month' },
            ].map(({ label, pd, period }) => (
              <button key={label} style={s.periodCardBtn} onClick={() => openReportsFor(period)}>
                <div style={s.periodCard}>
                  <div style={s.periodTop}>
                  <span style={s.periodLabel}>{label}</span>
                  <span style={{
                    ...s.periodBadge,
                    color:      pd.profit >= 0 ? C.greenText : C.red,
                    background: pd.profit >= 0 ? C.greenBg : C.redLight,
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
              </button>
            ))}
          </div>

          <div style={{ ...s.dashGrid, gridTemplateColumns: isMobileView ? '1fr' : s.dashGrid.gridTemplateColumns }}>
            <div style={s.dashLeft}>
              <SummaryCard totalIncome={totals.totalIncome} totalExpense={totals.totalExpense} profit={totals.profit} />
              <Panel title="Quick Add Income">
                {services.length === 0
                  ? <EmptyCard icon="⚙️" text="No services yet" hint="Add services in Settings first." />
                  : <EntryForm
                      onAddEntry={onAddEntry}
                      services={services}
                      submitting={submitting}
                      compact
                      submitLabel="+ Quick Add Income"
                    />}
              </Panel>
            </div>
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
                        onDuplicate={() => duplicateEntry(item)}
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

      {/* ── INCOME ── */}
      {tab === 'entries' && (
        <div style={{ ...s.twoCol, gridTemplateColumns: isMobileView ? '1fr' : s.twoCol.gridTemplateColumns }}>
          <div style={s.leftCol}>
            {services.length === 0
              ? <Panel title="Record Income"><EmptyCard icon="⚙️" text="No services yet" hint="Add services in Settings first." /></Panel>
              : <Panel title="Record Income"><EntryForm onAddEntry={onAddEntry} services={services} submitting={submitting} initialValues={entryDraft} onAppliedInitialValues={() => setEntryDraft(null)} /></Panel>}
          </div>
          <div style={s.rightCol}>
            <TableSection title="All Income" count={entries.length} accentColor={C.green}>
              {entries.length === 0
                ? <EmptyRow text="No entries for this period" hint="Add your first income entry." />
                : entries.map(item => (
                    <EntryRow key={item.id} item={item} services={services}
                      isEditing={editingEntry === item.id}
                      onEdit={() => setEditingEntry(item.id)}
                      onCancelEdit={() => setEditingEntry(null)}
                      onSaveEdit={d => { onEditEntry(item.id, d); setEditingEntry(null); }}
                      onDelete={() => requestDelete('entry', item.id, item.description)}
                      onDuplicate={() => duplicateEntry(item)}
                      submitting={submitting} />
                  ))}
            </TableSection>
          </div>
        </div>
      )}

      {/* ── EXPENSES ── */}
      {tab === 'expenses' && (
        <div style={{ ...s.twoCol, gridTemplateColumns: isMobileView ? '1fr' : s.twoCol.gridTemplateColumns }}>
          <div style={s.leftCol}>
            <Panel title="Log Expense">
              <ExpenseForm onAddExpense={onAddExpense} partners={partners} currentUserEmail={user.email} submitting={submitting} />
            </Panel>
          </div>
          <div style={s.rightCol}>
            <TableSection title="All Expenses" count={expenses.length} accentColor={C.red}>
              {expenses.length === 0
                ? <EmptyRow text="No expenses for this period" hint="Log your first expense." />
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

      {/* ── PARTNERS ── */}
      {tab === 'partners' && (
        <div style={{ ...s.twoCol, gridTemplateColumns: isMobileView ? '1fr' : s.twoCol.gridTemplateColumns }}>
          <div style={s.leftCol}>
            <Panel title="Add Partner">
              <PartnersForm onAddPartner={onAddPartner} submitting={submitting} />
            </Panel>
            {showEquityWarning && (
              <div style={s.warningBanner}>⚠ Equity totals {equityTotal.toFixed(0)}% — should be exactly 100%</div>
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
            <SettlementCard partners={partners} expenses={allExpenses} entries={allEntries} />
          </div>
        </div>
      )}

      {/* ── REPORTS ── */}
      {tab === 'reports' && (
        <ReportsCard
          entries={allEntries || entries}
          expenses={allExpenses || expenses}
          shopName={shop.name}
          shop={shop}
          initialPeriod={reportPeriod}
        />
      )}

      {/* ── SETTINGS ── */}
      {tab === 'settings' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={s.settingsTabs}>
            {[{ id: 'shop', label: 'Shop & Services' }, { id: 'staff', label: 'Staff & PINs' }].map(t => (
              <button key={t.id} onClick={() => setSettingsTab(t.id)} style={{
                ...s.filterBtn,
                background: settingsTab === t.id ? C.dark : C.white,
                color:      settingsTab === t.id ? C.white : C.mid,
                border:     `1px solid ${settingsTab === t.id ? C.dark : C.border}`,
                fontWeight: settingsTab === t.id ? '700' : '400',
              }}>{t.label}</button>
            ))}
          </div>

          {settingsTab === 'shop' && (
            <div style={{ ...s.twoCol, gridTemplateColumns: isMobileView ? '1fr' : s.twoCol.gridTemplateColumns }}>
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
                  <button onClick={onLogout} style={s.signoutBtn} disabled={submitting}>End session</button>
                </Panel>
                <div style={s.dangerPanel}>
                  <div style={s.dangerHeader}><span style={s.dangerTitle}>Danger Zone</span></div>
                  <div style={s.dangerBody}>
                    <div style={s.dangerRow}>
                      <div>
                        <div style={s.dangerItemTitle}>Delete account</div>
                        <div style={s.dangerItemDesc}>Permanently deletes your shop and all data. Cannot be undone.</div>
                      </div>
                      <button onClick={openDeleteAccount} style={s.dangerBtn} disabled={submitting}>Delete account</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'staff' && (
            <div style={{ ...s.twoCol, gridTemplateColumns: isMobileView ? '1fr' : s.twoCol.gridTemplateColumns }}>
              <div style={s.leftCol}>
                <Panel title="Add Staff / Manager">
                  <p style={{ fontSize: '12px', color: C.muted, background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 12px', lineHeight: '1.6', margin: 0 }}>
                    Give each person a short ID (like 01, 07) and a PIN. They tap their card on the shift screen and enter their PIN — no email needed.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={s.editField}>
                      <label style={s.editLabel}>ID (e.g. 01, 07, 42)</label>
                      <input value={staffForm.displayId} onChange={e => setStaffForm(f => ({ ...f, displayId: e.target.value }))}
                        placeholder="07" style={s.editInput} maxLength={6} />
                    </div>
                    <div style={s.editField}>
                      <label style={s.editLabel}>Name</label>
                      <input value={staffForm.name} onChange={e => setStaffForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John" style={s.editInput} />
                    </div>
                    <div style={s.editField}>
                      <label style={s.editLabel}>PIN</label>
                      <input value={staffForm.pin} onChange={e => setStaffForm(f => ({ ...f, pin: e.target.value }))}
                        placeholder="1234" style={s.editInput} maxLength={6} type="password" />
                    </div>
                    <div style={s.editField}>
                      <label style={s.editLabel}>Role</label>
                      <select value={staffForm.role} onChange={e => setStaffForm(f => ({ ...f, role: e.target.value }))} style={s.editInput}>
                        <option value="staff">Staff — income only</option>
                        <option value="manager">Manager — full access</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => { onAddStaff(staffForm); setStaffForm({ displayId: '', name: '', pin: '', role: 'staff' }); }}
                    style={{ ...s.editSaveBtn, width: '100%', padding: '11px' }}
                    disabled={submitting || !staffForm.displayId || !staffForm.name || !staffForm.pin}
                  >
                    {submitting ? 'Adding...' : '+ Add to shift roster'}
                  </button>
                </Panel>
              </div>
              <div style={s.rightCol}>
                <div style={s.tableSection}>
                  <div style={s.tableSectionHead}>
                    <div style={{ ...s.tableSectionAccent, background: '#7C3AED' }} />
                    <span style={s.tableSectionTitle}>Shift roster</span>
                    <span style={s.tableCount}>{staffList.filter(m => m.is_active).length}</span>
                  </div>
                  {staffList.filter(m => m.is_active).length === 0 ? (
                    <EmptyRow text="No staff yet" hint="Add staff using the form on the left." />
                  ) : staffList.filter(m => m.is_active).map(member => (
                    <div key={member.id} style={s.tableRow}>
                      <div style={s.rowMain}>
                        <div style={s.rowTop}>
                          <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '4px',
                            background: member.role === 'manager' ? '#EFF6FF' : C.greenBg,
                            color: member.role === 'manager' ? '#1D4ED8' : C.greenText }}>
                            #{member.display_id} · {member.role === 'manager' ? 'Manager' : 'Staff'}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: C.dark }}>{member.name}</span>
                        </div>
                        {resetPinId === member.id ? (
                          <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                            <input value={resetPinVal} onChange={e => setResetPinVal(e.target.value)}
                              placeholder="New PIN" style={{ ...s.editInput, flex: 1, padding: '6px 10px' }} maxLength={6} type="password" />
                            <button onClick={() => { onResetStaffPin(member.id, resetPinVal); setResetPinId(null); setResetPinVal(''); }}
                              style={{ ...s.editSaveBtn, padding: '6px 12px', fontSize: '12px' }} disabled={!resetPinVal}>Save</button>
                            <button onClick={() => { setResetPinId(null); setResetPinVal(''); }}
                              style={{ ...s.editCancelBtn, padding: '6px 10px', fontSize: '12px' }}>Cancel</button>
                          </div>
                        ) : (
                          <span style={s.rowMeta}>PIN: {"•".repeat(member.pin?.length || 4)}</span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => { setResetPinId(member.id); setResetPinVal(''); }} style={s.editBtn}>Reset PIN</button>
                        <button onClick={() => onRemoveStaff(member.id)} style={s.deleteBtn} disabled={submitting}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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

      {/* Delete account dialog */}
      {confirmDeleteAccount && (
        <div style={s.overlay}>
          <div style={{ ...s.dialog, maxWidth: '420px' }}>
            <div style={{ ...s.dialogIconWrap, background: C.redLight }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.red} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <p style={s.dialogTitle}>Delete your account?</p>
            <p style={{ fontSize: '13px', color: C.mid, margin: '0 0 16px', lineHeight: '1.6' }}>
              This will permanently delete <strong>{shop?.name}</strong> and all its data. Cannot be undone.
              <br /><br />
              <span style={{ color: '#9E9E9E', fontSize: '12px' }}>
                ⚠ Note: Your login email cannot be reused to create a new account. Use a different email if you sign up again.
              </span>
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
                style={{ ...s.deleteAccountInput, borderColor: deleteAccountInput && deleteAccountInput !== 'DELETE' ? C.red : C.border }}
                autoComplete="off"
              />
            </div>
            <div style={s.dialogBtns}>
              <button style={s.dialogCancel} onClick={closeDeleteAccount}>Cancel</button>
              <button
                style={{ ...s.dialogConfirm, opacity: deleteAccountInput === 'DELETE' ? 1 : 0.4, cursor: deleteAccountInput === 'DELETE' ? 'pointer' : 'not-allowed' }}
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

// ── Wrappers ──────────────────────────────────────────────────────────────────

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
// FIX: Each row owns its edit state. When Edit is clicked, state is reset
// from the current item values. This ensures edits always reflect fresh data.

function EntryRow({ item, services, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, onDuplicate, submitting }) {
  const [desc, setDesc] = useState(item.description);
  const [amt,  setAmt]  = useState(String(item.amount));
  const [date, setDate] = useState(item.entry_date);
  const [svc,  setSvc]  = useState(item.service_type || '');
  const [pay,  setPay]  = useState(item.payment_type || 'cash');

  // Reset state to current item values every time Edit is opened
  function handleEdit() {
    setDesc(item.description);
    setAmt(String(item.amount));
    setDate(item.entry_date);
    setSvc(item.service_type || (services[0]?.name || ''));
    setPay(item.payment_type || 'cash');
    onEdit();
  }

  if (isEditing) return (
    <div style={s.editCard}>
      <div style={s.editGrid}>
        <div style={s.editField}>
          <label htmlFor={`ee-svc-${item.id}`} style={s.editLabel}>Service</label>
          <select id={`ee-svc-${item.id}`} value={svc} onChange={e => setSvc(e.target.value)} style={s.editInput}>
            {services.map(sv => <option key={sv.id} value={sv.name}>{sv.name}</option>)}
          </select>
        </div>
        <div style={s.editField}>
          <label htmlFor={`ee-desc-${item.id}`} style={s.editLabel}>Description</label>
          <input id={`ee-desc-${item.id}`} value={desc} onChange={e => setDesc(e.target.value)} style={s.editInput} autoFocus />
        </div>
        <div style={s.editField}>
          <label htmlFor={`ee-amt-${item.id}`} style={s.editLabel}>Amount ($)</label>
          <input id={`ee-amt-${item.id}`} type="number" min="0.01" step="0.01" value={amt} onChange={e => setAmt(e.target.value)} style={s.editInput} />
        </div>
        <div style={s.editField}>
          <label htmlFor={`ee-date-${item.id}`} style={s.editLabel}>Date</label>
          <input id={`ee-date-${item.id}`} type="date" value={date} onChange={e => setDate(e.target.value)} style={s.editInput} />
        </div>
      </div>
      {/* Payment method */}
      <div>
        <div style={{ fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>Payment Method</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {PAYMENT_TYPES.map(p => {
            const active = pay === p.value;
            return (
              <button key={p.value} type="button" onClick={() => setPay(p.value)}
                style={{ padding: '5px 11px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontFamily: "'Outfit',sans-serif", fontWeight: active ? '700' : '500', background: active ? p.bg : '#FAFAF8', color: active ? p.color : C.muted, border: `1.5px solid ${active ? p.border : C.border}` }}>
                {p.label}
              </button>
            );
          })}
        </div>
      </div>
      <div style={s.editActions}>
        <button style={s.editCancelBtn} onClick={onCancelEdit}>Cancel</button>
        <button style={s.editSaveBtn} disabled={submitting}
          onClick={() => onSaveEdit({ description: desc, amount: amt, date, serviceType: svc, paymentType: pay })}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.tableRow}>
      <div style={s.rowMain}>
        <div style={s.rowTop}>
          <span style={s.rowTag}>{item.service_type || 'General'}</span>
          {(() => { const ps = paymentStyle(item.payment_type || 'cash'); return <span style={{ fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px', flexShrink: 0, background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>{paymentLabel(item.payment_type || 'cash')}</span>; })()}
          <span style={s.rowDesc}>{item.description}</span>
        </div>
        <span style={s.rowMeta}>{item.entry_date}</span>
      </div>
      <div style={s.rowRight}>
        <span style={{ ...s.rowAmt, color: C.green }}>${Number(item.amount).toFixed(2)}</span>
        <RowBtns onEdit={handleEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
      </div>
    </div>
  );
}

function ExpenseRow({ item, partners, currentUserEmail, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, onDuplicate, submitting }) {
  const [desc, setDesc] = useState(item.description);
  const [amt,  setAmt]  = useState(String(item.amount));
  const [cat,  setCat]  = useState(item.category || 'misc');
  const [date, setDate] = useState(item.expense_date);
  const [paid, setPaid] = useState(item.paid_by || currentUserEmail);

  function handleEdit() {
    setDesc(item.description);
    setAmt(String(item.amount));
    setCat(item.category || 'misc');
    setDate(item.expense_date);
    setPaid(item.paid_by || currentUserEmail);
    onEdit();
  }

  if (isEditing) return (
    <div style={s.editCard}>
      <div style={s.editGrid}>
        <div style={s.editField}>
          <label htmlFor={`ex-desc-${item.id}`} style={s.editLabel}>Description</label>
          <input id={`ex-desc-${item.id}`} value={desc} onChange={e => setDesc(e.target.value)} style={s.editInput} autoFocus />
        </div>
        <div style={s.editField}>
          <label htmlFor={`ex-amt-${item.id}`} style={s.editLabel}>Amount ($)</label>
          <input id={`ex-amt-${item.id}`} type="number" min="0.01" step="0.01" value={amt} onChange={e => setAmt(e.target.value)} style={s.editInput} />
        </div>
        <div style={s.editField}>
          <label htmlFor={`ex-cat-${item.id}`} style={s.editLabel}>Category</label>
          <select id={`ex-cat-${item.id}`} value={cat} onChange={e => setCat(e.target.value)} style={s.editInput}>
            {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div style={s.editField}>
          <label htmlFor={`ex-paid-${item.id}`} style={s.editLabel}>Paid By</label>
          <select id={`ex-paid-${item.id}`} value={paid} onChange={e => setPaid(e.target.value)} style={s.editInput}>
            <option value={currentUserEmail}>Me ({currentUserEmail})</option>
            {partners.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
          </select>
        </div>
        <div style={s.editField}>
          <label htmlFor={`ex-date-${item.id}`} style={s.editLabel}>Date</label>
          <input id={`ex-date-${item.id}`} type="date" value={date} onChange={e => setDate(e.target.value)} style={s.editInput} />
        </div>
      </div>
      <div style={s.editActions}>
        <button style={s.editCancelBtn} onClick={onCancelEdit}>Cancel</button>
        <button style={s.editSaveBtn} disabled={submitting}
          onClick={() => onSaveEdit({ description: desc, amount: amt, category: cat, date, paidBy: paid })}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
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
        <RowBtns onEdit={handleEdit} onDelete={onDelete} onDuplicate={onDuplicate} />
      </div>
    </div>
  );
}

function PartnerRow({ partner, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
  const [name, setName] = useState(partner.name);
  const [eq,   setEq]   = useState(String(partner.equity_pct));

  function handleEdit() {
    setName(partner.name);
    setEq(String(partner.equity_pct));
    onEdit();
  }

  if (isEditing) return (
    <div style={s.editCard}>
      <div style={s.editGrid}>
        <div style={s.editField}>
          <label htmlFor={`pt-name-${partner.id}`} style={s.editLabel}>Name</label>
          <input id={`pt-name-${partner.id}`} value={name} onChange={e => setName(e.target.value)} style={s.editInput} autoFocus />
        </div>
        <div style={s.editField}>
          <label htmlFor={`pt-eq-${partner.id}`} style={s.editLabel}>Equity %</label>
          <input id={`pt-eq-${partner.id}`} type="number" min="1" max="100" step="1" value={eq} onChange={e => setEq(e.target.value)} style={s.editInput} />
        </div>
      </div>
      <div style={s.editActions}>
        <button style={s.editCancelBtn} onClick={onCancelEdit}>Cancel</button>
        <button style={s.editSaveBtn} disabled={submitting}
          onClick={() => onSaveEdit({ name, equityPct: eq })}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.tableRow}>
      <div style={s.rowMain}>
        <span style={s.rowDesc}><strong>{partner.name}</strong></span>
      </div>
      <div style={s.rowRight}>
        <span style={s.equityChip}>{Number(partner.equity_pct).toFixed(0)}%</span>
        <RowBtns onEdit={handleEdit} onDelete={onDelete} deleteLabel="Remove" />
      </div>
    </div>
  );
}

function ServiceRow({ service, isEditing, onEdit, onCancelEdit, onSaveEdit, onDelete, submitting }) {
  const [name, setName] = useState(service.name);

  function handleEdit() {
    setName(service.name);
    onEdit();
  }

  if (isEditing) return (
    <div style={s.editCard}>
      <div style={s.editField}>
        <label htmlFor={`sv-${service.id}`} style={s.editLabel}>Service name</label>
        <input id={`sv-${service.id}`} value={name} onChange={e => setName(e.target.value)} style={s.editInput} autoFocus />
      </div>
      <div style={s.editActions}>
        <button style={s.editCancelBtn} onClick={onCancelEdit}>Cancel</button>
        <button style={s.editSaveBtn} disabled={submitting} onClick={() => onSaveEdit(name)}>
          {submitting ? 'Saving...' : 'Save changes'}
        </button>
      </div>
    </div>
  );

  return (
    <div style={s.tableRow}>
      <span style={s.rowDesc}>{service.name}</span>
      <RowBtns onEdit={handleEdit} onDelete={onDelete} />
    </div>
  );
}

function RowBtns({ onEdit, onDelete, onDuplicate, deleteLabel = 'Delete' }) {
  return (
    <div style={s.rowBtns}>
      {onDuplicate && <button style={s.duplicateBtn} onClick={onDuplicate}>Duplicate</button>}
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

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  dashPage:    { display: 'flex', flexDirection: 'column', gap: '20px' },
  periodStrip: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' },
  dashGrid:    { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' },
  dashLeft:    { display: 'flex', flexDirection: 'column', gap: '12px' },
  dashRight:   { display: 'flex', flexDirection: 'column', gap: '16px' },
  twoCol:      { display: 'grid', gridTemplateColumns: '340px 1fr', gap: '20px', alignItems: 'start' },
  leftCol:     { display: 'flex', flexDirection: 'column', gap: '16px' },
  rightCol:    { display: 'flex', flexDirection: 'column', gap: '16px' },

  filterBar: { display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' },
  filterBtn: { padding: '7px 16px', borderRadius: '7px', cursor: 'pointer', fontSize: '13px', fontFamily: "'Outfit', sans-serif", transition: 'all 0.12s' },

  periodCardBtn:  { background: 'transparent', border: 'none', padding: 0, margin: 0, cursor: 'pointer', textAlign: 'left', width: '100%' },
  periodCard:     { background: C.white, borderRadius: '12px', padding: '20px', border: `1px solid ${C.border}`, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'transform 0.12s, box-shadow 0.12s, border-color 0.12s' },
  periodTop:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  periodLabel:    { fontSize: '12px', fontWeight: '600', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.6px' },
  periodBadge:    { fontSize: '12px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' },
  periodIncome:   { fontSize: '26px', fontWeight: '800', color: C.dark, letterSpacing: '-0.5px', marginBottom: '10px' },
  periodBottom:   { display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: `1px solid ${C.border}` },
  periodExpLabel: { fontSize: '12px', color: C.muted },
  periodExpVal:   { fontSize: '12px', fontWeight: '600', color: C.red },

  panel:      { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  panelTitle: { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.8px', padding: '14px 20px 0' },
  panelBody:  { padding: '14px 20px 20px', display: 'flex', flexDirection: 'column', gap: '10px' },

  tableSection:       { background: C.white, borderRadius: '12px', border: `1px solid ${C.border}`, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' },
  tableSectionHead:   { display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 20px', borderBottom: `1px solid ${C.border}` },
  tableSectionAccent: { width: '3px', height: '16px', borderRadius: '2px', flexShrink: 0 },
  tableSectionTitle:  { fontSize: '13px', fontWeight: '700', color: C.dark, flex: 1 },
  tableCount:         { fontSize: '11px', fontWeight: '700', color: C.muted, background: C.bg, padding: '2px 8px', borderRadius: '20px', border: `1px solid ${C.border}` },

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
  duplicateBtn: { padding: '5px 11px', borderRadius: '6px', border: `1px solid ${C.greenBorder}`, background: C.greenBg, color: C.greenText, cursor: 'pointer', fontSize: '12px', fontWeight: '500', fontFamily: "'Outfit', sans-serif" },
  deleteBtn: { padding: '5px 11px', borderRadius: '6px', border: `1px solid ${C.redMid}`, background: C.redLight, color: C.red, cursor: 'pointer', fontSize: '12px', fontWeight: '500', fontFamily: "'Outfit', sans-serif" },

  editCard:    { padding: '14px 20px', background: '#FAFAF8', borderBottom: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '12px' },
  editGrid:    { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' },
  editField:   { display: 'flex', flexDirection: 'column', gap: '4px' },
  editLabel:   { fontSize: '10px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  editInput:   { padding: '8px 11px', borderRadius: '7px', border: `1px solid ${C.border}`, fontSize: '13px', background: C.white, outline: 'none', width: '100%', boxSizing: 'border-box', fontFamily: "'Outfit', sans-serif", color: C.dark },
  editActions: { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  editSaveBtn:   { padding: '8px 18px', borderRadius: '7px', border: 'none', background: C.dark, color: C.white, cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit', sans-serif" },
  editCancelBtn: { padding: '8px 14px', borderRadius: '7px', border: `1px solid ${C.border}`, background: C.white, color: C.mid, cursor: 'pointer', fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif" },

  warningBanner: { background: C.amberBg, border: `1px solid ${C.amberBorder}`, color: C.amber, borderRadius: '10px', padding: '10px 14px', fontSize: '13px', fontWeight: '600' },
  emptyRow:     { padding: '20px', display: 'flex', flexDirection: 'column', gap: '3px' },
  emptyRowText: { fontSize: '13px', fontWeight: '600', color: C.mid },
  emptyRowHint: { fontSize: '12px', color: C.muted },
  emptyCard:     { textAlign: 'center', padding: '20px 16px' },
  emptyCardIcon: { fontSize: '24px', display: 'block', marginBottom: '8px', opacity: 0.5 },
  emptyCardText: { fontSize: '13px', fontWeight: '600', color: C.mid, margin: '0 0 4px' },
  emptyCardHint: { fontSize: '12px', color: C.muted, margin: 0 },

  accountItem:  { display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: '10px', borderBottom: `1px solid ${C.border}` },
  accountLabel: { fontSize: '10px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  accountValue: { fontSize: '14px', color: C.dark, fontWeight: '500' },
  signoutBtn:   { padding: '9px', borderRadius: '8px', border: `1px solid ${C.border}`, background: 'transparent', color: C.mid, cursor: 'pointer', fontWeight: '500', fontSize: '13px', fontFamily: "'Outfit', sans-serif", marginTop: '4px', width: '100%' },

  dangerPanel:     { borderRadius: '12px', border: `1px solid ${C.redMid}`, overflow: 'hidden' },
  dangerHeader:    { background: C.redLight, padding: '12px 20px', borderBottom: `1px solid ${C.redMid}` },
  dangerTitle:     { fontSize: '12px', fontWeight: '700', color: C.red, textTransform: 'uppercase', letterSpacing: '0.8px' },
  dangerBody:      { background: C.white, padding: '16px 20px' },
  dangerRow:       { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' },
  dangerItemTitle: { fontSize: '14px', fontWeight: '700', color: C.dark, marginBottom: '4px' },
  dangerItemDesc:  { fontSize: '12px', color: C.muted, lineHeight: '1.5', maxWidth: '220px' },
  dangerBtn:       { padding: '8px 14px', borderRadius: '8px', border: `1px solid ${C.redMid}`, background: C.redLight, color: C.red, cursor: 'pointer', fontWeight: '600', fontSize: '13px', fontFamily: "'Outfit', sans-serif", flexShrink: 0 },

  deleteAccountField: { display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' },
  deleteAccountLabel: { fontSize: '13px', color: C.mid },
  deleteAccountInput: { padding: '11px 14px', borderRadius: '9px', border: `1.5px solid ${C.border}`, fontSize: '14px', background: C.surface, outline: 'none', color: C.dark, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box', letterSpacing: '2px', fontWeight: '700' },

  staffHint:    { fontSize: '13px', color: C.muted, lineHeight: '1.6', background: C.bg, border: `1px solid ${C.border}`, borderRadius: '8px', padding: '10px 12px', margin: '0 0 4px' },
  staffField:   { display: 'flex', flexDirection: 'column', gap: '5px' },
  staffLabel:   { fontSize: '11px', fontWeight: '700', color: C.muted, textTransform: 'uppercase', letterSpacing: '0.5px' },
  staffInput:   { padding: '10px 12px', borderRadius: '8px', border: `1.5px solid ${C.border}`, fontSize: '13px', background: C.surface, outline: 'none', color: C.dark, fontFamily: "'Outfit', sans-serif", width: '100%', boxSizing: 'border-box' },
  staffInviteBtn: { padding: '11px', borderRadius: '8px', border: 'none', background: C.dark, color: C.white, fontWeight: '700', fontSize: '14px', fontFamily: "'Outfit', sans-serif", cursor: 'pointer' },
  staffRoleBadge: { fontSize: '11px', fontWeight: '600', color: '#5B21B6', background: '#EDE9FE', padding: '2px 7px', borderRadius: '4px', flexShrink: 0 },
  settingsTabs: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' },
  toast: { position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', fontFamily: "'Outfit', sans-serif", zIndex: 9999, whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.24)' },

  overlay:        { position: 'fixed', inset: 0, background: 'rgba(10,10,10,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
  dialog:         { background: C.white, borderRadius: '14px', padding: '24px', maxWidth: '380px', width: '100%', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' },
  dialogIconWrap: { width: '40px', height: '40px', background: C.redLight, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' },
  dialogTitle:    { fontSize: '17px', fontWeight: '800', color: C.dark, margin: '0 0 6px', letterSpacing: '-0.2px' },
  dialogSub:      { fontSize: '13px', color: C.mid, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' },
  dialogNote:     { fontSize: '13px', color: C.muted, margin: '8px 0 20px' },
  dialogBtns:     { display: 'flex', gap: '8px', justifyContent: 'flex-end' },
  dialogCancel:   { padding: '10px 20px', borderRadius: '8px', border: `1px solid ${C.border}`, background: C.white, color: C.mid, cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: "'Outfit', sans-serif" },
  dialogConfirm:  { padding: '10px 20px', borderRadius: '8px', border: 'none', background: C.red, color: C.white, cursor: 'pointer', fontWeight: '600', fontSize: '14px', fontFamily: "'Outfit', sans-serif" },
};