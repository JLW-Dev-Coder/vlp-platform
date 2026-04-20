'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { createScratchTicket, revealScratchTicket, ScratchTicket } from '@/lib/api';


const SCRATCH_OVERLAY_CLASS = 'absolute inset-0 bg-gradient-to-br from-[#2a2a3a] to-[#1a1a28] flex items-center justify-center z-10 transition-opacity rounded-2xl'; // canonical: layered scratch-overlay depth gradient — decorative dark hexes have no tokenable equivalent
const SCRATCH_PRIZE_CLASS = 'absolute inset-0 flex items-center justify-center text-[4rem] z-0 bg-gradient-to-br from-[#0a0a18] to-[#12121f]'; // canonical: scratch prize layer depth gradient — decorative dark hexes have no tokenable equivalent

const PRIZE_CONFIG: Record<string, { emoji: string; title: string; desc: string }> = {
  free_month: { emoji: '🎉', title: 'You won a free template!', desc: 'Claim any available template at no cost — includes 12 months of hosting.' },
  '50_off': { emoji: '🎊', title: '$50 off your template!', desc: 'Use your discount code at checkout.' },
  '25_off': { emoji: '🎁', title: '$25 off your template!', desc: 'Use your discount code at checkout.' },
  credit_9: { emoji: '💰', title: 'You won a $9 credit!', desc: 'Apply this credit toward any template purchase.' },
  free_ticket: { emoji: '🎟️', title: 'Try again!', desc: 'You won another scratch ticket.' },
  no_prize: { emoji: '😔', title: 'Better luck next time!', desc: 'Browse available templates and find your perfect site.' },
};

export default function ScratchPage() {
  return (
    <AuthGuard>
      {(session) => <ScratchContent accountId={session.account_id} />}
    </AuthGuard>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ScratchContent({ accountId }: { accountId: string }) {
  const [ticket, setTicket] = useState<ScratchTicket | null>(null);
  const [scratched, setScratched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prize, setPrize] = useState<typeof PRIZE_CONFIG[string] | null>(null);

  async function handleGetTicket() {
    setLoading(true);
    try {
      const t = await createScratchTicket();
      setTicket(t);
    } finally {
      setLoading(false);
    }
  }

  async function handleReveal() {
    if (!ticket || scratched) return;
    setScratched(true);
    try {
      const result = await revealScratchTicket(ticket.ticket_id);
      const prizeKey = result.prize ?? 'no_prize';
      setPrize(PRIZE_CONFIG[prizeKey] ?? PRIZE_CONFIG.no_prize);
      setTicket(result);
    } catch {
      setPrize(PRIZE_CONFIG.no_prize);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col items-center justify-center py-[60px] px-6 gap-6 text-center">
        <h1 className="font-sora text-[clamp(2rem,5vw,3rem)] font-extrabold text-white tracking-tight [text-shadow:0_0_40px_rgba(168,85,247,0.3)]">
          Scratch to Win
        </h1>
        <p className="text-white/55 text-base leading-relaxed max-w-[480px]">
          One free ticket per account. Win a free template, discounts, or credits.
        </p>

        {!ticket && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-[6rem] [filter:drop-shadow(0_0_30px_rgba(168,85,247,0.4))] motion-safe:animate-[float_3s_ease-in-out_infinite]">
              🎫
            </div>
            <button
              className="px-9 py-[14px] bg-brand-primary text-white font-bold text-base rounded-[10px] border-0 cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_0_44px_rgba(168,85,247,0.6)] disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleGetTicket}
              disabled={loading}
            >
              {loading ? 'Getting your ticket…' : 'Get Your Free Ticket'}
            </button>
          </div>
        )}

        {ticket && !scratched && (
          <div className="flex flex-col items-center gap-5">
            <p className="text-white/50 text-[0.9rem] motion-safe:animate-[pulse-subtle_2s_ease-in-out_infinite]">
              Click the card to reveal your prize!
            </p>
            <div
              className="relative w-[280px] h-[180px] rounded-[18px] cursor-pointer overflow-hidden border-2 border-brand-primary/40 shadow-brand transition-transform hover:scale-[1.02]"
              onClick={handleReveal}
            >
              <div className={SCRATCH_OVERLAY_CLASS}>
                <span className="font-sora text-[1.4rem] font-extrabold text-brand-primary/60 tracking-[4px] [text-shadow:0_0_20px_rgba(168,85,247,0.4)]">
                  SCRATCH
                </span>
              </div>
              <div className={SCRATCH_PRIZE_CLASS}>
                🎁
              </div>
            </div>
          </div>
        )}

        {scratched && prize && (
          <div className="flex flex-col items-center gap-4 motion-safe:animate-[scale-in_0.5s_ease_forwards]">
            <div className="text-[5rem] [filter:drop-shadow(0_0_20px_rgba(168,85,247,0.5))]">{prize.emoji}</div>
            <h2 className="font-sora text-[1.8rem] font-bold text-brand-primary tracking-tight [text-shadow:0_0_30px_rgba(168,85,247,0.5)]">
              {prize.title}
            </h2>
            <p className="text-white/65 text-base leading-relaxed max-w-[400px]">{prize.desc}</p>
            {ticket?.prize_code && (
              <div className="px-6 py-3 bg-brand-primary/[0.08] border border-brand-primary/30 rounded-[10px] text-white/80 text-[0.9rem]">
                Code: <strong className="text-brand-primary font-mono text-base tracking-wide">{ticket.prize_code}</strong>
              </div>
            )}
            <div className="mt-2">
              <Link
                href="/"
                className="inline-block px-7 py-3 bg-brand-primary/10 border border-brand-primary/40 rounded-lg text-brand-primary font-semibold text-[0.9rem] no-underline transition-all hover:bg-brand-primary/20 hover:border-brand-primary"
              >
                Browse Templates
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
