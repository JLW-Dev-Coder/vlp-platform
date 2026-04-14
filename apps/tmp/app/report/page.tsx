'use client'

import { TmpAppShell } from '@/components/TmpAppShell'
import AuthGuard from '@/components/AuthGuard'
import ReportContent from '@/app/dashboard/components/ReportContent'

export default function ReportPage() {
  return (
    <AuthGuard>
      {({ account }) => (
        <TmpAppShell>
          <ReportContent account={account} />
        </TmpAppShell>
      )}
    </AuthGuard>
  )
}
