'use client'

import { useEffect, useState } from 'react'

interface AdminGateProps {
  apiBaseUrl: string
  children: React.ReactNode
  fallback?: React.ReactNode
  nonAdminRedirect?: string
}

type GateState = 'loading' | 'authorized' | 'redirecting'

export default function AdminGate({
  apiBaseUrl,
  children,
  fallback,
  nonAdminRedirect = '/',
}: AdminGateProps) {
  const [state, setState] = useState<GateState>('loading')

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/v1/auth/session`, {
          credentials: 'include',
        })
        if (cancelled) return
        if (!res.ok) {
          const path = encodeURIComponent(window.location.pathname)
          window.location.href = `/sign-in?redirect=${path}`
          setState('redirecting')
          return
        }
        const data = await res.json()
        if (cancelled) return
        const role = data.session?.role ?? data.role ?? null
        if (role !== 'admin') {
          window.location.href = nonAdminRedirect
          setState('redirecting')
          return
        }
        setState('authorized')
      } catch {
        if (cancelled) return
        const path = encodeURIComponent(window.location.pathname)
        window.location.href = `/sign-in?redirect=${path}`
        setState('redirecting')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [apiBaseUrl, nonAdminRedirect])

  if (state !== 'authorized') {
    return (
      <>
        {fallback ?? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--member-text-muted)' }}>
            Loading…
          </div>
        )}
      </>
    )
  }

  return <>{children}</>
}
