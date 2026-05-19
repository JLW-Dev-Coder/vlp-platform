'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { StatCard } from '@/components/dashboard/StatCard';
import type { CommissionEntry } from '@/components/dashboard/CommissionSummary';

interface CommissionsApi {
  ok: boolean;
  summary: {
    total_earned: number;
    total_paid: number;
    pending: number;
    commission_count: number;
  };
  commissions: CommissionEntry[];
}

interface ConnectStatusApi {
  ok: boolean;
  connected: boolean;
  onboarding_complete?: boolean;
}

function fmtMoney(n: number) {
  return `$${(Math.round((n || 0) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function PayoutsPage() {
  const { config } = useAppShell();
  const [commissions, setCommissions] = useState<CommissionsApi | null>(null);
  const [connect, setConnect] = useState<ConnectStatusApi | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setCommissions(null);
    setConnect(null);

    const fetchJson = (path: string) =>
      fetch(`${config.apiBaseUrl}${path}`, { credentials: 'include' }).then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || `Failed: ${path}`);
        return d;
      });

    Promise.all([
      fetchJson('/v1/gsvlp/commissions').catch(() => null),
      fetchJson('/v1/gsvlp/stripe-connect/status').catch(() => null),
    ])
      .then(([commRes, connRes]) => {
        if (cancelled) return;
        if (commRes) setCommissions(commRes as CommissionsApi);
        if (connRes) setConnect(connRes as ConnectStatusApi);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load payouts');
      });
    return () => {
      cancelled = true;
    };
  }, [config.apiBaseUrl, reloadKey]);

  const startConnectOnboarding = useCallback(async () => {
    setConnecting(true);
    try {
      const res = await fetch(`${config.apiBaseUrl}/v1/gsvlp/stripe-connect/onboard`, {
        method: 'POST',
        credentials: 'include',
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok || !d.onboarding_url) {
        throw new Error(d.error || 'Could not start Stripe onboarding');
      }
      window.location.href = d.onboarding_url;
    } catch (e) {
      setConnecting(false);
      setError(e instanceof Error ? e.message : 'Could not start Stripe onboarding');
    }
  }, [config.apiBaseUrl]);

  const isConnected = !!(connect?.connected && connect?.onboarding_complete);
  const totals = commissions?.summary ?? {
    total_earned: 0,
    total_paid: 0,
    pending: 0,
    commission_count: 0,
  };
  const list = commissions?.commissions ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Payouts</h1>
        <p className="mt-1 text-sm text-white/50">
          Commission earnings and Stripe payout status.
        </p>
      </header>

      <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">
          How You Get Paid
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            {
              n: 1,
              title: 'You book an appointment',
              body: 'Call a prospect from your list and book a qualified appointment with JLW.',
            },
            {
              n: 2,
              title: 'JLW closes the deal',
              body: 'JLW meets with the prospect. If they purchase, your commission is triggered automatically.',
            },
            {
              n: 3,
              title: 'Commission is tracked',
              body: 'When the prospect completes their purchase through Stripe, we automatically match it to your booked appointment and calculate your 20% commission.',
            },
            {
              n: 4,
              title: 'You get paid',
              body: 'Payouts are sent to your connected payout method (Stripe or Payoneer). Check your Account page to set up your payout preference.',
            },
          ].map((s) => (
            <div
              key={s.n}
              className="relative rounded-md border border-white/[0.06] bg-black/20 p-4"
            >
              <div
                className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold text-black"
                style={{ background: '#22C55E' }}
              >
                {s.n}
              </div>
              <div className="text-sm font-semibold text-white">{s.title}</div>
              <div className="mt-1 text-xs leading-relaxed text-white/60">{s.body}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/40">
          Questions? Visit the Support page to book a call with JLW.
        </p>
      </section>

      {connect &&
        (isConnected ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/[0.08] px-3 py-1 text-xs font-semibold text-green-300">
            <span aria-hidden="true">✓</span>
            Stripe connected — payouts are automatic
          </div>
        ) : (
          <section
            className="rounded-lg border-2 p-5"
            style={{ borderColor: '#FFD700', background: 'rgba(255, 215, 0, 0.04)' }}
          >
            <h2 className="text-lg font-semibold text-white">
              Connect your Stripe account to receive payouts
            </h2>
            <p className="mt-1 text-sm text-white/70">
              Your commissions are being tracked. Connect Stripe to get paid.
            </p>
            <button
              type="button"
              onClick={startConnectOnboarding}
              disabled={connecting}
              className="mt-4 inline-flex h-14 items-center justify-center rounded-md px-6 text-base font-semibold text-black transition hover:brightness-95 disabled:opacity-60"
              style={{ background: '#FFD700' }}
            >
              {connecting ? 'Opening Stripe…' : 'Connect Stripe'}
            </button>
          </section>
        ))}

      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm">
          <div className="font-semibold text-amber-300">Couldn&rsquo;t load payouts</div>
          <div className="mt-1 text-white/60">{error}</div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-3 rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04] hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : commissions === null ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <StatCard label="Total earned" value={fmtMoney(totals.total_earned)} accent="gold" />
            <StatCard label="Paid" value={fmtMoney(totals.total_paid)} accent="green" />
            <StatCard label="Pending" value={fmtMoney(totals.pending)} accent="white" />
          </div>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">
              Commission history
            </h2>
            {list.length === 0 ? (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-white/50">
                No commissions yet. Book and close deals to start earning.
              </div>
            ) : (
              <div className="space-y-2">
                {list.map((c) => (
                  <div
                    key={c.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-white">{c.tax_pro_name || 'Tax pro'}</div>
                      <div className="text-xs text-white/50">
                        Paid {fmtMoney(c.amount_paid)} · {fmtDate(c.created_at)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          c.status === 'paid'
                            ? 'bg-green-500/15 text-green-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {c.status === 'paid' ? 'Paid out' : 'Pending payout'}
                      </span>
                      <div className="text-right">
                        <div className="font-semibold text-[#FFD700]">
                          {fmtMoney(c.commission_amount)}
                        </div>
                        {c.paid_at && (
                          <div className="text-xs text-white/40">{fmtDate(c.paid_at)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
