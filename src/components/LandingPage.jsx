import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const features = [
  {
    icon: '▣',
    title: 'Daily income tracking',
    text: 'Record tire sales, repairs, alignments, and service income in seconds.',
  },
  {
    icon: '◌',
    title: 'Expense management',
    text: 'Track shop expenses clearly so your real profit is never hidden.',
  },
  {
    icon: '△',
    title: 'Profit visibility',
    text: 'See daily, weekly, and monthly profit without manual calculation.',
  },
  {
    icon: '✦',
    title: 'Service insights',
    text: 'Understand which services bring the most revenue to your shop.',
  },
  {
    icon: '◇',
    title: 'Partner clarity',
    text: 'Keep records transparent when multiple owners or partners are involved.',
  },
  {
    icon: '◎',
    title: 'Simple shop setup',
    text: 'Create your account, add your shop, and start tracking right away.',
  },
];

const faqs = [
  {
    question: 'Who is DayBooks for?',
    answer:
      'DayBooks is built for tire shops, garages, and small service businesses that need a simple way to manage daily records.',
  },
  {
    question: 'Do I need accounting knowledge?',
    answer:
      'No. DayBooks is designed for practical daily use, not for people with accounting backgrounds.',
  },
  {
    question: 'Can I track more than tire sales?',
    answer:
      'Yes. You can record different types of services, sales, and expenses across your shop workflow.',
  },
  {
    question: 'Is setup complicated?',
    answer:
      'No. You can create your account, set up your shop, and begin using the app in just a few minutes.',
  },
];

