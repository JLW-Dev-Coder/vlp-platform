import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const metadata = {
  title: 'Features',
  description: 'Everything Games VLP gives tax professionals — embeds, analytics, and 9+ games.',
};

const FEATURES = [
  {
    title: 'Drop-in Embeds',
    body: 'Add a single iframe or script tag to any page on your website. No build tools, no framework, no hosting required.',
  },
  {
    title: 'Tax-Themed Games',
    body: 'Nine interactive games built around real tax concepts: deductions, credits, filing flow, IRS rules. Educational, not just entertaining.',
  },
  {
    title: 'Token-Based Gameplay',
    body: 'Each subscription tier includes a monthly token allocation. Tokens control plays — upgrade when your audience grows.',
  },
  {
    title: 'Analytics',
    body: 'Track plays, completion rate, and which games convert best. See which education content actually lands.',
  },
  {
    title: 'Brand Customization',
    body: 'Match the game frame to your practice colors. Clients see your brand, not ours.',
  },
  {
    title: 'Affiliate Program',
    body: 'Earn 20% flat lifetime commission on every tax pro you refer. Stripe Connect Express handles payouts.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-5xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Features
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Everything you get with Games VLP</h1>
          <p className="mt-4 text-lg text-white/70">
            {gvlpConfig.marketing!.summary}
          </p>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-white/70">{f.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">See the games in action</h2>
          <p className="mt-3 text-white/70">Every game is playable on the library page — no signup required.</p>
          <Link
            href="/games"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Browse Games →
          </Link>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
