/**
 * Analytics adapter for @vlp/member-ui.
 *
 * Exposes a provider-agnostic consent hook (`applyAnalyticsConsent`) that
 * CookieConsent calls when the user opts in or out of analytics cookies.
 *
 * Current provider: PostHog (loaded via dynamic import so opted-out users
 * never download the SDK).
 *
 * Usage:
 *   1. App calls setAnalyticsConfig({ posthog: { apiKey, apiHost, ... } })
 *      once at startup (CookieConsent does this when it mounts).
 *   2. CookieConsent calls applyAnalyticsConsent(true|false) after the user
 *      chooses. On `true`, the PostHog SDK is lazy-loaded and initialized.
 *      On `false`, any existing client is opted out.
 */

type PostHogClient = {
  init: (key: string, opts: Record<string, unknown>) => unknown
  capture: (event: string, props?: Record<string, unknown>) => void
  opt_in_capturing: () => void
  opt_out_capturing: () => void
  has_opted_out_capturing: () => boolean
  __loaded?: boolean
}

import type { PostHogAnalyticsConfig } from '../types/config'

export type { PostHogAnalyticsConfig }

export interface AnalyticsConfig {
  posthog?: PostHogAnalyticsConfig
}

let currentConfig: AnalyticsConfig | null = null
let posthogClient: PostHogClient | null = null
let initPromise: Promise<PostHogClient | null> | null = null

export function setAnalyticsConfig(config: AnalyticsConfig): void {
  currentConfig = config
}

export function getPostHogClient(): PostHogClient | null {
  return posthogClient
}

function isDev(): boolean {
  if (typeof process === 'undefined') return false
  return process.env?.NODE_ENV !== 'production'
}

async function loadPostHog(cfg: PostHogAnalyticsConfig): Promise<PostHogClient | null> {
  if (posthogClient?.__loaded) return posthogClient
  if (initPromise) return initPromise

  initPromise = (async () => {
    try {
      const mod = await import('posthog-js')
      const client = (mod.default ?? mod) as unknown as PostHogClient
      client.init(cfg.apiKey, {
        api_host: cfg.apiHost ?? 'https://us.i.posthog.com',
        autocapture: cfg.autocapture ?? true,
        capture_pageview: cfg.capturePageview ?? true,
        capture_pageleave: cfg.capturePageleave ?? true,
        persistence: 'localStorage+cookie',
        loaded: (ph: PostHogClient) => {
          ph.__loaded = true
        },
      })
      client.__loaded = true
      posthogClient = client
      return client
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('[analytics] failed to load posthog-js', err)
      return null
    }
  })()

  return initPromise
}

export function applyAnalyticsConsent(enabled: boolean): void {
  if (typeof window === 'undefined') return

  if (!enabled) {
    if (posthogClient) posthogClient.opt_out_capturing()
    return
  }

  const cfg = currentConfig?.posthog
  if (!cfg) return
  if (cfg.disabledInDev && isDev()) return

  void loadPostHog(cfg).then((client) => {
    if (client) client.opt_in_capturing()
  })
}
