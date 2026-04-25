'use client'

import Link from 'next/link'

type PlanKey = 'free' | 'pro' | 'scale'

interface PlanPreview {
  key: PlanKey
  label: string
  price: string
  badge?: string
  featured?: boolean
  oneLiner: string
  ctaHref: string
}

const PLANS: PlanPreview[] = [
  {
    key: 'free',
    label: 'Free',
    price: '0',
    oneLiner: 'Get listed and start receiving leads.',
    ctaHref: '/sign-in',
  },
  {
    key: 'pro',
    label: 'Pro',
    price: '199',
    badge: 'Most Popular',
    featured: true,
    oneLiner: 'Priority lead delivery and a featured directory badge.',
    ctaHref: '/sign-in',
  },
  {
    key: 'scale',
    label: 'Scale',
    price: '399',
    oneLiner: 'Exclusive 30-minute lead window before anyone else sees it.',
    ctaHref: '/sign-in',
  },
]

export default function HomePricingSection() {
  return (
    <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <p className="text-xs font-semibold tracking-widest text-orange-400">PRICING</p>
        <h2 className="mt-4 text-4xl font-extrabold md:text-5xl">Start free. Upgrade when you&rsquo;re ready.</h2>
        <p className="mx-auto mt-5 max-w-2xl text-base text-white/70">
          Three plans, one differentiator: how fast you get the lead.
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
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold">${plan.price}</span>
              <span className="text-sm text-white/70">/mo</span>
            </div>
            <p className="mt-5 text-sm text-white/80 flex-1">{plan.oneLiner}</p>
            <div className="mt-8">
              <a
                href={plan.ctaHref}
                className="block w-full rounded-xl bg-orange-500 px-5 py-3 text-center text-sm font-extrabold text-[#070a10] hover:bg-orange-400 transition-colors"
              >
                Get Started
              </a>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Link href="/pricing" className="text-sm text-orange-400 underline underline-offset-2 hover:text-orange-300">View full pricing details →</Link>
      </div>
    </div>
  )
}
