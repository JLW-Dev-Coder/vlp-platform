'use client';

import { StatCard } from './StatCard';

export interface CommissionEntry {
  id: string;
  appointment_id: string;
  tax_pro_name: string;
  amount_paid: number;
  commission_amount: number;
  status: 'pending' | 'paid';
  created_at: string;
  paid_at: string | null;
}

interface CommissionSummaryProps {
  totalEarned: number;
  totalPaid: number;
  pending: number;
  appointmentsSet: number;
  showRate: number;
  commissions?: CommissionEntry[];
}

function fmtMoney(n: number) {
  return `$${(Math.round((n || 0) * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso.slice(0, 10);
  }
}

export function CommissionSummary({
  totalEarned,
  totalPaid,
  pending,
  appointmentsSet,
  showRate,
  commissions = [],
}: CommissionSummaryProps) {
  const showAccent: 'green' | 'amber' = showRate >= 75 ? 'green' : 'amber';
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Total earned" value={fmtMoney(totalEarned)} accent="gold" />
        <StatCard label="Paid" value={fmtMoney(totalPaid)} accent="green" />
        <StatCard label="Pending" value={fmtMoney(pending)} accent="white" />
        <StatCard label="Appointments set" value={appointmentsSet} accent="green" />
        <StatCard label="Show rate" value={`${showRate}%`} accent={showAccent} />
      </div>

      {commissions.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-white/60">
            Commission history
          </h2>
          <div className="space-y-2">
            {commissions.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="min-w-0">
                  <div className="font-medium text-white">{c.tax_pro_name || 'Tax pro'}</div>
                  <div className="text-xs text-white/50">
                    Paid {fmtMoney(c.amount_paid)} · {fmtDate(c.created_at)}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.status === 'paid'
                        ? 'bg-green-500/15 text-green-300'
                        : 'bg-amber-500/15 text-amber-300'
                    }`}
                  >
                    {c.status === 'paid' ? 'Paid out' : 'Pending payout'}
                  </span>
                  <div className="text-right">
                    <div className="font-semibold text-[#FFD700]">
                      {fmtMoney(c.commission_amount)}
                    </div>
                    {c.paid_at && (
                      <div className="text-xs text-white/40">{fmtDate(c.paid_at)}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
