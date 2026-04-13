'use client'

import { AppShell } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'
import AuthGuard from '@/components/AuthGuard'
import ProfileContent from '@/app/dashboard/components/ProfileContent'

export default function ProfilePage() {
  return (
    <AuthGuard>
      {({ account }) => (
        <AppShell config={tmpConfig}>
          <ProfileContent account={account} />
        </AppShell>
      )}
    </AuthGuard>
  )
}
