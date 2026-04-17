const coreFeatures = [
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      </svg>
    ),
    title: 'Automated Form 843',
    items: [
      'Enter penalty data, transcript info, and client details. Form 843 preparation guide generated in seconds.',
      'Auto-populated fields match the official IRS form for easy transcription.',
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Kwong Eligibility Check',
    items: [
      'Built-in eligibility logic flags which clients have penalty assessments in the Kwong window (Jan 2020 – July 2023).',
      'Screen your client list before the July 10, 2026 deadline without pulling every transcript by hand.',
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5" />
      </svg>
    ),
    title: 'Branded Client Pages',
    items: [
      'Your firm name, logo, and brand on client intake pages. Not a generic TaxClaim Pro page — your practice front.',
      'One click to setup. Clients submit Kwong claim data directly to your dashboard.',
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Transcript Parsing',
    items: [
      'Upload IRS transcripts and TaxClaim Pro extracts penalty data automatically.',
      'No more line-by-line reading. Parsed output feeds directly into Form 843 prep.',
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    title: 'Bulk Processing',
    items: [
      'Work through multiple Kwong-eligible clients in one sitting. Pre-fills carry across similar cases.',
      'A firm with 50 eligible clients can complete prep guides in a single afternoon.',
    ],
  },
  {
    icon: (
      <svg className="h-6 w-6 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Submission Tracking',
    items: [
      'Dashboard view of every Form 843 generated, with date, client, and penalty amount.',
      'Track what you mailed, when, and reference past submissions with one click.',
    ],
  },
]

const audiences = [
  {
    title: 'Solo CPAs and EAs',
    body: 'Work Kwong-eligible clients without hiring staff or building custom intake systems. TaxClaim Pro scales with you.',
  },
  {
    title: 'Small tax firms',
    body: 'Equip your team with shared branded intake pages, shared Form 843 generation, and a shared dashboard of active cases.',
  },
  {
    title: 'Growing practices',
    body: 'Turn Kwong penalty abatement into a revenue stream before the window closes. Automated tooling means more clients per hour of pro time.',
  },
]

const benefits = [
  { label: 'Save Time', body: '30 minutes of manual Form 843 prep becomes 5 minutes with TaxClaim Pro automation.' },
  { label: 'Recover Penalties', body: 'Your clients see the money they paid in penalties from 2020-2023 refunded by the IRS.' },
  { label: 'Retain Clients', body: 'Firms that work Kwong claims for existing clients generate goodwill and deepen relationships.' },
  { label: 'Grow Ready', body: 'Subscription scales with your practice. No per-filing fees. No volume surprises.' },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-text-muted">Built for Form 843 penalty abatement at scale.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            Platform{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Features
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Form 843 penalty abatement is tedious when done by hand. TaxClaim Pro automates the preparation, eligibility check, client intake, and submission tracking so you can work Kwong claims at scale before the July 2026 deadline.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/pricing" className="inline-block rounded-lg bg-gradient-to-br from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg transition-all duration-fast hover:shadow-xl hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus">
              View pricing →
            </a>
            <a href="/how-it-works" className="inline-block rounded-lg border border-subtle bg-surface-card px-8 py-4 text-lg font-semibold text-text-primary transition-all duration-fast hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Core features grid */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">WHY TAX PROS CHOOSE TAXCLAIM PRO</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl text-text-primary">Automate the paperwork, focus on the clients</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base text-text-muted md:text-lg">
              Every feature is built around one goal: turn 30 minutes of manual Form 843 prep into 5 minutes of review-and-sign. Built specifically for the Kwong v. US penalty abatement window.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-subtle bg-surface-card p-8 shadow-md">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-subtle bg-surface-bg">
                  {f.icon}
                </div>
                <h3 className="text-lg font-extrabold mb-4 text-text-primary">{f.title}</h3>
                <ul className="space-y-3 text-sm text-text-muted">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits bar */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[77.5rem] px-4 py-14 md:py-16">
          <div className="rounded-2xl bg-brand-primary px-6 py-10 shadow-lg md:px-10 md:py-14">
            <div className="grid gap-10 text-center md:grid-cols-4 md:gap-8">
              {benefits.map((b) => (
                <div key={b.label}>
                  <div className="text-lg font-extrabold text-brand-text-on-primary">{b.label}</div>
                  <p className="mx-auto mt-3 max-w-xs text-sm text-brand-text-on-primary opacity-90">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="border-t border-subtle bg-surface-card">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-14">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">WHO TAXCLAIM PRO IS FOR</p>
            <h2 className="mt-4 text-4xl font-extrabold text-text-primary md:text-5xl">Built for tax pros working Kwong claims</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-text-muted">
              Whether you are a solo CPA, a small firm, or a growing practice, TaxClaim Pro scales with your Kwong workload through the July 2026 deadline.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {audiences.map((a) => (
              <div key={a.title} className="rounded-2xl border-2 border-brand-primary/50 bg-brand-primary/10 p-8 shadow-md backdrop-blur-sm">
                <h3 className="text-lg font-extrabold text-text-primary mb-3">{a.title}</h3>
                <p className="text-sm text-text-muted">{a.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <a href="/pricing" className="rounded-xl bg-brand-primary px-8 py-4 text-sm font-extrabold text-brand-text-on-primary hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus">
              Choose a plan
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Ready to work Kwong claims at scale?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Start a subscription today, configure your branded client page, and begin processing Form 843 preparations before the Kwong window closes.
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
