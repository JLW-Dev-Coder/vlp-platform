const painPoints = [
  { n: 1, title: 'Manual Form 843 prep eats your day', tag: 'Time sink', body: 'Preparing a single Form 843 manually — cross-referencing transcripts, calculating penalties, formatting the write-up — takes 30 to 45 minutes per client.', fix: 'Solved with: automated generation from transcript data' },
  { n: 2, title: 'The Kwong window closes in 2026', tag: 'Deadline pressure', body: 'Claims tied to the Kwong v. US ruling must be postmarked by July 10, 2026. Every week spent on manual prep is a week fewer clients get filed.', fix: 'Solved with: urgency-aware tooling before July 10' },
  { n: 3, title: "Clients don't understand what Kwong means", tag: 'Intake friction', body: 'Explaining the ruling, eligibility window, and filing process to every prospective client eats hours of pro time that could be billable work.', fix: 'Solved with: branded client pages that explain eligibility' },
  { n: 4, title: '30 minutes per form × 50 clients = pain', tag: 'Scale problem', body: 'A firm with a modest Kwong book can burn 25+ hours on Form 843 prep alone. That time does not scale with revenue.', fix: 'Solved with: bulk processing and pre-fills' },
  { n: 5, title: "Your website can't take Kwong intake", tag: 'Tooling gap', body: 'Most tax pro websites have a contact form at best. Collecting the data needed for Form 843 — tax years, penalty types, transcript excerpts — requires something purpose-built.', fix: 'Solved with: firm-branded landing pages (1 click to setup)' },
  { n: 6, title: 'Hard to know which clients qualify', tag: 'Eligibility check', body: 'The Kwong window is narrow (Jan 20, 2020 – July 10, 2023). Screening a client list by hand means pulling transcripts and scanning for penalty assessments in that exact window.', fix: 'Solved with: built-in eligibility checker' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-text-muted">Form 843 automation built for the Kwong v. US refund window.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            About{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              TaxClaim Pro
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Tax professionals generate, file, and track IRS Form 843 penalty abatement claims — five minutes per client, one branded landing page, a Kwong-aware workflow from intake to mail.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/pricing"
              className="inline-block rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg shadow-brand-glow transition-all duration-200 hover:from-brand-hover hover:to-brand-primary hover:scale-105"
            >
              View pricing →
            </a>
            <a
              href="/demo"
              className="inline-block rounded-lg border border-subtle bg-surface-card px-8 py-4 text-lg font-semibold text-text-primary transition-all duration-200 hover:bg-surface-elevated"
            >
              See the demo
            </a>
          </div>
        </div>
      </section>

      {/* Founder + Mission */}
      <section className="py-16 md:py-24 bg-surface-card">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Founder card */}
            <div className="rounded-3xl shadow-xl p-8 bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20">
              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/10 shadow-lg bg-gradient-to-br from-brand-primary/30 to-brand-gradient-to/30">
                  <img
                    src="https://20896460.fs1.hubspotusercontent-na1.net/hubfs/20896460/Development%20Materials/Miscellaneous/Pic_JLW_Left-removebg-preview.png"
                    alt="Jamie L. Williams"
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <p className="mt-4 text-lg font-bold text-text-primary">Jamie L. Williams</p>
                <p className="mt-1 text-sm text-text-muted">Founder • Systems builder</p>
                <a
                  href="https://www.linkedin.com/in/virtuallaunchpro/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-primary hover:text-brand-hover transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
              <div className="mt-8 text-center">
                <span className="inline-flex items-center gap-2 bg-surface-elevated text-text-primary px-4 py-2 rounded-full text-sm font-semibold border border-brand-primary/20">
                  <svg className="w-4 h-4 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Built by JLW for the VLP ecosystem
                </span>
              </div>
            </div>

            {/* Mission */}
            <div>
              <span className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-brand-primary/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Our mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-5">
                Make Form 843 penalty abatement fast enough to actually do
              </h2>
              <p className="text-lg text-text-muted leading-relaxed mb-6">
                Jamie L. Williams founded Virtual Launch Pro to solve a problem she kept hearing from tax professionals: the tooling for penalty abatement work is either enterprise-priced or nonexistent. TaxClaim Pro is one of several platforms in the VLP ecosystem she&apos;s built to give solo and small-firm tax pros the same automation leverage larger firms have had for years. When the Kwong v. US ruling opened a short window for retroactive penalty claims, the need for a dedicated Form 843 tool became obvious.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-5 shadow-md bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20">
                  <p className="text-3xl font-bold text-text-primary">5 min</p>
                  <p className="text-sm text-text-muted">Per Form 843 preparation</p>
                </div>
                <div className="rounded-2xl p-5 shadow-md bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20">
                  <p className="text-3xl font-bold text-text-primary">July 10, 2026</p>
                  <p className="text-sm text-text-muted">Kwong window closes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why this exists — pain points */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-surface-card to-surface-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 bg-brand-primary/15 text-text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-brand-primary/20">
              <svg className="w-5 h-5 text-brand-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4L7.5 17l.9-5L4.8 8.3l5-.7L12 2z" />
              </svg>
              Why this exists
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              We built this because Kwong penalty abatement is a real opportunity
            </h2>
            <p className="text-lg text-text-muted max-w-2xl mx-auto">
              Tax pros know the ruling. Fewer have the time or tooling to work it at scale before the window closes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((p) => (
              <div
                key={p.n}
                className="rounded-2xl p-6 bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20 shadow-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-text-on-primary font-bold shrink-0">
                    {p.n}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{p.title}</p>
                    <p className="text-xs text-text-muted">{p.tag}</p>
                  </div>
                </div>
                <p className="text-text-muted leading-relaxed mb-4">{p.body}</p>
                <div className="mt-4 pt-4 border-t border-subtle">
                  <p className="text-sm font-semibold text-brand-primary">{p.fix}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 bg-surface-elevated px-6 py-4 rounded-2xl border border-brand-primary/20">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-brand-text-on-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-text-primary font-semibold">We built this to close the tooling gap before the Kwong window does.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to process Kwong claims at scale?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Use TaxClaim Pro to work through your Kwong-eligible client list before the July 10, 2026 deadline — one branded page, one dashboard, one tool from intake to mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
              See Pricing
            </a>
            <a href="/contact" className="bg-surface-elevated hover:bg-surface-card text-text-primary font-semibold px-10 py-4 rounded-xl text-lg border border-brand-primary/20 transition-all">
              Contact Us
            </a>
          </div>
          <p className="text-text-muted text-sm mt-8">Subscribe monthly • File systematically • Repeat until July 2026</p>
        </div>
      </section>
    </div>
  )
}
