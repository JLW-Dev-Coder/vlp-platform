'use client'

import { useRouter } from 'next/navigation'
import { AppShell } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'

export function TmpAppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  return (
    <AppShell
      config={tmpConfig}
      onSearch={(q) => router.push(`/directory?q=${encodeURIComponent(q)}`)}
    >
      {children}
    </AppShell>
  )
}
