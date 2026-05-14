'use client';

export type ApptStatus = 'upcoming' | 'showed' | 'no_show' | 'closed' | 'cancelled';
export type Credential = 'EA' | 'CPA' | 'ATTY';

export interface Appointment {
  id: string;
  taxProName: string;
  credential: Credential;
  date: string;
  time: string;
  status: ApptStatus;
  commission: number;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel?: (id: string) => void;
}

const STATUS_LABEL: Record<ApptStatus, { label: string; bg: string; text: string }> = {
  upcoming: { label: 'Upcoming', bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  showed: { label: 'Showed', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  no_show: { label: 'No-Show', bg: 'rgba(239,68,68,0.15)', text: '#F87171' },
  closed: { label: 'Closed', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
  cancelled: { label: 'Cancelled', bg: 'rgba(255,255,255,0.06)', text: '#9ca3af' },
};

const CRED_COLOR: Record<Credential, { bg: string; text: string }> = {
  EA: { bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  CPA: { bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
  ATTY: { bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
};

function formatDateTime(date: string, time: string): string {
  try {
    const d = new Date(`${date}T${time}:00`);
    const day = d.toLocaleDateString('en-US', { weekday: 'long' });
    const md = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    const t = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${day}, ${md} at ${t}`;
  } catch {
    return `${date} ${time}`;
  }
}

export function AppointmentCard({ appointment, onCancel }: AppointmentCardProps) {
  const s = STATUS_LABEL[appointment.status];
  const c = CRED_COLOR[appointment.credential];
  const commissionText =
    appointment.status === 'closed' && appointment.commission > 0
      ? `$${appointment.commission}`
      : '$0';
  const commissionColor =
    appointment.status === 'closed' && appointment.commission > 0
      ? '#F59E0B'
      : '#FFFFFF';

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">
              {appointment.taxProName}
            </h3>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
              style={{ background: c.bg, color: c.text }}
            >
              {appointment.credential}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/60">
            {formatDateTime(appointment.date, appointment.time)}
          </p>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ background: s.bg, color: s.text }}
        >
          {s.label}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-white/40">
            Commission
          </div>
          <div
            className="text-lg font-semibold"
            style={{ color: commissionColor }}
          >
            {commissionText}
          </div>
        </div>
        {appointment.status === 'upcoming' && onCancel && (
          <button
            type="button"
            onClick={() => onCancel(appointment.id)}
            className="rounded border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
