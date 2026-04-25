'use client'

import { useState } from 'react'

type PlanKey = 'free' | 'pro' | 'scale'

interface PlanData {
  key: PlanKey
  label: string
  price: string
  suffix: string
  badge?: string
  featured?: boolean
  headline: string
  features: { text: string; comingSoon?: boolean }[]
  ctaLabel: string
  ctaHref: string
}

const PLANS: PlanData[] = [
  {
    key: 'free',
    label: 'Free',
    price: '0',
    suffix: '/mo',
    headline: 'Get listed. Get leads. See if VLP works for you.',
    features: [
      { text: 'Directory listing on Tax Monitor Pro' },
      { text: 'Lead notifications (standard delivery)' },
      { text: 'Profile with credential, location, and services' },
      { text: 'Respond to taxpayer inquiries' },
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/sign-in',
  },
  {
    key: 'pro',
    label: 'Pro',
    price: '199',
    suffix: '/mo',
    badge: 'Most Popular',
    featured: true,
    headline: 'Get leads first. Stand out in the directory.',
    features: [
      { text: 'Everything in Free' },
      { text: 'Priority lead delivery — notified before Free tier' },
      { text: 'Featured badge in directory listings' },
      { text: '100 transcript tokens/mo' },
      { text: '120 tax tool game tokens/mo' },
      { text: 'Client Pool access with 12% platform fee', comingSoon: true },
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/sign-in',
  },
  {
    key: 'scale',
    label: 'Scale',
    price: '399',
    suffix: '/mo',
    headline: 'First in line. First to respond. First to close.',
    features: [
      { text: 'Everything in Pro' },
      { text: 'Exclusive lead window — see inquiries 30 min before anyone else' },
      { text: 'Top placement in directory results' },
      { text: '250 transcript tokens/mo' },
      { text: '300 tax tool game tokens/mo' },
      { text: 'Early access to Client Pool cases', comingSoon: true },
      { text: 'Client Pool access with 12% platform fee', comingSoon: true },
    ],
    ctaLabel: 'Get Started',
    ctaHref: '/sign-in',
  },
]

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null)

  function handleCheckout(plan: PlanData) {
    setLoadingPlan(plan.key)
    window.location.href = plan.ctaHref
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800/50 px-4 py-2">
            <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-slate-300">Speed-to-lead pricing — pay only when faster delivery is worth it.</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Pricing{' '}
            <span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">
              &amp; Plans
            </span>
          </h1>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-400 md:text-2xl">
            Free gets you on the platform. Pro gets you in front of taxpayers first. Scale gives you the exclusive window to win.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a href="#pricing-cards" className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg shadow-orange-500/25 transition-all duration-200 hover:from-orange-400 hover:to-orange-500 hover:scale-105">
              View plans →
            </a>
            <a href="/features" className="inline-block rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-4 text-lg font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-800/80">
              Explore features
            </a>
          </div>
        </div>
      </section>

      {/* Plan cards */}
      <section id="pricing-cards" className="border-t border-white/10">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <p className="text-xs font-semibold tracking-widest text-orange-400">PLANS</p>
            <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">Start free. Upgrade when you&rsquo;re ready.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base text-white/70">
              Lead delivery speed is the difference. The first pro to respond wins the engagement — Pro and Scale put you ahead of the line.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <article
                key={plan.key}
                className={`flex flex-col rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
                  plan.featured
                    ? 'border-2 border-orange-500/70 bg-gradient-to-b from-white/8 to-white/5'
                    : 'border border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-lg font-extrabold">{plan.label}</div>
                  {plan.badge && (
                    <span className={`rounded-full px-3 py-1 text-xs ${plan.featured ? 'border border-orange-500/40 bg-orange-500/10 text-white/90' : 'border border-white/10 bg-white/5 text-white/80'}`}>
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">${plan.price}</span>
                    <span className="text-sm text-white/70">{plan.suffix}</span>
                  </div>
                </div>
                <p className="mt-5 text-sm text-white/80 font-semibold">{plan.headline}</p>
                <ul className="mt-6 space-y-3 text-sm text-white/75 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature.text} className="flex items-start gap-3">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0" />
                      <span>
                        {feature.text}
                        {feature.comingSoon && (
                          <span className="ml-2 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">
                            Coming soon
                          </span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => handleCheckout(plan)}
                    disabled={loadingPlan !== null}
                    className="w-full rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-extrabold text-[#070a10] hover:bg-orange-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loadingPlan === plan.key ? 'Redirecting...' : plan.ctaLabel}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#7c2d12] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">
              get to leads first?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Free gets you listed. Pro and Scale get you noticed before everyone else. Speed-to-lead is the entire game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/sign-in" className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
              Get Started
            </a>
            <a href="/features" className="bg-white/10 hover:bg-white/15 text-white font-semibold px-10 py-4 rounded-xl text-lg border border-orange-400/20 transition-all">
              Explore features
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
