'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Gavel, Inbox, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import {
  getMyBids,
  getActiveAuctionTemplates,
  type UserBid,
  type Template,
} from '@/lib/api';

export default function BiddingPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [bids, setBids] = useState<UserBid[] | null>(null);
  const [auctions, setAuctions] = useState<Template[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = (id: string) => {
    setLoading(true);
    setError('');
    Promise.all([getMyBids(id), getActiveAuctionTemplates()])
      .then(([myBids, activeAuctions]) => {
        setBids(myBids);
        setAuctions(activeAuctions);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : 'Failed to load bid activity')
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!accountId) return;
    load(accountId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Bidding</h1>
        <p className="mt-1 text-sm text-white/50">
          Active bids you&apos;ve placed on Website Lotto auction templates.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Couldn&apos;t load your bids</p>
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

      {!loading && !error && bids && bids.length > 0 && (
        <div className="space-y-3">
          {bids.map((b) => (
            <BidRow key={b.template_slug} bid={b} />
          ))}
        </div>
      )}

      {!loading && !error && bids && bids.length === 0 && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <Gavel className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No active bids yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
            You haven&apos;t placed any bids yet. Browse the template gallery to find your next site
            and enter an auction.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
            <Inbox className="h-3.5 w-3.5" />
            <span>Your bid activity appears here once you start bidding.</span>
          </div>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            Find Auction Templates
          </Link>
        </div>
      )}

      {!loading && !error && auctions && auctions.length > 0 && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white/30" />
            <h3 className="text-xs uppercase tracking-widest text-white/40">
              Active Auctions ({auctions.length})
            </h3>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {auctions.slice(0, 8).map((t) => (
              <Link
                key={t.slug}
                href={`/sites/${t.slug}`}
                className="flex items-center justify-between rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
              >
                <span className="truncate">{t.title}</span>
                <span className="ml-2 shrink-0 text-xs text-white/40">
                  {t.current_bid != null ? `$${t.current_bid}` : 'Open'}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BidRow({ bid }: { bid: UserBid }) {
  const placed = new Date(bid.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const endsDate = bid.auction_ends_at ? new Date(bid.auction_ends_at) : null;
  const ends = endsDate
    ? endsDate.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;
  const ended = endsDate ? endsDate.getTime() < Date.now() : false;

  const statusLabel = ended
    ? bid.is_winning
      ? 'Won'
      : 'Lost'
    : bid.is_winning
      ? 'Winning'
      : 'Outbid';
  const statusClass = ended
    ? bid.is_winning
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : 'text-white/60 bg-white/5 border-white/10'
    : bid.is_winning
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
      : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <Gavel className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <Link
            href={`/sites/${bid.template_slug}`}
            className="text-base font-semibold text-white hover:text-brand-primary"
          >
            {bid.template_title}
          </Link>
          <div className="mt-1 flex items-center gap-3 text-xs text-white/50">
            <span>Placed {placed}</span>
            {ends && (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {ended ? `Ended ${ends}` : `Ends ${ends}`}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-xs uppercase tracking-wider text-white/40">Your bid</p>
          <p className="font-mono text-lg font-semibold text-white">${bid.amount}</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>
    </div>
  );
}
