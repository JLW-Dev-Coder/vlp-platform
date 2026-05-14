'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { ScriptCard } from '@/components/dashboard/ScriptCard';

// MOCK DATA — replace with API call to GET /v1/gsvlp/setter/stats
const MOCK_STATS = {
  callsToday: 12,
  appointmentsBooked: 3,
  showRate: 83,
  pendingEarnings: 240,
};

export default function DashboardHomePage() {
  const showAccent: 'green' | 'amber' = MOCK_STATS.showRate >= 75 ? 'green' : 'amber';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Your daily stats and the script that books calls.
        </p>
      </header>

      <section className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Calls made today" value={MOCK_STATS.callsToday} accent="green" />
        <StatCard label="Appointments booked" value={MOCK_STATS.appointmentsBooked} accent="green" />
        <StatCard label="Show rate" value={`${MOCK_STATS.showRate}%`} accent={showAccent} />
        <StatCard label="Pending earnings" value={`$${MOCK_STATS.pendingEarnings}`} accent="gold" />
      </section>

      <ScriptCard />
    </div>
  );
}
