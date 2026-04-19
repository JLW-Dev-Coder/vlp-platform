'use client';

import Link from 'next/link';
import { Gavel, Inbox } from 'lucide-react';

export default function BiddingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Bidding</h1>
        <p className="mt-1 text-sm text-white/50">
          Active and past bids you&apos;ve placed on Website Lotto templates.
        </p>
      </div>

      {/* TODO: wire API call to GET /v1/wlvlp/bids/by-account/:account_id (not yet exposed) — bid lists are per-template today */}
      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
          <Gavel className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">Your bids</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
          Place bids on auction templates to win them at a lower price. We&apos;ll show your active
          bids and past wins here.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-white/40">
          <Inbox className="h-3.5 w-3.5" />
          <span>No active bids</span>
        </div>
        <Link
          href="/"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
        >
          Find Auction Templates
        </Link>
      </div>
    </div>
  );
}
