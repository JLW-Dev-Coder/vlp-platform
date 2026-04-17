'use client'

import { AppShell } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'
import AuthGuard from '@/components/AuthGuard'
import OfficeContent from '@/app/dashboard/components/OfficeContent'

export default function OfficePage() {
  return (
    <AuthGuard>
      {() => (
        <AppShell config={tmpConfig}>
          <OfficeContent />
        </AppShell>
      )}
    </AuthGuard>
  )
}
