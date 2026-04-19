/**
 * Typed registry of revenue/behavior events allowed across the VLP ecosystem.
 *
 * The four canonical events are the only ones the shared `capture()` helper
 * accepts. A fifth event requires Principal sign-off and a canonical update.
 * Call-sites that truly need a one-off can fall back to the raw PostHog
 * client via `getPostHogClient()`.
 */

export type AnalyticsEvent =
  | { name: 'sign_up'; props: { app: string; method?: string } }
  | { name: 'checkout_started'; props: { app: string; sku: string; amount_cents: number } }
  | {
      name: 'purchase'
      props: {
        app: string
        sku: string
        amount_cents: number
        stripe_session_id?: string
        client_reference_id?: string
      }
    }
  | { name: 'chatbot_lead'; props: { app: string; intent?: string } }

export type AnalyticsEventName = AnalyticsEvent['name']
