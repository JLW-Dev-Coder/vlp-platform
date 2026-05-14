'use client';

import { useEffect, useState } from 'react';
import type { TaxPro } from './CallListTable';

interface Slot {
  start: string;
  end: string;
}

interface DayAvailability {
  date: string;
  dayOfWeek: string;
  slots: Slot[];
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

function formatDateLong(yyyymmdd: string, dayOfWeek: string): string {
  const [, m, d] = yyyymmdd.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayOfWeek}, ${months[m - 1]} ${d}`;
}

function formatDayPill(yyyymmdd: string, dayOfWeek: string): string {
  const [, m, d] = yyyymmdd.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${dayOfWeek.slice(0, 3)} ${months[m - 1]} ${d}`;
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
  const [availability, setAvailability] = useState<DayAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadAvailability() {
    setLoading(true);
    setLoadError(null);
    try {
      const r = await fetch(`${apiBaseUrl}/v1/gsvlp/availability?days=5`, {
        credentials: 'include',
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to load availability');
      const days: DayAvailability[] = Array.isArray(d.availability) ? d.availability : [];
      setAvailability(days);
      const firstWithSlots = days.find((day) => day.slots.length > 0);
      if (firstWithSlots) setSelectedDate(firstWithSlots.date);
      setSelectedTime('');
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl]);

  const currentDay = availability.find((d) => d.date === selectedDate);
  const slots = currentDay?.slots ?? [];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Pick a date and time first.');
      return;
    }
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
          date: selectedDate,
          time: selectedTime,
          notes,
          row_number: Number(lead.id),
        }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to book');
      setConfirmed(true);
      onBooked({ date: selectedDate, time: selectedTime, notes });
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
        <p>&ldquo;Let&apos;s find a time that works. What does your schedule look like this week?&rdquo;</p>
      </div>

      {loading && (
        <div className="mt-5 space-y-3">
          <div className="h-12 animate-pulse rounded bg-white/[0.06]" />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-white/[0.06]" />
            ))}
          </div>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-5 rounded border border-amber-500/30 bg-amber-500/[0.06] p-4 text-sm text-amber-300">
          <div className="mb-2">{loadError}</div>
          <button
            type="button"
            onClick={loadAvailability}
            className="rounded bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !loadError && (
        <form onSubmit={submit} className="mt-5 space-y-5">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-white/40">Pick a day</div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {availability.map((day) => {
                const disabled = day.slots.length === 0;
                const active = day.date === selectedDate;
                return (
                  <button
                    key={day.date}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedDate(day.date);
                      setSelectedTime('');
                    }}
                    className={`min-w-[120px] shrink-0 rounded-md border px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? 'border-[#22C55E] bg-[#22C55E]/20 text-white'
                        : disabled
                        ? 'border-white/5 bg-white/[0.02] text-white/30'
                        : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-white/20 hover:bg-white/[0.06]'
                    }`}
                  >
                    {formatDayPill(day.date, day.dayOfWeek)}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-white/40">Pick a time (Pacific)</div>
              {slots.length === 0 ? (
                <div className="rounded border border-white/10 bg-white/[0.02] p-4 text-sm text-white/60">
                  No times available this day. Try another.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => {
                    const active = slot.start === selectedTime;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => setSelectedTime(slot.start)}
                        className={`min-h-[48px] rounded-md border text-sm font-semibold transition ${
                          active
                            ? 'border-[#22C55E] bg-[#22C55E] text-white'
                            : 'border-white/10 bg-white/[0.03] text-white/80 hover:border-[#22C55E]/40 hover:bg-[#22C55E]/[0.1]'
                        }`}
                      >
                        {formatTime(slot.start)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {selectedDate && selectedTime && currentDay && (
            <div className="rounded-md border border-[#22C55E]/30 bg-[#22C55E]/[0.06] p-4">
              <div className="text-sm text-white">
                <span className="mr-2">📅</span>
                <span className="font-semibold">
                  {formatDateLong(currentDay.date, currentDay.dayOfWeek)} at {formatTime(selectedTime)} (Pacific)
                </span>
              </div>
              <div className="mt-1 text-xs text-white/60">
                with {lead.fullName}
                {lead.profession ? ` (${lead.profession})` : ''}
              </div>
            </div>
          )}

          <label className="block">
            <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">Notes (optional)</span>
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
            disabled={submitting || !selectedDate || !selectedTime}
            className="w-full min-h-[56px] rounded-md bg-[#22C55E] px-4 text-base font-bold text-white hover:bg-[#16A34A] disabled:opacity-40"
          >
            {submitting ? 'Booking…' : 'Confirm Appointment'}
          </button>
        </form>
      )}
    </div>
  );
}
