'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export interface AppSession {
  email: string
  accountId: string
  balance: number
  plan: string
}

const SessionContext = createContext<AppSession | null>(null)

const API_BASE = 'https://api.taxmonitor.pro'

export function TTMPSessionGuard({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AppSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.ok && data.session) {
          setSession({
            email: data.session.email,
            accountId: data.session.account_id,
            balance: data.session.transcript_tokens ?? 0,
            plan: data.session.membership || 'free',
          })
        } else {
          window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`
        }
      })
      .catch(() => {
        window.location.href = `/login/?redirect=${encodeURIComponent(window.location.pathname)}`
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-white/[0.08] border-t-teal-500" />
      </div>
    )
  }

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  )
}

export function useAppSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useAppSession must be used within TTMPSessionGuard')
  return ctx
}
