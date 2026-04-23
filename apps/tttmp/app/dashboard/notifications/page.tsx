'use client'

import { useEffect, useState } from 'react'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

interface NotificationRow {
  notification_id: string
  account_id: string
  title: string
  message: string
  severity?: string
  read: number | boolean
  created_at: string
}

interface Preferences {
  inAppEnabled: boolean
  smsEnabled: boolean
}

interface CategorySetting {
  key: string
  label: string
  description: string
  comingSoon?: boolean
}

const CATEGORIES: CategorySetting[] = [
  { key: 'support_tickets', label: 'Support Tickets', description: 'Receive updates on ticket status changes' },
  { key: 'booking_reminders', label: 'Booking Reminders', description: 'Get reminded before upcoming appointments' },
  { key: 'account_activity', label: 'Account Activity', description: 'Be notified of login attempts and account changes' },
  { key: 'token_usage', label: 'Token Usage Alerts', description: 'Alert when token balance is low' },
  { key: 'game_updates', label: 'Game Updates', description: 'New games and feature announcements', comingSoon: true },
]

const CATEGORY_STORAGE_KEY = 'tttmp_notification_categories_v1'

function formatRelativeTime(iso: string): string {
  const then = new Date(iso)
  if (isNaN(then.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - then.getTime()
  const oneDay = 24 * 60 * 60 * 1000
  const sameDay = then.toDateString() === now.toDateString()
  const yesterday = new Date(now.getTime() - oneDay).toDateString() === then.toDateString()
  const timeStr = then.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  if (sameDay) return `Today at ${timeStr}`
  if (yesterday) return `Yesterday at ${timeStr}`
  if (diffMs < 7 * oneDay) {
    return `${then.toLocaleDateString('en-US', { weekday: 'long' })} at ${timeStr}`
  }
  return then.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function Toggle({
  active,
  onToggle,
  disabled,
  label,
}: {
  active: boolean
  onToggle: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={label}
      disabled={disabled}
      onClick={onToggle}
      className={`arcade-toggle ${active ? 'active' : ''}`}
    >
      <span className="thumb" />
    </button>
  )
}

function NotificationsContent() {
  const [accountId, setAccountId] = useState<string | null>(null)
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [categories, setCategories] = useState<Record<string, boolean>>({})
  const [notifications, setNotifications] = useState<NotificationRow[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(CATEGORY_STORAGE_KEY) : null
    const initialCats: Record<string, boolean> = {}
    for (const c of CATEGORIES) initialCats[c.key] = true
    if (stored) {
      try {
        Object.assign(initialCats, JSON.parse(stored))
      } catch {
        // ignore malformed storage
      }
    }
    setCategories(initialCats)

    ;(async () => {
      try {
        const sessionRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sessionJson = await sessionRes.json()
        if (cancelled) return
        const aid = sessionJson?.session?.account_id
        if (!aid) {
          setLoading(false)
          return
        }
        setAccountId(aid)

        const [prefsRes, notifRes] = await Promise.all([
          fetch(`${API_BASE}/v1/notifications/preferences/${aid}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/notifications/in-app?accountId=${encodeURIComponent(aid)}&limit=50`, {
            credentials: 'include',
          }).catch(() => null),
        ])

        if (!cancelled && prefsRes?.ok) {
          const pj = await prefsRes.json().catch(() => null)
          if (pj?.preferences) {
            setPrefs({
              inAppEnabled: !!pj.preferences.inAppEnabled,
              smsEnabled: !!pj.preferences.smsEnabled,
            })
          }
        }

        if (!cancelled && notifRes?.ok) {
          const nj = await notifRes.json().catch(() => null)
          if (nj?.notifications) {
            setNotifications(nj.notifications)
          } else {
            setNotifications([])
          }
        } else if (!cancelled) {
          setNotifications([])
        }
      } catch {
        if (!cancelled) setNotifications([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  async function toggleCategory(key: string) {
    const next = { ...categories, [key]: !categories[key] }
    setCategories(next)
    try {
      window.localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore storage errors
    }

    if (key === 'account_activity' && accountId && prefs) {
      const updated = { ...prefs, inAppEnabled: next[key] }
      setPrefs(updated)
      try {
        await fetch(`${API_BASE}/v1/notifications/preferences/${accountId}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inAppEnabled: updated.inAppEnabled }),
        })
      } catch {
        // non-blocking
      }
    }
  }

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="font-sora text-3xl font-extrabold text-white">Notifications</h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Stay updated on your account activity and support tickets.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          {/* Settings */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
              Notification Settings
            </h2>
            <div className="arcade-card-static divide-y divide-[var(--arcade-border)]">
              {CATEGORIES.map((cat) => {
                const active = !!categories[cat.key]
                return (
                  <div key={cat.key} className="flex items-start justify-between gap-4 p-5">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{cat.label}</p>
                        {cat.comingSoon && (
                          <span className="rounded-full border border-[var(--arcade-border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[var(--arcade-text-muted)]">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">{cat.description}</p>
                    </div>
                    <Toggle
                      label={cat.label}
                      active={active}
                      onToggle={() => toggleCategory(cat.key)}
                      disabled={cat.comingSoon}
                    />
                  </div>
                )
              })}
            </div>
          </section>

          {/* Recent notifications */}
          <section>
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
              Recent Notifications
            </h2>
            <div className="arcade-card-static">
              {loading ? (
                <div className="p-8 text-center text-sm text-[var(--arcade-text-muted)]">Loading…</div>
              ) : !notifications || notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div
                    className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: 'rgba(139, 92, 246, 0.12)', color: 'var(--neon-violet)' }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">No notifications yet</p>
                  <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                    We&apos;ll let you know when something happens.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[var(--arcade-border)]">
                  {notifications.map((n) => {
                    const isRead = n.read === 1 || n.read === true
                    return (
                      <li key={n.notification_id} className="flex items-start gap-3 p-4">
                        <div
                          className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                          style={{
                            background: isRead ? 'var(--arcade-text-muted)' : 'var(--neon-violet)',
                            boxShadow: isRead ? 'none' : 'var(--arcade-glow-violet)',
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[var(--arcade-text)]">{n.title}</p>
                          {n.message && (
                            <p className="mt-0.5 text-sm text-[var(--arcade-text-muted)]">{n.message}</p>
                          )}
                          <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                            {formatRelativeTime(n.created_at)}
                          </p>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default function NotificationsPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <NotificationsContent />
      </AppShell>
    </AuthGate>
  )
}
