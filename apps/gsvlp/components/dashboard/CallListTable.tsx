'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type CallStatus = 'not_called' | 'called' | 'booked';
export type Credential = 'EA' | 'CPA' | 'ATTY';

export interface TaxPro {
  id: string;
  fullName: string;
  dba: string;
  city: string;
  state: string;
  phone: string;
  profession: Credential;
  status: CallStatus;
}

interface CallListTableProps {
  initialData: TaxPro[];
  apiBaseUrl?: string;
}

const STATE_OPTIONS = ['ALL', 'CA', 'TX', 'NY', 'FL'];
const STATUS_OPTIONS: Array<{ value: 'ALL' | CallStatus; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'not_called', label: 'Not Called' },
  { value: 'called', label: 'Called' },
  { value: 'booked', label: 'Booked' },
];

export function CallListTable({ initialData }: CallListTableProps) {
  const router = useRouter();
  const [rows] = useState<TaxPro[]>(initialData);
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CallStatus>('ALL');

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (stateFilter !== 'ALL' && r.state !== stateFilter) return false;
        if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
        return true;
      }),
    [rows, stateFilter, statusFilter]
  );

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
        >
          {STATE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'All States' : s}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | CallStatus)}
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.02] md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/[0.06] text-xs uppercase tracking-widest text-white/40">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Credential</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3 w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                onClick={() => router.push(`/dashboard/calls/${r.id}`)}
                className="cursor-pointer border-b border-white/[0.04] hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="font-semibold text-white">{r.fullName}</div>
                  <div className="text-xs text-white/50">{r.dba}</div>
                </td>
                <td className="px-4 py-3 text-white/70">
                  {r.city}, {r.state}
                </td>
                <td className="px-4 py-3">
                  <CredentialBadge value={r.profession} />
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`tel:${r.phone.replace(/\D/g, '')}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-white/80 hover:text-white"
                  >
                    {r.phone}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <StatusPill value={r.status} />
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <ActionCell rowNumber={r.id} status={r.status} />
                </td>
                <td className="px-4 py-3 text-white/30">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((r) => (
          <div
            key={r.id}
            role="button"
            tabIndex={0}
            onClick={() => router.push(`/dashboard/calls/${r.id}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                router.push(`/dashboard/calls/${r.id}`);
              }
            }}
            className="cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.04]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{r.fullName}</div>
                <div className="text-xs text-white/50">{r.dba}</div>
                <div className="mt-1 text-xs text-white/50">
                  {r.city}, {r.state}
                </div>
              </div>
              <CredentialBadge value={r.profession} />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <a
                href={`tel:${r.phone.replace(/\D/g, '')}`}
                onClick={(e) => e.stopPropagation()}
                className="text-sm text-white/80 hover:text-white"
              >
                {r.phone}
              </a>
              <StatusPill value={r.status} />
            </div>
            <div className="mt-3" onClick={(e) => e.stopPropagation()}>
              <ActionCell rowNumber={r.id} status={r.status} mobile />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-white/50">
        <span>Showing 1–{filtered.length} of {rows.length}</span>
        <button
          type="button"
          className="rounded border border-white/10 px-3 py-1.5 text-white/70 hover:text-white"
        >
          Load More
        </button>
      </div>
    </div>
  );
}

function ActionCell({
  rowNumber,
  status,
  mobile,
}: {
  rowNumber: string;
  status: CallStatus;
  mobile?: boolean;
}) {
  if (status === 'booked') {
    return (
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-semibold"
        style={{ background: '#22C55E', color: '#0A0A0A' }}
      >
        Booked ✓
      </span>
    );
  }
  return (
    <Link
      href={`/dashboard/calls/${rowNumber}`}
      className={`inline-flex items-center justify-center rounded border border-[#22C55E] px-3 py-1.5 text-xs font-semibold text-[#22C55E] hover:bg-[#22C55E]/10 ${mobile ? 'w-full' : ''}`}
    >
      View Lead {mobile ? '→' : ''}
    </Link>
  );
}

function CredentialBadge({ value }: { value: Credential }) {
  const colors: Record<Credential, { bg: string; text: string }> = {
    EA: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
    CPA: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    ATTY: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  };
  const c = colors[value];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {value}
    </span>
  );
}

function StatusPill({ value }: { value: CallStatus }) {
  const map: Record<CallStatus, { label: string; bg: string; text: string }> = {
    not_called: { label: 'Not Called', bg: 'rgba(255,255,255,0.06)', text: '#9ca3af' },
    called: { label: 'Called', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    booked: { label: 'Booked', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  };
  const c = map[value];
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
      style={{ background: c.bg, color: c.text }}
    >
      {c.label}
    </span>
  );
}
