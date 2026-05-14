'use client';

import { useMemo, useState } from 'react';
import { AppointmentCard, type Appointment, type ApptStatus } from '@/components/dashboard/AppointmentCard';
import { CommissionSummary } from '@/components/dashboard/CommissionSummary';

// MOCK DATA — replace with API call to GET /v1/gsvlp/appointments
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', taxProName: 'Robert Chen', credential: 'CPA', date: '2026-05-16', time: '15:00', status: 'upcoming', commission: 0 },
  { id: '2', taxProName: 'Sarah Williams', credential: 'EA', date: '2026-05-14', time: '09:00', status: 'showed', commission: 0 },
  { id: '3', taxProName: 'James Park', credential: 'ATTY', date: '2026-05-12', time: '14:00', status: 'closed', commission: 240 },
  { id: '4', taxProName: 'Lisa Thompson', credential: 'CPA', date: '2026-05-10', time: '10:00', status: 'no_show', commission: 0 },
  { id: '5', taxProName: 'David Martinez', credential: 'EA', date: '2026-05-09', time: '15:00', status: 'closed', commission: 180 },
];

const FILTER_OPTIONS: Array<{ value: 'ALL' | ApptStatus; label: string }> = [
  { value: 'ALL', label: 'All' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'showed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function AppointmentsPage() {
  const [appts, setAppts] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [filter, setFilter] = useState<'ALL' | ApptStatus>('ALL');

  const filtered = useMemo(
    () =>
      appts.filter((a) => {
        if (filter === 'ALL') return true;
        if (filter === 'showed') return a.status === 'showed' || a.status === 'closed' || a.status === 'no_show';
        return a.status === filter;
      }),
    [appts, filter]
  );

  function cancelAppt(id: string) {
    setAppts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'cancelled' } : a))
    );
  }

  const totalEarned = appts
    .filter((a) => a.status === 'closed')
    .reduce((sum, a) => sum + a.commission, 0);
  const showRelevant = appts.filter(
    (a) => a.status === 'showed' || a.status === 'closed' || a.status === 'no_show'
  );
  const showCount = showRelevant.filter(
    (a) => a.status === 'showed' || a.status === 'closed'
  ).length;
  const showRate =
    showRelevant.length > 0
      ? Math.round((showCount / showRelevant.length) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-white">Appointments</h1>
          <p className="mt-1 text-sm text-white/50">
            Logged bookings and commission status.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'ALL' | ApptStatus)}
          className="rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
        >
          {FILTER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </header>

      <CommissionSummary
        totalEarned={totalEarned}
        pending={0}
        appointmentsSet={appts.length}
        showRate={showRate}
      />

      <section className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center text-sm text-white/50">
            No appointments match this filter.
          </div>
        ) : (
          filtered.map((a) => (
            <AppointmentCard
              key={a.id}
              appointment={a}
              onCancel={cancelAppt}
            />
          ))
        )}
      </section>
    </div>
  );
}
