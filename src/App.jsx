import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { signUp, signIn, signOut, getCurrentUser } from './auth';
import { supabase } from './supabase';
import LoginForm    from './components/LoginForm';
import ShopSetup    from './components/ShopSetup';
import Dashboard    from './components/Dashboard';
import StaffDashboard from './components/StaffDashboard';
import ShiftLogin   from './components/ShiftLogin';
import VerifyEmail  from './components/VerifyEmail';
import LandingPage  from './components/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/"    element={<LandingPage />} />
      <Route path="/app" element={<DayBooksApp />} />
    </Routes>
  );
}

// Special sentinel — owner bypasses shift login to access full dashboard
const OWNER_SENTINEL = { id: '__owner__', role: 'manager', name: 'Owner', display_id: '00' };

function DayBooksApp() {
  const [mode, setMode]               = useState('login');
  const [user, setUser]               = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [message, setMessage]         = useState('');
  const [messageType, setMessageType] = useState('success');
  const [shop, setShop]               = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [submitting, setSubmitting]   = useState(false);

  // Password recovery
  const [resetMode, setResetMode]         = useState(false);
  const [resetPwd, setResetPwd]           = useState('');
  const [resetConfirm, setResetConfirm]   = useState('');
  const [resetError, setResetError]       = useState('');
  const [resetDone, setResetDone]         = useState(false);

  // Shift / PIN system
  const [staffList, setStaffList]       = useState([]);   // all shop_staff rows
  const [activeShift, setActiveShift]   = useState(null); // the staff member on shift, or null = show ShiftLogin

  const [entries, setEntries]   = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [partners, setPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [filter, setFilter]     = useState('all');

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 6000);
    return () => clearTimeout(t);
  }, [message]);

  function showMessage(text, type = 'success') { setMessage(text); setMessageType(type); }

  useEffect(() => {
    checkUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setResetMode(true);
        setUser(session?.user ?? null);
        setAuthChecked(true);
        setLoadingShop(false);
      }
    });
    return () => subscription?.unsubscribe();
  }, []);

  async function checkUser() {
    try {
      const { user, error } = await getCurrentUser();
      if (error) { setAuthChecked(true); return; }
      setUser(user);
      setAuthChecked(true);
      if (user && user.email_confirmed_at) await loadShop(user.id);
    } catch {
      setAuthChecked(true);
      setLoadingShop(false);
    }
  }

  async function handleEmailConfirmed() {
    const { user: freshUser } = await getCurrentUser();
    if (freshUser) setUser(freshUser);
  }

  async function loadShop(userId) {
    setLoadingShop(true);
    try {
      const { data, error } = await supabase
        .from('shops').select('*').eq('owner_user_id', userId).maybeSingle();
      if (error) { showMessage(error.message, 'error'); return; }
      setShop(data || null);
      if (data) {
        await Promise.all([
          loadEntries(data.id), loadExpenses(data.id),
          loadPartners(data.id), loadServices(data.id),
          loadStaffList(data.id),
        ]);
      }
    } catch { showMessage('Failed to load shop data. Please refresh.', 'error'); }
    finally { setLoadingShop(false); }
  }

  async function loadEntries(shopId) {
    const { data, error } = await supabase.from('entries').select('*')
      .eq('shop_id', shopId).is('deleted_at', null)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false }).limit(500);
    if (error) { showMessage(error.message, 'error'); return; }
    setEntries(data || []);
  }

  async function loadExpenses(shopId) {
    const { data, error } = await supabase.from('expenses').select('*')
      .eq('shop_id', shopId).order('expense_date', { ascending: false })
      .order('created_at', { ascending: false }).limit(500);
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

  async function loadStaffList(shopId) {
    const { data, error } = await supabase.from('shop_staff')
      .select('id, display_id, name, role, is_active')
      .eq('shop_id', shopId).eq('is_active', true).order('display_id', { ascending: true });
    if (!error) setStaffList(data || []);
  }

  // ── Shift login / end shift ───────────────────────────────────────────────
  async function handleShiftLogin(staffMember, enteredPin) {
    const { data: valid, error } = await supabase.rpc('verify_staff_pin', {
      p_staff_id: staffMember.id,
      p_pin: enteredPin,
    });
    if (error || !valid) {
      showMessage('Wrong PIN. Try again.', 'error');
      return false;
    }
    setActiveShift(staffMember);
    setMessage('');
    return true;
  }

  function handleOwnerAccess() {
    setActiveShift(OWNER_SENTINEL);
  }

  function handleEndShift() {
    setActiveShift(null);  // go back to ShiftLogin — owner session stays alive
    setMessage('');
    // Reload entries so owner sees any entries the staff added
    if (shop) loadEntries(shop.id);
  }

  // ── Auth ──────────────────────────────────────────────────────────────────
  async function handleAuthSubmit({ email, password }) {
    setMessage('');
    if (!email || !password) { showMessage('Please enter email and password', 'error'); return; }
    setSubmitting(true);
    if (mode === 'signup') {
      const { data, error } = await signUp(email, password);
      if (error) {
        showMessage(error.message?.toLowerCase().includes('already registered')
          ? 'An account with this email already exists. Try signing in.' : error.message, 'error');
        setSubmitting(false); return;
      }
      setUser(data.user ?? null);
      showMessage('Account created! Check your email to confirm.', 'success');
    } else {
      const { data, error } = await signIn(email, password);
      if (error) {
        showMessage(
          error.message?.toLowerCase().includes('invalid login credentials') ? 'Incorrect email or password.' :
          error.message?.toLowerCase().includes('email not confirmed') ? 'Please confirm your email first.' :
          error.message, 'error');
        setSubmitting(false); return;
      }
      const loggedInUser = data.user ?? null;
      setUser(loggedInUser);
      if (loggedInUser?.email_confirmed_at) await loadShop(loggedInUser.id);
    }
    setSubmitting(false);
  }

  async function handleLogout() {
    const { error } = await signOut();
    if (error) { showMessage(error.message, 'error'); return; }
    setUser(null); setShop(null); setActiveShift(null); setStaffList([]);
    setEntries([]); setExpenses([]); setPartners([]); setServices([]); setMessage('');
  }

  async function handleResetSubmit(e) {
    e.preventDefault();
    setResetError('');
    if (resetPwd.length < 6) { setResetError('Password must be at least 6 characters.'); return; }
    if (resetPwd !== resetConfirm) { setResetError('Passwords do not match.'); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: resetPwd });
    setSubmitting(false);
    if (error) { setResetError(error.message); return; }
    setResetDone(true);
    setTimeout(async () => {
      setResetMode(false); setResetDone(false); setResetPwd(''); setResetConfirm('');
      const { user: freshUser } = await getCurrentUser();
      if (freshUser) { setUser(freshUser); if (freshUser.email_confirmed_at) await loadShop(freshUser.id); }
    }, 2000);
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setSubmitting(true);
    try {
      if (shop) {
        await supabase.from('entries').delete().eq('shop_id', shop.id);
        await supabase.from('expenses').delete().eq('shop_id', shop.id);
        await supabase.from('partners').delete().eq('shop_id', shop.id);
        await supabase.from('services').delete().eq('shop_id', shop.id);
        await supabase.from('shop_staff').delete().eq('shop_id', shop.id);
        await supabase.from('shops').delete().eq('id', shop.id);
      }
      await signOut();
      setUser(null); setShop(null); setActiveShift(null); setStaffList([]);
      setEntries([]); setExpenses([]); setPartners([]); setServices([]);
    } catch { showMessage('Error deleting account.', 'error'); }
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
      .update({ name: updatedShop.name, category: updatedShop.category, location: updatedShop.location, currency: updatedShop.currency || 'USD' })
      .eq('id', shop.id).select().single();
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    setShop(data); showMessage('Settings saved', 'success'); setSubmitting(false);
  }

  // ── Staff management (PIN-based) ──────────────────────────────────────────
  async function handleAddStaff({ displayId, name, pin, role }) {
    setMessage('');
    if (!displayId.trim() || !name.trim() || !pin.trim()) {
      showMessage('Please fill all staff fields', 'error'); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('shop_staff').insert({
      shop_id: shop.id, display_id: displayId.trim(),
      name: name.trim(), pin: pin.trim(), role: role || 'staff',
    });
    if (error) {
      showMessage(error.message.includes('unique') ? `ID #${displayId} is already taken. Choose another.` : error.message, 'error');
      setSubmitting(false); return;
    }
    showMessage(`${name} added as ${role}.`, 'success');
    await loadStaffList(shop.id);
    setSubmitting(false);
  }

  async function handleRemoveStaff(staffId) {
    setSubmitting(true);
    const { error } = await supabase.from('shop_staff')
      .update({ is_active: false }).eq('id', staffId);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Staff member removed.', 'success');
    await loadStaffList(shop.id);
    setSubmitting(false);
  }

  async function handleResetStaffPin(staffId, newPin) {
    setSubmitting(true);
    const { error } = await supabase.from('shop_staff')
      .update({ pin: newPin.trim() }).eq('id', staffId);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('PIN updated.', 'success');
    await loadStaffList(shop.id);
    setSubmitting(false);
  }

  // ── Entries ───────────────────────────────────────────────────────────────
  async function handleAddEntry({ description, amount, date, serviceType, paymentType }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) {
      showMessage('Please enter a valid description and amount', 'error'); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('entries').insert({
      shop_id: shop.id, description: description.trim(),
      amount: Math.round(Number(amount) * 100) / 100, kind: 'sale', entry_date: date,
      service_type: serviceType || null, payment_type: paymentType || 'cash',
      recorded_by_name: activeShift?.name || null,
      recorded_by_staff_id: activeShift?.id || null,
      recorded_by_email: user.email,
    });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Income added', 'success');
    await loadEntries(shop.id);
    setSubmitting(false);
  }

  async function handleEditEntry(id, { description, amount, date, serviceType, paymentType }, oldEntry) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) {
      showMessage('Please enter a valid description and amount', 'error'); return;
    }
    setSubmitting(true);
    const rounded = Math.round(Number(amount) * 100) / 100;
    const { error } = await supabase.from('entries')
      .update({ description: description.trim(), amount: rounded, entry_date: date, service_type: serviceType || null, payment_type: paymentType || 'cash' })
      .eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    // Audit log if amount changed
    if (oldEntry && Number(oldEntry.amount) !== rounded) {
      const staffName = activeShift?.id !== '__owner__' ? (activeShift?.name || null) : null;
      await supabase.from('audit_log').insert({
        shop_id: shop.id, entry_id: id, action: 'edit',
        staff_name: staffName || 'Owner', staff_id: activeShift?.id !== '__owner__' ? activeShift?.id : null,
        field_changed: 'amount', old_value: String(oldEntry.amount), new_value: String(rounded),
        notes: description.trim(),
      }).catch(() => {});
    }
    showMessage('Entry updated', 'success'); await loadEntries(shop.id); setSubmitting(false);
  }

  async function handleDeleteEntry(id, entryDescription) {
    setSubmitting(true);
    const staffName = activeShift?.id !== '__owner__' ? (activeShift?.name || null) : null;
    const { error } = await supabase.from('entries')
      .update({ deleted_at: new Date().toISOString(), deleted_by: staffName || user.email })
      .eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    // Audit log
    await supabase.from('audit_log').insert({
      shop_id: shop.id, entry_id: id, action: 'delete',
      staff_name: staffName || 'Owner', staff_id: activeShift?.id !== '__owner__' ? activeShift?.id : null,
      notes: entryDescription || 'Entry deleted',
    }).catch(() => {});
    showMessage('Entry deleted', 'success'); await loadEntries(shop.id); setSubmitting(false);
  }

  // ── Expenses ──────────────────────────────────────────────────────────────
  async function handleAddExpense({ description, amount, category, date, paidBy }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) {
      showMessage('Please enter a valid description and amount', 'error'); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('expenses').insert({
      shop_id: shop.id, description: description.trim(), amount: Number(amount),
      category: category || 'misc', paid_by: paidBy || user.email, expense_date: date,
    });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense added', 'success'); await loadExpenses(shop.id); setSubmitting(false);
  }

  async function handleEditExpense(id, { description, amount, category, date, paidBy }) {
    setMessage('');
    if (!description.trim() || !amount || Number(amount) <= 0) {
      showMessage('Please enter a valid description and amount', 'error'); return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('expenses')
      .update({ description: description.trim(), amount: Number(amount), category: category || 'misc', paid_by: paidBy || user.email, expense_date: date })
      .eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense updated', 'success'); await loadExpenses(shop.id); setSubmitting(false);
  }

  async function handleDeleteExpense(id) {
    setSubmitting(true);
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Expense deleted', 'success'); await loadExpenses(shop.id); setSubmitting(false);
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
    showMessage('Partner added', 'success'); await loadPartners(shop.id); setSubmitting(false);
  }

  async function handleEditPartner(id, { name, equityPct }) {
    setMessage('');
    if (!name.trim() || !equityPct) { showMessage('Please enter name and equity %', 'error'); return; }
    const equity = Number(equityPct);
    if (equity <= 0 || equity > 100) { showMessage('Equity must be between 1 and 100', 'error'); return; }
    const other = partners.filter(p => p.id !== id).reduce((s, p) => s + Number(p.equity_pct || 0), 0);
    if (other + equity > 100) { showMessage(`Total would be ${other + equity}%. Max 100%.`, 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('partners').update({ name: name.trim(), equity_pct: equity }).eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Partner updated', 'success'); await loadPartners(shop.id); setSubmitting(false);
  }

  async function handleDeletePartner(id) {
    setSubmitting(true);
    const { error } = await supabase.from('partners').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Partner removed', 'success'); await loadPartners(shop.id); setSubmitting(false);
  }

  // ── Services ──────────────────────────────────────────────────────────────
  async function handleAddService(serviceName) {
    setMessage('');
    if (!serviceName.trim()) { showMessage('Please enter a service name', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('services').insert({ shop_id: shop.id, name: serviceName.trim() });
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service added', 'success'); await loadServices(shop.id); setSubmitting(false);
  }

  async function handleEditService(id, newName) {
    setMessage('');
    if (!newName.trim()) { showMessage('Please enter a service name', 'error'); return; }
    setSubmitting(true);
    const { error } = await supabase.from('services').update({ name: newName.trim() }).eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service updated', 'success'); await loadServices(shop.id); setSubmitting(false);
  }

  async function handleDeleteService(id) {
    setSubmitting(true);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
    showMessage('Service deleted', 'success'); await loadServices(shop.id); setSubmitting(false);
  }

  // ── Filters & totals ──────────────────────────────────────────────────────
  function isInFilter(dateValue, f) {
    if (f === 'all') return true;
    if (!dateValue) return false;
    const [y, mo, d] = dateValue.split('-').map(Number);
    const item = new Date(y, mo - 1, d);
    const now  = new Date(); now.setHours(0,0,0,0);
    const wk   = new Date(now); wk.setDate(now.getDate() - now.getDay());
    const mo1  = new Date(now.getFullYear(), now.getMonth(), 1);
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
  if (!authChecked) return <Loader text="Loading..." />;

  if (resetMode) {
    const inp = { padding:'12px 14px',borderRadius:'9px',border:'1.5px solid #E8E6E1',fontSize:'14px',background:'#FAFAF8',outline:'none',color:'#0A0A0A',fontFamily:"'Outfit',sans-serif",width:'100%',boxSizing:'border-box' };
    const lbl = { fontSize:'11px',fontWeight:'700',color:'#3D3D3D',textTransform:'uppercase',letterSpacing:'0.6px' };
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#111110',padding:'24px',fontFamily:"'Outfit',system-ui,sans-serif" }}>
        <div style={{ width:'100%',maxWidth:'400px',background:'#fff',borderRadius:'16px',padding:'36px 32px',display:'flex',flexDirection:'column',gap:'20px',boxShadow:'0 32px 80px rgba(0,0,0,0.45)' }}>
          <div>
            <div style={{ fontSize:'22px',fontWeight:'800',color:'#0A0A0A',letterSpacing:'-0.3px',marginBottom:'6px' }}>Set new password</div>
            <div style={{ fontSize:'14px',color:'#6B6B6B' }}>Choose a new password for your DayBooks account.</div>
          </div>
          {resetDone ? (
            <div style={{ padding:'14px',borderRadius:'10px',background:'#F0FDF4',color:'#15803D',border:'1px solid #86EFAC',fontWeight:'600',fontSize:'14px',textAlign:'center' }}>
              ✓ Password updated! Loading your shop...
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} style={{ display:'flex',flexDirection:'column',gap:'14px' }}>
              <div style={{ display:'flex',flexDirection:'column',gap:'6px' }}>
                <label style={lbl}>New password</label>
                <input type="password" value={resetPwd} onChange={e => setResetPwd(e.target.value)}
                  placeholder="At least 6 characters" style={inp} autoComplete="new-password" required />
              </div>
              <div style={{ display:'flex',flexDirection:'column',gap:'6px' }}>
                <label style={lbl}>Confirm new password</label>
                <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)}
                  placeholder="Re-enter new password"
                  style={{ ...inp, borderColor: resetConfirm && resetConfirm !== resetPwd ? '#C80815' : '#E8E6E1' }}
                  autoComplete="new-password" required />
                {resetConfirm && resetConfirm !== resetPwd && (
                  <span style={{ fontSize:'12px',color:'#C80815',fontWeight:'500' }}>Passwords don't match</span>
                )}
              </div>
              {resetError && (
                <div style={{ padding:'10px 14px',borderRadius:'9px',fontSize:'13px',fontWeight:'600',background:'#FEF0F0',color:'#C80815',border:'1px solid #FACACA' }}>⚠ {resetError}</div>
              )}
              <button type="submit"
                style={{ padding:'13px',borderRadius:'9px',border:'none',background:'#C80815',color:'#fff',fontWeight:'700',fontSize:'15px',fontFamily:"'Outfit',sans-serif",cursor:submitting?'not-allowed':'pointer',opacity:submitting?0.7:1 }}
                disabled={submitting}>
                {submitting ? 'Updating...' : 'Set new password'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
  if (user && loadingShop) return <Loader text="Loading your shop..." />;
  if (user && !user.email_confirmed_at) return (
    <VerifyEmail email={user.email} onLogout={handleLogout} onConfirmed={handleEmailConfirmed} />
  );
  if (user && !shop) return (
    <ShopSetup user={user} message={message} messageType={messageType}
      submitting={submitting} onCreateShop={handleCreateShop} onLogout={handleLogout} />
  );

  // Shop is loaded — show ShiftLogin or active shift view
  if (user && shop) {
    // No one on shift — show the PIN picker
    if (!activeShift) {
      return (
        <ShiftLogin
          shop={shop}
          staffList={staffList}
          onShiftLogin={handleShiftLogin}
          onOwnerAccess={handleOwnerAccess}
          onOwnerLogout={handleLogout}
          submitting={submitting}
        />
      );
    }

    // Staff on shift — stripped income-only view
    if (activeShift.role === 'staff') {
      const todayStr = new Date().toISOString().slice(0, 10);
      const shiftEntries = entries.filter(e =>
        e.entry_date === todayStr && e.recorded_by_staff_id === activeShift.id
      );
      return (
        <StaffDashboard
          user={user} shop={shop} services={services}
          staffMember={activeShift}
          entries={shiftEntries}
          submitting={submitting} message={message} messageType={messageType}
          onAddEntry={handleAddEntry}
          onLogout={handleEndShift}
        />
      );
    }

    // Manager on shift — full dashboard
    if (activeShift.role === 'manager') {
      return (
        <Dashboard
          user={user} shop={shop}
          entries={filteredEntries} expenses={filteredExpenses}
          allEntries={entries} allExpenses={expenses}
          partners={partners} services={services}
          totals={totals} periodTotals={periodTotals}
          message={message} messageType={messageType}
          submitting={submitting} filter={filter} setFilter={setFilter}
          onAddEntry={handleAddEntry}       onEditEntry={handleEditEntry}       onDeleteEntry={handleDeleteEntry}
          onAddExpense={handleAddExpense}   onEditExpense={handleEditExpense}   onDeleteExpense={handleDeleteExpense}
          onAddPartner={handleAddPartner}   onEditPartner={handleEditPartner}   onDeletePartner={handleDeletePartner}
          onAddService={handleAddService}   onEditService={handleEditService}   onDeleteService={handleDeleteService}
          onSaveShop={handleSaveShop}       onLogout={handleEndShift}
          onDeleteAccount={handleDeleteAccount}
          activeShift={activeShift}
          staffList={staffList}
          onAddStaff={handleAddStaff}
          onRemoveStaff={handleRemoveStaff}
          onResetStaffPin={handleResetStaffPin}
        />
      );
    }
  }

  return (
    <LoginForm
      mode={mode} message={message} messageType={messageType} submitting={submitting}
      onSubmit={handleAuthSubmit}
      onToggleMode={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); }}
    />
  );
}

function Loader({ text }) {
  return (
    <div style={st.loading}>
      <div style={{ textAlign: 'center' }}>
        <div style={st.logo}>D</div>
        <p style={st.text}>{text}</p>
      </div>
    </div>
  );
}

const st = {
  loading: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111110' },
  logo:    { width: '44px', height: '44px', background: '#C80815', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '900', color: '#fff', margin: '0 auto 12px', fontFamily: "'Outfit', sans-serif" },
  text:    { color: '#555', fontSize: '14px', fontFamily: "'Outfit', sans-serif", margin: 0 },
};