'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { StatCard } from '@/components/dashboard/StatCard';
import { ScriptCard } from '@/components/dashboard/ScriptCard';

interface DashboardStats {
  calls_today: number;
  appointments_booked: number;
  show_rate: number;
  pending_earnings: number;
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
    fetch(`${config.apiBaseUrl}/v1/gsvlp/dashboard`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to load dashboard');
        return d;
      })
      .then((d) => {
        if (!cancelled) setStats(d.stats);
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
