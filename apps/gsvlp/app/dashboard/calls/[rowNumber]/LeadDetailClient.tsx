'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import type { TaxPro } from '@/components/dashboard/CallListTable';
import { LeadDetailCard } from '@/components/dashboard/LeadDetailCard';
import { CallScript } from '@/components/dashboard/CallScript';
import { DispositionButtons, type Disposition } from '@/components/dashboard/DispositionButtons';
import { TCVLPPitchScript } from '@/components/dashboard/TCVLPPitchScript';
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
    postStatus(config.apiBaseUrl, rowNumber, 'called');
  }

  const lead = batch?.find((r) => r.id === rowNumber) ?? null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/dashboard/calls"
        className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-white"
      >
        ← Back to Call List
      </Link>

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
            <TCVLPPitchScript
              onBookIt={() => setShowBookingAfterPitch(true)}
              onStillNo={() => setShowBookingAfterPitch(false)}
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
                  No problem — on to the next one.
                </div>
              </div>
              <NextLeadButton currentRowNumber={rowNumber} batch={batch ?? []} />
            </>
          )}

          {disposition === 'disconnected' && (
            <>
              <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="mb-4 text-base text-white/80">
                  What do you want to do?
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setDisposition(null);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full rounded-md border border-white/10 px-4 py-3 text-sm font-semibold text-white/80 hover:text-white"
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
