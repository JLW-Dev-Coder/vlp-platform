import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const metadata = {
  title: 'Contact',
  description: 'Talk to the Games VLP team about embedding tax games on your practice site.',
};

export default function ContactPage() {
  const introHref = `https://cal.com/${gvlpConfig.calIntroSlug}`;
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-3xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Contact
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Let&apos;s Talk</h1>
          <p className="mt-4 text-lg text-white/70">
            Questions about embedding games on your site, bulk licensing for a firm, or white-label
            setup? Book a 15-minute intro call and we&apos;ll walk through it with you.
          </p>
        </section>

        <section className="mx-auto max-w-3xl px-6 pb-24">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold">Book an Intro Call</h2>
            <p className="mt-2 text-white/70">
              Pick a time that works — we&apos;ll answer any question about Games VLP.
            </p>
            <a
              href={introHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Schedule on Cal.com →
            </a>
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-8 text-center">
            <h2 className="text-xl font-semibold">Prefer to explore first?</h2>
            <p className="mt-2 text-white/70">
              Browse the library or read the features overview before booking.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/games"
                className="rounded-lg border border-white/20 px-5 py-2 font-semibold hover:bg-white/10"
              >
                Browse Games
              </Link>
              <Link
                href="/features"
                className="rounded-lg border border-white/20 px-5 py-2 font-semibold hover:bg-white/10"
              >
                See Features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
