'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, Inbox, Search } from 'lucide-react'
import { DataTable } from '@vlp/member-ui'
import { getDashboard } from '@/lib/api/dashboard'
import { getInquiriesByProfessional, type InquiryRow } from '@/lib/api/member'

const US_STATE_CODE_TO_NAME: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska',
  NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
}

function expandState(code?: string | null): string {
  if (!code) return '—'
  const trimmed = String(code).trim()
  if (trimmed.length === 2) return US_STATE_CODE_TO_NAME[trimmed.toUpperCase()] || trimmed
  return trimmed
}

function fmtDate(s?: string): string {
  if (!s) return '—'
  const d = new Date(s)
  if (isNaN(d.getTime())) return s
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function statusLabel(s?: string | null): string {
  if (!s) return 'New'
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function statusBadge(s?: string | null) {
  const lower = (s || 'new').toLowerCase()
  const cls =
    lower === 'new'
      ? 'bg-brand-primary/15 text-brand-primary'
      : lower === 'responded' || lower === 'contacted'
      ? 'bg-emerald-500/15 text-emerald-300'
      : lower === 'closed' || lower === 'archived'
      ? 'bg-white/10 text-white/50'
      : 'bg-white/10 text-white/60'
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {statusLabel(lower)}
    </span>
  )
}

const TABS = ['All', 'New', 'Contacted', 'Archived'] as const
type Tab = (typeof TABS)[number]

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'no-profile' }
  | { status: 'ready'; inquiries: InquiryRow[] }

export default function MessagesClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [tab, setTab] = useState<Tab>('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dashboard = await getDashboard()
        const proId = dashboard.account.professional_id
        if (!proId) {
          if (!cancelled) setState({ status: 'no-profile' })
          return
        }
        const inquiries = await getInquiriesByProfessional(proId)
        if (!cancelled) setState({ status: 'ready', inquiries })
      } catch (err) {
        if (!cancelled) setState({ status: 'error', message: (err as Error)?.message ?? 'Unknown error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const inquiries = state.status === 'ready' ? state.inquiries : []

  const counts = useMemo(() => {
    const c = { All: inquiries.length, New: 0, Contacted: 0, Archived: 0 }
    for (const i of inquiries) {
      const s = (i.status || 'new').toLowerCase()
      if (s === 'new') c.New++
      else if (s === 'responded' || s === 'contacted') c.Contacted++
      else if (s === 'closed' || s === 'archived') c.Archived++
    }
    return c
  }, [inquiries])

  const filtered = useMemo(() => {
    return inquiries.filter((i) => {
      const s = (i.status || 'new').toLowerCase()
      if (tab === 'New' && s !== 'new') return false
      if (tab === 'Contacted' && s !== 'responded' && s !== 'contacted') return false
      if (tab === 'Archived' && s !== 'closed' && s !== 'archived') return false
      if (query) {
        const q = query.toLowerCase()
        const name = `${i.first_name ?? ''} ${i.last_name ?? ''}`.toLowerCase()
        const services = Array.isArray(i.services_needed) ? i.services_needed.join(' ').toLowerCase() : ''
        if (!name.includes(q) && !services.includes(q) && !(i.email ?? '').toLowerCase().includes(q)) {
          return false
        }
      }
      return true
    })
  }, [inquiries, tab, query])

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'taxpayer', label: 'Taxpayer' },
    { key: 'service', label: 'Service Needed' },
    { key: 'state', label: 'State' },
    { key: 'entity', label: 'Entity Type' },
    { key: 'status', label: 'Status' },
    { key: 'action', label: '', className: 'text-right' },
  ]

  const rows = filtered.map((i) => {
    const services = Array.isArray(i.services_needed) ? i.services_needed.join(', ') : '—'
    const entities = Array.isArray(i.business_types) ? i.business_types.join(', ') : '—'
    const taxpayerName = `${i.first_name ?? ''} ${i.last_name ?? ''}`.trim() || '—'
    return {
      date: fmtDate(i.created_at),
      taxpayer: (
        <div>
          <div className="text-white">{taxpayerName}</div>
          {i.email && <div className="text-xs text-white/40">{i.email}</div>}
        </div>
      ),
      service: services || '—',
      state: expandState(i.preferred_state),
      entity: entities || '—',
      status: statusBadge(i.status),
      action: (
        <Link
          href={`/messages/${i.inquiry_id}`}
          className="text-xs font-medium text-brand-primary hover:underline"
        >
          View
        </Link>
      ),
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Messaging</h1>
        <p className="mt-1 text-sm text-white/50">
          Matched taxpayer inquiries waiting for your response.
        </p>
      </div>

      {state.status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not load inquiries</p>
            <p className="mt-1 text-amber-200/70">{state.message}</p>
          </div>
        </div>
      )}

      {state.status === 'no-profile' && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]">
          <EmptyState
            title="Complete your profile first"
            body="You'll start receiving taxpayer inquiries once your profile is live in the directory."
            cta={{ label: 'Set Up Your Profile', href: '/profile' }}
          />
        </div>
      )}

      {state.status !== 'no-profile' && (
        <>
          <div className="flex items-center gap-1 border-b border-[var(--member-border)]">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`relative flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                  t === tab ? 'text-brand-primary' : 'text-white/50 hover:text-white/70'
                }`}
              >
                {t}
                <span
                  className={`inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[11px] font-medium ${
                    t === tab ? 'bg-brand-primary/20 text-brand-primary' : 'bg-white/10 text-white/40'
                  }`}
                >
                  {counts[t]}
                </span>
                {t === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, service, or email..."
              className="w-full rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] py-3 pl-11 pr-4 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-primary/40 focus:bg-[var(--member-card-hover)]"
            />
          </div>

          {state.status === 'loading' && (
            <div className="h-56 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
          )}

          {state.status === 'ready' && inquiries.length === 0 && (
            <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]">
              <EmptyState
                title="No inquiries yet"
                body="Once your profile is live in the directory, taxpayer inquiries will appear here."
                cta={{ label: 'View Your Profile', href: '/profile' }}
              />
            </div>
          )}

          {state.status === 'ready' && inquiries.length > 0 && (
            <DataTable columns={columns} data={rows} emptyMessage="No inquiries match this filter." />
          )}
        </>
      )}
    </div>
  )
}

function EmptyState({
  title,
  body,
  cta,
}: {
  title: string
  body: string
  cta: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-primary/10">
        <Inbox className="h-8 w-8 text-brand-primary/60" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-white/50">{body}</p>
      <Link
        href={cta.href}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
      >
        {cta.label}
      </Link>
    </div>
  )
}
