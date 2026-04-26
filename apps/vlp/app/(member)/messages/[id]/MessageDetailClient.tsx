'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Mail, Phone } from 'lucide-react'
import { ContentCard } from '@vlp/member-ui'
import { getInquiry } from '@/lib/api/member'

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

function expandState(code?: unknown): string {
  if (!code) return '—'
  const trimmed = String(code).trim()
  if (trimmed.length === 2) return US_STATE_CODE_TO_NAME[trimmed.toUpperCase()] || trimmed
  return trimmed
}

function fmt(s?: unknown): string {
  if (s == null || s === '') return '—'
  return String(s)
}

function fmtDateTime(s?: unknown): string {
  if (!s) return '—'
  const d = new Date(String(s))
  if (isNaN(d.getTime())) return String(s)
  return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
}

type Inquiry = Record<string, unknown>

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; inquiry: Inquiry }

function pickField(i: Inquiry, ...keys: string[]): unknown {
  for (const k of keys) {
    if (i[k] != null && i[k] !== '') return i[k]
  }
  return undefined
}

function joinArr(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'string') return v
  return ''
}

export default function MessageDetailClient({ id }: { id: string }) {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const inquiry = await getInquiry(id)
        if (!cancelled) setState({ status: 'ready', inquiry })
      } catch (err) {
        if (!cancelled) setState({ status: 'error', message: (err as Error)?.message ?? 'Unknown error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="space-y-8">
      <Link
        href="/messages"
        className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to messages
      </Link>

      {state.status === 'loading' && (
        <div className="h-56 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {state.status === 'error' && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Could not load inquiry</p>
            <p className="mt-1 text-amber-200/70">{state.message}</p>
          </div>
        </div>
      )}

      {state.status === 'ready' && <Detail inquiry={state.inquiry} />}
    </div>
  )
}

function Detail({ inquiry }: { inquiry: Inquiry }) {
  const firstName = pickField(inquiry, 'firstName', 'first_name', 'name')
  const lastName = pickField(inquiry, 'lastName', 'last_name')
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '—'
  const email = pickField(inquiry, 'email')
  const phone = pickField(inquiry, 'phone')
  const services = joinArr(pickField(inquiry, 'services_needed', 'serviceNeeded', 'service_needed'))
  const entities = joinArr(pickField(inquiry, 'business_types', 'entityType', 'entity_type'))
  const state = expandState(pickField(inquiry, 'preferred_state', 'state'))
  const language = pickField(inquiry, 'language_preference', 'language')
  const description = pickField(inquiry, 'description', 'response_message', 'message')
  const createdAt = pickField(inquiry, 'created_at', 'createdAt')
  const status = String(pickField(inquiry, 'status') ?? 'new')

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold text-white">{fullName}</h1>
        <p className="mt-1 text-sm text-white/50">
          Submitted {fmtDateTime(createdAt)}
        </p>
      </div>

      <ContentCard title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Email"
            value={
              email ? (
                <a className="inline-flex items-center gap-2 text-brand-primary hover:underline" href={`mailto:${email}`}>
                  <Mail className="h-3.5 w-3.5" />
                  {String(email)}
                </a>
              ) : (
                '—'
              )
            }
          />
          <Field
            label="Phone"
            value={
              phone ? (
                <a className="inline-flex items-center gap-2 text-brand-primary hover:underline" href={`tel:${phone}`}>
                  <Phone className="h-3.5 w-3.5" />
                  {String(phone)}
                </a>
              ) : (
                '—'
              )
            }
          />
        </div>
      </ContentCard>

      <ContentCard title="Request">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Service Needed" value={services || '—'} />
          <Field label="Entity Type" value={entities || '—'} />
          <Field label="State" value={state} />
          <Field label="Language Preference" value={fmt(language)} />
          <Field label="Status" value={status.charAt(0).toUpperCase() + status.slice(1)} />
        </div>
        {description != null && description !== '' && (
          <div className="mt-5">
            <p className="text-[11px] uppercase tracking-widest text-white/40">Details</p>
            <p className="mt-2 whitespace-pre-wrap text-sm text-white/80">{String(description)}</p>
          </div>
        )}
        <p className="mt-6 text-xs text-white/30">
          Status updates are not yet available from the dashboard. Contact the taxpayer directly to respond.
        </p>
      </ContentCard>
    </>
  )
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-white/40">{label}</p>
      <div className="mt-1.5 text-sm text-white">{value}</div>
    </div>
  )
}
