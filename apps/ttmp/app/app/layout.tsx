'use client'

import { AppShell, AuthGate, useAppShell } from '@vlp/member-ui'
import { ttmpConfig } from '@/lib/platform-config'
import { BalanceProvider } from '@/lib/balance-context'

function AppInner({ children }: { children: React.ReactNode }) {
  const { session } = useAppShell()
  return (
    <BalanceProvider accountId={session.account_id}>
      {children}
    </BalanceProvider>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate apiBaseUrl={ttmpConfig.apiBaseUrl}>
      <AppShell config={ttmpConfig}>
        <AppInner>{children}</AppInner>
      </AppShell>
    </AuthGate>
  )
}
