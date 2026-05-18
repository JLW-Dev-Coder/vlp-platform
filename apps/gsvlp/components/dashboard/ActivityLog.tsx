'use client';

import type { ReactNode } from 'react';

export type ActivityEntry = {
  disposition: string;
  label: string;
  description: string;
  timestamp: string;
  setter_name: string;
  note?: string;
};

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const ICONS: Record<string, ReactNode> = {
  interested: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M5 12l5 5L20 7" />
    </svg>
  ),
  wants_info: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M4 5h16v11H8l-4 4z" />
    </svg>
  ),
  left_message: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  not_a_fit: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  ),
  disconnected: (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke} aria-hidden>
      <path d="M10.68 13.31a16 16 0 0 0 3.41 2.61l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-2.61-3.41" />
      <path d="M5.09 5.09A2 2 0 0 1 7.09 4H10a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L11 12" />
      <path d="M2 2l20 20" />
    </svg>
  ),
};

const COLORS: Record<string, string> = {
  interested: '#22C55E',
  wants_info: '#F59E0B',
  left_message: '#3B82F6',
  not_a_fit: '#9ca3af',
  disconnected: '#9ca3af',
};

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const date = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${date} at ${time}`;
  } catch {
    return iso;
  }
}

export function ActivityLog({ entries }: { entries: ActivityEntry[] }) {
  const sorted = [...entries].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Activity</h2>
        <span className="text-xs uppercase tracking-widest text-white/40">History</span>
      </div>

      {sorted.length === 0 ? (
        <div className="py-6 text-center text-sm text-white/40">
          No activity yet — make your first call.
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((e, idx) => {
            const color = COLORS[e.disposition] ?? '#9ca3af';
            const icon = ICONS[e.disposition] ?? null;
            return (
              <div
                key={`${e.timestamp}-${idx}`}
                className="flex items-start gap-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <span className="shrink-0 pt-0.5" style={{ color }}>
                  {icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold" style={{ color }}>
                    {e.label}
                  </div>
                  <div className="text-xs text-white/50">{e.description}</div>
                  {e.note && (
                    <div className="mt-1 text-sm italic text-white/50">— &ldquo;{e.note}&rdquo;</div>
                  )}
                  <div className="mt-1 text-xs text-white/40">by {e.setter_name}</div>
                </div>
                <div className="shrink-0 text-xs text-white/40 whitespace-nowrap">
                  {formatTimestamp(e.timestamp)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
