'use client'

import { TmpAppShell } from '@/components/TmpAppShell'
import AuthGuard from '@/components/AuthGuard'
import OfficeContent from '@/app/dashboard/components/OfficeContent'

export default function OfficePage() {
  return (
    <AuthGuard>
      {({ account }) => (
        <TmpAppShell>
          <OfficeContent account={account} />
        </TmpAppShell>
      )}
    </AuthGuard>
  )
}
