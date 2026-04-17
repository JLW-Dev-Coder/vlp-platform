# Canonical: SEO Infrastructure

Last updated: 2026-04-16

## Purpose

All 8 VLP ecosystem apps share a common SEO infrastructure exposed via `@vlp/member-ui`. This canonical documents the shared helpers, integration pattern, and the per-app surface-area required.

## Shared Helpers

`@vlp/member-ui` exports four SEO-related utilities, all sourced from `packages/member-ui/src/seo/`:

### `generateSitemap(domain: string, pages: SitemapPage[])`

Returns a Next.js-compatible `MetadataRoute.Sitemap` array consumed by each app's `app/sitemap.ts`. Next.js then serves it at `/sitemap.xml`.

Input shape (matches `packages/member-ui/src/seo/sitemap.ts`):

```ts
interface SitemapPage {
  path: string                                                  // e.g., "/features"
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'    // REQUIRED
  priority: number                                              // REQUIRED, 0.0–1.0
  lastModified?: Date                                           // defaults to new Date() at request time
}
```

Each entry is emitted as `{ url: https://${domain}${page.path}, lastModified, changeFrequency, priority }`.

### `generateRobots(domain: string)`

Returns a Next.js-compatible `MetadataRoute.Robots` object consumed by each app's `app/robots.ts`.

Default rules (hard-coded in the helper):

```ts
{
  rules: [{
    userAgent: '*',
    allow: '/',
    disallow: ['/app/', '/api/', '/sign-in', '/success'],
  }],
  sitemap: `https://${domain}/sitemap.xml`,
}
```

If an app needs different crawler rules, this helper does not support per-app overrides today — either extend the helper, or stop using it for that app.

### `BusinessJsonLd` (React component)

Renders a `<script type="application/ld+json">` tag with Schema.org structured data. Intended for marketing layouts / root layouts.

Props (matches `packages/member-ui/src/seo/json-ld.tsx`):

```ts
interface BusinessJsonLdProps {
  name: string                                     // Business display name
  description: string                              // REQUIRED
  url: string                                      // Canonical root URL
  type:                                            // REQUIRED, Schema.org @type
    | 'ProfessionalService'
    | 'WebApplication'
    | 'SoftwareApplication'
    | 'Product'
    | 'Organization'
  logo?: string                                    // Absolute URL to logo image
  address?: {                                      // Emitted as Schema.org PostalAddress
    street: string
    city: string
    state: string
    zip: string
  }
  priceRange?: string                              // e.g., "$$"
}
```

### `generatePageMeta(props)`

Returns a Next.js `Metadata` object populated with title, description, canonical URL, OpenGraph, and Twitter card fields. Use in per-page `export const metadata = generatePageMeta({ ... })`.

Props (matches `packages/member-ui/src/seo/metadata.ts`):

```ts
interface PageMetaProps {
  title: string
  description: string
  domain: string                                   // e.g., "virtuallaunch.pro"
  path: string                                     // e.g., "/pricing"
  ogImage?: string                                 // Absolute URL
}
```

Canonical URL is derived as `https://${domain}${path}`. `openGraph.siteName` is set to `title` (not the brand name), and `twitter.card` defaults to `summary_large_image`.

## Per-App Integration Pattern

Every app MUST have:

1. `app/sitemap.ts` — either consuming `generateSitemap` or building `MetadataRoute.Sitemap` directly (see WLVLP exception below)
2. `app/robots.ts` consuming `generateRobots`

Apps SHOULD additionally:

3. Use `BusinessJsonLd` in the marketing or root layout for structured-data surfaces
4. Use `generatePageMeta` on individual marketing pages that benefit from canonical + OG metadata

### Sitemap Example (VLP)

```ts
// apps/vlp/app/sitemap.ts
import { generateSitemap } from '@vlp/member-ui'

export default function sitemap() {
  return generateSitemap('virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/features', changeFrequency: 'monthly', priority: 0.8 },
    // ... more pages
  ])
}
```

### Sitemap Example (TCVLP — static export)

```ts
// apps/tcvlp/app/sitemap.ts
import { generateSitemap } from '@vlp/member-ui'

export const dynamic = 'force-static'

export default function sitemap() {
  return generateSitemap('taxclaim.virtuallaunch.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/demo', changeFrequency: 'monthly', priority: 0.9 },
    // ... more pages
  ])
}
```

