'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { CallListTable, type TaxPro, type CallStatus } from '@/components/dashboard/CallListTable';

type FilterKey = 'ALL' | CallStatus;

interface FilterCard {
  key: FilterKey;
  label: string;
  sublabel: string;
  color: string;
  icon?: string;
}

const FILTER_CARDS: FilterCard[] = [
  { key: 'ALL', label: 'All', sublabel: 'Show everyone', color: '#FFFFFF' },
  { key: 'not_called', label: 'Not Called', sublabel: "Haven't reached yet", color: '#666666' },
  { key: 'interested', label: 'Interested', sublabel: 'They want to talk to JLW', color: '#22C55E', icon: '✓' },
  { key: 'wants_info', label: 'Wants More Info', sublabel: 'Tell them about our products', color: '#F59E0B', icon: '💬' },
  { key: 'left_message', label: 'Left Message', sublabel: 'Got voicemail or asked to call back', color: '#3B82F6', icon: '📱' },
  { key: 'not_a_fit', label: 'Not a Good Fit', sublabel: 'Not interested right now', color: '#555555', icon: '✕' },
  { key: 'disconnected', label: 'Call Disconnected', sublabel: 'Wrong number, no answer, hung up', color: '#444444', icon: '⊘' },
];

export default function CallsPage() {
  const { config } = useAppShell();
  const [rows, setRows] = useState<TaxPro[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('ALL');

  useEffect(() => {
    let cancelled = false;
    setError(null);
    setRows(null);
    fetch(`${config.apiBaseUrl}/v1/gsvlp/call-list`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to load call list');
        return d;
      })
      .then((d) => {
        if (cancelled) return;
        const mapped: TaxPro[] = (d.batch?.rows ?? []).map((r: {
          row_number: number;
          full_name: string;
          dba: string;
          city: string;
          state: string;
          phone: string;
          profession: 'EA' | 'CPA' | 'ATTY';
          status: CallStatus;
        }) => ({
          id: String(r.row_number),
          fullName: r.full_name,
          dba: r.dba,
          city: r.city,
          state: r.state,
          phone: r.phone,
          profession: r.profession,
          status: r.status,
        }));
        setRows(mapped);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load call list');
      });
    return () => { cancelled = true; };
  }, [config.apiBaseUrl, reloadKey]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Call List</h1>
          <p className="mt-1 text-sm text-white/50">
            FOIA-sourced tax pros. Filter, call, and log appointments.
          </p>
        </div>
      </header>

      {/* Disposition filter cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
        {FILTER_CARDS.map((c) => {
          const isActive = activeFilter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setActiveFilter(c.key)}
              className="flex min-h-[64px] cursor-pointer flex-col items-start justify-center rounded-lg border p-4 text-left transition"
              style={
                isActive
                  ? {
                      borderColor: c.color,
                      background: c.color,
                      color: c.key === 'ALL' ? '#0A0A0A' : '#FFFFFF',
                      boxShadow: `0 0 0 1px ${c.color}, 0 4px 16px ${c.color}40`,
                    }
                  : {
                      borderColor: 'rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }
              }
            >
              <span
                className="text-sm font-bold leading-tight"
                style={{
                  color: isActive ? (c.key === 'ALL' ? '#0A0A0A' : '#FFFFFF') : '#FFFFFF',
                }}
              >
                {c.icon ? <span className="mr-1">{c.icon}</span> : null}
                {c.label}
              </span>
              <span
                className="mt-1 text-[11px] leading-tight"
                style={{
                  color: isActive
                    ? c.key === 'ALL'
                      ? 'rgba(0,0,0,0.7)'
                      : 'rgba(255,255,255,0.85)'
                    : 'rgba(255,255,255,0.5)',
                }}
              >
                {c.sublabel}
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm">
          <div className="font-semibold text-amber-300">Couldn&rsquo;t load your call list</div>
          <div className="mt-1 text-white/60">{error}</div>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-3 rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04] hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : rows === null ? (
        <div className="space-y-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]"
            />
          ))}
        </div>
      ) : (
        <CallListTable
          initialData={rows}
          apiBaseUrl={config.apiBaseUrl}
          statusFilter={activeFilter}
        />
      )}
    </div>
  );
}
