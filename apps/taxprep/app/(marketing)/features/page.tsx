import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Features',
  description:
    'Capabilities of the Tax Prep Pro buildout: branded SuiteDash workspace, 8-phase client journey, member training, and optional Tax Monitor Pro bundle.',
}

// Per Deviation 7: capabilities cards + 8-phase journey on /features.
// TODO(copy): Awaiting final B2B copy from Jamie — placeholder text mirrored
// from app-blueprint capabilities and the canonical 8-phase rail.

const CAPABILITIES = [
  {
    title: 'Branded SuiteDash workspace',
    body: 'Your bureau’s logo, colors, and copy across the entire member experience. We provision under our reseller, you stay in control.',
  },
  {
    title: '8-phase client journey',
    body: 'Identify → Intake → Agreement → Payment → Prep → E-Sign 8879 → File → Deliver. Same path, every taxpayer.',
  },
  {
    title: 'Adaptive intake',
    body: 'Intake forms branch by taxpayer type (individual W-2, 1099 self-employed, single-member LLC, amendments) so clients only see what applies.',
  },
  {
    title: 'E-sign + filing checkpoints',
    body: 'Form 8879 e-signature handled inside SD. Filing milestone visible to client and team — no more “did we already file?” Slack threads.',
  },
  {
    title: 'Member training',
    body: 'YouTube + in-portal training so your staff and clients ramp in days, not weeks. Updated each season.',
  },
  {
    title: 'Tax Monitor Pro bundle (optional)',
    body: 'Pair TPP with Tax Monitor Pro for IRS transcript monitoring, retention workflows, and post-filing services.',
  },
]

const PHASES = [
  { n: 1, title: 'Identify Taxpayer Type', body: 'Branching intake routes individuals, 1099 earners, LLCs, and amendments down the right path.' },
  { n: 2, title: 'Intake Form', body: 'Adaptive form pulls only the documents and data the chosen filing type needs.' },
  { n: 3, title: 'Service Agreement', body: 'Engagement letter executed inside SD with timestamped acceptance.' },
  { n: 4, title: 'Payment', body: 'Stripe-backed checkout linked to the engagement so the file is funded before prep.' },
  { n: 5, title: 'Prep & Review', body: 'Preparer drafts return, internal review checkpoint before client sign-off.' },
  { n: 6, title: 'E-Sign 8879', body: 'Form 8879 signed inside the SD portal with audit trail.' },
  { n: 7, title: 'File', body: 'Return e-filed; status visible to client and bureau in the same workspace.' },
  { n: 8, title: 'Deliver & Close', body: 'Final return PDF, refund/balance summary, and next-year prompt delivered to the client record.' },
]

export default function FeaturesPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">Capabilities</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
          What <span className="italic text-[var(--tpp-rose)]">Tax Prep Pro</span> ships
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-2)]">
          A productized buildout, not a SaaS. Six capabilities you don&rsquo;t have to wire together yourself.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((c) => (
          <div
            key={c.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <h2 className="text-base font-semibold text-[var(--color-text-1)]">{c.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-2)]">{c.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-24">
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">8-Phase Journey</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--color-text-1)]">
            From booking to delivery
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-text-2)]">
            Every client travels the same path. Your bureau is the brand; the workflow is the product.
          </p>
        </header>

        <ol className="mt-10 grid gap-4 md:grid-cols-2">
          {PHASES.map((p) => (
            <li
              key={p.n}
              className="flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-5"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[var(--tpp-rose)] font-display text-base font-semibold text-white">
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
    </section>
  )
}
