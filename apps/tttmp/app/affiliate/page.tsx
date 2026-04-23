'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'
import { api } from '@/lib/api'

interface AffiliateData {
  referral_code: string
  connect_status: string
  balance_pending: number
  balance_paid: number
  referral_url: string
}

interface CommissionEvent {
  platform: string
  gross_amount: number
  commission_amount: number
  status: string
  created_at: string
}

function formatUSD(cents: number | null | undefined) {
  const safe = (cents ?? 0) / 100
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(safe)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function AffiliateContent() {
  const router = useRouter()
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null)
  const [events, setEvents] = useState<CommissionEvent[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [payoutLoading, setPayoutLoading] = useState(false)
  const [payoutMessage, setPayoutMessage] = useState('')
  const [onboardLoading, setOnboardLoading] = useState(false)
  const [error, setError] = useState('')
  const [showConnectedToast, setShowConnectedToast] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('connected') !== 'true') return
    setShowConnectedToast(true)
    const t = setTimeout(() => setShowConnectedToast(false), 6000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    api.getSession()
      .then((data) => {
        const id = data.session.account_id
        return Promise.all([
          api.getAffiliate(id),
          api.getAffiliateEvents(id),
        ])
      })
      .then(([aff, evts]) => {
        setAffiliate(aff)
        setEvents(evts.events)
        setLoading(false)
      })
      .catch((err) => {
        if (err.message?.includes('401') || err.message?.includes('session')) {
          router.replace('/sign-in?redirect=/affiliate')
        } else {
          setError('Failed to load affiliate data.')
          setLoading(false)
        }
      })
  }, [router])

  async function handleCopy() {
    if (!affiliate) return
    await navigator.clipboard.writeText(affiliate.referral_url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handlePayout() {
    if (!affiliate) return
    setPayoutLoading(true)
    setPayoutMessage('')
    try {
      const result = await api.requestPayout(affiliate.balance_pending)
      setPayoutMessage(`Payout requested! ID: ${result.payout_id}`)
      setAffiliate((prev) => prev ? { ...prev, balance_pending: 0 } : prev)
    } catch (err) {
      setPayoutMessage(err instanceof Error ? err.message : 'Payout request failed.')
    } finally {
      setPayoutLoading(false)
    }
  }

  async function handleOnboard() {
    setOnboardLoading(true)
    try {
      const returnUrl =
        typeof window !== 'undefined'
          ? `${window.location.origin}/affiliate`
          : 'https://taxtools.taxmonitor.pro/affiliate'
      const result = await api.startAffiliateOnboarding(returnUrl)
      window.location.href = result.onboard_url
    } catch {
      setOnboardLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
        <p className="text-center text-[var(--arcade-text-muted)] py-16">Loading…</p>
      </div>
    )
  }

  if (!affiliate) {
    return (
      <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
        <p className="text-center text-red-400 py-16">{error || 'Could not load affiliate data.'}</p>
      </div>
    )
  }

  const pending = affiliate.balance_pending ?? 0
  const paid = affiliate.balance_paid ?? 0
  const canPayout = pending >= 1000 && affiliate.connect_status === 'active'
  const disabledReason =
    affiliate.connect_status !== 'active'
      ? 'Connect your bank account to withdraw'
      : pending < 1000
        ? 'Minimum payout is $10'
        : ''

  const sectionStyle: React.CSSProperties = {
    background: 'var(--arcade-surface)',
    border: '1px solid var(--arcade-border)',
    borderRadius: '1rem',
  }

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <h1
          className="font-sora text-3xl font-extrabold text-white mb-2"
          style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
        >
          Affiliate Dashboard
        </h1>
        <p className="text-sm text-[var(--arcade-text-muted)] mb-8">
          Share your link. Earn 20% commission for life on every referral.
        </p>
        {error && <p className="text-red-400 mb-4">{error}</p>}
        {showConnectedToast && (
          <div
            className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold"
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              color: 'var(--neon-green)',
              border: '1px solid rgba(34, 197, 94, 0.35)',
            }}
          >
            <span>✓</span>
            <span>Stripe account connected successfully.</span>
          </div>
        )}

        {/* Earnings Summary */}
        <section className="p-6 mb-6" style={sectionStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)] mb-4">
            Earnings Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Available"
              value={formatUSD(pending)}
              color="var(--neon-green)"
              glow="var(--arcade-glow-green)"
            />
            <StatCard
              label="Pending"
              value={formatUSD(pending)}
              color="var(--neon-amber)"
              glow="var(--arcade-glow-amber)"
            />
            <StatCard
              label="Paid Out"
              value={formatUSD(paid)}
              color="var(--neon-violet)"
              glow="var(--arcade-glow-violet)"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span title={disabledReason} className="inline-block">
              <button
                onClick={handlePayout}
                disabled={!canPayout || payoutLoading}
                className="arcade-btn arcade-btn-amber h-11 px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {payoutLoading ? 'Requesting…' : 'Request Payout'}
              </button>
            </span>
            {disabledReason && (
              <span className="text-xs text-[var(--arcade-text-muted)]">
                {disabledReason}
              </span>
            )}
            {payoutMessage && (
              <p className="text-sm text-[var(--neon-green)]">{payoutMessage}</p>
            )}
          </div>
        </section>

        {/* Referral Link */}
        <section className="p-6 mb-6" style={sectionStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)] mb-4">
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={affiliate.referral_url}
              readOnly
              className="flex-1 h-11 rounded-lg px-4 text-sm text-white outline-none"
              style={{
                background: 'var(--bg, #0a0a1a)',
                border: '1px solid var(--neon-violet)',
                boxShadow: '0 0 0 1px rgba(139, 92, 246, 0.15)',
              }}
            />
            <button
              onClick={handleCopy}
              className={`arcade-btn h-11 px-6 ${copied ? 'arcade-btn-secondary' : 'arcade-btn-primary'}`}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </section>

        {/* Bank Account / Stripe Connect */}
        <section className="p-6 mb-6" style={sectionStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)] mb-4">
            Bank Account
          </h2>
          {affiliate.connect_status === 'active' ? (
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                color: 'var(--neon-green)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              ✓ Bank account connected
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <h3 className="text-base font-bold text-white">
                Connect your bank account
              </h3>
              <p className="text-sm text-[var(--arcade-text-muted)]">
                Connect via Stripe to receive commission payouts directly to your bank.
              </p>
              <button
                onClick={handleOnboard}
                disabled={onboardLoading}
                className="arcade-btn arcade-btn-amber h-11 px-6 self-start disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {onboardLoading ? 'Redirecting…' : 'Connect Bank Account'}
              </button>
            </div>
          )}
        </section>

        {/* Commission History */}
        <section className="p-6" style={sectionStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)] mb-4">
            Commission History
          </h2>
          {!events || events.length === 0 ? (
            <p className="text-sm text-[var(--arcade-text-muted)] text-center py-8">
              No commissions yet. Share your referral link to start earning.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left"
                    style={{ borderBottom: '1px solid var(--arcade-border)' }}
                  >
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Date
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Platform
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Sale
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Commission
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((evt, i) => (
                    <tr
                      key={i}
                      style={{ borderBottom: '1px solid var(--arcade-border)' }}
                    >
                      <td className="py-3 px-3 text-[var(--arcade-text)]">
                        {formatDate(evt.created_at)}
                      </td>
                      <td className="py-3 px-3 capitalize text-white">
                        {evt.platform}
                      </td>
                      <td className="py-3 px-3 text-[var(--arcade-text)]">
                        {formatUSD(evt.gross_amount)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[var(--neon-green)]">
                        {formatUSD(evt.commission_amount)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className="inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={
                            evt.status === 'paid'
                              ? {
                                  background: 'rgba(34, 197, 94, 0.15)',
                                  color: 'var(--neon-green)',
                                }
                              : {
                                  background: 'rgba(245, 158, 11, 0.15)',
                                  color: 'var(--neon-amber)',
                                }
                          }
                        >
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  glow,
}: {
  label: string
  value: string
  color: string
  glow: string
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: 'var(--bg, #0a0a1a)',
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
    </div>
  )
}

export default function AffiliatePage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <AffiliateContent />
      </AppShell>
    </AuthGate>
  )
}
