import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Tax Avatar Pro',
  description:
    'Why Tax Avatar Pro exists: 400,000 CPAs left the industry in 5 years. Tax pros need YouTube but can’t justify the time. We delegate the channel to an AI avatar.',
}

const problems = [
  { title: '400,000 CPAs left in 5 years', body: 'The talent shortage is permanent. Tax pros are drowning in $40/hr work because they can’t find staff to take it.' },
  { title: '50% of remaining CPAs retire within 7 years', body: 'The pipeline isn’t replacing them. Practices that build authority now will absorb the demand later.' },
  { title: 'YouTube takes 3–5 hours per video', body: 'Tax pros know they need a channel — but they can’t justify the camera time when billable hours pay better.' },
  { title: 'Competitors are publishing while you serve clients', body: 'Authority compounds. Every month without content is a month of ground given up.' },
]

const solutions = [
  { title: 'AI avatar replaces camera time', body: 'Same content quality, zero hours of you on camera.' },
  { title: 'Proven scripts on IRS codes taxpayers search', body: 'Codes 150, 810, 826, 971 — Kwong v. US penalty content — already researched and ready.' },
  { title: '$29/mo flat', body: 'Less than the cost of a single freelancer video. Predictable. No per-asset surprises.' },
  { title: 'Delegated end-to-end', body: 'You don’t open YouTube Studio. We post. You review and approve.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      {/* Hero */}
      <section className="mx-auto max-w-[1280px] w-full px-6 md:px-8 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-brand-primary" aria-hidden="true" />
            <span className="text-sm text-text-muted">Built for the post-CPA-shortage tax practice.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            400,000 CPAs left.{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Your YouTube channel shouldn&apos;t have to.
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            The CPA shortage is real. Tax pros are drowning in $40/hr work because they can&apos;t find staff. TAVLP exists because your marketing shouldn&apos;t require your time — it should run itself.
          </p>
        </div>
      </section>

      {/* The problem */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">THE PROBLEM</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl text-text-primary">The numbers don&apos;t favor solo practices</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {problems.map((p) => (
              <div key={p.title} className="rounded-2xl border border-subtle bg-surface-card p-8 shadow-md">
                <h3 className="text-lg font-extrabold text-text-primary mb-3">{p.title}</h3>
                <p className="text-sm text-text-muted">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The solution */}
      <section className="border-t border-subtle bg-surface-card">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">THE SOLUTION</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl text-text-primary">Delegate the channel. Keep the practice.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-base text-text-muted md:text-lg">
              Tax Avatar Pro delegates your YouTube marketing to an AI avatar — same content quality, zero camera time.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map((s) => (
              <div key={s.title} className="rounded-2xl border-2 border-brand-primary/40 bg-brand-primary/10 p-8 shadow-md">
                <h3 className="text-lg font-extrabold text-text-primary mb-3">{s.title}</h3>
                <p className="text-sm text-text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who built this */}
      <section className="border-t border-subtle">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold tracking-widest text-brand-primary text-center">WHO BUILT THIS</p>
            <h2 className="mt-3 mb-8 text-4xl font-extrabold md:text-5xl text-text-primary text-center">Built by a tax pro for tax pros</h2>
            <div className="rounded-2xl border border-subtle bg-surface-card p-8 md:p-10 shadow-md space-y-4 text-text-muted">
              <p>
                <strong className="text-text-primary">Jamie L. Williams, EA, CB, OTC</strong> — founder of the VLP ecosystem. Nine platforms serving tax professionals, all built around one observation: tax pros are time-constrained, not idea-constrained.
              </p>
              <p>
                The Kwong v. US campaign runs April 28 – July 10, 2026. Tax Avatar Pro is the channel-side of the same play: keep the marketing running while you work the cases.
              </p>
              <p>
                <a href="https://www.linkedin.com/in/virtuallaunchpro/" target="_blank" rel="noreferrer" className="text-brand-primary hover:underline">Connect on LinkedIn →</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The ecosystem */}
      <section className="border-t border-subtle bg-surface-card">
        <div className="mx-auto max-w-[1280px] w-full px-6 md:px-8 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold tracking-widest text-brand-primary">THE ECOSYSTEM</p>
            <h2 className="mt-3 mb-6 text-4xl font-extrabold md:text-5xl text-text-primary">The 9th platform — and the one that solves marketing</h2>
            <p className="mb-4 text-text-muted">
              <strong className="text-text-primary">TaxClaim Pro</strong> automates Form 843 penalty abatement. <strong className="text-text-primary">Tax Transcript AI</strong> parses IRS transcripts in seconds. <strong className="text-text-primary">Tax Tools Arcade</strong> ships practitioner utilities.
            </p>
            <p className="text-text-muted">
              TAVLP is the 9th platform — built to solve the one problem tax pros keep putting off: marketing.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-text-primary">Stop putting off the channel</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Choose your avatar. We handle the rest.
          </p>
          <a href="/#start" className="inline-block bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
            Get Your Avatar Channel →
          </a>
        </div>
      </section>
    </div>
  )
}
