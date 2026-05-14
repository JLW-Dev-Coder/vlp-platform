'use client';

import type { ReactNode } from 'react';

export type Disposition =
  | 'interested'
  | 'wants_info'
  | 'voicemail'
  | 'not_fit'
  | 'disconnected';

interface Option {
  key: Disposition;
  icon: ReactNode;
  label: string;
  sublabel: string;
  color: string;
  border: string;
  bg: string;
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const Check = (
  <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden>
    <path d="M5 12l5 5L20 7" />
  </svg>
);
const Message = (
  <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden>
    <path d="M4 5h16v11H8l-4 4z" />
  </svg>
);
const Phone = (
  <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const X = (
  <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden>
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);
const PhoneOff = (
  <svg width="28" height="28" viewBox="0 0 24 24" {...stroke} aria-hidden>
    <path d="M10.68 13.31a16 16 0 0 0 3.41 2.61l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-2.61-3.41" />
    <path d="M5.09 5.09A2 2 0 0 1 7.09 4H10a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L11 12" />
    <path d="M2 2l20 20" />
  </svg>
);

const OPTIONS: Option[] = [
  {
    key: 'interested',
    icon: Check,
    label: 'Interested — Book It',
    sublabel: 'They want to talk to JLW',
    color: '#22C55E',
    border: 'rgba(34,197,94,0.5)',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    key: 'wants_info',
    icon: Message,
    label: 'Wants More Info',
    sublabel: 'Tell them about our products',
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    key: 'voicemail',
    icon: Phone,
    label: 'Left Message',
    sublabel: 'Got voicemail or asked to call back',
    color: '#3B82F6',
    border: 'rgba(59,130,246,0.5)',
    bg: 'rgba(59,130,246,0.08)',
  },
  {
    key: 'not_fit',
    icon: X,
    label: 'Not a Good Fit',
    sublabel: 'Not interested right now',
    color: '#9ca3af',
    border: 'rgba(255,255,255,0.12)',
    bg: 'rgba(255,255,255,0.03)',
  },
  {
    key: 'disconnected',
    icon: PhoneOff,
    label: 'Call Disconnected',
    sublabel: 'Wrong number, no answer, hung up',
    color: '#9ca3af',
    border: 'rgba(255,255,255,0.12)',
    bg: 'rgba(255,255,255,0.03)',
  },
];

export function DispositionButtons({
  activeDisposition,
  onSelect,
}: {
  activeDisposition: Disposition | null;
  onSelect: (d: Disposition) => void;
}) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">How did the call go?</h2>
        <span className="text-xs uppercase tracking-widest text-white/40">Disposition</span>
      </div>
      <div className="space-y-3">
        {OPTIONS.map((o) => {
          const isActive = activeDisposition === o.key;
          const dim = activeDisposition !== null && !isActive;
          return (
            <button
              key={o.key}
              type="button"
              onClick={() => onSelect(o.key)}
              disabled={dim}
              className="flex w-full min-h-[64px] items-center gap-4 rounded-lg border p-4 text-left transition disabled:opacity-30"
              style={{
                borderColor: isActive ? o.color : o.border,
                background: isActive ? o.bg : 'transparent',
                color: o.color,
              }}
            >
              <span className="shrink-0">{o.icon}</span>
              <span className="flex-1">
                <span className="block text-base font-bold" style={{ color: o.color }}>
                  {o.label}
                </span>
                <span className="block text-xs text-white/50">{o.sublabel}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
