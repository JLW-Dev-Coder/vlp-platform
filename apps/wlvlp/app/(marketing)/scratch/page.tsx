'use client';
import { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import {
  createScratchTicket,
  revealScratchTicket,
  ScratchError,
  ScratchRevealResult,
  ScratchTicket,
} from '@/lib/api';


const SCRATCH_OVERLAY_CLASS = 'absolute inset-0 bg-gradient-to-br from-[#2a2a3a] to-[#1a1a28] flex items-center justify-center z-10 transition-opacity rounded-2xl'; // canonical: layered scratch-overlay depth gradient — decorative dark hexes have no tokenable equivalent
const SCRATCH_PRIZE_CLASS = 'absolute inset-0 flex items-center justify-center text-[4rem] z-0 bg-gradient-to-br from-[#0a0a18] to-[#12121f]'; // canonical: scratch prize layer depth gradient — decorative dark hexes have no tokenable equivalent

type PrizeKey = ScratchRevealResult['prize_type'];

const PRIZE_CONFIG: Record<PrizeKey, { emoji: string; title: string; desc: string; cta: string; isWin: boolean }> = {
  free_month: { emoji: '🎉', title: 'You won a free template!', desc: 'Claim any available template at no cost — includes 12 months of hosting.', cta: 'Claim Your Free Template', isWin: true },
  discount_50: { emoji: '🎊', title: '50% off your first month!', desc: 'Use your discount code at checkout.', cta: 'Use Your 50% Off — Browse Templates', isWin: true },
  discount_25: { emoji: '🎁', title: '25% off your first month!', desc: 'Use your discount code at checkout.', cta: 'Use Your 25% Off — Browse Templates', isWin: true },
  credit_9: { emoji: '💰', title: 'You won a $9 credit!', desc: 'Apply this credit toward any template purchase.', cta: 'Use Your $9 Credit — Browse Templates', isWin: true },
  free_ticket: { emoji: '🎟️', title: 'Try again!', desc: 'You won another scratch ticket.', cta: 'Browse Templates', isWin: false },
  no_prize: { emoji: '😔', title: 'Better luck next time!', desc: 'Browse available templates and find your perfect site.', cta: 'Browse Templates', isWin: false },
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
  const [reveal, setReveal] = useState<ScratchRevealResult | null>(null);
  const [scratched, setScratched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);

  async function handleGetTicket() {
    setError(null);
    setLoading(true);
    try {
      const t = await createScratchTicket();
      setTicket(t);
    } catch (e) {
      if (e instanceof ScratchError) {
        setError({ code: e.code, message: e.message });
      } else {
        setError({ code: 'UNKNOWN', message: 'Could not get your ticket. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleReveal() {
    if (!ticket || scratched || loading) return;
    setError(null);
    setLoading(true);
    try {
      const result = await revealScratchTicket(ticket.ticket_id);
      setReveal(result);
      setScratched(true);
    } catch (e) {
      if (e instanceof ScratchError) {
        setError({ code: e.code, message: e.message });
      } else {
        setError({ code: 'UNKNOWN', message: 'Could not reveal your ticket. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  }

  function handleScratchAgain() {
    if (!reveal?.new_ticket_id) return;
    setError(null);
    setTicket({ ticket_id: reveal.new_ticket_id, status: 'unscratched' });
    setReveal(null);
    setScratched(false);
  }

  const prize = reveal ? PRIZE_CONFIG[reveal.prize_type] ?? PRIZE_CONFIG.no_prize : null;

  return (
    <div className="flex flex-col flex-1 relative overflow-hidden">
      {/* Bokeh orbs */}
      <div className="bokeh hidden md:block" style={{ top: '12%', left: '10%', width: '280px', height: '280px', background: 'radial-gradient(circle, #FFE534, transparent 70%)' }} />
      <div className="bokeh hidden md:block" style={{ top: '45%', left: '75%', width: '280px', height: '280px', background: 'radial-gradient(circle, #FF2D8A, transparent 70%)', animationDelay: '2s' }} />
      <div className="bokeh hidden md:block" style={{ top: '70%', left: '20%', width: '220px', height: '220px', background: 'radial-gradient(circle, #00D4FF, transparent 70%)', animationDelay: '4s' }} />

      <div className="flex-1 flex flex-col items-center justify-center py-[60px] px-6 gap-6 text-center relative z-10">
        <h1 className="font-sora text-[clamp(2rem,5vw,3rem)] font-extrabold text-neon-yellow tracking-tight glow-yellow">
          Scratch to Win
        </h1>
        <p className="text-white/65 text-base leading-relaxed max-w-[480px]">
          One free ticket per account per 24 hours. Win a free template, discounts, or credits.
        </p>

        {error && (
          <div
            role="alert"
            className="max-w-[480px] w-full px-5 py-4 rounded-lg border border-red-400/40 bg-red-500/[0.08] text-red-200 text-[0.92rem] leading-relaxed text-left"
          >
            <div className="font-semibold mb-1 text-red-100">Something went wrong</div>
            <div>{error.message}</div>
            {error.code === 'daily_limit' && (
              <div className="mt-3">
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-[rgba(0,212,255,0.12)] neon-border rounded-md text-neon-blue font-bold text-[0.85rem] no-underline hover:-translate-y-0.5 transition-transform"
                >
                  Browse Templates
                </Link>
              </div>
            )}
          </div>
        )}

        {!ticket && !error && (
          <div className="flex flex-col items-center gap-6">
            <div className="text-[6rem] [filter:drop-shadow(0_0_40px_rgba(255,229,52,0.7))] motion-safe:animate-[float_3s_ease-in-out_infinite]">
              🎫
            </div>
            <button
              className="px-9 py-[14px] bg-neon-yellow text-[#07070A] font-extrabold text-base rounded-[10px] border-0 cursor-pointer transition-all btn-glow-yellow hover:enabled:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleGetTicket}
              disabled={loading}
            >
              {loading ? 'Getting your ticket…' : 'Get Your Free Ticket'}
            </button>
          </div>
        )}

        {!ticket && error && (
          <button
            className="px-7 py-3 bg-[rgba(0,212,255,0.08)] neon-border rounded-lg text-neon-blue font-bold text-[0.9rem] transition-all hover:-translate-y-0.5"
            onClick={handleGetTicket}
            disabled={loading}
          >
            {loading ? 'Retrying…' : 'Try Again'}
          </button>
        )}

        {ticket && !scratched && (
          <div className="flex flex-col items-center gap-5">
            <p className="text-neon-yellow text-[0.9rem] font-bold motion-safe:animate-[pulse-subtle_2s_ease-in-out_infinite]">
              {loading ? 'Revealing…' : 'Click the card to reveal your prize!'}
            </p>
            <button
              type="button"
              className="relative w-[280px] h-[180px] rounded-[18px] cursor-pointer overflow-hidden neon-border-yellow transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed p-0 bg-transparent"
              onClick={handleReveal}
              disabled={loading}
              aria-label="Reveal scratch ticket"
            >
              <div className={SCRATCH_OVERLAY_CLASS}>
                <span className="font-sora text-[1.4rem] font-extrabold text-neon-yellow tracking-[4px] glow-yellow">
                  SCRATCH
                </span>
              </div>
              <div className={SCRATCH_PRIZE_CLASS}>
                🎁
              </div>
            </button>
          </div>
        )}

        {scratched && prize && reveal && (
          <div className="flex flex-col items-center gap-4 motion-safe:animate-[scale-in_0.5s_ease_forwards]">
            <div className="text-[5rem] [filter:drop-shadow(0_0_30px_rgba(255,229,52,0.7))] motion-safe:animate-[float_3s_ease-in-out_infinite]">{prize.emoji}</div>
            {prize.isWin && (
              <div className="font-sora text-[2.2rem] md:text-[2.6rem] font-extrabold text-neon-cyan tracking-tight glow-cyan motion-safe:animate-[pulse-subtle_1.6s_ease-in-out_infinite]">
                You won! 🎉
              </div>
            )}
            <h2 className="font-sora text-[1.6rem] md:text-[1.9rem] font-bold text-neon-yellow tracking-tight glow-yellow">
              {prize.title}
            </h2>
            <p className="text-white/70 text-base leading-relaxed max-w-[400px]">{prize.desc}</p>
            {reveal.promo_code && (
              <div className="px-6 py-3 bg-[rgba(0,212,255,0.08)] neon-border rounded-[10px] text-white/85 text-[0.9rem]">
                Code: <strong className="text-neon-blue font-mono text-base tracking-wide">{reveal.promo_code}</strong>
              </div>
            )}
            {reveal.expires_at && (
              <p className="text-white/45 text-[0.8rem]">
                Expires {new Date(reveal.expires_at).toLocaleDateString()}
              </p>
            )}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center justify-center w-full max-w-[520px]">
              <Link
                href="/"
                className="block w-full sm:w-auto px-9 py-4 bg-neon-yellow text-[#07070A] font-extrabold text-base rounded-[10px] btn-glow-yellow transition-all hover:-translate-y-0.5 no-underline text-center"
              >
                {prize.cta}
              </Link>
              {reveal.new_ticket_id && (
                <button
                  type="button"
                  onClick={handleScratchAgain}
                  className="block w-full sm:w-auto px-7 py-3 bg-[rgba(0,212,255,0.08)] neon-border rounded-lg text-neon-blue font-bold text-[0.9rem] transition-all hover:-translate-y-0.5"
                >
                  Scratch Again
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
