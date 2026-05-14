'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  accent?: 'green' | 'gold' | 'amber' | 'white';
}

const ACCENT: Record<NonNullable<StatCardProps['accent']>, string> = {
  green: '#22C55E',
  gold: '#F59E0B',
  amber: '#F59E0B',
  white: '#FFFFFF',
};

export function StatCard({ label, value, accent = 'white' }: StatCardProps) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="text-sm text-white/50">{label}</div>
      <div
        className="mt-2 text-2xl font-semibold"
        style={{ color: ACCENT[accent] }}
      >
        {value}
      </div>
    </div>
  );
}
