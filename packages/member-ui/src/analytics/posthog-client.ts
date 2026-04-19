/**
 * Typed PostHog helper layer.
 *
 * Thin wrapper over the existing `lib/analytics.ts` consent-gated client.
 * Exposes:
 *   - initPostHog(key, opts)   — set config + (optionally) opt in immediately
 *   - capture(event)           — typed capture; no-op if no consent or no client
 *   - identify(id, props)      — identify a user across future captures
 *   - setConsent(enabled)      — delegate to applyAnalyticsConsent
 *
 * All captures are no-ops until the user has accepted analytics cookies and
 * the PostHog SDK has been lazy-loaded. Safe to call during SSR — every call
 * guards on `typeof window`.
 */

import {
  applyAnalyticsConsent,
  getPostHogClient,
  setAnalyticsConfig,
  type PostHogAnalyticsConfig,
} from '../lib/analytics'
import type { AnalyticsEvent } from './events'

export interface InitPostHogOptions {
  apiHost?: string
  autocapture?: boolean
  capturePageview?: boolean
  capturePageleave?: boolean
  disabledInDev?: boolean
  /** When true, immediately call applyAnalyticsConsent(true). Default: false — leave consent gating to CookieConsent. */
  optInImmediately?: boolean
}

export function initPostHog(key: string, opts: InitPostHogOptions = {}): void {
  const cfg: PostHogAnalyticsConfig = {
    apiKey: key,
    apiHost: opts.apiHost ?? 'https://us.i.posthog.com',
    autocapture: opts.autocapture ?? true,
    capturePageview: opts.capturePageview ?? true,
    capturePageleave: opts.capturePageleave ?? true,
    disabledInDev: opts.disabledInDev ?? false,
  }
  setAnalyticsConfig({ posthog: cfg })
  if (opts.optInImmediately) applyAnalyticsConsent(true)
}

export function capture<E extends AnalyticsEvent>(event: E): void {
  if (typeof window === 'undefined') return
  const client = getPostHogClient()
  if (!client) return
  if (client.has_opted_out_capturing?.()) return
  client.capture(event.name, event.props as Record<string, unknown>)
}

export function identify(distinctId: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  const client = getPostHogClient() as unknown as {
    identify?: (id: string, p?: Record<string, unknown>) => void
    has_opted_out_capturing?: () => boolean
  } | null
  if (!client?.identify) return
  if (client.has_opted_out_capturing?.()) return
  client.identify(distinctId, props)
}

export function setConsent(enabled: boolean): void {
  applyAnalyticsConsent(enabled)
}
