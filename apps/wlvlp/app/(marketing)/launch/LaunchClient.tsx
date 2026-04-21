'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ShoppingCart, Gavel, Ticket } from 'lucide-react';
import { TEMPLATES } from '../../../lib/templates';
import { FaqAccordion } from '../../../components/FaqAccordion';

const POSTHOG_KEY = 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const LEADS_ENDPOINT = 'https://api.virtuallaunch.pro/v1/wlvlp/leads';
const TEMPLATES_ENDPOINT = 'https://api.virtuallaunch.pro/v1/wlvlp/templates';
const YT_EMBED_ID = 'DPe9qhvEOpg';

const NEON = {
  blue: '#00D4FF',
  yellow: '#FFE534',
  magenta: '#FF2D8A',
  cyan: '#00F0D0',
};

const NEON_COLORS_ARR = [NEON.blue, NEON.yellow, NEON.magenta, NEON.cyan];

const FIRST_NAMES = [
  'Alex', 'Jordan', 'Priya', 'Marcus', 'Yuki', 'Dana', 'Luis', 'Amara',
  'Chen', 'Sofia', 'Kwame', 'Riley', 'Mei', 'Andre', 'Fatima', 'Kai',
  'Nadia', 'Tomas', 'Zara', 'Devon', 'Ines', 'Rohan', 'Leah', 'Omar',
  'Suki', 'Mateo', 'Ava', 'Idris', 'Lena', 'Jaden', 'Nia', 'Erik',
];

type PostHogGlobal = {
  capture?: (event: string, props?: Record<string, unknown>) => void;
  get_distinct_id?: () => string | undefined;
};

function getDistinctId(): string {
  if (typeof window === 'undefined') return 'ssr';
  try {
    const existing = window.localStorage.getItem('wl_ph_id');
    if (existing) return existing;
    const fresh = `wl_${crypto.randomUUID()}`;
    window.localStorage.setItem('wl_ph_id', fresh);
    return fresh;
  } catch {
    return `wl_${Math.random().toString(36).slice(2)}`;
  }
}

