import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ── Inline SVG icon system (same pattern as Layout.jsx) ───────────────────────

function Svg({ size = 20, children, color = 'currentColor', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {children}
    </svg>
  );
}

function IconTrendUp({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </Svg>
  );
}
function IconReceipt({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </Svg>
  );
}
function IconBarChart({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </Svg>
  );
}
function IconWrench({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
  );
}
function IconUsers({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </Svg>
  );
}
function IconZap({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </Svg>
  );
}
function IconMail({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </Svg>
  );
}
function IconCheckCircle({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}
function IconShield({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </Svg>
  );
}
function IconGrid({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </Svg>
  );
}
function IconTablet({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </Svg>
  );
}
function IconScan({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <path d="M4 7V5a1 1 0 0 1 1-1h2" />
      <path d="M17 4h2a1 1 0 0 1 1 1v2" />
      <path d="M20 17v2a1 1 0 0 1-1 1h-2" />
      <path d="M7 20H5a1 1 0 0 1-1-1v-2" />
      <line x1="8" y1="8" x2="8" y2="16" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="16" y1="8" x2="16" y2="16" />
    </Svg>
  );
}
function IconPrinter({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
      <line x1="6" y1="18" x2="18" y2="18" />
    </Svg>
  );
}
function IconCard({ size, color }) {
  return (
    <Svg size={size} color={color}>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </Svg>
  );
}

// ── Responsive hook ────────────────────────────────────────────────────────────

function useWidth() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);

  return w;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const features = [
  { Icon: IconTrendUp, title: 'Daily income tracking', text: 'Record tire sales, repairs, and service income in seconds.' },
  { Icon: IconReceipt, title: 'Expense management', text: 'Track shop expenses so your real profit is never hidden.' },
  { Icon: IconBarChart, title: 'Profit visibility', text: 'See daily, weekly, and monthly profit without manual math.' },
  { Icon: IconWrench, title: 'Service insights', text: 'Know which services bring the most revenue to your shop.' },
  { Icon: IconUsers, title: 'Partner clarity', text: 'Keep finances transparent when multiple owners are involved.' },
  { Icon: IconZap, title: 'Simple setup', text: 'Create your account and start tracking in minutes.' },
];

const faqs = [
  { q: 'Who is DayBooks for?', a: 'DayBooks is built for tire shops, garages, and small service businesses that need a simple way to manage daily records.' },
  { q: 'Do I need accounting knowledge?', a: 'No. DayBooks is designed for practical daily use — not for accountants or finance professionals.' },
  { q: 'Can I track more than tire sales?', a: 'Yes. You can record different types of services, sales, and expenses across your entire shop workflow.' },
  { q: 'Is setup complicated?', a: 'No. Create your account, set up your shop, and begin using the app in just a few minutes.' },
  { q: 'Can I reserve the full setup for my shop?', a: 'Yes. You can pre-order the complete DayBooks setup with tablet, scanner, printer, and payment-ready workflow for your business.' },
];

