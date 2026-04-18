import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const metadata = {
  title: 'About',
  description: 'Why Games Virtual Launch Pro exists and who it serves.',
};

export default function AboutPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-4xl px-6 py-24">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            About
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Why Games VLP Exists</h1>
          <p className="mt-6 text-lg text-white/70">
            {gvlpConfig.marketing!.summary}
          </p>
        </section>

        <section className="mx-auto max-w-4xl space-y-6 px-6 pb-16 text-white/80">
          <p>
            Tax practices compete on trust, expertise, and client experience. Everyone has a blog.
            Everyone emails the same 2-page PDF checklist. Nothing on those websites makes a client
            come back between appointments.
          </p>
          <p>
            Games VLP exists to change that. We build drop-in, tax-themed mini-games that accountants,
            enrolled agents, and tax strategists embed on their own sites. Clients play, learn
            real tax concepts, and return — which means the practice stays top-of-mind year-round,
            not just during the March-to-April rush.
          </p>
          <p>
            The philosophy is simple: education sticks when it&apos;s fun. A client who spins a wheel
            and learns about Section 179 will remember it. A client who scrolls past a blog post
            will not. Every game in the library is built to teach something useful — quickly,
            clearly, and with enough retention to carry into a real consultation.
          </p>
          <p>
            We serve solo tax pros who want a modern-looking practice, mid-size firms building
            referral pipelines, and anyone who wants to differentiate without writing a single line
            of code. If that sounds like you, the library is open.
          </p>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Ready to try it?</h2>
          <p className="mt-3 text-white/70">Browse the library and pick a game to embed.</p>
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
