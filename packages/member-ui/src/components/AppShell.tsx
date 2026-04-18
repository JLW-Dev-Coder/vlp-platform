'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { PlatformConfig } from '../types/config'
import { MemberSidebar } from './MemberSidebar'
import { MemberTopbar } from './MemberTopbar'

// ---------------------------------------------------------------------------
// Session context
// ---------------------------------------------------------------------------

interface SessionData {
  email: string | null
  avatar: string | null
  account_id: string | null
  role: string | null
}

interface AppShellContextValue {
  config: PlatformConfig
  session: SessionData
  signOut: () => Promise<void>
}

const AppShellContext = createContext<AppShellContextValue | null>(null)

export function useAppShell() {
  const ctx = useContext(AppShellContext)
  if (!ctx) throw new Error('useAppShell must be used within <AppShell>')
  return ctx
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface AppShellProps {
  config: PlatformConfig
  children: React.ReactNode
}

export function AppShell({ config, children }: AppShellProps) {
  const [session, setSession] = useState<SessionData>({ email: null, avatar: null, account_id: null, role: null })

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/v1/auth/session`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d) return
        const email = d.session?.email ?? d.email ?? null
        const avatar = d.session?.avatar ?? d.avatar ?? null
        const account_id = d.session?.account_id ?? d.account_id ?? null
        const role = d.session?.role ?? d.role ?? null
        setSession({ email, avatar, account_id, role })
      })
      .catch(() => {})
  }, [config.apiBaseUrl])

  async function signOut() {
    await fetch(`${config.apiBaseUrl}/v1/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {})
    window.location.href = config.routes.signIn
  }

  return (
    <AppShellContext.Provider value={{ config, session, signOut }}>
      <div className="flex h-screen overflow-hidden bg-[var(--member-bg)]">
        <MemberSidebar config={config} onSignOut={signOut} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <MemberTopbar config={config} session={session} onSignOut={signOut} />
          <main className="flex-1 overflow-y-auto px-8 py-8 sidebar-scroll">
            {children}
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  )
}
