# @vlp/member-ui

Shared UI components, types, styles, and SEO utilities for the VLP platform member areas.

## Installation

Apps in `apps/*` depend on this package as a workspace dependency:

```json
{
  "dependencies": {
    "@vlp/member-ui": "*"
  }
}
```

### Peer dependencies

- `react` ^18 or ^19
- `react-dom` ^18 or ^19
- `next` >=14
- `lucide-react` >=0.300

## Usage

### Import components

```tsx
import { AppShell, KPICard, HeroCard, ContentCard, DataTable, FullCalendar } from '@vlp/member-ui'
import type { PlatformConfig } from '@vlp/member-ui'
```

### Import styles

```ts
import '@vlp/member-ui/styles'
```

### Provide platform config

Every app defines its own `PlatformConfig` and passes it to `<AppShell>`:

```tsx
const config: PlatformConfig = {
  brandName: 'Transcript Tax Monitor',
  brandAbbrev: 'TTMP',
  brandColor: '#14b8a6',
  brandSubtitle: 'Pro Dashboard',
  logoText: 'TT',
  apiBaseUrl: 'https://api.taxmonitor.pro',
  navSections: [/* ... */],
  routes: {
    home: '/',
    signIn: '/sign-in',
    signOut: '/sign-out',
    dashboard: '/dashboard',
    account: '/account',
    profile: '/profile',
    support: '/support',
  },
}

export default function MemberLayout({ children }) {
  return <AppShell config={config}>{children}</AppShell>
}
```

## Components

### `AppShell`

The top-level member area layout. Renders sidebar, topbar, and content area. Manages session state and provides it to children via context.

| Prop | Type | Description |
|------|------|-------------|
| `config` | `PlatformConfig` | Platform configuration (required) |
| `children` | `ReactNode` | Page content |

Access session data from any child via `useAppShell()`:

```tsx
const { config, session, signOut } = useAppShell()
```

### `MemberSidebar`

Collapsible sidebar navigation driven by `config.navSections`. Used internally by AppShell.

| Prop | Type | Description |
|------|------|-------------|
| `config` | `PlatformConfig` | Platform configuration (required) |
| `onSignOut` | `() => void` | Sign-out handler (required) |

### `MemberTopbar`

Top navigation bar with search, notifications, and avatar dropdown. Used internally by AppShell.

| Prop | Type | Description |
|------|------|-------------|
| `config` | `PlatformConfig` | Platform configuration (required) |
| `session` | `{ email: string \| null; avatar: string \| null }` | Session data (required) |
| `onSignOut` | `() => void` | Sign-out handler (required) |

### `KPICard`

Metric display card with label, value, and trend indicator.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Metric label (required) |
| `value` | `string` | Metric value (required) |
| `subtitle` | `string` | Subtitle / change description |
| `icon` | `ComponentType<{ className?: string }>` | Lucide icon component |
| `trend` | `'up' \| 'down' \| 'neutral'` | Trend direction (default: `'neutral'`) |
| `brandColor` | `string` | Brand color for the value text |

### `HeroCard`

Gradient hero card for welcome messages or highlighted content.

| Prop | Type | Description |
|------|------|-------------|
| `brandColor` | `string` | Brand color for gradient (required) |
| `userName` | `string` | User display name |
| `planName` | `string` | Subscription plan name |
| `tierLabel` | `string` | Tier badge label |
| `memberSince` | `string` | Formatted member-since date |
| `children` | `ReactNode` | Custom content (overrides default layout) |

### `ContentCard`

Simple card container with title header and optional action.

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card title (required) |
| `children` | `ReactNode` | Card body content (required) |
| `headerAction` | `ReactNode` | Optional action element in the header |

### `DataTable`

Responsive table with header, rows, and empty state.

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `{ key: string; label: string; className?: string }[]` | Column definitions (required) |
| `data` | `Record<string, ReactNode>[]` | Row data keyed by column key (required) |
| `emptyMessage` | `string` | Message when data is empty |

### `FullCalendar`

Interactive monthly calendar with event display and detail panel.

| Prop | Type | Description |
|------|------|-------------|
| `apiBaseUrl` | `string` | API base URL for calendar endpoints (required) |
| `brandColor` | `string` | Accent color for today marker and selection |
| `onConnectGoogle` | `() => void` | Custom Google connect handler |
| `calcomConnected` | `boolean` | Cal.com connection status |

## SEO Utilities

### `generateSitemap(domain, pages)`

Generates a Next.js `MetadataRoute.Sitemap` from a domain and page list:

```ts
// app/sitemap.ts
import { generateSitemap } from '@vlp/member-ui'

export default function sitemap() {
  return generateSitemap('taxmonitor.pro', [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/pricing', changeFrequency: 'monthly', priority: 0.8 },
  ])
}
```

### `generateRobots(domain)`

Generates a Next.js `MetadataRoute.Robots` blocking `/app/`, `/api/`, `/sign-in`, `/success`:

```ts
// app/robots.ts
import { generateRobots } from '@vlp/member-ui'

export default function robots() {
  return generateRobots('taxmonitor.pro')
}
```

### `BusinessJsonLd(props)`

Renders a `<script type="application/ld+json">` tag with Schema.org structured data:

```tsx
<BusinessJsonLd
  name="Tax Monitor Pro"
  description="Professional tax monitoring platform"
  url="https://taxmonitor.pro"
  type="WebApplication"
/>
```

### `generatePageMeta(props)`

Returns a Next.js `Metadata` object with OpenGraph and Twitter card fields:

```ts
// app/pricing/page.tsx
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Pricing - Tax Monitor Pro',
  description: 'Plans and pricing for Tax Monitor Pro',
  domain: 'taxmonitor.pro',
  path: '/pricing',
})
```

## CSS Variables

The shared stylesheet (`@vlp/member-ui/styles`) provides these design tokens:

| Variable | Default | Description |
|----------|---------|-------------|
| `--member-bg` | `#0a0e27` | Page background |
| `--member-card` | `rgba(255,255,255,0.04)` | Card background |
| `--member-card-hover` | `rgba(255,255,255,0.06)` | Card hover background |
| `--member-border` | `rgba(255,255,255,0.08)` | Border color |
| `--member-accent` | `rgba(249,115,22,0.1)` | Brand accent (override per-platform) |
| `--member-accent-strong` | `rgba(249,115,22,0.2)` | Strong accent (override per-platform) |
| `--member-hero-bg` | `#451a03` | Hero gradient start (override per-platform) |
| `--member-hero-bg-end` | `#1c0a00` | Hero gradient end (override per-platform) |

## Structure

```
src/
  components/     Shared React components
  seo/            SEO utility functions
  styles/         CSS variables and utilities
  types/          TypeScript type definitions
  index.ts        Barrel exports
```
