'use client';

import type { TaxPro } from './CallListTable';

const credColors: Record<TaxPro['profession'], { bg: string; text: string }> = {
  EA: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  CPA: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  ATTY: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
};

export function LeadDetailCard({ lead }: { lead: TaxPro }) {
  const tel = lead.phone.replace(/\D/g, '');
  const c = credColors[lead.profession];
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-2xl font-semibold text-white">{lead.fullName}</div>
          <div className="mt-1 text-white/60">{lead.dba}</div>
          <div className="mt-2 text-sm text-white/50">
            {lead.city}, {lead.state}
          </div>
        </div>
        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
          style={{ background: c.bg, color: c.text }}
        >
          {lead.profession}
        </span>
      </div>
      <div className="mt-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
          Phone
        </div>
        <div className="text-xl font-semibold text-[#22C55E]">{lead.phone}</div>
      </div>
      <a
        href={`tel:${tel}`}
        className="mt-5 flex min-h-[64px] w-full items-center justify-center gap-3 rounded-md bg-[#22C55E] px-4 text-lg font-bold text-white hover:bg-[#16A34A]"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Call {lead.phone}
      </a>
    </div>
  );
}
