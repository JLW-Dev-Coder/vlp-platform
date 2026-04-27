'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'

const API_BASE = 'https://api.virtuallaunch.pro'

interface PlatformCard {
  platform: string
  name: string
  color: string
  totalSubmissions: number
  thisWeek: number
  types: Record<string, number>
  status: 'green' | 'amber' | 'red'
  kwongMetrics?: {
    galaLeads: number
    inquiryLeads: number
    kennedySignups: number
    claimsFiled: number
  }
}

interface SubmissionRow {
  id: string
  reference: string
  name: string
  email: string
  type: string
  date: string
  status: string
  data: Record<string, unknown>
}

interface DetailResponse {
  ok: boolean
  platform: string
  submissions: SubmissionRow[]
  total: number
  page: number
  limit: number
  pages: number
  types: string[]
}

const PAGE_SIZE = 25

export default function FormsTab() {
  const [cards, setCards] = useState<PlatformCard[] | null>(null)
  const [cardsError, setCardsError] = useState<string | null>(null)
  const [active, setActive] = useState<PlatformCard | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`${API_BASE}/v1/scale/forms/summary`, { credentials: 'include' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled) setCards(json.platforms || [])
      } catch (e) {
        if (!cancelled) setCardsError(e instanceof Error ? e.message : 'Failed to load summary')
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (active) {
    return <DetailView card={active} onBack={() => setActive(null)} />
  }

  return <CardGrid cards={cards} error={cardsError} onSelect={setActive} />
}

// ---------------------------------------------------------------------------
// Card grid
// ---------------------------------------------------------------------------
function CardGrid({ cards, error, onSelect }: {
  cards: PlatformCard[] | null
  error: string | null
  onSelect: (c: PlatformCard) => void
}) {
  if (error) {
    return <div className="text-sm text-red-400/90 py-8 text-center">Error: {error}</div>
  }
  if (cards === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-slate-800/20 animate-pulse rounded-xl h-48" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => <PlatformCardView key={c.platform} card={c} onClick={() => onSelect(c)} />)}
    </div>
  )
}

function PlatformCardView({ card, onClick }: { card: PlatformCard; onClick: () => void }) {
  const statusColor = card.status === 'green' ? 'bg-emerald-400'
    : card.status === 'amber' ? 'bg-amber-400'
    : 'bg-red-500/70'
  const types = Object.entries(card.types).sort((a, b) => b[1] - a[1])
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-slate-800/30 border border-slate-700/50 rounded-xl p-5 cursor-pointer hover:border-slate-600/50 hover:bg-slate-800/50 transition-all border-l-4 relative"
      style={{ borderLeftColor: card.color }}
    >
      <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${statusColor}`} />
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: card.color }} />
        <span className="text-sm font-semibold text-white tracking-wide">{card.platform}</span>
      </div>
      <div className="text-xs text-slate-400 mt-0.5">{card.name}</div>

      <div className="mt-4">
        <div className="text-2xl font-bold text-white leading-none">{card.totalSubmissions} <span className="text-xs font-normal text-slate-500">total</span></div>
        <div className={`text-xs mt-1 ${card.thisWeek > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
          {card.thisWeek} this week
        </div>
      </div>

      {types.length > 0 && (
        <div className="mt-4 space-y-0.5">
          {types.map(([name, count]) => (
            <div key={name} className="text-xs text-slate-500 flex justify-between">
              <span>{name}</span>
              <span className="text-slate-400">{count}</span>
            </div>
          ))}
        </div>
      )}

      {card.kwongMetrics && (
        <div className="border-t border-slate-700/30 mt-3 pt-3">
          <div className="text-[10px] text-yellow-500/70 uppercase tracking-wider font-semibold mb-1">Kwong Campaign</div>
          <div className="space-y-0.5">
            <KwongRow label="Gala Leads" value={card.kwongMetrics.galaLeads} />
            <KwongRow label="Inquiry Leads" value={card.kwongMetrics.inquiryLeads} />
            <KwongRow label="Pro Signups" value={card.kwongMetrics.kennedySignups} />
            <KwongRow label="Claims Filed" value={card.kwongMetrics.claimsFiled} />
          </div>
        </div>
      )}
    </button>
  )
}

function KwongRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-xs text-slate-500 flex justify-between">
      <span>{label}</span>
      <span className="text-slate-400">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Detail view
