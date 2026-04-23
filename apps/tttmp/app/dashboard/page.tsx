'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'
import { api } from '@/lib/api'

interface AffiliateSummary {
  connect_status: string
  balance_pending: number
  balance_paid: number
}

function DashboardContent() {
  const [email, setEmail] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [affiliate, setAffiliate] = useState<AffiliateSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    api.getSession()
      .then(async (data) => {
        if (cancelled) return
        setEmail(data.session.email)
        const accountId = data.session.account_id

        try {
          const bal = await api.getTokenBalance(accountId)
          if (!cancelled) setBalance(bal.balance.tax_game_tokens)
        } catch {
          if (!cancelled) setBalance(0)
        }

        try {
          const aff = await api.getAffiliate(accountId)
          if (!cancelled) {
            setAffiliate({
              connect_status: aff.connect_status,
              balance_pending: aff.balance_pending,
              balance_paid: aff.balance_paid,
            })
          }
        } catch {
          if (!cancelled) setAffiliate(null)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const affiliateTotal = affiliate
    ? ((affiliate.balance_pending ?? 0) + (affiliate.balance_paid ?? 0)) / 100
    : 0
  const affiliateEnrolled = affiliate && affiliate.connect_status === 'active'

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        {/* Welcome */}
        <header className="mb-8">
          <h1 className="font-sora text-3xl font-extrabold text-white">
            Your Arcade Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--arcade-text-muted)]">
            {loading ? 'Loading…' : email ? `Welcome back, ${email}` : 'Welcome back'}
          </p>
        </header>

        {/* KPI Row */}
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Token Balance"
            value={loading ? '—' : String(balance ?? 0)}
            sublabel="tax game tokens"
            color="var(--neon-green)"
            glow="var(--arcade-glow-green)"
            iconPath="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"
          />
          <KpiCard
            label="Games Played"
            value="—"
            sublabel="Coming soon"
            color="var(--neon-violet)"
            glow="var(--arcade-glow-violet)"
            iconPath="M6 12h4m-2-2v4m5 0h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.63 6A4 4 0 0 0 6.05 19h11.9a4 4 0 0 0 3.977-4.41l-.63-6A4 4 0 0 0 17.32 5z"
          />
          <KpiCard
            label="Affiliate Earnings"
            value={affiliateEnrolled ? `$${affiliateTotal.toFixed(2)}` : 'Join'}
            sublabel={affiliateEnrolled ? 'total lifetime' : 'Start earning 20%'}
            color="var(--neon-amber)"
            glow="var(--arcade-glow-amber)"
            href="/affiliate"
            iconPath="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V4m0 12v2m-4-10h8"
          />
        </section>

        {/* Quick Actions */}
        <section className="mb-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <QuickAction
              href="/games"
              label="Browse Games"
              description="21 interactive tax games"
              color="var(--neon-violet)"
              iconPath="M6 12h4m-2-2v4m5 0h.01M18 10h.01M17.32 5H6.68a4 4 0 0 0-3.978 3.59l-.63 6A4 4 0 0 0 6.05 19h11.9a4 4 0 0 0 3.977-4.41l-.63-6A4 4 0 0 0 17.32 5z"
            />
            <QuickAction
              href="/pricing"
              label="Buy Tokens"
              description="Unlock more games"
              color="var(--neon-amber)"
              iconPath="M12 1v22M17 5H9.5a3.5 3.5 0 1 0 0 7h5a3.5 3.5 0 1 1 0 7H6"
            />
            <QuickAction
              href="/vesperi"
              label="Meet Vesperi"
              description="Your game guide AI"
              color="#06b6d4"
              iconPath="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5"
            />
            <QuickAction
              href="/learn"
              label="Walkthroughs"
              description="Video guides for every game"
              color="var(--neon-green)"
              iconPath="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
            Recent Activity
          </h2>
          <div
            className="rounded-2xl border p-8 text-center"
            style={{
              background: 'var(--arcade-surface)',
              borderColor: 'var(--arcade-border)',
            }}
          >
            <div
              className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full"
              style={{
                background: 'rgba(139, 92, 246, 0.12)',
                color: 'var(--neon-violet)',
              }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">Activity feed coming soon</p>
            <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
              We&apos;re building a timeline of your games played and token purchases.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  sublabel,
  color,
  glow,
  href,
  iconPath,
}: {
  label: string
  value: string
  sublabel: string
  color: string
  glow: string
  href?: string
  iconPath: string
}) {
  const inner = (
    <div
      className="rounded-2xl border p-5 transition hover:scale-[1.01]"
      style={{
        background: 'var(--arcade-surface)',
        borderColor: color,
        boxShadow: glow,
      }}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
          {label}
        </span>
        <span style={{ color }}>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </span>
      </div>
      <div
        className="mt-3 font-sora text-4xl font-extrabold"
        style={{ color, textShadow: `0 0 20px ${color}55` }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--arcade-text-muted)]">{sublabel}</div>
    </div>
  )
  return href ? <Link href={href}>{inner}</Link> : inner
}

function QuickAction({
  href,
  label,
  description,
  color,
  iconPath,
}: {
  href: string
  label: string
  description: string
  color: string
  iconPath: string
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border p-5 transition hover:scale-[1.02]"
      style={{
        background: 'var(--arcade-surface)',
        borderColor: 'var(--arcade-border)',
      }}
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110"
        style={{
          background: `${color}1a`,
          color,
          boxShadow: `0 0 20px ${color}33`,
        }}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div className="font-semibold text-white">{label}</div>
      <div className="mt-1 text-xs text-[var(--arcade-text-muted)]">{description}</div>
    </Link>
  )
}

export default function DashboardPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <DashboardContent />
      </AppShell>
    </AuthGate>
  )
}
