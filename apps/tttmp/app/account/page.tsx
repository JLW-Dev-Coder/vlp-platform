'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { Check } from 'lucide-react'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

interface Session {
  account_id: string
  email: string
}

interface AccountDetails {
  account_id: string
  email: string
  created_at?: string
  status?: string
}

interface Membership {
  plan_name?: string | null
  price?: string | null
  amount?: number | null
  currency?: string | null
  interval?: string | null
  renews_at?: string | null
  status?: string | null
  benefits?: string[]
}

interface PaymentMethod {
  brand?: string | null
  funding?: string | null
  last4?: string | null
  exp_month?: number | null
  exp_year?: number | null
}

interface TwoFactorStatus {
  enabled: boolean
}

function formatDate(iso?: string | null): string {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

function formatMoney(amount?: number | null, currency: string = 'USD'): string {
  if (amount == null) return '—'
  const dollars = amount / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(dollars)
}

function titleCase(s?: string | null): string {
  if (!s) return '—'
  return s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function benefitsForPlan(planName?: string | null): string[] {
  const name = (planName || '').toLowerCase()
  if (name.includes('premium') || name.includes('pro')) {
    return ['50 tokens per month', 'Unlimited bookings', 'Priority support']
  }
  if (name.includes('standard') || name.includes('plus')) {
    return ['25 tokens per month', 'Standard bookings', 'Email support']
  }
  if (name.includes('starter') || name.includes('basic')) {
    return ['10 tokens per month', 'Basic bookings']
  }
  return ['Pay-as-you-go tokens', 'Access to all arcade games']
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`arcade-card p-6 ${className}`}>{children}</div>
}

function AccountContent() {
  const searchParams = useSearchParams()
  const [session, setSession] = useState<Session | null>(null)
  const [account, setAccount] = useState<AccountDetails | null>(null)
  const [membership, setMembership] = useState<Membership | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [twoFactor, setTwoFactor] = useState<TwoFactorStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sJson = await sRes.json()
        const sess: Session | undefined = sJson?.session
        if (!sess?.account_id) {
          if (!cancelled) setLoading(false)
          return
        }
        if (cancelled) return
        setSession(sess)

        const [accRes, memRes, pmRes, tfaRes] = await Promise.all([
          fetch(`${API_BASE}/v1/accounts/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/memberships/by-account/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/billing/payment-methods/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/auth/2fa/status/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
        ])

        if (!cancelled && accRes?.ok) {
          const aj = await accRes.json().catch(() => null)
          setAccount(aj?.account || { account_id: sess.account_id, email: sess.email })
        } else if (!cancelled) {
          setAccount({ account_id: sess.account_id, email: sess.email })
        }

        if (!cancelled && memRes?.ok) {
          const mj = await memRes.json().catch(() => null)
          const m = mj?.membership || (Array.isArray(mj?.memberships) ? mj.memberships[0] : null)
          if (m) setMembership(m)
        }

        if (!cancelled && pmRes?.ok) {
          const pj = await pmRes.json().catch(() => null)
          const pm = pj?.payment_method || (Array.isArray(pj?.payment_methods) ? pj.payment_methods[0] : null)
          if (pm) setPaymentMethod(pm)
        }

        if (!cancelled && tfaRes?.ok) {
          const tj = await tfaRes.json().catch(() => null)
          if (tj) setTwoFactor({ enabled: !!(tj.enabled ?? tj.status === 'enabled') })
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

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) return
    ;(async () => {
      try {
        const res = await fetch(
          `${API_BASE}/v1/checkout/status?session_id=${encodeURIComponent(sessionId)}`,
          { credentials: 'include' }
        )
        const data = await res.json().catch(() => null)
        if (data?.status === 'complete' || data?.status === 'paid') {
          const added = data.credits_added ?? 0
          setPaymentMessage(
            `Payment successful!${added ? ` ${added} tokens added to your account.` : ''}`
          )
        }
      } catch {
        // ignore
      }
    })()
  }, [searchParams])

  async function openBillingPortal() {
    if (!session) return
    setPortalLoading(true)
    try {
      const res = await fetch(`${API_BASE}/v1/billing/portal/sessions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          return_url: typeof window !== 'undefined' ? window.location.href : undefined,
        }),
      })
      const data = await res.json().catch(() => null)
      if (data?.url) {
        window.location.href = data.url
        return
      }
    } catch {
      // fall through
    } finally {
      setPortalLoading(false)
    }
  }

  const planName = membership?.plan_name || 'Free'
  const hasMembership = !!membership?.plan_name
  const benefits = membership?.benefits?.length ? membership.benefits : benefitsForPlan(planName)
  const is2FAEnabled = !!twoFactor?.enabled
  const billingCycle = membership?.interval ? titleCase(membership.interval) : '—'
  const costDisplay = hasMembership
    ? formatMoney(membership?.amount, membership?.currency || 'USD')
    : '$0.00'
  const priceSubtitle = membership?.price
    ? membership.price
    : hasMembership
      ? `${formatMoney(membership?.amount, membership?.currency || 'USD')}${membership?.interval ? `/${membership.interval.toUpperCase()}` : ''}`
      : 'No active subscription'

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            Account
          </h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Manage your account and membership.
          </p>
        </header>

        {paymentMessage && (
          <div
            className="mb-6 rounded-lg border px-4 py-3 text-sm"
            style={{
              background: 'rgba(34, 197, 94, 0.08)',
              borderColor: 'rgba(34, 197, 94, 0.35)',
              color: 'var(--neon-green)',
            }}
          >
            {paymentMessage}
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="arcade-card p-6"
                style={{ minHeight: '180px', opacity: 0.5 }}
              />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Account Details */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-white">Account Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">Email</p>
                  <p className="mt-1 text-sm text-[var(--arcade-text)]">
                    {account?.email || session?.email || '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">Account Created</p>
                  <p className="mt-1 text-sm text-[var(--arcade-text)]">{formatDate(account?.created_at)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">Account Status</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm" style={{ color: 'var(--neon-green)' }}>
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: 'var(--neon-green)', boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}
                    />
                    {titleCase(account?.status) !== '—' ? titleCase(account?.status) : 'Active'}
                  </p>
                </div>
              </div>
            </Card>

            {/* Current Plan */}
            <Card>
              <h2 className="mb-2 text-lg font-semibold text-white">Current Plan</h2>
              <p className="text-2xl font-bold" style={{ color: 'var(--neon-violet)' }}>
                {planName}
              </p>
              <p className="mb-4 text-sm text-[var(--arcade-text-muted)]">{priceSubtitle}</p>

              <ul className="mb-4 space-y-2">
                {benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-[var(--arcade-text)]">
                    <Check className="h-4 w-4" style={{ color: 'var(--neon-green)' }} />
                    {b}
                  </li>
                ))}
              </ul>

              {hasMembership && membership?.renews_at ? (
                <p className="text-xs text-[var(--arcade-text-muted)]">
                  Renews {formatDate(membership.renews_at)}
                </p>
              ) : !hasMembership ? (
                <a href="/pricing" className="arcade-btn arcade-btn-secondary inline-block text-sm">
                  Upgrade
                </a>
              ) : null}
            </Card>

            {/* Payment Method */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-white">Payment Method</h2>
              {paymentMethod?.last4 ? (
                <>
                  <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">
                    {(paymentMethod.brand || 'CARD').toString().toUpperCase()}{' '}
                    {(paymentMethod.funding || '').toString().toUpperCase()} CARD
                  </p>
                  <p className="mt-1 font-mono text-xl tracking-widest text-white">
                    •••• •••• •••• {paymentMethod.last4}
                  </p>
                  {paymentMethod.exp_month && paymentMethod.exp_year && (
                    <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">
                      Expires {String(paymentMethod.exp_month).padStart(2, '0')}/
                      {String(paymentMethod.exp_year).slice(-2)}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-[var(--arcade-text-muted)]">No payment method on file</p>
              )}

              <button
                type="button"
                onClick={openBillingPortal}
                disabled={portalLoading}
                className="arcade-btn arcade-btn-secondary mt-4 w-full"
              >
                {portalLoading ? 'Opening…' : 'Update Payment Method'}
              </button>
            </Card>

            {/* Subscription Summary */}
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-white">Subscription Summary</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--arcade-text-muted)]">Plan</span>
                  <span className="text-sm font-medium text-white">{planName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--arcade-text-muted)]">Billing Cycle</span>
                  <span className="text-sm font-medium text-white">{billingCycle}</span>
                </div>
                <div
                  className="flex items-center justify-between border-t pt-3"
                  style={{ borderColor: 'var(--arcade-border)' }}
                >
                  <span className="text-sm text-[var(--arcade-text-muted)]">
                    {membership?.interval?.toLowerCase() === 'year' ? 'Annual Cost' : 'Cost'}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--neon-green)' }}>
                    {costDisplay}
                  </span>
                </div>
              </div>
              {!hasMembership && (
                <a
                  href="/pricing"
                  className="arcade-btn arcade-btn-secondary mt-4 inline-block w-full text-center"
                >
                  Upgrade
                </a>
              )}
            </Card>

            {/* Account Security — full width */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="mb-2 text-lg font-semibold text-white">Account Security</h2>
                <div className="divide-y divide-[var(--arcade-border)]">
                  <div className="flex items-center justify-between py-4 first:pt-2">
                    <div>
                      <p className="text-sm font-medium text-white">Change Password</p>
                      <p className="text-xs text-[var(--arcade-text-muted)]">
                        Sign-in uses a magic link sent to your email.
                      </p>
                    </div>
                    <a href="/sign-in" className="arcade-btn arcade-btn-secondary px-4 py-1.5 text-sm">
                      Update
                    </a>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-[var(--arcade-text-muted)]">
                        {is2FAEnabled ? 'Enabled' : 'Not currently enabled'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="arcade-btn arcade-btn-secondary px-4 py-1.5 text-sm"
                      onClick={() => {
                        window.location.href = '/account?2fa=1'
                      }}
                    >
                      {is2FAEnabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-4 last:pb-2">
                    <div>
                      <p className="text-sm font-medium text-white">Active Sessions</p>
                      <p className="text-xs text-[var(--arcade-text-muted)]">1 device signed in</p>
                    </div>
                    <a
                      href="/sign-out"
                      className="arcade-btn arcade-btn-secondary px-4 py-1.5 text-sm"
                    >
                      Manage
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <Suspense
          fallback={
            <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
              <div className="mx-auto max-w-6xl text-sm text-[var(--arcade-text-muted)]">Loading…</div>
            </div>
          }
        >
          <AccountContent />
        </Suspense>
      </AppShell>
    </AuthGate>
  )
}
