'use client';

import { StatCard } from './StatCard';

interface CommissionSummaryProps {
  totalEarned: number;
  pending: number;
  appointmentsSet: number;
  showRate: number;
}

export function CommissionSummary({
  totalEarned,
  pending,
  appointmentsSet,
  showRate,
}: CommissionSummaryProps) {
  const showAccent: 'green' | 'amber' = showRate >= 75 ? 'green' : 'amber';
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard label="Total earned" value={`$${totalEarned}`} accent="gold" />
      <StatCard label="Pending" value={`$${pending}`} accent="white" />
      <StatCard label="Appointments set" value={appointmentsSet} accent="green" />
      <StatCard label="Show rate" value={`${showRate}%`} accent={showAccent} />
    </div>
  );
}
