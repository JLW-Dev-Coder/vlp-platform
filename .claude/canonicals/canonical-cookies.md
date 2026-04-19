# Canonical: Cookie Consent

Last updated: 2026-04-16

## Purpose

All 8 VLP ecosystem apps MUST display a cookie consent widget to new visitors, allowing them to accept, reject, or manage analytics cookies. The widget is shared via `@vlp/member-ui` and is tokenized so each app inherits its brand colors automatically.

## Shared Components

`@vlp/member-ui` exports:

- `CookieConsent` — The widget itself. Mount once in the marketing layout.
- `applyAnalyticsConsent(enabled: boolean): void` — Stub hook called when user toggles analytics. Wire to analytics provider (Plausible, GA4, PostHog) when selected.
- `ManageCookiesLink` — Small client-island button. Rendered automatically in MarketingFooter's legal column. No manual mounting needed.

## Integration (per-app)

Each app's `(marketing)/layout.tsx` must mount CookieConsent:

```tsx
import { CookieConsent } from '@vlp/member-ui'
import { appConfig } from '@/lib/platform-config'

export default function MarketingLayout({ children }) {
  return (
    <>
      <MarketingHeader config={appConfig} />
      <main>{children}</main>
      <MarketingFooter config={appConfig} />
      <CookieConsent config={appConfig} />
    </>
  )
}
```

Note: CookieConsent positions itself fixed at bottom-left of the viewport; mount order within the layout doesn't matter visually, only that it's rendered.

## Storage Key Convention

Storage key defaults to `${brandAbbrev.toLowerCase()}_cookie_prefs_v1`. Keys by app:

| App | brandAbbrev | Storage key |
|-----|-------------|-------------|
| VLP | VLP | vlp_cookie_prefs_v1 |
| TCVLP | TCVLP | tcvlp_cookie_prefs_v1 |
| TMP | TMP | tmp_cookie_prefs_v1 |
| TTMP | TTMP | ttmp_cookie_prefs_v1 |
| TTTMP | TTTMP | tttmp_cookie_prefs_v1 |
| DVLP | DVLP | dvlp_cookie_prefs_v1 |
| GVLP | GVLP | gvlp_cookie_prefs_v1 |
| WLVLP | WLVLP | wlvlp_cookie_prefs_v1 |

To override (e.g., for backwards compatibility with an existing key), set `cookiePrefsStorageKey` in the app's PlatformConfig.

## Privacy Policy Link

CookieConsent's privacyPath prop defaults to `/legal/privacy` — matching the canonical legal page routes across the ecosystem. Override only if an app uses a different privacy route.

## Manage Cookies Flow

`ManageCookiesLink` is automatically rendered in MarketingFooter's legal column. When clicked, it dispatches a `vlp:open-cookie-prefs` custom event. `CookieConsent` listens for this event and re-opens the preferences panel, allowing returning visitors to change their choices.

No app-level integration needed — the footer link appears wherever MarketingFooter is mounted.

## Analytics Integration

`applyAnalyticsConsent` is now wired to PostHog (via dynamic import — the SDK never loads for users who opt out). Implementation lives in `packages/member-ui/src/lib/analytics.ts`; CookieConsent calls `setAnalyticsConfig({ posthog })` on mount using `config.posthog`, then routes every accept/reject/save through `applyAnalyticsConsent(enabled)`.

```ts
// Per-app PlatformConfig (optional)
posthog: {
  apiKey: 'phc_...',              // public project key — safe in client bundle
  apiHost: 'https://us.i.posthog.com',
  autocapture: true,
  capturePageview: true,
  capturePageleave: true,
  disabledInDev: false,
}
```

If `config.posthog` is not set, consent toggles are no-ops — nothing initializes and no network requests go out. This keeps analytics strictly opt-in both at the user level (cookie consent) and the app level (config presence).

For SPA pageview tracking on App Router navigations, mount `<PostHogPageview />` in the layout (inside `<Suspense fallback={null}>` to satisfy Next 15's `useSearchParams` rule). See `canonical-app-components.md` §12 for the component entry and adoption matrix in `canonical-feature-matrix.md` → Shared Component Rollout.

This one change propagates to all apps since they all consume the same shared component — new apps only need to add a `posthog` block to their PlatformConfig and mount `<PostHogPageview />`.

## Decision Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-04-18 | Wired PostHog as the analytics provider behind `applyAnalyticsConsent` via dynamic import; introduced `config.posthog` on PlatformConfig + `PostHogPageview` shared component. First adopter: TTMP. | Replaces the Plausible-example stub with a real lazy-loaded implementation. SDK only ships to opted-in users; opt-out users make zero requests to posthog.com. Config-driven so each app can enable independently without code changes to the shared library. |
| 2026-04-16 | Canonicalized cookie consent into shared @vlp/member-ui component | VLP had a local 196-line implementation with hardcoded grays, oranges, and a hardcoded storage key. TCVLP had no cookie consent at all (compliance gap). Shared component tokenizes all surfaces, derives storage key from config.brandAbbrev, makes privacy path configurable, and adds a "Manage Cookies" footer link via custom-event pattern for returning visitors to change their minds. Deletes VLP's local implementation. Positions other 6 apps for easy rollout. |
