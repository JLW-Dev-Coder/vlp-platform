import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Tax Prep Pro pricing — Tax Prep Pro buildout, Tax Prep Pro + Members bundle, and Ongoing Support tiers for service bureaus and credentialed tax practitioners.',
}

// Pricing tiers per Owner spec (2026-05-09).
// TODO(copy): Awaiting final B2B copy from Jamie — placeholder benefit lines.

const TIERS = [
  {
    id: 'managed',
    name: 'Tax Prep Pro',
    price: '$5,000 setup',
    sub: 'one-time setup fee',
    badge: '',
    features: [
      'Branded SuiteDash workspace under our reseller',
      '8-phase client journey installed and configured',
      'Adaptive intake (W-2, 1099, single-member LLC, amendments)',
      'Form 8879 e-signature in-portal',
      'Member training (videos + live walkthrough)',
      '~30-day buildout from Discovery Call to live workspace',
    ],
    cta: 'Book a Discovery Call',
  },
  {
    id: 'bundle',
    name: 'Tax Prep Pro + Members',
    price: '$5,000 setup',
    sub: 'plus $779/mo per active member',
    badge: 'Most Popular',
    features: [
      'Everything in Managed',
      'Tax Monitor Pro buildout for IRS transcript monitoring',
      'Retention workflows for post-filing services',
      'Single onboarding, two products, one journey',
      'Bundle discount vs. buying TPP and TMP separately',
    ],
    cta: 'Book a Discovery Call',
  },
  {
    id: 'support',
    name: 'Ongoing Support',
    price: '$497/mo',
    sub: 'Receive ongoing support',
    badge: '',
    features: [
      'SD admin coverage as your team grows',
      'Workflow tuning between filing seasons',
      'New intake fields and journey changes',
      'Priority response during filing weeks',
      'Optional add-on to Managed or Bundle',
    ],
    cta: 'Book a Discovery Call',
  },
]

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24" id="bundle">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">Pricing</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
          Productized — <span className="italic text-[var(--tpp-rose)]">priced like it.</span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-[var(--color-text-2)]">
          A clear setup fee, an optional per-active-member bundle, and an optional support tier. No agency-style scope creep.
        </p>
      </header>

      {/* TODO(onboarding-flow): swap CTA to "Create your account" → /sign-in
          once the SD API-driven onboarding flow ships (scope #3). See
          Principal's chat ruling 2026-05-09 sequencing #1 + #2 before #3. */}
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {TIERS.map((t) => (
          <div
            key={t.id}
            id={t.id}
            className={`relative flex flex-col rounded-2xl border bg-[var(--color-surface)] p-7 ${
              t.badge ? 'border-[var(--tpp-rose)] shadow-[0_24px_60px_-30px_rgba(233,30,99,0.55)]' : 'border-[var(--color-border)]'
            }`}
          >
            {t.badge ? (
              <span className="absolute -top-3 left-7 rounded-full bg-[var(--tpp-rose)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {t.badge}
              </span>
            ) : null}
            <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">{t.name}</h2>
            <div className="mt-4">
              <div className="font-display text-4xl font-semibold text-[var(--color-text-1)]">{t.price}</div>
              <div className="mt-1 text-sm text-[var(--color-text-2)]">{t.sub}</div>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-[var(--color-text-2)]">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-[var(--tpp-rose)]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-2">
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tpp-rose)] px-5 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)]"
              >
                {t.cta} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 max-w-3xl text-sm leading-relaxed text-[var(--color-text-3)]">
        {/* TODO(copy): Awaiting final pricing footnote / refund-window confirmation from Jamie. */}
        All engagements begin with a Discovery Call. Setup fees due at kickoff; subscription tiers billed monthly via Stripe. Refund terms in our{' '}
        <Link href="/legal/refund" className="underline underline-offset-2 hover:text-[var(--tpp-rose)]">
          Refund Policy
        </Link>
        .
      </p>
    </section>
  )
}
