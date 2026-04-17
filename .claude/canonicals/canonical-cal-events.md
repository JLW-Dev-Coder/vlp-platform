<!--
Status: Authoritative
Last updated: 2026-04-17
Owner: JLW (Principal Engineer review required for changes)
Scope: All 8 apps in the vlp-platform monorepo
Parent: canonical-app-blueprint.md
-->

# canonical-cal-events.md

Authoritative registry for Cal.com event types used across the VLP
ecosystem. All 8 apps consume Cal.com via element-click popup embeds
configured through `PlatformConfig`. This canonical is the single
source of truth — do not hardcode Cal slugs or namespaces in
component code.

---

## 1. Naming convention

All Cal event slugs follow:

    tax-monitor-pro/{app-abbrev}-{purpose}

Where:
- `tax-monitor-pro` is the Cal.com team handle (fixed)
- `{app-abbrev}` is the lowercase app abbreviation (vlp, tcvlp, tmp,
  ttmp, tttmp, dvlp, gvlp, wlvlp)
- `{purpose}` is one of: `support`, `intro`, `discovery`, `onboarding`

The Cal **namespace** for `Cal("init", namespace, ...)` is the slug's
last path segment: `{app-abbrev}-{purpose}` (e.g., `wlvlp-support`).

When adding a new event type to Cal.com, name it per this convention
and add it to §3 below before consuming it in any app.

---

## 2. PlatformConfig fields

Each app's `lib/platform-config.ts` declares booking events as paired
namespace + slug fields on `PlatformConfig`:

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| `calBookingNamespace` | string | yes | Help Center "Book a Call" — support event |
| `calBookingSlug` | string | yes | Help Center "Book a Call" — full slug |
| `calIntroNamespace` | string | yes | Marketing "Book Intro" — intro event |
| `calIntroSlug` | string | yes | Marketing "Book Intro" — full slug |
| `calDiscoveryNamespace` | string | optional | Discovery call (TTMP only currently) |
| `calDiscoverySlug` | string | optional | Discovery call slug |
| `calOnboardingNamespace` | string | optional | Onboarding call (DVLP only currently) |
| `calOnboardingSlug` | string | optional | Onboarding call slug |

The existing `calcomReferralLink?: string` field is unrelated — it is
the Cal.com partner referral URL, not a booking event.

---

## 3. Event-type registry

All event types currently configured in Cal.com, mapped to their
PlatformConfig fields.

| App | Purpose | Slug | Namespace | Duration | PlatformConfig field |
|-----|---------|------|-----------|----------|----------------------|
| VLP | support | tax-monitor-pro/vlp-support | vlp-support | 15m | calBookingSlug / calBookingNamespace |
| VLP | intro | tax-monitor-pro/vlp-intro | vlp-intro | 15m | calIntroSlug / calIntroNamespace |
| TCVLP | support | tax-monitor-pro/tcvlp-support | tcvlp-support | 15m | calBookingSlug / calBookingNamespace |
| TCVLP | intro | tax-monitor-pro/tcvlp-intro | tcvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| TMP | support | tax-monitor-pro/tmp-support | tmp-support | 15m | calBookingSlug / calBookingNamespace |
| TMP | intro | tax-monitor-pro/tmp-intro | tmp-intro | 15m | calIntroSlug / calIntroNamespace |
| TTMP | support | tax-monitor-pro/ttmp-support | ttmp-support | 10m | calBookingSlug / calBookingNamespace |
| TTMP | intro | tax-monitor-pro/ttmp-intro | ttmp-intro | 15m | calIntroSlug / calIntroNamespace |
| TTMP | discovery | tax-monitor-pro/ttmp-discovery | ttmp-discovery | 15m | calDiscoverySlug / calDiscoveryNamespace |
| TTTMP | support | tax-monitor-pro/tttmp-support | tttmp-support | 15m | calBookingSlug / calBookingNamespace |
| TTTMP | intro | tax-monitor-pro/tttmp-intro | tttmp-intro | 15m | calIntroSlug / calIntroNamespace |
| DVLP | support | tax-monitor-pro/dvlp-support | dvlp-support | 15m | calBookingSlug / calBookingNamespace |
| DVLP | intro | tax-monitor-pro/dvlp-intro | dvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| DVLP | onboarding | tax-monitor-pro/dvlp-onboarding | dvlp-onboarding | 10m | calOnboardingSlug / calOnboardingNamespace |
| GVLP | support | tax-monitor-pro/gvlp-support | gvlp-support | 15m | calBookingSlug / calBookingNamespace |
| GVLP | intro | tax-monitor-pro/gvlp-intro | gvlp-intro | 15m | calIntroSlug / calIntroNamespace |
| WLVLP | support | tax-monitor-pro/wlvlp-support | wlvlp-support | 15m | calBookingSlug / calBookingNamespace |
| WLVLP | intro | tax-monitor-pro/wlvlp-intro | wlvlp-intro | 15m | calIntroSlug / calIntroNamespace |

