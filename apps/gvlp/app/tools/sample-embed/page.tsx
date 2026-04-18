'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export const dynamic = 'force-static';

const GAME_URL = 'https://games.virtuallaunch.pro/games/tax-trivia.html';
const EMBED_CODE = `<iframe
  src="${GAME_URL}"
  width="800"
  height="500"
  frameborder="0"
  allowfullscreen
  title="Tax Trivia by Games VLP"
></iframe>`;

export default function SampleEmbedPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(EMBED_CODE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className="relative overflow-hidden bg-[#0a0410] text-white">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs uppercase tracking-widest text-white/60">
            Sample Embed
          </span>
          <h1 className="mt-4 text-4xl font-bold sm:text-5xl">Sample Embed</h1>
          <p className="mt-6 text-lg text-white/70">
            See how a Games VLP game looks on your site — and grab the embed code.
          </p>
          <Link
            href="/games"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
          >
            Browse the full game library →
          </Link>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-16">
          <h2 className="mb-6 text-2xl font-bold">Live demo</h2>
          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/5 p-2">
            <iframe
              src={GAME_URL}
              width="800"
              height="500"
              title="Tax Trivia by Games VLP"
              className="mx-auto block aspect-[8/5] w-full max-w-[800px] rounded-lg border-0"
              allowFullScreen
            />
          </div>
          <p className="mt-3 text-sm text-white/60">
            This is Tax Trivia — one of nine games in the library. Every game embeds the same way.
          </p>
        </section>

        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Embed code</h2>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="mt-2 text-sm text-white/60">
            Paste this into any HTML page on your site.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-6 text-sm leading-relaxed text-white/90">
            <code>{EMBED_CODE}</code>
          </pre>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Want to embed every game?</h2>
          <p className="mt-3 text-white/70">
            The full library has nine tax-themed games across four tiers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 font-semibold text-black hover:opacity-90"
            >
              Browse the library →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Talk to us about white-label embeds
            </Link>
          </div>
        </section>
      </main>
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
