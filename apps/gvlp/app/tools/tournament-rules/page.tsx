import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const dynamic = 'force-static';

export const metadata = {
  title: 'Tournament Rules',
  description: 'How Games VLP handles tournament-style competition across the game library.',
};

export default function TournamentRulesPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Tournament Rules
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Tournament Rules</h1>
          <p className="mt-6 text-lg text-white/70">
            Tournament-style competition for Games VLP.
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
              Tournament infrastructure is in active development. Our roadmap covers leaderboards,
              scoring rules, tie-breakers, and custom client-branded competitions layered over the
              existing game library.
            </p>
            <p className="mt-4 text-white/70">
              If you&apos;d like early access to run a tournament for your clients — or want to
              help shape the feature set — get in touch.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Want to run a custom tournament?</h2>
          <p className="mt-3 text-white/70">
            We&apos;re onboarding early-access clients now.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Set up a custom tournament →
          </Link>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
