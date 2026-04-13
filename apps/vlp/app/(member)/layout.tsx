import { requireAuth } from '@/lib/auth/guard'
import { AppShell } from '@vlp/member-ui'
import { vlpConfig } from '@/lib/platform-config'

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAuth()

  return <AppShell config={vlpConfig}>{children}</AppShell>
}
