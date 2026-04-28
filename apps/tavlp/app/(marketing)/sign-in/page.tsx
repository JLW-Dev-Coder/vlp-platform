'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { tavlpConfig } from '@/lib/platform-config'

const API_BASE = tavlpConfig.apiBaseUrl
const SITE_ORIGIN = 'https://taxavatar.virtuallaunch.pro'

function SignInForm() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/dashboard'

  const magicLinkUrl = `${API_BASE}/v1/auth/magic-link?platform=tavlp&redirect=${encodeURIComponent(redirect)}`
  const googleUrl = `${API_BASE}/v1/auth/google/start?return_to=${encodeURIComponent(`${SITE_ORIGIN}${redirect}`)}`

  return (
    <div className="rounded-2xl border border-subtle bg-surface-card p-8 md:p-10 shadow-md">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary font-extrabold text-lg">
        TAP
      </div>
      <h1 className="text-2xl md:text-3xl font-extrabold text-text-primary text-center mb-2">Sign in to Tax Avatar Pro</h1>
      <p className="text-sm text-text-muted text-center mb-8">Access your AI YouTube channel dashboard</p>

      <a
        href={googleUrl}
        className="flex items-center justify-center gap-2 w-full rounded-lg border border-subtle bg-surface-bg hover:bg-surface-elevated text-text-primary font-semibold px-4 py-3 transition-all"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </a>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-subtle" />
        <span className="text-xs uppercase tracking-widest text-text-muted">or</span>
        <div className="h-px flex-1 bg-subtle" />
      </div>

      <form action={magicLinkUrl} method="GET" className="space-y-4">
        <input type="hidden" name="platform" value="tavlp" />
        <input type="hidden" name="redirect" value={redirect} />
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-text-primary mb-2">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-subtle bg-surface-bg px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary font-bold px-4 py-3 shadow-lg hover:shadow-xl transition-all"
        >
          Continue with email
        </button>
      </form>

      <p className="mt-8 text-sm text-text-muted text-center">
        Don&apos;t have an account?{' '}
        <Link href="/#start" className="text-brand-primary hover:underline font-semibold">
          Get started →
        </Link>
      </p>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 md:py-24 bg-surface-bg">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="rounded-2xl border border-subtle bg-surface-card p-10 text-center text-text-muted">
              Loading…
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
