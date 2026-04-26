'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  FileText,
  ClipboardList,
  FileSignature,
  CreditCard,
  UserCheck,
  ListChecks,
  MapPin,
  Stamp,
  Shield,
  Search,
  BarChart3,
  CalendarCheck,
  MessageSquare,
  HelpCircle,
  Handshake,
} from 'lucide-react'
import PhaseProgressBar from './components/PhaseProgressBar'
import type { PhaseStatus } from './components/PhaseProgressBar'
import StepCard from './components/StepCard'
import type { StepDef, StepStatus } from './components/StepCard'
import StepDetailPanel from './components/StepDetailPanel'
import type { StepActionConfig } from './components/StepDetailPanel'
import StatusBadge from '../../components/StatusBadge'
import {
  getClientPoolCase,
  releaseClientPoolCase,
  completeClientPoolCase,
  type CasePoolRecord,
} from '@/lib/api/client-pool'
import { getDashboard } from '@/lib/api/dashboard'

function centsToDollars(cents: number | undefined | null): string | null {
  if (cents == null || Number.isNaN(cents)) return null
  return `$${(cents / 100).toFixed(2)}`
}

/* ── placeholder client data ─────────────────────────────────────── */

const clientData = {
  id: 'c1',
  name: 'Maria Rivera',
  plan: 'Gold',
  filing: 'MFJ',
  fee: '$504',
  consentGranted: false,
  contact_email: 'maria.rivera@example.com',
  phone: '(555) 867-5309',
}

function mask(value: string, consent: boolean) {
  return consent ? value : '[Consent required]'
}

/* ── step definitions ─────────────────────────────────────────────── */

