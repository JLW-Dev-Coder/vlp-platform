import catalog from '@/wlvlp-catalog.json';

export const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.virtuallaunch.pro';
const SITE_ORIGIN = 'https://websitelotto.virtuallaunch.pro';

export async function requestMagicLink(email: string, redirectPath: string): Promise<{ ok: boolean }> {
  const redirectUri = redirectPath.startsWith('http') ? redirectPath : `${SITE_ORIGIN}${redirectPath}`;
  return apiFetch('/v1/auth/magic-link/request', {
    method: 'POST',
    body: JSON.stringify({ email, redirectUri }),
  });
}

export function googleAuthUrl(redirectPath: string): string {
  const returnTo = redirectPath.startsWith('http') ? redirectPath : `${SITE_ORIGIN}${redirectPath}`;
  return `${API_BASE}/v1/auth/google/start?return_to=${encodeURIComponent(returnTo)}`;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
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

export interface Template {
  slug: string;
  title: string;
  category: string;
  description?: string;
  status: 'available' | 'auction' | 'sold';
  thumbnail_url?: string;
  vote_count: number;
  current_bid?: number;
  auction_ends_at?: string;
  price_monthly: number;
  bid_count?: number;
  high_bid?: number | null;
}

export interface Bid {
  account_id: string;
  amount: number;
  created_at: string;
}

export interface ScratchTicket {
  ticket_id: string;
  status?: 'unscratched' | 'revealed';
}

export interface ScratchRevealResult {
  ok: boolean;
  prize_type: 'free_month' | 'discount_50' | 'discount_25' | 'credit_9' | 'free_ticket' | 'no_prize';
  prize_value: string | null;
  promo_code?: string;
  promo_code_id?: string;
  auto_apply?: boolean;
  expires_at?: string;
  new_ticket_id?: string;
}

export class ScratchError extends Error {
  status: number;
  code: string;
  nextAvailableAt?: string;
  constructor(status: number, code: string, message: string, nextAvailableAt?: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.nextAvailableAt = nextAvailableAt;
  }
}

export interface BuyerDashboard {
  account_id: string;
  template: Template;
  subscription_status: string;
  stripe_portal_url?: string;
  site_config: Record<string, string>;
  scratch_ticket?: ScratchTicket;
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

export async function getTemplates(params?: Record<string, string>): Promise<Template[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const data = await apiFetch<{ ok?: boolean; templates?: Template[] } | Template[]>(
    `/v1/wlvlp/templates${qs}`
  );
  if (Array.isArray(data)) return data;
  return data?.templates ?? [];
}

interface CatalogSite {
  slug: string;
  title: string;
  categories: string[];
  status?: string;
  price?: number | null;
}

const CATEGORY_MAP: Record<string, Template['category']> = {
  'Tax and Finance': 'finance',
  'Legal': 'legal',
  'Food and Beverage': 'food/bev',
  'Sports and Fitness': 'health',
  'Services': 'services',
  'Beauty and Fashion': 'creative',
  'Entertainment': 'creative',
  'Real Estate and Home': 'services',
  'Tech and Digital': 'services',
  'Lifestyle and Hobby': 'other',
  'Travel and Adventure': 'other',
  'Uncategorized': 'other',
};

export function getTemplatesFromCatalog(): Template[] {
  const sites = (catalog as { sites: CatalogSite[] }).sites;
  return sites
    .filter(s => s.slug && s.slug !== 'index')
    .map(s => {
      const primary = s.categories?.[0] ?? 'Uncategorized';
      return {
        slug: s.slug,
        title: s.title,
        category: CATEGORY_MAP[primary] ?? 'other',
        status: (s.status as Template['status']) ?? 'available',
        vote_count: 0,
        price_monthly: 0,
      };
    });
}

// Merge the static catalog (the full 222-site inventory) with live D1 stats
// so every template renders with correct status, vote_count, bid_count, high_bid.
// The Worker only seeds a subset of templates in D1; the catalog covers the rest.
export async function getTemplatesWithFallback(): Promise<Template[]> {
  const catalogTemplates = getTemplatesFromCatalog();
  try {
    const liveList = await getTemplates();
    if (!Array.isArray(liveList) || liveList.length === 0) return catalogTemplates;

    const liveBySlug = new Map<string, Template>();
    for (const t of liveList) liveBySlug.set(t.slug, t);

    // Merge: catalog provides the base row, live data overrides stats + status
    const merged = catalogTemplates.map(t => {
      const live = liveBySlug.get(t.slug);
      if (!live) return t;
      return {
        ...t,
        status: live.status ?? t.status,
        vote_count: live.vote_count ?? t.vote_count,
        bid_count: live.bid_count ?? 0,
        high_bid: live.high_bid ?? null,
        current_bid: live.current_bid ?? live.high_bid ?? undefined,
        auction_ends_at: live.auction_ends_at ?? t.auction_ends_at,
        thumbnail_url: live.thumbnail_url ?? t.thumbnail_url,
      };
    });

    // Include any live rows not represented in the catalog
    const catalogSlugs = new Set(catalogTemplates.map(t => t.slug));
    for (const t of liveList) if (!catalogSlugs.has(t.slug)) merged.push(t);

    return merged;
  } catch {
    return catalogTemplates;
  }
}

export function getTemplate(slug: string): Promise<Template> {
  return apiFetch(`/v1/wlvlp/templates/${slug}`);
}

export function getTemplateBids(slug: string): Promise<Bid[]> {
  return apiFetch(`/v1/wlvlp/templates/${slug}/bids`);
}

export function voteTemplate(slug: string): Promise<{ vote_count: number }> {
  return apiFetch(`/v1/wlvlp/templates/${slug}/vote`, { method: 'POST' });
}

export function placeBid(slug: string, amount: number): Promise<{ ok: boolean }> {
  return apiFetch(`/v1/wlvlp/templates/${slug}/bid`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  });
}

export interface CheckoutResponse {
  session_url?: string;
  url?: string;
}

export function createCheckout(
  slug: string,
  tier: 'standard' | 'premium',
  email?: string
): Promise<CheckoutResponse> {
  return apiFetch('/v1/wlvlp/checkout', {
    method: 'POST',
    body: JSON.stringify({ slug, tier, ...(email ? { email } : {}) }),
  });
}

export async function createScratchTicket(): Promise<ScratchTicket> {
  const res = await fetch(`${API_BASE}/v1/wlvlp/scratch`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    const code = data?.error ?? `HTTP_${res.status}`;
    throw new ScratchError(res.status, code, codeToMessage(code, res.status), data?.next_available_at);
  }
  return { ticket_id: data.ticket_id, status: 'unscratched' };
}

function codeToMessage(code: string, status: number): string {
  switch (code) {
    case 'daily_limit':
      return 'You already claimed a ticket in the last 24 hours. Come back tomorrow for another.';
    case 'TICKET_NOT_FOUND':
      return 'That ticket could not be found. Try getting a new one.';
    case 'TICKET_ALREADY_SCRATCHED':
      return 'This ticket has already been revealed.';
    case 'INTERNAL_ERROR':
      return 'Something went wrong on our side. Please try again in a moment.';
    default:
      if (status === 401) return 'Your session expired. Please sign in again.';
      if (status === 429) return 'Too many requests. Please wait a moment and try again.';
      return `Request failed (${status}). Please try again.`;
  }
}

export interface ScratchPrize {
  ticket_id: string;
  prize: string;
  prize_code?: string;
  revealed_at?: string;
  redeemed?: boolean;
}

export async function getScratchPrizes(account_id: string): Promise<ScratchPrize[]> {
  try {
    const data = await apiFetch<{ ok?: boolean; prizes?: ScratchPrize[] } | ScratchPrize[]>(
      `/v1/wlvlp/scratch/prizes/${encodeURIComponent(account_id)}`
    );
    if (Array.isArray(data)) return data;
    return data?.prizes ?? [];
  } catch {
    return [];
  }
}

export async function revealScratchTicket(ticket_id: string): Promise<ScratchRevealResult> {
  const res = await fetch(`${API_BASE}/v1/wlvlp/scratch/${ticket_id}/reveal`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.ok === false) {
    const code = data?.error ?? `HTTP_${res.status}`;
    throw new ScratchError(res.status, code, codeToMessage(code, res.status));
  }
  return data as ScratchRevealResult;
}

export function getBuyerDashboard(account_id: string): Promise<BuyerDashboard> {
  return apiFetch(`/v1/wlvlp/buyer/${account_id}`);
}

export interface PurchasedSite {
  slug: string;
  title: string;
  category?: string;
  purchased_at: string;
  hosting_status: 'active' | 'expired' | 'pending';
  hosting_expires_at?: string;
  site_url: string;
  custom_domain?: string;
  domain_status?: 'pending' | 'verified' | 'failed';
}

export interface DomainConnectResponse {
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  instructions?: {
    type: string;
    name: string;
    value: string;
  }[];
  message?: string;
}

export interface SiteDomainInfo {
  domain?: string;
  status?: 'pending' | 'verified' | 'failed';
  instructions?: DomainConnectResponse['instructions'];
}

export function connectDomain(slug: string, domain: string): Promise<DomainConnectResponse> {
  return apiFetch(`/v1/wlvlp/sites/${slug}/domain`, {
    method: 'POST',
    body: JSON.stringify({ domain }),
  });
}

export function getSiteDomain(slug: string): Promise<SiteDomainInfo> {
  return apiFetch(`/v1/wlvlp/sites/${slug}/domain`);
}

export function createHostingRenewalCheckout(slug: string): Promise<CheckoutResponse> {
  return apiFetch('/v1/wlvlp/checkout', {
    method: 'POST',
    body: JSON.stringify({ slug, tier: 'standard', plan: 'hosting_renewal' }),
  });
}

export function getMySites(account_id: string): Promise<PurchasedSite[]> {
  return apiFetch(`/v1/wlvlp/sites/by-account/${account_id}`);
}

export function updateConfig(slug: string, config: Record<string, string>): Promise<{ ok: boolean }> {
  return apiFetch(`/v1/wlvlp/config/${slug}`, {
    method: 'PATCH',
    body: JSON.stringify(config),
  });
}

export async function uploadLogo(slug: string, file: File): Promise<{ url: string }> {
  const form = new FormData();
  form.append('logo', file);
  form.append('slug', slug);
  const res = await fetch(`${API_BASE}/v1/wlvlp/upload-logo`, {
    credentials: 'include',
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error(`uploadLogo → ${res.status}`);
  return res.json();
}

export function logout(): Promise<{ ok: boolean }> {
  return apiFetch('/v1/auth/logout', { method: 'POST' });
}

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
  const data = await apiFetch<{ ok: boolean; onboard_url: string }>(
    '/v1/affiliates/connect/onboard',
    { method: 'POST' }
  );
  return { onboard_url: data.onboard_url };
}

export async function requestPayout(amount: number): Promise<PayoutResponse> {
  const data = await apiFetch<{ ok: boolean; payout: PayoutResponse } | PayoutResponse>(
    '/v1/affiliates/payout/request',
    {
      method: 'POST',
      body: JSON.stringify({ amount }),
    }
  );
  if (data && typeof data === 'object' && 'payout' in data && data.payout) {
    return data.payout as PayoutResponse;
  }
  return data as PayoutResponse;
}

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

export interface ConversionLeakReport {
  score: number;
  leaks: { title: string; description: string }[];
  metrics: {
    visitors_month: number;
    current_rate: number;
    optimized_rate: number;
    avg_client_value: number;
    close_rate: number;
  };
  before_after: {
    current_headline: string;
    current_problems: string[];
    upgraded_headline: string;
    upgraded_description: string;
    upgraded_chips: string[];
  };
}

export interface AssetPageData {
  headline: string;
  subheadline: string;
  template_preview_slug: string;
  template_preview_url: string;
  practice_type: string;
  firm?: string;
  city: string;
  state: string;
  cta_claim_url: string;
  cta_scratch_url: string;
  cta_booking_url: string;
  conversion_leak_report?: ConversionLeakReport;
}

export interface SiteRequestPayload {
  slug: string;
  firm_name: string;
  credential: string;
  city: string;
  state: string;
  services: string[];
  target_clients: string;
  color_scheme: string;
  logo_url: string;
  phone: string;
  email: string;
  website_url: string;
  additional_notes: string;
}

export interface SiteRequestResponse {
  ok: boolean;
  request_id?: string;
  error?: string;
}

export async function submitSiteRequest(data: SiteRequestPayload): Promise<SiteRequestResponse> {
  try {
    const res = await fetch(`${API_BASE}/v1/wlvlp/site-requests`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, error: json?.error ?? `HTTP ${res.status}` };
    return { ok: true, ...json };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Request failed' };
  }
}

export interface SiteRequestStatus {
  ok: boolean;
  status: string;
  generated_at?: string;
}

export async function getSiteRequestStatus(slug: string): Promise<SiteRequestStatus> {
  try {
    const res = await fetch(`${API_BASE}/v1/wlvlp/site-requests/${slug}`, {
      credentials: 'include',
    });
    if (!res.ok) return { ok: false, status: 'unknown' };
    return res.json();
  } catch {
    return { ok: false, status: 'unknown' };
  }
}

export function getCustomSiteUrl(slug: string): string {
  return `${API_BASE}/v1/wlvlp/custom-sites/${slug}`;
}

export interface UserBid {
  template_slug: string;
  template_title: string;
  amount: number;
  created_at: string;
  is_winning: boolean;
  auction_ends_at?: string | null;
  template_status: Template['status'];
}

async function fetchTemplatesByStatus(status?: string): Promise<Template[]> {
  try {
    const params = status ? { status } : undefined;
    return await getTemplates(params);
  } catch {
    return [];
  }
}

export function getActiveAuctionTemplates(): Promise<Template[]> {
  return fetchTemplatesByStatus('auction');
}

export function getAvailableTemplates(): Promise<Template[]> {
  return fetchTemplatesByStatus('available');
}

interface BidByAccountRow {
  bid_id: string;
  template_slug: string;
  template_title: string;
  template_status: Template['status'] | null;
  amount: number;
  status: string;
  created_at: string;
  auction_ends_at: string | null;
  is_winning: boolean;
}

export async function getMyBids(accountId: string): Promise<UserBid[]> {
  if (!accountId) return [];
  try {
    const data = await apiFetch<{ ok?: boolean; bids?: BidByAccountRow[] }>(
      `/v1/wlvlp/bids/by-account/${encodeURIComponent(accountId)}`
    );
    const rows = data?.bids ?? [];
    return rows.map(r => ({
      template_slug: r.template_slug,
      template_title: r.template_title,
      amount: r.amount,
      created_at: r.created_at,
      is_winning: r.is_winning,
      auction_ends_at: r.auction_ends_at,
      template_status: (r.template_status ?? 'auction') as Template['status'],
    }));
  } catch {
    return [];
  }
}

export interface UserVote {
  template_slug: string;
  template_title: string;
  template_status: Template['status'] | null;
  template_category: string | null;
  thumbnail_url: string | null;
  vote_count: number;
  created_at: string;
}

export async function getMyVotes(accountId: string): Promise<UserVote[]> {
  if (!accountId) return [];
  try {
    const data = await apiFetch<{ ok?: boolean; votes?: UserVote[] }>(
      `/v1/wlvlp/votes/by-account/${encodeURIComponent(accountId)}`
    );
    return data?.votes ?? [];
  } catch {
    return [];
  }
}

export interface NotificationRow {
  notification_id: string;
  account_id: string;
  title: string;
  message: string;
  severity: string;
  read: number | boolean;
  created_at: string;
}

export async function getNotifications(
  accountId: string,
  limit = 20
): Promise<NotificationRow[]> {
  try {
    const data = await apiFetch<{ ok: boolean; notifications: NotificationRow[] }>(
      `/v1/notifications/in-app?accountId=${encodeURIComponent(accountId)}&limit=${limit}`
    );
    return data.notifications ?? [];
  } catch {
    return [];
  }
}

export async function getAssetPage(slug: string): Promise<AssetPageData | null> {
  try {
    const res = await fetch(`${API_BASE}/v1/wlvlp/asset-pages/${slug}`, {
      method: 'GET',
    });
    if (!res.ok) return null;
    const json = await res.json();
    // R2 records wrap the page payload under `asset_page`. Unwrap it so callers
    // can read fields (headline, conversion_leak_report, ...) directly.
    if (json && typeof json === 'object' && json.asset_page) {
      return json.asset_page as AssetPageData;
    }
    return json as AssetPageData;
  } catch {
    return null;
  }
}
