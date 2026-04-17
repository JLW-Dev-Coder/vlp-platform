'use client'

import { AppShell } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'
import AuthGuard from '@/components/AuthGuard'
import ReportContent from '@/app/dashboard/components/ReportContent'

export default function ReportPage() {
  return (
    <AuthGuard>
      {() => (
        <AppShell config={tmpConfig}>
          <ReportContent />
        </AppShell>
      )}
    </AuthGuard>
  )
}
