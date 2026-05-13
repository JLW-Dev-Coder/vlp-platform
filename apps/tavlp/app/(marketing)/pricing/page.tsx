'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

const STRIPE_PRICES = {
  starter: 'price_placeholder_tavlp_starter',
  growth: 'price_placeholder_tavlp_growth',
  pro: 'price_placeholder_tavlp_pro',
} as const;

type Tier = {
  name: string;
  price: number;
  priceId: string;
  description: string;
  features: string[];
  popular: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: 49,
    priceId: STRIPE_PRICES.starter,
    description: 'AI avatar channel — you manage publishing.',
    popular: false,
    features: [
      'Custom AI avatar',
      'Branded channel setup',
      '4 videos/month (scripts provided)',
      'YouTube stats dashboard',
      'Channel ownership transfer',
    ],
  },
  {
    name: 'Growth',
    price: 99,
    priceId: STRIPE_PRICES.growth,
    description: 'Full-service — we publish for you weekly.',
    popular: true,
    features: [
      'Everything in Starter',
      'Weekly publishing (4+ videos/mo)',
      'Thumbnail & description optimization',
      'Lead generation pipeline to TaxClaim Pro intake',
      'Review & approve workflow',
    ],
  },
  {
    name: 'Pro',
    price: 199,
    priceId: STRIPE_PRICES.pro,
    description: 'Premium — full content strategy + multiple avatars.',
    popular: false,
    features: [
      'Everything in Growth',
      '8+ videos/month',
      'Multiple avatar selection',
      'Kwong v. US content pack',
      'Dedicated account manager',
      'Priority support',
    ],
  },
];

const FAQ = [
  {
    q: 'How does the AI avatar work?',
    a: 'You choose from our avatar library (or we generate one from your photo). Your AI spokesperson then records every video — IRS code explainers, taxpayer guidance, deadline reminders — on your branded YouTube channel. You never have to be on camera.',
  },
  {
    q: 'Do I own the YouTube channel?',
    a: 'Yes. The channel is configured under your brand and transferred to you after the 7-day YouTube transfer period. You’re the primary owner with full control.',
  },
  {
    q: 'Who writes the scripts?',
    a: 'We do. Every script covers IRS codes that taxpayers search at midnight — researched, accurate, and ready to publish. On Growth and Pro tiers, we also handle thumbnails and descriptions.',
  },
  {
    q: 'How do leads come back to my practice?',
    a: 'Every video drives viewers to your branded TaxClaim Pro intake page. Taxpayers self-serve, Form 843 generates, and you get notified. Lead pipeline is included on Growth and Pro.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. There are no long-term contracts. Cancel anytime — the channel stays yours.',
  },
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={tavlpConfig.brandColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(priceId: string, tierName: string) {
    setLoading(tierName);
    setError(null);
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const res = await fetch(`${tavlpConfig.apiBaseUrl}/v1/tavlp/checkout/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_id: priceId,
          tier: tierName,
          success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/pricing`,
        }),
      });
      if (res.status === 401 || res.status === 403) {
        window.location.href = `/sign-in?redirect=/pricing`;
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (data?.url) {
        window.location.href = data.url;
      } else {
        setError('Unable to start checkout. Please try again or contact support.');
        setLoading(null);
      }
    } catch {
      setError('Checkout failed. Please try again or contact support.');
      setLoading(null);
    }
  }

  return (
    <div className="bg-black text-white">
      <section className="mx-auto max-w-[77.5rem] px-4 pb-12 pt-16 md:pt-24">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pick your{' '}
            <span style={{ color: tavlpConfig.brandColor }}>plan</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A fully managed AI YouTube channel for tax pros. Pick the tier that matches how much content you want.
          </p>
        </div>

        {error && (
          <p className="text-center text-sm text-red-400 mb-6" role="alert">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TIERS.map((tier) => {
            const isPopular = tier.popular;
            return (
              <div
                key={tier.name}
                className={`rounded-2xl p-8 flex flex-col relative ${
                  isPopular
                    ? 'bg-white/[0.04] border-2'
                    : 'bg-white/[0.02] border border-white/10'
                }`}
                style={isPopular ? { borderColor: tavlpConfig.brandColor } : undefined}
              >
                {isPopular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white"
                    style={{ backgroundColor: tavlpConfig.brandColor }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="text-xl font-semibold mb-1">{tier.name}</div>
                <p className="text-sm text-white/60 mb-6">{tier.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-2xl font-bold">$</span>
                  <span className="text-5xl font-bold">{tier.price}</span>
                  <span className="text-white/60 ml-1">/mo</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5"><CheckIcon /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(tier.priceId, tier.name)}
                  disabled={loading !== null}
                  className="block w-full text-center px-6 py-3 rounded-full text-sm font-semibold transition-all disabled:opacity-50"
                  style={
                    isPopular
                      ? { backgroundColor: tavlpConfig.brandColor, color: '#fff' }
                      : { border: `1px solid ${tavlpConfig.brandColor}`, color: tavlpConfig.brandColor }
                  }
                >
                  {loading === tier.name ? 'Redirecting…' : 'Get Started'}
                </button>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-white/50 mt-8 max-w-2xl mx-auto">
          Cancel anytime. No setup fees.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
        <div className="space-y-4">
          {FAQ.map((item) => (
            <details key={item.q} className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
              <summary className="cursor-pointer font-semibold text-white list-none flex justify-between items-center">
                <span>{item.q}</span>
                <span className="text-white/40 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-white/70 text-sm leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to put your AI avatar to work?</h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Pick a plan above, or talk to our team if you want to see a live avatar demo first.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 rounded-full text-sm font-semibold border transition-all hover:bg-white/5"
          style={{ borderColor: tavlpConfig.brandColor, color: tavlpConfig.brandColor }}
        >
          Talk to our team
        </Link>
      </section>
    </div>
  );
}