// ── Component ──────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const width = useWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1100;

  const px = isMobile ? '18px' : isTablet ? '32px' : '56px';
  const sectionPy = isMobile ? '52px' : '88px';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F6F3EE',
        color: '#111',
        fontFamily: "'Outfit', system-ui, sans-serif",
        overflowX: 'hidden',
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'rgba(246,243,238,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(17,17,17,0.07)',
          padding: isMobile ? '12px 18px' : '16px 40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              background: '#C80815',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px',
            }}
          >
            D
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '-0.3px' }}>DayBooks</span>
        </div>

        {!isMobile && (
          <nav style={{ display: 'flex', gap: '28px' }}>
            {[
              ['#features', 'Features'],
              ['#how-it-works', 'How it works'],
              ['#setup', 'Full Setup'],
              ['#pricing', 'Pricing'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                style={{ color: '#333', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
              >
                {label}
              </a>
            ))}
          </nav>
        )}

        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          <Link
            to="/app"
            style={{
              padding: isMobile ? '9px 14px' : '10px 20px',
              borderRadius: '10px',
              background: '#fff',
              color: '#111',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '13px',
              border: '1px solid rgba(17,17,17,0.12)',
            }}
          >
            Login
          </Link>
          <Link
            to="/app"
            style={{
              padding: isMobile ? '9px 14px' : '10px 20px',
              borderRadius: '10px',
              background: '#C80815',
              color: '#fff',
              textDecoration: 'none',
              fontWeight: '700',
              fontSize: '13px',
            }}
          >
            {isMobile ? 'Start' : 'Start Free'}
          </Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: isMobile ? '48px 18px 40px' : '80px 40px 64px', textAlign: 'center' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '999px',
              background: '#fff',
              border: '1px solid rgba(17,17,17,0.1)',
              color: '#666',
              fontSize: isMobile ? '12px' : '13px',
              fontWeight: '600',
              marginBottom: '24px',
            }}
          >
            <IconWrench size={14} color="#C80815" />
            Built for tire shops, garages, and small service businesses
          </div>

          <h1
            style={{
              margin: '0 0 20px',
              fontSize: isMobile ? '34px' : isTablet ? '50px' : '62px',
              lineHeight: 1.02,
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#111',
            }}
          >
            Track your shop&apos;s daily income, expenses, and profit.
          </h1>

          <p
            style={{
              margin: '0 0 32px',
              fontSize: isMobile ? '16px' : '19px',
              lineHeight: '1.65',
              color: '#4D4D4D',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Replace notebooks and scattered records with one simple system for daily operations, clear
            profit visibility, and a setup built for real shop work.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px',
              justifyContent: 'center',
              marginBottom: '24px',
            }}
          >
            <Link
              to="/app"
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#C80815',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '15px',
                textAlign: 'center',
              }}
            >
              Create Free Account
            </Link>
            <a
              href="#setup"
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#fff',
                color: '#111',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '15px',
                border: '1px solid rgba(17,17,17,0.12)',
                textAlign: 'center',
              }}
            >
              Pre-Order Full Setup
            </a>
          </div>

          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              [IconCheckCircle, 'No credit card required'],
              [IconZap, 'Set up in minutes'],
              [IconShield, 'Pre-order full setup'],
            ].map(([Icon, label]) => (
              <span
                key={label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: '#fff',
                  border: '1px solid rgba(17,17,17,0.1)',
                  color: '#666',
                  fontSize: '12px',
                  fontWeight: '600',
                }}
              >
                <Icon size={13} color="#16A34A" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREVIEW CARD — desktop/tablet only ── */}
      {!isMobile && (
        <section style={{ padding: '0 40px 64px' }}>
          <div
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              background: '#fff',
              borderRadius: '24px',
              border: '1px solid rgba(17,17,17,0.08)',
              boxShadow: '0 20px 60px rgba(17,17,17,0.08)',
              padding: '28px',
            }}
          >
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}
            >
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: '#9E9E9E', fontWeight: '600' }}>Today</p>
                <h3 style={{ margin: '4px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                  Shop Summary
                </h3>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#EFF8F0',
                  color: '#1F7A35',
                  border: '1px solid #DBEEDC',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '700',
                }}
              >
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#16A34A',
                    display: 'inline-block',
                  }}
                />
                Live
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '20px' }}>
              {[
                ['Income', '$1,240'],
                ['Expenses', '$420'],
                ['Profit', '$820'],
                ['Entries', '12'],
              ].map(([l, v]) => (
                <div
                  key={l}
                  style={{
                    background: '#FAF8F4',
                    border: '1px solid rgba(17,17,17,0.06)',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#777', fontWeight: '600', marginBottom: '8px' }}>{l}</div>
                  <div style={{ fontSize: '26px', fontWeight: '800', letterSpacing: '-0.04em' }}>{v}</div>
                </div>
              ))}
            </div>

            <div
              style={{
                background: '#FAF8F4',
                border: '1px solid rgba(17,17,17,0.06)',
                borderRadius: '14px',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px' }}>Recent activity</span>
                <span style={{ fontSize: '12px', color: '#9E9E9E' }}>Today</span>
              </div>

              {[
                ['Tire Sale', '2:10 PM', '+$300', '#15803D'],
                ['Wheel Alignment', '12:40 PM', '+$120', '#15803D'],
                ['Shop Supplies', '11:05 AM', '-$60', '#C80815'],
              ].map(([t, time, amt, col], i, arr) => (
                <div
                  key={t}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: i < arr.length - 1 ? '1px solid #F0EEE9' : 'none',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{t}</div>
                    <div style={{ fontSize: '12px', color: '#9E9E9E', marginTop: '2px' }}>{time}</div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: col }}>{amt}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── STRIP ── */}
      <section style={{ padding: `0 ${px} 48px` }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)',
            background: '#fff',
            border: '1px solid rgba(17,17,17,0.07)',
            borderRadius: '16px',
            overflow: 'hidden',
          }}
        >
          {[
            [IconGrid, 'Daily entries', 'Capture sales and expenses as they happen'],
            [IconBarChart, 'Clear totals', 'Know income, expenses, and profit at a glance'],
            [IconZap, 'Shop-friendly', 'Simple enough for real daily operations'],
            [IconCheckCircle, 'Built for owners', 'Reduces confusion, not adds more work'],
          ].map(([Icon, title, text], i, arr) => (
            <div
              key={title}
              style={{
                padding: isMobile ? '16px' : '22px',
                borderRight: !isMobile && i < arr.length - 1 ? '1px solid rgba(17,17,17,0.07)' : 'none',
                borderBottom: isMobile && i < 2 ? '1px solid rgba(17,17,17,0.07)' : 'none',
              }}
            >
              <div style={{ marginBottom: '8px' }}>
                <Icon size={18} color="#C80815" />
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#161616', marginBottom: '4px' }}>{title}</div>
              <div style={{ fontSize: '12px', color: '#666', lineHeight: '1.5' }}>{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHY DAYBOOKS ── */}
      <section
        style={{
          background: '#FBFAF7',
          borderTop: '1px solid rgba(17,17,17,0.05)',
          borderBottom: '1px solid rgba(17,17,17,0.05)',
          padding: `${sectionPy} ${px}`,
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <SectionHead eyebrow="Why DayBooks" title="Stop depending on notebooks and memory" isMobile={isMobile} />
          <p
            style={{
              textAlign: 'center',
              fontSize: isMobile ? '15px' : '17px',
              color: '#5D5D5D',
              lineHeight: '1.7',
              maxWidth: '640px',
              margin: '-24px auto 40px',
            }}
          >
            Small shops don&apos;t need bulky accounting software. They need one practical place to record work,
            expenses, and profit clearly.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
            <div
              style={{
                background: '#FFF5F5',
                border: '1px solid rgba(180,35,24,0.12)',
                borderRadius: '16px',
                padding: isMobile ? '20px' : '28px',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800' }}>Without DayBooks</h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  'Sales written in books or loose papers',
                  'Expenses forgotten until later',
                  'No clear daily profit number',
                  'Hard to review service performance',
                  'Confusion between owners or partners',
                ].map(item => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#555',
                      lineHeight: '1.5',
                    }}
                  >
                    <span style={{ color: '#C80815', flexShrink: 0, marginTop: '1px' }}>✕</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div
              style={{
                background: '#F3FBF5',
                border: '1px solid rgba(22,122,58,0.12)',
                borderRadius: '16px',
                padding: isMobile ? '20px' : '28px',
              }}
            >
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '800' }}>With DayBooks</h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {[
                  'Income and expenses in one place',
                  'Faster daily record keeping',
                  'Clear view of profit and totals',
                  'Better service-level visibility',
                  'More confidence in operations',
                ].map(item => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      fontSize: '14px',
                      color: '#333',
                      lineHeight: '1.5',
                    }}
                  >
                    <IconCheckCircle size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: '1px' }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: `${sectionPy} ${px}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHead eyebrow="Features" title="Built for the way small shops actually work" isMobile={isMobile} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
              gap: '16px',
            }}
          >
            {features.map(({ Icon, title, text }) => (
              <div
                key={title}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(17,17,17,0.07)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(17,17,17,0.04)',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#FEF0F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px',
                  }}
                >
                  <Icon size={20} color="#C80815" />
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.65', color: '#5F5F5F' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        id="how-it-works"
        style={{
          background: '#FBFAF7',
          borderTop: '1px solid rgba(17,17,17,0.05)',
          borderBottom: '1px solid rgba(17,17,17,0.05)',
          padding: `${sectionPy} ${px}`,
        }}
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHead eyebrow="How it works" title="Simple from the first day" isMobile={isMobile} />
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px' }}>
            {[
              ['01', 'Create your shop', 'Set up your business profile and workspace in minutes.'],
              ['02', 'Add income and expenses', 'Record daily shop activity as it happens.'],
              ['03', 'Review profit clearly', 'See totals and trends without manual math or messy records.'],
            ].map(([n, title, text]) => (
              <div
                key={n}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(17,17,17,0.07)',
                  borderRadius: '16px',
                  padding: '24px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: '#111',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                    fontWeight: '800',
                    marginBottom: '16px',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {n}
                </div>
                <h3 style={{ margin: '0 0 8px', fontSize: '17px', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  {title}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.65', color: '#5D5D5D' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL SETUP ── */}
      <section id="setup" style={{ padding: `${sectionPy} ${px}` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <SectionHead eyebrow="Full setup" title="Pre-order the complete shop setup" isMobile={isMobile} />

          <div
            style={{
              background: '#fff',
              border: '1px solid rgba(17,17,17,0.08)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 36px rgba(17,17,17,0.05)',
            }}
          >
            <div
              style={{
                padding: isMobile ? '28px 20px' : '36px',
                background: 'linear-gradient(135deg, #C80815 0%, #8F1018 100%)',
                color: '#fff',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.14)',
                  fontSize: '12px',
                  fontWeight: '700',
                  marginBottom: '16px',
                }}
              >
                <IconShield size={13} color="#fff" />
                Reserve your shop setup
              </div>

              <h3
                style={{
                  margin: '0 0 12px',
                  fontSize: isMobile ? '28px' : '40px',
                  lineHeight: 1.05,
                  fontWeight: '800',
                  letterSpacing: '-0.04em',
                }}
              >
                Hardware + software, ready for your shop.
              </h3>

              <p
                style={{
                  margin: 0,
                  maxWidth: '760px',
                  fontSize: isMobile ? '15px' : '17px',
                  lineHeight: '1.75',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                Pre-order a complete DayBooks setup with tablet, scanner, printer, and payment-ready
                workflow — built to help your shop start faster with less setup work.
              </p>
            </div>

            <div
              style={{
                padding: isMobile ? '22px 20px 24px' : '32px 36px 36px',
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1.2fr 0.8fr',
                gap: '24px',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                    gap: '14px',
                    marginBottom: '22px',
                  }}
                >
                  {[
                    [IconTablet, 'Tablet included', 'A dedicated device ready for daily shop use.'],
                    [IconScan, 'Scanner ready', 'Fast item and inventory scanning workflow.'],
                    [IconPrinter, 'Receipt printer', 'Print receipts and shop records easily.'],
                    [IconCard, 'Card payments', 'Support payment-ready checkout experience.'],
                  ].map(([Icon, title, text]) => (
                    <div
                      key={title}
                      style={{
                        background: '#FAF8F4',
                        border: '1px solid rgba(17,17,17,0.06)',
                        borderRadius: '16px',
                        padding: '18px',
                      }}
                    >
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: '#FEF0F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        <Icon size={20} color="#C80815" />
                      </div>
                      <h4 style={{ margin: '0 0 6px', fontSize: '16px', fontWeight: '800' }}>{title}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#5E5E5E', lineHeight: '1.6' }}>{text}</p>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    background: '#FBFAF7',
                    border: '1px solid rgba(17,17,17,0.06)',
                    borderRadius: '16px',
                    padding: '20px',
                  }}
                >
                  <h4 style={{ margin: '0 0 12px', fontSize: '17px', fontWeight: '800' }}>What you get</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      'Pre-configured DayBooks setup for your shop',
                      'Tablet with business workflow ready to use',
                      'Scanner and printer compatible workflow',
                      'Payment-ready setup for smoother checkout',
                      'Priority access to the full shop system',
                    ].map(item => (
                      <div
                        key={item}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '14px',
                          color: '#444',
                          lineHeight: '1.6',
                        }}
                      >
                        <IconCheckCircle size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div
                style={{
                  background: '#fff',
                  border: '1px solid rgba(17,17,17,0.08)',
                  borderRadius: '20px',
                  padding: isMobile ? '22px' : '24px',
                  alignSelf: 'start',
                  boxShadow: '0 6px 20px rgba(17,17,17,0.04)',
                }}
              >
                <p
                  style={{
                    margin: '0 0 6px',
                    fontSize: '12px',
                    fontWeight: '700',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#C80815',
                  }}
                >
                  Pre-order
                </p>

                <h3 style={{ margin: '0 0 8px', fontSize: '34px', fontWeight: '900', letterSpacing: '-0.04em' }}>
                  Reserve Now
                </h3>

                <p style={{ margin: '0 0 18px', fontSize: '14px', color: '#5E5E5E', lineHeight: '1.65' }}>
                  Secure your DayBooks full setup and get priority access for your shop.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
                  {[
                    'Built for tire shops and service businesses',
                    'Faster setup for daily operations',
                    'Simple workflow from day one',
                  ].map(item => (
                    <div
                      key={item}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#333' }}
                    >
                      <IconCheckCircle size={15} color="#16A34A" />
                      {item}
                    </div>
                  ))}
                </div>

                <Link
                  to="/app"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '12px',
                    background: '#C80815',
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    textAlign: 'center',
                    marginBottom: '10px',
                  }}
                >
                  Pre-Order Full Setup
                </Link>

                <a
                  href="mailto:hello@daybooks.app"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '13px 18px',
                    borderRadius: '12px',
                    background: '#fff',
                    color: '#111',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '14px',
                    textAlign: 'center',
                    border: '1px solid rgba(17,17,17,0.12)',
                  }}
                >
                  Talk to Sales
                </a>

                <p style={{ margin: '14px 0 0', fontSize: '12px', lineHeight: '1.6', color: '#888' }}>
                  Ideal for shops that want a more complete business setup with hardware and software together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: `${sectionPy} ${px}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <SectionHead eyebrow="Pricing" title="Simple pricing for growing shops" isMobile={isMobile} />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: '20px',
              alignItems: 'stretch',
            }}
          >
            <div
              style={{
                background: '#fff',
                border: '1px solid rgba(17,17,17,0.08)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 4px 20px rgba(17,17,17,0.04)',
              }}
            >
              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#888' }}>Starter</p>
              <h3 style={{ margin: 0, fontSize: '38px', fontWeight: '900', letterSpacing: '-0.04em', color: '#111' }}>
                Free
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#5D5D5D', lineHeight: '1.6' }}>
                For owners who want a simple way to get organised.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1,
                }}
              >
                {['Shop setup', 'Income tracking', 'Expense tracking', 'Basic service records'].map(item => (
                  <li
                    key={item}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#444' }}
                  >
                    <IconCheckCircle size={15} color="#16A34A" />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                to="/app"
                style={{
                  display: 'block',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '14px',
                  border: '1px solid rgba(17,17,17,0.14)',
                  textAlign: 'center',
                }}
              >
                Start Free
              </Link>
            </div>

            <div
              style={{
                background: '#C80815',
                border: '1px solid rgba(200,8,21,0.2)',
                borderRadius: '20px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: '0 12px 36px rgba(200,8,21,0.22)',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.18)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: '700',
                  alignSelf: 'flex-start',
                }}
              >
                <IconShield size={12} color="#fff" />
                Pre-order
              </div>

              <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'rgba(255,255,255,0.75)' }}>
                Professional Setup
              </p>

              <h3 style={{ margin: 0, fontSize: '38px', fontWeight: '900', letterSpacing: '-0.04em', color: '#fff' }}>
                Reserve Now
              </h3>

              <p style={{ margin: 0, fontSize: '14px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.6' }}>
                For shops that want the complete DayBooks setup with premium workflow support.
              </p>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '4px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1,
                }}
              >
                {[
                  'Everything in Starter',
                  'Tablet-ready business workflow',
                  'Scanner + printer workflow',
                  'Priority setup access',
                ].map(item => (
                  <li
                    key={item}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px',
                      color: 'rgba(255,255,255,0.9)',
                    }}
                  >
                    <IconCheckCircle size={15} color="rgba(255,255,255,0.9)" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="#setup"
                style={{
                  display: 'block',
                  padding: '13px 20px',
                  borderRadius: '12px',
                  background: '#fff',
                  color: '#111',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '14px',
                  textAlign: 'center',
                }}
              >
                Pre-Order Full Setup
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        id="faq"
        style={{
          background: '#FBFAF7',
          borderTop: '1px solid rgba(17,17,17,0.05)',
          borderBottom: '1px solid rgba(17,17,17,0.05)',
          padding: `${sectionPy} ${px}`,
        }}
      >
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <SectionHead eyebrow="FAQ" title="Common questions" isMobile={isMobile} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map(f => (
              <div
                key={f.q}
                style={{
                  background: '#fff',
                  border: '1px solid rgba(17,17,17,0.07)',
                  borderRadius: '14px',
                  padding: isMobile ? '18px 20px' : '22px 26px',
                }}
              >
                <h3
                  style={{
                    margin: '0 0 8px',
                    fontSize: isMobile ? '15px' : '17px',
                    fontWeight: '800',
                    letterSpacing: '-0.02em',
                    color: '#171717',
                  }}
                >
                  {f.q}
                </h3>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.75', color: '#5C5C5C' }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: `${sectionPy} ${px}` }}>
        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: '#fff',
            border: '1px solid rgba(17,17,17,0.07)',
            borderRadius: '24px',
            padding: isMobile ? '40px 24px' : '64px 56px',
            textAlign: 'center',
            boxShadow: '0 8px 36px rgba(17,17,17,0.06)',
          }}
        >
          <p
            style={{
              margin: '0 0 12px',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#C80815',
            }}
          >
            Get started
          </p>

          <h2
            style={{
              margin: '0 0 16px',
              fontSize: isMobile ? '28px' : '42px',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: '#111',
              lineHeight: 1.05,
            }}
          >
            Bring more order to your daily shop records.
          </h2>

          <p
            style={{
              margin: '0 0 32px',
              fontSize: isMobile ? '15px' : '17px',
              lineHeight: '1.7',
              color: '#5E5E5E',
              maxWidth: '520px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Use a system that helps your business stay clear, organised, and easier to manage every day.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            <Link
              to="/app"
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#C80815',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '15px',
                textAlign: 'center',
              }}
            >
              Create Free Account
            </Link>
            <a
              href="#setup"
              style={{
                padding: '14px 32px',
                borderRadius: '12px',
                background: '#fff',
                color: '#111',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '15px',
                border: '1px solid rgba(17,17,17,0.12)',
                textAlign: 'center',
              }}
            >
              Pre-Order Full Setup
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(17,17,17,0.07)', padding: isMobile ? '28px 18px 48px' : '32px 40px 52px' }}>
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  background: '#C80815',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  fontSize: '14px',
                }}
              >
                D
              </div>
              <span style={{ fontSize: '17px', fontWeight: '800', letterSpacing: '-0.3px', color: '#161616' }}>
                DayBooks
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#666', lineHeight: '1.6', maxWidth: '340px' }}>
              Daily shop ledger for tire shops, garages, and small service businesses.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {[
              ['#features', 'Features'],
              ['#setup', 'Full Setup'],
              ['#pricing', 'Pricing'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a key={href} href={href} style={{ color: '#333', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                {label}
              </a>
            ))}
            <Link to="/app" style={{ color: '#333', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHead({ eyebrow, title, isMobile }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
      <p
        style={{
          margin: '0 0 10px',
          fontSize: '12px',
          fontWeight: '700',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#C80815',
        }}
      >
        {eyebrow}
      </p>
      <h2
        style={{
          margin: 0,
          fontSize: isMobile ? '26px' : '40px',
          fontWeight: '800',
          letterSpacing: '-0.04em',
          color: '#141414',
          lineHeight: 1.05,
        }}
      >
        {title}
      </h2>
    </div>
  );
}