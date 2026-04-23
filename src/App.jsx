import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { signUp, signIn, signOut, getCurrentUser } from './auth';
import { supabase } from './supabase';
import LoginForm from './components/LoginForm';
import ShopSetup from './components/ShopSetup';
import Dashboard from './components/Dashboard';
import StaffDashboard from './components/StaffDashboard';
import ShiftLogin from './components/ShiftLogin';
import VerifyEmail from './components/VerifyEmail';
import LandingPage from './components/LandingPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<DayBooksApp />} />
    </Routes>
  );
}

const OWNER_SENTINEL = {
  id: '__owner__',
  role: 'manager',
  name: 'Owner',
  display_id: '00',
};

function DayBooksApp() {
  const [mode, setMode] = useState('login');
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [shop, setShop] = useState(null);
  const [loadingShop, setLoadingShop] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Password recovery
  const [resetMode, setResetMode]       = useState(false);
  const [resetPwd, setResetPwd]         = useState('');
  const [resetConfirm, setResetConfirm] = useState('');
  const [resetError, setResetError]     = useState('');
  const [resetDone, setResetDone]       = useState(false);

  const [staffList, setStaffList] = useState([]);
  const [activeShift, setActiveShift] = useState(null);

  const [entries, setEntries] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [partners, setPartners] = useState([]);
  const [services, setServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [settlementPeriods, setSettlementPeriods] = useState([]);
  const [dayClosures, setDayClosures] = useState([]);
  const [filter, setFilter] = useState('all');

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

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(''), 5000);
    return () => clearTimeout(t);
  }, [message]);

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  async function checkUser() {
    try {
      const { user, error } = await getCurrentUser();
      if (error) {
        setAuthChecked(true);
        return;
      }
      setUser(user);
      setAuthChecked(true);
      if (user?.email_confirmed_at) await loadShop(user.id);
    } catch {
      setAuthChecked(true);
    }
  }

  async function loadShop(userId) {
    setLoadingShop(true);
    try {
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_user_id', userId)
        .maybeSingle();

      if (error) {
        showMessage(error.message, 'error');
        return;
      }

      setShop(data || null);

      if (data) {
        await Promise.all([
          loadEntries(data.id),
          loadExpenses(data.id),
          loadPartners(data.id),
          loadServices(data.id),
          loadStaffList(data.id),
          loadInventory(data.id),
          loadSettlementPeriods(data.id),
          loadDayClosures(data.id),
        ]);
      }
    } finally {
      setLoadingShop(false);
    }
  }

  async function loadEntries(shopId) {
    const { data } = await supabase
      .from('entries')
      .select('*')
      .eq('shop_id', shopId)
      .is('deleted_at', null)
      .order('entry_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1000);

    setEntries(data || []);
  }

  async function loadExpenses(shopId) {
    const { data } = await supabase
      .from('expenses')
      .select('*')
      .eq('shop_id', shopId)
      .is('deleted_at', null)
      .order('expense_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(1000);

    setExpenses(data || []);
  }

  async function loadPartners(shopId) {
    const { data } = await supabase
      .from('partners')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    setPartners(data || []);
  }

  async function loadServices(shopId) {
    const { data } = await supabase
      .from('services')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false });

    setServices(data || []);
  }

  async function loadStaffList(shopId) {
    const { data } = await supabase
      .from('shop_staff')
      .select('id, display_id, name, role, is_active')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .order('display_id', { ascending: true });

    setStaffList(data || []);
  }

  async function loadInventory(shopId) {
    const { data } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('shop_id', shopId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    setInventoryItems(data || []);
  }

  async function loadSettlementPeriods(shopId) {
    const { data } = await supabase
      .from('settlement_periods')
      .select('*')
      .eq('shop_id', shopId)
      .order('created_at', { ascending: false })
      .limit(24);

    setSettlementPeriods(data || []);
  }

  async function loadDayClosures(shopId) {
    const { data } = await supabase
      .from('day_closures')
      .select('*')
      .eq('shop_id', shopId)
      .order('closure_date', { ascending: false })
      .limit(60);

    setDayClosures(data || []);
  }

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
    return true;
  }

  function handleOwnerAccess() {
    setActiveShift(OWNER_SENTINEL);
  }

  function handleEndShift() {
    setActiveShift(null);
    if (shop) loadEntries(shop.id);
  }

  async function handleAuthSubmit({ email, password }) {
    setSubmitting(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await signUp(email, password);
        if (error) return showMessage(error.message, 'error');

        setUser(data.user ?? null);
        showMessage('Account created! Check your email to confirm.', 'success');
      } else {
        const { data, error } = await signIn(email, password);
        if (error) return showMessage(error.message, 'error');

        const logged = data.user ?? null;
        setUser(logged);

        if (logged?.email_confirmed_at) {
          await loadShop(logged.id);
        }
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await signOut();
    setUser(null);
    setShop(null);
    setActiveShift(null);
    setEntries([]);
    setExpenses([]);
    setPartners([]);
    setServices([]);
    setStaffList([]);
    setInventoryItems([]);
    setSettlementPeriods([]);
    setDayClosures([]);
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

  async function handleCreateShop(shopName) {
    if (!shopName.trim()) {
      return showMessage('Please enter a shop name', 'error');
    }

    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('shops')
        .insert({
          owner_user_id: user.id,
          name: shopName.trim(),
        })
        .select()
        .single();

      if (error) return showMessage(error.message, 'error');

      setShop(data);

      const starters = [
        'Tire Sale',
        'Tire Balancing',
        'Puncture Repair',
        'Oil Change',
        'Wheel Alignment',
      ];

      await Promise.all(
        starters.map((name) =>
          supabase.from('services').insert({ shop_id: data.id, name })
        )
      );

      await loadServices(data.id);
      showMessage('Shop created!', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSaveShop(updatedShop) {
    setSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('shops')
        .update({
          name: updatedShop.name,
          category: updatedShop.category,
          location: updatedShop.location,
          currency: updatedShop.currency || 'USD',
        })
        .eq('id', shop.id)
        .select()
        .single();

      if (error) return showMessage(error.message, 'error');

      setShop(data);
      showMessage('Settings saved', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddStaff({ displayId, name, pin, role }) {
    if (!displayId?.trim() || !name?.trim() || !pin?.trim()) {
      return showMessage('Please fill all staff fields', 'error');
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('shop_staff').insert({
        shop_id: shop.id,
        display_id: displayId.trim(),
        name: name.trim(),
        pin: pin.trim(),
        role: role || 'staff',
      });

      if (error) return showMessage(error.message, 'error');

      await loadStaffList(shop.id);
      showMessage('Staff added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemoveStaff(staffId) {
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('shop_staff')
        .update({ is_active: false })
        .eq('id', staffId);

      if (error) return showMessage(error.message, 'error');

      await loadStaffList(shop.id);
      showMessage('Staff removed', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleResetStaffPin(staffId, newPin) {
    if (!newPin?.trim()) return showMessage('Enter a new PIN', 'error');

    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('shop_staff')
        .update({ pin: newPin.trim() })
        .eq('id', staffId);

      if (error) return showMessage(error.message, 'error');

      showMessage('PIN updated', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddEntry(payload) {
    setSubmitting(true);

    try {
      const amount = Math.round(Number(payload.amount) * 100) / 100;
      const amountCents = Math.round(Number(payload.amount) * 100);

      const { data, error } = await supabase
        .from('entries')
        .insert({
          shop_id: shop.id,
          description: payload.description.trim(),
          amount,
          amount_cents: amountCents,
          kind: 'sale',
          entry_date: payload.date,
          service_type: payload.serviceType || null,
          payment_type: payload.paymentType || 'cash',
          recorded_by_name: activeShift?.name || null,
          recorded_by_staff_id:
            activeShift?.id !== '__owner__' ? activeShift?.id : null,
          recorded_by_email: user.email,
          customer_name: payload.customerName || null,
          customer_phone: payload.customerPhone || null,
          vehicle_plate: payload.vehiclePlate || null,
          vehicle_type: payload.vehicleType || null,
          customer_notes: payload.customerNotes || null,
        })
        .select()
        .single();

      if (error) return showMessage(error.message, 'error');

      if (payload.inventoryItemId) {
        const inventoryItem = inventoryItems.find(
          (i) => i.id === payload.inventoryItemId
        );

        if (inventoryItem) {
          await supabase
            .from('inventory_items')
            .update({
              quantity_on_hand: Math.max(
                0,
                Number(inventoryItem.quantity_on_hand || 0) - 1
              ),
            })
            .eq('id', inventoryItem.id);

          await supabase.from('inventory_movements').insert({
            shop_id: shop.id,
            inventory_item_id: inventoryItem.id,
            movement_type: 'sale',
            qty_delta: -1,
            reason: payload.description.trim(),
            linked_entry_id: data.id,
            created_by: activeShift?.name || user.email,
          });

          await loadInventory(shop.id);
        }
      }

      await loadEntries(shop.id);
      showMessage('Income added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteEntry(id, entryDescription) {
    setSubmitting(true);

    try {
      const actor =
        activeShift?.id !== '__owner__'
          ? activeShift?.name || user.email
          : user.email;

      const { error } = await supabase
        .from('entries')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: actor,
        })
        .eq('id', id);

      if (error) return showMessage(error.message, 'error');

      await supabase
        .from('audit_log')
        .insert({
          shop_id: shop.id,
          entry_id: id,
          action: 'delete',
          staff_name: actor,
          notes: entryDescription || 'Entry deleted',
        })
        .catch(() => {});

      await loadEntries(shop.id);
      showMessage('Entry deleted', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddExpense(payload) {
    setSubmitting(true);

    try {
      const amount = Math.round(Number(payload.amount) * 100) / 100;
      const amountCents = Math.round(Number(payload.amount) * 100);
      const actor = activeShift?.id !== '__owner__' ? activeShift?.name : user.email;

      const { error } = await supabase.from('expenses').insert({
        shop_id: shop.id,
        description: payload.description.trim(),
        amount,
        amount_cents: amountCents,
        category: payload.category || 'misc',
        paid_by: payload.paidBy || user.email,
        expense_date: payload.date,
        vendor_name: payload.vendorName || null,
        payment_method: payload.paymentMethod || 'cash',
        receipt_url: payload.receiptUrl || null,
        notes: payload.notes || null,
        created_by_name: actor,
        created_by_staff_id:
          activeShift?.id !== '__owner__' ? activeShift?.id : null,
      });

      if (error) return showMessage(error.message, 'error');

      await loadExpenses(shop.id);
      showMessage('Expense added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteExpense(id) {
    setSubmitting(true);

    try {
      const actor =
        activeShift?.id !== '__owner__'
          ? activeShift?.name || user.email
          : user.email;

      const { error } = await supabase
        .from('expenses')
        .update({
          deleted_at: new Date().toISOString(),
          deleted_by: actor,
        })
        .eq('id', id);

      if (error) return showMessage(error.message, 'error');

      await supabase
        .from('audit_log')
        .insert({
          shop_id: shop.id,
          action: 'delete_expense',
          staff_name: actor,
          notes: `Expense ${id} deleted`,
        })
        .catch(() => {});

      await loadExpenses(shop.id);
      showMessage('Expense deleted', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddPartner({ name, equityPct }) {
    const equity = Number(equityPct);
    const total = partners.reduce(
      (s, p) => s + Number(p.equity_pct || 0),
      0
    );

    if (
      !name?.trim() ||
      !equityPct ||
      equity <= 0 ||
      equity > 100 ||
      total + equity > 100
    ) {
      return showMessage('Invalid partner equity split', 'error');
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('partners').insert({
        shop_id: shop.id,
        name: name.trim(),
        equity_pct: equity,
      });

      if (error) return showMessage(error.message, 'error');

      await loadPartners(shop.id);
      showMessage('Partner added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePartner(id) {
    setSubmitting(true);

    try {
      const { error } = await supabase.from('partners').delete().eq('id', id);

      if (error) return showMessage(error.message, 'error');

      await loadPartners(shop.id);
      showMessage('Partner deleted', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddService(name) {
    if (!name?.trim()) return;

    setSubmitting(true);

    try {
      const { error } = await supabase.from('services').insert({
        shop_id: shop.id,
        name: name.trim(),
      });

      if (error) return showMessage(error.message, 'error');

      await loadServices(shop.id);
      showMessage('Service added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddInventoryItem(item) {
    setSubmitting(true);

    try {
      const { error } = await supabase.from('inventory_items').insert({
        shop_id: shop.id,
        name: item.name,
        brand: item.brand || null,
        size: item.size || null,
        quantity_on_hand: Number(item.quantity || 0),
        low_stock_threshold: Number(item.low_stock_threshold || 0),
        cost_cents: Math.round(Number(item.cost_price || 0) * 100),
        sell_price_cents: Math.round(Number(item.sell_price || 0) * 100),
        is_active: true,
      });

      if (error) return showMessage(error.message, 'error');

      await loadInventory(shop.id);
      showMessage('Inventory item added', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdateInventoryItem(id, updates) {
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({
          name: updates.name,
          brand: updates.brand || null,
          size: updates.size || null,
          quantity_on_hand: Number(updates.quantity || 0),
          low_stock_threshold: Number(updates.low_stock_threshold || 0),
          cost_cents: Math.round(Number(updates.cost_price || 0) * 100),
          sell_price_cents: Math.round(Number(updates.sell_price || 0) * 100),
        })
        .eq('id', id);

      if (error) return showMessage(error.message, 'error');

      await loadInventory(shop.id);
      showMessage('Inventory updated', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteInventoryItem(id) {
    setSubmitting(true);

    try {
      const { error } = await supabase
        .from('inventory_items')
        .update({ is_active: false })
        .eq('id', id);

      if (error) return showMessage(error.message, 'error');

      await loadInventory(shop.id);
      showMessage('Inventory item deleted', 'success');
    } finally {
      setSubmitting(false);
    }
  }


  async function handleEditEntry(id, updates, oldEntry) {
    setSubmitting(true);
    try {
      const rounded = Math.round(Number(updates.amount) * 100) / 100;
      const { error } = await supabase.from('entries')
        .update({ description: updates.description?.trim(), amount: rounded,
          amount_cents: Math.round(rounded * 100),
          entry_date: updates.date, service_type: updates.serviceType || null,
          payment_type: updates.paymentType || 'cash' })
        .eq('id', id);
      if (error) return showMessage(error.message, 'error');
      if (oldEntry && Number(oldEntry.amount) !== rounded) {
        await supabase.from('audit_log').insert({
          shop_id: shop.id, entry_id: id, action: 'edit',
          staff_name: activeShift?.name || user.email,
          field_changed: 'amount', old_value: String(oldEntry.amount), new_value: String(rounded),
        }).catch(() => {});
      }
      await loadEntries(shop.id);
      showMessage('Entry updated', 'success');
    } finally { setSubmitting(false); }
  }

  async function handleEditExpense(id, updates) {
    setSubmitting(true);
    try {
      const rounded = Math.round(Number(updates.amount) * 100) / 100;
      const { error } = await supabase.from('expenses')
        .update({ description: updates.description?.trim(), amount: rounded,
          amount_cents: Math.round(rounded * 100),
          category: updates.category || 'misc',
          paid_by: updates.paidBy || user.email,
          expense_date: updates.date,
          vendor_name: updates.vendorName || null,
          payment_method: updates.paymentMethod || 'cash' })
        .eq('id', id);
      if (error) return showMessage(error.message, 'error');
      await loadExpenses(shop.id);
      showMessage('Expense updated', 'success');
    } finally { setSubmitting(false); }
  }

  async function handleEditPartner(id, updates) {
    const equity = Number(updates.equityPct);
    const other = partners.filter(p => p.id !== id).reduce((s, p) => s + Number(p.equity_pct || 0), 0);
    if (equity <= 0 || equity > 100 || other + equity > 100) return showMessage('Invalid equity split', 'error');
    setSubmitting(true);
    try {
      const { error } = await supabase.from('partners')
        .update({ name: updates.name?.trim(), equity_pct: equity }).eq('id', id);
      if (error) return showMessage(error.message, 'error');
      await loadPartners(shop.id);
      showMessage('Partner updated', 'success');
    } finally { setSubmitting(false); }
  }

  async function handleEditService(id, newName) {
    if (!newName?.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('services').update({ name: newName.trim() }).eq('id', id);
      if (error) return showMessage(error.message, 'error');
      await loadServices(shop.id);
      showMessage('Service updated', 'success');
    } finally { setSubmitting(false); }
  }

  async function handleDeleteService(id) {
    setSubmitting(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) return showMessage(error.message, 'error');
      await loadServices(shop.id);
      showMessage('Service deleted', 'success');
    } finally { setSubmitting(false); }
  }

  async function handleDeleteAccount() {
    if (!window.confirm('Delete your entire shop and all data? This cannot be undone.')) return;
    setSubmitting(true);
    try {
      if (shop) {
        await supabase.from('entries').delete().eq('shop_id', shop.id);
        await supabase.from('expenses').delete().eq('shop_id', shop.id);
        await supabase.from('partners').delete().eq('shop_id', shop.id);
        await supabase.from('services').delete().eq('shop_id', shop.id);
        await supabase.from('shop_staff').delete().eq('shop_id', shop.id);
        await supabase.from('inventory_items').delete().eq('shop_id', shop.id);
        await supabase.from('settlement_periods').delete().eq('shop_id', shop.id);
        await supabase.from('day_closures').delete().eq('shop_id', shop.id);
        await supabase.from('shops').delete().eq('id', shop.id);
      }
      await signOut();
      setUser(null); setShop(null); setActiveShift(null);
      setEntries([]); setExpenses([]); setPartners([]); setServices([]);
      setStaffList([]); setInventoryItems([]); setSettlementPeriods([]); setDayClosures([]);
    } finally { setSubmitting(false); }
  }

  async function handleCloseDay({ actualCashCents, notes, summary }) {
    setSubmitting(true);

    try {
      const closureDate = new Date().toISOString().slice(0, 10);
      const actor = activeShift?.name || user.email;

      const payload = {
        shop_id: shop.id,
        closure_date: closureDate,
        expected_cash_cents: summary.expectedCash,
        expected_card_cents: summary.byPayment.card || 0,
        expected_zelle_cents: summary.byPayment.zelle || 0,
        expected_other_cents: Object.entries(summary.byPayment)
          .filter(([k]) => !['cash', 'card', 'zelle'].includes(k))
          .reduce((s, [, v]) => s + v, 0),
        total_income_cents: summary.totalIncome,
        total_expense_cents: summary.totalExpense,
        actual_cash_cents: actualCashCents,
        cash_diff_cents: actualCashCents - summary.expectedCash,
        closed_by_user_id: user.id,
        closed_by_name: actor,
        notes,
      };

      const { data, error } = await supabase
        .from('day_closures')
        .upsert(payload, { onConflict: 'shop_id,closure_date' })
        .select()
        .single();

      if (error) return showMessage(error.message, 'error');

      await supabase
        .from('entries')
        .update({ is_locked: true, day_closure_id: data.id })
        .eq('shop_id', shop.id)
        .eq('entry_date', closureDate)
        .is('deleted_at', null);

      await supabase
        .from('expenses')
        .update({ is_locked: true, day_closure_id: data.id })
        .eq('shop_id', shop.id)
        .eq('expense_date', closureDate)
        .is('deleted_at', null);

      await loadDayClosures(shop.id);
      showMessage('Day closed successfully', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCreateSettlementPeriod() {
    if (!partners.length) return showMessage('Add partners first', 'error');

    setSubmitting(true);

    try {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);

      const periodEntries = entries.filter(
        (e) =>
          e.entry_date >= startDate &&
          e.entry_date <= endDate &&
          !e.deleted_at
      );

      const periodExpenses = expenses.filter(
        (e) =>
          e.expense_date >= startDate &&
          e.expense_date <= endDate &&
          !e.deleted_at
      );

      const incomeCents = periodEntries.reduce(
        (s, e) => s + Math.round(Number(e.amount || 0) * 100),
        0
      );

      const expenseCents = periodExpenses.reduce(
        (s, e) => s + Math.round(Number(e.amount || 0) * 100),
        0
      );

      const { data: period, error } = await supabase
        .from('settlement_periods')
        .upsert(
          {
            shop_id: shop.id,
            period_type: 'month',
            start_date: startDate,
            end_date: endDate,
            total_income_cents: incomeCents,
            total_expense_cents: expenseCents,
            net_profit_cents: incomeCents - expenseCents,
            created_by: activeShift?.name || user.email,
          },
          { onConflict: 'shop_id,period_type,start_date,end_date' }
        )
        .select()
        .single();

      if (error) return showMessage(error.message, 'error');

      await supabase
        .from('settlement_items')
        .delete()
        .eq('settlement_period_id', period.id);

      const paidMap = {};
      periodExpenses.forEach((item) => {
        const key = (item.paid_by || '').trim().toLowerCase();
        paidMap[key] =
          (paidMap[key] || 0) + Math.round(Number(item.amount || 0) * 100);
      });

      const items = partners.map((p) => {
        const equity = Number(p.equity_pct || 0);
        const incomeShare = Math.round((incomeCents * equity) / 100);
        const expenseShare = Math.round((expenseCents * equity) / 100);
        const paid = paidMap[(p.name || '').trim().toLowerCase()] || 0;

        return {
          settlement_period_id: period.id,
          partner_id: p.id,
          partner_name: p.name,
          equity_pct: equity,
          income_share_cents: incomeShare,
          expense_share_cents: expenseShare,
          expenses_paid_cents: paid,
          expense_settlement_cents: paid - expenseShare,
          net_entitlement_cents: incomeShare - expenseShare,
        };
      });

      await supabase.from('settlement_items').insert(items);
      await loadSettlementPeriods(shop.id);
      showMessage('Monthly settlement frozen', 'success');
    } finally {
      setSubmitting(false);
    }
  }

  const totals = useMemo(() => {
    const totalIncome = entries
      .filter((e) => !e.deleted_at)
      .reduce((s, e) => s + Number(e.amount || 0), 0);

    const totalExpense = expenses
      .filter((e) => !e.deleted_at)
      .reduce((s, e) => s + Number(e.amount || 0), 0);

    return {
      totalIncome,
      totalExpense,
      profit: totalIncome - totalExpense,
    };
  }, [entries, expenses]);

  const periodTotals = useMemo(() => {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${pad(
      today.getMonth() + 1
    )}-${pad(today.getDate())}`;

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const calc = (fromDate) => {
      const income = entries
        .filter(
          (e) =>
            !e.deleted_at && new Date(`${e.entry_date}T00:00:00`) >= fromDate
        )
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      const expense = expenses
        .filter(
          (e) =>
            !e.deleted_at &&
            new Date(`${e.expense_date}T00:00:00`) >= fromDate
        )
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      return { income, expense, profit: income - expense };
    };

    const todayIncome = entries
      .filter((e) => e.entry_date === todayStr && !e.deleted_at)
      .reduce((s, e) => s + Number(e.amount || 0), 0);

    const todayExpense = expenses
      .filter((e) => e.expense_date === todayStr && !e.deleted_at)
      .reduce((s, e) => s + Number(e.amount || 0), 0);

    return {
      today: {
        income: todayIncome,
        expense: todayExpense,
        profit: todayIncome - todayExpense,
      },
      week: calc(weekStart),
      month: calc(monthStart),
    };
  }, [entries, expenses]);

  if (!authChecked) return null;

  if (resetMode) {
    const inp = { padding:'12px 14px', borderRadius:'9px', border:'1.5px solid #E8E6E1', fontSize:'14px', background:'#FAFAF8', outline:'none', color:'#0A0A0A', fontFamily:"'Outfit',sans-serif", width:'100%', boxSizing:'border-box' };
    return (
      <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#111110', padding:'24px', fontFamily:"'Outfit',system-ui,sans-serif" }}>
        <div style={{ width:'100%', maxWidth:'400px', background:'#fff', borderRadius:'16px', padding:'36px 32px', display:'flex', flexDirection:'column', gap:'20px', boxShadow:'0 32px 80px rgba(0,0,0,0.45)' }}>
          <div>
            <div style={{ fontSize:'22px', fontWeight:'800', color:'#0A0A0A', letterSpacing:'-0.3px', marginBottom:'6px' }}>Set new password</div>
            <div style={{ fontSize:'14px', color:'#6B6B6B' }}>Choose a new password for your account.</div>
          </div>
          {resetDone ? (
            <div style={{ padding:'14px', borderRadius:'10px', background:'#F0FDF4', color:'#15803D', border:'1px solid #86EFAC', fontWeight:'600', fontSize:'14px', textAlign:'center' }}>
              ✓ Password updated! Loading your shop...
            </div>
          ) : (
            <form onSubmit={handleResetSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'11px', fontWeight:'700', color:'#3D3D3D', textTransform:'uppercase', letterSpacing:'0.6px' }}>New password</label>
                <input type="password" value={resetPwd} onChange={e => setResetPwd(e.target.value)} placeholder="At least 6 characters" style={inp} autoComplete="new-password" required />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
                <label style={{ fontSize:'11px', fontWeight:'700', color:'#3D3D3D', textTransform:'uppercase', letterSpacing:'0.6px' }}>Confirm new password</label>
                <input type="password" value={resetConfirm} onChange={e => setResetConfirm(e.target.value)} placeholder="Re-enter new password"
                  style={{ ...inp, borderColor: resetConfirm && resetConfirm !== resetPwd ? '#C80815' : '#E8E6E1' }} autoComplete="new-password" required />
                {resetConfirm && resetConfirm !== resetPwd && <span style={{ fontSize:'12px', color:'#C80815' }}>Passwords don't match</span>}
              </div>
              {resetError && <div style={{ padding:'10px 14px', borderRadius:'9px', fontSize:'13px', fontWeight:'600', background:'#FEF0F0', color:'#C80815', border:'1px solid #FACACA' }}>⚠ {resetError}</div>}
              <button type="submit" style={{ padding:'13px', borderRadius:'9px', border:'none', background:'#C80815', color:'#fff', fontWeight:'700', fontSize:'15px', fontFamily:"'Outfit',sans-serif", cursor: submitting?'not-allowed':'pointer', opacity:submitting?0.7:1 }} disabled={submitting}>
                {submitting ? 'Updating...' : 'Set new password'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginForm
        mode={mode}
        message={message}
        messageType={messageType}
        submitting={submitting}
        onSubmit={handleAuthSubmit}
        onToggleMode={() =>
          setMode((m) => (m === 'login' ? 'signup' : 'login'))
        }
      />
    );
  }

  if (user && loadingShop) {
    return <div style={{ padding: '40px' }}>Loading your shop...</div>;
  }

  if (user && !user.email_confirmed_at) {
    return (
      <VerifyEmail
        email={user.email}
        onLogout={handleLogout}
        onConfirmed={checkUser}
      />
    );
  }

  if (user && !shop) {
    return (
      <ShopSetup
        user={user}
        message={message}
        messageType={messageType}
        submitting={submitting}
        onCreateShop={handleCreateShop}
        onLogout={handleLogout}
      />
    );
  }

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

  if (activeShift.role === 'staff') {
    const today = new Date().toISOString().slice(0, 10);

    const shiftEntries = entries.filter(
      (e) =>
        e.entry_date === today &&
        e.recorded_by_staff_id === activeShift.id &&
        !e.deleted_at
    );

    return (
      <StaffDashboard
        user={user}
        shop={shop}
        services={services}
        staffMember={activeShift}
        entries={shiftEntries}
        submitting={submitting}
        message={message}
        messageType={messageType}
        onAddEntry={handleAddEntry}
        onLogout={handleEndShift}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      shop={shop}
      entries={entries}
      expenses={expenses}
      allEntries={entries}
      allExpenses={expenses}
      partners={partners}
      services={services}
      inventoryItems={inventoryItems}
      settlementPeriods={settlementPeriods}
      dayClosures={dayClosures}
      totals={totals}
      periodTotals={periodTotals}
      message={message}
      messageType={messageType}
      submitting={submitting}
      filter={filter}
      setFilter={setFilter}
      onAddEntry={handleAddEntry}
      onEditEntry={handleEditEntry}
      onDeleteEntry={handleDeleteEntry}
      onAddExpense={handleAddExpense}
      onEditExpense={handleEditExpense}
      onDeleteExpense={handleDeleteExpense}
      onAddPartner={handleAddPartner}
      onEditPartner={handleEditPartner}
      onDeletePartner={handleDeletePartner}
      onAddService={handleAddService}
      onEditService={handleEditService}
      onDeleteService={handleDeleteService}
      onSaveShop={handleSaveShop}
      onLogout={handleEndShift}
      onDeleteAccount={handleDeleteAccount}
      activeShift={activeShift}
      staffList={staffList}
      onAddStaff={handleAddStaff}
      onRemoveStaff={handleRemoveStaff}
      onResetStaffPin={handleResetStaffPin}
      onCloseDay={handleCloseDay}
      onCreateSettlementPeriod={handleCreateSettlementPeriod}
      onAddInventoryItem={handleAddInventoryItem}
      onUpdateInventoryItem={handleUpdateInventoryItem}
      onDeleteInventoryItem={handleDeleteInventoryItem}
    />
  );
}