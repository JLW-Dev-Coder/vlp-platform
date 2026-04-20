'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const POSTHOG_KEY = 'phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY';
const POSTHOG_HOST = 'https://us.i.posthog.com';
const LEADS_ENDPOINT = 'https://api.virtuallaunch.pro/v1/wlvlp/leads';
const YT_EMBED_ID = 'REPLACE_WITH_YT00A_VIDEO_ID';

const NEON = {
  blue: '#00D4FF',
  yellow: '#FFE534',
  magenta: '#FF2D8A',
  cyan: '#00F0D0',
};

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
type Toast = { id: number; type: ToastType; text: string };

const TOAST_POOL: Array<{ type: ToastType; text: string }> = [
  { type: 'vote', text: 'Morgan just voted on “Tampa Coastal CPA”' },
  { type: 'bid', text: 'A new bid of $312 was placed on “Boulder Wealth”' },
  { type: 'winner', text: 'Dana scratched a 50% OFF ticket' },
  { type: 'new', text: 'New template dropped: “Denver Tax Collective”' },
  { type: 'vote', text: 'Priya just voted on “Atlanta Legal Group”' },
  { type: 'bid', text: 'A new bid of $189 was placed on “Chicago Bookkeeping”' },
  { type: 'winner', text: 'Marcus won a free month of hosting' },
  { type: 'new', text: 'New template dropped: “Portland Estate Planning”' },
];

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
    a: 'Billing is a flat $99/mo. Connect Stripe in minutes to accept payments from your visitors — we never touch your revenue.',
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

type EmailFormProps = {
  source: 'launch-hero' | 'launch-footer';
  showName: boolean;
};

