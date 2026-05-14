'use client';

export type Disposition =
  | 'interested'
  | 'wants_info'
  | 'voicemail'
  | 'not_fit'
  | 'disconnected';

interface Option {
  key: Disposition;
  icon: string;
  label: string;
  sublabel: string;
  color: string;
  border: string;
  bg: string;
}

const OPTIONS: Option[] = [
  {
    key: 'interested',
    icon: '✅',
    label: 'Interested — Book It',
    sublabel: 'They want to talk to JLW',
    color: '#22C55E',
    border: 'rgba(34,197,94,0.5)',
    bg: 'rgba(34,197,94,0.08)',
  },
  {
    key: 'wants_info',
    icon: '💬',
    label: 'Wants More Info',
    sublabel: "They're curious but not ready to book",
    color: '#F59E0B',
    border: 'rgba(245,158,11,0.5)',
    bg: 'rgba(245,158,11,0.08)',
  },
  {
    key: 'voicemail',
    icon: '📱',
    label: 'Left Message',
    sublabel: "Got voicemail or they'll call back",
    color: '#60A5FA',
    border: 'rgba(96,165,250,0.5)',
    bg: 'rgba(96,165,250,0.08)',
  },
  {
    key: 'not_fit',
    icon: '❌',
    label: 'Not a Good Fit',
    sublabel: "They're not interested",
    color: '#9ca3af',
    border: 'rgba(255,255,255,0.12)',
    bg: 'rgba(255,255,255,0.03)',
  },
  {
    key: 'disconnected',
    icon: '📵',
    label: 'Call Disconnected',
    sublabel: 'Wrong number, hung up, no answer',
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
        <h2 className="text-lg font-semibold text-white">Step 2 — How did the call go?</h2>
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
              className="flex w-full items-center gap-4 rounded-lg border p-4 text-left transition disabled:opacity-30"
              style={{
                borderColor: isActive ? o.color : o.border,
                background: isActive ? o.bg : 'transparent',
              }}
            >
              <span className="text-2xl" aria-hidden>
                {o.icon}
              </span>
              <span className="flex-1">
                <span className="block text-base font-semibold" style={{ color: o.color }}>
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
