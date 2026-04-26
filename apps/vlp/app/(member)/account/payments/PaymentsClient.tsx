'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  ExternalLink,
  Receipt,
} from 'lucide-react'
import { DataTable } from '@vlp/member-ui'
import StatusBadge from '../../components/StatusBadge'
import { getDashboard } from '@/lib/api/dashboard'
import {
  getMembershipByAccount,
  getPaymentMethods,
  getBillingReceipts,
  openBillingPortal,
  type MembershipRow,
  type PaymentMethod,
  type BillingReceipt,
} from '@/lib/api/member'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      accountId: string
      membership: MembershipRow | null
      methods: PaymentMethod[]
      receipts: BillingReceipt[]
    }

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatAmount(cents?: number | null): string {
  if (typeof cents !== 'number') return '—'
  return `$${(cents / 100).toFixed(2)}`
}

function describeReceipt(r: BillingReceipt): string {
  if (r.description) return String(r.description)
  if (r.event === 'PAYMENT_METHOD_ATTACHED') return 'Payment method updated'
  if (r.event === 'PORTAL_SESSION_CREATED') return 'Billing portal accessed'
  return r.event ? String(r.event).replace(/_/g, ' ').toLowerCase() : 'Billing event'
}

function methodLabel(m: PaymentMethod): { brand: string; last4: string; expires: string } {
  const card = m.card
  return {
    brand: card?.brand ? card.brand.charAt(0).toUpperCase() + card.brand.slice(1) : 'Card',
    last4: card?.last4 ?? '••••',
    expires:
      card?.exp_month && card?.exp_year
        ? `${String(card.exp_month).padStart(2, '0')}/${card.exp_year}`
        : '—',
  }
}

export default function PaymentsClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dashboard = await getDashboard()
        if (cancelled) return
        const accountId = dashboard.account.account_id
        const [membership, methods, receipts] = await Promise.all([
          getMembershipByAccount(accountId).catch(() => null),
          getPaymentMethods(accountId).catch(() => []),
          getBillingReceipts(accountId).catch(() => []),
        ])
        if (!cancelled) setState({ status: 'ready', accountId, membership, methods, receipts })
      } catch (err) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Could not load payments',
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') return <PaymentsSkeleton />
  if (state.status === 'error') return <PaymentsFallback message={state.message} />

  const { accountId, membership, methods, receipts } = state

  async function handlePortal() {
    if (!membership?.stripe_customer_id) return
    setPortalLoading(true)
    try {
      const url = await openBillingPortal({
        accountId,
        customerId: membership.stripe_customer_id,
        returnUrl: `${window.location.origin}/account/payments`,
      })
      if (url) window.location.href = url
    } catch {
      // ignore — fallback shown below
    } finally {
      setPortalLoading(false)
    }
  }

  const sortedReceipts = receipts
    .slice()
    .sort((a, b) => {
      const ta = new Date(a.created_at ?? 0).getTime()
      const tb = new Date(b.created_at ?? 0).getTime()
      return tb - ta
    })

  const rows = sortedReceipts.map((r, idx) => ({
    date: formatDate(r.created_at),
    description: <span className="font-medium text-white">{describeReceipt(r)}</span>,
    amount: formatAmount(r.amount),
    status: <StatusBadge status={r.status ?? 'completed'} />,
    receipt: r.eventId ? (
      <span className="text-xs font-mono text-white/40">{String(r.eventId).slice(0, 12)}…</span>
    ) : (
      <span className="text-xs text-white/30">—</span>
    ),
    _key: r.eventId ?? `r-${idx}`,
  }))

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/account"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Account
        </a>
        <h1 className="text-2xl font-semibold text-white">Payments</h1>
        <p className="mt-1 text-sm text-white/50">
          Payment history and billing details.
        </p>
      </div>

      <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
        <h3 className="text-xs uppercase tracking-widest text-white/40">Payment Method</h3>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          {methods.length === 0 ? (
            <p className="text-sm text-white/50">
              No payment method on file. Open the billing portal to add one.
            </p>
          ) : (
            <div className="space-y-2">
              {methods.map((m) => {
                const info = methodLabel(m)
                return (
                  <div key={m.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">
                      <CreditCard className="h-4 w-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {info.brand} ending in {info.last4}
                      </p>
                      <p className="text-xs text-white/40">Expires {info.expires}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <button
            onClick={handlePortal}
            disabled={portalLoading || !membership?.stripe_customer_id}
            className="inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {portalLoading ? 'Opening…' : 'Manage Billing'}
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
        {!membership?.stripe_customer_id && (
          <p className="mt-3 text-xs text-white/40">
            A billing customer is created when you upgrade from the free plan.
          </p>
        )}
      </div>

      <div>
        <div className="mb-4 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-white/30" />
          <h3 className="text-xs uppercase tracking-widest text-white/40">Payment History</h3>
        </div>
        {rows.length === 0 ? (
          <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-10 text-center">
            <p className="text-sm text-white/40">No billing activity yet.</p>
            <p className="mt-2 text-xs text-white/30">
              Receipts appear here after each charge or billing event.
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              { key: 'date', label: 'Date' },
              { key: 'description', label: 'Description' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
              { key: 'receipt', label: 'Receipt' },
            ]}
            data={rows}
          />
        )}
      </div>
    </div>
  )
}

function PaymentsSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payments</h1>
        <p className="mt-1 text-sm text-white/50">Loading billing history…</p>
      </div>
      <div className="h-32 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      <div className="h-64 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
    </div>
  )
}

function PaymentsFallback({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Payments</h1>
        <p className="mt-1 text-sm text-white/50">Payment history and billing details.</p>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Could not load live data</p>
          <p className="mt-1 text-amber-200/70">{message}</p>
        </div>
      </div>
    </div>
  )
}
