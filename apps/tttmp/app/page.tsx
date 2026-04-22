import { generatePageMeta } from '@vlp/member-ui'
import Header from '@/components/Header'
import FaqItem from '@/components/FaqItem'
import styles from './page.module.css'

export const metadata = generatePageMeta({
  title: 'Tax Tools Arcade — Gamified Tax Education',
  description: 'Learn tax concepts through interactive arcade-style games. Gamified tax education tools for tax professionals.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/',
})

const tools = [
  {
    title: 'IRS Notice Showdown',
    description: 'A 10-round drag-and-drop showdown where you match notice excerpts to the correct IRS notice.',
    color: 'amber',
    demo: '/games/irs-notice-showdown',
    play: '/games/irs-notice-showdown',
    playLabel: 'Play Now',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'IRS Tax Detective',
    description: 'Decode IRS transaction codes and solve the mystery of a refund offset in a fast matching game.',
    color: 'amber',
    demo: '/games/irs-tax-detective',
    play: '/games/irs-tax-detective',
    playLabel: 'Play Now',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Circular 230 Quest',
    description: 'A zone-based quest through the Treasury rules governing practice before the IRS.',
    color: 'amber',
    demo: '/games/circular-230-quest',
    play: '/games/circular-230-quest',
    playLabel: 'Play Now',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: 'Tax Mythbusters Quiz',
    description: 'True-or-false quiz that debunks common tax myths with clear explanations.',
    color: 'amber',
    demo: '/games/tax-mythbusters-interactive-quiz',
    play: '/games/tax-mythbusters-interactive-quiz',
    playLabel: 'Play Now',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
]

const trustBadges = [
  {
    label: 'Secure Processing',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: 'Token-Based Pricing',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    label: 'Instant Access',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    label: 'Try Before You Buy',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
]

const features = [
  {
    title: 'Instant Access',
    body: 'Start using any tool immediately after token purchase. No onboarding, no setup.',
  },
  {
    title: 'Expert-Backed',
    body: 'Built on official IRS procedures, transaction code definitions, and form specifications.',
  },
  {
    title: 'Built for Professionals',
    body: 'Designed for CPAs, EAs, tax attorneys, and students preparing for their credentials.',
  },
]

const faqs = [
  {
    q: 'How does token pricing work?',
    a: 'Each game play or form generation costs tokens. Buy 30 tokens for $9, 80 for $19, or 200 for $39. Tokens never expire.',
  },
  {
    q: 'Who are these tools built for?',
    a: 'Tax professionals (CPAs, EAs, tax attorneys) and students preparing for IRS-related credentials. The games teach real IRS procedures. The form tools save time on actual filings.',
  },
  {
    q: 'Can I try before I buy?',
    a: 'Yes. Most games offer a free demo mode. Form tools show a preview of the output before you spend a token.',
  },
  {
    q: 'What do I get after playing a game?',
    a: 'Every game tracks your progress and scoring as you play. Many games include badges, streaks, and achievement levels — and each game explains the underlying tax concept as you go.',
  },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>Tax Season 2026 Ready</span>
            <h1 className={styles.title}>Master IRS Procedures Through Play</h1>
            <p className={styles.subtitle}>
              Interactive games for tax professionals and students. Learn transaction codes,
              IRS notices, deductions, and more — all through play.
            </p>
            <div className={styles.actions}>
              <a href="/games" className={styles.primary}>
                Browse Games
              </a>
              <a href="/pricing" className={styles.secondary}>
                Get Tokens
              </a>
            </div>
          </div>

          {/* Trust badges */}
          <div className={styles.trustRow}>
            {trustBadges.map((b) => (
              <div key={b.label} className={styles.trustBadge}>
                <span className={styles.trustIcon}>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Tools grid */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Tools &amp; Games</h2>
              <p className={styles.sectionSub}>
                Everything you need to learn, practice, and work smarter.
              </p>
            </div>

            <div className={styles.toolsGrid}>
              {tools.map((t) => (
                <article key={t.title} className={styles.toolCard}>
                  <div className={`${styles.toolIcon} ${styles[`icon_${t.color}`]}`}>
                    {t.icon}
                  </div>
                  <h3 className={styles.toolTitle}>{t.title}</h3>
                  <p className={styles.toolDesc}>{t.description}</p>
                  <div className={styles.toolActions}>
                    <a href={t.demo} className={styles.toolSecondary}>
                      {t.color === 'amber' ? 'Try Demo' : 'Preview'}
                    </a>
                    <a href={t.play} className={styles.toolPrimary}>
                      {t.playLabel}
                    </a>
                  </div>
                </article>
              ))}

              {/* Highlight card */}
              <article className={`${styles.toolCard} ${styles.highlightCard}`}>
                <span className={styles.highlightBadge}>BEST VALUE</span>
                <h3 className={styles.highlightTitle}>Complete Access</h3>
                <p className={styles.highlightDesc}>
                  200 tokens for $39 — use on any game or tool.
                </p>
                <a href="/pricing" className={styles.highlightCta}>
                  Get Tokens
                </a>
              </article>
            </div>
          </div>
        </section>

        {/* About / Why */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Why TaxTools</h2>
              <p className={styles.sectionSub}>
                Purpose-built for the people who do tax work for a living.
              </p>
            </div>
            <div className={styles.featuresGrid}>
              {features.map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <h3 className={styles.featureTitle}>{f.title}</h3>
                  <p className={styles.featureBody}>{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={styles.sectionAlt}>
          <div className={styles.sectionInnerNarrow}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
              <p className={styles.sectionSub}>Answers to the things people ask most.</p>
            </div>
            <div className={styles.faqList}>
              {faqs.map((f) => (
                <FaqItem key={f.q} question={f.q} answer={f.a} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              <p className={styles.sectionSub}>We&apos;re here when you need us.</p>
            </div>
            <div className={styles.contactGrid}>
              <div className={styles.contactCard}>
                <h3 className={styles.contactTitle}>Email Us</h3>
                <a href="mailto:support@taxtools.taxmonitor.pro" className={styles.contactLink}>
                  support@taxtools.taxmonitor.pro
                </a>
                <p className={styles.contactBody}>We typically respond within 24 hours.</p>
              </div>
              <div className={styles.contactCard}>
                <h3 className={styles.contactTitle}>Help Center</h3>
                <p className={styles.contactBody}>Browse articles and find answers quickly.</p>
                <a href="/support" className={styles.contactLink}>
                  Visit Help Center →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerInner}>
            <div className={styles.footerTop}>
              <div className={styles.footerBrand}>
                <span className={styles.footerLogo}>🪙</span>
                <span className={styles.footerBrandName}>TaxTools</span>
              </div>
              <nav className={styles.footerNav} aria-label="Quick links">
                <span className={styles.footerNavTitle}>Explore</span>
                <a href="/">Home</a>
                <a href="/games">Games</a>
                <a href="/vesperi">Game Guide</a>
                <a href="/pricing">Pricing</a>
                <a href="/support">Support</a>
              </nav>
              <nav className={styles.footerNav} aria-label="Legal">
                <span className={styles.footerNavTitle}>Legal</span>
                <a href="/legal/privacy">Privacy Policy</a>
                <a href="/legal/terms">Terms</a>
              </nav>
            </div>
            <div className={styles.footerBottom}>
              © 2026 Tax Tools Arcade. Part of the VirtualLaunch.pro ecosystem. Not tax advice.
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
