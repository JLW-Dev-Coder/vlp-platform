'use client';
import { Suspense, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PurchaseBeacon } from '@vlp/member-ui';

const NEON_COLORS = ['#FFE500', '#00E5FF', '#FF00FF', '#39FF14'];

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    type Particle = { x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number; vr: number };
    const particles: Particle[] = [];
    for (let i = 0; i < 140; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -14 - 4,
        size: Math.random() * 8 + 4,
        color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
      });
    }

    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.vy += 0.25;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.5);
        ctx.restore();
      }
      if (elapsed < 5000) {
        raf = requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
}

function PurchaseSuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className="min-h-screen flex flex-col">
      <PurchaseBeacon app="wlvlp" sessionId={sessionId ?? undefined} />
      <style>{`
        @keyframes dance {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-15deg) scale(1.2); }
          50% { transform: rotate(15deg) scale(1.3); }
          75% { transform: rotate(-10deg) scale(1.1); }
        }
        @media (prefers-reduced-motion: no-preference) {
          .dance-emoji { animation: dance 1.5s ease-in-out infinite; display: inline-block; transform-origin: center; }
        }
      `}</style>
      <Confetti />
      <nav className="sticky top-0 z-50 bg-[rgba(7,7,10,0.75)] backdrop-blur-md border-b border-neon-blue/20">
        <div className="max-w-[960px] mx-auto px-6 h-[60px] flex items-center">
          <Link href="/" className="font-sora font-extrabold text-[1.2rem] text-neon-blue glow-blue no-underline">
            Website Lotto
          </Link>
        </div>
      </nav>
      <main className="flex-1 flex items-center justify-center px-6 py-12 min-h-[60vh]">
        <div className="w-full max-w-md bg-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 shadow-2xl text-center flex flex-col items-center gap-5 neon-border">
          <div
            className="dance-emoji text-[5rem] leading-none"
            style={{ filter: 'drop-shadow(0 0 24px rgba(255,229,0,0.6))' }}
          >
            🎉
          </div>
          <h1
            className="font-sora text-[2.2rem] font-extrabold text-white tracking-tight leading-tight"
            style={{ textShadow: '0 0 20px #FFE500, 0 0 40px rgba(255,229,0,0.5)' }}
          >
            Your site has been claimed
          </h1>
          <p className="text-white/75 text-[1rem] leading-relaxed">
            We&apos;ll set it up and send you access details within 24 hours.
          </p>
          {sessionId && (
            <p className="text-xs text-gray-500 font-mono break-all">
              Ref: {sessionId}
            </p>
          )}
          <div className="flex gap-3 flex-wrap justify-center mt-2 w-full">
            <Link
              href="/"
              className="flex-1 min-w-[140px] inline-block px-5 py-3 bg-neon-yellow text-[#07070A] font-extrabold text-[0.9rem] rounded-lg no-underline transition-all btn-glow-yellow hover:-translate-y-0.5"
            >
              Back to Marketplace
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 min-w-[140px] inline-block px-5 py-3 bg-[rgba(0,212,255,0.08)] text-neon-blue font-bold text-[0.9rem] rounded-lg no-underline border neon-border transition-all hover:-translate-y-0.5"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PurchaseSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PurchaseSuccessInner />
    </Suspense>
  );
}
