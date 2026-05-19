'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'

interface AdminCommission {
  id: string
  account_id: string
  setter_name: string
  setter_email: string
  payout_method: 'stripe' | 'payoneer' | null
  payoneer_email: string
  payoneer_account_id: string
  tax_pro_name?: string
  amount_paid: number
  commission_amount: number
  commission_rate: number
  status: 'pending' | 'paid'
  created_at: string
  paid_at: string | null
}

type Tab = 'pending' | 'paid' | 'all'

const API = 'https://api.virtuallaunch.pro'

function fmtUsd(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(n || 0))
}

function fmtDate(iso?: string | null) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
  } catch {
    return iso
  }
}

export default function ScalePayoutsPage() {
  const [commissions, setCommissions] = useState<AdminCommission[]>([])
  const [tab, setTab] = useState<Tab>('pending')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [markingId, setMarkingId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(`${API}/v1/admin/gsvlp/commissions`, { credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok || !data?.ok) {
          throw new Error(data?.error || `HTTP ${res.status}`)
        }
        setCommissions(Array.isArray(data.commissions) ? data.commissions : [])
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function markPaid(commissionId: string) {
    setMarkingId(commissionId)
    try {
      const res = await fetch(
        `${API}/v1/admin/gsvlp/commissions/${encodeURIComponent(commissionId)}/mark-paid`,
        { method: 'POST', credentials: 'include' },
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`)
      }
      const updated = data.commission as AdminCommission
      setCommissions(prev =>
        prev.map(c =>
          c.id === commissionId
            ? { ...c, status: 'paid', paid_at: updated?.paid_at || new Date().toISOString() }
            : c,
        ),
      )
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      alert(`Failed to mark paid: ${msg}`)
    } finally {
      setMarkingId(null)
    }
  }

  const filtered = commissions.filter(c => {
    if (tab === 'all') return true
    return (c.status || 'pending') === tab
  })

  const counts = {
    all: commissions.length,
    pending: commissions.filter(c => (c.status || 'pending') === 'pending').length,
    paid: commissions.filter(c => c.status === 'paid').length,
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'pending', label: `Pending (${counts.pending})` },
    { id: 'paid', label: `Paid (${counts.paid})` },
    { id: 'all', label: `All (${counts.all})` },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payouts</h1>
        <p className="mt-1 text-sm text-slate-400">Manage GSVLP setter commission payouts.</p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-900/60 bg-rose-950/30 px-4 py-3 text-xs text-rose-300">
          Failed to load commissions: {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
              tab === t.id
                ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-500/50'
                : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-500">Loading commissions…</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">
            {tab === 'pending' ? 'No pending payouts.' : tab === 'paid' ? 'No paid commissions yet.' : 'No commissions yet.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800/60 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-2 py-2">Setter</th>
                  <th className="px-2 py-2">Prospect</th>
                  <th className="px-2 py-2">Amount</th>
                  <th className="px-2 py-2">Commission</th>
                  <th className="px-2 py-2">Payout Method</th>
                  <th className="px-2 py-2">Status</th>
                  <th className="px-2 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map(c => {
                  const status = c.status || 'pending'
                  const isPaid = status === 'paid'
                  return (
                    <tr key={c.id} className="text-slate-300">
                      <td className="px-2 py-3 align-top">
                        <div className="font-medium text-white">{c.setter_name || '—'}</div>
                        <div className="text-xs text-slate-500">{c.setter_email || c.account_id}</div>
                      </td>
                      <td className="px-2 py-3 align-top">
                        <div className="text-white">{c.tax_pro_name || '—'}</div>
                        <div className="text-xs text-slate-500">{fmtDate(c.created_at)}</div>
                      </td>
                      <td className="px-2 py-3 align-top whitespace-nowrap">
                        {fmtUsd(c.amount_paid)}
                      </td>
                      <td className="px-2 py-3 align-top whitespace-nowrap font-semibold text-emerald-400">
                        {fmtUsd(c.commission_amount)}
                      </td>
                      <td className="px-2 py-3 align-top">
                        {c.payout_method === 'payoneer' ? (
                          <div>
                            <div className="text-white">Payoneer</div>
                            <div className="text-xs text-slate-500">
                              {c.payoneer_email || '—'}
                              {c.payoneer_account_id ? ` · ${c.payoneer_account_id}` : ''}
                            </div>
                          </div>
                        ) : c.payout_method === 'stripe' ? (
                          <div className="text-white">Stripe</div>
                        ) : (
                          <div className="text-amber-400">Not configured</div>
                        )}
                      </td>
                      <td className="px-2 py-3 align-top whitespace-nowrap">
                        {isPaid ? (
                          <div>
                            <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/40">
                              Paid
                            </span>
                            <div className="mt-1 text-xs text-slate-500">{fmtDate(c.paid_at)}</div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/40">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-2 py-3 align-top text-right">
                        {!isPaid && (
                          <button
                            type="button"
                            disabled={markingId === c.id}
                            onClick={() => markPaid(c.id)}
                            className="inline-flex items-center rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {markingId === c.id ? 'Marking…' : 'Mark as Paid'}
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
