'use client';

import { useState } from 'react';
import { useAppShell } from '@vlp/member-ui';

type Outcome = 'yes' | 'maybe' | 'no';

function firstName(session: { email: string | null }): string {
  if (!session.email) return 'there';
  const local = session.email.split('@')[0];
  const first = local.split(/[._-]/)[0];
  return first ? first.charAt(0).toUpperCase() + first.slice(1) : 'there';
}

export function ScriptCard() {
  const { session } = useAppShell();
  const [active, setActive] = useState<Outcome>('yes');
  const name = firstName(session);

  const pillBase =
    'rounded-full px-4 py-1.5 text-sm font-medium border transition';
  const pillFor = (key: Outcome, activeStyle: string, inactive: string) =>
    `${pillBase} ${active === key ? activeStyle : inactive}`;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Your Script</h2>
        <span className="text-xs uppercase tracking-widest text-white/40">
          Setter
        </span>
      </div>

      <div className="space-y-3 text-[15px] leading-relaxed text-white/80">
        <p>
          &ldquo;Hi, is this [Tax Pro Name]? My name is <strong className="text-white">{name}</strong>,
          and I&apos;m calling on behalf of a representative who works with tax
          professionals like yourself. Do you have 30 seconds?&rdquo;
        </p>
        <p>
          &ldquo;She helps tax pros add a recurring revenue stream by offering
          a transcript-monitoring service to their clients. Would you be open
          to a 15-minute call to learn how it works?&rdquo;
        </p>
      </div>

      <div className="mt-6 mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        How did they respond?
      </div>

      <div className="flex flex-wrap gap-2" role="tablist">
        <button
          type="button"
          onClick={() => setActive('no')}
          aria-pressed={active === 'no'}
          className={pillFor(
            'no',
            'bg-white/[0.08] border-white/30 text-white',
            'bg-transparent border-white/10 text-white/50 hover:text-white/80'
          )}
        >
          No
        </button>
        <button
          type="button"
          onClick={() => setActive('maybe')}
          aria-pressed={active === 'maybe'}
          className={pillFor(
            'maybe',
            'border-[#F59E0B] text-[#F59E0B] bg-[#F59E0B]/10',
            'bg-transparent border-white/10 text-white/50 hover:text-white/80'
          )}
        >
          Maybe
        </button>
        <button
          type="button"
          onClick={() => setActive('yes')}
          aria-pressed={active === 'yes'}
          className={pillFor(
            'yes',
            'border-[#22C55E] text-[#22C55E] bg-[#22C55E]/10',
            'bg-transparent border-white/10 text-white/50 hover:text-white/80'
          )}
        >
          Yes
        </button>
      </div>

      <div className="mt-5 rounded-md border border-white/[0.06] bg-black/20 p-4 text-[15px] leading-relaxed text-white/80">
        {active === 'yes' && (
          <>
            <p>
              &ldquo;She has availability on Friday at 9 AM or after 3 PM.
              Which works better?&rdquo;
            </p>
            <p className="mt-2">
              &ldquo;Great. She&apos;ll look forward to speaking with you then.
              You&apos;ll receive an email confirmation shortly.&rdquo;
            </p>
          </>
        )}
        {active === 'maybe' && (
          <>
            <p>
              &ldquo;Totally understand. Most tax pros feel the same way. Would
              15 minutes hurt to just hear what she has?&rdquo;
            </p>
            <p className="mt-2 italic text-white/50">
              If they say yes, continue with the booking script. If still no,
              thank them and move on.
            </p>
          </>
        )}
        {active === 'no' && (
          <>
            <p>&ldquo;No problem — have a great day.&rdquo;</p>
            <p className="mt-2 italic text-white/50">
              Call the next one. That&apos;s it.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
