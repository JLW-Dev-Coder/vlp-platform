'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import { StatCard } from '@/components/dashboard/StatCard';
import { ScriptCard } from '@/components/dashboard/ScriptCard';

interface DashboardStats {
  calls_today: number;
  appointments_booked: number;
  show_rate: number;
  pending_earnings: number;
}

interface FollowUp {
  id: string;
  row_number: number;
  tax_pro_name: string;
  credential: string;
  disposition: string;
  follow_up_date: string;
  created_at: string;
  status: 'pending' | 'completed';
}

const DISPOSITION_LABEL: Record<string, { label: string; color: string }> = {
  left_message: { label: 'Left Message', color: '#60A5FA' },
  wants_info: { label: 'Wants More Info', color: '#F59E0B' },
  voicemail: { label: 'Left Message', color: '#60A5FA' },
};

function relativeDaysAgo(iso: string): string {
  const created = new Date(iso);
  const now = new Date();
  const ms = now.getTime() - created.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days <= 0) return 'Set today';
  if (days === 1) return 'Set yesterday';
  return `Set ${days} days ago`;
}

function FollowUpsDueToday({ apiBaseUrl }: { apiBaseUrl: string }) {
  const [items, setItems] = useState<FollowUp[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`${apiBaseUrl}/v1/gsvlp/follow-ups?due=today`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error('fail');
        if (!cancelled) setItems(d.follow_ups || []);
      })
      .catch(() => { if (!cancelled) setItems([]); });
    return () => { cancelled = true; };
  }, [apiBaseUrl]);

  if (items === null) {
    return <div className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]" />;
  }

  if (items.length === 0) {
    return (
      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5 text-sm text-white/70">
        No follow-ups due today. Keep dialing! 🔥
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border-l-4 p-5"
      style={{
        borderLeftColor: '#F59E0B',
        background: 'linear-gradient(90deg, rgba(245,158,11,0.12), rgba(245,158,11,0.02))',
        boxShadow: '0 0 24px rgba(245,158,11,0.08)',
      }}
    >
      <h2 className="text-base font-bold text-white">
        You have {items.length} follow-up{items.length === 1 ? '' : 's'} due today
      </h2>
      <ul className="mt-4 space-y-3">
        {items.map((f) => {
          const disp = DISPOSITION_LABEL[f.disposition] || { label: f.disposition || '—', color: '#9ca3af' };
          return (
            <li
              key={f.id}
              className="flex flex-col gap-3 rounded-md border border-white/[0.06] bg-black/30 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white">{f.tax_pro_name}</span>
                  {f.credential && (
                    <span className="inline-block rounded-full bg-white/[0.06] px-2 py-0.5 text-xs font-semibold text-white/70">
                      {f.credential}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                  <span style={{ color: disp.color }} className="font-semibold">{disp.label}</span>
                  <span className="text-white/40">{relativeDaysAgo(f.created_at)}</span>
                </div>
              </div>
              <Link
                href={`/dashboard/calls/${f.row_number}`}
                className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#22C55E] px-4 text-sm font-bold text-black hover:bg-[#16A34A]"
              >
                Call Now →
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function DashboardHomePage() {
  const { config } = useAppShell();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setStats(null);
    const fetchJson = (path: string) =>
      fetch(`${config.apiBaseUrl}${path}`, { credentials: 'include' }).then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || `Failed: ${path}`);
        return d;
      });
    Promise.all([
      fetchJson('/v1/gsvlp/dashboard'),
      fetchJson('/v1/gsvlp/commissions').catch(() => null),
    ])
      .then(([dash, comm]) => {
        if (cancelled) return;
        const base = dash.stats as DashboardStats;
        const pending =
          comm && comm.summary && typeof comm.summary.pending === 'number'
            ? comm.summary.pending
            : base.pending_earnings;
        setStats({ ...base, pending_earnings: pending });
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load dashboard');
      });
    return () => { cancelled = true; };
  }, [config.apiBaseUrl, reloadKey]);

  const showAccent: 'green' | 'amber' =
    stats && stats.show_rate >= 75 ? 'green' : 'amber';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Your daily stats and the script that books calls.
        </p>
      </header>

      <FollowUpsDueToday apiBaseUrl={config.apiBaseUrl} />

      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm">
          <div className="font-semibold text-amber-300">Couldn&rsquo;t load your stats</div>
          <div className="mt-1 text-white/60">{error}</div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-3 rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04] hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : stats === null ? (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <StatCard label="Calls made today" value={stats.calls_today} accent="green" />
          <StatCard label="Appointments booked" value={stats.appointments_booked} accent="green" />
          <StatCard label="Show rate" value={`${stats.show_rate}%`} accent={showAccent} />
          <StatCard label="Pending earnings" value={`$${stats.pending_earnings}`} accent="gold" />
        </section>
      )}

      <ScriptCard />
    </div>
  );
}
