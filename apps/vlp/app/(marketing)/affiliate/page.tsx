import type { Metadata } from 'next'
import Link from 'next/link'

const CANONICAL_BASE = 'https://virtuallaunch.pro'

export const metadata: Metadata = {
  title: 'Affiliate Program — Earn 20% on Every Sale',
  description:
    'Refer tax pros and service bureaus to Virtual Launch Pro. Earn 20% flat commission on every purchase your referrals make, for life. Cash payouts via Stripe Connect.',
  alternates: { canonical: `${CANONICAL_BASE}/affiliate` },
  openGraph: {
    title: 'Affiliate Program — Earn 20% on Every Sale',
    description:
      'Refer tax pros and service bureaus to Virtual Launch Pro. Earn 20% flat commission on every purchase your referrals make, for life.',
    url: `${CANONICAL_BASE}/affiliate`,
    type: 'website',
  },
}

const STEPS = [
  {
    number: '1',
    title: 'Create your free account',
    body: 'Sign up at virtuallaunch.pro. No credit card, no minimum purchase to become an affiliate.',
  },
  {
    number: '2',
    title: 'Get your referral link',
    body: 'Your unique link is generated automatically inside your dashboard. Share it anywhere.',
  },
  {
    number: '3',
    title: 'Earn on every purchase',
    body: 'When someone signs up through your link and buys anything on VLP, you earn 20% — every time, forever.',
  },
]

const DETAILS = [
  {
    title: '20% flat commission',
    body: 'On every VLP purchase — no caps, no tiers, no fine print.',
  },
  {
    title: 'Lifetime attribution',
    body: 'Once a referral is yours, every future purchase earns commission.',
  },
  {
    title: 'All products included',
    body: 'Every offer in the VLP family — current and future.',
  },
  {
    title: 'Cash payouts',
    body: 'Withdraw earnings to your bank via Stripe Connect Express.',
  },
  {
    title: 'Real-time dashboard',
    body: 'Track clicks, signups, purchases, and earnings inside your VLP account.',
  },
  {
    title: 'Resource library',
    body: 'Outreach scripts, talking points, and proposal templates inside your dashboard.',
  },
]

const PRODUCTS = [
  { name: 'Virtual Launch Pro', tagline: 'The fastest way for tax pros to find new clients.' },
  { name: 'Developers VLP', tagline: 'Connect talented developers with premium U.S. clients.' },
  { name: 'Games VLP', tagline: 'Tax-themed mini-games for client education and leads.' },
  { name: 'Tax Avatar Pro', tagline: 'AI YouTube channel for tax pros.' },
  { name: 'Website Lotto', tagline: 'Win, bid on, or buy ready-to-launch websites.' },
  { name: 'TaxClaim Pro', tagline: 'Form 843 automation for tax pros.' },
  { name: 'Tax Monitor Pro', tagline: 'IRS transcript monitoring & compliance for tax pros.' },
  { name: 'Transcript Tax Monitor', tagline: 'IRS transcript automation, decoded for clients.' },
  { name: 'Tax Tools Arcade', tagline: 'Interactive games that teach IRS forms and tax rules.' },
]

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-shrink-0 text-brand-primary"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function AffiliatePage() {
  return (
    <div className="bg-slate-950 text-slate-100">
      {/* Hero */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="mb-5 inline-block rounded-full border border-brand-primary/35 bg-brand-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-primary">
            Affiliate Program
          </div>
          <h1 className="mb-4 text-4xl font-semibold leading-tight tracking-tight text-slate-100 md:text-5xl">
            Earn 20% on every sale — for life
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg">
            Refer tax pros and service bureaus to any Virtual Launch Pro product. Earn 20% flat commission on every purchase they ever make — from $9/mo subscriptions to $8,500 setup bundles. Lifetime attribution. Cash payouts via Stripe.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-in"
              className="inline-block rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-6 py-3 text-sm font-medium text-slate-950 transition hover:from-brand-hover hover:to-brand-primary"
            >
              Create your free account
            </Link>
            <Link
              href="/pricing"
              className="inline-block rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500"
            >
              See all products
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-slate-100 md:text-3xl">
            How it works
          </h2>
          <p className="mb-10 text-center text-sm text-slate-400">
            Three steps. No approvals, no waiting periods.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="rounded-lg border border-slate-800 bg-slate-900/60 p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full border border-brand-primary/35 bg-brand-primary/10 text-sm font-medium text-brand-primary">
                  {step.number}
                </div>
                <h3 className="mb-2 text-base font-medium text-slate-100">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program details */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-slate-100 md:text-3xl">
            Program details
          </h2>
          <p className="mb-10 text-center text-sm text-slate-400">
            Designed to be simple, transparent, and worth your time.
          </p>
          <ul className="mx-auto grid max-w-2xl gap-5 md:grid-cols-2">
            {DETAILS.map((d) => (
              <li key={d.title} className="flex items-start gap-3">
                <CheckIcon />
                <p className="text-sm leading-relaxed text-slate-400">
                  <strong className="font-medium text-slate-100">{d.title}.</strong> {d.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What you can refer */}
      <section className="border-y border-slate-800 bg-slate-900/40 px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-2 text-center text-2xl font-semibold text-slate-100 md:text-3xl">
            What you can refer
          </h2>
          <p className="mb-10 text-center text-sm text-slate-400">
            Every product across the VLP family earns commission.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
            <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2">
              {PRODUCTS.map((p) => (
                <li key={p.name} className="text-sm">
                  <span className="font-medium text-slate-100">{p.name}</span>
                  <span className="text-slate-400"> — {p.tagline}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-slate-800 pt-4 text-center">
              <Link
                href="/pricing"
                className="text-sm font-medium text-brand-primary transition hover:text-brand-hover"
              >
                See full catalog at virtuallaunch.pro/pricing →
              </Link>
            </div>
          </div>
          <p className="mx-auto mt-5 max-w-md text-center text-xs text-slate-500">
            From $9/mo subscriptions to $8,500 setup bundles — 20% on all of it.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="mb-3 text-2xl font-semibold text-slate-100 md:text-3xl">
            Ready to start earning?
          </h2>
          <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-slate-400 md:text-base">
            Create a free VLP account, grab your referral link, and start earning 20% on every purchase your referrals make.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/sign-in"
              className="inline-block rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-6 py-3 text-sm font-medium text-slate-950 transition hover:from-brand-hover hover:to-brand-primary"
            >
              Create your free account
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3 text-sm font-medium text-slate-100 transition hover:border-slate-500"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
