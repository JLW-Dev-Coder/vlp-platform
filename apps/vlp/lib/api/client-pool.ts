/**
 * Client Pool API — wraps GET /v1/tmp/client-pool and related routes.
 *
 * The canonical R2 record shape is not yet frozen in a contract file, so the
 * type is intentionally permissive. The page-level adapter in
 * app/(member)/client-pool/ClientPoolTable.tsx maps whatever fields are
 * present into display strings with safe fallbacks.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export type CaseStatus =
  | 'available'
  | 'funded'
  | 'assigned'
  | 'in_progress'
  | 'completed'
  | 'completed_pending_payout'
  | 'paid_out'
  | 'refund_requested'
  | 'disputed'
  | 'refunded'
  | 'resolved_partial'
  | 'dispute_denied'
  | 'chargeback'
  | 'chargebacked'
  | (string & {})

export type CallerTier = 'scale' | 'pro' | 'free'

export interface TierAvailability {
  scale: string | null
  pro: string | null
  free: string | null
  caller_tier: CallerTier
  caller_available_at: string | null
}

export interface CasePoolRecord {
  case_id: string
  status: CaseStatus
  taxpayer_name?: string
  client_name?: string
  taxpayer_email?: string
  service_plan?: string
  service_type?: string
  service_label?: string
  entity_type?: string
  state?: string
  tax_years?: string
  plan?: string
  filing_status?: string
  filing?: string
  service_fee_cents?: number
  plan_fee_cents?: number
  service_fee?: number
  amount_total_cents?: number
  platform_fee_cents?: number
  payout_cents?: number
  pro_payout_cents?: number
  servicing_professional_id?: string | null
  claimed_by?: string | null
  claimed_at?: string | null
  paid_out_at?: string | null
  assigned_at?: string | null
  created_at?: string
  updated_at?: string
  tier_availability?: TierAvailability
  [key: string]: unknown
}

export interface ClientPoolResponse {
  ok: boolean
  cases: CasePoolRecord[]
  caller_tier?: CallerTier
  pagination: {
    page: number
    limit: number
    total: number
    total_pages: number
  }
}

export interface GetClientPoolCasesParams {
  status?: string
  professional_id?: string
  page?: number
  limit?: number
}

export async function getClientPoolCases(
  params: GetClientPoolCasesParams = {}
): Promise<ClientPoolResponse> {
  const qs = new URLSearchParams()
  if (params.status) qs.set('status', params.status)
  if (params.professional_id) qs.set('professional_id', params.professional_id)
  if (params.page) qs.set('page', String(params.page))
  if (params.limit) qs.set('limit', String(params.limit))

  const suffix = qs.toString() ? `?${qs.toString()}` : ''
  const res = await fetch(`${API_URL}/v1/tmp/client-pool${suffix}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new Error(body?.message ?? `Client pool request failed (${res.status})`)
  }

  const data = (await res.json()) as ClientPoolResponse
  return data
}

export interface AcceptCaseResponse {
  ok: boolean
  deduped?: boolean
  case_id?: string
  professional_id?: string
  assigned_at?: string
  status?: string
  error?: string
  message?: string
  available_at?: string
  caller_tier?: CallerTier
}

export async function acceptClientPoolCase(caseId: string): Promise<AcceptCaseResponse> {
  const res = await fetch(`${API_URL}/v1/tmp/client-pool/accept`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      case_id: caseId,
      professional_id: 'resolved_server_side',
    }),
  })
  const data = (await res.json().catch(() => ({}))) as AcceptCaseResponse
  return { ...data, ok: res.ok && !!data.ok }
}

export interface GetCaseResponse {
  ok: boolean
  case?: CasePoolRecord
  error?: string
  message?: string
}

export async function getClientPoolCase(caseId: string): Promise<GetCaseResponse> {
  const res = await fetch(`${API_URL}/v1/tmp/client-pool/${encodeURIComponent(caseId)}`, {
    credentials: 'include',
    cache: 'no-store',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = (await res.json().catch(() => ({}))) as GetCaseResponse
  return { ...data, ok: res.ok && !!data.ok }
}

export interface SimpleResponse {
  ok: boolean
  error?: string
  message?: string
  [key: string]: unknown
}

export async function releaseClientPoolCase(caseId: string): Promise<SimpleResponse> {
  const res = await fetch(`${API_URL}/v1/tmp/client-pool/${encodeURIComponent(caseId)}/release`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = (await res.json().catch(() => ({}))) as SimpleResponse
  return { ...data, ok: res.ok && !!data.ok }
}

export async function completeClientPoolCase(caseId: string): Promise<SimpleResponse> {
  const res = await fetch(`${API_URL}/v1/tmp/client-pool/${encodeURIComponent(caseId)}/complete`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  const data = (await res.json().catch(() => ({}))) as SimpleResponse
  return { ...data, ok: res.ok && !!data.ok }
}