TCVLP requires `export const dynamic = 'force-static'` because it's built as a static export; without this, the sitemap route fails the build. The same applies to TMP, GVLP, and WLVLP (the other static-export apps).

### Robots Example

```ts
// apps/vlp/app/robots.ts
import { generateRobots } from '@vlp/member-ui'

export default function robots() {
  return generateRobots('virtuallaunch.pro')
}
```

For static-export apps (TCVLP, TMP, GVLP, WLVLP) add `export const dynamic = 'force-static'`.

### Exception: WLVLP sitemap

WLVLP (`apps/wlvlp/app/sitemap.ts`) does NOT use `generateSitemap`. It builds `MetadataRoute.Sitemap` directly because it needs to emit one entry per template in `TEMPLATES` (211+ `/sites/[slug]` URLs). This is high-value SEO and is intentional — don't convert it to `generateSitemap` unless the helper is extended to accept a dynamic page list. WLVLP's `robots.ts` still uses `generateRobots`.

## Adding a New Page to the Sitemap

When adding a new route to an app:

1. Add the route's path to the app's `sitemap.ts` page list
2. Choose a `changeFrequency` based on how often the page content changes
3. Choose a `priority` relative to the homepage (1.0) — most marketing pages sit at 0.7–0.9

Do NOT add dynamic route segments (e.g., `/profile/[id]`) to the sitemap unless there's a mechanism to enumerate the actual IDs (as WLVLP does for `/sites/[slug]`). The sitemap should only list concrete URLs.

## Canonical Domain Registry

Sourced from the Platform Registry in the monorepo root `.claude/CLAUDE.md`. If this table and the root CLAUDE.md diverge, the root CLAUDE.md wins.

| App | brandAbbrev | Canonical domain |
|-----|-------------|------------------|
| VLP | VLP | virtuallaunch.pro |
| TMP | TMP | taxmonitor.pro |
| TTMP | TTMP | transcript.taxmonitor.pro |
| TTTMP | TTTMP | taxtools.taxmonitor.pro |
| DVLP | DVLP | developers.virtuallaunch.pro |
| GVLP | GVLP | games.virtuallaunch.pro |
| TCVLP | TCVLP | taxclaim.virtuallaunch.pro |
| WLVLP | WLVLP | websitelotto.virtuallaunch.pro |

If any domain changes, the new value propagates to sitemap + robots via the single `generateSitemap`/`generateRobots` call — no other code changes needed.

## Adoption Status (as of 2026-04-16)

**Per-app sitemap:** 7 of 8 apps use `generateSitemap` (VLP, TMP, TTMP, TTTMP, DVLP, GVLP, TCVLP). WLVLP builds `MetadataRoute.Sitemap` directly to include dynamic `/sites/[slug]` template pages.

**Per-app robots:** All 8 apps use `generateRobots` in `app/robots.ts`.

**BusinessJsonLd:** All 8 apps wire it in. Locations:
- VLP — `apps/vlp/app/(marketing)/layout.tsx`
- TMP — `apps/tmp/app/layout.tsx`
- TTMP — `apps/ttmp/app/(marketing)/layout.tsx`
- TTTMP — `apps/tttmp/app/layout.tsx`
- DVLP — `apps/dvlp/app/layout.tsx`
- GVLP — `apps/gvlp/app/layout.tsx`
- TCVLP — `apps/tcvlp/app/layout.tsx`
- WLVLP — `apps/wlvlp/app/layout.tsx`

**generatePageMeta:** Currently used by 5 of 8 apps. Locations:
- VLP — `apps/vlp/app/(marketing)/page.tsx`, `apps/vlp/app/(marketing)/pricing/page.tsx`
- TMP — `apps/tmp/app/page.tsx`
- TTMP — `apps/ttmp/app/(marketing)/page.tsx`
- TTTMP — `apps/tttmp/app/page.tsx`
- DVLP — `apps/dvlp/app/page.tsx`

Not yet adopted by GVLP, TCVLP, WLVLP. These apps rely on hand-written `export const metadata = { ... }` or inherit from the root layout; converting them to `generatePageMeta` is a straightforward follow-up.

## Decision Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-04-16 | Documented SEO infrastructure as canonical | Shared helpers already shipped in @vlp/member-ui and consumed by all 8 apps, but undocumented. This canonical brings the pattern into the canonical registry so future apps, contributors, and cleanups reference a single source of truth. No code changes — documentation only. |