function trackEvent(event: string, properties: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: PostHogGlobal }).posthog;
  if (ph && typeof ph.capture === 'function') {
    try {
      ph.capture(event, properties);
      return;
    } catch {
      // fall through to fetch
    }
  }
  try {
    void fetch(`${POSTHOG_HOST}/capture/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        event,
        distinct_id: getDistinctId(),
        properties: {
          ...properties,
          $current_url: typeof location !== 'undefined' ? location.href : undefined,
        },
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch {
    // swallow — analytics must never break UX
  }
}

type ToastType = 'vote' | 'bid' | 'winner' | 'new';
type Toast = { id: number; type: ToastType; text: string; departing?: boolean };
type TemplateLite = { slug: string; title: string; category?: string };

const TOAST_META: Record<ToastType, { icon: string; color: string; label: string }> = {
  vote: { icon: '👍', color: NEON.blue, label: 'New vote' },
  bid: { icon: '⚡', color: NEON.yellow, label: 'New bid' },
  winner: { icon: '⭐', color: NEON.magenta, label: 'Winner' },
  new: { icon: '✨', color: NEON.cyan, label: 'New template' },
};

const SCRATCH_PRIZES = [
  'WIN: Entire Website',
  '$25 OFF Your First Month',
  '50% OFF First Month',
];

const FAQS: Array<{ q: string; a: string }> = [
  {
    q: 'What kind of sites are available?',
    a: 'High-converting templates built for real small-business use cases — service firms, local pros, creators, and e-commerce. Every site is designed around intent, not decoration.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. Connect a domain you already own, or let us point a fresh one for you. Either way your site loads from Cloudflare in milliseconds.',
  },
  {
    q: 'How do payments work?',
    a: 'The site is a one-time purchase — no subscription for the site itself. Hosting is included free for the first 12 months. Connect Stripe in minutes to accept payments from your visitors — we never touch your revenue.',
  },
  {
    q: 'What happens after I claim a site?',
    a: 'You get immediate access to the editor, pre-wired pages, and a live URL. Customize copy, brand, and contact info — then flip the switch and go live.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. Cancel in one click. You keep your data export, and you can transfer the site to any host you want.',
  },
];

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateToast(
  templates: TemplateLite[],
  newTemplates: TemplateLite[],
): { type: ToastType; text: string } {
  const type = pick<ToastType>(['vote', 'bid', 'winner', 'new']);
  const title = (templates.length > 0 ? pick(templates).title : 'Tampa Coastal CPA');
  if (type === 'vote') {
    return { type, text: `${pick(FIRST_NAMES)} just voted on “${title}”` };
  }
  if (type === 'bid') {
    const amount = 79 + Math.floor(Math.random() * (499 - 79 + 1));
    return { type, text: `A new bid of $${amount} was placed on “${title}”` };
  }
  if (type === 'winner') {
    return { type, text: `${pick(FIRST_NAMES)} scratched a ${pick(SCRATCH_PRIZES)}` };
  }
  const newTitle = newTemplates.length > 0 ? pick(newTemplates).title : title;
  return { type, text: `New template dropped: “${newTitle}”` };
}

type EmailFormProps = {
  source: 'launch-hero' | 'launch-footer';
  showName: boolean;
};

function EmailCaptureForm({ source, showName }: EmailFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [optIn, setOptIn] = useState(false);
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === 'submitting') return;
    if (!email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setError(null);
    setState('submitting');
    try {
      const res = await fetch(LEADS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: showName ? (name.trim() || 'Friend') : 'Friend',
          email: email.trim(),
          source,
          marketing_opt_in: optIn,
          timestamp: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const emailDomain = email.split('@')[1]?.toLowerCase() ?? '';
      trackEvent('lead_magnet_submit', { source, email_domain: emailDomain });
      setState('done');
    } catch {
      setState('error');
      setError('Something went wrong. Try again in a moment.');
    }
  };

  if (state === 'done') {
    return (
      <div className="text-center py-4">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full"
          style={{ background: `${NEON.cyan}22`, border: `1px solid ${NEON.cyan}55` }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={NEON.cyan} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div className="text-xl font-bold mb-2" style={{ color: NEON.yellow }}>Check your email!</div>
        <p className="text-sm text-white/70">
          We just sent your access link. Keep an eye on your inbox (and spam folder, just in case).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {showName && (
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/60 transition-colors"
        />
      )}
      <input
        type="email"
        name="email"
        autoComplete="email"
        required
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#00D4FF]/60 transition-colors"
      />
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={optIn}
          onChange={(e) => setOptIn(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 rounded border border-white/20 bg-white/5 accent-[#FFE534]"
        />
        <span className="text-xs text-gray-400">
          Send me tips on building a high-converting website + exclusive launch offers
        </span>
      </label>
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="cta-glow-pulse w-full rounded-lg px-5 py-3 text-base font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
        style={{
          background: NEON.yellow,
          color: '#0a0a0a',
        }}
      >
        {state === 'submitting' ? 'Submitting…' : 'Get Free Access'}
      </button>
      {error && <div className="text-sm text-[#FF2D8A]">{error}</div>}
      <p className="text-[11px] text-white/40 text-center">
        No spam. Unsubscribe anytime. We use your email to send access and product updates.
      </p>
    </form>
  );
}

function NeonDivider() {
  return (
    <div className="max-w-4xl mx-auto my-16 px-6">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#00D4FF]/50 to-transparent" />
    </div>
  );
}

const CARD_ANIMS = ['anim-float', 'anim-dance', 'anim-sway', 'anim-wobble'] as const;
const cardAnim = (i: number) => CARD_ANIMS[i % CARD_ANIMS.length];

function FeatureCard({
  icon,
  title,
  body,
  accent,
  delay,
  animCls,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: string;
  delay: number;
  animCls: string;
}) {
  return (
    <div
      data-reveal-child
      data-delay={delay}
      className={`reveal-init rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:border-white/20 transition-colors ${animCls}`}
    >
      <div
        className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
        style={{ background: `${accent}1A`, border: `1px solid ${accent}55`, color: accent }}
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{body}</p>
    </div>
  );
}

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  sparkle: boolean;
};

function ScratchCard({
  prize,
  onRevealed,
  reduced,
}: {
  prize: string;
  onRevealed: () => void;
  reduced: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scratchingRef = useRef(false);
  const hasScratchedRef = useRef(false);
  const revealedRef = useRef(false);
  const lastProgressCheckRef = useRef(0);
  const [showHint, setShowHint] = useState(false);
  const [fading, setFading] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const fillFoil = useCallback((canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.globalCompositeOperation = 'source-over';
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#c0c0c0');
    grad.addColorStop(0.3, '#e8e8e8');
    grad.addColorStop(0.5, '#d4af37');
    grad.addColorStop(0.7, '#e8e8e8');
    grad.addColorStop(1, '#c0c0c0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(10,10,10,0.85)';
    ctx.font = 'bold 18px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎟️ Scratch Here', width / 2, height / 2);
  }, []);

  const revealAll = useCallback(() => {
    if (revealedRef.current) return;
    revealedRef.current = true;
    setFading(true);
    setTimeout(() => {
      onRevealed();
    }, 450);
  }, [onRevealed]);

  const checkProgress = useCallback((canvas: HTMLCanvasElement) => {
    if (revealedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const step = 10;
    const { width, height } = canvas;
    const data = ctx.getImageData(0, 0, width, height).data;
    let cleared = 0;
    let total = 0;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        const idx = (y * width + x) * 4 + 3;
        if (data[idx] < 40) cleared++;
        total++;
      }
    }
    if (cleared / total > 0.35) revealAll();
  }, [revealAll]);

  useEffect(() => {
    setIsTouch(typeof window !== 'undefined' && 'ontouchstart' in window);
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.floor(rect.width);
      canvas.height = Math.floor(rect.height);
      fillFoil(canvas);
    };
    resize();

    const scratchAt = (clientX: number, clientY: number) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
      hasScratchedRef.current = true;
      const now = performance.now();
      if (now - lastProgressCheckRef.current > 120) {
        lastProgressCheckRef.current = now;
        checkProgress(canvas);
      }
    };

    const onDown = (e: MouseEvent) => {
      scratchingRef.current = true;
      scratchAt(e.clientX, e.clientY);
    };
    const onMove = (e: MouseEvent) => {
      if (!scratchingRef.current) return;
      scratchAt(e.clientX, e.clientY);
    };
    const onUp = () => {
      if (scratchingRef.current) {
        scratchingRef.current = false;
        checkProgress(canvas);
      }
    };
    const onTouchStart = (e: TouchEvent) => {
      scratchingRef.current = true;
      const t = e.touches[0];
      if (t) scratchAt(t.clientX, t.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!scratchingRef.current) return;
      e.preventDefault();
      const t = e.touches[0];
      if (t) scratchAt(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
      if (scratchingRef.current) {
        scratchingRef.current = false;
        checkProgress(canvas);
      }
    };

    canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', resize);

    const hintTimer = window.setTimeout(() => {
      if (!hasScratchedRef.current) setShowHint(true);
    }, 5000);

    return () => {
      canvas.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', resize);
      window.clearTimeout(hintTimer);
    };
  }, [fillFoil, checkProgress]);

  useEffect(() => {
    if (reduced) revealAll();
  }, [reduced, revealAll]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="relative mx-auto rounded-xl border overflow-hidden select-none"
        style={{
          width: '100%',
          maxWidth: 320,
          height: 150,
          borderColor: `${NEON.cyan}55`,
          boxShadow: `0 0 32px ${NEON.cyan}33`,
          background: `${NEON.cyan}12`,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <div className="text-xs uppercase tracking-widest mb-1" style={{ color: NEON.cyan }}>
            You won
          </div>
          <div
            className="font-[var(--font-sora)] text-xl md:text-2xl font-extrabold"
            style={{ color: NEON.yellow }}
          >
            {prize}
          </div>
        </div>
        <canvas
          ref={canvasRef}
          className="absolute inset-0 cursor-crosshair touch-none"
          style={{
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.45s ease-out',
            pointerEvents: fading ? 'none' : 'auto',
          }}
        />
      </div>
      {showHint && !fading && (
        <div className="mt-3 text-center text-xs text-white/60 anim-fade-up">
          ↑ Scratch with your {isTouch ? 'finger' : 'mouse'}
        </div>
      )}
    </div>
  );
}

export default function LaunchClient() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [scratchPrize, setScratchPrize] = useState<string | null>(null);
  const toastIdRef = useRef(1);
  const exitFiredRef = useRef(false);
  const templatesRef = useRef<TemplateLite[]>([]);
  const newTemplatesRef = useRef<TemplateLite[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    trackEvent('$pageview', { page: 'launch' });
    reducedMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Fetch template list for real toasts
  useEffect(() => {
    const fallback: TemplateLite[] = TEMPLATES.map((t) => ({
      slug: t.slug,
      title: t.title,
      category: t.categories[0] ?? 'general',
    }));
    templatesRef.current = fallback;
    newTemplatesRef.current = fallback.filter((t) => t.category === 'general');

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(TEMPLATES_ENDPOINT);
        if (!res.ok) return;
        const json = (await res.json()) as unknown;
        if (cancelled) return;
        const list: TemplateLite[] = [];
        const maybeArr = Array.isArray(json)
          ? json
          : Array.isArray((json as { templates?: unknown }).templates)
          ? ((json as { templates: unknown[] }).templates)
          : Array.isArray((json as { data?: unknown }).data)
          ? ((json as { data: unknown[] }).data)
          : null;
        if (!maybeArr) return;
        for (const item of maybeArr) {
          if (item && typeof item === 'object') {
            const rec = item as Record<string, unknown>;
            const slug = typeof rec.slug === 'string' ? rec.slug : null;
            const title = typeof rec.title === 'string' ? rec.title : typeof rec.name === 'string' ? rec.name : null;
            const category = typeof rec.category === 'string' ? rec.category : undefined;
            if (slug && title) list.push({ slug, title, category });
          }
        }
        if (list.length > 0) {
          templatesRef.current = list;
          const only = list.filter((t) => t.category === 'other');
          newTemplatesRef.current = only.length > 0 ? only : list;
        }
      } catch {
        // keep fallback
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((cur) =>
      cur.map((t) => (t.id === id ? { ...t, departing: true } : t)),
    );
    window.setTimeout(() => {
      setToasts((cur) => cur.filter((t) => t.id !== id));
    }, 320);
  }, []);

  const pushToast = useCallback(() => {
    const generated = generateToast(templatesRef.current, newTemplatesRef.current);
    setToasts((prev) => {
      const nextId = toastIdRef.current++;
      const next: Toast = { id: nextId, type: generated.type, text: generated.text };
      const withNew = [...prev, next];
      const trimmed = withNew.slice(-3);
      window.setTimeout(() => {
        removeToast(nextId);
      }, 5000);
      return trimmed;
    });
  }, [removeToast]);

  useEffect(() => {
    const intervalRef: { current: number | null } = { current: null };
    const firstTimer = window.setTimeout(() => {
      pushToast();
      intervalRef.current = window.setInterval(pushToast, 8000);
    }, 3000);
    return () => {
      window.clearTimeout(firstTimer);
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [pushToast]);

  useEffect(() => {
    const sessionKey = 'wl_exit_intent_fired';
    const alreadyFiredThisSession = (() => {
      try {
        return window.sessionStorage.getItem(sessionKey) === '1';
      } catch {
        return false;
      }
    })();
    if (alreadyFiredThisSession) {
      exitFiredRef.current = true;
    }

    const onMouseLeave = (e: MouseEvent) => {
      if (exitFiredRef.current) return;
      if (e.clientY <= 0) {
        exitFiredRef.current = true;
        try {
          window.sessionStorage.setItem(sessionKey, '1');
        } catch {
          // ignore
        }
        trackEvent('exit_intent_triggered', { source: 'launch' });
        // Pre-pick prize so the scratch card can render the real value underneath
        const prize = SCRATCH_PRIZES[Math.floor(Math.random() * SCRATCH_PRIZES.length)];
        setScratchPrize(prize);
        setExitOpen(true);
      }
    };
    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, []);

  // Scroll reveal
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal], [data-reveal-child]'),
    );
    if (reduced) {
      for (const n of nodes) n.classList.add('reveal-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const delay = Number(el.dataset.delay ?? '0');
            el.style.transitionDelay = `${delay}ms`;
            el.classList.add('reveal-in');
            io.unobserve(el);
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, []);

  // Particle canvas
  const particleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let lastTime = performance.now();
    let sparkleTimer = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const spawn = (sparkle = false): Particle => {
      const life = sparkle ? 1000 : 4000 + Math.random() * 4000;
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.1,
        vy: -(0.15 + Math.random() * 0.35),
        life,
        maxLife: life,
        size: sparkle ? 4 + Math.random() * 2 : 1 + Math.random() * 2,
        color: NEON_COLORS_ARR[Math.floor(Math.random() * NEON_COLORS_ARR.length)],
        sparkle,
      };
    };

    const particles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const p = spawn(false);
      p.y = Math.random() * window.innerHeight;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;
      sparkleTimer += dt;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (sparkleTimer > 2000) {
        sparkleTimer = 0;
        particles.push(spawn(true));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) {
          if (p.sparkle) {
            particles.splice(i, 1);
          } else {
            particles[i] = spawn(false);
          }
          continue;
        }
        const t = p.life / p.maxLife;
        const fade = p.sparkle
          ? Math.sin((1 - t) * Math.PI) * 0.9
          : Math.sin(t * Math.PI) * 0.7;
        ctx.globalAlpha = Math.max(0, fade);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.sparkle) {
          ctx.globalAlpha = Math.max(0, fade * 0.4);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    window.addEventListener('resize', resize);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const onScratchRevealed = () => {
    if (scratchRevealed) return;
    setScratchRevealed(true);
    trackEvent('scratch_card_revealed', { prize: scratchPrize, source: 'exit-intent' });
  };

  const closeExit = () => setExitOpen(false);

  return (
    <div className="relative text-white overflow-x-hidden">
      {/* Bokeh background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="blob blob-1 absolute top-[-10%] left-[-10%] h-[40vw] w-[40vw] rounded-full"
          style={{ background: NEON.blue, opacity: 0.05, filter: 'blur(40px)' }}
        />
        <div
          className="blob blob-2 absolute top-[30%] right-[-15%] h-[45vw] w-[45vw] rounded-full"
          style={{ background: NEON.yellow, opacity: 0.04, filter: 'blur(40px)' }}
        />
        <div
          className="blob blob-3 absolute bottom-[-15%] left-[20%] h-[50vw] w-[50vw] rounded-full"
          style={{ background: NEON.magenta, opacity: 0.04, filter: 'blur(40px)' }}
        />
      </div>

      {/* Particle canvas layer */}
      <canvas
        ref={particleCanvasRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[1]"
      />

      <div className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-12 pb-4" data-reveal>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="anim-fade-up">
              <h1 className="font-[var(--font-sora)] text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6 text-neon-yellow glow-yellow">
                Stop Gambling on Your Website.
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
                Pick a proven layout, customize it, connect payments, and go live fast.
              </p>
              <ul className="space-y-3 mb-8 text-[15px]">
                <li className="flex items-start gap-3">
                  <span aria-hidden className="text-xl leading-6">⚡</span>
                  <span className="text-white/85">Templates aimed to convert</span>
                </li>
                <li className="flex items-start gap-3">
                  <span aria-hidden className="text-xl leading-6">⏱️</span>
                  <span className="text-white/85">Live in minutes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span aria-hidden className="text-xl leading-6">🛡️</span>
                  <span className="text-white/85">Enterprise security on Cloudflare</span>
                </li>
              </ul>
              <div className="relative w-full overflow-hidden rounded-xl border border-[#00D4FF]/20" style={{ paddingTop: '56.25%' }}>
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src={`https://www.youtube.com/embed/${YT_EMBED_ID}`}
                  title="Website Lotto intro"
                  frameBorder={0}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <div
              id="email-form"
              className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-8"
              style={{ boxShadow: `0 0 40px ${NEON.blue}15` }}
            >
              <h2 className="font-[var(--font-sora)] text-2xl font-bold mb-2" style={{ color: NEON.blue }}>
                Get Free Access
              </h2>
              <p className="text-sm text-white/70 mb-6">
                Gain access to voting, bidding, and winning new sites daily.
              </p>
              <EmailCaptureForm source="launch-hero" showName />
            </div>
          </div>
        </section>

        <NeonDivider />

        {/* How It Works */}
        <section id="how" className="mx-auto max-w-6xl px-6" data-reveal>
          <h2 className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12 text-neon-blue glow-blue">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: 1, t: 'Pick a Site', d: 'Browse proven layouts and claim the one that fits your business.' },
              { n: 2, t: 'Customize + Connect', d: 'Update copy, brand, contact info, and wire up Stripe in minutes.' },
              { n: 3, t: 'Launch + Sell', d: 'Flip the switch and start turning visitors into customers.' },
            ].map((s, i) => (
              <div
                key={s.n}
                data-reveal-child
                data-delay={i * 100}
                className={`reveal-init rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center ${cardAnim(i)}`}
              >
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full font-[var(--font-sora)] text-xl font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg, #00D4FF 0%, #00F0D0 100%)',
                    color: '#0a0a0a',
                  }}
                >
                  {s.n}
                </div>
                <h3 className="text-lg font-bold mb-2 text-white">{s.t}</h3>
                <p className="text-sm text-white/70 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </section>

        <NeonDivider />

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-6" data-reveal>
          <h2 className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12 text-neon-blue glow-blue">
            What You Get
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              delay={0}
              animCls={cardAnim(0)}
              accent={NEON.yellow}
              title="High-Converting Layout"
              body="Every template is designed around intent — built to turn visitors into paying customers."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              }
            />
            <FeatureCard
              delay={100}
              animCls={cardAnim(1)}
              accent={NEON.cyan}
              title="Premium Domain Hosting"
              body="Connect your own domain or get a fresh one. Cloudflare-powered DNS included."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              }
            />
            <FeatureCard
              delay={200}
              animCls={cardAnim(2)}
              accent={NEON.magenta}
              title="Cloudflare Security"
              body="DDoS protection, SSL, and global edge CDN on every site — no config required."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
            <FeatureCard
              delay={300}
              animCls={cardAnim(3)}
              accent={NEON.blue}
              title="Mobile Optimized"
              body="Pixel-perfect on every device — phones, tablets, big screens, and everything in between."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              }
            />
            <FeatureCard
              delay={400}
              animCls={cardAnim(4)}
              accent={NEON.yellow}
              title="Easy Transfer Anytime"
              body="You own your content. Cancel anytime and export everything — no lock-in, ever."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="17 1 21 5 17 9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <polyline points="7 23 3 19 7 15" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              }
            />
            <FeatureCard
              delay={500}
              animCls={cardAnim(5)}
              accent={NEON.cyan}
              title="Plug-and-Play Payments"
              body="Stripe built in. Accept payments from day one without touching a line of code."
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              }
            />
          </div>
        </section>

        <NeonDivider />

        {/* Social proof */}
        <section className="mx-auto max-w-6xl px-6" data-reveal>
          <div className="rounded-2xl bg-gradient-to-r from-[#00D4FF]/5 to-[#FF2D8A]/5 border border-white/10 p-10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div data-reveal-child data-delay={0} className={`reveal-init ${cardAnim(0)}`}>
                <div className="font-[var(--font-sora)] text-xl font-bold mb-2" style={{ color: NEON.blue }}>
                  Built for clarity first
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Every layout starts with the question: what is this visitor trying to decide?
                </p>
              </div>
              <div data-reveal-child data-delay={100} className={`reveal-init ${cardAnim(1)}`}>
                <div className="font-[var(--font-sora)] text-xl font-bold mb-2" style={{ color: NEON.yellow }}>
                  Designed to reduce bounce
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Clean hierarchy, fast loads, and a single obvious next step on every page.
                </p>
              </div>
              <div data-reveal-child data-delay={200} className={`reveal-init ${cardAnim(2)}`}>
                <div className="font-[var(--font-sora)] text-xl font-bold mb-2" style={{ color: NEON.magenta }}>
                  Engineered around intent
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  No filler, no stock fluff — just what the buyer needs to say yes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <NeonDivider />

        {/* Pricing — mirrors /pricing tiers */}
        <section id="pricing" className="mx-auto max-w-6xl px-6" data-reveal>
          <h2 className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-4 text-neon-blue glow-blue">
            Ready to launch?
          </h2>
          <p className="text-center text-white/70 mb-12">
            Three ways to acquire a site. One-time payment — no subscription for the site itself.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: ShoppingCart,
                title: 'Buy',
                price: 'One-time payment',
                body: 'Pick a template, pay list price, and own it outright. 12 months of hosting included.',
                color: 'blue' as const,
              },
              {
                icon: Gavel,
                title: 'Bid',
                price: 'Name your price',
                body: 'Place a bid below list. You only pay if you win — no outbid, no charge.',
                color: 'yellow' as const,
              },
              {
                icon: Ticket,
                title: 'Win',
                price: 'Free',
                body: 'Scratch a ticket and walk away with a free template, discount, or hosting credit.',
                color: 'magenta' as const,
              },
            ].map((p, i) => {
              const Icon = p.icon;
              const accent = p.color === 'yellow' ? NEON.yellow : p.color === 'magenta' ? NEON.magenta : NEON.blue;
              const textCls = p.color === 'yellow' ? 'text-neon-yellow' : p.color === 'magenta' ? 'text-neon-magenta' : 'text-neon-blue';
              return (
                <div
                  key={p.title}
                  data-reveal-child
                  data-delay={i * 100}
                  className={`reveal-init rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 flex flex-col ${cardAnim(i)}`}
                  style={{ borderColor: `${accent}44` }}
                >
                  <div
                    className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                    style={{ background: `${accent}1A`, color: accent }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className={`font-[var(--font-sora)] text-2xl font-bold mb-1 ${textCls}`}>{p.title}</h3>
                  <div className={`font-bold mb-3 ${textCls}`}>{p.price}</div>
                  <p className="text-white/70 text-sm leading-relaxed mb-6 flex-1">{p.body}</p>
                  <Link
                    href="/pricing"
                    className={`inline-flex items-center justify-center rounded-lg px-4 py-2 font-bold transition-transform hover:-translate-y-0.5 border ${textCls}`}
                    style={{ background: `${accent}14`, borderColor: `${accent}55` }}
                  >
                    See details →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <NeonDivider />

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6" data-reveal>
          <h2 className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12 text-neon-blue glow-blue">
            FAQ
          </h2>
          <FaqAccordion items={FAQS} />
        </section>

        <NeonDivider />

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-20" data-reveal>
          <div
            data-reveal-child
            data-delay={0}
            className="reveal-init rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-10 text-center"
            style={{ boxShadow: `0 0 40px ${NEON.yellow}15` }}
          >
            <h2 className="font-[var(--font-sora)] text-3xl md:text-4xl font-extrabold mb-4 text-neon-yellow glow-yellow">
              Ready to claim your template?
            </h2>
            <p className="text-white/80 mb-6">
              Drop your email. We&apos;ll send your access link instantly.
            </p>
            <div className="max-w-md mx-auto">
              <EmailCaptureForm source="launch-footer" showName={false} />
            </div>
          </div>
        </section>

      </div>

      {/* Activity toasts */}
      <div className="fixed bottom-6 left-6 z-[1500] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const meta = TOAST_META[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto relative flex items-start gap-3 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-md border px-4 py-3 max-w-sm shadow-lg overflow-hidden"
              style={{
                borderColor: `${meta.color}66`,
                animation: t.departing
                  ? 'toastExit 0.3s ease-in forwards'
                  : 'toastEnter 0.45s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              <span
                aria-hidden
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-lg"
                style={{ background: `${meta.color}1A` }}
              >
                {meta.icon}
              </span>
              <div className="flex-1 text-sm">
                <div className="font-semibold" style={{ color: meta.color }}>{meta.label}</div>
                <div className="text-white/80 text-[13px] leading-snug">{t.text}</div>
              </div>
              <div
                aria-hidden
                className="absolute bottom-0 left-0 h-[2px]"
                style={{
                  background: meta.color,
                  animation: t.departing ? 'none' : 'toastProgress 5s linear forwards',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Exit-intent modal */}
      {exitOpen && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
          style={{ animation: 'fadeIn 0.25s ease-out' }}
          onClick={closeExit}
        >
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-hidden />
          <div
            className="relative w-full max-w-md rounded-2xl bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] border p-8 text-center"
            style={{
              borderColor: `${NEON.blue}55`,
              boxShadow: `0 0 60px ${NEON.blue}33`,
              animation: 'slideUp 0.35s ease-out',
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="mb-3 text-xs font-bold uppercase tracking-widest"
              style={{ color: NEON.blue }}
            >
              Parting Gift
            </div>
            <h3
              className="font-[var(--font-sora)] text-3xl md:text-4xl font-extrabold mb-6"
              style={{ color: NEON.yellow, textShadow: `0 0 18px ${NEON.yellow}55` }}
            >
              Do you like lottos?
            </h3>

            {!scratchRevealed ? (
              <>
                <p className="text-white/75 mb-6 text-sm">
                  Scratch to reveal a gift — one try, one chance, on the house.
                </p>
                {scratchPrize && (
                  <ScratchCard
                    prize={scratchPrize}
                    onRevealed={onScratchRevealed}
                    reduced={reducedMotionRef.current}
                  />
                )}
              </>
            ) : (
              <div className="prize-reveal">
                <div
                  className="font-[var(--font-sora)] text-3xl md:text-4xl font-extrabold mb-2 prize-pop"
                  style={{ color: NEON.cyan, textShadow: `0 0 20px ${NEON.cyan}88` }}
                >
                  You won! 🎉
                </div>
                <div
                  className="mx-auto mb-6 rounded-xl border p-5 prize-pop"
                  style={{
                    background: `${NEON.cyan}12`,
                    borderColor: `${NEON.cyan}66`,
                    boxShadow: `0 0 40px ${NEON.cyan}44`,
                  }}
                >
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: NEON.cyan }}>
                    Your prize
                  </div>
                  <div
                    className="font-[var(--font-sora)] text-2xl md:text-3xl font-extrabold"
                    style={{ color: NEON.yellow, textShadow: `0 0 18px ${NEON.yellow}66` }}
                  >
                    {scratchPrize}
                  </div>
                </div>
                <Link
                  href="/"
                  className="cta-glow-pulse block w-full rounded-xl px-6 py-4 text-lg font-extrabold"
                  style={{
                    background: NEON.yellow,
                    color: '#0a0a0a',
                  }}
                >
                  {scratchPrize?.toLowerCase().includes('entire website')
                    ? 'Claim Your Free Website — Browse Templates'
                    : scratchPrize?.toLowerCase().includes('%')
                      ? `Use Your ${scratchPrize} — Browse Templates`
                      : scratchPrize?.toLowerCase().includes('$')
                        ? `Use Your ${scratchPrize} — Browse Templates`
                        : 'Claim Your Prize — Browse Templates'}
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={closeExit}
              className="mt-5 text-xs text-white/50 hover:text-white/80 transition-colors"
            >
              No thanks, I&apos;ll pass
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-24px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .anim-fade-up {
          animation: slideUp 0.5s ease-out;
        }

        /* Scroll reveal base state */
        .reveal-init {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .reveal-init.reveal-in {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes toastEnter {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          60% {
            opacity: 1;
            transform: translateX(4px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes toastExit {
          0% {
            opacity: 1;
            transform: translateX(0);
          }
          100% {
            opacity: 0;
            transform: translateX(-30px);
          }
        }
        @keyframes toastProgress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          @keyframes prizePop {
            0% { opacity: 0; transform: scale(0.6); }
            60% { opacity: 1; transform: scale(1.08); }
            100% { opacity: 1; transform: scale(1); }
          }
          .prize-pop {
            animation: prizePop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
          }
          @keyframes blobFloat1 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            25% { transform: translate(5vw, 3vh) scale(1.1); }
            50% { transform: translate(-3vw, 6vh) scale(0.9); }
            75% { transform: translate(4vw, -2vh) scale(1.15); }
          }
          @keyframes blobFloat2 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(-6vw, 4vh) scale(0.85); }
            66% { transform: translate(3vw, -5vh) scale(1.2); }
          }
          @keyframes blobFloat3 {
            0%, 100% { transform: translate(0, 0) scale(1); }
            20% { transform: translate(4vw, -4vh) scale(1.1); }
            50% { transform: translate(-5vw, -2vh) scale(0.95); }
            80% { transform: translate(2vw, 5vh) scale(1.15); }
          }
          .blob-1 { animation: blobFloat1 30s ease-in-out infinite; }
          .blob-2 { animation: blobFloat2 40s ease-in-out infinite; }
          .blob-3 { animation: blobFloat3 50s ease-in-out infinite; }

          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 24px rgba(255, 229, 52, 0.3); }
            50% { box-shadow: 0 0 40px rgba(255, 229, 52, 0.55), 0 0 80px rgba(255, 229, 52, 0.15); }
          }
          .cta-glow-pulse {
            animation: glowPulse 2.5s ease-in-out infinite;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal-init {
            opacity: 1;
            transform: none;
            transition: none;
          }
          .cta-glow-pulse {
            box-shadow: 0 0 24px rgba(255, 229, 52, 0.4);
          }
        }
      `}</style>
    </div>
  );
}
