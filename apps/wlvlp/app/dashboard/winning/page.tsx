'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Ticket, AlertCircle } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import { getScratchPrizes, type ScratchPrize } from '@/lib/api';

export default function WinningPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [prizes, setPrizes] = useState<ScratchPrize[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getScratchPrizes(accountId)
      .then(setPrizes)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load prizes'))
      .finally(() => setLoading(false));
  }, [accountId]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Winning</h1>
        <p className="mt-1 text-sm text-white/50">
          Prizes you&apos;ve won from scratch tickets and Website Lotto auctions.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Couldn&apos;t load prizes</p>
            <p className="mt-1 text-amber-200/70">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && prizes && prizes.length === 0 && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <Trophy className="h-6 w-6 text-brand-primary" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No prizes yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/50">
            Scratch a ticket to try your luck — discounts, free templates, and bonus hosting
            credits are up for grabs.
          </p>
          <Link
            href="/scratch"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            <Ticket className="h-4 w-4" />
            Free Scratch Ticket
          </Link>
        </div>
      )}

      {!loading && !error && prizes && prizes.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {prizes.map((p) => (
            <PrizeCard key={p.ticket_id} prize={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function PrizeCard({ prize }: { prize: ScratchPrize }) {
  const revealed = prize.revealed_at
    ? new Date(prize.revealed_at).toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  return (
    <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
          <Trophy className="h-5 w-5 text-brand-primary" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-white/40">Prize</p>
          <p className="text-base font-semibold text-white">{prize.prize}</p>
        </div>
      </div>

      {prize.prize_code && (
        <div className="mt-4 rounded-lg border border-brand-primary/20 bg-brand-primary/5 px-4 py-3">
          <p className="text-xs uppercase tracking-wider text-white/40">Redemption Code</p>
          <p className="mt-1 font-mono text-sm text-brand-primary">{prize.prize_code}</p>
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
        {revealed && (
          <div>
            <dt className="uppercase tracking-wider text-white/40">Revealed</dt>
            <dd className="mt-0.5 text-white/70">{revealed}</dd>
          </div>
        )}
        <div>
          <dt className="uppercase tracking-wider text-white/40">Status</dt>
          <dd className="mt-0.5 text-white/70">{prize.redeemed ? 'Redeemed' : 'Available'}</dd>
        </div>
      </dl>
    </div>
  );
}
