import { generatePageMeta } from '@vlp/member-ui'
import FaqItem from '@/components/FaqItem'

export const metadata = generatePageMeta({
  title: 'Tax Tools Arcade — Gamified Tax Education',
  description: 'Learn tax concepts through interactive arcade-style games. Gamified tax education tools for tax professionals.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/',
})

const tools = [
  {
    title: 'IRS Notice Showdown',
    slug: 'irs-notice-showdown',
    description: 'A 10-round drag-and-drop showdown where you match notice excerpts to the correct IRS notice.',
    type: 'Matching',
    tokens: 2,
  },
  {
    title: 'IRS Tax Detective',
    slug: 'irs-tax-detective',
    description: 'Decode IRS transaction codes and solve the mystery of a refund offset in a fast matching game.',
    type: 'Matching',
    tokens: 2,
  },
  {
    title: 'Circular 230 Quest',
    slug: 'circular-230-quest',
    description: 'A zone-based quest through the Treasury rules governing practice before the IRS.',
    type: 'RPG',
    tokens: 5,
  },
  {
    title: 'Tax Mythbusters Quiz',
    slug: 'tax-mythbusters-interactive-quiz',
    description: 'True-or-false quiz that debunks common tax myths with clear explanations.',
    type: 'Quiz',
    tokens: 2,
  },
]

