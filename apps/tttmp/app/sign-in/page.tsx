'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'

type View = 'default' | 'magic-link' | 'check-email'

function SignInContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const oauthError = searchParams.get('error')

  const [view, setView] = useState<View>('default')
  const [email, setEmail] = useState('')
  const [error, setError] = useState(oauthError || '')
  const [googleLoading, setGoogleLoading] = useState(false)
  const [magicLoading, setMagicLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  useEffect(() => {
    api
      .getSession()
      .then((res) => {
        if (res.ok && res.session) router.replace(redirect)
      })
      .catch(() => {})
  }, [router, redirect])

  const handleGoogle = () => {
    setGoogleLoading(true)
    setError('')
    const returnTo = encodeURIComponent(`https://taxtools.taxmonitor.pro${redirect}`)
    window.location.href = `https://api.taxmonitor.pro/v1/auth/google/start?return_to=${returnTo}`
  }

  const handleMagicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setMagicLoading(true)
    setError('')
    try {
      const fullRedirect = `https://taxtools.taxmonitor.pro${redirect}`
      await api.requestMagicLink(email.trim(), fullRedirect)
      setView('check-email')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send magic link')
    } finally {
      setMagicLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    setResendSuccess(false)
    try {
      const fullRedirect = `https://taxtools.taxmonitor.pro${redirect}`
      await api.requestMagicLink(email.trim(), fullRedirect)
      setResendSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend')
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen arcade-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo — clickable, links to homepage */}
        <Link
          href="/"
          className="flex flex-col items-center gap-3 mb-8 group"
        >
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-transform group-hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--neon-violet), var(--neon-cyan))',
              boxShadow: 'var(--arcade-glow-violet)',
            }}
          >
            TTA
          </div>
          <span className="text-[var(--arcade-text)] font-semibold text-lg">
            Tax Tools Arcade
          </span>
        </Link>

        {/* Sign-in card */}
        <div className="arcade-card-static p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Sign in to continue</h1>
          <p className="text-[var(--arcade-text-muted)] text-sm mb-6">
            Login is required to access your dashboard and play games.
          </p>

          {error && (
            <div
              className="mb-4 flex items-start gap-2 rounded-lg border p-3 text-left text-sm"
              style={{
                borderColor: 'rgba(239, 68, 68, 0.4)',
                background: 'rgba(239, 68, 68, 0.08)',
                color: '#fca5a5',
              }}
            >
              <svg className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {view === 'default' && (
            <>
              <button
                type="button"
                onClick={handleGoogle}
                disabled={googleLoading}
                className="arcade-btn arcade-btn-amber w-full h-12"
              >
                {googleLoading ? (
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                )}
                Continue with Google
              </button>

              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-[var(--arcade-border)]" />
                <span className="text-[var(--arcade-text-muted)] text-xs uppercase tracking-wider">or</span>
                <div className="flex-1 h-px bg-[var(--arcade-border)]" />
              </div>

              <button
                type="button"
                onClick={() => setView('magic-link')}
                className="arcade-btn arcade-btn-secondary w-full h-12"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Magic Link
              </button>
            </>
          )}

          {view === 'magic-link' && (
            <form onSubmit={handleMagicSubmit} className="text-left">
              <label htmlFor="email" className="block text-sm font-medium text-[var(--arcade-text)] mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="arcade-input mb-4"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
              <button
                type="submit"
                disabled={magicLoading || !email.trim()}
                className="arcade-btn arcade-btn-secondary w-full h-12 mb-3"
              >
                {magicLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                    Sending…
                  </>
                ) : (
                  'Send magic link'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setView('default')
                  setError('')
                }}
                className="w-full text-sm text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors"
              >
                ← Back to sign-in options
              </button>
            </form>
          )}

          {view === 'check-email' && (
            <div>
              <div
                className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  color: 'var(--neon-violet)',
                  boxShadow: 'var(--arcade-glow-violet)',
                }}
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
              <p className="text-sm text-[var(--arcade-text-muted)] mb-5">
                We sent a magic link to <strong className="text-[var(--arcade-text)]">{email}</strong>. Click the link to sign in.
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="arcade-btn arcade-btn-secondary w-full h-11 mb-3"
              >
                {resendLoading ? 'Resending…' : 'Resend magic link'}
              </button>
              {resendSuccess && (
                <p className="text-xs text-[var(--neon-green)] mb-3">Email resent successfully.</p>
              )}
              <button
                type="button"
                onClick={() => {
                  setView('default')
                  setError('')
                  setResendSuccess(false)
                }}
                className="w-full text-sm text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors"
              >
                ← Back to sign-in options
              </button>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-lg border border-[var(--arcade-border)] bg-[var(--arcade-surface)]">
          <p className="text-[var(--arcade-text-muted)] text-xs flex items-start gap-2">
            <svg className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>
              Tax Tools Arcade provides interactive tax education games. It does not provide tax advice or preparation services.
            </span>
          </p>
        </div>

        {/* Legal links */}
        <nav className="mt-6 flex justify-center gap-6 text-sm">
          <Link href="/legal/privacy" className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors">
            Privacy
          </Link>
          <Link href="/legal/terms" className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors">
            Terms
          </Link>
          <Link href="/contact" className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  )
}
