'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, Send } from 'lucide-react'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

interface Ticket {
  ticket_id: string
  account_id: string
  subject: string
  message: string
  category?: string | null
  priority?: string | null
  status: string
  created_at: string
  updated_at?: string | null
}

interface MessageRow {
  message_id: string
  account_id: string
  body?: string
  subject?: string
  created_at: string
  author?: string
  direction?: 'inbound' | 'outbound'
  sender_type?: 'user' | 'support'
}

async function fetchMessages(ticketId: string): Promise<MessageRow[]> {
  try {
    const res = await fetch(
      `${API_BASE}/v1/support/messages?ticket_id=${encodeURIComponent(ticketId)}`,
      { credentials: 'include' }
    )
    if (!res.ok) return []
    const json = await res.json().catch(() => null)
    if (!json?.ok || !Array.isArray(json.messages)) return []
    return json.messages as MessageRow[]
  } catch {
    return []
  }
}

function normalizeStatus(s: string): 'open' | 'pending' | 'resolved' | 'closed' {
  const v = (s || '').toLowerCase()
  if (v === 'open' || v === 'reopened') return 'open'
  if (v === 'in_progress' || v === 'pending' || v === 'awaiting') return 'pending'
  if (v === 'closed') return 'closed'
  return 'resolved'
}

