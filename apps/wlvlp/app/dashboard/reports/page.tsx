'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Globe,
  Trophy,
  Gavel,
  Server,
  AlertCircle,
  Inbox,
} from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import {
  getMySites,
  getScratchPrizes,
  getMyBids,
  type PurchasedSite,
  type ScratchPrize,
  type UserBid,
} from '@/lib/api';

interface ReportData {
  sites: PurchasedSite[];
  prizes: ScratchPrize[];
  bids: UserBid[];
}

export default function ReportsPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = (id: string) => {
    setLoading(true);
    setError('');
    Promise.all([getMySites(id), getScratchPrizes(id), getMyBids(id)])
      .then(([sites, prizes, bids]) => setData({ sites, prizes, bids }))
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load activity')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!accountId) return;
    load(accountId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  const sitesCount = data?.sites.length ?? 0;
  const activeHosting =
    data?.sites.filter((s) => s.hosting_status === 'active').length ?? 0;
  const prizesCount = data?.prizes.length ?? 0;
  const unredeemedPrizes =
    data?.prizes.filter((p) => !p.redeemed).length ?? 0;
  const activeBids = data?.bids.length ?? 0;
  const winningBids = data?.bids.filter((b) => b.is_winning).length ?? 0;

  const hasAnyActivity =
    sitesCount > 0 || prizesCount > 0 || activeBids > 0;

  const timeline = buildTimeline(data);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-white/50">
          A rollup of your Website Lotto activity — sites, hosting, bids, and prizes.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Couldn&apos;t load your activity</p>
            <p className="mt-1 text-amber-200/70">{error}</p>
            <button
              type="button"
              onClick={() => accountId && load(accountId)}
              className="mt-3 inline-flex rounded-lg border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100 hover:bg-amber-400/20"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && !hasAnyActivity && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <BarChart3 className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No activity yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
            Your activity report will appear here once you start using Website Lotto — buy or win a
            template, place a bid, or scratch a ticket.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Inbox className="h-3.5 w-3.5" />
            <span>Reports populate automatically from your account activity.</span>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
            >
              Browse Templates
            </Link>
            <Link
              href="/scratch"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              Free Scratch Ticket
            </Link>
          </div>
        </div>
      )}

      {!loading && !error && hasAnyActivity && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile
              icon={<Globe className="h-4 w-4 text-white/30" />}
              label="Sites Owned"
              value={sitesCount}
              sub={`${activeHosting} active hosting`}
            />
            <StatTile
              icon={<Server className="h-4 w-4 text-white/30" />}
              label="Active Hosting"
              value={activeHosting}
              sub={`${sitesCount - activeHosting} inactive`}
            />
            <StatTile
              icon={<Gavel className="h-4 w-4 text-white/30" />}
              label="Active Bids"
              value={activeBids}
              sub={`${winningBids} winning`}
            />
            <StatTile
              icon={<Trophy className="h-4 w-4 text-white/30" />}
              label="Prizes Won"
              value={prizesCount}
              sub={`${unredeemedPrizes} unredeemed`}
            />
          </div>

          <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
            <h3 className="text-xs uppercase tracking-widest text-white/40">Recent Activity</h3>
            {timeline.length === 0 ? (
              <p className="mt-4 text-sm text-white/50">
                No recent activity to display.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {timeline.map((e, i) => (
                  <li
                    key={`${e.at}-${i}`}
                    className="flex items-start gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                      {e.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm text-white">{e.label}</p>
                      <p className="text-xs text-white/40">
                        {new Date(e.at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    {e.href && (
                      <Link
                        href={e.href}
                        className="ml-2 shrink-0 text-xs text-brand-primary hover:underline"
                      >
                        View →
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs uppercase tracking-widest text-white/40">{label}</h3>
      </div>
      <p className="mt-3 text-4xl font-bold text-brand-primary">{value}</p>
      {sub && <p className="mt-1 text-xs text-white/50">{sub}</p>}
    </div>
  );
}

interface TimelineEvent {
  at: string;
  label: string;
  href?: string;
  icon: React.ReactNode;
}

function buildTimeline(data: ReportData | null): TimelineEvent[] {
  if (!data) return [];
  const events: TimelineEvent[] = [];
  for (const s of data.sites) {
    events.push({
      at: s.purchased_at,
      label: `Purchased ${s.title}`,
      href: '/dashboard/sites',
      icon: <Globe className="h-4 w-4 text-brand-primary" />,
    });
  }
  for (const p of data.prizes) {
    if (p.revealed_at) {
      events.push({
        at: p.revealed_at,
        label: `Won prize: ${p.prize}`,
        href: '/dashboard/winning',
        icon: <Trophy className="h-4 w-4 text-brand-primary" />,
      });
    }
  }
  for (const b of data.bids) {
    events.push({
      at: b.created_at,
      label: `Bid $${b.amount} on ${b.template_title}`,
      href: '/dashboard/bidding',
      icon: <Gavel className="h-4 w-4 text-brand-primary" />,
    });
  }
  events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  return events.slice(0, 10);
}
