'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

export default function SignOutPage() {
  const [done, setDone] = useState(false)

  useEffect(() => {
    let cancelled = false
    api
      .logout()
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setDone(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen arcade-grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo — clickable, links to homepage */}
        <Link href="/" className="flex flex-col items-center gap-3 mb-8 group">
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

        {/* Sign-out card */}
        <div className="arcade-card-static p-8 text-center">
          <div
            className="mx-auto mb-4 h-12 w-12 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(139, 92, 246, 0.12)',
              color: 'var(--neon-violet)',
              boxShadow: 'var(--arcade-glow-violet)',
            }}
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {done ? "You've been signed out" : 'Signing you out…'}
          </h1>
          <p className="text-[var(--arcade-text-muted)] text-sm mb-6">
            Thanks for playing. See you next time.
          </p>

          <Link
            href="/sign-in"
            className="arcade-btn arcade-btn-primary w-full h-12 mb-3 inline-flex items-center justify-center"
          >
            Sign In Again
          </Link>
          <Link
            href="/"
            className="arcade-btn arcade-btn-secondary w-full h-12 inline-flex items-center justify-center"
          >
            Back to Arcade
          </Link>
        </div>

        {/* Legal links */}
        <nav className="mt-6 flex justify-center gap-6 text-sm">
          <Link
            href="/legal/privacy"
            className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/legal/terms"
            className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-[var(--arcade-text-muted)] hover:text-[var(--arcade-text)] transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  )
}
