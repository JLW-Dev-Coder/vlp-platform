'use client';

import { useState } from 'react';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

const STRIPE_PRICES = {
  launchMonthly: 'price_1TWiSC9ROeyeXOqedv5uOcus',
  launchAnnual: 'price_1TWiSH9ROeyeXOqe0HKKgWz5',
  growthMonthly: 'price_1TWiSL9ROeyeXOqeGpzhH94E',
  growthAnnual: 'price_1TWiSQ9ROeyeXOqebVkuziCa',
  proMonthly: 'price_1TWiSV9ROeyeXOqeNiFXysEf',
  proAnnual: 'price_1TWiSa9ROeyeXOqeldUf9FlZ',
  setupFee: 'price_1TWiSf9ROeyeXOqeP7hLJsCz',
  additionalVideo: 'price_1TWiSk9ROeyeXOqegbPOYQKT',
} as const;

type Tier = {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  monthlyPriceId: string;
  annualPriceId: string;
  tagline: string;
  description: string;
  features: string[];
  popular: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Launch',
    monthlyPrice: 49,
    annualPrice: 490,
    monthlyPriceId: STRIPE_PRICES.launchMonthly,
    annualPriceId: STRIPE_PRICES.launchAnnual,
    tagline: 'Your YouTube channel, without the camera.',
    description: 'AI avatar channel — we build it, script it, and publish weekly.',
    popular: false,
    features: [
      '4 videos/month (1 per week)',
      '1 AI avatar (choose from 6 proven presenters)',
      'AI-generated scripts on your tax topic',
      'Professional thumbnails',
      'Branded YouTube channel setup',
      'YouTube stats dashboard',
      'Lead generation pipeline to your intake page',
      'Review & approve workflow — nothing goes live without your OK',
    ],
  },
  {
    name: 'Growth',
    monthlyPrice: 99,
    annualPrice: 990,
    monthlyPriceId: STRIPE_PRICES.growthMonthly,
    annualPriceId: STRIPE_PRICES.growthAnnual,
    tagline: 'Double the content, double the visibility.',
    description: '2x weekly publishing for faster channel growth.',
    popular: true,
    features: [
      'Everything in Launch',
      '8 videos/month (2 per week)',
      '1 avatar change per month',
      'Priority rendering',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 149,
    annualPrice: 1490,
    monthlyPriceId: STRIPE_PRICES.proMonthly,
    annualPriceId: STRIPE_PRICES.proAnnual,
    tagline: 'Your face. Your channel. Your brand only.',
    description: 'Custom avatar from your photo. White-label — no Tax Avatar Pro branding.',
    popular: false,
    features: [
      'Everything in Growth',
      '12 videos/month (3 per week)',
      'Custom AI avatar generated from your photo',
      'White-label channel (no Tax Avatar Pro branding visible)',
    ],
  },
];

