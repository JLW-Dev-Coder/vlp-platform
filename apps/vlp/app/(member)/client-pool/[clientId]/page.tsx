'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  CreditCard,
  UserCheck,
  ShieldCheck,
  PlayCircle,
  Trophy,
  Banknote,
  ArrowRight,
} from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import {
  getClientPoolCase,
  releaseClientPoolCase,
  completeClientPoolCase,
  type CasePoolRecord,
  type CaseStatus,
} from '@/lib/api/client-pool'
import { getDashboard } from '@/lib/api/dashboard'
import { getComplianceRecord } from '@/lib/api/compliance-records'

function centsToDollars(cents: number | undefined | null): string | null {
  if (cents == null || Number.isNaN(cents)) return null
  return `$${(cents / 100).toFixed(2)}`
}

const CLAIMED_STATUSES = new Set<CaseStatus>([
  'claimed' as CaseStatus,
  'assigned',
  'in_progress',
  'completed',
  'completed_pending_payout',
  'paid_out',
])
const IN_PROGRESS_STATUSES = new Set<CaseStatus>([
  'in_progress',
  'completed',
  'completed_pending_payout',
  'paid_out',
])
const COMPLETED_STATUSES = new Set<CaseStatus>([
  'completed',
  'completed_pending_payout',
  'paid_out',
])

type StepState = 'complete' | 'current' | 'pending'

interface TimelineStep {
  id: string
  label: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  state: StepState
  href?: string
  ctaLabel?: string
}

function buildTimeline(
  status: CaseStatus | null,
  hasComplianceRecord: boolean,
  clientId: string
): TimelineStep[] {
  const s = status ?? 'funded'
  const claimed = CLAIMED_STATUSES.has(s)
  const inProgress = IN_PROGRESS_STATUSES.has(s)
  const completed = COMPLETED_STATUSES.has(s)
  const paidOut = s === 'paid_out'

  const steps: Array<Omit<TimelineStep, 'state'> & { complete: boolean }> = [
    {
      id: 'funded',
      label: 'Funded',
      description: 'Case was paid for and entered the pool',
      icon: CreditCard,
      complete: true,
    },
    {
      id: 'claimed',
      label: 'Claimed',
      description: 'A pro accepted the case from the pool',
      icon: UserCheck,
      complete: claimed,
    },
    {
      id: 'compliance',
      label: 'Compliance',
      description: hasComplianceRecord
        ? 'Compliance record on file'
        : 'Start the IRS authorization and compliance flow',
      icon: ShieldCheck,
      complete: hasComplianceRecord,
      href: hasComplianceRecord
        ? `/client-pool/${clientId}/compliance`
        : `/client-pool/${clientId}/2848`,
      ctaLabel: hasComplianceRecord ? 'Open Compliance' : 'Start Compliance',
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      description: 'Pro is actively working the case',
      icon: PlayCircle,
      complete: inProgress,
    },
    {
      id: 'completed',
      label: 'Completed',
      description: 'Pro marked the case complete',
      icon: Trophy,
      complete: completed,
    },
    {
      id: 'paid_out',
      label: 'Paid Out',
      description: 'Stripe payout transferred to the pro',
      icon: Banknote,
      complete: paidOut,
    },
  ]

  let currentAssigned = false
  return steps.map((step) => {
    if (step.complete) return { ...step, state: 'complete' as StepState }
    if (!currentAssigned) {
      currentAssigned = true
      return { ...step, state: 'current' as StepState }
    }
    return { ...step, state: 'pending' as StepState }
  })
}