// ---------------------------------------------------------------------------
function DetailView({ card, onBack }: { card: PlatformCard; onBack: () => void }) {
  const [data, setData] = useState<DetailResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [type, setType] = useState('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [status, setStatus] = useState('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

  const queryString = useMemo(() => {
    const qs = new URLSearchParams()
    if (type) qs.set('type', type)
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)
    if (status) qs.set('status', status)
    qs.set('page', String(page))
    qs.set('limit', String(PAGE_SIZE))
    return qs.toString()
  }, [type, from, to, status, page])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/v1/scale/forms/${card.platform}/submissions?${queryString}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as DetailResponse
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load submissions')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [card.platform, queryString])

  useEffect(() => { load() }, [load])

  const clearFilters = () => {
    setType(''); setFrom(''); setTo(''); setStatus(''); setPage(1)
  }

  const exportCsv = () => {
    const qs = new URLSearchParams()
    if (type) qs.set('type', type)
    if (from) qs.set('from', from)
    if (to) qs.set('to', to)
    if (status) qs.set('status', status)
    const url = `${API_BASE}/v1/scale/forms/${card.platform}/export?${qs.toString()}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-white transition"
          >
            ← All Platforms
          </button>
          <span className="text-slate-600">|</span>
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: card.color }} />
          <h2 className="text-lg font-semibold text-white">{card.name}</h2>
          <span className="text-xs text-slate-500">{data?.total ?? card.totalSubmissions} total</span>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="bg-slate-800/50 hover:bg-slate-700/60 border border-slate-700/50 text-slate-200 px-3 py-1.5 rounded-lg text-sm transition"
        >
          Export CSV
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1) }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200"
        >
          <option value="">All types</option>
          {(data?.types || []).map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => { setFrom(e.target.value); setPage(1) }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200"
        />
        <span className="text-slate-500 text-xs">to</span>
        <input
          type="date"
          value={to}
          onChange={(e) => { setTo(e.target.value); setPage(1) }}
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200"
        />
        <input
          type="text"
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          placeholder="status"
          className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-200 w-28"
        />
        {(type || from || to || status) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-slate-400 hover:text-white underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      {error ? (
        <div className="text-sm text-red-400/90 py-8 text-center">Error: {error}</div>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-800/20 animate-pulse rounded h-12" />
          ))}
        </div>
      ) : !data || data.submissions.length === 0 ? (
        <div className="py-16 text-center">
          <span className="inline-block w-3 h-3 rounded-full mb-3" style={{ backgroundColor: card.color }} />
          <div className="text-slate-500 text-sm">No submissions for {card.name} yet.</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-slate-700/30 rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-slate-500 uppercase tracking-wider border-b border-slate-700/50 bg-slate-900/30">
                  <th className="text-left px-3 py-2 font-medium">Reference</th>
                  <th className="text-left px-3 py-2 font-medium">Name / Email</th>
                  <th className="text-left px-3 py-2 font-medium">Type</th>
                  <th className="text-left px-3 py-2 font-medium">Date</th>
                  <th className="text-left px-3 py-2 font-medium">Status</th>
                  <th className="text-right px-3 py-2 font-medium w-12"></th>
                </tr>
              </thead>
              <tbody>
                {data.submissions.map((row) => {
                  const isOpen = !!expanded[row.id]
                  return (
                    <Fragment key={row.id}>
                      <tr
                        className="border-b border-slate-700/20 hover:bg-slate-800/30 cursor-pointer"
                        onClick={() => setExpanded((cur) => ({ ...cur, [row.id]: !cur[row.id] }))}
                      >
                        <td className="px-3 py-2 text-slate-400 text-xs font-mono">{row.reference.slice(0, 24)}</td>
                        <td className="px-3 py-2">
                          <div className="text-slate-200">{row.name || <span className="text-slate-500 italic">—</span>}</div>
                          <div className="text-slate-500 text-xs">{row.email || ''}</div>
                        </td>
                        <td className="px-3 py-2">
                          <span className="bg-slate-700/50 text-slate-300 px-2 py-0.5 rounded text-xs">{row.type}</span>
                        </td>
                        <td className="px-3 py-2 text-slate-400 text-xs">{formatDate(row.date)}</td>
                        <td className="px-3 py-2">
                          <StatusDot status={row.status} />
                        </td>
                        <td className="px-3 py-2 text-right text-slate-500">
                          <span className={`inline-block transition-transform ${isOpen ? 'rotate-90' : ''}`}>›</span>
                        </td>
                      </tr>
                      {isOpen && (
                        <tr className="bg-slate-900/30">
                          <td colSpan={6} className="px-6 py-4 text-xs">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
                              {Object.entries(row.data || {}).map(([k, v]) => (
                                <div key={k} className="flex gap-2">
                                  <span className="text-slate-400">{k}:</span>
                                  <span className="text-slate-300 break-all">{stringifyValue(v)}</span>
                                </div>
                              ))}
                              {Object.keys(row.data || {}).length === 0 && (
                                <span className="text-slate-500 italic">No additional data</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center text-sm text-slate-500">
            <span>
              Showing {(data.page - 1) * data.limit + 1}–{Math.min(data.page * data.limit, data.total)} of {data.total}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={data.page <= 1}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
                disabled={data.page >= data.pages}
                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatusDot({ status }: { status: string }) {
  if (!status) return <span className="text-slate-600 text-xs">—</span>
  const s = status.toLowerCase()
  let color = 'bg-slate-500'
  if (s === 'new' || s === 'pending' || s === 'draft' || s === 'captured') color = 'bg-blue-400'
  else if (s === 'submitted' || s === 'approved' || s === 'active') color = 'bg-emerald-400'
  else if (s === 'rejected' || s === 'closed' || s === 'unsubscribed') color = 'bg-red-400'
  else if (s === 'in_progress' || s === 'reviewing') color = 'bg-amber-400'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-slate-400">{status}</span>
    </span>
  )
}

function formatDate(iso: string): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  })
}

function stringifyValue(v: unknown): string {
  if (v == null) return '—'
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
