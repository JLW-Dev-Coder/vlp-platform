import { AppShell } from '@vlp/member-ui'
import { ttmpConfig } from '@/lib/platform-config'
import { TTMPSessionGuard } from './SessionContext'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell config={ttmpConfig}>
      <TTMPSessionGuard>{children}</TTMPSessionGuard>
    </AppShell>
  )
}
