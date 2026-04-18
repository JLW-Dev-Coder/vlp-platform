import Link from 'next/link';
import { ContentCard } from '@vlp/member-ui';

export default function GamesWorkspacePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Game Access JS</h1>
        <p className="mt-2 text-sm text-white/60">
          Embed codes, token balance, and game library — everything you need to get games live on
          your site.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/embed" className="block transition hover:-translate-y-0.5">
          <ContentCard title="Embed Codes">
            <p className="text-sm text-white/70">
              Copy the iframe or script tag for any game in your tier and drop it onto your site.
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-[#22c55e]">Open →</p>
          </ContentCard>
        </Link>

        <Link href="/dashboard/tokens" className="block transition hover:-translate-y-0.5">
          <ContentCard title="Token Balance">
            <p className="text-sm text-white/70">
              Current monthly token balance, consumption history, and usage analytics.
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-[#22c55e]">Open →</p>
          </ContentCard>
        </Link>

        <Link href="/games" className="block transition hover:-translate-y-0.5">
          <ContentCard title="Game Library">
            <p className="text-sm text-white/70">
              Browse the full catalog of 9 tax-themed mini-games available to embed.
            </p>
            <p className="mt-4 text-xs uppercase tracking-widest text-[#22c55e]">Browse →</p>
          </ContentCard>
        </Link>
      </div>
    </div>
  );
}
