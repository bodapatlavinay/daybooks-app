import { useEffect, useMemo, useState } from 'react';
import { signUp, signIn, signOut, getCurrentUser } from './auth';
import { supabase } from './supabase';
import LoginForm from './components/LoginForm';
import ShopSetup from './components/ShopSetup';
import Dashboard from './components/Dashboard';
import VerifyEmail from './components/VerifyEmail';

export default function App() {
  const [mode, setMode]               = useState('login');
  const [user, setUser]               = useState(null);
  const [message, setMessage]         = useState('');
  const [messageType, setMessageType] = useState('success');
  const [shop, setShop]               = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  const [entries, setEntries]   = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [partners, setPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  // On mount: check if user is already logged in
  useEffect(() => { checkUser(); }, []);

  async function checkUser() {
    const { user, error } = await getCurrentUser();
    if (error) { showMessage(error.message, 'error'); return; }
    setUser(user);
    if (user) await loadShop(user.id);
  }

  // Called by VerifyEmail after user confirms email
  async function handleEmailConfirmed() {
    const { user, error } = await getCurrentUser();
    if (error) { showMessage(error.message, 'error'); return; }
    setUser(user);
    // user.email_confirmed_at is now set → ShopSetup renders automatically
  }

  // ── Data loaders ──────────────────────────────────────────────────────────

  async function loadShop(userId) {
    setLoadingShop(true);
    const { data, error } = await supabase
      .from('shops').select('*').eq('owner_user_id', userId).maybeSingle();
    if (error) { showMessage(error.message, 'error'); setLoadingShop(false); return; }
    setShop(data || null);
    if (data) {
      await Promise.all([
        loadEntries(data.id), loadExpenses(data.id),
        loadPartners(data.id), loadServices(data.id),
      ]);
    }
    setLoadingShop(false);
  }

  async function loadEntries(shopId) {
    const { data, error } = await supabase.from('entries').select('*')
      .eq('shop_id', shopId)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) { showMessage(error.message, 'error'); return; }
    setEntries(data || []);
  }

  async function loadExpenses(shopId) {
    const { data, error } = await supabase.from('expenses').select('*')
      .eq('shop_id', shopId)
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(500);
    if (error) { showMessage(error.message, 'error'); return; }
    setExpenses(data || []);
  }

  async function loadPartners(shopId) {
    const { data, error } = await supabase.from('partners').select('*')
      .eq('shop_id', shopId).order('created_at', { ascending: false }).limit(50);
    if (error) { showMessage(error.message, 'error'); return; }
    setPartners(data || []);
  }

  async function loadServices(shopId) {
    const { data, error } = await supabase.from('services').select('*')
      .eq('shop_id', shopId).order('created_at', { ascending: false }).limit(100);
    if (error) { showMessage(error.message, 'error'); return; }
    setServices(data || []);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────

  async function handleAuthSubmit({ email, password }) {
    setMessage('');
    if (!email || !password) { showMessage('Please enter email and password', 'error'); return; }
    setSubmitting(true);
    if (mode === 'signup') {
      const { data, error } = await signUp(email, password);
      if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
      showMessage('Account created! Check your email to confirm.', 'success');
      setUser(data.user ?? null);
    } else {
      const { data, error } = await signIn(email, password);
      if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
      setUser(data.user ?? null);
      if (data.user) await loadShop(data.user.id);
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    const { error } = await signOut();
    if (error) { showMessage(error.message, 'error'); return; }
    setUser(null); setShop(null);
    setEntries([]); setExpenses([]); setPartners([]); setServices([]);
    setMessage('');
  }

  // ── Delete account ────────────────────────────────────────────────────────

  async function handleDeleteAccount() {
    if (!user) return;
    setSubmitting(true);
    try {
      if (shop) {
        await supabase.from('entries').delete().eq('shop_id', shop.id);
        await supabase.from('expenses').delete().eq('shop_id', shop.id);
        await supabase.from('partners').delete().eq('shop_id', shop.id);
        await supabase.from('services').delete().eq('shop_id', shop.id);
        await supabase.from('shops').delete().eq('id', shop.id);
      }
      await signOut();
      setUser(null); setShop(null);
      setEntries([]); setExpenses([]); setPartners([]); setServices([]);
    } catch {
      showMessage('Error deleting account. Please try again.', 'error');
    }
    setSubmitting(false);
  }

  // ── Shop ──────────────────────────────────────────────────────────────────

  async function handleCreateShop(shopName) {
    setMessage('');
    if (!shopName.trim()) { showMessage('Please enter a shop name', 'error'); return; }
    setSubmitting(true);
    const { data, error } = await supabase.from('shops')
      .insert({ owner_user_id: user.id, name: shopName.trim() }).select().single();
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    setShop(data); setEntries([]); setExpenses([]); setPartners([]);
    const starters = ['Tire Sale','Tire Balancing','Puncture Repair','Oil Change','Wheel Alignment'];
    await Promise.all(starters.map(n => supabase.from('services').insert({ shop_id: data.id, name: n })));
    await loadServices(data.id);
    showMessage('Shop created! Starter services added.', 'success');
    setSubmitting(false);
  }

  async function handleSaveShop(updatedShop) {
    setMessage('');
    setSubmitting(true);
    const { data, error } = await supabase.from('shops')
      .update({ name: updatedShop.name, category: updatedShop.category, location: updatedShop.location })
      .eq('id', shop.id).select().single();
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    setShop(data);
    showMessage('Settings saved', 'success');
    setSubmitting(false);
  }

  // ── Entries ───────────────────────────────────────────────────────────────

  async function handleAddEntry({ description, amount, date, serviceType }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) { showMessage('Please enter a valid description and amount', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('entries').insert({
      shop_id: shop.id, description: description.trim(),
      amount: Number(amount), kind: 'sale', entry_date: date, service_type: serviceType || null,
    });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Income added', 'success');
    await loadEntries(shop.id);
    setSubmitting(false);
  }

  async function handleEditEntry(id, { description, amount, date, serviceType }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) { showMessage('Please enter a valid description and amount', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('entries')
      .update({ description: description.trim(), amount: Number(amount), entry_date: date, service_type: serviceType || null })
      .eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Entry updated', 'success');
    await loadEntries(shop.id);
    setSubmitting(false);
  }

  async function handleDeleteEntry(id) {
    setSubmitting(true);
    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Entry deleted', 'success');
    await loadEntries(shop.id);
    setSubmitting(false);
  }

  // ── Expenses ──────────────────────────────────────────────────────────────

  async function handleAddExpense({ description, amount, category, date, paidBy }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) { showMessage('Please enter a valid description and amount', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('expenses').insert({
      shop_id: shop.id, description: description.trim(),
      amount: Number(amount), category: category || 'misc',
      paid_by: paidBy || user.email, expense_date: date,
    });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense added', 'success');
    await loadExpenses(shop.id);
    setSubmitting(false);
  }

  async function handleEditExpense(id, { description, amount, category, date, paidBy }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) { showMessage('Please enter a valid description and amount', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('expenses')
      .update({ description: description.trim(), amount: Number(amount), category: category || 'misc', paid_by: paidBy || user.email, expense_date: date })
      .eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense updated', 'success');
    await loadExpenses(shop.id);
    setSubmitting(false);
  }

  async function handleDeleteExpense(id) {
    setSubmitting(true);
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense deleted', 'success');
    await loadExpenses(shop.id);
    setSubmitting(false);
  }

  // ── Partners ──────────────────────────────────────────────────────────────

  async function handleAddPartner({ name, equityPct }) {
    setMessage('');
    if (!name.trim() || !equityPct) { showMessage('Please enter partner name and equity %', 'error'); return; }
    const equity = Number(equityPct);
    if (equity <= 0 || equity > 100) { showMessage('Equity must be between 1 and 100', 'error'); return; }
    const total = partners.reduce((s, p) => s + Number(p.equity_pct || 0), 0);
    if (total + equity > 100) { showMessage(`Total would be ${total + equity}%. Max 100%.`, 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('partners').insert({ shop_id: shop.id, name: name.trim(), equity_pct: equity });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Partner added', 'success');
    await loadPartners(shop.id);
    setSubmitting(false);
  }

  async function handleEditPartner(id, { name, equityPct }) {
    setMessage('');
    if (!name.trim() || !equityPct) { showMessage('Please enter partner name and equity %', 'error'); return; }
    const equity = Number(equityPct);
    if (equity <= 0 || equity > 100) { showMessage('Equity must be between 1 and 100', 'error'); return; }
    const other = partners.filter(p => p.id !== id).reduce((s, p) => s + Number(p.equity_pct || 0), 0);
    if (other + equity > 100) { showMessage(`Total would be ${other + equity}%. Max 100%.`, 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('partners').update({ name: name.trim(), equity_pct: equity }).eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Partner updated', 'success');
    await loadPartners(shop.id);
    setSubmitting(false);
  }

  async function handleDeletePartner(id) {
    setSubmitting(true);
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Partner removed', 'success');
    await loadPartners(shop.id);
    setSubmitting(false);
  }

  // ── Services ──────────────────────────────────────────────────────────────

  async function handleAddService(serviceName) {
    setMessage('');
    if (!serviceName.trim()) { showMessage('Please enter a service name', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('services').insert({ shop_id: shop.id, name: serviceName.trim() });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service added', 'success');
    await loadServices(shop.id);
    setSubmitting(false);
  }

  async function handleEditService(id, newName) {
    setMessage('');
    if (!newName.trim()) { showMessage('Please enter a service name', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('services').update({ name: newName.trim() }).eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service updated', 'success');
    await loadServices(shop.id);
    setSubmitting(false);
  }

  async function handleDeleteService(id) {
    setSubmitting(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service deleted', 'success');
    await loadServices(shop.id);
    setSubmitting(false);
  }

  // ── Filters & totals ──────────────────────────────────────────────────────

  function isInFilter(dateValue, f) {
    if (f === 'all') return true;
    if (!dateValue) return false;
    const [y, mo, d] = dateValue.split('-').map(Number);
    const item = new Date(y, mo - 1, d);
    const now = new Date(); now.setHours(0,0,0,0);
    const wk = new Date(now); wk.setDate(now.getDate() - now.getDay());
    const mo1 = new Date(now.getFullYear(), now.getMonth(), 1);
    if (f === 'today') return item.toDateString() === now.toDateString();
    if (f === 'week')  return item >= wk;
    if (f === 'month') return item >= mo1;
    return true;
  }

  const filteredEntries  = useMemo(() => entries.filter(i => isInFilter(i.entry_date, filter)),   [entries, filter]);
  const filteredExpenses = useMemo(() => expenses.filter(i => isInFilter(i.expense_date, filter)), [expenses, filter]);

  const totals = useMemo(() => {
    const totalIncome  = filteredEntries.reduce((s, i) => s + Number(i.amount || 0), 0);
    const totalExpense = filteredExpenses.reduce((s, i) => s + Number(i.amount || 0), 0);
    return { totalIncome, totalExpense, profit: totalIncome - totalExpense };
  }, [filteredEntries, filteredExpenses]);

  const periodTotals = useMemo(() => {
    function calc(f) {
      const inc = entries.filter(i => isInFilter(i.entry_date, f)).reduce((s, i) => s + Number(i.amount || 0), 0);
      const exp = expenses.filter(i => isInFilter(i.expense_date, f)).reduce((s, i) => s + Number(i.amount || 0), 0);
      return { income: inc, expense: exp, profit: inc - exp };
    }
    return { today: calc('today'), week: calc('week'), month: calc('month') };
  }, [entries, expenses]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (user && loadingShop) {
    return (
      <div style={st.loading}>
        <div style={{ textAlign: 'center' }}>
          <div style={st.logo}>D</div>
          <p style={st.text}>Loading your shop...</p>
        </div>
      </div>
    );
  }

  if (user && !user.email_confirmed_at) {
    return <VerifyEmail email={user.email} onLogout={handleLogout} onConfirmed={handleEmailConfirmed} />;
  }

  if (user && !shop) {
    return (
      <ShopSetup
        user={user} message={message} messageType={messageType}
        submitting={submitting} onCreateShop={handleCreateShop} onLogout={handleLogout}
      />
    );
  }

  if (user && shop) {
    return (
      <Dashboard
        user={user} shop={shop}
        entries={filteredEntries} expenses={filteredExpenses} allExpenses={expenses}
        partners={partners} services={services}
        totals={totals} periodTotals={periodTotals}
        message={message} messageType={messageType}
        submitting={submitting} filter={filter} setFilter={setFilter}
        onAddEntry={handleAddEntry}       onEditEntry={handleEditEntry}       onDeleteEntry={handleDeleteEntry}
        onAddExpense={handleAddExpense}   onEditExpense={handleEditExpense}   onDeleteExpense={handleDeleteExpense}
        onAddPartner={handleAddPartner}   onEditPartner={handleEditPartner}   onDeletePartner={handleDeletePartner}
        onAddService={handleAddService}   onEditService={handleEditService}   onDeleteService={handleDeleteService}
        onSaveShop={handleSaveShop}       onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  return (
    <LoginForm
      mode={mode} message={message} messageType={messageType} submitting={submitting}
      onSubmit={handleAuthSubmit}
      onToggleMode={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}
    />
  );
}

const st = {
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111110' },
  logo:    { width: '44px', height: '44px', background: '#C80815', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 auto 12px', fontFamily: "'Outfit', sans-serif" },
  text:    { color: '#555', fontSize: '14px', fontFamily: "'Outfit', sans-serif", margin: 0 },
};