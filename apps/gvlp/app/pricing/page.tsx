import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for Games VLP — four tiers from free to $39/mo.',
};

const TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    emoji: '🌱',
    priceLabel: 'Free',
    popular: false,
    features: ['100 tokens / month', '1 game slot', 'Basic analytics', 'Email support'],
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    emoji: '⚡',
    priceLabel: '$9',
    popular: false,
    features: ['500 tokens / month', '3 game slots', 'Standard analytics', 'Priority email support'],
  },
  {
    id: 'strategist',
    name: 'Strategist',
    emoji: '🎯',
    priceLabel: '$19',
    popular: true,
    features: ['1,500 tokens / month', '6 game slots', 'Advanced analytics', 'Live chat support'],
  },
  {
    id: 'navigator',
    name: 'Navigator',
    emoji: '🚀',
    priceLabel: '$39',
    popular: false,
    features: ['5,000 tokens / month', '9 game slots', 'Full analytics suite', 'Dedicated support'],
  },
];

export default function PricingPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Pricing
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Simple, Transparent Pricing</h1>
          <p className="mt-4 text-lg text-white/70">
            Choose the plan that fits your practice. Upgrade or downgrade anytime.
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TIERS.map((tier) => (
              <div
                key={tier.id}
                className={
                  'relative rounded-xl border p-6 ' +
                  (tier.popular
                    ? 'border-[#22c55e] bg-[#22c55e]/10'
                    : 'border-white/10 bg-white/5')
                }
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#22c55e] px-3 py-1 text-xs font-semibold text-black">
                    Most Popular
                  </span>
                )}
                <div className="text-3xl">{tier.emoji}</div>
                <div className="mt-3 text-xl font-bold">{tier.name}</div>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{tier.priceLabel}</span>
                  <span className="text-white/50">/month</span>
                </div>
                <ul className="mt-6 space-y-2 text-sm text-white/80">
                  {tier.features.map((f) => (
                    <li key={f} className="flex gap-2">
                      <span className="text-[#22c55e]">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/onboarding?tier=${tier.id}`}
                  className={
                    'mt-6 block rounded-lg px-4 py-2 text-center font-semibold ' +
                    (tier.popular
                      ? 'bg-[#22c55e] text-black hover:opacity-90'
                      : 'border border-white/20 text-white hover:bg-white/10')
                  }
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