function EmailCaptureForm({ source, showName }: EmailFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full rounded-lg px-5 py-3 text-base font-bold transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-wait"
        style={{
          background: NEON.yellow,
          color: '#0a0a0a',
          boxShadow: `0 0 24px ${NEON.yellow}55`,
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

function FeatureCard({
  icon,
  title,
  body,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 hover:border-white/20 transition-colors">
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

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-white">{q}</span>
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold transition-transform"
          style={{
            background: `${NEON.blue}1A`,
            border: `1px solid ${NEON.blue}55`,
            color: NEON.blue,
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
          aria-hidden
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-white/75 leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function LaunchClient() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [exitOpen, setExitOpen] = useState(false);
  const [scratchRevealed, setScratchRevealed] = useState(false);
  const [scratchPrize, setScratchPrize] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toastIdRef = useRef(1);
  const exitFiredRef = useRef(false);

  useEffect(() => {
    trackEvent('$pageview', { page: 'launch' });
  }, []);

  const pushToast = useCallback(() => {
    const pick = TOAST_POOL[Math.floor(Math.random() * TOAST_POOL.length)];
    setToasts((prev) => {
      const nextId = toastIdRef.current++;
      const next: Toast = { id: nextId, type: pick.type, text: pick.text };
      const withNew = [...prev, next];
      const trimmed = withNew.slice(-3);
      setTimeout(() => {
        setToasts((cur) => cur.filter((t) => t.id !== nextId));
      }, 5000);
      return trimmed;
    });
  }, []);

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
        setExitOpen(true);
      }
    };
    document.addEventListener('mouseleave', onMouseLeave);
    return () => document.removeEventListener('mouseleave', onMouseLeave);
  }, []);

  const onScratchReveal = () => {
    if (scratchRevealed) return;
    const prize = SCRATCH_PRIZES[Math.floor(Math.random() * SCRATCH_PRIZES.length)];
    setScratchPrize(prize);
    setScratchRevealed(true);
    trackEvent('scratch_card_revealed', { prize, source: 'exit-intent' });
  };

  const closeExit = () => setExitOpen(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a2e] text-white font-[var(--font-dm-sans)] overflow-x-hidden">
      {/* Bokeh background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute top-[-10%] left-[-10%] h-[40vw] w-[40vw] rounded-full"
          style={{ background: NEON.blue, opacity: 0.03, filter: 'blur(40px)' }}
        />
        <div
          className="absolute top-[30%] right-[-15%] h-[45vw] w-[45vw] rounded-full"
          style={{ background: NEON.yellow, opacity: 0.03, filter: 'blur(40px)' }}
        />
        <div
          className="absolute bottom-[-15%] left-[20%] h-[50vw] w-[50vw] rounded-full"
          style={{ background: NEON.magenta, opacity: 0.03, filter: 'blur(40px)' }}
        />
      </div>

      {/* Sticky nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#00D4FF]/10">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="font-[var(--font-sora)] text-lg font-bold tracking-tight" style={{ color: NEON.yellow }}>
            Website Lotto
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-white/70">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <a
            href="#email-form"
            className="rounded-lg px-4 py-2 text-sm font-bold"
            style={{
              background: NEON.yellow,
              color: '#0a0a0a',
              boxShadow: `0 0 16px ${NEON.yellow}55`,
            }}
          >
            Get Free Access
          </a>
        </div>
      </nav>

      <main className="relative z-10 pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-12 pb-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="anim-fade-up">
              <h1
                className="font-[var(--font-sora)] text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6"
                style={{ color: NEON.yellow, textShadow: `0 0 18px ${NEON.yellow}55` }}
              >
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
        <section id="how" className="mx-auto max-w-6xl px-6">
          <h2
            className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12"
            style={{ color: NEON.blue, textShadow: `0 0 20px ${NEON.blue}66` }}
          >
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: 1, t: 'Pick a Site', d: 'Browse proven layouts and claim the one that fits your business.' },
              { n: 2, t: 'Customize + Connect', d: 'Update copy, brand, contact info, and wire up Stripe in minutes.' },
              { n: 3, t: 'Launch + Sell', d: 'Flip the switch and start turning visitors into customers.' },
            ].map((s) => (
              <div key={s.n} className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6 text-center">
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
        <section id="features" className="mx-auto max-w-6xl px-6">
          <h2
            className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12"
            style={{ color: NEON.blue, textShadow: `0 0 20px ${NEON.blue}66` }}
          >
            What You Get
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
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
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#00D4FF]/5 to-[#FF2D8A]/5 border border-white/10 p-10">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="font-[var(--font-sora)] text-xl font-bold mb-2" style={{ color: NEON.blue }}>
                  Built for clarity first
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Every layout starts with the question: what is this visitor trying to decide?
                </p>
              </div>
              <div>
                <div className="font-[var(--font-sora)] text-xl font-bold mb-2" style={{ color: NEON.yellow }}>
                  Designed to reduce bounce
                </div>
                <p className="text-sm text-white/70 leading-relaxed">
                  Clean hierarchy, fast loads, and a single obvious next step on every page.
                </p>
              </div>
              <div>
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

        {/* Pricing */}
        <section id="pricing" className="mx-auto max-w-6xl px-6">
          <h2
            className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12"
            style={{ color: NEON.blue, textShadow: `0 0 20px ${NEON.blue}66` }}
          >
            Ready to launch?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
              <div className="font-[var(--font-sora)] text-3xl font-extrabold mb-2" style={{ color: NEON.yellow }}>
                $99/mo
              </div>
              <div className="text-white/80">All templates included</div>
            </div>
            <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
              <div className="font-[var(--font-sora)] text-xl font-extrabold mb-2 text-white">
                Done in minutes
              </div>
              <div className="text-white/80">Not weeks or months</div>
            </div>
            <div className="rounded-xl bg-white/5 backdrop-blur-md border border-white/10 p-6">
              <div className="font-[var(--font-sora)] text-xl font-extrabold mb-2 text-white">
                Zero risk
              </div>
              <div className="text-white/80">Cancel anytime, keep your data</div>
            </div>
          </div>
        </section>

        <NeonDivider />

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6">
          <h2
            className="font-[var(--font-sora)] text-4xl md:text-5xl font-extrabold text-center mb-12"
            style={{ color: NEON.blue, textShadow: `0 0 20px ${NEON.blue}66` }}
          >
            FAQ
          </h2>
          <div className="space-y-3">
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                q={item.q}
                a={item.a}
                open={openFaq === i}
                onToggle={() => setOpenFaq((cur) => (cur === i ? null : i))}
              />
            ))}
          </div>
        </section>

        <NeonDivider />

        {/* Final CTA */}
        <section className="mx-auto max-w-3xl px-6 pb-20">
          <div
            className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 p-10 text-center"
            style={{ boxShadow: `0 0 40px ${NEON.yellow}15` }}
          >
            <h2
              className="font-[var(--font-sora)] text-3xl md:text-4xl font-extrabold mb-4"
              style={{ color: NEON.yellow, textShadow: `0 0 18px ${NEON.yellow}55` }}
            >
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

        {/* Footer */}
        <footer className="border-t border-white/10 py-10">
          <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm">
            <div className="font-[var(--font-sora)] text-lg font-bold" style={{ color: NEON.yellow }}>
              Website Lotto
            </div>
            <div className="text-white/50">
              © {new Date().getFullYear()} Website Lotto. All rights reserved.
            </div>
            <div className="flex gap-5 text-white/60">
              <a href="/legal/privacy" className="hover:text-white">Privacy</a>
              <a href="/legal/terms" className="hover:text-white">Terms</a>
              <a href="/contact" className="hover:text-white">Contact</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Activity toasts */}
      <div className="fixed bottom-6 left-6 z-[1500] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => {
          const meta = TOAST_META[t.type];
          return (
            <div
              key={t.id}
              className="pointer-events-auto flex items-start gap-3 rounded-xl bg-[#0a0a0a]/90 backdrop-blur-md border px-4 py-3 max-w-sm shadow-lg"
              style={{
                borderColor: `${meta.color}66`,
                animation: 'slideInLeft 0.35s ease-out',
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
                <button
                  type="button"
                  onClick={onScratchReveal}
                  className="w-full rounded-xl px-6 py-4 text-lg font-extrabold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    background: `linear-gradient(135deg, ${NEON.magenta} 0%, ${NEON.yellow} 100%)`,
                    color: '#0a0a0a',
                    boxShadow: `0 0 32px ${NEON.magenta}55`,
                  }}
                >
                  🎟️ Scratch Here
                </button>
              </>
            ) : (
              <>
                <div
                  className="mx-auto mb-6 rounded-xl border p-5"
                  style={{
                    background: `${NEON.cyan}12`,
                    borderColor: `${NEON.cyan}55`,
                    boxShadow: `0 0 32px ${NEON.cyan}33`,
                  }}
                >
                  <div className="text-xs uppercase tracking-widest mb-2" style={{ color: NEON.cyan }}>
                    You won
                  </div>
                  <div
                    className="font-[var(--font-sora)] text-2xl md:text-3xl font-extrabold"
                    style={{ color: NEON.yellow }}
                  >
                    {scratchPrize}
                  </div>
                </div>
                <a
                  href="/sign-in"
                  className="block w-full rounded-xl px-6 py-4 text-lg font-extrabold"
                  style={{
                    background: NEON.yellow,
                    color: '#0a0a0a',
                    boxShadow: `0 0 32px ${NEON.yellow}55`,
                  }}
                >
                  Claim Your Prize
                </a>
              </>
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
      `}</style>
    </div>
  );
}
