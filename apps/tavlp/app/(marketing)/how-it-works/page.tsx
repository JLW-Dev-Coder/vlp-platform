import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How It Works | Tax Avatar Pro',
  description:
    'Photo in. Leads out. Four steps to a fully managed AI YouTube channel for your tax practice — choose your avatar, we build the channel, your avatar publishes weekly, leads land on your dashboard.',
}

const steps = [
  {
    n: 1,
    title: 'Choose your avatar',
    items: [
      'Pick from 6 proven AI presenters or request a custom avatar from your photo.',
      'Each avatar has multiple looks (12–57) for visual variety.',
    ],
    cta: { label: 'Browse the roster →', href: '/avatars' },
  },
  {
    n: 2,
    title: 'We build your channel',
    items: [
      'Branded to your firm — name, logo, colors.',
      'Content calendar planned: IRS code explainers your clients search for.',
      'Channel art, descriptions, SEO — all configured.',
    ],
  },
  {
    n: 3,
    title: 'Your avatar publishes weekly',
    items: [
      'Shorts and long-form on a consistent schedule.',
      'Every video ends with your CTA driving to your TaxClaim Pro intake page.',
      'Thumbnails, descriptions, and tags included.',
      'You review and approve before anything goes live.',
    ],
  },
  {
    n: 4,
    title: 'Leads land on your dashboard',
    items: [
      'Taxpayers self-serve the intake on your branded claim page.',
      'Form 843 generates automatically.',
      'You get notified via email.',
      'Review, sign, mail — that&apos;s your entire workflow.',
    ],
  },
]

const timeline = [
  { when: 'Day 0', what: 'Submit intake form' },
  { when: 'Day 1–3', what: 'Avatar selected, channel built, first videos produced' },
  { when: 'Day 3', what: 'You review and approve' },
  { when: 'Day 7+', what: 'Channel ownership transferred to you' },
  { when: 'Ongoing', what: 'Weekly publishing, you review and approve' },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] w-full px-6 md:px-8 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <span className="text-sm text-text-muted">Four steps. One decision.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            Photo in.{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Leads out.
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Four steps. One decision — which avatar represents your practice.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="grid gap-6 md:gap-8 max-w-4xl mx-auto">
            {steps.map((step) => (
              <div key={step.n} className="rounded-2xl border border-subtle bg-surface-card p-8 md:p-10 shadow-md">
                <div className="flex items-start gap-5">
                  <div className="shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary font-extrabold text-lg">
                    {step.n}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-extrabold text-text-primary mb-4">{step.title}</h3>
                    <ul className="space-y-3 text-base text-text-muted">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-brand-primary shrink-0" aria-hidden="true" />
                          <span dangerouslySetInnerHTML={{ __html: item }} />
                        </li>
                      ))}
                    </ul>
                    {step.cta && (
                      <a href={step.cta.href} className="inline-block mt-5 text-brand-primary hover:underline font-semibold text-sm">
                        {step.cta.label}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-subtle bg-surface-card">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold tracking-widest text-brand-primary text-center">TIMELINE</p>
            <h2 className="mt-3 mb-10 text-4xl font-extrabold md:text-5xl text-text-primary text-center">From submit to live in a week</h2>
            <div className="rounded-2xl border border-subtle bg-surface-bg p-6 md:p-8 shadow-md">
              <ul className="divide-y divide-subtle">
                {timeline.map((row) => (
                  <li key={row.when} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 py-4 first:pt-0 last:pb-0">
                    <span className="text-sm font-extrabold text-brand-primary tracking-wide w-32 shrink-0">{row.when}</span>
                    <span className="text-text-muted">{row.what}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Ready to start?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Choose your avatar. We&apos;ll handle the channel.
          </p>
          <a href="/#start" className="inline-block bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
            Get Started — Choose Your Avatar →
          </a>
        </div>
      </section>
    </div>
  )
}
