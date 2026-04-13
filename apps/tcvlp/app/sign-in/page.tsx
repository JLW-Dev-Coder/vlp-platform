'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import styles from './page.module.css';

function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';

  const magicLinkUrl = `${API_BASE}/v1/auth/magic-link?platform=tcvlp&redirect=${encodeURIComponent(redirect)}`;
  const googleUrl = `${API_BASE}/v1/auth/google?platform=tcvlp&redirect=${encodeURIComponent(redirect)}`;

  return (
    <div className={styles.card}>
      <div className={styles.logoBox}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      </div>
      <h1 className={styles.title}>Sign in to TaxClaim Pro</h1>
      <p className={styles.sub}>Access your tax pro dashboard</p>

      <a href={googleUrl} className={styles.googleBtn}>
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </a>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <form action={magicLinkUrl} method="GET" className={styles.form}>
        <input type="hidden" name="platform" value="tcvlp" />
        <input type="hidden" name="redirect" value={redirect} />
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className={styles.input}
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          Send Magic Link
        </button>
      </form>

      <p className={styles.footer}>
        Don&apos;t have an account?{' '}
        <Link href="/sign-in?redirect=/onboarding" className={styles.footerLink}>
          Sign up — $10/month
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <div className={styles.root}>
      <div className={styles.inner}>
        <Suspense fallback={<div className={styles.card} style={{ color: '#6b7280', textAlign: 'center' }}>Loading…</div>}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  );
}
