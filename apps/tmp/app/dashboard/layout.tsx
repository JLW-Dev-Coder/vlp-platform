'use client'

import { AppShell, AuthGate } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGate apiBaseUrl={tmpConfig.apiBaseUrl}>
      <AppShell config={tmpConfig}>{children}</AppShell>
    </AuthGate>
  )
}
