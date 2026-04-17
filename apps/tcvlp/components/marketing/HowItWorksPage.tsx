const offers = [
  {
    title: 'Form 843 automation',
    body: 'Enter penalty data, client details, and transcript info. TaxClaim Pro generates a Form 843 preparation guide automatically, with IRS-aligned formatting.',
    icon: (
      <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
  },
  {
    title: 'Kwong eligibility built in',
    body: 'Built-in logic identifies which clients had penalty assessments in the Kwong window (Jan 2020 – July 2023), so you know who qualifies for refund claims before July 10, 2026.',
    icon: (
      <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Branded client intake',
    body: 'Your firm name, logo, and brand on the client-facing intake page. Clients submit Kwong claim data directly to your dashboard without leaving your practice front.',
    icon: (
      <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM8 10h8M8 14h5" />
      </svg>
    ),
  },
  {
    title: 'Transcript parsing',
    body: 'Upload an IRS transcript and TaxClaim Pro extracts penalty data, dates, and amounts. No more reading line-by-line. Parsed output feeds straight into Form 843 prep.',
    icon: (
      <svg className="h-5 w-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
]

const steps = [
  {
    n: 1,
    title: 'Subscribe to a tier',
    body: 'Choose Starter ($10), Professional ($29), or Firm ($79). Monthly billing via Stripe. Cancel anytime. Your first branded page is live within 5 minutes.',
  },
  {
    n: 2,
    title: 'Configure your branded page',
    body: 'Add your firm name, logo, and brand colors. Your client intake page goes live at your custom subdomain. No developer required.',
  },
  {
    n: 3,
    title: 'Intake Kwong-eligible clients',
    body: 'Clients visit your branded page, enter their information, and upload transcripts. You see every submission in your TaxClaim Pro dashboard.',
  },
  {
    n: 4,
    title: 'Generate Form 843 and file',
    body: 'Click "Generate" on any submission. TaxClaim Pro produces a Form 843 preparation guide. Transfer to the official IRS form, sign, and mail before July 10, 2026.',
  },
]

const tiers = [
  {
    name: 'Starter',
    badge: 'Solo practitioners',
    featured: false,
    price: '$10',
    priceSub: 'per month',
    body: 'A starting level for solo CPAs and EAs who want TaxClaim Pro access with lighter monthly volume.',
    items: [
      'Form 843 prep guides',
      'Branded client page',
      'Kwong eligibility checker',
      'Transcript parsing',
    ],
  },
  {
    name: 'Professional',
    badge: 'Most popular',
    featured: true,
    price: '$29',
    priceSub: 'per month',
    body: 'The standard tier for most tax professionals working Kwong claims actively. Higher volume limits and priority support.',
    items: [
      'Everything in Starter',
      'Unlimited client pages',
      'Priority generation',
      'Bulk CSV import (TTMP)',
      'Transcript integrations (TTMP)',
    ],
  },
  {
    name: 'Firm',
    badge: 'Multi-user',
    featured: false,
    price: '$79',
    priceSub: 'per month',
    body: 'Built for firms with multiple professionals and higher client volumes through the Kwong window.',
    items: [
      'Everything in Professional',
      'Multi-pro dashboard access',
      'API access',
      'Dedicated support (tier 3)',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-text-muted">Subscribe, configure, intake, file. Four steps from signup to mailing Form 843.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            How It{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Works
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            From subscription to mailed Form 843. The process is short, the tooling does the heavy lifting, and your first branded client page goes live in five minutes.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#how-it-works" className="inline-block rounded-lg bg-gradient-to-br from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg transition-all duration-fast hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus">
              See how it works →
            </a>
            <a href="/pricing" className="inline-block rounded-lg border border-subtle bg-surface-card px-8 py-4 text-lg font-semibold text-text-primary transition-all duration-fast hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus">
              View pricing
            </a>
          </div>
        </div>
      </section>

      {/* What TCVLP offers */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl text-text-primary">
              What TaxClaim Pro{' '}
              <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">Offers</span>
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-text-muted">
              Four capabilities that together turn manual Form 843 prep into a repeatable, scalable workflow.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {offers.map((o) => (
              <div key={o.title} className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                  {o.icon}
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold text-text-primary">{o.title}</h3>
                  <p className="text-text-muted">{o.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-step */}
      <section className="border-t border-subtle bg-surface-card scroll-mt-16" id="how-it-works">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold md:text-5xl text-text-primary">
              The{' '}
              <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">4 Steps</span>
            </h2>
            <p className="text-xl text-text-muted">
              From subscription to mailed Form 843.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.n}>
                <div className="flex items-start gap-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-gradient-to text-xl font-bold text-brand-text-on-primary">
                    {s.n}
                  </div>
                  <div className="pt-2">
                    <h3 className="mb-2 text-xl font-semibold text-text-primary">{s.title}</h3>
                    <p className="text-text-muted">{s.body}</p>
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className="ml-7 mt-2 h-8 w-px bg-subtle" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription tiers */}
      <section className="border-t border-subtle" id="tiers">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">SUBSCRIPTION TIERS</p>
            <h2 className="mt-4 text-4xl font-extrabold md:text-5xl text-text-primary">Pick the tier that fits your practice</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted">
              Monthly subscriptions. Cancel anytime. Each tier unlocks more capacity and features.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <article
                key={t.name}
                className={`rounded-2xl p-8 shadow-lg ${
                  t.featured
                    ? 'border-2 border-brand-primary/70 bg-gradient-to-b from-surface-elevated to-surface-card'
                    : 'border border-subtle bg-surface-card'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-extrabold text-text-primary">{t.name}</div>
                  <span className={`rounded-full px-3 py-1 text-xs ${t.featured ? 'border border-brand-primary/40 bg-brand-primary/10 text-text-primary' : 'border border-subtle bg-surface-bg text-text-muted'}`}>
                    {t.badge}
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-text-primary">{t.price}</span>
                  <span className="text-sm text-text-muted">{t.priceSub}</span>
                </div>
                <p className="mt-5 text-sm text-text-muted mb-6">{t.body}</p>
                <ul className="space-y-3 text-sm text-text-muted">
                  {t.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <a href="/pricing" className="inline-block rounded-lg bg-gradient-to-br from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg transition-all duration-fast hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus">
              View full pricing →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Ready to get started?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Subscribe today, configure your branded page, and start working Kwong claims before the July 2026 deadline.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl focus-visible:outline-none focus-visible:shadow-focus">
              See Pricing
            </a>
            <a href="/contact" className="bg-surface-elevated hover:bg-surface-card text-text-primary font-semibold px-10 py-4 rounded-xl text-lg border border-subtle transition-all focus-visible:outline-none focus-visible:shadow-focus">
              Contact Us
            </a>
          </div>
          <p className="text-text-muted text-sm mt-8">Subscribe monthly • File systematically • Repeat until July 2026</p>
        </div>
      </section>
    </div>
  )
}
