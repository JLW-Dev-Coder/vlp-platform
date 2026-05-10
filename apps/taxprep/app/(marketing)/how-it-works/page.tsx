import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'How a Tax Prep Pro engagement runs end-to-end — from Discovery Call to live client workspace in ~30 days, then the 8-phase per-client journey.',
}

// Per RC prompt §4.6: derived from homepage 8-phase section, expanded.

const ENGAGEMENT_STEPS = [
  {
    n: 1,
    title: 'Discovery Call',
    body: 'A 30-minute conversation about your bureau — current tools, client volume, where the workflow leaks. We confirm fit before either of us commits.',
  },
  {
    n: 2,
    title: 'Buildout (~30 days)',
    body: 'We provision a SuiteDash workspace under our reseller, apply your branding, install the 8-phase template, and load the intake forms for the filing types you handle.',
  },
  {
    n: 3,
    title: 'Member Training',
    body: 'Your staff and any client-facing helpers walk through the workspace with us. We hand off training videos for new team members later.',
  },
  {
    n: 4,
    title: 'Live + Ongoing Support',
    body: 'You start onboarding clients into the new workspace. Optional Ongoing Support tier covers workflow tuning, SD admin, and seasonal updates.',
  },
]

const CLIENT_PHASES = [
  { n: 1, title: 'Identify Taxpayer Type', body: 'Client picks their filing type. The system routes them down the right intake path.' },
  { n: 2, title: 'Intake Form', body: 'Only the questions and document uploads relevant to that filing type.' },
  { n: 3, title: 'Service Agreement', body: 'Engagement letter signed inside the SD portal with timestamped acceptance.' },
  { n: 4, title: 'Payment', body: 'Stripe checkout funds the engagement before preparer time is spent.' },
  { n: 5, title: 'Prep & Review', body: 'Preparer drafts. Internal reviewer checks. Both sign off before sending to the client.' },
  { n: 6, title: 'E-Sign 8879', body: 'Form 8879 signed in-portal. Audit trail attached to the client record.' },
  { n: 7, title: 'File', body: 'Return e-filed. Status visible in the client&rsquo;s workspace.' },
  { n: 8, title: 'Deliver & Close', body: 'Final return PDF, refund/balance summary, and the prompt for next year archived to the client record.' },
]

export default function HowItWorksPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">How It Works</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
          Two layers, <span className="italic text-[var(--tpp-rose)]">one journey.</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-2)]">
          The buildout ships in ~30 days. After that, every client your bureau onboards travels the same 8-phase path — adapted to their filing type, branded as yours.
        </p>
      </header>

      <div className="mt-16">
        <h2 className="font-display text-3xl font-semibold text-[var(--color-text-1)]">
          1. Engagement: kickoff to live workspace
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {ENGAGEMENT_STEPS.map((s) => (
            <li
              key={s.n}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[var(--tpp-rose)] font-display text-base font-semibold text-white">
                {s.n}
              </span>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-1)]">{s.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-2)]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20">
        <h2 className="font-display text-3xl font-semibold text-[var(--color-text-1)]">
          2. Per client: the 8-phase journey
        </h2>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-text-2)]">
          Once your workspace is live, every taxpayer travels these phases — visible to your team and to the client at the same time.
        </p>

        <ol className="mt-8 grid gap-4 md:grid-cols-2">
          {CLIENT_PHASES.map((p) => (
            <li
              key={p.n}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-[var(--tpp-rose)] font-display text-base font-semibold text-[var(--tpp-rose)]">
                {p.n}
              </span>
              <div>
                <h3 className="text-base font-semibold text-[var(--color-text-1)]">{p.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-2)]">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 rounded-2xl border border-[var(--tpp-rose)]/30 bg-[var(--color-surface)] p-8 text-center">
        <p className="text-base text-[var(--color-text-2)]">Ready to see how this would run for your bureau?</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tpp-rose)] px-6 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)]"
        >
          Book a Discovery Call <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  )
}
