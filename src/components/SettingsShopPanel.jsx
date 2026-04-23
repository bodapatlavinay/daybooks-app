import { useState, useEffect } from 'react';
import { C } from './styles';
import ServiceTypesCard from './ServiceTypesCard';
import AccountCard from './AccountCard';
import DangerZoneCard from './DangerZoneCard';

const CATEGORIES = [
  'Tire Shop',
  'Auto Repair',
  'Oil Change',
  'Car Wash',
  'Battery Shop',
  'Brake & Exhaust',
  'Other Auto',
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($) — US Dollar' },
  { value: 'CAD', label: 'CAD ($) — Canadian Dollar' },
  { value: 'EUR', label: 'EUR (€) — Euro' },
];

export default function SettingsShopPanel({
  user,
  shop,
  services = [],
  submitting = false,
  onSaveShop,
  onAddService,
  onEditService,
  onDeleteService,
  onLogout,
  onDeleteAccount,
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('USD');

  useEffect(() => {
    setName(shop?.name || '');
    setCategory(shop?.category || '');
    setLocation(shop?.location || '');
    setCurrency(shop?.currency || 'USD');
  }, [shop]);

  function handleSubmit(e) {
    e.preventDefault();
    onSaveShop?.({ name, category, location, currency });
  }

  return (
    <div style={s.wrap}>
      <div style={s.topGrid}>
        <div style={s.card}>
          <div style={s.cardHead}>
            <div style={s.cardEyebrow}>Shop Settings</div>
            <h3 style={s.cardTitle}>Shop Settings</h3>
          </div>

          <form onSubmit={handleSubmit} style={s.form}>
            <Field label="Business Name" id="shop-name">
              <input
                id="shop-name"
                name="shop-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Cambridge Auto"
                style={s.input}
                autoComplete="organization"
                required
              />
            </Field>

            <div style={s.row2}>
              <Field label="Business Type" id="shop-category">
                <select
                  id="shop-category"
                  name="shop-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={s.input}
                >
                  <option value="">Select type...</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Location (Optional)" id="shop-location">
                <input
                  id="shop-location"
                  name="shop-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Harvard Street, Cambridge, MA, 02138"
                  style={s.input}
                  autoComplete="street-address"
                />
              </Field>
            </div>

            <Field label="Currency" id="shop-currency">
              <select
                id="shop-currency"
                name="shop-currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                style={s.input}
              >
                {CURRENCIES.map((cur) => (
                  <option key={cur.value} value={cur.value}>
                    {cur.label}
                  </option>
                ))}
              </select>
            </Field>

            <button
              type="submit"
              style={{
                ...s.saveBtn,
                opacity: submitting ? 0.7 : 1,
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
              disabled={submitting}
            >
              {submitting ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
        </div>

        <ServiceTypesCard
          services={services}
          onAddService={onAddService}
          onEditService={onEditService}
          onDeleteService={onDeleteService}
          submitting={submitting}
        />
      </div>

      <div style={s.bottomGrid}>
        <AccountCard user={user} shop={shop} onLogout={onLogout} />
        <DangerZoneCard onDeleteAccount={onDeleteAccount} />
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
    gap: '20px',
  },

  topGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: '20px',
    alignItems: 'stretch',
  },

  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    alignItems: 'stretch',
  },

  card: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: '18px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },

  cardHead: {
    marginBottom: '16px',
  },

  cardEyebrow: {
    fontSize: '11px',
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.7px',
    marginBottom: '6px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '800',
    color: C.dark,
    letterSpacing: '-0.3px',
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  row2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
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
    padding: '12px 14px',
    borderRadius: '10px',
    border: `1.5px solid ${C.border}`,
    background: C.surface,
    color: C.dark,
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },

  saveBtn: {
    marginTop: '4px',
    border: 'none',
    background: C.red,
    color: C.white,
    borderRadius: '10px',
    padding: '13px 16px',
    fontSize: '14px',
    fontWeight: '800',
    cursor: 'pointer',
    fontFamily: "'Outfit', system-ui, sans-serif",
  },
};