    import { useEffect, useMemo, useState } from 'react';
    import { signUp, signIn, signOut, getCurrentUser } from './auth';
    import { supabase } from './supabase';
    import LoginForm from './components/LoginForm';
    import ShopSetup from './components/ShopSetup';
    import Dashboard from './components/Dashboard';

    export default function App() {
    const [mode, setMode] = useState('login');
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');
    const [shop, setShop] = useState(null);
    const [loadingShop, setLoadingShop] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [entries, setEntries] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [partners, setPartners] = useState([]);
    const [services, setServices] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(() => setMessage(''), 4000);
        return () => clearTimeout(timer);
    }, [message]);

    function showMessage(text, type = 'success') {
        setMessage(text);
        setMessageType(type);
    }

    useEffect(() => { checkUser(); }, []);

    async function checkUser() {
        const { user, error } = await getCurrentUser();
        if (error) { showMessage(error.message, 'error'); return; }
        setUser(user);
        if (user) await loadShop(user.id);
    }

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
        .order('created_at', { ascending: false });
        if (error) { showMessage(error.message, 'error'); return; }
        setEntries(data || []);
    }

    async function loadExpenses(shopId) {
        const { data, error } = await supabase.from('expenses').select('*')
        .eq('shop_id', shopId)
        .order('expense_date', { ascending: false })
        .order('created_at', { ascending: false });
        if (error) { showMessage(error.message, 'error'); return; }
        setExpenses(data || []);
    }

    async function loadPartners(shopId) {
        const { data, error } = await supabase.from('partners').select('*')
        .eq('shop_id', shopId).order('created_at', { ascending: false });
        if (error) { showMessage(error.message, 'error'); return; }
        setPartners(data || []);
    }

    async function loadServices(shopId) {
        const { data, error } = await supabase.from('services').select('*')
        .eq('shop_id', shopId).order('created_at', { ascending: false });
        if (error) { showMessage(error.message, 'error'); return; }
        setServices(data || []);
    }

    // ── AUTH ─────────────────────────────────────────────────────────────────

    async function handleAuthSubmit({ email, password }) {
        setMessage('');
        if (!email || !password) { showMessage('Please enter email and password', 'error'); return; }
        setSubmitting(true);
        if (mode === 'signup') {
        const { data, error } = await signUp(email, password);
        if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
        showMessage('Account created! Please check your email to confirm.', 'success');
        setUser(data.user ?? null);
        if (data.user) await loadShop(data.user.id);
        } else {
        const { data, error } = await signIn(email, password);
        if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
        showMessage('Welcome back!', 'success');
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

    // ── SHOP ─────────────────────────────────────────────────────────────────

    async function handleCreateShop(shopName) {
        setMessage('');
        if (!shopName.trim()) { showMessage('Please enter a shop name', 'error'); return; }
        setSubmitting(true);
        const { data, error } = await supabase.from('shops')
        .insert({ owner_user_id: user.id, name: shopName.trim() }).select().single();
        if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
        setShop(data);
        setEntries([]); setExpenses([]); setPartners([]);
        const starterServices = ['Tire Sale','Tire Balancing','Puncture Repair','Oil Change','Wheel Alignment'];
        await Promise.all(starterServices.map((name) =>
        supabase.from('services').insert({ shop_id: data.id, name })
        ));
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
        showMessage('Shop settings saved', 'success');
        setSubmitting(false);
    }

    // ── ENTRIES ───────────────────────────────────────────────────────────────

    async function handleAddEntry({ description, amount, date, serviceType }) {
        setMessage('');
        if (!description.trim() || !amount) { showMessage('Please enter a description and amount', 'error'); return; }
        if (Number(amount) <= 0) { showMessage('Amount must be greater than zero', 'error'); return; }
        setSubmitting(true);
        const { error } = await supabase.from('entries').insert({
        shop_id: shop.id, description: description.trim(),
        amount: Number(amount), kind: 'sale',
        entry_date: date, service_type: serviceType || null,
        });
        if (error) { showMessage(error.message, 'error'); setSubmitting(false); return; }
        showMessage('Income entry added', 'success');
        await loadEntries(shop.id);
        setSubmitting(false);
    }

    async function handleEditEntry(id, { description, amount, date, serviceType }) {
        setMessage('');
        if (!description.trim() || !amount) { showMessage('Please enter a description and amount', 'error'); return; }
        if (Number(amount) <= 0) { showMessage('Amount must be greater than zero', 'error'); return; }
        setSubmitting(true);
        const { error } = await supabase.from('entries').update({
        description: description.trim(),
        amount: Number(amount),
        entry_date: date,
        service_type: serviceType || null,
        }).eq('id', id);
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

    // ── EXPENSES ──────────────────────────────────────────────────────────────

    async function handleAddExpense({ description, amount, category, date, paidBy }) {
        setMessage('');
        if (!description.trim() || !amount) { showMessage('Please enter a description and amount', 'error'); return; }
        if (Number(amount) <= 0) { showMessage('Amount must be greater than zero', 'error'); return; }
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
        if (!description.trim() || !amount) { showMessage('Please enter a description and amount', 'error'); return; }
        if (Number(amount) <= 0) { showMessage('Amount must be greater than zero', 'error'); return; }
        setSubmitting(true);
        const { error } = await supabase.from('expenses').update({
        description: description.trim(),
        amount: Number(amount),
        category: category || 'misc',
        paid_by: paidBy || user.email,
        expense_date: date,
        }).eq('id', id);
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

    // ── PARTNERS ──────────────────────────────────────────────────────────────

    async function handleAddPartner({ name, equityPct }) {
        setMessage('');
        if (!name.trim() || !equityPct) { showMessage('Please enter partner name and equity %', 'error'); return; }
        const equity = Number(equityPct);
        if (equity <= 0 || equity > 100) { showMessage('Equity must be between 1 and 100', 'error'); return; }
        const currentTotal = partners.reduce((sum, p) => sum + Number(p.equity_pct || 0), 0);
        if (currentTotal + equity > 100) {
        showMessage(`Adding ${equity}% would bring total to ${currentTotal + equity}%. Must not exceed 100%.`, 'error');
        return;
        }
        setSubmitting(true);
        const { error } = await supabase.from('partners').insert({
        shop_id: shop.id, name: name.trim(), equity_pct: equity,
        });
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
        const otherTotal = partners
        .filter((p) => p.id !== id)
        .reduce((sum, p) => sum + Number(p.equity_pct || 0), 0);
        if (otherTotal + equity > 100) {
        showMessage(`This would bring total equity to ${otherTotal + equity}%. Must not exceed 100%.`, 'error');
        return;
        }
        setSubmitting(true);
        const { error } = await supabase.from('partners')
        .update({ name: name.trim(), equity_pct: equity }).eq('id', id);
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

    // ── SERVICES ──────────────────────────────────────────────────────────────

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

    // ── FILTERS & TOTALS ──────────────────────────────────────────────────────

    function isInFilter(dateValue, selectedFilter) {
        if (selectedFilter === 'all') return true;
        if (!dateValue) return false;
        const [year, month, day] = dateValue.split('-').map(Number);
        const itemDate = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        if (selectedFilter === 'today') return itemDate.toDateString() === today.toDateString();
        if (selectedFilter === 'week') return itemDate >= thisWeekStart;
        if (selectedFilter === 'month') return itemDate >= thisMonthStart;
        return true;
    }

    const filteredEntries = useMemo(
        () => entries.filter((item) => isInFilter(item.entry_date, filter)),
        [entries, filter]
    );

    const filteredExpenses = useMemo(
        () => expenses.filter((item) => isInFilter(item.expense_date, filter)),
        [expenses, filter]
    );

    const totals = useMemo(() => {
        const totalIncome = filteredEntries.reduce((sum, i) => sum + Number(i.amount || 0), 0);
        const totalExpense = filteredExpenses.reduce((sum, i) => sum + Number(i.amount || 0), 0);
        return { totalIncome, totalExpense, profit: totalIncome - totalExpense };
    }, [filteredEntries, filteredExpenses]);

    // Multi-period totals for the improved dashboard (always calculated from raw data)
    const periodTotals = useMemo(() => {
        function calc(f) {
        const inc = entries.filter((i) => isInFilter(i.entry_date, f)).reduce((s, i) => s + Number(i.amount || 0), 0);
        const exp = expenses.filter((i) => isInFilter(i.expense_date, f)).reduce((s, i) => s + Number(i.amount || 0), 0);
        return { income: inc, expense: exp, profit: inc - exp };
        }
        return { today: calc('today'), week: calc('week'), month: calc('month') };
    }, [entries, expenses]);

    // ── RENDER ────────────────────────────────────────────────────────────────

    if (user && loadingShop) {
        return (
        <div style={styles.page}>
            <div style={styles.card}>
            <h1 style={{ margin: 0, color: '#c80815' }}>DayBooks</h1>
            <p style={{ color: '#666', margin: 0 }}>Loading your shop...</p>
            </div>
        </div>
        );
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
            entries={filteredEntries} expenses={filteredExpenses}
            allExpenses={expenses}
            partners={partners} services={services}
            totals={totals} periodTotals={periodTotals}
            message={message} messageType={messageType}
            submitting={submitting} filter={filter} setFilter={setFilter}
            onAddEntry={handleAddEntry}       onEditEntry={handleEditEntry}       onDeleteEntry={handleDeleteEntry}
            onAddExpense={handleAddExpense}   onEditExpense={handleEditExpense}   onDeleteExpense={handleDeleteExpense}
            onAddPartner={handleAddPartner}   onEditPartner={handleEditPartner}   onDeletePartner={handleDeletePartner}
            onAddService={handleAddService}   onEditService={handleEditService}   onDeleteService={handleDeleteService}
            onSaveShop={handleSaveShop} onLogout={handleLogout}
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

    const styles = {
    page: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f4f4f4', padding: '20px' },
    card: { width: '100%', maxWidth: '520px', background: '#fff', padding: '32px', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' },
    };