const steps: StepDef[] = [
  // Phase 0 — Triage & Payment
  {
    id: 'p0-inquiry',
    name: 'Inquiry',
    description: 'Taxpayer intake request',
    icon: FileText,
    status: 'complete',
    kind: 'form',
    phase: 0,
    whatWeNeed: ['Basic contact information', 'Type of tax issue', 'Preferred contact method'],
    whatWeDo: ['Create your case file', 'Assign intake coordinator', 'Begin preliminary review'],
    formFields: [
      { name: 'Full Name', completed: true },
      { name: 'Email Address', completed: true },
      { name: 'Phone Number', completed: true },
      { name: 'Tax Issue Type', completed: true },
    ],
  },
  {
    id: 'p0-intake',
    name: 'Intake',
    description: 'Initial information collection',
    icon: ClipboardList,
    status: 'complete',
    kind: 'form',
    phase: 0,
    whatWeNeed: ['SSN or ITIN', 'Filing history (3 years)', 'Known balances or notices'],
    whatWeDo: ['Verify identity', 'Pull preliminary records', 'Assess complexity'],
    formFields: [
      { name: 'SSN / ITIN', completed: true },
      { name: 'Filing History', completed: true },
      { name: 'Known IRS Notices', completed: true },
      { name: 'Outstanding Balances', completed: true },
    ],
  },
  {
    id: 'p0-offer',
    name: 'Offer',
    description: 'Service proposal review',
    icon: Handshake,
    status: 'complete',
    kind: 'form',
    phase: 0,
    whatWeNeed: ['Review proposed scope', 'Confirm service tier', 'Ask any questions'],
    whatWeDo: ['Prepare custom proposal', 'Calculate fees', 'Present monitoring plan'],
    formFields: [
      { name: 'Service Tier Selection', completed: true },
      { name: 'Scope Acknowledgment', completed: true },
    ],
  },
  {
    id: 'p0-agreement',
    name: 'Agreement',
    description: 'Service agreement signing',
    icon: FileSignature,
    status: 'complete',
    kind: 'form',
    phase: 0,
    whatWeNeed: ['Read service agreement', 'Electronic signature', 'Acknowledge terms'],
    whatWeDo: ['Generate agreement', 'Record signed copy', 'Unlock payment step'],
    formFields: [
      { name: 'Service Agreement', completed: true },
      { name: 'E-Signature', completed: true },
      { name: 'Terms Acknowledged', completed: true },
    ],
  },
  {
    id: 'p0-payment',
    name: 'Payment',
    description: 'Secure payment processing',
    icon: CreditCard,
    status: 'complete',
    kind: 'form',
    phase: 0,
    whatWeNeed: ['Payment method', 'Billing address'],
    whatWeDo: ['Process payment via Stripe', 'Issue receipt', 'Unlock Phase 1'],
    formFields: [
      { name: 'Payment Method', completed: true },
      { name: 'Billing Address', completed: true },
    ],
  },

  // Phase 1 — ESign 2848 / Review
  {
    id: 'p1-welcome',
    name: 'Welcome',
    description: 'Account setup and orientation',
    icon: UserCheck,
    status: 'complete',
    kind: 'form',
    phase: 1,
    whatWeNeed: ['Confirm account details', 'Set communication preferences'],
    whatWeDo: ['Set up your portal', 'Assign your case team', 'Send welcome materials'],
    formFields: [
      { name: 'Account Confirmation', completed: true },
      { name: 'Communication Preferences', completed: true },
    ],
  },
  {
    id: 'p1-filing-status',
    name: 'Filing Status',
    description: 'Verify filing status details',
    icon: ListChecks,
    status: 'complete',
    kind: 'form',
    phase: 1,
    whatWeNeed: ['Current filing status', 'Dependents information', 'State of residence'],
    whatWeDo: ['Verify against IRS records', 'Flag discrepancies', 'Update case file'],
    formFields: [
      { name: 'Filing Status', completed: true },
      { name: 'Dependents', completed: true },
      { name: 'State of Residence', completed: true },
    ],
  },
  {
    id: 'p1-address',
    name: 'Address Update',
    description: 'Confirm current address',
    icon: MapPin,
    status: 'current',
    kind: 'form',
    phase: 1,
    whatWeNeed: ['Current mailing address', 'Previous address (if moved in 2 years)'],
    whatWeDo: ['Update IRS records if needed', 'Ensure notices reach you', 'File Form 8822 if required'],
    formFields: [
      { name: 'Current Mailing Address', completed: true },
      { name: 'Previous Address', completed: false },
      { name: 'Address Change Date', completed: false },
    ],
  },
  {
    id: 'p1-esign-2848',
    name: 'eSign 2848',
    description: 'Power of Attorney authorization',
    icon: Stamp,
    status: 'ready',
    kind: 'form',
    phase: 1,
    whatWeNeed: ['Review Form 2848', 'Electronic signature', 'Confirm tax years covered'],
    whatWeDo: ['Prepare Form 2848', 'Submit to IRS e-Services', 'Track CAF assignment'],
    formFields: [
      { name: 'Form 2848 Review', completed: false },
      { name: 'Tax Years Selection', completed: false },
      { name: 'E-Signature', completed: false },
    ],
  },

  // Phase 2 — Processing / Due Diligence
  {
    id: 'p2-auth-caf',
    name: 'Authorization + CAF',
    description: 'IRS authorization processing',
    icon: Shield,
    status: 'locked',
    kind: 'operator',
    phase: 2,
    estimate: '3-5 business days',
    whatWeNeed: ['No action needed — we handle this'],
    whatWeDo: ['Submit 2848 to IRS', 'Receive CAF number', 'Verify TIN access', 'Test record retrieval'],
    checklist: [
      { label: 'Submit 2848 to IRS', completed: false },
      { label: 'Receive CAF number', completed: false },
      { label: 'Verify TIN access', completed: false },
      { label: 'Test record access', completed: false },
    ],
  },
  {
    id: 'p2-retrieval',
    name: 'Record Retrieval + Analysis',
    description: 'IRS record analysis',
    icon: Search,
    status: 'locked',
    kind: 'operator',
    phase: 2,
    estimate: '5-7 business days',
    whatWeNeed: ['No action needed — we handle this'],
    whatWeDo: ['Request wage & income transcripts', 'Request account transcripts', 'Request return transcripts', 'Cross-reference data', 'Document findings'],
    checklist: [
      { label: 'Request wage & income transcripts', completed: false },
      { label: 'Request account transcripts', completed: false },
      { label: 'Request return transcripts', completed: false },
      { label: 'Cross-reference data', completed: false },
      { label: 'Document findings', completed: false },
    ],
  },

  // Phase 3 — Results
  {
    id: 'p3-report',
    name: 'Compliance Report',
    description: 'Comprehensive findings report',
    icon: BarChart3,
    status: 'locked',
    kind: 'operator',
    phase: 3,
    estimate: '2-3 business days',
    whatWeNeed: ['No action needed — we handle this'],
    whatWeDo: ['Compile findings', 'Create visual summary', 'Draft recommendations', 'Prepare action items'],
    checklist: [
      { label: 'Compile findings', completed: false },
      { label: 'Create visual summary', completed: false },
      { label: 'Draft recommendations', completed: false },
      { label: 'Prepare action items', completed: false },
    ],
  },
  {
    id: 'p3-results-appt',
    name: 'Results Appointment',
    description: 'Schedule results review',
    icon: CalendarCheck,
    status: 'locked',
    kind: 'form',
    phase: 3,
    whatWeNeed: ['Pick a meeting time', 'Prepare your questions'],
    whatWeDo: ['Present compliance report', 'Walk through findings', 'Discuss next steps'],
    formFields: [
      { name: 'Appointment Date', completed: false },
      { name: 'Meeting Format', completed: false },
    ],
  },
  {
    id: 'p3-exit-survey',
    name: 'Exit Survey',
    description: 'Share your feedback',
    icon: MessageSquare,
    status: 'locked',
    kind: 'form',
    phase: 3,
    whatWeNeed: ['Rate your experience', 'Share feedback', 'Suggest improvements'],
    whatWeDo: ['Record feedback', 'Improve our process', 'Close your case file'],
    formFields: [
      { name: 'Overall Rating', completed: false },
      { name: 'Service Feedback', completed: false },
      { name: 'Referral Interest', completed: false },
    ],
  },
]

