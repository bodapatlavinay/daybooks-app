import { useMemo, useState } from 'react';
import Layout from './Layout';
import SummaryCard from './SummaryCard';
import EntryForm from './EntryForm';
import ExpenseForm from './ExpenseForm';
import SettlementCard from './SettlementCard';
import ReportsCard from './ReportsCard';
import { PartnersForm } from './Forms';
import { C } from './styles';
import CustomerSearchCard from './CustomerSearchCard';
import CloseDayModal from './CloseDayModal';
import SettlementHistoryCard from './SettlementHistoryCard';
import InventoryCard from './InventoryCard';
import SettingsShopPanel from './SettingsShopPanel';

const TABS_WITH_FILTER = ['entries', 'expenses'];

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function filterByPeriod(items, type, filter) {
  if (filter === 'all') return items;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return items.filter((item) => {
    const dateStr = type === 'entry' ? item.entry_date : item.expense_date;
    if (!dateStr) return false;

    const date = new Date(`${dateStr}T00:00:00`);

    if (filter === 'today') return date.toDateString() === today.toDateString();

    if (filter === 'week') {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay());
      return date >= start;
    }

    if (filter === 'month') {
      return date >= new Date(today.getFullYear(), today.getMonth(), 1);
    }

    return true;
  });
}