function statusStyles(status: string) {
  const k = normalizeStatus(status)
  if (k === 'open')
    return { bg: 'rgba(34,197,94,0.12)', color: 'var(--neon-green)', border: 'rgba(34,197,94,0.35)', label: 'OPEN' }
  if (k === 'pending')
    return { bg: 'rgba(245,158,11,0.12)', color: 'var(--neon-amber)', border: 'rgba(245,158,11,0.35)', label: 'IN PROGRESS' }
  if (k === 'closed')
    return { bg: 'rgba(148,163,184,0.12)', color: 'var(--arcade-text-muted)', border: 'rgba(148,163,184,0.35)', label: 'CLOSED' }
  return { bg: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: 'rgba(59,130,246,0.35)', label: 'RESOLVED' }
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const diff = Date.now() - then
  if (diff < 60_000) return 'just now'
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`
  return new Date(then).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatFull(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-US')
}

function TicketDetailContent() {
  const params = useSearchParams()
  const ticketId = params?.get('id') || ''

  const [accountId, setAccountId] = useState<string | null>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<MessageRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    if (!ticketId) {
      setLoading(false)
      setError('Missing ticket id')
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const sessionRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sessionJson = await sessionRes.json().catch(() => null)
        const aid = sessionJson?.session?.account_id
        if (!aid) {
          if (!cancelled) {
            setError('Not signed in')
            setLoading(false)
          }
          return
        }
        if (!cancelled) setAccountId(aid)

        const res = await fetch(
          `${API_BASE}/v1/support/tickets/${encodeURIComponent(ticketId)}`,
          { credentials: 'include' }
        )
        if (cancelled) return
        if (!res.ok) {
          setError(res.status === 404 ? 'Ticket not found' : 'Failed to load ticket')
          setLoading(false)
          return
        }
        const json = await res.json().catch(() => null)
        const t = json?.ticket
        if (!t) {
          setError('Ticket not found')
          setLoading(false)
          return
        }
        setTicket({
          ticket_id: t.ticket_id || ticketId,
          account_id: t.account_id,
          subject: t.subject || '',
          message: t.message || '',
          category: t.category ?? null,
          priority: t.priority ?? null,
          status: t.status || 'open',
          created_at: t.created_at || new Date().toISOString(),
          updated_at: t.updated_at ?? null,
        })
        const thread = await fetchMessages(ticketId)
        if (!cancelled) setMessages(thread)
      } catch {
        if (!cancelled) setError('Failed to load ticket')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [ticketId])

  async function submitReply(e: React.FormEvent) {
    e.preventDefault()
    if (!reply.trim() || !accountId || !ticket) return
    setSending(true)
    setSendError(null)
    try {
      const res = await fetch(`${API_BASE}/v1/support/messages`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reply',
          account_id: accountId,
          ticket_id: ticket.ticket_id,
          body: reply.trim(),
        }),
      })
      const json = await res.json().catch(() => null)
      if (!res.ok || !json?.ok) {
        setSendError(json?.message || 'Failed to send reply')
        return
      }
      const now = new Date().toISOString()
      setMessages((prev) => [
        ...(prev || []),
        {
          message_id: json.message_id || `local_${Date.now()}`,
          account_id: accountId,
          body: reply.trim(),
          created_at: now,
          direction: 'outbound',
          sender_type: 'user',
          author: 'you',
        },
      ])
      setReply('')
      const refreshed = await fetchMessages(ticket.ticket_id)
      if (refreshed.length > 0) setMessages(refreshed)
    } catch {
      setSendError('Network error — please try again')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="arcade-card p-10 text-center text-sm text-[var(--arcade-text-muted)]">Loading…</div>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/support"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--arcade-text-muted)] transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Link>
          <div className="arcade-card p-10 text-center">
            <p className="text-sm font-semibold text-white">{error || 'Ticket not found'}</p>
          </div>
        </div>
      </div>
    )
  }

  const status = statusStyles(ticket.status)
  const isClosed = normalizeStatus(ticket.status) === 'closed' || normalizeStatus(ticket.status) === 'resolved'

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/support"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--arcade-text-muted)] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support
        </Link>

        <header className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
              style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}
            >
              {status.label}
            </span>
            <span className="text-xs text-[var(--arcade-text-muted)]" title={formatFull(ticket.created_at)}>
              Opened {formatRelative(ticket.created_at)}
            </span>
            <span className="text-xs text-[var(--arcade-text-muted)]">#{ticket.ticket_id}</span>
          </div>
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            {ticket.subject || '(no subject)'}
          </h1>
          {(ticket.category || ticket.priority) && (
            <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
              {ticket.category && <span>Category: {ticket.category}</span>}
              {ticket.category && ticket.priority && <span> · </span>}
              {ticket.priority && <span>Priority: {ticket.priority}</span>}
            </p>
          )}
        </header>

        <section className="mb-6">
          <div className="arcade-card p-6">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--neon-violet)]">
                Original message
              </span>
              <span className="text-xs text-[var(--arcade-text-muted)]" title={formatFull(ticket.created_at)}>
                {formatRelative(ticket.created_at)}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-[var(--arcade-text)]">
              {ticket.message || '(no message)'}
            </p>
          </div>
        </section>

        {messages && messages.length > 0 && (
          <section className="mb-6 space-y-4">
            {messages.map((m) => {
              const mine = m.sender_type ? m.sender_type !== 'support' : m.direction !== 'inbound'
              return (
                <div
                  key={m.message_id}
                  className={`arcade-card p-5 ${mine ? 'ml-8' : 'mr-8'}`}
                  style={mine ? { borderColor: 'rgba(139,92,246,0.35)' } : undefined}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-white/70">
                      {mine ? 'You' : 'Support team'}
                    </span>
                    <span className="text-xs text-[var(--arcade-text-muted)]" title={formatFull(m.created_at)}>
                      {formatRelative(m.created_at)}
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-[var(--arcade-text)]">
                    {m.body || m.subject || ''}
                  </p>
                </div>
              )
            })}
          </section>
        )}

        {!isClosed && (
          <section className="arcade-card p-6">
            <h2 className="mb-4 text-sm font-semibold text-white">Add a reply</h2>
            <form onSubmit={submitReply} className="space-y-3">
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={5}
                maxLength={5000}
                placeholder="Write your reply…"
                className="w-full rounded-lg border border-[var(--arcade-border)] bg-[var(--arcade-surface)] p-3 text-sm text-white placeholder:text-[var(--arcade-text-muted)] focus:border-[var(--neon-violet)] focus:outline-none"
                disabled={sending}
              />
              {sendError && (
                <p className="text-xs" style={{ color: '#f87171' }}>
                  {sendError}
                </p>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--arcade-text-muted)]">{reply.length}/5000</span>
                <button
                  type="submit"
                  disabled={sending || !reply.trim()}
                  className="arcade-btn arcade-btn-secondary disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {sending ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </form>
          </section>
        )}
      </div>
    </div>
  )
}

export default function TicketDetailPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <Suspense fallback={
          <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
            <div className="mx-auto max-w-4xl">
              <div className="arcade-card p-10 text-center text-sm text-[var(--arcade-text-muted)]">Loading…</div>
            </div>
          </div>
        }>
          <TicketDetailContent />
        </Suspense>
      </AppShell>
    </AuthGate>
  )
}
