/**
 * Thin wrapper over the shared consent-gated PostHog client in
 * `@vlp/member-ui`. The SDK is lazy-loaded and initialized by
 * CookieConsent once the user opts in to analytics — this helper is
 * a no-op until that happens (or forever, if the user opts out).
 */

import { getPostHogClient } from '@vlp/member-ui'

export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    const client = getPostHogClient()
    if (!client) return
    if (client.has_opted_out_capturing?.()) return
    client.capture(event, props)
  } catch {
    // analytics must never break UX
  }
}
