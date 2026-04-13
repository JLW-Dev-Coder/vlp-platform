'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { requestMagicLink, googleAuthUrl } from '@/lib/api';
import styles from './page.module.css';

function SignInForm() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleMagicLink(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await requestMagicLink(email);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleGoogle() {
    window.location.href = googleAuthUrl(redirect || undefined);
  }

  if (sent) {
    return (
      <div className={styles.successState}>
        <div className={styles.successIcon}>✉</div>
        <h2 className={styles.successHeadline}>Check your email</h2>
        <p className={styles.successDesc}>
          We sent a magic link to <strong className={styles.emailHighlight}>{email}</strong>.
          Click the link in your email to sign in.
        </p>
        <button
          className={styles.resendBtn}
          onClick={() => {
            setSent(false);
            setEmail('');
          }}
        >
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.logoMark}>
        <span>VLP</span>
      </div>
      <h1 className={styles.headline}>Sign in to Virtual Launch Pro</h1>

      {/* Magic link form */}
      <form onSubmit={handleMagicLink} className={styles.form} noValidate>
        <label htmlFor="email" className={styles.label}>
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        {error && <p className={styles.error}>{error}</p>}
        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={loading}
        >
          {loading ? 'Sending\u2026' : 'Send Magic Link'}
        </button>
      </form>

      {/* Divider */}
      <div className={styles.divider}>
        <span className={styles.dividerLine} />
        <span className={styles.dividerText}>OR</span>
        <span className={styles.dividerLine} />
      </div>

      {/* Google */}
      <button onClick={handleGoogle} className={styles.googleBtn}>
        <svg
          className={styles.googleIcon}
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
            fill="#4285F4"
          />
          <path
            d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
            fill="#34A853"
          />
          <path
            d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
            fill="#FBBC05"
          />
          <path
            d="M9 3.579c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.579 9 3.579z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>

      <p className={styles.footerNote}>
        Don&apos;t have an account?{' '}
        <Link href="/onboarding" className={styles.footerLink}>
          Get started free
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <main className={styles.main}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <Suspense fallback={<div className={styles.loading}>Loading&hellip;</div>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