export default function Dashboard(props) {
  const {
    user, shop,
    entries, expenses, allEntries, allExpenses,
    partners, services, inventoryItems = [], settlementPeriods = [], dayClosures = [],
    totals, periodTotals,
    message, messageType, submitting,
    filter, setFilter,
    onAddEntry, onEditEntry, onDeleteEntry,
    onAddExpense, onEditExpense, onDeleteExpense,
    onAddPartner, onEditPartner, onDeletePartner,
    onAddService, onEditService, onDeleteService,
    onSaveShop, onLogout, onDeleteAccount,
    activeShift, staffList = [], onAddStaff, onRemoveStaff, onResetStaffPin,
    onCloseDay, onCreateSettlementPeriod,
    onAddInventoryItem, onUpdateInventoryItem, onDeleteInventoryItem,
  } = props;

  const [tab, setTab] = useState('dashboard');
  const [settingsTab, setSettingsTab] = useState('shop');
  const [showCloseDay, setShowCloseDay] = useState(false);
  const [staffForm, setStaffForm] = useState({
    displayId: '',
    name: '',
    pin: '',
    role: 'staff',
  });
  const [resetPinId, setResetPinId] = useState(null);
  const [resetPinVal, setResetPinVal] = useState('');

  const eqTotal = partners.reduce((s, p) => s + Number(p.equity_pct || 0), 0);

  const filteredEntries = useMemo(
    () => filterByPeriod(entries, 'entry', filter),
    [entries, filter]
  );

  const filteredExpenses = useMemo(
    () => filterByPeriod(expenses, 'expense', filter),
    [expenses, filter]
  );

  return (
    <Layout shop={shop} user={user} currentTab={tab} setCurrentTab={setTab} onLogout={onLogout}>
      {TABS_WITH_FILTER.includes(tab) && (
        <div style={s.filterBar}>
          {['today', 'week', 'month', 'all'].map((val) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                ...s.filterBtn,
                background: filter === val ? C.dark : C.white,
                color: filter === val ? C.white : C.mid,
                border: `1px solid ${filter === val ? C.dark : C.border}`,
              }}
            >
              {val === 'all'
                ? 'All Time'
                : val === 'week'
                ? 'This Week'
                : val === 'month'
                ? 'This Month'
                : 'Today'}
            </button>
          ))}
        </div>
      )}

      {tab === 'dashboard' && (
        <div style={s.stack}>
          <div style={s.periodStrip}>
            {[
              { label: 'Today', pd: periodTotals?.today },
              { label: 'This Week', pd: periodTotals?.week },
              { label: 'This Month', pd: periodTotals?.month },
            ].map(({ label, pd }) => (
              <div key={label} style={s.periodCard}>
                <div style={s.periodLabel}>{label}</div>
                <div style={s.periodIncome}>{money(pd?.income || 0)}</div>
                <div style={s.periodMeta}>
                  Expenses {money(pd?.expense || 0)} • Net {money(pd?.profit || 0)}
                </div>
              </div>
            ))}
          </div>

          <div style={s.grid2}>
            <SummaryCard
              totalIncome={totals.totalIncome}
              totalExpense={totals.totalExpense}
              profit={totals.profit}
            />
            <CustomerSearchCard entries={allEntries || entries} />
          </div>

          <div style={s.grid2}>
            <Panel title="Quick Add Income">
              {services.length === 0 ? (
                <Empty text="Add services in Settings first." />
              ) : (
                <EntryForm
                  onAddEntry={onAddEntry}
                  services={services}
                  inventoryItems={inventoryItems}
                  submitting={submitting}
                  compact
                  submitLabel="+ Quick Add Income"
                />
              )}
            </Panel>

            <Panel title="Close Day & Controls">
              <div style={s.controlCol}>
                <button
                  style={s.primaryBtn}
                  onClick={() => setShowCloseDay(true)}
                  disabled={submitting}
                >
                  Close today
                </button>

                <button
                  style={s.secondaryBtn}
                  onClick={() => onCreateSettlementPeriod?.()}
                  disabled={submitting || partners.length === 0}
                >
                  Close current month
                </button>

                <div style={s.muted}>
                  Saved day closures: {dayClosures.length} • Frozen settlements: {settlementPeriods.length}
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {tab === 'entries' && (
        <div style={s.grid2}>
          <Panel title="Record Income">
            <EntryForm
              onAddEntry={onAddEntry}
              services={services}
              inventoryItems={inventoryItems}
              submitting={submitting}
            />
          </Panel>

          <Panel title={`Income (${filteredEntries.length})`}>
            {filteredEntries.length === 0 ? (
              <Empty text="No entries for this period." />
            ) : (
              filteredEntries.map((item) => (
                <SimpleRow
                  key={item.id}
                  title={`${item.service_type || 'General'} • ${item.description}`}
                  meta={[item.entry_date, item.customer_name, item.vehicle_plate].filter(Boolean).join(' • ')}
                  amount={Number(item.amount || 0)}
                  onDelete={() => onDeleteEntry(item.id, item.description)}
                />
              ))
            )}
          </Panel>
        </div>
      )}

      {tab === 'expenses' && (
        <div style={s.grid2}>
          <Panel title="Log Expense">
            <ExpenseForm
              onAddExpense={onAddExpense}
              partners={partners}
              currentUserEmail={user.email}
              submitting={submitting}
            />
          </Panel>

          <Panel title={`Expenses (${filteredExpenses.length})`}>
            {filteredExpenses.length === 0 ? (
              <Empty text="No expenses for this period." />
            ) : (
              filteredExpenses.map((item) => (
                <SimpleRow
                  key={item.id}
                  title={`${item.vendor_name || item.description}`}
                  meta={[item.expense_date, item.category, item.payment_method].filter(Boolean).join(' • ')}
                  amount={-Math.abs(Number(item.amount || 0))}
                  onDelete={() => onDeleteExpense(item.id)}
                />
              ))
            )}
          </Panel>
        </div>
      )}

      {tab === 'partners' && (
        <div style={s.grid2}>
          <div style={s.stack}>
            <Panel title="Add Partner">
              <PartnersForm onAddPartner={onAddPartner} submitting={submitting} />
              <div
                style={{
                  ...s.equityBox,
                  color: eqTotal === 100 ? C.greenText : C.amber,
                  background: eqTotal === 100 ? C.greenBg : C.amberBg,
                }}
              >
                {eqTotal === 100
                  ? '✓ Equity balanced at 100%'
                  : `Equity totals ${eqTotal.toFixed(0)}%`}
              </div>
            </Panel>

            <Panel title="Partner list">
              {partners.length === 0 ? (
                <Empty text="No partners yet." />
              ) : (
                partners.map((p) => (
                  <SimpleRow
                    key={p.id}
                    title={p.name}
                    meta={`${Number(p.equity_pct || 0).toFixed(0)}% ownership`}
                    amount={null}
                    onDelete={() => onDeletePartner(p.id)}
                  />
                ))
              )}
            </Panel>
          </div>

          <div style={s.stack}>
            <Panel title="Current settlement preview">
              <SettlementCard
                partners={partners}
                expenses={allExpenses || expenses}
                entries={allEntries || entries}
              />
            </Panel>

            <SettlementHistoryCard periods={settlementPeriods} />
          </div>
        </div>
      )}

      {tab === 'reports' && (
        <ReportsCard
          entries={allEntries || entries}
          expenses={allExpenses || expenses}
          shopName={shop.name}
          shop={shop}
          initialPeriod="month"
        />
      )}

      {tab === 'settings' && (
        <div style={s.stack}>
          <div style={s.filterBar}>
            {[
              { id: 'shop', label: 'Shop & Services' },
              { id: 'staff', label: 'Staff & PINs' },
              { id: 'inventory', label: 'Inventory' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSettingsTab(t.id)}
                style={{
                  ...s.filterBtn,
                  background: settingsTab === t.id ? C.dark : C.white,
                  color: settingsTab === t.id ? C.white : C.mid,
                  border: `1px solid ${settingsTab === t.id ? C.dark : C.border}`,
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {settingsTab === 'shop' && (
            <SettingsShopPanel
              shop={shop}
              user={user}
              services={services}
              submitting={submitting}
              onSaveShop={onSaveShop}
              onAddService={onAddService}
              onEditService={onEditService}
              onDeleteService={onDeleteService}
              onLogout={onLogout}
              onDeleteAccount={onDeleteAccount}
            />
          )}

          {settingsTab === 'staff' && (
            <div style={s.grid2}>
              <Panel title="Add Staff / Manager">
                <div style={s.grid2Form}>
                  <label htmlFor="staff-display-id" style={s.srOnly}>Staff ID</label>
                  <input
                    id="staff-display-id"
                    name="staff-display-id"
                    value={staffForm.displayId}
                    onChange={(e) => setStaffForm((f) => ({ ...f, displayId: e.target.value }))}
                    placeholder="ID"
                    style={s.input}
                    autoComplete="off"
                  />

                  <label htmlFor="staff-name" style={s.srOnly}>Staff name</label>
                  <input
                    id="staff-name"
                    name="staff-name"
                    value={staffForm.name}
                    onChange={(e) => setStaffForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Name"
                    style={s.input}
                    autoComplete="off"
                  />

                  <label htmlFor="staff-pin" style={s.srOnly}>Staff PIN</label>
                  <input
                    id="staff-pin"
                    name="staff-pin"
                    value={staffForm.pin}
                    onChange={(e) => setStaffForm((f) => ({ ...f, pin: e.target.value }))}
                    placeholder="PIN"
                    style={s.input}
                    type="password"
                    autoComplete="new-password"
                  />

                  <label htmlFor="staff-role" style={s.srOnly}>Staff role</label>
                  <select
                    id="staff-role"
                    name="staff-role"
                    value={staffForm.role}
                    onChange={(e) => setStaffForm((f) => ({ ...f, role: e.target.value }))}
                    style={s.input}
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    onAddStaff(staffForm);
                    setStaffForm({ displayId: '', name: '', pin: '', role: 'staff' });
                  }}
                  style={s.primaryBtn}
                  disabled={submitting}
                >
                  + Add to shift roster
                </button>
              </Panel>

              <Panel title="Shift roster">
                {staffList.length === 0 ? (
                  <Empty text="No staff yet." />
                ) : (
                  staffList.map((member) => (
                    <div key={member.id} style={s.staffRow}>
                      <div>
                        <div style={s.staffName}>{member.name}</div>
                        <div style={s.staffMeta}>#{member.display_id} • {member.role}</div>
                      </div>

                      <div style={s.staffActions}>
                        {resetPinId === member.id ? (
                          <>
                            <label htmlFor={`reset-pin-${member.id}`} style={s.srOnly}>
                              New PIN
                            </label>
                            <input
                              id={`reset-pin-${member.id}`}
                              name={`reset-pin-${member.id}`}
                              value={resetPinVal}
                              onChange={(e) => setResetPinVal(e.target.value)}
                              style={{ ...s.input, width: '94px' }}
                              placeholder="New PIN"
                              autoComplete="new-password"
                            />
                            <button
                              style={s.secondaryBtn}
                              onClick={() => {
                                onResetStaffPin(member.id, resetPinVal);
                                setResetPinId(null);
                                setResetPinVal('');
                              }}
                            >
                              Save PIN
                            </button>
                          </>
                        ) : (
                          <button
                            style={s.secondaryBtn}
                            onClick={() => setResetPinId(member.id)}
                          >
                            Reset PIN
                          </button>
                        )}

                        <button
                          style={s.dangerBtn}
                          onClick={() => onRemoveStaff(member.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </Panel>
            </div>
          )}

          {settingsTab === 'inventory' && (
            <InventoryCard
              items={inventoryItems}
              onAddItem={onAddInventoryItem}
              onUpdateItem={onUpdateInventoryItem}
              onDeleteItem={onDeleteInventoryItem}
              submitting={submitting}
            />
          )}
        </div>
      )}

      {message && (
        <div
          style={{
            ...s.toast,
            color: messageType === 'error' ? C.red : C.greenText,
          }}
        >
          {message}
        </div>
      )}

      {showCloseDay && (
        <CloseDayModal
          date={todayString()}
          entries={allEntries || entries}
          expenses={allExpenses || expenses}
          onClose={() => setShowCloseDay(false)}
          onConfirm={(payload) => {
            onCloseDay?.(payload);
            setShowCloseDay(false);
          }}
          submitting={submitting}
        />
      )}
    </Layout>
  );
}

function Panel({ title, children }) {
  return (
    <div style={s.panel}>
      <div style={s.panelTitle}>{title}</div>
      <div style={s.panelBody}>{children}</div>
    </div>
  );
}

function Empty({ text }) {
  return <div style={s.empty}>{text}</div>;
}

function SimpleRow({ title, meta, amount, onDelete }) {
  return (
    <div style={s.simpleRow}>
      <div style={{ minWidth: 0 }}>
        <div style={s.simpleTitle}>{title}</div>
        <div style={s.simpleMeta}>{meta}</div>
      </div>

      <div style={s.simpleRight}>
        {amount != null && (
          <div
            style={{
              ...s.simpleAmount,
              color: amount >= 0 ? C.greenText : C.red,
            }}
          >
            {amount < 0 ? '-' : ''}
            {money(Math.abs(amount))}
          </div>
        )}
        <button style={s.deleteTextBtn} onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

const s = {
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '16px',
  },

  grid2Form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '10px',
  },

  filterBar: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },

  filterBtn: {
    padding: '9px 12px',
    borderRadius: '10px',
    background: C.white,
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  periodStrip: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '10px',
  },

  periodCard: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '12px',
    padding: '14px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },

  periodLabel: {
    fontSize: '12px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
  },

  periodIncome: {
    fontSize: '22px',
    fontWeight: '900',
    color: C.dark,
    marginTop: '8px',
  },

  periodMeta: {
    fontSize: '12px',
    color: C.mid,
    marginTop: '4px',
    lineHeight: '1.45',
  },

  panel: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '14px',
    overflow: 'hidden',
  },

  panelTitle: {
    padding: '14px 16px',
    borderBottom: `1px solid ${C.border}`,
    fontSize: '14px',
    fontWeight: '800',
    color: C.dark,
  },

  panelBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  empty: {
    padding: '12px',
    borderRadius: '10px',
    background: C.bg,
    color: C.muted,
    fontSize: '13px',
  },

  controlCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  primaryBtn: {
    padding: '11px 14px',
    borderRadius: '8px',
    border: 'none',
    background: C.red,
    color: C.white,
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  secondaryBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    background: C.white,
    color: C.dark,
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  dangerBtn: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: `1px solid ${C.redMid}`,
    background: C.redLight,
    color: C.red,
    fontWeight: '700',
    cursor: 'pointer',
    fontFamily: "'Outfit', sans-serif",
  },

  muted: {
    fontSize: '12px',
    color: C.muted,
  },

  equityBox: {
    padding: '10px 12px',
    borderRadius: '10px',
    fontSize: '13px',
    fontWeight: '700',
  },

  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: `1px solid ${C.border}`,
    background: C.surface,
    fontSize: '13px',
    fontFamily: "'Outfit', sans-serif",
    boxSizing: 'border-box',
  },

  staffRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '12px',
    flexWrap: 'wrap',
  },

  staffName: {
    fontSize: '13px',
    fontWeight: '700',
    color: C.dark,
  },

  staffMeta: {
    fontSize: '12px',
    color: C.muted,
    marginTop: '4px',
  },

  staffActions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  simpleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'center',
    border: `1px solid ${C.border}`,
    borderRadius: '10px',
    padding: '12px',
  },

  simpleTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: C.dark,
    wordBreak: 'break-word',
  },

  simpleMeta: {
    fontSize: '12px',
    color: C.muted,
    marginTop: '4px',
    lineHeight: '1.45',
  },

  simpleRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
  },

  simpleAmount: {
    fontSize: '14px',
    fontWeight: '800',
  },

  deleteTextBtn: {
    background: 'transparent',
    border: 'none',
    color: C.red,
    cursor: 'pointer',
    fontWeight: '700',
    fontFamily: "'Outfit', sans-serif",
  },

  toast: {
    position: 'fixed',
    right: '16px',
    bottom: '16px',
    background: C.white,
    border: `1px solid ${C.border}`,
    padding: '12px 14px',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
    zIndex: 1000,
    fontWeight: '700',
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