'use client';

import { useState } from 'react';

interface BookingFormProps {
  onSubmit: (data: { date: string; time: string; notes: string }) => void;
  onCancel: () => void;
}

function nextFridayISO(): string {
  const d = new Date();
  const day = d.getDay();
  const offset = (5 - day + 7) % 7 || 7;
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

export function BookingForm({ onSubmit, onCancel }: BookingFormProps) {
  const [date, setDate] = useState(nextFridayISO());
  const [time, setTime] = useState('15:00');
  const [notes, setNotes] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ date, time, notes });
      }}
      className="mt-3 rounded-md border border-white/[0.08] bg-black/30 p-4"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">
            Date
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">
            Time
          </span>
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
      <label className="mt-3 block">
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
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          className="rounded bg-[#22C55E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#16A34A]"
        >
          Book It
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}
