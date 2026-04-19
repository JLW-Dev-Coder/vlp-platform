'use client';

import { BarChart3 } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Reports</h1>
        <p className="mt-1 text-sm text-white/50">
          Activity summaries for your sites, bids, votes, and purchases.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
          <BarChart3 className="h-6 w-6 text-brand-primary" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-white">Reports coming soon</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
          We&apos;re building a rollup of your Website Lotto activity — bids placed, votes cast,
          prizes won, and hosting usage, all in one view.
        </p>
      </div>
    </div>
  );
}
