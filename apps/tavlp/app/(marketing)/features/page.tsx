import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features | Tax Avatar Pro',
  description:
    'Tax Avatar Pro is a fully managed AI YouTube channel for tax pros — custom avatar, IRS code scripts, branded channel setup, weekly publishing, and a lead pipeline into your TaxClaim Pro intake page.',
}

const coreFeatures = [
  {
    title: 'Custom AI Avatar',
    items: [
      'Your avatar, generated from a single photo or chosen from our library of 6 proven presenters.',
      'Multiple looks per avatar (12–57 depending on selection).',
      'Professional backgrounds, perfect lighting, zero camera time.',
    ],
  },
  {
    title: 'IRS Code Explainer Scripts',
    items: [
      'Researched, accurate content covering codes taxpayers search: 150, 810, 826, 971.',
      'Script variants to differentiate your channel.',
      'Kwong v. US penalty abatement content included.',
    ],
  },
  {
    title: 'Branded Channel Setup',
    items: [
      'Your firm name, logo, and colors.',
      'Channel art, descriptions, and SEO configured.',
      'Linked to your TaxClaim Pro branded intake page.',
    ],
  },
  {
    title: 'Weekly Publishing',
    items: [
      'Consistent schedule — Shorts and long-form.',
      'Thumbnails, descriptions, tags included.',
      'Published on your behalf — you review and approve.',
    ],
  },
  {
    title: 'Lead Generation Pipeline',
    items: [
      'Every video CTA drives to your branded intake page.',
      'Taxpayers self-serve Form 843.',
      'Email notifications when a lead comes in.',
    ],
  },
  {
    title: 'Review & Approve Workflow',
    items: [
      'See every video before it goes live.',
      'Approve or request changes.',
      'You stay in control without doing the work.',
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] w-full px-6 md:px-8 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <span className="text-sm text-text-muted">Fully managed. You don&apos;t touch the software.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            Everything you need.{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Nothing you have to learn.
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Tax Avatar Pro is a fully managed service. You don&apos;t touch video software, thumbnail editors, or YouTube Studio. We handle all of it.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="/#start" className="inline-block rounded-lg bg-gradient-to-br from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg transition-all hover:shadow-xl hover:scale-105">
              Get Your Avatar Channel →
            </a>
            <a href="/how-it-works" className="inline-block rounded-lg border border-subtle bg-surface-card px-8 py-4 text-lg font-semibold text-text-primary transition-all hover:bg-surface-elevated">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* Core features grid */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">WHAT&apos;S INCLUDED</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl text-text-primary">A YouTube channel without the YouTube workload</h2>
            <p className="mx-auto mt-6 max-w-3xl text-base text-text-muted md:text-lg">
              Six things we deliver every month so your practice has a marketing engine that runs without your time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coreFeatures.map((f) => (
              <div key={f.title} className="rounded-2xl border border-subtle bg-surface-card p-8 shadow-md">
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

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Ready to delegate your YouTube channel?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            $29/mo as an add-on to TaxClaim Pro. Combined: $39/mo for a fully managed marketing engine and Form 843 toolkit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/#start" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
              Get Your Avatar Channel →
            </a>
            <a href="https://cal.com/tax-monitor-pro/tax-avatar-virtual-launch-pro" className="bg-surface-elevated hover:bg-surface-card text-text-primary font-semibold px-10 py-4 rounded-xl text-lg border border-subtle transition-all">
              Book a 15-min intro call →
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
