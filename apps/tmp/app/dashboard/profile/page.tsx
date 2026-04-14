'use client'

import { TmpAppShell } from '@/components/TmpAppShell'
import AuthGuard from '@/components/AuthGuard'
import ProfileContent from '@/app/dashboard/components/ProfileContent'

export default function ProfilePage() {
  return (
    <AuthGuard>
      {({ account }) => (
        <TmpAppShell>
          <ProfileContent account={account} />
        </TmpAppShell>
      )}
    </AuthGuard>
  )
}
