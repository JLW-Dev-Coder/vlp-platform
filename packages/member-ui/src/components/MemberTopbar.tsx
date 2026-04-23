'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Bell, HelpCircle, LogOut, Settings, UserCircle } from 'lucide-react'
import type { PlatformConfig } from '../types/config'
import { useAppShell } from './AppShell'

interface MemberTopbarProps {
  config: PlatformConfig
  session: { email: string | null; avatar: string | null }
  onSignOut: () => void
  /** Optional override — when not provided, the topbar self-fetches from the Worker. */
  unreadNotifications?: number
}

interface NotificationRow {
  notification_id: string
  account_id: string
  title: string
  message: string
  severity?: string
  read: number | boolean
  created_at: string
  link?: string | null
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Date.now() - then
  if (diff < 60 * 1000) return 'just now'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(then).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function MemberTopbar({ config, session, onSignOut, unreadNotifications }: MemberTopbarProps) {
  const shell = useAppShell()
  const accountId = shell.session.account_id
  const apiBaseUrl = config.apiBaseUrl

  const [avatarOpen, setAvatarOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationRow[]>([])
  const [unreadCount, setUnreadCount] = useState<number>(unreadNotifications ?? 0)
  const avatarRef = useRef<HTMLDivElement>(null)
  const bellRef = useRef<HTMLDivElement>(null)

  const initial = session.email ? session.email[0].toUpperCase() : '?'

  const loadNotifications = useCallback(async () => {
    if (!accountId) return
    try {
      const res = await fetch(
        `${apiBaseUrl}/v1/notifications/in-app?accountId=${encodeURIComponent(accountId)}&limit=8`,
        { credentials: 'include' }
      )
      if (!res.ok) return
      const json = await res.json().catch(() => null)
      if (!json) return
      const rows: NotificationRow[] = Array.isArray(json.notifications) ? json.notifications : []
      setNotifications(rows)
      if (typeof json.unreadCount === 'number') {
        setUnreadCount(json.unreadCount)
      } else {
        setUnreadCount(rows.filter((n) => !(n.read === 1 || n.read === true)).length)
      }
    } catch {
      // ignore
    }
  }, [accountId, apiBaseUrl])

  // Initial fetch + 60s polling + refetch on window focus
  useEffect(() => {
    if (unreadNotifications !== undefined) return // parent owns the count
    if (!accountId) return
    loadNotifications()
    const interval = window.setInterval(loadNotifications, 60_000)
    const onFocus = () => loadNotifications()
    window.addEventListener('focus', onFocus)
    return () => {
      window.clearInterval(interval)
      window.removeEventListener('focus', onFocus)
    }
  }, [accountId, loadNotifications, unreadNotifications])

  useEffect(() => {
    if (unreadNotifications !== undefined) setUnreadCount(unreadNotifications)
  }, [unreadNotifications])

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false)
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false)
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setAvatarOpen(false)
        setBellOpen(false)
      }
    }
    if (avatarOpen || bellOpen) {
      document.addEventListener('mousedown', handle)
      document.addEventListener('keydown', handleEsc)
    }
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [avatarOpen, bellOpen])

  async function openBell() {
    const willOpen = !bellOpen
    setBellOpen(willOpen)
    if (willOpen) await loadNotifications()
  }

  async function handleNotificationClick(n: NotificationRow) {
    const isRead = n.read === 1 || n.read === true
    if (!isRead) {
      // Optimistic update
      setNotifications((list) =>
        list.map((x) => (x.notification_id === n.notification_id ? { ...x, read: 1 } : x))
      )
      setUnreadCount((c) => Math.max(0, c - 1))
      fetch(`${apiBaseUrl}/v1/notifications/in-app/${encodeURIComponent(n.notification_id)}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      }).catch(() => {})
    }
    setBellOpen(false)
    if (n.link && typeof window !== 'undefined') {
      window.location.href = n.link
    }
  }

  const notificationsHref = config.routes.notifications ?? '/notifications'

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[var(--member-bg)]/80 px-6 backdrop-blur">
      <div />

      <div className="flex items-center gap-1">
        {/* Bell with dropdown */}
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={openBell}
            className="relative rounded-lg p-2.5 text-white/40 transition hover:bg-white/[0.04] hover:text-white"
            aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
            aria-expanded={bellOpen}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div
              className="absolute right-0 top-full z-10 mt-2 w-[360px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#0f1333] shadow-md"
              role="menu"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                <span className="text-sm font-semibold text-white">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-xs text-white/50">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center">
                    <Bell className="mx-auto h-8 w-8 text-white/20" />
                    <p className="mt-3 text-sm text-white/50">No notifications yet</p>
                  </div>
                ) : (
                  <ul>
                    {notifications.map((n) => {
                      const isRead = n.read === 1 || n.read === true
                      return (
                        <li key={n.notification_id}>
                          <button
                            type="button"
                            onClick={() => handleNotificationClick(n)}
                            className="flex w-full items-start gap-3 border-b border-white/[0.04] px-4 py-3 text-left transition hover:bg-white/[0.04] last:border-b-0"
                          >
                            <span
                              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${isRead ? 'bg-white/20' : ''}`}
                              style={!isRead ? { background: config.brandColor } : undefined}
                              aria-hidden
                            />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-white">
                                {n.title}
                              </span>
                              {n.message && (
                                <span className="mt-0.5 block truncate text-xs text-white/60">
                                  {n.message}
                                </span>
                              )}
                              <span className="mt-1 block text-[11px] text-white/40">
                                {formatRelative(n.created_at)}
                              </span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
              <Link
                href={notificationsHref}
                onClick={() => setBellOpen(false)}
                className="block border-t border-white/[0.06] px-4 py-3 text-center text-xs font-semibold text-white/70 transition hover:bg-white/[0.04] hover:text-white"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <a
          href="/help"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-2.5 text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          aria-label="Help Center"
        >
          <HelpCircle className="h-5 w-5" />
        </a>

        {/* Avatar + dropdown */}
        <div className="relative ml-2" ref={avatarRef}>
          <button
            type="button"
            onClick={() => setAvatarOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition hover:ring-2"
            style={{ '--tw-ring-color': `${config.brandColor}66` } as React.CSSProperties}
            aria-label="Account menu"
          >
            {session.avatar ? (
              <img src={session.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${config.brandColor}, ${config.brandColor}cc)` }}
              >
                {initial}
              </span>
            )}
          </button>

          {avatarOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-52 rounded-xl border border-white/[0.08] bg-[#0f1333] p-2 shadow-2xl">
              {session.email && (
                <div className="truncate px-3 py-2 text-xs text-white/40">{session.email}</div>
              )}
              <div className="my-1 border-t border-white/[0.06]" />
              <Link
                href={config.routes.account}
                onClick={() => setAvatarOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Account
              </Link>
              <Link
                href={config.routes.profile}
                onClick={() => setAvatarOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </Link>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400/70 transition hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
