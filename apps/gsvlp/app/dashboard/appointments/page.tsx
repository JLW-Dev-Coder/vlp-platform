'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { AppointmentCard, type Appointment, type ApptStatus } from '@/components/dashboard/AppointmentCard';
import { CommissionSummary, type CommissionEntry } from '@/components/dashboard/CommissionSummary';

const FILTER_OPTIONS: Array<{ value: 'ALL' | ApptStatus; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'showed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

interface ApiAppt {
  id: string;
  tax_pro_name: string;
  tax_pro_credential: string;
  date: string;
  time: string;
  status: ApptStatus;
  commission: number;
}

interface ApiSummary {
  total: number;
  upcoming: number;
  showed: number;
  closed: number;
  no_show: number;
  total_earned: number;
  pending: number;
  show_rate: number;
}

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

export default function AppointmentsPage() {
  const { config } = useAppShell();
  const [appts, setAppts] = useState<Appointment[] | null>(null);
  const [summary, setSummary] = useState<ApiSummary | null>(null);
  const [commissions, setCommissions] = useState<CommissionsApi | null>(null);
  const [connect, setConnect] = useState<ConnectStatusApi | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | ApptStatus>('ALL');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setAppts(null);
    setSummary(null);
    setCommissions(null);
    setConnect(null);

    const fetchJson = (path: string) =>
      fetch(`${config.apiBaseUrl}${path}`, { credentials: 'include' }).then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || `Failed: ${path}`);
        return d;
      });

    Promise.all([
      fetchJson('/v1/gsvlp/appointments'),
      fetchJson('/v1/gsvlp/commissions').catch(() => null),
      fetchJson('/v1/gsvlp/stripe-connect/status').catch(() => null),
    ])
      .then(([apptRes, commRes, connRes]) => {
        if (cancelled) return;
        const cred = (c: string): 'EA' | 'CPA' | 'ATTY' =>
          c === 'CPA' || c === 'ATTY' ? c : 'EA';
        const mapped: Appointment[] = (apptRes.appointments ?? []).map((a: ApiAppt) => ({
          id: a.id,
          taxProName: a.tax_pro_name,
          credential: cred(a.tax_pro_credential),
          date: a.date,
          time: a.time,
          status: a.status,
          commission: a.commission,
        }));
        setAppts(mapped);
        setSummary(apptRes.summary ?? null);
        if (commRes) setCommissions(commRes as CommissionsApi);
        if (connRes) setConnect(connRes as ConnectStatusApi);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load appointments');
      });
    return () => {
      cancelled = true;
    };
  }, [config.apiBaseUrl, reloadKey]);

  const filtered = useMemo(
    () =>
      (appts ?? []).filter((a) => {
        if (filter === 'ALL') return true;
        if (filter === 'showed') return a.status === 'showed' || a.status === 'closed' || a.status === 'no_show';
        return a.status === filter;
      }),
    [appts, filter]
  );

  function cancelAppt(id: string) {
    setAppts((prev) =>
      (prev ?? []).map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  }

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
  const summaryTotals = commissions?.summary ?? {
    total_earned: summary?.total_earned ?? 0,
    total_paid: 0,
    pending: summary?.pending ?? 0,
    commission_count: 0,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Appointments</h1>
          <p className="mt-1 text-sm text-white/50">
            Logged bookings and commission status.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'ALL' | ApptStatus)}
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
        >
          {FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </header>

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
          <div className="font-semibold text-amber-300">Couldn&rsquo;t load appointments</div>
          <div className="mt-1 text-white/60">{error}</div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-3 rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04] hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : appts === null || summary === null ? (
        <>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]"
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <CommissionSummary
            totalEarned={summaryTotals.total_earned}
            totalPaid={summaryTotals.total_paid}
            pending={summaryTotals.pending}
            appointmentsSet={summary.total}
            showRate={summary.show_rate}
            commissions={commissions?.commissions ?? []}
          />

          <section className="space-y-3">
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-white/50">
                No appointments match this filter.
              </div>
            ) : (
              filtered.map((a) => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onCancel={cancelAppt}
                />
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
}
