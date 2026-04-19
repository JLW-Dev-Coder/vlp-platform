'use client'

/**
 * CookieConsent — shared cookie consent widget for all VLP ecosystem apps.
 *
 * Behavior:
 *   - Shows banner on first visit (no stored prefs)
 *   - Hides after user chooses (Accept all / Reject non-essential / Save preferences)
 *   - Listens for `vlp:open-cookie-prefs` custom events to re-open (triggered by ManageCookiesLink in footer)
 *
 * Storage:
 *   - localStorage key from config.cookiePrefsStorageKey, or derived as
 *     `${brandAbbrev.toLowerCase()}_cookie_prefs_v1` if not set
 *   - Stored shape: { analytics: boolean, ts: number }
 *
 * Theming:
 *   - All surfaces use canonical tokens — inherits per-app brand via preset
 *   - Toggle colors use brand-primary with alpha modifiers
 *
 * Analytics hook:
 *   - applyAnalyticsConsent is a stub. When analytics provider is wired (Plausible,
 *     GA4, etc.), replace the stub body with the provider's consent-gating call.
 */

import { useEffect, useState } from 'react'
import type { PlatformConfig } from '../../types/config'
import { applyAnalyticsConsent, setAnalyticsConfig } from '../../lib/analytics'

export { applyAnalyticsConsent } from '../../lib/analytics'

const CUSTOM_EVENT = 'vlp:open-cookie-prefs'

interface CookiePrefs {
  analytics: boolean
  ts: number
}

function getStorageKey(config: PlatformConfig): string {
  if (config.cookiePrefsStorageKey) return config.cookiePrefsStorageKey
  return `${config.brandAbbrev.toLowerCase()}_cookie_prefs_v1`
}

function getStoredPrefs(key: string): CookiePrefs | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as CookiePrefs
  } catch {
    return null
  }
}

function savePrefs(key: string, prefs: CookiePrefs): void {
  try {
    localStorage.setItem(key, JSON.stringify(prefs))
  } catch {
    // ignore
  }
}

export interface CookieConsentProps {
  config: PlatformConfig
  privacyPath?: string
}

export function CookieConsent({ config, privacyPath = '/legal/privacy' }: CookieConsentProps) {
  const [visible, setVisible] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [analyticsOn, setAnalyticsOn] = useState(false)

  const storageKey = getStorageKey(config)

  useEffect(() => {
    if (config.posthog) {
      setAnalyticsConfig({ posthog: config.posthog })
    }
  }, [config.posthog])

  useEffect(() => {
    const prefs = getStoredPrefs(storageKey)
    if (!prefs) {
      setVisible(true)
    } else {
      setAnalyticsOn(prefs.analytics)
      applyAnalyticsConsent(prefs.analytics)
    }
  }, [storageKey])

  useEffect(() => {
    function handleOpen() {
      const prefs = getStoredPrefs(storageKey)
      if (prefs) {
        setAnalyticsOn(prefs.analytics)
      }
      setVisible(true)
      setPanelOpen(true)
    }
    window.addEventListener(CUSTOM_EVENT, handleOpen)
    return () => window.removeEventListener(CUSTOM_EVENT, handleOpen)
  }, [storageKey])

  function acceptAll() {
    const prefs: CookiePrefs = { analytics: true, ts: Date.now() }
    savePrefs(storageKey, prefs)
    applyAnalyticsConsent(true)
    setAnalyticsOn(true)
    setVisible(false)
    setPanelOpen(false)
  }

  function rejectAll() {
    const prefs: CookiePrefs = { analytics: false, ts: Date.now() }
    savePrefs(storageKey, prefs)
    applyAnalyticsConsent(false)
    setAnalyticsOn(false)
    setVisible(false)
    setPanelOpen(false)
  }

  function savePreferences() {
    const prefs: CookiePrefs = { analytics: analyticsOn, ts: Date.now() }
    savePrefs(storageKey, prefs)
    applyAnalyticsConsent(analyticsOn)
    setVisible(false)
    setPanelOpen(false)
  }

  if (!visible) return null

  return (
    <div
      id="vlp-cookie-consent"
      role="dialog"
      aria-label="Cookie preferences"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-overlay max-w-3xl rounded-2xl border border-subtle bg-surface-popover p-4 shadow-lg md:left-6 md:right-auto md:p-5"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-text-primary">We use cookies</p>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">
            We use essential cookies for site functionality, and optional analytics cookies to improve performance. You can accept, reject, or manage preferences at any time.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => setPanelOpen((o) => !o)}
              className="text-xs font-bold text-brand-primary underline decoration-text-muted underline-offset-4 hover:text-brand-hover focus-visible:outline-none focus-visible:shadow-focus"
            >
              Manage preferences
            </button>
            <a
              href={privacyPath}
              className="text-xs font-semibold text-text-muted underline decoration-text-muted underline-offset-4 hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
            >
              Privacy policy
            </a>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:flex-col md:items-stretch md:gap-3">
          <button
            type="button"
            onClick={acceptAll}
            className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-xs font-bold text-brand-text-on-primary hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus"
          >
            Accept all
          </button>
          <button
            type="button"
            onClick={rejectAll}
            className="inline-flex items-center justify-center rounded-xl border border-subtle bg-surface-card px-4 py-3 text-xs font-bold text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:shadow-focus"
          >
            Reject non-essential
          </button>
        </div>
      </div>

      {panelOpen && (
        <div className="mt-4 rounded-2xl border border-subtle bg-surface-card p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold text-text-primary">Cookie preferences</p>
                <p className="mt-1 text-xs text-text-muted">
                  Essential cookies are always on. Toggle analytics below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                className="rounded-lg border border-subtle bg-surface-bg px-3 py-2 text-xs font-bold text-text-muted hover:text-text-primary hover:bg-surface-elevated transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                Close
              </button>
            </div>

            <div className="rounded-2xl border border-subtle bg-surface-bg p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary">Essential</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Required for security, navigation, and saving your cookie choices.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-subtle bg-surface-card px-3 py-1 text-[11px] font-bold text-text-muted">
                  Always on
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-subtle bg-surface-bg p-3">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-text-primary">Analytics</p>
                  <p className="mt-1 text-xs text-text-muted">
                    Helps us understand usage and improve pages (e.g., anonymized metrics).
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-bold transition-colors ${
                      analyticsOn
                        ? 'border-brand-primary/40 bg-brand-primary/15 text-brand-primary'
                        : 'border-subtle bg-surface-card text-text-muted'
                    }`}
                  >
                    {analyticsOn ? 'On' : 'Off'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={analyticsOn}
                    aria-label="Toggle analytics cookies"
                    onClick={() => setAnalyticsOn((v) => !v)}
                    className={`relative h-8 w-14 flex-shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:shadow-focus ${
                      analyticsOn
                        ? 'border-brand-primary bg-brand-primary'
                        : 'border-subtle bg-surface-card'
                    }`}
                  >
                    <span
                      className={`absolute left-0 top-1 h-6 w-6 rounded-full shadow-sm transition-transform ${
                        analyticsOn
                          ? 'bg-white'
                          : 'border border-subtle bg-surface-elevated'
                      }`}
                      style={{ transform: analyticsOn ? 'translateX(28px)' : 'translateX(4px)' }}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={savePreferences}
                className="inline-flex items-center justify-center rounded-xl bg-brand-primary px-4 py-3 text-xs font-bold text-brand-text-on-primary hover:bg-brand-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
