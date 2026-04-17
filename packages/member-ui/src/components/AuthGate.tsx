'use client'

import { useEffect, useState } from 'react'

interface AuthGateProps {
  apiBaseUrl: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

type GateState = 'loading' | 'authed'

export function AuthGate({ apiBaseUrl, children, fallback }: AuthGateProps) {
  const [state, setState] = useState<GateState>('loading')

  useEffect(() => {
    let cancelled = false

    fetch(`${apiBaseUrl}/v1/auth/session`, { credentials: 'include' })
      .then((r) => {
        if (cancelled) return
        if (r.status === 401 || !r.ok) {
          const redirect = encodeURIComponent(window.location.pathname)
          window.location.href = `/sign-in?redirect=${redirect}`
          return
        }
        setState('authed')
      })
      .catch(() => {
        if (cancelled) return
        const redirect = encodeURIComponent(window.location.pathname)
        window.location.href = `/sign-in?redirect=${redirect}`
      })

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl])

  if (state === 'loading') {
    return (
      <>
        {fallback ?? (
          <div className="flex min-h-screen items-center justify-center text-sm text-[var(--member-text-muted)]">
            Loading…
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}

export default AuthGate