18 total event types. Every app has support + intro. TTMP has discovery,
DVLP has onboarding.

---

## 4. Embed pattern (element-click popup)

All Cal embeds across the monorepo use the **element-click popup**
pattern. Inline iframes and standalone embed pages are deprecated;
do not introduce new instances.

The shared `HelpCenter` component in `@vlp/member-ui` encapsulates the
script load and click-handler wiring for the support event. Other
contexts (marketing CTAs for intro, post-onboarding CTAs, etc.) follow
the same pattern, parameterized by the corresponding PlatformConfig
fields.

The element-click pattern requires three things on the trigger element:

    data-cal-link="{slug}"
    data-cal-namespace="{namespace}"
    data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'

And one-time script init per namespace:

    Cal("init", namespace, { origin: "https://app.cal.com" });
    Cal.ns[namespace]("ui", {
      cssVarsPerTheme: {
        light: { "cal-brand": "#292929" },
        dark:  { "cal-brand": platformConfig.themeColor }
      },
      hideEventTypeDetails: false,
      layout: "month_view"
    });

The dark `cal-brand` value comes from the consuming app's
`platformConfig.themeColor`. The light value is fixed at `#292929`
across all apps for legibility.

Script load: load https://app.cal.com/embed/embed.js once per page
mount, idempotently (check `window.Cal` before re-loading).

---

## 5. Adding a new event type

1. Create the event in Cal.com following the §1 naming convention.
2. Add a row to §3's registry table.
3. Add the corresponding `cal{Purpose}Namespace` + `cal{Purpose}Slug`
   field to `PlatformConfig` in `packages/member-ui/src/types/config.ts`.
4. Set the values in the relevant app's `lib/platform-config.ts`.
5. Wire the consuming component to read from PlatformConfig (never
   hardcode the slug).

---

## 6. Drift audit

Existing inline Cal hardcodes that pre-date this canonical (per Phase 3
recon):

- apps/vlp: components/cal/, components/marketing/ContactPage.tsx,
  app/scale/components/DailyWorkflowPlanner.tsx,
  app/scale/calendar/page.tsx,
  app/(member)/client-pool/[clientId]/page.tsx
- apps/tcvlp: app/calendar/page.tsx, components/marketing/ContactPage.tsx
- apps/tmp: app/contact/page.tsx, app/calendar/page.tsx,
  components/SupportModal.tsx
- apps/tttmp: components/SupportModal.tsx
- apps/dvlp: app/support/BookCallCard.tsx, app/success/page.tsx
- apps/gvlp: app/calendar/page.tsx
- apps/wlvlp: none

These will migrate to PlatformConfig consumption as each app's Phase 3
pass touches them. New code MUST consume from PlatformConfig — adding
new hardcoded Cal slugs anywhere is drift.