const supportStep: StepDef = {
  id: 'support',
  name: 'Support Ticket',
  description: 'Get help anytime',
  icon: HelpCircle,
  status: 'ready',
  kind: 'form',
  phase: -1,
  whatWeNeed: ['Describe your issue', 'Attach any relevant files'],
  whatWeDo: ['Route to the right team', 'Respond within 24 hours', 'Track resolution'],
  formFields: [
    { name: 'Subject', completed: false },
    { name: 'Description', completed: false },
    { name: 'Priority', completed: false },
  ],
}

/* ── phase metadata ──────────────────────────────────────────────── */

const phaseNames = ['Triage & Payment', 'ESign 2848 / Review', 'Processing / Due Diligence', 'Results']

const connectorText = [
  'Unlocked after Payment',
  'Operator starts here',
  'Requires CAF Verified',
]

function derivePhaseStatus(phaseNum: number, allSteps: StepDef[]): PhaseStatus {
  const phaseSteps = allSteps.filter((s) => s.phase === phaseNum)
  if (phaseSteps.every((s) => s.status === 'complete')) return 'complete'
  if (phaseSteps.some((s) => s.status === 'current' || s.status === 'ready')) return 'current'
  return 'locked'
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function ClientRecordPage() {
  const params = useParams<{ clientId: string }>()
  const clientId = params?.clientId ?? 'c1'

  const [selectedStep, setSelectedStep] = useState<StepDef | null>(
    steps.find((s) => s.status === 'current') ?? null
  )

  const [liveCase, setLiveCase] = useState<CasePoolRecord | null>(null)
  const [callerProfessionalId, setCallerProfessionalId] = useState<string | null>(null)
  const [actionPending, setActionPending] = useState<'release' | 'complete' | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [caseResp, dashboard] = await Promise.all([
          getClientPoolCase(clientId).catch(() => null),
          getDashboard().catch(() => null),
        ])
        if (cancelled) return
        if (caseResp?.ok && caseResp.case) setLiveCase(caseResp.case)
        if (dashboard?.account?.professional_id) setCallerProfessionalId(dashboard.account.professional_id)
      } catch {
        /* fall back to placeholder data */
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

  const phases = phaseNames.map((name, i) => ({
    number: i,
    name,
    status: derivePhaseStatus(i, steps),
  }))

  const groupedSteps = [0, 1, 2, 3].map((p) => steps.filter((s) => s.phase === p))

  const stepActions: Record<string, StepActionConfig> = {
    'p1-esign-2848': {
      primary: {
        label: 'Open eSign Form',
        href: `https://taxmonitor.pro/forms/2848?caseId=${clientId}`,
        external: true,
      },
      secondary: {
        label: 'Generate 2848 (Staff)',
        href: `/client-pool/${clientId}/2848`,
      },
    },
    'p2-auth-caf': {
      primary: {
        label: 'Open Compliance Record',
        href: `/client-pool/${clientId}/compliance`,
      },
    },
    'p2-retrieval': {
      primary: {
        label: 'Open Compliance Record',
        href: `/client-pool/${clientId}/compliance`,
      },
    },
    'p3-report': {
      primary: {
        label: 'View Report',
        href: `/client-pool/${clientId}/report`,
      },
    },
    'p3-results-appt': {
      primary: {
        label: 'Schedule Appointment',
        href: 'https://cal.com/virtuallaunch/results-review',
        external: true,
      },
    },
    'p3-exit-survey': {
      notice: 'Coming soon',
    },
    support: {
      primary: {
        label: 'Contact Support',
        href: '/support/create',
      },
    },
  }

  const activeAction = selectedStep ? stepActions[selectedStep.id] : undefined

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link
        href="/client-pool"
        className="inline-flex items-center gap-1.5 text-sm text-brand-primary transition hover:text-brand-hover"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Client Pool
      </Link>

      {/* Client header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold text-white">
              {liveCase?.taxpayer_name ?? liveCase?.client_name ?? clientData.name}
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
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span>
              {liveCase?.service_type ?? liveCase?.service_plan ?? clientData.plan} Plan
            </span>
            <span className="text-white/10">|</span>
            <span>{liveCase?.filing_status ?? clientData.filing}</span>
            <span className="text-white/10">|</span>
            <span>
              {centsToDollars(
                (liveCase?.amount_total_cents as number | undefined) ??
                  (liveCase?.service_fee_cents as number | undefined) ??
                  (liveCase?.plan_fee_cents as number | undefined)
              ) ?? clientData.fee}
            </span>
            <span className="text-white/10">|</span>
            <span>
              {mask(
                (liveCase?.taxpayer_email as string | undefined) ?? clientData.contact_email,
                clientData.consentGranted
              )}
            </span>
            <span className="text-white/10">|</span>
            <span>{mask(clientData.phone, clientData.consentGranted)}</span>
          </div>
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

      {/* Zone A — Phase Progress Bar */}
      <PhaseProgressBar phases={phases} />

      {/* Zones B + C — side-by-side on desktop */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Zone B — Mind Map (left, 2/3) */}
        <div className="flex-1 space-y-8 lg:w-2/3">
          {groupedSteps.map((phaseSteps, phaseIdx) => (
            <div key={phaseIdx}>
              {/* Phase header */}
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[--member-accent] text-xs font-bold text-brand-primary">
                  {phaseIdx}
                </span>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
                  {phaseNames[phaseIdx]}
                </h2>
              </div>

              {/* Step cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {phaseSteps.map((step) => (
                  <StepCard
                    key={step.id}
                    step={step}
                    selected={selectedStep?.id === step.id}
                    onSelect={setSelectedStep}
                  />
                ))}
              </div>

              {/* Phase connector */}
              {phaseIdx < 3 && (
                <div className="my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[--member-border]" />
                  <span className="whitespace-nowrap text-[11px] font-medium uppercase tracking-widest text-white/20">
                    {connectorText[phaseIdx]}
                  </span>
                  <div className="h-px flex-1 bg-[--member-border]" />
                </div>
              )}
            </div>
          ))}

          {/* Cross-phase support */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-xs font-bold text-blue-400">
                ?
              </span>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-white/50">
                Support
              </h2>
            </div>
            <div className="max-w-sm">
              <StepCard
                step={supportStep}
                selected={selectedStep?.id === supportStep.id}
                onSelect={setSelectedStep}
              />
            </div>
          </div>
        </div>

        {/* Zone C — Detail Panel (right, 1/3, sticky on desktop) */}
        <div className="lg:sticky lg:top-6 lg:w-1/3 lg:self-start">
          <StepDetailPanel step={selectedStep} action={activeAction} />
        </div>
      </div>
    </div>
  )
}
