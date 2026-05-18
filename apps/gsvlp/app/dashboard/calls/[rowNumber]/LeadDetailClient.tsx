'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import type { TaxPro } from '@/components/dashboard/CallListTable';
import { LeadDetailCard } from '@/components/dashboard/LeadDetailCard';
import { CallScript } from '@/components/dashboard/CallScript';
import { DispositionButtons, type Disposition } from '@/components/dashboard/DispositionButtons';
import { ActivityLog, type ActivityEntry } from '@/components/dashboard/ActivityLog';
import { ProductPitchTabs } from '@/components/dashboard/ProductPitchTabs';
import { BookingFlow } from '@/components/dashboard/BookingFlow';
import { NextLeadButton } from '@/components/dashboard/NextLeadButton';
import { TaxProNurtureFlow } from '@/components/dashboard/TaxProNurtureFlow';

function firstName(session: { email: string | null }): string {
  if (!session.email) return 'there';
  const local = session.email.split('@')[0];
  const first = local.split(/[._-]/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

type LeadStatus =
  | 'not_called'
  | 'called'
  | 'interested'
  | 'wants_info'
  | 'left_message'
  | 'not_a_fit'
  | 'disconnected'
  | 'booked';

async function postStatus(
  apiBaseUrl: string,
  rowNumber: string,
  status: LeadStatus,
  note?: string,
): Promise<{ activity?: ActivityEntry[] } | null> {
  try {
    const body: { status: LeadStatus; note?: string } = { status };
    if (note && note.trim()) body.note = note.trim().slice(0, 280);
    const res = await fetch(`${apiBaseUrl}/v1/gsvlp/call-list/${rowNumber}/status`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const d = await res.json().catch(() => ({}));
    if (res.ok && d.ok && d.row) return d.row;
    return null;
  } catch {
    return null;
  }
}

const DISPOSITION_TO_STATUS: Record<Disposition, LeadStatus> = {
  interested: 'interested',
  wants_info: 'wants_info',
  voicemail: 'left_message',
  not_fit: 'not_a_fit',
  disconnected: 'disconnected',
};

function StatusPill({ value }: { value: LeadStatus }) {
  const map: Record<LeadStatus, { label: string; bg: string; text: string }> = {
    not_called: { label: 'Not Called', bg: 'rgba(255,255,255,0.06)', text: '#9ca3af' },
    called: { label: 'Called', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    interested: { label: 'Interested', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
    wants_info: { label: 'Wants Info', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    left_message: { label: 'Left Message', bg: 'rgba(59,130,246,0.15)', text: '#60A5FA' },
    not_a_fit: { label: 'Not a Fit', bg: 'rgba(255,255,255,0.06)', text: '#9ca3af' },
    disconnected: { label: 'Disconnected', bg: 'rgba(255,255,255,0.04)', text: '#71717a' },
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

function addDaysIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatLongDate(iso: string): string {
  const [y, m, day] = iso.split('-').map(Number);
  const d = new Date(y, (m || 1) - 1, day || 1);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

type PendingFollowUp = {
  id: string;
  row_number: number;
  follow_up_date: string;
  disposition: string;
  status: 'pending' | 'completed';
};

function FollowUpScheduler({
  apiBaseUrl,
  lead,
  rowNumber,
  disposition,
  pendingFollowUp,
  onScheduled,
}: {
  apiBaseUrl: string;
  lead: TaxPro;
  rowNumber: string;
  disposition: 'voicemail' | 'wants_info';
  pendingFollowUp: PendingFollowUp | null;
  onScheduled: (followUp: PendingFollowUp) => void;
}) {
  const [savedDate, setSavedDate] = useState<string | null>(null);
  const [skipped, setSkipped] = useState(false);
  const [saving, setSaving] = useState(false);

  async function schedule(days: number) {
    if (saving) return;
    setSaving(true);
    const followUpDate = addDaysIso(days);
    try {
      const res = await fetch(`${apiBaseUrl}/v1/gsvlp/follow-ups`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          row_number: Number(rowNumber),
          tax_pro_name: lead.fullName,
          tax_pro_phone: lead.phone,
          credential: lead.profession,
          disposition: disposition === 'voicemail' ? 'left_message' : 'wants_info',
          follow_up_date: followUpDate,
          notes: '',
        }),
      });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d.ok) {
        setSavedDate(followUpDate);
        setSkipped(false);
        onScheduled(d.follow_up);
      }
    } catch {
      // Silent fail — user can retry
    } finally {
      setSaving(false);
    }
  }

  if (savedDate || (pendingFollowUp && !skipped)) {
    const dateToShow = savedDate || pendingFollowUp!.follow_up_date;
    return (
      <div className="rounded-lg border border-[#22C55E]/30 bg-[#22C55E]/[0.06] p-5">
        <div className="flex items-center gap-2 text-sm font-semibold text-[#22C55E]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 13l4 4L19 7" />
          </svg>
          Follow-up set for {formatLongDate(dateToShow)}
        </div>
      </div>
    );
  }

  if (skipped) return null;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">When should you follow up?</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => schedule(1)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#22C55E] px-4 text-sm font-bold text-black hover:bg-[#16A34A] disabled:opacity-50"
        >
          <span aria-hidden>🟢</span>
          Tomorrow
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => schedule(2)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#F59E0B] px-4 text-sm font-bold text-black hover:bg-[#D97706] disabled:opacity-50"
        >
          <span aria-hidden>🟡</span>
          In 2 Days
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => schedule(7)}
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#3B82F6] px-4 text-sm font-bold text-white hover:bg-[#2563EB] disabled:opacity-50"
        >
          <span aria-hidden>🔵</span>
          Next Week
        </button>
      </div>
      <button
        type="button"
        onClick={() => setSkipped(true)}
        className="mt-4 text-xs text-white/40 hover:text-white/70 underline"
      >
        Skip — no follow-up
      </button>
    </div>
  );
}

export default function LeadDetailClient({ rowNumber }: { rowNumber: string }) {
  const { config, session } = useAppShell();
  const [batch, setBatch] = useState<TaxPro[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<Disposition | null>(null);
  const [showBookingAfterPitch, setShowBookingAfterPitch] = useState(false);
  const [pendingFollowUp, setPendingFollowUp] = useState<PendingFollowUp | null>(null);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [notFitNote, setNotFitNote] = useState('');
  const [notFitPending, setNotFitPending] = useState(false);
  const [notFitSubmitting, setNotFitSubmitting] = useState(false);

  const setterName = firstName(session);

  useEffect(() => {
    let cancelled = false;
    if (!rowNumber) return;
    fetch(`${config.apiBaseUrl}/v1/gsvlp/call-list`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to load call list');
        return d;
      })
      .then((d) => {
        if (cancelled) return;
        const rows = d.batch?.rows ?? [];
        const mapped: TaxPro[] = rows.map((r: {
          row_number: number;
          full_name: string;
          dba: string;
          city: string;
          state: string;
          phone: string;
          profession: 'EA' | 'CPA' | 'ATTY';
          status: 'not_called' | 'called' | 'booked';
        }) => ({
          id: String(r.row_number),
          fullName: r.full_name,
          dba: r.dba,
          city: r.city,
          state: r.state,
          phone: r.phone,
          profession: r.profession,
          status: r.status,
        }));
        setBatch(mapped);
        const current = rows.find(
          (r: { row_number: number; activity?: ActivityEntry[] }) =>
            String(r.row_number) === String(rowNumber),
        );
        if (current && Array.isArray(current.activity)) {
          setActivity(current.activity);
        }
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load');
      });
    return () => { cancelled = true; };
  }, [config.apiBaseUrl, rowNumber]);

  useEffect(() => {
    let cancelled = false;
    fetch(`${config.apiBaseUrl}/v1/gsvlp/follow-ups?status=pending`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) return;
        const match = (d.follow_ups || []).find(
          (f: PendingFollowUp) => String(f.row_number) === String(rowNumber) && f.status === 'pending',
        );
        if (!cancelled && match) setPendingFollowUp(match);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [config.apiBaseUrl, rowNumber]);

  function selectDisposition(d: Disposition) {
    if (disposition === d) {
      setDisposition(null);
      setShowBookingAfterPitch(false);
      setNotFitPending(false);
      setNotFitNote('');
      void postStatus(config.apiBaseUrl, rowNumber, 'not_called');
      return;
    }
    setDisposition(d);
    setShowBookingAfterPitch(false);
    if (d === 'not_fit') {
      setNotFitPending(true);
      setNotFitNote('');
      return;
    }
    setNotFitPending(false);
    setNotFitNote('');
    const status = DISPOSITION_TO_STATUS[d];
    void postStatus(config.apiBaseUrl, rowNumber, status).then((row) => {
      if (row && Array.isArray(row.activity)) {
        setActivity(row.activity);
      }
    });
    // Auto-complete any pending follow-up — the setter is now acting on this lead.
    // Don't auto-complete if they're scheduling another follow-up disposition.
    if (pendingFollowUp && d !== 'voicemail' && d !== 'wants_info') {
      fetch(`${config.apiBaseUrl}/v1/gsvlp/follow-ups/${pendingFollowUp.id}/complete`, {
        method: 'POST',
        credentials: 'include',
      }).catch(() => {});
      setPendingFollowUp(null);
    }
  }

  async function submitNotFit() {
    if (notFitSubmitting) return;
    setNotFitSubmitting(true);
    try {
      const row = await postStatus(config.apiBaseUrl, rowNumber, 'not_a_fit', notFitNote);
      if (row && Array.isArray(row.activity)) setActivity(row.activity);
      if (pendingFollowUp) {
        fetch(`${config.apiBaseUrl}/v1/gsvlp/follow-ups/${pendingFollowUp.id}/complete`, {
          method: 'POST',
          credentials: 'include',
        }).catch(() => {});
        setPendingFollowUp(null);
      }
      setNotFitPending(false);
    } finally {
      setNotFitSubmitting(false);
    }
  }

  const lead = batch?.find((r) => r.id === rowNumber) ?? null;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top bar */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/calls"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Call List
        </Link>
        <a
          href="tel:6198005457"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-md bg-[#F59E0B] px-4 font-bold text-black hover:bg-[#D97706]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
          Transfer to JLW
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/[0.06] p-6 text-sm">
          <div className="font-semibold text-amber-300">Couldn&rsquo;t load lead</div>
          <div className="mt-1 text-white/60">{error}</div>
        </div>
      )}

      {!error && batch === null && (
        <div className="space-y-3">
          <div className="h-32 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]" />
          <div className="h-48 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]" />
        </div>
      )}

      {batch !== null && !lead && !error && (
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 text-sm text-white/70">
          Lead not found in your current batch.{' '}
          <Link href="/dashboard/calls" className="text-[#22C55E] hover:underline">
            Return to call list
          </Link>
        </div>
      )}

      {lead && (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold text-white">{lead.fullName}</h1>
            <StatusPill value={lead.status} />
          </div>

          <LeadDetailCard lead={lead} />

          <CallScript
            leadName={lead.fullName}
            firmName={lead.dba || 'your'}
            setterName={setterName}
          />

          <DispositionButtons
            activeDisposition={disposition}
            onSelect={selectDisposition}
          />

          {notFitPending && (
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
              <label
                htmlFor="not-fit-note"
                className="mb-2 block text-sm font-semibold text-white"
              >
                Why isn&rsquo;t this a good fit?
              </label>
              <textarea
                id="not-fit-note"
                value={notFitNote}
                onChange={(e) => setNotFitNote(e.target.value.slice(0, 280))}
                placeholder="Why isn't this a good fit? (optional)"
                maxLength={280}
                rows={3}
                className="w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-[#22C55E] focus:outline-none"
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="text-xs text-white/40">{notFitNote.length} / 280</span>
                <button
                  type="button"
                  disabled={notFitSubmitting}
                  onClick={() => void submitNotFit()}
                  className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[#22C55E] px-5 text-sm font-bold text-black hover:bg-[#16A34A] disabled:opacity-50"
                >
                  {notFitSubmitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            </div>
          )}

          <ActivityLog entries={activity} />

          {disposition === 'interested' && (
            <>
              <BookingFlow
                lead={lead}
                apiBaseUrl={config.apiBaseUrl}
                onBooked={() => postStatus(config.apiBaseUrl, rowNumber, 'booked')}
              />
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'wants_info' && !showBookingAfterPitch && (
            <>
              <ProductPitchTabs
                onBookIt={() => setShowBookingAfterPitch(true)}
                onStillNo={() => setDisposition('not_fit')}
              />
              <TaxProNurtureFlow lead={lead} apiBaseUrl={config.apiBaseUrl} />
              <FollowUpScheduler
                apiBaseUrl={config.apiBaseUrl}
                lead={lead}
                rowNumber={rowNumber}
                disposition="wants_info"
                pendingFollowUp={pendingFollowUp}
                onScheduled={setPendingFollowUp}
              />
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'wants_info' && showBookingAfterPitch && (
            <>
              <BookingFlow
                lead={lead}
                apiBaseUrl={config.apiBaseUrl}
                onBooked={() => postStatus(config.apiBaseUrl, rowNumber, 'booked')}
              />
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'voicemail' && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
                <h2 className="mb-4 text-lg font-semibold text-white">Leave a brief message</h2>
                <div className="space-y-3 text-[15px] leading-relaxed text-white/80">
                  <p>
                    &ldquo;Hi {lead.fullName.split(' ')[0]}, this is{' '}
                    <strong className="text-white">{setterName}</strong> calling on
                    behalf of Jamie Williams at Virtual Launch Pro. She helps tax
                    pros like you get more clients. I&apos;ll try you again — or
                    you can reach her at virtuallaunch.pro. Have a great day.&rdquo;
                  </p>
                </div>
              </div>
              <FollowUpScheduler
                apiBaseUrl={config.apiBaseUrl}
                lead={lead}
                rowNumber={rowNumber}
                disposition="voicemail"
                pendingFollowUp={pendingFollowUp}
                onScheduled={setPendingFollowUp}
              />
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'not_fit' && !notFitPending && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6 text-center">
                <div className="text-base text-white/80">
                  &ldquo;No problem — have a great day.&rdquo;
                </div>
              </div>
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'disconnected' && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-4 text-base text-white/80">What do you want to do?</div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setDisposition(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full min-h-[56px] rounded-md bg-[#3B82F6] px-4 text-base font-bold text-white hover:bg-[#2563EB]"
                  >
                    Try Again
                  </button>
                </div>
              </div>
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}
        </>
      )}
    </div>
  );
}
