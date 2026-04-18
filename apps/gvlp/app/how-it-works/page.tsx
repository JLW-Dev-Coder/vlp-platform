import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const metadata = {
  title: 'How It Works',
  description: 'From tier pick to live embed in three steps.',
};

const STEPS = [
  {
    n: 1,
    title: 'Choose Your Tier',
    body:
      'Pick a subscription plan that fits your practice. Each tier determines how many games you can display and your monthly token allocation. Start free, upgrade anytime.',
    meta: 'Starter, Apprentice, Strategist, or Navigator',
  },
  {
    n: 2,
    title: 'Pick & Configure Your Games',
    body:
      'Mix and match from the 9-game library — Trivia, Spin Wheel, Match Mania, and more. Higher tiers unlock more slots. Add affiliate payout details so you earn when clients play.',
    meta: '9+ games, Stripe payout built in',
  },
  {
    n: 3,
    title: 'Embed & Track',
    body:
      'Copy a single iframe or script tag into your site. Games go live instantly. Watch plays, completions, and engagement grow in the analytics dashboard.',
    meta: 'Live in under 5 minutes',
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Implementation
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">How It Works</h1>
          <p className="mt-4 text-lg text-white/70">
            Three steps from signup to live games on your site.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="space-y-6">
            {STEPS.map((s) => (
              <div key={s.n} className="flex gap-6 rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#22c55e] text-xl font-bold text-black">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-white/70">{s.body}</p>
                  <p className="mt-3 text-xs uppercase tracking-widest text-[#22c55e]">{s.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to start?</h2>
          <Link
            href="/onboarding"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Get Started Free →
          </Link>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
