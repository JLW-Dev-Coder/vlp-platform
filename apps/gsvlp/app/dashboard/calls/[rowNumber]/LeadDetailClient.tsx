'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import type { TaxPro } from '@/components/dashboard/CallListTable';
import { LeadDetailCard } from '@/components/dashboard/LeadDetailCard';
import { CallScript } from '@/components/dashboard/CallScript';
import { DispositionButtons, type Disposition } from '@/components/dashboard/DispositionButtons';
import { ProductPitchTabs } from '@/components/dashboard/ProductPitchTabs';
import { BookingFlow } from '@/components/dashboard/BookingFlow';
import { NextLeadButton } from '@/components/dashboard/NextLeadButton';

function firstName(session: { email: string | null }): string {
  if (!session.email) return 'there';
  const local = session.email.split('@')[0];
  const first = local.split(/[._-]/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

function postStatus(apiBaseUrl: string, rowNumber: string, status: 'called' | 'booked') {
  return fetch(`${apiBaseUrl}/v1/gsvlp/call-list/${rowNumber}/status`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }).catch(() => {});
}

function StatusPill({ value }: { value: TaxPro['status'] }) {
  const map = {
    not_called: { label: 'Not Called', bg: 'rgba(255,255,255,0.06)', text: '#9ca3af' },
    called: { label: 'Called', bg: 'rgba(245,158,11,0.15)', text: '#F59E0B' },
    booked: { label: 'Booked', bg: 'rgba(34,197,94,0.15)', text: '#22C55E' },
  } as const;
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

export default function LeadDetailClient({ rowNumber }: { rowNumber: string }) {
  const { config, session } = useAppShell();
  const [batch, setBatch] = useState<TaxPro[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [disposition, setDisposition] = useState<Disposition | null>(null);
  const [showBookingAfterPitch, setShowBookingAfterPitch] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });

  const setterName = firstName(session);

  useEffect(() => {
    let cancelled = false;
    fetch(`${config.apiBaseUrl}/v1/gsvlp/call-list`, { credentials: 'include' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok || !d.ok) throw new Error(d.error || 'Failed to load call list');
        return d;
      })
      .then((d) => {
        if (cancelled) return;
        const mapped: TaxPro[] = (d.batch?.rows ?? []).map((r: {
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
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load');
      });
    return () => { cancelled = true; };
  }, [config.apiBaseUrl]);

  function selectDisposition(d: Disposition) {
    setDisposition(d);
    setShowBookingAfterPitch(false);
    postStatus(config.apiBaseUrl, rowNumber, 'called');
  }

  const lead = batch?.find((r) => r.id === rowNumber) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
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
            <ProductPitchTabs
              onBookIt={() => setShowBookingAfterPitch(true)}
              onStillNo={() => setDisposition('not_fit')}
            />
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
                <label className="mt-5 block">
                  <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">
                    Schedule follow-up
                  </span>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white sm:w-auto"
                  />
                </label>
              </div>
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'not_fit' && (
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
