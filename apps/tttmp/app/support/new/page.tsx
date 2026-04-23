'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send, Loader2, AlertCircle } from 'lucide-react'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

const labelCls =
  'block text-[11px] uppercase tracking-widest text-[var(--arcade-text-muted)] mb-1.5'

interface AccountCtx {
  accountId: string
  email: string
}

function NewTicketContent() {
  const router = useRouter()
  const [account, setAccount] = useState<AccountCtx | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [fullName, setFullName] = useState('')
  const [emailAddr, setEmailAddr] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'normal' | 'high' | 'urgent'>('normal')
  const [category, setCategory] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const json = await res.json().catch(() => null)
        const sess = json?.session
        if (!sess?.account_id) {
          if (!cancelled) setLoadError('Not signed in')
          return
        }
        if (cancelled) return
        setAccount({ accountId: sess.account_id, email: sess.email })
        setEmailAddr(sess.email || '')
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : 'Could not load session')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!account) return
    if (!subject.trim() || !message.trim()) {
      setSubmitError('Subject and message are required')
      return
    }
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/v1/support/tickets`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
          priority,
          category: category || 'other',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        setSubmitError((err as { error?: string })?.error || `Failed (${res.status})`)
        setSubmitting(false)
        return
      }
      router.push('/support')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create ticket')
      setSubmitting(false)
    }
  }

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/support"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--arcade-text-muted)] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Support
        </Link>

        <header className="mb-8">
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            Create Support Ticket
          </h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Submit a new support request and our team will respond promptly.
          </p>
        </header>

        {loadError && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
               style={{ background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.35)', color: 'var(--neon-amber)' }}>
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Could not load account info</p>
              <p className="mt-1 opacity-80">{loadError}</p>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <form onSubmit={handleSubmit} className="arcade-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  className="arcade-input"
                />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input
                  type="email"
                  value={emailAddr}
                  onChange={(e) => setEmailAddr(e.target.value)}
                  placeholder="you@example.com"
                  className="arcade-input"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className={labelCls}>Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="arcade-input"
                required
              />
            </div>

            <div className="mt-4">
              <label className={labelCls}>Message</label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe what you need help with…"
                className="arcade-input resize-none"
                required
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as typeof priority)}
                  className="arcade-input"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Critical</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="arcade-input"
                >
                  <option value="">Select category</option>
                  <option value="technical">Technical</option>
                  <option value="billing">Billing</option>
                  <option value="feature">Feature Request</option>
                  <option value="account">Account</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {submitError && (
              <div
                className="mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm"
                style={{ background: 'rgba(239, 68, 68, 0.08)', borderColor: 'rgba(239, 68, 68, 0.35)', color: '#fca5a5' }}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitting || !account}
                className="arcade-btn arcade-btn-primary"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? 'Submitting…' : 'Submit Ticket'}
              </button>
              <Link href="/support" className="arcade-btn arcade-btn-secondary">
                Cancel
              </Link>
            </div>
          </form>

          <aside className="arcade-card p-6 h-fit">
            <h3 className="mb-1 text-lg font-semibold text-white">Response Times</h3>
            <p className="mb-4 text-[11px] uppercase tracking-widest text-[var(--arcade-text-muted)]">
              Expected response by priority
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center justify-between border-b border-[var(--arcade-border)] pb-3">
                <span className="text-white">Normal</span>
                <span className="text-[var(--arcade-text-muted)]">Within 48 hours</span>
              </li>
              <li className="flex items-center justify-between border-b border-[var(--arcade-border)] pb-3">
                <span className="text-white">High</span>
                <span className="text-[var(--arcade-text-muted)]">Within 24 hours</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-white">Critical</span>
                <span style={{ color: 'var(--neon-amber)' }}>Within 4 hours</span>
              </li>
            </ul>
            <p className="mt-5 text-xs text-[var(--arcade-text-muted)]">
              You can also email us directly at{' '}
              <a
                href="mailto:support@taxmonitor.pro"
                className="text-[var(--neon-violet)] hover:text-white transition"
              >
                support@taxmonitor.pro
              </a>
            </p>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default function NewTicketPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <NewTicketContent />
      </AppShell>
    </AuthGate>
  )
}
