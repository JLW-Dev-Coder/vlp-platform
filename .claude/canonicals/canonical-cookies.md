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

Currently `applyAnalyticsConsent` is a no-op stub. When an analytics provider is selected, replace the stub body:

```ts
// Example: Plausible
export function applyAnalyticsConsent(enabled: boolean): void {
  if (enabled) {
    window.plausible?.enable?.()
  } else {
    window.plausible?.disable?.()
  }
}
```

This one change propagates to all apps since they all consume the same shared component.

## Decision Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-04-16 | Canonicalized cookie consent into shared @vlp/member-ui component | VLP had a local 196-line implementation with hardcoded grays, oranges, and a hardcoded storage key. TCVLP had no cookie consent at all (compliance gap). Shared component tokenizes all surfaces, derives storage key from config.brandAbbrev, makes privacy path configurable, and adds a "Manage Cookies" footer link via custom-event pattern for returning visitors to change their minds. Deletes VLP's local implementation. Positions other 6 apps for easy rollout. |
