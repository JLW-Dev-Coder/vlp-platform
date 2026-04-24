'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'
import { GAMES } from '@/lib/games'
import { api } from '@/lib/api'

const API_BASE = tttmpConfig.apiBaseUrl

interface Session {
  account_id: string
  email: string
}

interface Balance {
  tax_game_tokens: number
  transcript_tokens: number
}

interface Membership {
  plan_name?: string | null
  interval?: string | null
  renews_at?: string | null
  amount?: number | null
  currency?: string | null
}

interface UsageEntry {
  id?: string
  amount?: number
  delta?: number
  type?: string
  reason?: string
  label?: string
  description?: string
  created_at?: string
  balance_after?: number | null
  slug?: string
  [k: string]: unknown
}

interface GameSession {
  id: string
  game_slug: string
  tokens_cost: number
  started_at: string
}

function formatDate(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function monthlyAllocation(planName?: string | null): number {
  const n = (planName || '').toLowerCase()
  if (n.includes('premium') || n.includes('pro')) return 50
  if (n.includes('standard') || n.includes('plus')) return 25
  if (n.includes('starter') || n.includes('basic')) return 10
  return 0
}

function TokensContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [session, setSession] = useState<Session | null>(null)
  const [balance, setBalance] = useState<Balance | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [usage, setUsage] = useState<UsageEntry[] | null>(null)
  const [gameSessions, setGameSessions] = useState<GameSession[]>([])
  const [gameTotal, setGameTotal] = useState(0)
  const [tokensSpentTotal, setTokensSpentTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [purchaseToast, setPurchaseToast] = useState<
    { kind: 'processing' | 'success' | 'error'; message: string } | null
  >(null)

  const gameTitleBySlug = useMemo(() => {
    const map: Record<string, string> = {}
    for (const g of GAMES) map[g.slug] = g.title
    return map
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sJson = await sRes.json().catch(() => null)
        const sess: Session | undefined = sJson?.session
        if (!sess?.account_id) {
          if (!cancelled) setLoading(false)
          return
        }
        if (cancelled) return
        setSession(sess)

        const [balRes, memRes, usageRes, gsRes] = await Promise.all([
          fetch(`${API_BASE}/v1/tokens/balance/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/memberships/by-account/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/tokens/usage/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/tttmp/game-sessions`, { credentials: 'include' }).catch(() => null),
        ])

        if (!cancelled && balRes?.ok) {
          const bj = await balRes.json().catch(() => null)
          if (bj?.balance) setBalance(bj.balance)
        }
        if (!cancelled && memRes?.ok) {
          const mj = await memRes.json().catch(() => null)
          const m = mj?.membership || (Array.isArray(mj?.memberships) ? mj.memberships[0] : null)
          if (m) setMembership(m)
        }
        if (!cancelled && usageRes?.ok) {
          const uj = await usageRes.json().catch(() => null)
          const list: UsageEntry[] =
            uj?.usage || uj?.entries || uj?.transactions || uj?.history ||
            (Array.isArray(uj) ? uj : [])
          setUsage(Array.isArray(list) ? list : [])
        } else if (!cancelled) {
          setUsage([])
        }
        if (!cancelled && gsRes?.ok) {
          const gj = await gsRes.json().catch(() => null)
          if (gj) {
            setGameSessions(gj.sessions || [])
            setGameTotal(gj.total || 0)
            setTokensSpentTotal(gj.tokens_spent || 0)
          }
        }
      } catch {
        // degrade gracefully
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Detect ?checkout=success&session_id=... and trigger token crediting via the
  // status endpoint (idempotent — returns already_credited on replay).
  useEffect(() => {
    if (searchParams.get('checkout') !== 'success') return
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return

    let cancelled = false
    setPurchaseToast({ kind: 'processing', message: 'Processing your purchase…' })
    ;(async () => {
      try {
        const res = await api.getCheckoutStatus(sessionId)
        if (cancelled) return
        if (res.ok && (res.credits_added || res.already_credited)) {
          if (typeof res.balance === 'number') {
            setBalance((prev) => ({
              tax_game_tokens: res.balance ?? prev?.tax_game_tokens ?? 0,
              transcript_tokens: prev?.transcript_tokens ?? 0,
            }))
          }
          setPurchaseToast({
            kind: 'success',
            message: res.already_credited
              ? 'Tokens already credited to your balance.'
              : `${res.credits_added} tokens added to your balance!`,
          })
        } else {
          setPurchaseToast({
            kind: 'error',
            message: 'Payment received — tokens will appear shortly. Refresh if not visible.',
          })
        }
      } catch {
        if (!cancelled) {
          setPurchaseToast({
            kind: 'error',
            message: 'Could not confirm purchase. Refresh to update your balance.',
          })
        }
      } finally {
        if (!cancelled) router.replace('/dashboard/tokens')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [searchParams, router])

  const tokenBalance = balance?.tax_game_tokens ?? 0
  const planName = membership?.plan_name || null
  const allocation = monthlyAllocation(planName)
  const hasMembership = !!planName

  // Derive monthly spend from game sessions (current month) as a fallback
  // when the /v1/tokens/usage endpoint does not return month-scoped totals.
  const tokensSpentThisMonth = useMemo(() => {
    const now = new Date()
    const y = now.getFullYear()
    const m = now.getMonth()
    return gameSessions.reduce((sum, s) => {
      const d = new Date(s.started_at)
      if (d.getFullYear() === y && d.getMonth() === m) return sum + (s.tokens_cost || 0)
      return sum
    }, 0)
  }, [gameSessions])

  const allocationUsed = Math.min(tokensSpentThisMonth, allocation)
  const allocationPct = allocation > 0 ? Math.round((allocationUsed / allocation) * 100) : 0

  // Unified activity list — merge usage entries (credits + debits from
  // memberships/purchases) with game sessions (debits). Fall back to game
  // sessions alone if usage is empty.
  type ActivityRow = {
    id: string
    label: string
    type: 'credit' | 'debit'
    amount: number
    date: string
    balanceAfter?: number | null
  }

  const activity: ActivityRow[] = useMemo(() => {
    const rows: ActivityRow[] = []

    for (const u of usage || []) {
      const amt = (u.amount ?? u.delta ?? 0) as number
      if (!amt && amt !== 0) continue
      const isCredit =
        (u.type && String(u.type).toLowerCase() === 'credit') ||
        (typeof amt === 'number' && amt > 0 && !u.type)
      const label =
        u.label ||
        u.description ||
        u.reason ||
        (u.slug ? (gameTitleBySlug[u.slug] || u.slug) : null) ||
        (isCredit ? 'Token credit' : 'Token spend')
      rows.push({
        id: String(u.id ?? `${u.created_at}-${amt}`),
        label,
        type: isCredit ? 'credit' : 'debit',
        amount: Math.abs(amt),
        date: u.created_at || '',
        balanceAfter: (u.balance_after ?? null) as number | null,
      })
    }

    if (rows.length === 0) {
      for (const s of gameSessions) {
        rows.push({
          id: s.id,
          label: gameTitleBySlug[s.game_slug] || s.game_slug,
          type: 'debit',
          amount: s.tokens_cost,
          date: s.started_at,
        })
      }
    }

    return rows
      .filter((r) => r.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 20)
  }, [usage, gameSessions, gameTitleBySlug])

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            Tokens
          </h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Manage your token balance and purchases.
          </p>
        </header>

        {purchaseToast ? (
          <div
            role="status"
            className="mb-6 rounded-lg p-4 text-sm font-medium"
            style={{
              background:
                purchaseToast.kind === 'success'
                  ? 'rgba(34, 197, 94, 0.10)'
                  : purchaseToast.kind === 'error'
                  ? 'rgba(236, 72, 153, 0.10)'
                  : 'rgba(139, 92, 246, 0.10)',
              border: `1px solid ${
                purchaseToast.kind === 'success'
                  ? 'rgba(34, 197, 94, 0.45)'
                  : purchaseToast.kind === 'error'
                  ? 'rgba(236, 72, 153, 0.45)'
                  : 'rgba(139, 92, 246, 0.45)'
              }`,
              color:
                purchaseToast.kind === 'success'
                  ? 'var(--neon-green)'
                  : purchaseToast.kind === 'error'
                  ? 'var(--neon-pink)'
                  : 'var(--neon-violet)',
            }}
          >
            {purchaseToast.message}
          </div>
        ) : null}

        {/* Balance hero */}
        <section className="arcade-card mb-6 p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
            Current Token Balance
          </p>
          <p
            className="mt-3 font-sora text-6xl font-extrabold leading-none"
            style={{ color: 'var(--neon-green)', textShadow: '0 0 24px rgba(34, 197, 94, 0.55)' }}
          >
            {loading ? '—' : tokenBalance.toLocaleString()}
          </p>
          <p className="mt-4 max-w-xl text-sm text-[var(--arcade-text-muted)]">
            {hasMembership
              ? `Your tokens automatically replenish with your membership. ${planName} members receive ${allocation} tokens/month.`
              : 'Top up any time, or subscribe to a plan to receive monthly tokens automatically.'}
          </p>
          <div className="mt-6">
            <Link href="/pricing" className="arcade-btn arcade-btn-amber inline-flex h-11 items-center px-6">
              Refill Tokens
            </Link>
          </div>
        </section>

        {/* Stats row */}
        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Games Played"
            value={loading ? '—' : String(gameTotal)}
            subtitle="all time"
            color="var(--neon-cyan)"
            glow="var(--arcade-glow-cyan)"
          />
          <StatCard
            label="Tokens Spent"
            value={loading ? '—' : String(tokensSpentThisMonth)}
            subtitle="this month"
            color="var(--neon-pink)"
            glow="var(--arcade-glow-pink)"
          />
          <StatCard
            label="Tokens Remaining"
            value={loading ? '—' : String(tokenBalance)}
            subtitle="current balance"
            color="var(--neon-green)"
            glow="var(--arcade-glow-green)"
          />
        </section>

        {/* Membership allocation */}
        <section className="arcade-card mb-6 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Membership Token Summary</h2>
          {hasMembership ? (
            <>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <p className="text-base font-semibold text-white">{planName}</p>
                  <p className="text-xs text-[var(--arcade-text-muted)]">
                    Renews {formatDate(membership?.renews_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="font-sora text-2xl font-bold"
                    style={{ color: 'var(--neon-violet)' }}
                  >
                    {allocation} <span className="text-sm font-medium text-[var(--arcade-text-muted)]">tokens</span>
                  </p>
                  <p className="text-xs text-[var(--arcade-text-muted)]">per month</p>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
                  Monthly Allocation Progress
                </span>
                <span className="text-[var(--arcade-text)]">
                  {allocationUsed} of {allocation} ({allocationPct}%)
                </span>
              </div>
              <div
                className="h-3 w-full overflow-hidden rounded-full"
                style={{ background: 'var(--arcade-surface-hover)' }}
              >
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{
                    width: `${allocationPct}%`,
                    background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                    boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
                  }}
                />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-start gap-3">
              <p className="text-sm text-[var(--arcade-text-muted)]">
                No active membership. Subscribe to get monthly tokens automatically.
              </p>
              <Link href="/pricing" className="arcade-btn arcade-btn-secondary inline-flex h-10 items-center px-5 text-sm">
                Upgrade
              </Link>
            </div>
          )}
        </section>

        {/* Recent token activity */}
        <section className="arcade-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Recent Token Activity</h2>
          {loading ? (
            <p className="py-8 text-center text-sm text-[var(--arcade-text-muted)]">Loading…</p>
          ) : activity.length === 0 ? (
            <div className="py-10 text-center">
              <p className="mb-4 text-sm text-[var(--arcade-text-muted)]">
                No token activity yet. Play a game to get started!
              </p>
              <Link href="/games" className="arcade-btn arcade-btn-primary inline-flex h-11 items-center px-6">
                Browse Games
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left"
                    style={{ borderBottom: '1px solid var(--arcade-border)' }}
                  >
                    <Th>Activity</Th>
                    <Th>Type</Th>
                    <Th>Tokens</Th>
                    <Th>Date</Th>
                    <Th>Balance</Th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((row) => (
                    <tr
                      key={row.id}
                      className="transition-colors hover:bg-[var(--arcade-surface-hover)]"
                      style={{ borderBottom: '1px solid var(--arcade-border)' }}
                    >
                      <td className="px-3 py-3 font-semibold text-white">{row.label}</td>
                      <td className="px-3 py-3">
                        <TypePill type={row.type} />
                      </td>
                      <td
                        className="px-3 py-3 font-mono font-semibold"
                        style={{ color: row.type === 'credit' ? 'var(--neon-green)' : 'var(--neon-pink)' }}
                      >
                        {row.type === 'credit' ? '+' : '-'}
                        {row.amount}
                      </td>
                      <td className="px-3 py-3 text-[var(--arcade-text)]">{formatDate(row.date)}</td>
                      <td className="px-3 py-3 font-mono text-[var(--arcade-text-muted)]">
                        {row.balanceAfter ?? '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(usage?.length ?? 0) > 20 || gameSessions.length > 20 ? (
                <div className="mt-4 text-right">
                  <Link href="/dashboard/game-activity" className="text-xs text-[var(--neon-violet)] hover:underline">
                    View all activity →
                  </Link>
                </div>
              ) : null}
            </div>
          )}
        </section>

        {session ? null : loading ? null : (
          <p className="mt-6 text-center text-sm text-[var(--arcade-text-muted)]">
            Please sign in to view your tokens.
          </p>
        )}
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
      {children}
    </th>
  )
}

function TypePill({ type }: { type: 'credit' | 'debit' }) {
  const isCredit = type === 'credit'
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        background: isCredit ? 'rgba(34, 197, 94, 0.12)' : 'rgba(236, 72, 153, 0.12)',
        color: isCredit ? 'var(--neon-green)' : 'var(--neon-pink)',
        border: `1px solid ${isCredit ? 'rgba(34, 197, 94, 0.35)' : 'rgba(236, 72, 153, 0.35)'}`,
      }}
    >
      {isCredit ? 'Credit' : 'Debit'}
    </span>
  )
}

function StatCard({
  label,
  value,
  subtitle,
  color,
  glow,
}: {
  label: string
  value: string
  subtitle: string
  color: string
  glow: string
}) {
  return (
    <div
      className="rounded-xl p-5 text-center"
      style={{
        background: 'var(--arcade-surface)',
        border: `1px solid ${color}`,
        boxShadow: glow,
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
        {label}
      </div>
      <div
        className="font-sora text-3xl font-extrabold mt-1"
        style={{ color, textShadow: `0 0 20px ${color}55` }}
      >
        {value}
      </div>
      <div className="mt-1 text-xs text-[var(--arcade-text-muted)]">{subtitle}</div>
    </div>
  )
}

export default function TokensPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <TokensContent />
      </AppShell>
    </AuthGate>
  )
}
