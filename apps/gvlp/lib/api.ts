const API_BASE = 'https://api.virtuallaunch.pro';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text().catch(() => res.statusText);
    throw new Error(error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface Session {
  account_id: string;
  email: string;
  role: string;
  membership: string;
  platform: string;
  expires_at: string;
  referral_code?: string;
  transcript_tokens?: number;
}

export interface GvlpConfig {
  tier: string;
  unlocked_games: string[];
  tokens_balance: number;
  client_id: string;
}

export interface TokenBalance {
  balance: number;
  used: number;
  total: number;
}

export interface Operator {
  account_id: string;
  name: string;
  firm_name?: string;
  email: string;
  tier: string;
  client_id: string;
  tokens_balance: number;
  unlocked_games: string[];
}

export interface Play {
  id: string;
  game_slug: string;
  visitor_id: string;
  played_at: string;
  tokens_used: number;
}

export interface PlaysResponse {
  plays: Play[];
  total: number;
}

export interface CheckoutResponse {
  session_url: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/auth/session`, {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ok?: boolean; session?: Session };
    return data?.session ?? null;
  } catch {
    return null;
  }
}

export async function getGvlpConfig(client_id: string): Promise<GvlpConfig> {
  return apiFetch<GvlpConfig>(`/v1/gvlp/config?client_id=${encodeURIComponent(client_id)}`);
}

export async function getTokenBalance(client_id: string): Promise<TokenBalance> {
  return apiFetch<TokenBalance>(`/v1/gvlp/tokens/balance?client_id=${encodeURIComponent(client_id)}`);
}

export async function useToken(
  client_id: string,
  visitor_id: string,
  game_slug: string
): Promise<{ success: boolean; balance: number }> {
  return apiFetch('/v1/gvlp/tokens/use', {
    method: 'POST',
    body: JSON.stringify({ client_id, visitor_id, game_slug }),
  });
}

export async function createCheckout(
  account_id: string,
  tier: string
): Promise<CheckoutResponse> {
  return apiFetch('/v1/gvlp/stripe/checkout', {
    method: 'POST',
    body: JSON.stringify({ account_id, tier }),
  });
}

export async function getOperator(account_id: string): Promise<Operator> {
  return apiFetch<Operator>(`/v1/gvlp/operator/${encodeURIComponent(account_id)}`);
}

export async function updateOperator(
  account_id: string,
  data: Partial<Operator>
): Promise<Operator> {
  return apiFetch<Operator>(`/v1/gvlp/operator/${encodeURIComponent(account_id)}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function getPlays(
  account_id: string,
  params?: Record<string, string>
): Promise<PlaysResponse> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  return apiFetch<PlaysResponse>(`/v1/gvlp/operator/${encodeURIComponent(account_id)}/plays${qs}`);
}

export async function logout(): Promise<void> {
  await apiFetch('/v1/auth/logout', { method: 'POST' });
}

export async function requestMagicLink(email: string): Promise<{ ok: boolean }> {
  return apiFetch('/v1/auth/magic-link/request', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function googleAuthUrl(redirect?: string): string {
  const qs = redirect ? `?redirect=${encodeURIComponent(redirect)}` : '';
  return `${API_BASE}/v1/auth/google/start${qs}`;
}

// ── Affiliate ──

export interface Affiliate {
  referral_code: string;
  connect_status: 'pending' | 'active' | 'inactive' | string;
  balance_pending: number;
  balance_paid: number;
  referral_url: string;
  referred_count?: number;
}

export interface AffiliateEvent {
  event_id: string;
  referrer_account_id: string;
  referred_account_id?: string;
  platform?: string;
  gross_amount_cents?: number;
  commission_amount_cents?: number;
  status: 'pending' | 'paid' | string;
  created_at: string;
}

export interface PayoutResponse {
  payout_id: string;
  amount: number;
  status: string;
}

export async function getAffiliate(account_id: string): Promise<Affiliate> {
  const data = await apiFetch<{ ok: boolean; affiliate: Affiliate }>(
    `/v1/affiliates/${encodeURIComponent(account_id)}`
  );
  return data.affiliate;
}

export async function getAffiliateEvents(account_id: string): Promise<AffiliateEvent[]> {
  const data = await apiFetch<{ ok: boolean; events: AffiliateEvent[] }>(
    `/v1/affiliates/${encodeURIComponent(account_id)}/events`
  );
  return data.events ?? [];
}

export async function startAffiliateOnboarding(): Promise<{ onboard_url: string }> {
  return apiFetch<{ onboard_url: string }>('/v1/affiliates/connect/onboard', { method: 'POST' });
}

export async function requestPayout(amount: number): Promise<PayoutResponse> {
  return apiFetch<PayoutResponse>('/v1/affiliates/payout/request', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

// ── Support ──

export interface SupportTicketRow {
  ticket_id: string;
  account_id: string;
  subject: string;
  message?: string;
  priority?: string | null;
  status: string;
  category?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export async function getSupportTicketsByAccount(
  accountId: string
): Promise<SupportTicketRow[]> {
  const data = await apiFetch<{ ok: boolean; tickets: SupportTicketRow[] }>(
    `/v1/support/tickets/by-account/${encodeURIComponent(accountId)}`
  );
  return data.tickets ?? [];
}
