'use client';

import { useState } from 'react';
import type { TaxPro } from './CallListTable';

function nextFridayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const offset = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

export interface BookedDetails {
  date: string;
  time: string;
  notes: string;
}

export function BookingFlow({
  lead,
  apiBaseUrl,
  onBooked,
}: {
  lead: TaxPro;
  apiBaseUrl: string;
  onBooked: (d: BookedDetails) => void;
}) {
  const [date, setDate] = useState(nextFridayISO());
  const [time, setTime] = useState('15:00');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch(`${apiBaseUrl}/v1/gsvlp/appointments`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tax_pro_name: lead.fullName,
          tax_pro_credential: lead.profession,
          tax_pro_phone: lead.phone,
          date,
          time,
          notes,
          row_number: Number(lead.id),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to book');
      setConfirmed(true);
      onBooked({ date, time, notes });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book');
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="rounded-lg border border-[#22C55E]/40 bg-[#22C55E]/[0.08] p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#22C55E] text-2xl">
          ✓
        </div>
        <div className="text-lg font-semibold text-white">Appointment booked.</div>
        <div className="mt-1 text-sm text-white/70">Commission pending.</div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/[0.04] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Step 3 — Book it</h2>
        <span className="text-xs uppercase tracking-widest text-[#22C55E]">Booking</span>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-white/80">
        <p>
          &ldquo;She has availability on Friday at 9 AM or after 3 PM. Which
          works better?&rdquo;
        </p>
        <p>
          &ldquo;Great. She&apos;ll look forward to speaking with you then.
          You&apos;ll receive an email confirmation shortly.&rdquo;
        </p>
      </div>
      <form onSubmit={submit} className="mt-5 space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">Time</span>
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
            >
              {TIME_SLOTS.map((t) => (
                <option key={t} value={t}>
                  {formatTime(t)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">
            Notes (optional)
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          />
        </label>
        {error && (
          <div className="rounded border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2 text-xs text-amber-300">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full min-h-[56px] rounded-md bg-[#22C55E] px-4 text-base font-bold text-white hover:bg-[#16A34A] disabled:opacity-50"
        >
          {submitting ? 'Booking…' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
}
