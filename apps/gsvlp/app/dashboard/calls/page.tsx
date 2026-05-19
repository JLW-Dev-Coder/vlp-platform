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
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreMsg, setLoadMoreMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null);
  const [poolExhausted, setPoolExhausted] = useState(false);

  const uncalledCount = rows ? rows.filter((r) => r.status === 'not_called').length : 0;
  const allCalled = rows !== null && rows.length > 0 && uncalledCount === 0;

  async function handleLoadMore() {
    if (loadingMore) return;
    if (!window.confirm('Load 50 more prospects into your call list?')) return;
    setLoadingMore(true);
    setLoadMoreMsg(null);
    try {
      const r = await fetch(`${config.apiBaseUrl}/v1/gsvlp/call-list/load-more`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ count: 50 }),
      });
      const d = await r.json().catch(() => ({}));
      if (d.ok) {
        setLoadMoreMsg({ kind: 'success', text: `Added ${d.added} new prospect${d.added === 1 ? '' : 's'}!` });
        if (d.pool_exhausted) setPoolExhausted(true);
        setReloadKey((k) => k + 1);
      } else if (d.error === 'no_prospects_available') {
        setPoolExhausted(true);
        setLoadMoreMsg({
          kind: 'error',
          text: 'No more prospects available right now. Contact support for a new batch.',
        });
      } else {
        setLoadMoreMsg({ kind: 'error', text: d.message || 'Failed to load more prospects.' });
      }
    } catch (e) {
      setLoadMoreMsg({
        kind: 'error',
        text: e instanceof Error ? e.message : 'Failed to load more prospects.',
      });
    } finally {
      setLoadingMore(false);
    }
  }

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
        <>
          <CallListTable
            initialData={rows}
            apiBaseUrl={config.apiBaseUrl}
            statusFilter={activeFilter}
          />

          {loadMoreMsg ? (
            <div
              className={`rounded-lg border p-4 text-sm ${
                loadMoreMsg.kind === 'success'
                  ? 'border-[#22C55E]/30 bg-[#22C55E]/[0.06] text-[#22C55E]'
                  : 'border-amber-500/30 bg-amber-500/[0.06] text-amber-300'
              }`}
            >
              {loadMoreMsg.text}
            </div>
          ) : null}

          {poolExhausted ? (
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 text-center text-sm text-white/60">
              No more prospects available right now. Contact support for a new batch.
            </div>
          ) : allCalled ? (
            <div className="rounded-xl border border-[#22C55E]/40 bg-[#22C55E]/[0.06] p-6 text-center">
              <div className="text-lg font-semibold text-white">
                You&rsquo;ve called everyone in your batch!
              </div>
              <p className="mt-1 text-sm text-white/70">
                Ready for more? Load another 50 prospects into your call list.
              </p>
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="mt-4 inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
                style={{ background: '#22C55E', color: '#0A0A0A' }}
              >
                {loadingMore ? 'Loading…' : 'Load More Prospects'}
              </button>
            </div>
          ) : (
            <div className="text-center text-xs text-white/40">
              Need more prospects?{' '}
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="text-white/60 underline underline-offset-2 hover:text-white disabled:opacity-60"
              >
                {loadingMore ? 'Loading…' : 'Load more into your list'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