const trustBadges = [
  { label: 'Secure Processing', color: 'cyan' as const,
    icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /> },
  { label: 'Token-Based Pricing', color: 'amber' as const,
    icon: <><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { label: 'Instant Access', color: 'green' as const,
    icon: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></> },
  { label: 'Try Before You Buy', color: 'pink' as const,
    icon: <><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></> },
]

const colorMap = {
  violet: 'text-neon-violet',
  cyan: 'text-neon-cyan',
  pink: 'text-neon-pink',
  green: 'text-neon-green',
  amber: 'text-neon-amber',
} as const

const features = [
  { title: 'Instant Access',          body: 'Start using any tool immediately after token purchase. No onboarding, no setup.',        color: 'green' as const },
  { title: 'Expert-Backed',           body: 'Built on official IRS procedures, transaction code definitions, and form specifications.', color: 'cyan'  as const },
  { title: 'Built for Professionals', body: 'Designed for CPAs, EAs, tax attorneys, and students preparing for their credentials.',    color: 'pink'  as const },
]

const faqs = [
  { q: 'How does token pricing work?',
    a: 'Each game play or form generation costs tokens. Buy 30 tokens for $9, 80 for $19, or 200 for $39. Tokens never expire.' },
  { q: 'Who are these tools built for?',
    a: 'Tax professionals (CPAs, EAs, tax attorneys) and students preparing for IRS-related credentials. The games teach real IRS procedures. The form tools save time on actual filings.' },
  { q: 'Can I try before I buy?',
    a: 'Yes. Most games offer a free demo mode. Form tools show a preview of the output before you spend a token.' },
  { q: 'What do I get after playing a game?',
    a: 'Every game tracks your progress and scoring as you play. Many games include badges, streaks, and achievement levels — and each game explains the underlying tax concept as you go.' },
]

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="arcade-grid-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center relative z-10">
          <span className="arcade-eyebrow animate-neon-pulse mb-6 inline-block">
            ★ Tax Season 2026 Ready ★
          </span>
          <h1 className="font-sora text-5xl md:text-7xl font-bold text-white neon-text-violet leading-tight mb-6">
            Master IRS Procedures<br />
            <span className="bg-gradient-neon bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% auto' }}>
              Through Play
            </span>
          </h1>
          <p className="text-lg md:text-xl text-arcade-text-muted max-w-2xl mx-auto mb-10">
            Interactive games for tax professionals and students. Learn transaction codes,
            IRS notices, deductions, and more — all through play.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="/games" className="arcade-btn arcade-btn-primary">
              Browse Games →
            </a>
            <a href="/pricing" className="arcade-btn arcade-btn-secondary">
              Get Tokens
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {trustBadges.map((b, i) => (
              <div
                key={b.label}
                className="arcade-card-static px-4 py-4 flex items-center gap-3 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
              >
                <svg
                  width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`${colorMap[b.color]} flex-shrink-0`}
                  style={{ filter: `drop-shadow(0 0 8px currentColor)` }}
                >
                  {b.icon}
                </svg>
                <span className="text-sm font-medium text-arcade-text">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-20 px-6 bg-arcade-bg-alt">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="arcade-eyebrow mb-4 inline-block">The Arcade Floor</span>
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-white neon-text-violet mt-4 mb-3">
              Tools &amp; Games
            </h2>
            <p className="text-arcade-text-muted text-lg">
              Everything you need to learn, practice, and work smarter.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((t, i) => (
              <article
                key={t.title}
                className="arcade-card-interactive p-6 flex flex-col animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/30 px-2.5 py-1 rounded-full">
                    {t.type}
                  </span>
                  <span className={`token-badge token-badge-${t.tokens}`}>{t.tokens}t</span>
                </div>
                <h3 className="font-sora text-xl font-bold text-white mb-3">{t.title}</h3>
                <p className="text-sm text-arcade-text-muted leading-relaxed flex-1 mb-6">{t.description}</p>
                <div className="flex gap-3">
                  <a href={`/games/${t.slug}`} className="arcade-btn arcade-btn-primary flex-1">Play Now</a>
                  <a href={`/games/${t.slug}`} className="arcade-btn arcade-btn-cyan">Demo</a>
                </div>
              </article>
            ))}

            {/* Highlight card */}
            <article
              className="arcade-card-interactive p-6 flex flex-col animate-fade-up relative overflow-hidden"
              style={{ animationDelay: '320ms', animationFillMode: 'backwards',
                       background: 'linear-gradient(135deg, rgba(139,92,246,0.18), rgba(236,72,153,0.12))' }}
            >
              <span className="token-badge token-badge-5 self-start mb-4 animate-neon-pulse">★ BEST VALUE</span>
              <h3 className="font-sora text-2xl font-bold text-white neon-text-pink mb-3">Complete Access</h3>
              <p className="text-arcade-text mb-6">200 tokens for $39 — use on any game or tool.</p>
              <a href="/pricing" className="arcade-btn arcade-btn-amber mt-auto">Get Tokens</a>
            </article>
          </div>

          <div className="text-center mt-10">
            <a href="/games" className="arcade-btn arcade-btn-secondary">
              View All 21 Games →
            </a>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="arcade-eyebrow mb-4 inline-block">Why Players Choose Us</span>
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-white neon-text-cyan mt-4">
              Why TaxTools
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="arcade-card p-8 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'backwards' }}
              >
                <div className={`w-2 h-2 rounded-full ${colorMap[f.color]} mb-4`}
                     style={{ background: 'currentColor', boxShadow: '0 0 14px currentColor' }} />
                <h3 className={`font-sora text-xl font-bold mb-2 ${colorMap[f.color]}`}>{f.title}</h3>
                <p className="text-arcade-text-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-arcade-bg-alt">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="arcade-eyebrow mb-4 inline-block">FAQ</span>
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-white neon-text-violet mt-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {faqs.map((f) => (
              <FaqItem key={f.q} question={f.q} answer={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-sora text-4xl md:text-5xl font-bold text-white neon-text-pink">
              Get in Touch
            </h2>
            <p className="text-arcade-text-muted mt-3">We&apos;re here when you need us.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="arcade-card p-6">
              <h3 className="font-sora text-lg font-bold text-neon-cyan mb-3">Email Us</h3>
              <a href="mailto:support@taxtools.taxmonitor.pro" className="text-neon-violet hover:text-neon-pink transition-colors break-all">
                support@taxtools.taxmonitor.pro
              </a>
              <p className="text-sm text-arcade-text-muted mt-3">We typically respond within 24 hours.</p>
            </div>
            <div className="arcade-card p-6">
              <h3 className="font-sora text-lg font-bold text-neon-cyan mb-3">Help Center</h3>
              <p className="text-sm text-arcade-text-muted mb-3">Browse articles and find answers quickly.</p>
              <a href="/contact" className="text-neon-violet hover:text-neon-pink transition-colors">
                Visit Help Center →
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
