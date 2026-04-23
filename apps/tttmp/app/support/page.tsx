'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, BookOpen, Clock, Phone } from 'lucide-react'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

interface TicketRow {
  ticket_id: string
  subject: string
  category?: string | null
  priority?: string | null
  status: string
  created_at: string
  updated_at?: string | null
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function normalizeStatus(s: string): 'open' | 'pending' | 'resolved' {
  const v = (s || '').toLowerCase()
  if (v === 'open' || v === 'reopened') return 'open'
  if (v === 'in_progress' || v === 'awaiting' || v === 'pending') return 'pending'
  return 'resolved'
}

function StatusBadge({ status }: { status: string }) {
  const kind = normalizeStatus(status)
  const styles = {
    open: {
      background: 'rgba(34, 197, 94, 0.12)',
      color: 'var(--neon-green)',
      border: '1px solid rgba(34, 197, 94, 0.35)',
      label: 'OPEN',
    },
    pending: {
      background: 'rgba(245, 158, 11, 0.12)',
      color: 'var(--neon-amber)',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      label: 'IN PROGRESS',
    },
    resolved: {
      background: 'rgba(148, 163, 184, 0.12)',
      color: 'var(--arcade-text-muted)',
      border: '1px solid rgba(148, 163, 184, 0.35)',
      label: 'RESOLVED',
    },
  }[kind]
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
      style={styles}
    >
      {styles.label}
    </span>
  )
}

function SupportContent() {
  const [tickets, setTickets] = useState<TicketRow[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sessionRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sessionJson = await sessionRes.json().catch(() => null)
        const accountId = sessionJson?.session?.account_id
        if (!accountId) {
          if (!cancelled) {
            setTickets([])
            setLoading(false)
          }
          return
        }
        const res = await fetch(
          `${API_BASE}/v1/support/tickets/by-account/${accountId}`,
          { credentials: 'include' }
        ).catch(() => null)
        if (cancelled) return
        if (res?.ok) {
          const json = await res.json().catch(() => null)
          const list: TicketRow[] = json?.tickets || (Array.isArray(json) ? json : [])
          setTickets(list)
        } else {
          setTickets([])
        }
      } catch {
        if (!cancelled) setTickets([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const openCount = (tickets ?? []).filter((t) => normalizeStatus(t.status) === 'open').length
  const pendingCount = (tickets ?? []).filter((t) => normalizeStatus(t.status) === 'pending').length
  const resolvedCount = (tickets ?? []).filter((t) => normalizeStatus(t.status) === 'resolved').length

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            Support
          </h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Manage support tickets and get help.
          </p>
        </header>

        <div className="mb-6 flex flex-wrap gap-3">
          <Link href="/support/new" className="arcade-btn arcade-btn-secondary">
            <Plus className="h-4 w-4" />
            Create New Ticket
          </Link>
          <a
            href="/help"
            target="_blank"
            rel="noopener noreferrer"
            className="arcade-btn arcade-btn-cyan"
          >
            <BookOpen className="h-4 w-4" />
            View Help Docs
          </a>
        </div>

        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatusKpi
            label="Open"
            count={loading ? '—' : openCount}
            sublabel="Awaiting response"
            color="var(--neon-green)"
            glow="var(--arcade-glow-green)"
          />
          <StatusKpi
            label="Pending"
            count={loading ? '—' : pendingCount}
            sublabel="In progress"
            color="var(--neon-amber)"
            glow="var(--arcade-glow-amber)"
          />
          <StatusKpi
            label="Resolved"
            count={loading ? '—' : resolvedCount}
            sublabel="Completed"
            color="var(--arcade-text-muted)"
            glow="none"
          />
        </section>

        <section className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
            <span
              className="inline-block h-3 w-[3px] rounded-sm"
              style={{ background: 'var(--neon-violet)', boxShadow: 'var(--arcade-glow-violet)' }}
            />
            Support Tickets
          </h2>
          <div className="arcade-card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-sm text-[var(--arcade-text-muted)]">Loading…</div>
            ) : !tickets || tickets.length === 0 ? (
              <div className="p-10 text-center">
                <p className="text-sm font-semibold text-white">No tickets yet.</p>
                <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                  Create one if you need help.
                </p>
                <Link
                  href="/support/new"
                  className="arcade-btn arcade-btn-secondary mt-5 inline-flex"
                >
                  <Plus className="h-4 w-4" />
                  Create Ticket
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr
                      className="border-b border-[var(--arcade-border)]"
                      style={{ background: 'rgba(139, 92, 246, 0.08)' }}
                    >
                      <Th>Subject</Th>
                      <Th>Category</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th>Last Update</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr
                        key={t.ticket_id}
                        onClick={() => {
                          window.location.href = `/support/ticket?id=${encodeURIComponent(t.ticket_id)}`
                        }}
                        className="cursor-pointer border-b border-[var(--arcade-border)] last:border-b-0 transition-colors hover:bg-[var(--arcade-surface-hover)]"
                      >
                        <Td>
                          <Link
                            href={`/support/ticket?id=${encodeURIComponent(t.ticket_id)}`}
                            className="font-medium text-white hover:text-[var(--neon-violet)]"
                          >
                            {t.subject || '(no subject)'}
                          </Link>
                        </Td>
                        <Td>{t.category || t.priority || 'General'}</Td>
                        <Td>
                          <StatusBadge status={t.status} />
                        </Td>
                        <Td className="text-[var(--arcade-text-muted)]">{formatDate(t.created_at)}</Td>
                        <Td className="text-[var(--arcade-text-muted)]">
                          {formatDate(t.updated_at || t.created_at)}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="arcade-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Need Immediate Assistance?</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(139, 92, 246, 0.12)',
                  color: 'var(--neon-violet)',
                  boxShadow: 'var(--arcade-glow-violet)',
                }}
              >
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Response Time</p>
                <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                  We typically respond within 2–4 hours during business hours (9 AM – 6 PM PST).
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                style={{
                  background: 'rgba(6, 182, 212, 0.12)',
                  color: 'var(--neon-cyan)',
                  boxShadow: 'var(--arcade-glow-cyan)',
                }}
              >
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Phone Support</p>
                <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                  Premium Pro members can call our support line at{' '}
                  <a
                    href="tel:+16198005457"
                    className="text-[var(--neon-cyan)] hover:text-white transition"
                  >
                    +1 (619) 800-5457
                  </a>{' '}
                  for priority assistance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function StatusKpi({
  label,
  count,
  sublabel,
  color,
  glow,
}: {
  label: string
  count: number | string
  sublabel: string
  color: string
  glow: string
}) {
  return (
    <div
      className="arcade-card p-5"
      style={{ boxShadow: glow !== 'none' ? glow : undefined }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
        {label}
      </p>
      <p
        className="mt-2 font-sora text-4xl font-extrabold"
        style={{ color, textShadow: glow !== 'none' ? `0 0 20px ${color}55` : undefined }}
      >
        {count}
      </p>
      <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">{sublabel}</p>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--neon-violet)]">
      {children}
    </th>
  )
}

function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-4 align-middle ${className}`}>{children}</td>
}

export default function SupportPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <SupportContent />
      </AppShell>
    </AuthGate>
  )
}
