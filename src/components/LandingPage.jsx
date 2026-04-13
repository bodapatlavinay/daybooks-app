import { Link } from 'react-router-dom';

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

export default function LandingPage() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brandWrap}>
          <div style={styles.logoBadge}>D</div>
          <div>
            <div style={styles.logo}>DayBooks</div>
            <p style={styles.tagline}>Daily shop ledger for small service businesses</p>
          </div>
        </div>

        <nav style={styles.nav}>
          <a href="#features" style={styles.navLink}>Features</a>
          <a href="#how-it-works" style={styles.navLink}>How it works</a>
          <a href="#pricing" style={styles.navLink}>Pricing</a>
          <a href="#faq" style={styles.navLink}>FAQ</a>
        </nav>

        <div style={styles.headerActions}>
          <Link to="/app" style={styles.secondaryButton}>
            Login
          </Link>
          <Link to="/app" style={styles.primaryButton}>
            Start Free
          </Link>
        </div>
      </header>

      <main>
        <section style={styles.heroSection}>
          <div style={styles.heroInner}>
            <div style={styles.heroLeft}>
              <div style={styles.eyebrow}>
                Built for tire shops, garages, and small service businesses
              </div>

              <h1 style={styles.heroTitle}>
                A cleaner way to track your shop’s daily income, expenses, and profit.
              </h1>

              <p style={styles.heroText}>
                DayBooks helps shop owners replace notebooks and scattered records with one simple system
                for daily operations, service tracking, and clear profit visibility.
              </p>

              <div style={styles.heroActions}>
                <Link to="/app" style={styles.primaryButtonLarge}>
                  Create Free Account
                </Link>
                <a href="#pricing" style={styles.secondaryButtonLarge}>
                  View Pricing
                </a>
              </div>

              <div style={styles.heroTrustRow}>
                <span style={styles.trustPill}>No credit card required</span>
                <span style={styles.trustPill}>Set up in minutes</span>
                <span style={styles.trustPill}>Simple daily workflow</span>
              </div>
            </div>

            <div style={styles.heroRight}>
              <div style={styles.previewCard}>
                <div style={styles.previewTop}>
                  <div>
                    <p style={styles.previewLabel}>Today</p>
                    <h3 style={styles.previewTitle}>Shop Summary</h3>
                  </div>
                  <span style={styles.livePill}>Live</span>
                </div>

                <div style={styles.statsGrid}>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Income</span>
                    <strong style={styles.statValue}>$1,240</strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Expenses</span>
                    <strong style={styles.statValue}>$420</strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Profit</span>
                    <strong style={styles.statValue}>$820</strong>
                  </div>
                  <div style={styles.statCard}>
                    <span style={styles.statLabel}>Entries</span>
                    <strong style={styles.statValue}>12</strong>
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

        <section style={styles.stripSection}>
          <div style={styles.strip}>
            <div style={styles.stripItem}>
              <strong style={styles.stripTitle}>Daily entries</strong>
              <span style={styles.stripText}>Capture sales and expenses as they happen</span>
            </div>
            <div style={styles.stripItem}>
              <strong style={styles.stripTitle}>Clear totals</strong>
              <span style={styles.stripText}>Know what came in, what went out, and what remains</span>
            </div>
            <div style={styles.stripItem}>
              <strong style={styles.stripTitle}>Shop-friendly workflow</strong>
              <span style={styles.stripText}>Simple enough for real daily operations</span>
            </div>
            <div style={styles.stripItemNoBorder}>
              <strong style={styles.stripTitle}>Built for owners</strong>
              <span style={styles.stripText}>Made to reduce confusion, not add more work</span>
            </div>
          </div>
        </section>

        <section style={styles.sectionSoft}>
          <div style={styles.containerNarrow}>
            <div style={styles.sectionIntro}>
              <p style={styles.sectionEyebrow}>Why DayBooks</p>
              <h2 style={styles.sectionTitle}>Stop depending on notebooks and memory</h2>
              <p style={styles.sectionText}>
                Small shops usually do not need bulky accounting software for daily tracking.
                They need one practical place to record work, expenses, and profit clearly.
              </p>
            </div>

            <div style={styles.compareGrid}>
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

        <section id="features" style={styles.section}>
          <div style={styles.container}>
            <div style={styles.sectionIntro}>
              <p style={styles.sectionEyebrow}>Features</p>
              <h2 style={styles.sectionTitle}>Built for the way small shops actually work</h2>
              <p style={styles.sectionText}>
                DayBooks focuses on daily clarity, fast entry, and records that are easy to review.
              </p>
            </div>

            <div style={styles.featureGrid}>
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

        <section id="how-it-works" style={styles.sectionSoft}>
          <div style={styles.container}>
            <div style={styles.sectionIntro}>
              <p style={styles.sectionEyebrow}>How it works</p>
              <h2 style={styles.sectionTitle}>Simple from the first day</h2>
            </div>

            <div style={styles.stepsGrid}>
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

        <section id="pricing" style={styles.section}>
          <div style={styles.containerNarrow}>
            <div style={styles.sectionIntro}>
              <p style={styles.sectionEyebrow}>Pricing</p>
              <h2 style={styles.sectionTitle}>Simple pricing for growing shops</h2>
              <p style={styles.sectionText}>
                Start with a basic setup today and expand as the product grows.
              </p>
            </div>

            <div style={styles.pricingGrid}>
              <div style={styles.pricingCard}>
                <p style={styles.planName}>Starter</p>
                <h3 style={styles.planPrice}>Free</h3>
                <p style={styles.planDesc}>
                  For owners who want a simple way to get organized.
                </p>

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

        <section id="faq" style={styles.sectionSoft}>
          <div style={styles.containerNarrow}>
            <div style={styles.sectionIntro}>
              <p style={styles.sectionEyebrow}>FAQ</p>
              <h2 style={styles.sectionTitle}>Common questions</h2>
            </div>

            <div style={styles.faqGrid}>
              {faqs.map((faq) => (
                <div key={faq.question} style={styles.faqCard}>
                  <h3 style={styles.faqQuestion}>{faq.question}</h3>
                  <p style={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={styles.finalSection}>
          <div style={styles.finalCard}>
            <p style={styles.sectionEyebrow}>Get started</p>
            <h2 style={styles.finalTitle}>Bring more order to your daily shop records.</h2>
            <p style={styles.finalText}>
              Use a system that helps your business stay clear, organized, and easier to manage.
            </p>

            <div style={styles.heroActionsCentered}>
              <Link to="/app" style={styles.primaryButtonLarge}>
                Create Free Account
              </Link>
              <Link to="/app" style={styles.secondaryButtonLarge}>
                Login
              </Link>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          <div style={styles.footerInner}>
            <div>
              <div style={styles.footerBrand}>DayBooks</div>
              <p style={styles.footerText}>
                Daily shop ledger for tire shops, garages, and small service businesses.
              </p>
            </div>

            <div style={styles.footerLinks}>
              <a href="#features" style={styles.footerLink}>Features</a>
              <a href="#pricing" style={styles.footerLink}>Pricing</a>
              <a href="#faq" style={styles.footerLink}>FAQ</a>
              <Link to="/app" style={styles.footerLink}>Login</Link>
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

  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  logoBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    background: '#c80815',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '20px',
    boxShadow: '0 12px 24px rgba(200, 8, 21, 0.18)',
  },

  logo: {
    fontSize: '30px',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1,
  },

  tagline: {
    marginTop: '5px',
    color: '#666',
    fontSize: '14px',
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '26px',
    flexWrap: 'wrap',
  },

  navLink: {
    color: '#2a2a2a',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '15px',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
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
  },

  heroSection: {
    padding: '56px 32px 32px',
  },

  heroInner: {
    maxWidth: '1240px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '36px',
    alignItems: 'center',
  },

  heroLeft: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
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
  },

  heroTitle: {
    margin: '0 0 18px',
    fontSize: '64px',
    lineHeight: 0.98,
    fontWeight: 800,
    letterSpacing: '-0.05em',
    maxWidth: '720px',
  },

  heroText: {
    margin: '0 0 28px',
    fontSize: '21px',
    lineHeight: 1.65,
    color: '#4d4d4d',
    maxWidth: '680px',
  },

  heroActions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '20px',
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
  },

  heroRight: {
    display: 'flex',
    justifyContent: 'center',
  },

  previewCard: {
    width: '100%',
    maxWidth: '500px',
    background: '#fff',
    borderRadius: '28px',
    border: '1px solid rgba(17,17,17,0.08)',
    boxShadow: '0 24px 60px rgba(17,17,17,0.08)',
    padding: '24px',
  },

  previewTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '18px',
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

  livePill: {
    background: '#eff8f0',
    color: '#1f7a35',
    border: '1px solid #dbeedc',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
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
  },

  rowNegative: {
    fontSize: '14px',
    fontWeight: 800,
    color: '#b42318',
  },

  stripSection: {
    padding: '8px 32px 28px',
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

  sectionText: {
    margin: 0,
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#5d5d5d',
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
  },

  faqCard: {
    background: '#fff',
    border: '1px solid rgba(17,17,17,0.06)',
    borderRadius: '22px',
    padding: '24px',
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

  finalTitle: {
    margin: '0 0 16px',
    fontSize: '48px',
    lineHeight: 1.05,
    fontWeight: 800,
    letterSpacing: '-0.04em',
    color: '#111',
  },

  finalText: {
    maxWidth: '720px',
    margin: '0 auto 28px',
    fontSize: '18px',
    lineHeight: 1.75,
    color: '#5e5e5e',
  },

  footer: {
    borderTop: '1px solid rgba(17,17,17,0.06)',
    padding: '28px 32px 48px',
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

  footerLink: {
    color: '#2a2a2a',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '14px',
  },
};