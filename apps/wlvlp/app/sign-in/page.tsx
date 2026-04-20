'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const PAGE = 'min-h-screen flex items-center justify-center p-6';
const CARD = 'w-full max-w-[420px] bg-white/[0.03] border border-white/[0.09] rounded-[20px] py-10 px-9 flex flex-col gap-5';
const LOGO_LINK = 'font-sora font-extrabold text-[1.3rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)]';
const TITLE = 'font-sora text-[1.8rem] font-bold text-white text-center -tracking-[0.5px] m-0';
const INPUT = 'w-full bg-white/[0.04] border border-white/[0.12] rounded-[10px] px-4 py-3 text-white text-[0.95rem] outline-none transition-colors focus:border-brand-primary/50 placeholder:text-white/30';
const BTN = 'w-full px-6 py-[13px] bg-brand-primary text-white font-bold text-[0.95rem] rounded-[10px] border-0 cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_0_36px_rgba(168,85,247,0.5)] disabled:opacity-60 disabled:cursor-not-allowed';

function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, redirect }),
      });
      if (!res.ok) throw new Error('Failed to send link');
      setStatus('sent');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className={PAGE}>
        <div className={CARD}>
          <div className="text-center"><Link href="/" className={LOGO_LINK}>Website Lotto</Link></div>
          <div className="flex flex-col items-center gap-3.5 text-center py-5">
            <span className="text-[3rem]">✉️</span>
            <h2 className="font-sora text-[1.4rem] font-bold text-white">Check your email</h2>
            <p className="text-white/60 text-[0.9rem] leading-relaxed">
              We sent a magic link to <strong className="text-brand-primary">{email}</strong>. Click the link to sign in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={PAGE}>
      <div className={CARD}>
        <div className="text-center"><Link href="/" className={LOGO_LINK}>Website Lotto</Link></div>
        <h1 className={TITLE}>Sign In</h1>
        <p className="text-white/50 text-[0.9rem] text-center leading-snug -mt-2">Enter your email — we&apos;ll send a magic link.</p>

        <form className="flex flex-col gap-3" onSubmit={handleMagicLink}>
          <input
            type="email"
            className={INPUT}
            placeholder="you@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {status === 'error' && (
            <p className="text-[var(--color-error)] text-[0.83rem] text-center px-3 py-2 bg-[rgba(239,68,68,0.08)] rounded-md border border-[rgba(239,68,68,0.2)]">
              {errorMsg}
            </p>
          )}
          <button type="submit" className={BTN} disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Send Magic Link'}
          </button>
        </form>

        <div className="flex items-center gap-3 text-white/20 text-[0.8rem] before:content-[''] before:flex-1 before:h-px before:bg-white/[0.08] after:content-[''] after:flex-1 after:h-px after:bg-white/[0.08]">
          <span className="text-white/30">or</span>
        </div>

        <a
          href={`/api/auth/google?redirect=${encodeURIComponent(redirect)}`}
          className="flex items-center justify-center gap-2.5 w-full px-6 py-3 bg-white/[0.04] border border-white/[0.12] rounded-[10px] text-white/85 text-[0.9rem] font-medium no-underline cursor-pointer transition-all hover:bg-white/[0.08] hover:border-white/20"
        >
          <GoogleLogo />
          Continue with Google
        </a>

        <p className="text-white/30 text-[0.75rem] text-center leading-relaxed">
          By signing in, you agree to our <Link href="/support" className="text-white/50 no-underline transition-colors hover:text-brand-primary">Terms of Service</Link>.
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

// Google brand path data — required by Google's "Sign in with Google" branding guidelines.
const GOOGLE_PATHS = [
  { d: 'M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z', fill: '#4285F4' }, // canonical: Google brand color required by Sign in with Google guidelines
  { d: 'M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z', fill: '#34A853' }, // canonical: Google brand color required by Sign in with Google guidelines
  { d: 'M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z', fill: '#FBBC05' }, // canonical: Google brand color required by Sign in with Google guidelines
  { d: 'M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z', fill: '#EA4335' }, // canonical: Google brand color required by Sign in with Google guidelines
];

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      {GOOGLE_PATHS.map((p) => (
        <path key={p.fill} d={p.d} fill={p.fill} />
      ))}
    </svg>
  );
}
