import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Achievement Guide',
  description: 'Badges, streaks, and rewards across the Games VLP library.',
};

export default function AchievementGuidePage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Achievement Guide
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Achievement Guide</h1>
          <p className="mt-6 text-lg text-white/70">
            Badges, streaks, and rewards across the Games VLP library.
          </p>
          <Link
            href="/games"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Browse the game library →
          </Link>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-bold">Coming soon</h2>
            <p className="mt-4 text-white/70">
              A cross-game achievement system — badges for completion, streaks for return visits,
              and custom white-label rewards you can award your clients — is in active development.
            </p>
            <p className="mt-4 text-white/70">
              If you&apos;d like early access or want to configure custom achievements for your
              client-facing embeds, reach out.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Add achievements to your client games</h2>
          <p className="mt-3 text-white/70">
            We&apos;re onboarding early-access clients now.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Talk to us →
          </Link>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
