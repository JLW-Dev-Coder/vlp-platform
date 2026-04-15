export type TcvlpTier = 'tcvlp_starter' | 'tcvlp_professional' | 'tcvlp_firm';

export type TcvlpFeature =
  | 'form_843_generation'
  | 'branded_claim_page'
  | 'penalty_calculations'
  | 'taxpayer_dashboard'
  | 'kwong_tools'
  | 'unlimited_claim_pages'
  | 'priority_generation'
  | 'bulk_export'
  | 'transcript_integration'
  | 'white_label'
  | 'multi_practitioner'
  | 'api_access'
  | 'dedicated_support';

const TIER_FEATURES: Record<TcvlpTier, TcvlpFeature[]> = {
  tcvlp_starter: [
    'form_843_generation',
    'branded_claim_page',
    'penalty_calculations',
    'taxpayer_dashboard',
    'kwong_tools',
  ],
  tcvlp_professional: [
    'form_843_generation',
    'branded_claim_page',
    'penalty_calculations',
    'taxpayer_dashboard',
    'kwong_tools',
    'unlimited_claim_pages',
    'priority_generation',
    'bulk_export',
    'transcript_integration',
  ],
  tcvlp_firm: [
    'form_843_generation',
    'branded_claim_page',
    'penalty_calculations',
    'taxpayer_dashboard',
    'kwong_tools',
    'unlimited_claim_pages',
    'priority_generation',
    'bulk_export',
    'transcript_integration',
    'white_label',
    'multi_practitioner',
    'api_access',
    'dedicated_support',
  ],
};

export function hasFeature(tier: TcvlpTier | string | null | undefined, feature: TcvlpFeature): boolean {
  const t = (tier || 'tcvlp_starter') as TcvlpTier;
  return (TIER_FEATURES[t] ?? TIER_FEATURES.tcvlp_starter).includes(feature);
}

export function tierLabel(tier: TcvlpTier | string | null | undefined): string {
  switch (tier) {
    case 'tcvlp_professional': return 'Professional';
    case 'tcvlp_firm': return 'Firm';
    default: return 'Starter';
  }
}

export function tierPrice(tier: TcvlpTier | string | null | undefined): number {
  switch (tier) {
    case 'tcvlp_professional': return 29;
    case 'tcvlp_firm': return 79;
    default: return 10;
  }
}

export const STRIPE_PRICES: Record<TcvlpTier, string> = {
  tcvlp_starter: 'price_1TDvQe9ROeyeXOqek1fpOWWH',
  tcvlp_professional: 'price_1TMI7d9ROeyeXOqeRSrkysQW',
  tcvlp_firm: 'price_1TMI7k9ROeyeXOqeUlKb4Uso',
};
