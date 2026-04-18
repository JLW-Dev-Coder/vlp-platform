const API_BASE = 'https://api.taxmonitor.pro'

export class ApiError extends Error {
  status: number
  upgrade_url?: string

  constructor(message: string, status: number, upgrade_url?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.upgrade_url = upgrade_url
  }
}

interface ApiOptions extends RequestInit {
  auth?: boolean
}

async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { auth = true, ...fetchOptions } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers as Record<string, string>,
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    credentials: auth ? 'include' : 'omit',
    headers,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const msg =
      (body as { error?: string }).error || `API error ${res.status}`
    const upgrade_url = (body as { upgrade_url?: string }).upgrade_url
    throw new ApiError(msg, res.status, upgrade_url)
  }

  return res.json()
}

export interface Affiliate {
  referral_code: string
  connect_status: 'pending' | 'active' | 'inactive' | string
  balance_pending: number
  balance_paid: number
  referral_url: string
  referred_count?: number
}

export interface AffiliateEvent {
  event_id: string
  referrer_account_id: string
  referred_account_id?: string
  platform?: string
  gross_amount_cents?: number
  commission_amount_cents?: number
  status: 'pending' | 'paid' | string
  created_at: string
}

export interface PayoutResponse {
  payout_id: string
  amount: number
  status: string
}

export interface TokenPackage {
  price_id: string
  label: string
  tokens: number
  price: number
  badge?: string
}

export interface BalanceData {
  transcript_tokens: number
}

export interface SupportTicketRow {
  ticket_id: string
  account_id: string
  subject: string
  message?: string
  priority?: string | null
  status: string
  category?: string | null
  created_at: string
  updated_at?: string | null
}

export async function getAffiliate(account_id: string): Promise<Affiliate> {
  const data = await apiFetch<{ ok: boolean; affiliate: Affiliate }>(
    `/v1/affiliates/${encodeURIComponent(account_id)}`
  )
  return data.affiliate
}

export async function getAffiliateEvents(
  account_id: string
): Promise<AffiliateEvent[]> {
  const data = await apiFetch<{ ok: boolean; events: AffiliateEvent[] }>(
    `/v1/affiliates/${encodeURIComponent(account_id)}/events`
  )
  return data.events ?? []
}

export async function startAffiliateOnboarding(): Promise<{ onboard_url: string }> {
  const data = await apiFetch<{ ok: boolean; onboard_url: string }>(
    '/v1/affiliates/connect/onboard',
    { method: 'POST' }
  )
  return { onboard_url: data.onboard_url }
}

export async function requestPayout(amount: number): Promise<PayoutResponse> {
  const data = await apiFetch<
    { ok: boolean } & PayoutResponse
  >('/v1/affiliates/payout/request', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
  return {
    payout_id: data.payout_id,
    amount: data.amount,
    status: data.status,
  }
}

export async function getTokenBalance(account_id: string): Promise<BalanceData> {
  const data = await apiFetch<{
    ok?: boolean
    transcript_tokens?: number
    balance?: { transcriptTokens?: number } | number
  }>(`/v1/tokens/balance/${encodeURIComponent(account_id)}`)
  const tokens =
    (typeof data.balance === 'object' && data.balance !== null
      ? data.balance.transcriptTokens
      : typeof data.balance === 'number'
        ? data.balance
        : undefined) ??
    data.transcript_tokens ??
    0
  return { transcript_tokens: tokens }
}

export async function getSupportTicketsByAccount(
  accountId: string
): Promise<SupportTicketRow[]> {
  const data = await apiFetch<{ ok: boolean; tickets: SupportTicketRow[] }>(
    `/v1/support/tickets/by-account/${encodeURIComponent(accountId)}`
  )
  return data.tickets ?? []
}

export const api = {
  // Auth
  requestMagicLink: (email: string, redirectUri?: string) =>
    apiFetch('/v1/auth/magic-link/request', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, redirectUri }),
    }),

  getSession: () =>
    apiFetch<{
      ok: boolean
      session: {
        account_id: string
        email: string
        membership: string
        platform?: string
        expires_at?: string
        referral_code?: string | null
        transcript_tokens?: number
      }
    }>('/v1/auth/session'),

  logout: () =>
    apiFetch('/v1/auth/logout', { method: 'POST' }),

  exchangeHandoffToken: (token: string) =>
    apiFetch<{
      ok: boolean
      sessionId: string
      email: string
    }>(`/v1/auth/handoff/exchange?token=${encodeURIComponent(token)}`, {
      method: 'GET',
    }),

  // Tokens
  getTokenPricing: () =>
    apiFetch<{ packages: TokenPackage[] }>('/v1/tokens/pricing', {
      credentials: 'include',
    }),

  purchaseTokens: (price_id: string) =>
    apiFetch<{ session_url: string }>('/v1/tokens/purchase', {
      method: 'POST',
      body: JSON.stringify({ price_id }),
    }),

  // Support
  createTicket: (data: { subject: string; message: string; priority?: string }) =>
    apiFetch('/v1/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ ...data, platform: 'ttmp' }),
    }),
}

// Named exports for backward compatibility
export const getTokenPricing = api.getTokenPricing
export const purchaseTokens = api.purchaseTokens
export type { TokenPackage as TokenPackageType }
