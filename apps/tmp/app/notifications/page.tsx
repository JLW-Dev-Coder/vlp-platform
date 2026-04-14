'use client'

import { useEffect, useState } from 'react'
import { ContentCard } from '@vlp/member-ui'
import { TmpAppShell } from '@/components/TmpAppShell'
import AuthGuard from '@/components/AuthGuard'
import type { SessionUser } from '@/components/AuthGuard'
import { tmpConfig } from '@/lib/platform-config'

interface Notification {
  id: string
  title: string
  description: string
  timestamp: string
  read: boolean
  type: 'transcript' | 'report' | 'account' | 'system'
}

const TYPE_ICONS: Record<Notification['type'], React.ReactNode> = {
  transcript: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-teal-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  report: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-blue-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  account: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-amber-400">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  system: (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" className="text-white/40">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

export default function NotificationsPage() {
  return (
    <AuthGuard>
      {({ account }) => (
        <TmpAppShell>
          <NotificationsContent account={account} />
        </TmpAppShell>
      )}
    </AuthGuard>
  )
}

function NotificationsContent({ account }: { account: SessionUser }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(
          `${tmpConfig.apiBaseUrl}/v1/notifications?account_id=${account.account_id}`,
          { credentials: 'include' }
        )
        if (res.ok) {
          const data = await res.json()
          setNotifications(data.notifications ?? [])
        }
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [account.account_id])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Notifications</h1>
        <p className="mt-2 text-sm text-white/50">
          Stay up to date with transcript changes, report activity, and account updates.
        </p>
      </div>

      {loading && (
        <ContentCard title="Loading">
          <div className="flex items-center gap-3 py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
            <span className="text-sm text-white/40">Loading notifications...</span>
          </div>
        </ContentCard>
      )}

      {!loading && (error || notifications.length === 0) && (
        <ContentCard title="Notifications">
          <div className="flex flex-col items-center py-12 text-center">
            <svg
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              className="mb-4 text-white/20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
            <h3 className="text-sm font-medium text-white/60">No notifications yet</h3>
            <p className="mt-2 max-w-xs text-xs text-white/30">
              You&apos;ll see alerts about transcript changes, report activity, and account updates here.
            </p>
          </div>
        </ContentCard>
      )}

      {!loading && !error && notifications.length > 0 && (
        <ContentCard title={`${notifications.length} Notification${notifications.length !== 1 ? 's' : ''}`}>
          <div className="divide-y divide-white/[0.06]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex items-start gap-3 py-4 ${!n.read ? 'bg-white/[0.02] -mx-6 px-6' : ''}`}
              >
                <div className="mt-0.5 shrink-0">{TYPE_ICONS[n.type] ?? TYPE_ICONS.system}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-medium ${n.read ? 'text-white/60' : 'text-white'}`}>
                      {n.title}
                    </p>
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-white/40">{n.description}</p>
                  <time className="mt-1 block text-xs text-white/25">
                    {new Date(n.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </ContentCard>
      )}
    </div>
  )
}
