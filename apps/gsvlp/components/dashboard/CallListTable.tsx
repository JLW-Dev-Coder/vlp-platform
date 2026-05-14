'use client';

import { useMemo, useState } from 'react';
import { BookingForm } from './BookingForm';

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
  onBooked?: (pro: TaxPro, details: { date: string; time: string; notes: string }) => void;
}

const STATE_OPTIONS = ['ALL', 'CA', 'TX', 'NY', 'FL'];
const STATUS_OPTIONS: Array<{ value: 'ALL' | CallStatus; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'not_called', label: 'Not Called' },
  { value: 'called', label: 'Called' },
  { value: 'booked', label: 'Booked' },
];

export function CallListTable({ initialData, apiBaseUrl, onBooked }: CallListTableProps) {
  const [rows, setRows] = useState<TaxPro[]>(initialData);
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | CallStatus>('ALL');
  const [bookingFor, setBookingFor] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      rows.filter((r) => {
        if (stateFilter !== 'ALL' && r.state !== stateFilter) return false;
        if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
        return true;
      }),
    [rows, stateFilter, statusFilter]
  );

  function markCalled(id: string) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'called' } : r))
    );
    if (apiBaseUrl) {
      fetch(`${apiBaseUrl}/v1/gsvlp/call-list/${id}/status`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'called' }),
      }).catch(() => {});
    }
  }

  function bookAppointment(
    pro: TaxPro,
    details: { date: string; time: string; notes: string }
  ) {
    setRows((prev) =>
      prev.map((r) => (r.id === pro.id ? { ...r, status: 'booked' } : r))
    );
    setBookingFor(null);
    if (apiBaseUrl) {
      fetch(`${apiBaseUrl}/v1/gsvlp/appointments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_pro_name: pro.fullName,
          tax_pro_credential: pro.profession,
          tax_pro_phone: pro.phone,
          date: details.date,
          time: details.time,
          notes: details.notes,
          row_number: Number(pro.id),
        }),
      }).catch(() => {});
    }
    onBooked?.(pro, details);
  }

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
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <RowGroup
                key={r.id}
                row={r}
                booking={bookingFor === r.id}
                onMarkCalled={() => markCalled(r.id)}
                onLogClick={() => setBookingFor(r.id)}
                onBook={(details) => bookAppointment(r, details)}
                onCancelBook={() => setBookingFor(null)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
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
                className="text-sm text-white/80 hover:text-white"
              >
                {r.phone}
              </a>
              <StatusPill value={r.status} />
            </div>
            <div className="mt-3">
              <ActionButton
                status={r.status}
                onMarkCalled={() => markCalled(r.id)}
                onLogClick={() => setBookingFor(r.id)}
              />
              {bookingFor === r.id && (
                <BookingForm
                  onSubmit={(d) => bookAppointment(r, d)}
                  onCancel={() => setBookingFor(null)}
                />
              )}
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

function RowGroup({
  row,
  booking,
  onMarkCalled,
  onLogClick,
  onBook,
  onCancelBook,
}: {
  row: TaxPro;
  booking: boolean;
  onMarkCalled: () => void;
  onLogClick: () => void;
  onBook: (d: { date: string; time: string; notes: string }) => void;
  onCancelBook: () => void;
}) {
  return (
    <>
      <tr className="border-b border-white/[0.04]">
        <td className="px-4 py-3">
          <div className="font-semibold text-white">{row.fullName}</div>
          <div className="text-xs text-white/50">{row.dba}</div>
        </td>
        <td className="px-4 py-3 text-white/70">
          {row.city}, {row.state}
        </td>
        <td className="px-4 py-3">
          <CredentialBadge value={row.profession} />
        </td>
        <td className="px-4 py-3">
          <a
            href={`tel:${row.phone.replace(/\D/g, '')}`}
            className="text-white/80 hover:text-white"
          >
            {row.phone}
          </a>
        </td>
        <td className="px-4 py-3">
          <StatusPill value={row.status} />
        </td>
        <td className="px-4 py-3">
          <ActionButton
            status={row.status}
            onMarkCalled={onMarkCalled}
            onLogClick={onLogClick}
          />
        </td>
      </tr>
      {booking && (
        <tr className="bg-black/20">
          <td colSpan={6} className="px-4 pb-4">
            <BookingForm onSubmit={onBook} onCancel={onCancelBook} />
          </td>
        </tr>
      )}
    </>
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

function ActionButton({
  status,
  onMarkCalled,
  onLogClick,
}: {
  status: CallStatus;
  onMarkCalled: () => void;
  onLogClick: () => void;
}) {
  if (status === 'not_called') {
    return (
      <button
        type="button"
        onClick={onMarkCalled}
        className="rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/[0.04] hover:text-white"
      >
        Mark Called
      </button>
    );
  }
  if (status === 'called') {
    return (
      <button
        type="button"
        onClick={onLogClick}
        className="rounded bg-[#22C55E] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#16A34A]"
      >
        Log Appointment
      </button>
    );
  }
  return <span className="text-xs text-white/40">—</span>;
}