const FAQ = [
  {
    q: 'Do I own my content?',
    a: 'Yes. Every video we produce is on your channel. You can request full channel ownership transfer at any time — after the 7-day YouTube transfer process, you’re the primary owner with full control of your channel, videos, and subscribers.',
  },
  {
    q: 'Am I renting a channel?',
    a: 'We build and manage the channel for you. You’re added as a Channel Manager with full visibility into analytics, comments, and content. Think of it as a managed service — we handle production, you keep control. Request ownership transfer whenever you’re ready.',
  },
  {
    q: 'What happens if I cancel?',
    a: 'Your channel and all published videos remain live on YouTube. We simply stop producing new content. Your subscribers, views, and SEO rankings stay with the channel. If you transfer ownership before canceling, the channel is fully yours.',
  },
  {
    q: 'How do the AI scripts work?',
    a: 'You tell us your tax topic niche at onboarding — penalty abatement, IRS collections, audit representation, whatever you specialize in. Our AI generates scripts tailored to your expertise. You review and approve every script before we render the video. Nothing goes live without your OK.',
  },
  {
    q: 'Can I change my avatar?',
    a: 'Launch plan customers can switch to a different stock avatar once when they first set up. Growth and Pro customers get 1 avatar change per month. Pro customers can also create a custom avatar generated from their own photo.',
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
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly');
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
          billing,
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
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Pick your{' '}
            <span style={{ color: tavlpConfig.brandColor }}>plan</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            A fully managed AI YouTube channel for tax pros. Pick the tier that matches how much content you want.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${billing === 'monthly' ? 'text-white' : 'text-white/60 hover:text-white'}`}
              style={billing === 'monthly' ? { backgroundColor: tavlpConfig.brandColor } : undefined}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'annual' ? 'text-white' : 'text-white/60 hover:text-white'}`}
              style={billing === 'annual' ? { backgroundColor: tavlpConfig.brandColor } : undefined}
            >
              Annual
              <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/15">Save 2 months</span>
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-sm text-red-400 mb-6" role="alert">{error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {TIERS.map((tier) => {
            const isPopular = tier.popular;
            const price = billing === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
            const priceId = billing === 'monthly' ? tier.monthlyPriceId : tier.annualPriceId;
            const suffix = billing === 'monthly' ? '/mo' : '/yr';
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
                <p className="text-sm font-medium mb-1" style={{ color: tavlpConfig.brandColor }}>{tier.tagline}</p>
                <p className="text-sm text-white/60 mb-6">{tier.description}</p>
                <div className="flex items-baseline mb-2">
                  <span className="text-2xl font-bold">$</span>
                  <span className="text-5xl font-bold">{price.toLocaleString()}</span>
                  <span className="text-white/60 ml-1">{suffix}</span>
                </div>
                {billing === 'annual' && (
                  <p className="text-xs text-white/60 mb-6">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide" style={{ backgroundColor: `${tavlpConfig.brandColor}20`, color: tavlpConfig.brandColor }}>Save 2 months</span>
                  </p>
                )}
                {billing === 'monthly' && <div className="mb-6" />}
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                      <span className="mt-0.5"><CheckIcon /></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCheckout(priceId, tier.name)}
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

        <div className="mt-10 max-w-3xl mx-auto space-y-3 text-center text-sm text-white/70">
          <p>One-time <strong className="text-white">$99 channel setup fee</strong>. Waived with annual billing.</p>
          <p>Need more videos? Add extras at <strong className="text-white">$15/each</strong> on any plan.</p>
        </div>
      </section>

      <section className="mx-auto max-w-[77.5rem] px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-10">Compare Plans</h2>
        <div className="max-w-5xl mx-auto overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="bg-white/[0.03]">
                <th className="text-left p-4 font-semibold text-white/70 w-1/4">Feature</th>
                <th className="text-center p-4 font-semibold">Launch</th>
                <th
                  className="text-center p-4 font-semibold relative"
                  style={{ backgroundColor: `${tavlpConfig.brandColor}1a`, color: tavlpConfig.brandColor }}
                >
                  <div>Growth</div>
                  <div className="text-[10px] uppercase tracking-wide font-bold mt-0.5">Most Popular</div>
                </th>
                <th className="text-center p-4 font-semibold">Pro</th>
              </tr>
            </thead>
            <tbody className="[&>tr]:border-t [&>tr]:border-white/10">
              <tr>
                <td className="p-4 font-medium text-white/80">Price</td>
                <td className="p-4 text-center text-white/90">$49/mo</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>$99/mo</td>
                <td className="p-4 text-center text-white/90">$149/mo</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">Videos</td>
                <td className="p-4 text-center text-white/90">4/mo (1/week)</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>8/mo (2/week)</td>
                <td className="p-4 text-center text-white/90">12/mo (3/week)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">Avatar</td>
                <td className="p-4 text-center text-white/90">1 of 6 stock</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>1 of 6 stock + 1 change/mo</td>
                <td className="p-4 text-center text-white/90">Custom from your photo</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">White-label</td>
                <td className="p-4 text-center text-white/40">No</td>
                <td className="p-4 text-center text-white/40" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>No</td>
                <td className="p-4 text-center font-semibold" style={{ color: tavlpConfig.brandColor }}>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckIcon />
                    Yes (no TAVLP branding)
                  </span>
                </td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">Add-on videos</td>
                <td className="p-4 text-center text-white/90">$15/each</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>$15/each</td>
                <td className="p-4 text-center text-white/90">$15/each</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">Setup fee</td>
                <td className="p-4 text-center text-white/90">$99 one-time</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>$99 one-time</td>
                <td className="p-4 text-center text-white/90">$99 one-time</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-white/80">Annual option</td>
                <td className="p-4 text-center text-white/90">$490/yr (2 mo free)</td>
                <td className="p-4 text-center text-white/90" style={{ backgroundColor: `${tavlpConfig.brandColor}0d` }}>$990/yr (2 mo free)</td>
                <td className="p-4 text-center text-white/90">$1,490/yr (2 mo free)</td>
              </tr>
            </tbody>
          </table>
        </div>
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
