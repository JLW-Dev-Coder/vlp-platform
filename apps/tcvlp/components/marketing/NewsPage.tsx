export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/15 px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 2a1 1 0 011 1v1.07A7.002 7.002 0 0117 11a1 1 0 11-2 0 5 5 0 10-5 5 1 1 0 110 2 7 7 0 01-1-13.93V3a1 1 0 011-1z" />
            </svg>
            <span className="text-sm font-semibold text-brand-primary">NTA Blog — May 14, 2026</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            The NTA Just Confirmed Everything —{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              and Expanded the Scope
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            On May 7, 2026, the National Taxpayer Advocate published Part III of the Kwong v. US blog series. Here&apos;s what it means for your penalty refund claims.
          </p>

          <p className="text-sm text-text-muted">Published May 7, 2026 · Last updated May 14, 2026</p>
        </div>
      </section>

      {/* Section 1: What the NTA Confirmed */}
      <section className="py-16 md:py-20 bg-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">What the NTA Confirmed</h2>
          <div className="space-y-4 text-lg text-text-muted leading-relaxed">
            <p>
              <span className="font-semibold text-text-primary">The July 10, 2026, deadline is real.</span>{' '}
              Taxpayers who paid COVID-era penalties must file a claim by that date or lose their refund rights permanently.
            </p>
            <p>
              <span className="font-semibold text-text-primary">Relief is not automatic.</span>{' '}
              The IRS will not proactively refund penalties — taxpayers must file Form 843.
            </p>
            <p>
              <span className="font-semibold text-text-primary">The COVID-19 federal disaster period</span>{' '}
              runs from January 20, 2020, through July 10, 2023 (May 11, 2023, plus 60 days).
            </p>
            <p>
              <span className="font-semibold text-text-primary">Tens of millions of taxpayers</span>{' '}
              may be eligible.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: What's New — 2019 In Scope */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-brand-primary/20">
            New
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Tax Year 2019 Is Now In Scope
          </h2>
          <div className="space-y-4 text-lg text-text-muted leading-relaxed">
            <p>
              The NTA explicitly states that the disaster period covers tax years <span className="font-semibold text-text-primary">2019 through 2022</span> — not just 2020-2022.
            </p>
            <p>
              This means penalties assessed on 2019 returns that fell within the disaster window are eligible for the same relief.
            </p>
            <p>
              TaxClaim Pro is updating its eligibility checker and intake forms to include 2019.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Three Claim Types */}
      <section className="py-16 md:py-20 bg-surface-card">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Three Claim Types — and Why It Matters
          </h2>
          <p className="text-lg text-text-muted mb-10">
            The NTA drew a three-way split. Filing the wrong type can cost your client their rights.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl p-6 bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20 shadow-lg">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-text-on-primary font-bold mb-4">1</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Formal Refund Claim</h3>
              <p className="text-text-muted leading-relaxed">
                You paid the penalties/interest and you can calculate the amount. File Form 843. Creates a 6-month clock for judicial review if the IRS doesn&apos;t act.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20 shadow-lg">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-text-on-primary font-bold mb-4">2</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Protective Refund Claim</h3>
              <p className="text-text-muted leading-relaxed">
                You paid but the amount depends on how courts resolve Kwong. Write &quot;Protective Refund Claim Pursuant to Kwong Case&quot; across the top of Form 843. Preserves your rights while litigation continues.
              </p>
            </div>

            <div className="rounded-2xl p-6 bg-gradient-to-b from-surface-card to-surface-bg border border-brand-primary/20 shadow-lg">
              <div className="w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center text-brand-text-on-primary font-bold mb-4">3</div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Abatement Request</h3>
              <p className="text-text-muted leading-relaxed">
                Penalties assessed but not yet paid. Different rules apply. The IRC § 6511 refund deadline does not apply the same way. But act promptly — collection activity may continue.
              </p>
            </div>
          </div>

          <p className="mt-8 text-lg text-text-muted leading-relaxed">
            TaxClaim Pro is adding claim-type routing to the intake flow so practitioners generate the correct Form 843 variant automatically.
          </p>
        </div>
      </section>

      {/* Section 4: Two-Year Payment Rule */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            The Two-Year Payment Rule — Some Deadlines Extend Past July 2026
          </h2>
          <div className="space-y-4 text-lg text-text-muted leading-relaxed">
            <p>
              If you paid penalties or interest after July 10, 2024, your deadline may extend past July 10, 2026.
            </p>
            <p>
              <span className="font-semibold text-text-primary">The rule:</span>{' '}
              your deadline is the later of three years from the return due date OR two years from the date you paid.
            </p>
            <div className="rounded-xl p-5 bg-surface-elevated border border-brand-primary/20">
              <p className="text-text-primary">
                <span className="font-bold">Example:</span> paid penalties on July 1, 2025 → deadline is July 1, 2027.
              </p>
            </div>
            <p>
              TaxClaim Pro is adding a payment date field to calculate the correct deadline per taxpayer.
            </p>
          </div>
        </div>
      </section>

      {/* Section 5: Common Mistakes */}
      <section className="py-16 md:py-20 bg-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6">
            Common Mistakes the NTA Flagged
          </h2>
          <div className="rounded-2xl border-l-4 border-brand-primary bg-surface-elevated p-6 md:p-8">
            <ul className="space-y-4 text-lg text-text-muted leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold mt-1">•</span>
                <span>Missing the deadline entirely</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold mt-1">•</span>
                <span>Filing a vague protective claim (must identify the legal issue, tax year, and basis)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold mt-1">•</span>
                <span>Not having proof of mailing (use certified mail with return receipt)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold mt-1">•</span>
                <span>Sending to the wrong IRS address</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-primary font-bold mt-1">•</span>
                <span>Combining multiple tax years or penalty types on one Form 843 (file one per year per penalty type)</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Section 6: What TaxClaim Pro Is Updating */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-brand-primary/20">
            Platform Updates
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
            What TaxClaim Pro Is Updating
          </h2>
          <ul className="space-y-4 text-lg text-text-muted leading-relaxed">
            {[
              'Adding tax year 2019 to eligibility checker and intake forms',
              'Adding claim-type routing (formal refund / protective refund / abatement)',
              'Adding payment date field and dual-deadline calculator (3-year vs. 2-year)',
              'Enforcing one Form 843 per tax year per penalty type',
              'Adding post-generation checklist (certified mail guidance, IRS service center address, copy retention)',
              "Updating Gala's decision tree with paid/unpaid routing and 2019 coverage",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <svg className="w-6 h-6 text-brand-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 7: Live Webinar */}
      <section className="py-16 md:py-20 bg-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 bg-brand-primary/15 text-brand-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border border-brand-primary/20">
            Live Today
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Free Live Webinar — Today at 2 PM PT
          </h2>
          <p className="text-lg text-text-muted leading-relaxed mb-6">
            We&apos;re walking through everything the NTA confirmed — the three claim types, the deadline math, common mistakes, and how to lock in your protective claim step by step.
          </p>

          <div className="rounded-2xl border-l-4 border-brand-primary bg-surface-elevated p-6 md:p-8 mb-8 space-y-4 text-lg text-text-muted leading-relaxed">
            <p>
              Bring yourself, friends, family — even your dog. Everyone who paid IRS penalties between 2019 and 2022 can benefit from what the Advocate shared last week and updated on Thursday. No guarantees — but with the Advocate&apos;s support, we want to make sure you know your options before time runs out.
            </p>
            <p>
              <span className="font-semibold text-text-primary">Bonus:</span> a free PDF showing you exactly how to file your protective claim and get it filed before the deadline only weeks away.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="rounded-lg border border-brand-primary/30 bg-surface-elevated p-3 shadow-lg">
              <iframe
                width="360"
                height="240"
                src="https://webinar.zoho.com/meeting/register/embed?sessionId=1099786497"
                frameBorder="0"
                title="Webinar Registration"
                className="rounded-md block"
              />
            </div>
          </div>

          <p className="text-center text-sm text-text-muted">
            Can&apos;t see the registration form?{' '}
            <a
              href="https://live.zoho.com/eoia-ouo-lua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-primary font-semibold underline hover:text-brand-hover"
            >
              Register directly here
            </a>
          </p>
        </div>
      </section>

      {/* Section 8: Video Breakdown */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-3xl border-2 border-brand-primary bg-gradient-to-br from-brand-primary/15 via-surface-card to-brand-gradient-to/10 p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-brand-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-sm font-bold uppercase tracking-wide text-brand-primary">Video Breakdown</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Watch Now on YouTube
            </h2>
            <p className="text-lg text-text-muted leading-relaxed mb-4">
              We&apos;ve published 12 videos breaking down everything you need to know about the Kwong claim — from the ruling itself to step-by-step Form 843 walkthroughs, IRS transcript signals, and what CPAs need to do before the July 2026 deadline.
            </p>
            <p className="text-lg text-text-muted leading-relaxed mb-8">
              Browse by topic: Kwong Claim Basics, Form 843 Step-by-Step, IRS Transcripts, Deadline Strategy, Case Walkthroughs, and TaxClaim Pro Product Workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.youtube.com/@taxclaimpro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg shadow-brand-glow transition-all duration-200 hover:from-brand-hover hover:to-brand-primary hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Watch on YouTube
              </a>
              <a
                href="/gala"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-subtle bg-surface-card px-8 py-4 text-lg font-semibold text-text-primary transition-all duration-200 hover:bg-surface-elevated"
              >
                Talk to Gala →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-surface-bg via-surface-card to-brand-primary/20 text-text-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to put the new rules to work?</h2>
          <p className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Use Gala to check if the Kwong claim applies — or talk to our team about how the platform updates fit your firm&apos;s book.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/gala" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
              Check if Kwong applies →
            </a>
            <a href="/contact" className="bg-surface-elevated hover:bg-surface-card text-text-primary font-semibold px-10 py-4 rounded-xl text-lg border border-brand-primary/20 transition-all">
              Talk to our team
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