function LandingPage() {
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1280
  );

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenWidth <= 768;
  const isTablet = screenWidth <= 1024;

  return (
    <div style={styles.page}>
      <header
        style={{
          ...styles.header,
          ...(isMobile ? styles.headerMobile : isTablet ? styles.headerTablet : {}),
        }}
      >
        <div
          style={{
            ...styles.brandWrap,
            width: 'auto',
            maxWidth: 'fit-content',
          }}
        >
          <div style={styles.logoBadge}>D</div>

          <div style={styles.brandTextWrap}>
            <div style={styles.logo}>DayBooks</div>
            <p style={styles.tagline}>Daily shop ledger for small service businesses</p>
          </div>
        </div>

        <nav
          style={{
            ...styles.nav,
            ...(isMobile ? styles.navMobile : isTablet ? styles.navTablet : {}),
          }}
        >
          <a href="#features" style={styles.navLink}>
            Features
          </a>
          <a href="#how-it-works" style={styles.navLink}>
            How it works
          </a>
          <a href="#pricing" style={styles.navLink}>
            Pricing
          </a>
          <a href="#faq" style={styles.navLink}>
            FAQ
          </a>
        </nav>

        <div
          style={{
            ...styles.headerActions,
            ...(isMobile ? styles.headerActionsMobile : {}),
          }}
        >
          <Link to="/app" style={{ ...styles.secondaryButton, ...(isMobile ? styles.buttonFluid : {}) }}>
            Login
          </Link>
          <Link to="/app" style={{ ...styles.primaryButton, ...(isMobile ? styles.buttonFluid : {}) }}>
            Start Free
          </Link>
        </div>
      </header>

      <main>
        <section
          style={{
            ...styles.heroSection,
            ...(isMobile ? styles.heroSectionMobile : isTablet ? styles.heroSectionTablet : {}),
          }}
        >
          <div
            style={{
              ...styles.heroInner,
              ...(isMobile ? styles.heroInnerMobile : isTablet ? styles.heroInnerTablet : {}),
            }}
          >
            <div style={styles.heroLeft}>
              <div
                style={{
                  ...styles.eyebrow,
                  ...(isMobile ? styles.eyebrowMobile : {}),
                }}
              >
                Built for tire shops, garages, and small service businesses
              </div>

              <h1
                style={{
                  ...styles.heroTitle,
                  ...(isMobile ? styles.heroTitleMobile : isTablet ? styles.heroTitleTablet : {}),
                }}
              >
                A cleaner way to track your shop’s daily income, expenses, and profit.
              </h1>

              <p
                style={{
                  ...styles.heroText,
                  ...(isMobile ? styles.heroTextMobile : isTablet ? styles.heroTextTablet : {}),
                }}
              >
                DayBooks helps shop owners replace notebooks and scattered records with one simple system
                for daily operations, service tracking, and clear profit visibility.
              </p>

              <div
                style={{
                  ...styles.heroActions,
                  ...(isMobile ? styles.heroActionsMobile : {}),
                }}
              >
                <Link
                  to="/app"
                  style={{
                    ...styles.primaryButtonLarge,
                    ...(isMobile ? styles.buttonLargeFluid : {}),
                  }}
                >
                  Create Free Account
                </Link>
                <a
                  href="#pricing"
                  style={{
                    ...styles.secondaryButtonLarge,
                    ...(isMobile ? styles.buttonLargeFluid : {}),
                  }}
                >
                  View Pricing
                </a>
              </div>

              <div style={{ ...styles.heroTrustRow, ...(isMobile ? styles.heroTrustRowMobile : {}) }}>
                <span style={styles.trustPill}>No credit card required</span>
                <span style={styles.trustPill}>Set up in minutes</span>
                <span style={styles.trustPill}>Simple daily workflow</span>
              </div>
            </div>

            <div style={styles.heroRight}>
              <div
                style={{
                  ...styles.previewCard,
                  ...(isMobile ? styles.previewCardMobile : {}),
                }}
              >
                <div style={styles.previewTop}>
                  <div>
                    <p style={styles.previewLabel}>Today</p>
                    <h3 style={{ ...styles.previewTitle, ...(isMobile ? styles.previewTitleMobile : {}) }}>
                      Shop Summary
                    </h3>
                  </div>
                  <span style={styles.livePill}>Live</span>
                </div>

                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Income</span>
                    <strong style={{ ...styles.statValue, ...(isMobile ? styles.statValueMobile : {}) }}>
                      $1,240
                    </strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Expenses</span>
                    <strong style={{ ...styles.statValue, ...(isMobile ? styles.statValueMobile : {}) }}>
                      $420
                    </strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Profit</span>
                    <strong style={{ ...styles.statValue, ...(isMobile ? styles.statValueMobile : {}) }}>
                      $820
                    </strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Entries</span>
                    <strong style={{ ...styles.statValue, ...(isMobile ? styles.statValueMobile : {}) }}>
                      12
                    </strong>
                  </div>
                </div>

                <div style={styles.panel}>
                  <div style={styles.panelHeader}>
                    <span style={styles.panelTitle}>Recent activity</span>
                    <span style={styles.panelMeta}>Today</span>
                  </div>

                  <div style={styles.row}>
                    <div>
                      <div style={styles.rowTitle}>Tire Sale</div>
                      <div style={styles.rowSub}>2:10 PM</div>
                    </div>
                    <div style={styles.rowPositive}>+$300</div>
                  </div>

                  <div style={styles.row}>
                    <div>
                      <div style={styles.rowTitle}>Wheel Alignment</div>
                      <div style={styles.rowSub}>12:40 PM</div>
                    </div>
                    <div style={styles.rowPositive}>+$120</div>
                  </div>

                  <div style={styles.rowLast}>
                    <div>
                      <div style={styles.rowTitle}>Shop Supplies</div>
                      <div style={styles.rowSub}>11:05 AM</div>
                    </div>
                    <div style={styles.rowNegative}>-$60</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section style={{ ...styles.stripSection, ...(isMobile ? styles.stripSectionMobile : {}) }}>
          <div
            style={{
              ...styles.strip,
              ...(isMobile ? styles.stripMobile : isTablet ? styles.stripTablet : {}),
            }}
          >
            <div style={{ ...styles.stripItem, ...(isMobile ? styles.stripItemMobile : {}) }}>
              <strong style={styles.stripTitle}>Daily entries</strong>
              <span style={styles.stripText}>Capture sales and expenses as they happen</span>
            </div>
            <div style={{ ...styles.stripItem, ...(isMobile ? styles.stripItemMobile : {}) }}>
              <strong style={styles.stripTitle}>Clear totals</strong>
              <span style={styles.stripText}>Know what came in, what went out, and what remains</span>
            </div>
            <div style={{ ...styles.stripItem, ...(isMobile ? styles.stripItemMobile : {}) }}>
              <strong style={styles.stripTitle}>Shop-friendly workflow</strong>
              <span style={styles.stripText}>Simple enough for real daily operations</span>
            </div>
            <div style={{ ...styles.stripItemNoBorder, ...(isMobile ? styles.stripItemMobile : {}) }}>
              <strong style={styles.stripTitle}>Built for owners</strong>
              <span style={styles.stripText}>Made to reduce confusion, not add more work</span>
            </div>
          </div>
        </section>

        <section style={{ ...styles.sectionSoft, ...(isMobile ? styles.sectionMobile : {}) }}>
          <div style={styles.containerNarrow}>
            <div style={{ ...styles.sectionIntro, ...(isMobile ? styles.sectionIntroMobile : {}) }}>
              <p style={styles.sectionEyebrow}>Why DayBooks</p>
              <h2
                style={{
                  ...styles.sectionTitle,
                  ...(isMobile ? styles.sectionTitleMobile : isTablet ? styles.sectionTitleTablet : {}),
                }}
              >
                Stop depending on notebooks and memory
              </h2>
              <p style={{ ...styles.sectionText, ...(isMobile ? styles.sectionTextMobile : {}) }}>
                Small shops usually do not need bulky accounting software for daily tracking. They need one
                practical place to record work, expenses, and profit clearly.
              </p>
            </div>

            <div
              style={{
                ...styles.compareGrid,
                ...(isMobile ? styles.singleColumnGrid : {}),
              }}
            >
              <div style={styles.compareBad}>
                <h3 style={styles.compareTitle}>Without DayBooks</h3>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Sales written in books or loose papers</li>
                  <li style={styles.listItem}>Expenses forgotten until later</li>
                  <li style={styles.listItem}>No clear daily profit number</li>
                  <li style={styles.listItem}>Difficult to review service performance</li>
                  <li style={styles.listItem}>More confusion between owners or partners</li>
                </ul>
              </div>

              <div style={styles.compareGood}>
                <h3 style={styles.compareTitle}>With DayBooks</h3>
                <ul style={styles.list}>
                  <li style={styles.listItem}>Income and expenses tracked in one place</li>
                  <li style={styles.listItem}>Faster daily record keeping</li>
                  <li style={styles.listItem}>Clear view of profit and totals</li>
                  <li style={styles.listItem}>Better service-level visibility</li>
                  <li style={styles.listItem}>More confidence in shop operations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="features" style={{ ...styles.section, ...(isMobile ? styles.sectionMobile : {}) }}>
          <div style={styles.container}>
            <div style={{ ...styles.sectionIntro, ...(isMobile ? styles.sectionIntroMobile : {}) }}>
              <p style={styles.sectionEyebrow}>Features</p>
              <h2
                style={{
                  ...styles.sectionTitle,
                  ...(isMobile ? styles.sectionTitleMobile : isTablet ? styles.sectionTitleTablet : {}),
                }}
              >
                Built for the way small shops actually work
              </h2>
              <p style={{ ...styles.sectionText, ...(isMobile ? styles.sectionTextMobile : {}) }}>
                DayBooks focuses on daily clarity, fast entry, and records that are easy to review.
              </p>
            </div>

            <div
              style={{
                ...styles.featureGrid,
                ...(isMobile ? styles.singleColumnGrid : isTablet ? styles.twoColumnGrid : {}),
              }}
            >
              {features.map((feature) => (
                <div key={feature.title} style={styles.featureCard}>
                  <div style={styles.featureIconWrap}>
                    <span style={styles.featureIcon}>{feature.icon}</span>
                  </div>
                  <h3 style={styles.featureTitle}>{feature.title}</h3>
                  <p style={styles.featureText}>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" style={{ ...styles.sectionSoft, ...(isMobile ? styles.sectionMobile : {}) }}>
          <div style={styles.container}>
            <div style={{ ...styles.sectionIntro, ...(isMobile ? styles.sectionIntroMobile : {}) }}>
              <p style={styles.sectionEyebrow}>How it works</p>
              <h2
                style={{
                  ...styles.sectionTitle,
                  ...(isMobile ? styles.sectionTitleMobile : isTablet ? styles.sectionTitleTablet : {}),
                }}
              >
                Simple from the first day
              </h2>
            </div>

            <div
              style={{
                ...styles.stepsGrid,
                ...(isMobile ? styles.singleColumnGrid : isTablet ? styles.twoColumnGrid : {}),
              }}
            >
              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>01</div>
                <h3 style={styles.stepTitle}>Create your shop</h3>
                <p style={styles.stepText}>
                  Set up your business profile and get your workspace ready quickly.
                </p>
              </div>

              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>02</div>
                <h3 style={styles.stepTitle}>Add income and expenses</h3>
                <p style={styles.stepText}>
                  Record daily shop activity as it happens instead of waiting until later.
                </p>
              </div>

              <div style={styles.stepCard}>
                <div style={styles.stepNumber}>03</div>
                <h3 style={styles.stepTitle}>Review profit clearly</h3>
                <p style={styles.stepText}>
                  See totals, trends, and performance without manual math or messy records.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{ ...styles.section, ...(isMobile ? styles.sectionMobile : {}) }}>
          <div style={styles.containerNarrow}>
            <div style={{ ...styles.sectionIntro, ...(isMobile ? styles.sectionIntroMobile : {}) }}>
              <p style={styles.sectionEyebrow}>Pricing</p>
              <h2
                style={{
                  ...styles.sectionTitle,
                  ...(isMobile ? styles.sectionTitleMobile : isTablet ? styles.sectionTitleTablet : {}),
                }}
              >
                Simple pricing for growing shops
              </h2>
              <p style={{ ...styles.sectionText, ...(isMobile ? styles.sectionTextMobile : {}) }}>
                Start with a basic setup today and expand as the product grows.
              </p>
            </div>

            <div
              style={{
                ...styles.pricingGrid,
                ...(isMobile ? styles.singleColumnGrid : {}),
              }}
            >
              <div style={styles.pricingCard}>
                <p style={styles.planName}>Starter</p>
                <h3 style={styles.planPrice}>Free</h3>
                <p style={styles.planDesc}>For owners who want a simple way to get organized.</p>

                <ul style={styles.planList}>
                  <li style={styles.listItem}>Shop setup</li>
                  <li style={styles.listItem}>Income tracking</li>
                  <li style={styles.listItem}>Expense tracking</li>
                  <li style={styles.listItem}>Basic service records</li>
                </ul>

                <Link to="/app" style={styles.secondaryButtonFull}>
                  Start Free
                </Link>
              </div>

              <div style={styles.pricingCardFeatured}>
                <div style={styles.recommendedBadge}>Recommended</div>
                <p style={styles.planNameDark}>Professional</p>
                <h3 style={styles.planPriceDark}>Coming Soon</h3>
                <p style={styles.planDescDark}>
                  For shops that want deeper reporting, exports, and premium workflows.
                </p>

                <ul style={styles.planListDark}>
                  <li style={styles.listItemDark}>Everything in Starter</li>
                  <li style={styles.listItemDark}>Advanced reports</li>
                  <li style={styles.listItemDark}>Premium workflows</li>
                  <li style={styles.listItemDark}>Early access updates</li>
                </ul>

                <Link to="/app" style={styles.primaryButtonFull}>
                  Join Early Access
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="faq" style={{ ...styles.sectionSoft, ...(isMobile ? styles.sectionMobile : {}) }}>
          <div style={styles.containerNarrow}>
            <div style={{ ...styles.sectionIntro, ...(isMobile ? styles.sectionIntroMobile : {}) }}>
              <p style={styles.sectionEyebrow}>FAQ</p>
              <h2
                style={{
                  ...styles.sectionTitle,
                  ...(isMobile ? styles.sectionTitleMobile : isTablet ? styles.sectionTitleTablet : {}),
                }}
              >
                Common questions
              </h2>
            </div>

            <div
              style={{
                ...styles.faqGrid,
                ...(isMobile ? styles.singleColumnGrid : {}),
              }}
            >
              {faqs.map((faq) => (
                <div key={faq.question} style={styles.faqCard}>
                  <h3 style={styles.faqQuestion}>{faq.question}</h3>
                  <p style={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ ...styles.finalSection, ...(isMobile ? styles.finalSectionMobile : {}) }}>
          <div style={{ ...styles.finalCard, ...(isMobile ? styles.finalCardMobile : {}) }}>
            <p style={styles.sectionEyebrow}>Get started</p>
            <h2
              style={{
                ...styles.finalTitle,
                ...(isMobile ? styles.finalTitleMobile : isTablet ? styles.finalTitleTablet : {}),
              }}
            >
              Bring more order to your daily shop records.
            </h2>
            <p style={{ ...styles.finalText, ...(isMobile ? styles.finalTextMobile : {}) }}>
              Use a system that helps your business stay clear, organized, and easier to manage.
            </p>

            <div style={{ ...styles.heroActionsCentered, ...(isMobile ? styles.heroActionsMobile : {}) }}>
              <Link
                to="/app"
                style={{
                  ...styles.primaryButtonLarge,
                  ...(isMobile ? styles.buttonLargeFluid : {}),
                }}
              >
                Create Free Account
              </Link>
              <Link
                to="/app"
                style={{
                  ...styles.secondaryButtonLarge,
                  ...(isMobile ? styles.buttonLargeFluid : {}),
                }}
              >
                Login
              </Link>
            </div>
          </div>
        </section>

        <footer style={{ ...styles.footer, ...(isMobile ? styles.footerMobile : {}) }}>
          <div
            style={{
              ...styles.footerInner,
              ...(isMobile ? styles.footerInnerMobile : {}),
            }}
          >
            <div>
              <div style={styles.footerBrand}>DayBooks</div>
              <p style={styles.footerText}>
                Daily shop ledger for tire shops, garages, and small service businesses.
              </p>
            </div>

            <div style={{ ...styles.footerLinks, ...(isMobile ? styles.footerLinksMobile : {}) }}>
              <a href="#features" style={styles.footerLink}>
                Features
              </a>
              <a href="#pricing" style={styles.footerLink}>
                Pricing
              </a>
              <a href="#faq" style={styles.footerLink}>
                FAQ
              </a>
              <Link to="/app" style={styles.footerLink}>
                Login
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f6f3ee',
    color: '#111111',
    fontFamily: "'Outfit', system-ui, sans-serif",
    overflowX: 'hidden',
  },

  header: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '22px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
    position: 'sticky',
    top: 0,
    zIndex: 20,
    background: 'rgba(246, 243, 238, 0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(17,17,17,0.06)',
  },

  headerTablet: {
    padding: '18px 24px',
    gap: '16px',
  },

  headerMobile: {
    padding: '14px 16px',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    position: 'static',
  },

  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexShrink: 0,
  },

  brandTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: '0px',
    lineHeight: 1,
    whiteSpace: 'nowrap',
  },

  logoBadge: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    background: '#dc2626',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '14px',
    flexShrink: 0,
  },

  logo: {
    fontSize: '18px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1,
    margin: 0,
  },

  tagline: {
    margin: '0',
    color: '#666',
    fontSize: '10.5px',
    lineHeight: 1.1,
    opacity: 0.85,
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '26px',
    flexWrap: 'wrap',
  },

  navTablet: {
    gap: '18px',
  },

  navMobile: {
    width: '100%',
    gap: '10px 16px',
    justifyContent: 'flex-start',
  },

  navLink: {
    color: '#2a2a2a',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '15px',
    whiteSpace: 'nowrap',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },

  headerActionsMobile: {
    width: '100%',
    gap: '10px',
  },

  buttonFluid: {
    flex: 1,
    minWidth: 0,
  },

  buttonLargeFluid: {
    width: '100%',
  },

  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 18px',
    borderRadius: '14px',
    background: '#c80815',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '14px',
    border: '1px solid #c80815',
    boxShadow: '0 12px 24px rgba(200, 8, 21, 0.18)',
  },

  secondaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 18px',
    borderRadius: '14px',
    background: '#fff',
    color: '#111',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '14px',
    border: '1px solid rgba(17,17,17,0.08)',
  },

  primaryButtonLarge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 22px',
    borderRadius: '16px',
    background: '#c80815',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '15px',
    border: '1px solid #c80815',
    boxShadow: '0 14px 28px rgba(200, 8, 21, 0.18)',
  },

  secondaryButtonLarge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px 22px',
    borderRadius: '16px',
    background: '#fff',
    color: '#111',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '15px',
    border: '1px solid rgba(17,17,17,0.08)',
  },

  secondaryButtonFull: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 20px',
    borderRadius: '16px',
    background: '#fff',
    color: '#111',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '15px',
    border: '1px solid rgba(17,17,17,0.08)',
    marginTop: '10px',
    boxSizing: 'border-box',
  },

  primaryButtonFull: {
    width: '100%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 20px',
    borderRadius: '16px',
    background: '#fff',
    color: '#111',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '15px',
    border: '1px solid rgba(255,255,255,0.2)',
    marginTop: '10px',
    boxSizing: 'border-box',
  },

  heroSection: {
    padding: '56px 32px 32px',
  },

  heroSectionTablet: {
    padding: '44px 24px 24px',
  },

  heroSectionMobile: {
    padding: '24px 16px 16px',
  },

  heroInner: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '36px',
    alignItems: 'center',
  },

  heroInnerTablet: {
    gridTemplateColumns: '1fr',
    gap: '28px',
  },

  heroInnerMobile: {
    gridTemplateColumns: '1fr',
    gap: '22px',
  },

  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    minWidth: 0,
  },

  eyebrow: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: '999px',
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.08)',
    color: '#5e5e5e',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '20px',
    lineHeight: 1.4,
  },

  eyebrowMobile: {
    fontSize: '13px',
    padding: '9px 12px',
    marginBottom: '16px',
  },

  heroTitle: {
    margin: '0 0 18px',
    fontSize: '64px',
    lineHeight: 0.98,
    fontWeight: 800,
    letterSpacing: '-0.05em',
    maxWidth: '720px',
  },

  heroTitleTablet: {
    fontSize: '52px',
    maxWidth: '100%',
  },

  heroTitleMobile: {
    fontSize: '38px',
    lineHeight: 1.02,
    letterSpacing: '-0.04em',
    margin: '0 0 14px',
    maxWidth: '100%',
  },

  heroText: {
    margin: '0 0 28px',
    fontSize: '21px',
    lineHeight: 1.65,
    color: '#4d4d4d',
    maxWidth: '680px',
  },

  heroTextTablet: {
    fontSize: '18px',
    maxWidth: '100%',
  },

  heroTextMobile: {
    margin: '0 0 20px',
    fontSize: '16px',
    lineHeight: 1.65,
    maxWidth: '100%',
  },

  heroActions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '20px',
  },

  heroActionsMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
    width: '100%',
    gap: '12px',
  },

  heroActionsCentered: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    flexWrap: 'wrap',
  },

  heroTrustRow: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },

  heroTrustRowMobile: {
    gap: '8px',
  },

  trustPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '9px 12px',
    borderRadius: '999px',
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.08)',
    color: '#666',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.3,
  },

  heroRight: {
    display: 'flex',
    justifyContent: 'center',
    minWidth: 0,
  },

  previewCard: {
    width: '100%',
    maxWidth: '500px',
    background: '#fff',
    borderRadius: '28px',
    border: '1px solid rgba(17,17,17,0.08)',
    boxShadow: '0 24px 60px rgba(17,17,17,0.08)',
    padding: '24px',
    boxSizing: 'border-box',
  },

  previewCardMobile: {
    padding: '18px',
    borderRadius: '22px',
    maxWidth: '100%',
  },

  previewTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
    gap: '12px',
  },

  previewLabel: {
    margin: 0,
    fontSize: '13px',
    color: '#7a7a7a',
    fontWeight: 600,
  },

  previewTitle: {
    margin: '6px 0 0',
    fontSize: '24px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },

  previewTitleMobile: {
    fontSize: '20px',
  },

  livePill: {
    background: '#eff8f0',
    color: '#1f7a35',
    border: '1px solid #dbeedc',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    whiteSpace: 'nowrap',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '14px',
    marginBottom: '18px',
  },

  statCard: {
    background: '#faf8f4',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '18px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    minWidth: 0,
  },

  statLabel: {
    fontSize: '13px',
    color: '#777',
    fontWeight: 600,
  },

  statValue: {
    fontSize: '28px',
    fontWeight: 800,
    letterSpacing: '-0.04em',
  },

  statValueMobile: {
    fontSize: '22px',
  },

  panel: {
    background: '#faf8f4',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '18px',
    padding: '16px',
  },

  panelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
    gap: '8px',
  },

  panelTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#181818',
  },

  panelMeta: {
    fontSize: '12px',
    color: '#7b7b7b',
    fontWeight: 600,
  },

  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0',
    borderBottom: '1px solid rgba(17,17,17,0.06)',
  },

  rowLast: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 0 0',
  },

  rowTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#181818',
  },

  rowSub: {
    marginTop: '4px',
    fontSize: '12px',
    color: '#7d7d7d',
  },

  rowPositive: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#167a3a',
    whiteSpace: 'nowrap',
  },

  rowNegative: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#b42318',
    whiteSpace: 'nowrap',
  },

  stripSection: {
    padding: '8px 32px 28px',
  },

  stripSectionMobile: {
    padding: '0 16px 20px',
  },

  strip: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '24px',
    overflow: 'hidden',
  },

  stripTablet: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },

  stripMobile: {
    gridTemplateColumns: '1fr',
    borderRadius: '20px',
  },

  stripItem: {
    padding: '24px',
    borderRight: '1px solid rgba(17,17,17,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  stripItemNoBorder: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  stripItemMobile: {
    borderRight: 'none',
    borderBottom: '1px solid rgba(17,17,17,0.06)',
    padding: '18px',
  },

  stripTitle: {
    fontSize: '15px',
    fontWeight: 800,
    color: '#161616',
  },

  stripText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: 1.6,
  },

  section: {
    padding: '92px 32px',
  },

  sectionSoft: {
    padding: '92px 32px',
    background: '#fbfaf7',
    borderTop: '1px solid rgba(17,17,17,0.05)',
    borderBottom: '1px solid rgba(17,17,17,0.05)',
  },

  sectionMobile: {
    padding: '56px 16px',
  },

  container: {
    maxWidth: '1240px',
    margin: '0 auto',
  },

  containerNarrow: {
    maxWidth: '1040px',
    margin: '0 auto',
  },

  sectionIntro: {
    maxWidth: '760px',
    margin: '0 auto 54px',
    textAlign: 'center',
  },

  sectionIntroMobile: {
    margin: '0 auto 32px',
  },

  sectionEyebrow: {
    margin: '0 0 12px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#c80815',
  },

  sectionTitle: {
    margin: '0 0 16px',
    fontSize: '46px',
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#141414',
  },

  sectionTitleTablet: {
    fontSize: '38px',
  },

  sectionTitleMobile: {
    fontSize: '30px',
    lineHeight: 1.12,
    margin: '0 0 12px',
  },

  sectionText: {
    margin: 0,
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#5d5d5d',
  },

  sectionTextMobile: {
    fontSize: '15px',
    lineHeight: 1.7,
  },

  compareGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
  },

  compareBad: {
    background: '#fff5f5',
    border: '1px solid rgba(180, 35, 24, 0.12)',
    borderRadius: '24px',
    padding: '28px',
  },

  compareGood: {
    background: '#f3fbf5',
    border: '1px solid rgba(22, 122, 58, 0.12)',
    borderRadius: '24px',
    padding: '28px',
  },

  compareTitle: {
    margin: '0 0 18px',
    fontSize: '24px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },

  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'grid',
    gap: '14px',
  },

  listItem: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: '#444',
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '22px',
  },

  featureCard: {
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 12px 32px rgba(17,17,17,0.04)',
  },

  featureIconWrap: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: '#f8ebe9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '18px',
  },

  featureIcon: {
    fontSize: '22px',
    color: '#c80815',
    fontWeight: 800,
  },

  featureTitle: {
    margin: '0 0 10px',
    fontSize: '21px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#181818',
  },

  featureText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#5f5f5f',
  },

  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '22px',
  },

  stepCard: {
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '24px',
    padding: '28px',
  },

  stepNumber: {
    width: '52px',
    height: '52px',
    borderRadius: '16px',
    background: '#111',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    fontWeight: 800,
    marginBottom: '18px',
  },

  stepTitle: {
    margin: '0 0 10px',
    fontSize: '22px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
  },

  stepText: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#5d5d5d',
  },

  pricingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '24px',
    alignItems: 'stretch',
  },

  pricingCard: {
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '28px',
    padding: '32px',
    boxShadow: '0 12px 32px rgba(17,17,17,0.04)',
  },

  pricingCardFeatured: {
    position: 'relative',
    background: '#c80815',
    color: '#fff',
    border: '1px solid rgba(200, 8, 21, 0.25)',
    borderRadius: '28px',
    padding: '32px',
    boxShadow: '0 18px 40px rgba(200, 8, 21, 0.22)',
  },

  recommendedBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.16)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '16px',
  },

  planName: {
    margin: '0 0 10px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#666',
  },

  planNameDark: {
    margin: '0 0 10px',
    fontSize: '15px',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.82)',
  },

  planPrice: {
    margin: '0 0 10px',
    fontSize: '42px',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#121212',
  },

  planPriceDark: {
    margin: '0 0 10px',
    fontSize: '42px',
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#fff',
  },

  planDesc: {
    margin: '0 0 24px',
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#5d5d5d',
  },

  planDescDark: {
    margin: '0 0 24px',
    fontSize: '15px',
    lineHeight: 1.75,
    color: 'rgba(255,255,255,0.86)',
  },

  planList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px',
    display: 'grid',
    gap: '12px',
  },

  planListDark: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px',
    display: 'grid',
    gap: '12px',
  },

  listItemDark: {
    fontSize: '15px',
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.9)',
  },

  faqGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: '20px',
    textAlign: 'left',
  },

  faqCard: {
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '22px',
    padding: '24px',
    textAlign: 'left',
  },

  faqQuestion: {
    margin: '0 0 10px',
    fontSize: '20px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#171717',
  },

  faqAnswer: {
    margin: 0,
    fontSize: '15px',
    lineHeight: 1.75,
    color: '#5c5c5c',
  },

  finalSection: {
    padding: '92px 32px 110px',
  },

  finalSectionMobile: {
    padding: '56px 16px 72px',
  },

  finalCard: {
    maxWidth: '1040px',
    margin: '0 auto',
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '32px',
    padding: '56px 32px',
    textAlign: 'center',
    boxShadow: '0 18px 42px rgba(17,17,17,0.05)',
  },

  finalCardMobile: {
    padding: '32px 20px',
    borderRadius: '24px',
  },

  finalTitle: {
    margin: '0 0 16px',
    fontSize: '48px',
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#111',
  },

  finalTitleTablet: {
    fontSize: '40px',
  },

  finalTitleMobile: {
    fontSize: '28px',
    lineHeight: 1.15,
  },

  finalText: {
    maxWidth: '720px',
    margin: '0 auto 28px',
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#5e5e5e',
  },

  finalTextMobile: {
    fontSize: '15px',
    margin: '0 auto 20px',
  },

  footer: {
    borderTop: '1px solid rgba(17,17,17,0.06)',
    padding: '28px 32px 48px',
  },

  footerMobile: {
    padding: '24px 16px 32px',
  },

  footerInner: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },

  footerInnerMobile: {
    flexDirection: 'column',
    gap: '16px',
  },

  footerBrand: {
    fontSize: '24px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#161616',
    marginBottom: '10px',
  },

  footerText: {
    margin: 0,
    maxWidth: '420px',
    fontSize: '14px',
    lineHeight: 1.7,
    color: '#666',
  },

  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    flexWrap: 'wrap',
  },

  footerLinksMobile: {
    gap: '12px',
  },

  footerLink: {
    color: '#2a2a2a',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
  },

  singleColumnGrid: {
    gridTemplateColumns: '1fr',
  },

  twoColumnGrid: {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  },
};

export default LandingPage;