export default function ClientRecordPage() {
  const params = useParams<{ clientId: string }>()
  const clientId = params?.clientId ?? ''

  const [liveCase, setLiveCase] = useState<CasePoolRecord | null>(null)
  const [hasComplianceRecord, setHasComplianceRecord] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [callerProfessionalId, setCallerProfessionalId] = useState<string | null>(null)
  const [actionPending, setActionPending] = useState<'release' | 'complete' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    if (!clientId) return
    setLoading(true)
    ;(async () => {
      try {
        const [caseResp, dashboard, compliance] = await Promise.all([
          getClientPoolCase(clientId).catch(() => null),
          getDashboard().catch(() => null),
          getComplianceRecord(clientId).catch(() => null),
        ])
        if (cancelled) return
        if (caseResp?.ok && caseResp.case) {
          setLiveCase(caseResp.case)
          setLoadError(null)
        } else {
          setLoadError(caseResp?.message ?? caseResp?.error ?? 'Could not load case.')
        }
        if (dashboard?.account?.professional_id) {
          setCallerProfessionalId(dashboard.account.professional_id)
        }
        setHasComplianceRecord(!!(compliance?.ok && compliance.record))
      } catch (err) {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : 'Could not load case.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [clientId])

  const claimedBySelf = !!(
    liveCase &&
    callerProfessionalId &&
    (liveCase.servicing_professional_id === callerProfessionalId ||
      liveCase.claimed_by === callerProfessionalId)
  )
  const claimedActiveStatuses = new Set(['claimed', 'assigned', 'in_progress'])
  const canRelease = claimedBySelf && claimedActiveStatuses.has(String(liveCase?.status ?? ''))
  const canComplete = claimedBySelf && claimedActiveStatuses.has(String(liveCase?.status ?? ''))

  async function handleRelease() {
    if (actionPending) return
    setActionError(null)
    setActionSuccess(null)
    setActionPending('release')
    try {
      const res = await releaseClientPoolCase(clientId)
      if (res.ok) {
        setActionSuccess('Case released back to the pool.')
        setLiveCase((prev) =>
          prev ? { ...prev, status: 'funded', servicing_professional_id: null, claimed_by: null } : prev
        )
      } else {
        setActionError(res.message ?? res.error ?? 'Could not release case.')
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not release case.')
    } finally {
      setActionPending(null)
    }
  }

  async function handleComplete() {
    if (actionPending) return
    setActionError(null)
    setActionSuccess(null)
    setActionPending('complete')
    try {
      const res = await completeClientPoolCase(clientId)
      if (res.ok) {
        setActionSuccess('Case marked complete. Payout will be processed.')
        const refreshed = await getClientPoolCase(clientId).catch(() => null)
        if (refreshed?.ok && refreshed.case) setLiveCase(refreshed.case)
      } else {
        setActionError(res.message ?? res.error ?? 'Could not complete case.')
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not complete case.')
    } finally {
      setActionPending(null)
    }
  }

  const timeline = buildTimeline(
    (liveCase?.status as CaseStatus | undefined) ?? null,
    hasComplianceRecord,
    clientId
  )

  return (
    <div className="space-y-6">
      <Link
        href="/client-pool"
        className="inline-flex items-center gap-1.5 text-sm text-brand-primary transition hover:text-brand-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Client Pool
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">
              {liveCase?.taxpayer_name ?? liveCase?.client_name ?? (loading ? 'Loading…' : 'Case')}
            </h1>
            {liveCase?.status && (
              <StatusBadge
                status={String(liveCase.status)
                  .split('_')
                  .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
                  .join(' ')}
              />
            )}
          </div>
          {liveCase && (
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/40">
              {(liveCase.service_type || liveCase.service_plan) && (
                <>
                  <span>{liveCase.service_type ?? liveCase.service_plan} Plan</span>
                  <span className="text-white/10">|</span>
                </>
              )}
              {liveCase.filing_status && (
                <>
                  <span>{liveCase.filing_status}</span>
                  <span className="text-white/10">|</span>
                </>
              )}
              {centsToDollars(
                (liveCase.amount_total_cents as number | undefined) ??
                  (liveCase.service_fee_cents as number | undefined) ??
                  (liveCase.plan_fee_cents as number | undefined)
              ) && (
                <span>
                  {centsToDollars(
                    (liveCase.amount_total_cents as number | undefined) ??
                      (liveCase.service_fee_cents as number | undefined) ??
                      (liveCase.plan_fee_cents as number | undefined)
                  )}
                </span>
              )}
            </div>
          )}
          <p className="mt-1 font-mono text-xs text-white/30">{clientId}</p>
        </div>
        {claimedBySelf && (canRelease || canComplete) && (
          <div className="flex flex-wrap items-center gap-2">
            {canComplete && (
              <button
                type="button"
                onClick={handleComplete}
                disabled={actionPending !== null}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionPending === 'complete' ? 'Completing…' : 'Mark Complete'}
              </button>
            )}
            {canRelease && (
              <button
                type="button"
                onClick={handleRelease}
                disabled={actionPending !== null}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-amber-400/40 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionPending === 'release' ? 'Releasing…' : 'Release Case'}
              </button>
            )}
          </div>
        )}
      </div>

      {(actionError || actionSuccess) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            actionError
              ? 'border-red-400/30 bg-red-500/10 text-red-200'
              : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'
          }`}
        >
          {actionError ?? actionSuccess}
        </div>
      )}

      {loadError && !liveCase && (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadError}
        </div>
      )}

      <section className="rounded-2xl border border-[--member-border] bg-[--member-card] p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Case Timeline
          </h2>
          <Link
            href={`/client-pool/${clientId}/report`}
            className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary transition hover:text-brand-hover"
          >
            View report
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {loading && !liveCase ? (
          <p className="text-sm text-white/40">Loading case timeline…</p>
        ) : (
          <ol className="space-y-3">
            {timeline.map((step, idx) => {
              const Icon = step.icon
              const StateIcon =
                step.state === 'complete'
                  ? CheckCircle2
                  : step.state === 'current'
                  ? Clock
                  : Circle
              const stateColor =
                step.state === 'complete'
                  ? 'text-emerald-400'
                  : step.state === 'current'
                  ? 'text-brand-primary'
                  : 'text-white/30'
              const ringColor =
                step.state === 'complete'
                  ? 'border-emerald-400/30 bg-emerald-500/10'
                  : step.state === 'current'
                  ? 'border-brand-primary/40 bg-brand-primary/10'
                  : 'border-white/10 bg-white/[0.02]'

              return (
                <li
                  key={step.id}
                  className={`flex items-start gap-4 rounded-xl border px-4 py-3 ${ringColor}`}
                >
                  <div className="flex flex-col items-center pt-0.5">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border ${ringColor}`}
                    >
                      <Icon className={`h-4 w-4 ${stateColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-white/30">
                        Step {idx + 1}
                      </span>
                      <h3 className="text-sm font-semibold text-white">{step.label}</h3>
                      <StateIcon className={`h-3.5 w-3.5 ${stateColor}`} />
                      <span className={`text-[11px] font-medium uppercase tracking-wider ${stateColor}`}>
                        {step.state === 'complete'
                          ? 'Complete'
                          : step.state === 'current'
                          ? 'In progress'
                          : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-white/60">{step.description}</p>
                    {step.href && (
                      <Link
                        href={step.href}
                        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-primary transition hover:text-brand-hover"
                      >
                        {step.ctaLabel ?? 'Open'}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </li>
              )
            })}
          </ol>
        )}
      </section>
    </div>
  )
}
