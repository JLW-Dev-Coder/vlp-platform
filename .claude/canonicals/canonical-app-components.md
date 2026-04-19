# canonical-app-components.md — VLP Ecosystem Component Canonical

**Status:** Authoritative
**Last updated:** 2026-04-15
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 8 apps in the vlp-platform monorepo
**Parent:** `canonical-app-blueprint.md` (see §1 hierarchy)

This canonical defines component-level patterns — the reusable pieces that live inside the content area of every page. All decisions in the parent blueprint apply here. When this file and the blueprint disagree, the blueprint wins and this file gets corrected.

---

## 1. Scope boundary

**This canonical covers:** components that live inside the content area — cards, forms, modals, toasts, empty states, loading states, tables, data displays, and the layout primitives that arrange them.

**This canonical does NOT cover:**
- Navigation shell (topbar, sidebar, mobile drawer, footer) — see `canonical-site-nav.md`
- Tokens themselves (colors, typography, spacing, radius, shadows, z-index) — see `canonical-style.md`
- Nav-specific components (mega menu, hamburger, breadcrumb) — see `canonical-site-nav.md`
- Business logic, data shapes, API contracts — see Worker contracts

All token references in this file use the names defined in `canonical-style.md`. Some referenced tokens are pending implementation (see `canonical-style.md` §13 cleanup list) — this canonical targets the intended state, not the current code.

---

## 2. Implementation status

Components below reference tokens from `canonical-style.md`. Current state of those tokens:

| Token category | Status |
|----------------|--------|
| Brand primary color | Shipped in every app's `tailwind.config.ts` |
| Surface tokens (`surface-bg`, `surface-card`, etc.) | Aliased — currently `--member-*`, rename pending |
| Border tokens (`border-subtle`, `border-default`, etc.) | Partial — `--member-border` exists; `border-hover`, `border-focus` pending |
| Text tokens (`text-primary`, `text-muted`, etc.) | Aliased — currently VLP-local `--fg`, `--muted` |
| Five additional brand tokens (`hover`, `dark`, `light`, `glow`, `text-on-primary`) | Not yet in any app |
| Shadow tokens | Not yet in shared layer |
| Animation tokens + keyframes | Not yet in shared layer |
| Z-index tokens | Not yet in shared layer |
| Semantic spacing tokens | Not yet in shared layer |

Components use the target token names. Implementation before tokens exist: use the current fallbacks listed in `canonical-style.md` §13.

---

## 3. Layout primitives

### 3.1 PageContainer

Outer wrapper for every page's content. Picks max-width by surface type.

```tsx
<PageContainer variant="marketing | app | narrow">
  {children}
</PageContainer>
```

| Variant | Max width | Tailwind class | Use |
|---------|-----------|----------------|-----|
| `marketing` | 1280px | `max-w-[1280px]` | Public pages, landing, pricing |
| `app` | 1200px | `max-w-[1200px]` | Dashboard, authenticated views |
| `narrow` | 960px | `max-w-[960px]` | Article content, forms, single-column |

Padding: `px-6 md:px-8`. Center: `mx-auto`.

### 3.2 Section

A top-level content block inside a PageContainer. Handles vertical rhythm.

```tsx
<Section spacing="default | tight | loose">
  {children}
</Section>
```

| Spacing | Padding-Y | Use |
|---------|-----------|-----|
| `default` | `py-16 md:py-24` | Marketing sections, dashboard primary blocks |
| `tight` | `py-8` | Dense UI, stacked cards |
| `loose` | `py-24 md:py-32` | Hero sections, feature showcases |

### 3.3 Grid

Responsive grid wrapper. Defaults to Tailwind's grid, collapses to single column on mobile.

```tsx
<Grid cols={1 | 2 | 3 | 4} gap="default | tight | loose">
  {children}
</Grid>
```

| Prop | Value | Resolves to |
|------|-------|-------------|
| `cols` | `1` | `grid-cols-1` |
| `cols` | `2` | `grid-cols-1 md:grid-cols-2` |
| `cols` | `3` | `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` |
| `cols` | `4` | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` |
| `gap` | `default` | `gap-6` |
| `gap` | `tight` | `gap-4` |
| `gap` | `loose` | `gap-8` |

### 3.4 Stack

Vertical flex layout for stacked elements. Replaces ad-hoc `<div class="flex flex-col gap-N">` patterns.

```tsx
<Stack gap="default | tight | loose">
  {children}
</Stack>
```

Same gap resolution as Grid. Use Stack when order and spacing matter; use Grid when items are peers in a layout.

---

## 4. Cards

### 4.1 Card (default)

Primary container for grouped content. Default for dashboard widgets, feature tiles, list items.

```tsx
<Card>
  <CardHeader title="..." description="..." />
  <CardBody>{children}</CardBody>
  <CardFooter>{actions}</CardFooter>
</Card>
```

**Tokens:**
- Background: `bg-surface-card`
- Border: `border border-border-subtle`
- Radius: `rounded-lg` (12px per canonical-style.md §5)
- Padding: `p-6` (24px)
- Shadow: `shadow-sm`

**Hover state (interactive cards only):** `hover:bg-surface-elevated hover:border-border-hover transition-colors duration-fast`

### 4.2 FeatureCard

For marketing pages. Larger padding, optional icon/illustration slot, always clickable.

```tsx
<FeatureCard href="..." icon={<Icon />} title="..." description="..." />
```

**Tokens:**
- Same as Card plus
- Padding: `p-8` (32px)
- Radius: `rounded-2xl` (24px per canonical-style.md §5)
- Optional shadow on hover: `hover:shadow-md`

### 4.3 StatCard

Numeric display for dashboards. Label + value + optional delta.

```tsx
<StatCard label="Active clients" value="1,247" delta={{ value: "+12%", trend: "up" | "down" | "flat" }} />
```

**Tokens:**
- Same base as Card
- Value typography: `text-3xl font-semibold` (app h1 per canonical-style.md §3.3)
- Label typography: `text-sm text-text-muted` (body-sm per §3.4)
- Delta colors: `up` → `text-color-success`, `down` → `text-color-error`, `flat` → `text-text-muted`

### 4.4 EmptyStateCard

Shown when a list or section has no content. Replaces naked empty divs.

```tsx
<EmptyStateCard
  icon={<Icon />}
  title="No reports yet"
  description="Generate your first report to see it here."
  action={<Button>Generate report</Button>}
/>
```

**Tokens:**
- Same base as Card
- Centered content, `text-center`
- Padding: `p-12` (48px top/bottom emphasized)
- Icon: 48px, `text-text-muted`

---

## 5. Forms

### 5.1 Input

Text input. See `canonical-style.md` §9 for the select variant (mandatory custom styling).

```tsx
<Input
  type="text | email | tel | password | url"
  label="..."
  placeholder="..."
  error="..."
  hint="..."
/>
```

**Tokens:**
- Background: `bg-surface-input`
- Border: `border border-border-default`
- Border (focus): `border-brand-primary ring-2 ring-brand-glow`
- Border (error): `border-color-error`
- Radius: `rounded-md` (8px per canonical-style.md §5)
- Height: `h-[48px]` (matches select per §9)
- Padding: `px-4 py-3`
- Font size: `text-base` (16px — iOS zoom floor)
- Disabled: `opacity-60 cursor-not-allowed`

**Phone inputs:** always use the normalization pattern from `canonical-style.md` §10.

### 5.2 Textarea

Multi-line text input.

```tsx
<Textarea label="..." placeholder="..." rows={4} error="..." />
```

**Tokens:**
- Same as Input, except
- Height: auto (based on `rows` prop)
- Min-height: `min-h-[96px]`
- Resize: `resize-y` (vertical only)

### 5.3 Select

Covered in full by `canonical-style.md` §9. Summary:
- Custom styling mandatory (no browser defaults)
- Same dimensions as Input (`h-[48px]`, `px-4 py-3`, `text-base`)
- Custom chevron via inline SVG background-image

### 5.4 Checkbox + Radio

```tsx
<Checkbox label="..." checked={...} onChange={...} />
<RadioGroup name="..." value={...} onChange={...}>
  <Radio value="a" label="..." />
  <Radio value="b" label="..." />
</RadioGroup>
```

**Tokens:**
- Unchecked: `border border-border-default bg-surface-input`
- Checked: `bg-brand-primary border-brand-primary` with check/dot icon in `text-brand-text-on-primary`
- Focus: `ring-2 ring-brand-glow`
- Size: `w-5 h-5` (20px)
- Label gap: `gap-3` (12px between control and label)

### 5.5 Button

```tsx
<Button variant="primary | secondary | ghost | danger" size="sm | md | lg" disabled loading>
  {children}
</Button>
```

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| `primary` | `bg-brand-primary hover:bg-brand-hover` | `text-brand-text-on-primary` | none |
| `secondary` | `bg-transparent hover:bg-surface-elevated` | `text-text-primary` | `border border-border-default` |
| `ghost` | `bg-transparent hover:bg-surface-elevated` | `text-text-primary` | none |
| `danger` | `bg-color-error hover:brightness-110` | `text-white` | none |

| Size | Padding | Font | Height |
|------|---------|------|--------|
| `sm` | `px-4 py-2` | `text-sm font-semibold` | `h-9` (36px) |
| `md` | `px-6 py-3` | `text-base font-semibold` | `h-12` (48px) |
| `lg` | `px-8 py-4` | `text-lg font-semibold` | `h-14` (56px) |

All sizes: `rounded-md` (8px per canonical-style.md §5).

**States:**
- Disabled: `opacity-60 cursor-not-allowed`, events suppressed
- Loading: disabled + spinner icon replaces children, label "Loading..." in `aria-label`
- Focus: `ring-2 ring-brand-glow ring-offset-2 ring-offset-surface-bg`

### 5.6 Form-level patterns

- Labels always above inputs. Never floating, never inline.
- Error messages appear directly below the input in `text-sm text-color-error mt-1`.
- Hint text (non-error) appears below the input in `text-sm text-text-muted mt-1`.
- Required fields marked with `text-color-error` asterisk after the label: `Label *`.
- Submit button full-width on mobile (`w-full md:w-auto`), aligned right on desktop.
- Forms always inside a `<Stack gap="default">` or equivalent for consistent vertical rhythm.

---

## 6. Modals + popovers

### 6.1 Modal

Blocking overlay. Use sparingly — prefer inline expansion or separate pages for complex flows.

```tsx
<Modal open={...} onClose={...} title="..." size="sm | md | lg">
  <ModalBody>{children}</ModalBody>
  <ModalFooter>{actions}</ModalFooter>
</Modal>
```

**Tokens:**
- Backdrop: `bg-surface-overlay backdrop-blur-sm` at `z-overlay` (z-index 30)
- Container: `bg-surface-popover` at `z-modal` (z-index 40)
- Radius: `rounded-xl` (16px per canonical-style.md §5)
- Shadow: `shadow-lg`
- Padding: `p-6 md:p-8`
- Max-width by size: `sm` → `max-w-md`, `md` → `max-w-lg`, `lg` → `max-w-2xl`
- Enter animation: `scale-in` + `fade-in`, `duration-base` (250ms)
- Exit animation: `fade-out`, `duration-fast` (150ms)

**Behavior:**
- Escape closes
- Click on backdrop closes
- Focus trapped inside while open
- Focus returned to trigger element on close
- Body scroll locked while open
- Respects `prefers-reduced-motion` — animations disabled in motion-safe variant only

### 6.2 Popover

Non-blocking, context-anchored overlay. Used for dropdowns, tooltips with content, contextual help.

```tsx
<Popover trigger={<Button>...</Button>} placement="top | bottom | left | right">
  {content}
</Popover>
```

**Tokens:**
- Container: `bg-surface-popover`
- Border: `border border-border-default`
- Radius: `rounded-md` (8px)
- Shadow: `shadow-md`
- Padding: `p-4`
- Z-index: `z-dropdown` (10)
- Enter: `fade-in` + small slide (`slide-up` for bottom, etc.), `duration-fast`
- Max-width: `max-w-xs` (320px) unless content demands otherwise

**Behavior:**
- Closes on click outside
- Closes on Escape
- Does NOT trap focus (non-blocking)
- Repositions if it would overflow viewport

### 6.3 Tooltip

Pure-text hover/focus hint. No interactive content. For interactive content use Popover.

```tsx
<Tooltip label="...">
  <Button>...</Button>
</Tooltip>
```

**Tokens:**
- Background: `bg-surface-popover`
- Text: `text-xs text-text-primary`
- Padding: `px-2 py-1`
- Radius: `rounded` (4px)
- Max-width: `max-w-[240px]`
- Z-index: `z-dropdown`
- Delay before showing: 500ms
- Disappears on blur/mouse leave

---

## 7. Toasts + notifications

### 7.1 Toast

Transient feedback. Auto-dismisses. Stacks in a corner.

```tsx
toast.success("Settings saved")
toast.error("Failed to save")
toast.info("New feature available")
toast.warning("Session expiring soon")
```

**Tokens:**
- Background: `bg-surface-elevated`
- Left accent bar (4px) colored by variant:
  - `success` → `bg-color-success`
  - `error` → `bg-color-error`
  - `info` → `bg-color-info`
  - `warning` → `bg-color-warning`
- Radius: `rounded-md`
- Padding: `p-4`
- Shadow: `shadow-md`
- Z-index: `z-toast` (50)
- Position: `fixed bottom-6 right-6` on desktop, `fixed bottom-6 left-6 right-6` on mobile
- Max-width: `max-w-sm` on desktop

**Behavior:**
- Auto-dismiss after 5 seconds (success/info) or 8 seconds (error/warning)
- Manual dismiss via X button
- Stack: new toasts push older ones up; max 3 visible, older dismissed
- Enter: `slide-up` + `fade-in`, `duration-base`
- Exit: `fade-out`, `duration-fast`
- Respects `prefers-reduced-motion`

### 7.2 Inline banner

Persistent page-level message. Not auto-dismissing.

```tsx
<Banner variant="info | warning | error | success" onClose={...}>
  {content}
</Banner>
```

**Tokens:**
- Background: tinted by variant — `bg-color-{variant}/10` (10% alpha tint)
- Border: `border border-color-{variant}/30`
- Text: `text-text-primary`
- Icon: `text-color-{variant}`
- Radius: `rounded-md`
- Padding: `p-4`
- Full-width by default
- Optional dismiss X button in top-right

---

## 8. Loading + skeleton states

### 8.1 Spinner

Indeterminate loading indicator.

```tsx
<Spinner size="sm | md | lg" />
```

| Size | Dimensions |
|------|-----------|
| `sm` | `w-4 h-4` (16px) |
| `md` | `w-6 h-6` (24px) |
| `lg` | `w-10 h-10` (40px) |

**Tokens:**
- Color: `text-brand-primary` by default; override with `text-text-muted` for neutral contexts
- Animation: continuous rotation, `duration-slow` (400ms) linear infinite

### 8.2 Skeleton

Placeholder shown while content loads. Matches the shape of the content it replaces.

```tsx
<Skeleton variant="text | card | avatar" />
<SkeletonText lines={3} />
<SkeletonCard />
```

**Tokens:**
- Background: `bg-surface-elevated`
- Radius: matches the component being replaced
- Animation: `pulse-subtle`, `duration-slow` infinite
- Text skeleton: `h-4` per line, `gap-2` between lines, last line `w-3/4`
- Avatar: `rounded-full`, sized to the avatar it replaces
- Card: same dimensions as the actual Card component

### 8.3 Full-page loading

When an entire route is loading.

```tsx
<PageLoader />
```

- Centered Spinner size `lg`
- Optional label below: `text-sm text-text-muted`
- Centered in viewport minus topbar height
- Never shown for > 2 seconds — if loading exceeds that, switch to Skeleton of target layout

---

## 9. Empty states

Shown when a list, table, or section has no content to display. Always actionable when possible.

### 9.1 Default empty state

Use `EmptyStateCard` (see §4.4) for list/grid empty states.

### 9.2 Empty table

When a table has no rows.

```tsx
<Table>
  <TableEmpty
    title="No reports yet"
    description="..."
    action={<Button>Generate</Button>}
  />
</Table>
```

- Spans all columns via `colSpan`
- Padding: `py-16`
- Centered content
- Same icon + title + description + action pattern as EmptyStateCard

### 9.3 Error state (distinct from empty)

When data failed to load. Use EmptyStateCard with error variant.

```tsx
<EmptyStateCard
  variant="error"
  icon={<AlertIcon />}
  title="Couldn't load reports"
  description="Something went wrong. Try refreshing."
  action={<Button>Retry</Button>}
/>
```

- Icon color: `text-color-error`
- Title color: `text-text-primary` (not error-colored — keeps severity proportionate)
- Description: `text-text-muted`

---

## 10. Tables + data display

### 10.1 Table

Primary pattern for structured data.

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Column</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Value</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

**Tokens:**
- Table background: `bg-surface-card`
- Header background: `bg-surface-elevated`
- Header text: `text-xs uppercase tracking-wider text-text-muted font-semibold`
- Row divider: `border-b border-border-subtle`
- Row hover: `hover:bg-surface-elevated transition-colors duration-fast`
- Cell padding: `px-4 py-3`
- Radius (outer): `rounded-lg` (12px) with `overflow-hidden`

**Behavior:**
- Horizontal scroll on mobile: wrap in `<div className="overflow-x-auto">`
- Sortable columns: clickable header with sort arrow icon
- Selected row: `bg-surface-elevated`

### 10.2 DataList

Key-value pairs for display (not editing). Used for summaries, metadata sections.

```tsx
<DataList>
  <DataListItem label="Client" value="Acme Corp" />
  <DataListItem label="Status" value={<Badge variant="success">Active</Badge>} />
</DataList>
```

**Tokens:**
- Layout: two-column on desktop (`grid-cols-[1fr_2fr]`), stacked on mobile
- Label: `text-sm text-text-muted`
- Value: `text-base text-text-primary`
- Gap between items: `gap-4`

### 10.3 Badge

Small pill for status, category, or count.

```tsx
<Badge variant="default | success | warning | error | info | brand">
  {label}
</Badge>
```

**Tokens:**
- Padding: `px-2 py-1`
- Radius: `rounded-full`
- Font: `text-xs font-medium`
- Variants:
  - `default` → `bg-surface-elevated text-text-primary`
  - `success` → `bg-color-success/15 text-color-success`
  - `warning` → `bg-color-warning/15 text-color-warning`
  - `error` → `bg-color-error/15 text-color-error`
  - `info` → `bg-color-info/15 text-color-info`
  - `brand` → `bg-brand-light text-brand-primary`

---

## 11. Conversion + lead capture

### 11.1 LeadChatbot

Shared lead-capture chatbot for marketing pages. Config-driven via `PlatformConfig.chatbot`. Opt-in per app (no chatbot renders if `config.chatbot?.enabled !== true`).

```tsx
<LeadChatbot config={platformConfig} />
```

Mount in each app's `(marketing)/layout.tsx`, alongside `<CookieConsent />`. Positions fixed bottom-right; CookieConsent is bottom-left — no spatial conflict.

**Config:** see `ChatbotConfig` in `packages/member-ui/src/types/config.ts`. Required fields: `enabled`, `nudge`, `header`, `welcome`, `questions` (exactly 3 in v1), `emailFooterLabel`, `humanPath`. Optional: `aiEnabled` (Phase 2 scaffold — renders nothing in v1), `socialProof`.

**States (state machine):**
- `nudge` — launcher pill with dismissible teaser (default first load)
- `bubble` — bare round launcher (post-dismiss, persisted to localStorage)
- `home` — expanded panel, welcome + 3 quick-action chips + human path
- `question` — expanded panel, shows typed conversation for one question
- `human` — expanded panel, book-call + send-message options

**Humanization behaviors:**
- Typing indicator (three pulsing dots) before each bot bubble
- Typing duration = clamp(400 + chars*25, 500, 1800) ms per bubble
- 250ms pause between consecutive bubbles
- All animations wrapped in `motion-safe:` variants; reduced-motion users see fixed 300ms typing + instant bubble appearance

**Tokens:**
- Surface: `bg-surface-popover`
- Border: `border border-subtle`
- Text: `text-text-primary`, `text-text-muted`, `text-text-tertiary`
- Radius: `rounded-lg` (panel), `rounded-md` (bubbles, chips, CTAs)
- Shadow: `shadow-md`
- Brand color: from `config.brandColor` via inline style (never hardcoded)
- Z-index: `z-overlay` (same layer as CookieConsent; no spatial overlap)

**Cal embed:** element-click popup pattern per canonical-cal-events.md §4. The `calTarget` field in `humanPath.bookCall` maps to PlatformConfig's `calIntroSlug` / `calDiscoverySlug` / `calBookingSlug` (with `calIntroSlug` fallback if the named target is undefined).

**Lead submission:** all submit paths POST to `${config.apiBaseUrl}/v1/leads/chatbot` (anonymous). Payload schema defined in contract `apps/worker/contracts/shared/shared.leads.chatbot.v1.json`. Respects `applyAnalyticsConsent` — does not attach `referrer` or `user_agent` unless analytics is opted-in in cookie prefs.

**Accessibility:**
- Launcher: `<button aria-label="Open chat">`
- Panel: `role="dialog"` with `aria-label` from `config.chatbot.header.title`
- Escape minimizes panel → bubble state

**Adoption:** see Shared Component Rollout table in `canonical-feature-matrix.md`.

---

## 12. Analytics

### 12.1 PostHogPageview

Client-side SPA pageview tracker for marketing (and optionally member) layouts. Captures a `$pageview` event to PostHog on every pathname change.

```tsx
import { Suspense } from 'react'
import { PostHogPageview } from '@vlp/member-ui'

<Suspense fallback={null}>
  <PostHogPageview />
</Suspense>
```

**Requires:** `config.posthog` on PlatformConfig. SDK is lazy-loaded via `applyAnalyticsConsent` — component is a no-op for users who haven't opted in to analytics cookies.

**Mount location:** marketing layout (and member layout if analytics covers authenticated pages). Adjacent to `<CookieConsent />`.

**Props:** none. Reads singleton client from `lib/analytics`.

**Output:** returns `null`. No DOM.

**Autocapture:** PostHog captures clicks, form submits, page performance automatically. Custom events can be added later via `getPostHogClient().capture('event_name', { ... })`.

**Next 15 note:** `usePathname` / `useSearchParams` require a Suspense boundary. Wrap the component in `<Suspense fallback={null}>` at the mount site.

---

## 13. Self-check

Before shipping any component, verify:

- [ ] Tokens reference the names in `canonical-style.md` — no raw hex, no raw px except where blueprint permits
- [ ] Hover/focus states use documented tokens (`border-hover`, `surface-elevated`, `shadow-focus`)
- [ ] Interactive elements have visible focus rings using `ring-brand-glow`
- [ ] Disabled state uses `opacity-60 cursor-not-allowed`
- [ ] Loading state uses Spinner or Skeleton, never a blank container
- [ ] Empty state uses EmptyStateCard or TableEmpty, never a bare "No results"
- [ ] Error state distinct from empty state
- [ ] Touch targets ≥ 44px on mobile (inputs and buttons default to `h-12` which satisfies this)
- [ ] Keyboard navigable — Tab reaches all interactive elements, Escape closes overlays
- [ ] Respects `prefers-reduced-motion` for all animations
- [ ] Modal/Popover use correct z-index tokens (`z-overlay`, `z-modal`, `z-dropdown`, `z-toast`)
- [ ] Form errors appear below their inputs, not as toasts or modals
- [ ] Radius matches component defaults: button = `md`, card = `lg`, modal = `xl`, badge = `full`

---

## 14. Relationship to other canonicals

| Canonical | What lives there |
|-----------|-----------------|
| `canonical-app-blueprint.md` | Parent. Token categories. All apply here. |
| `canonical-style.md` | Token values and the mandatory §9 (dropdown) and §10 (phone) patterns. Referenced throughout. |
| `canonical-site-nav.md` | Nav-specific components (topbar, sidebar, drawer, footer). |
| `canonical-feature-matrix.md` | Per-app feature inventory. Drives which dashboard widgets a platform uses. |

When this file conflicts with the blueprint, the blueprint wins. When this file conflicts with `canonical-style.md`, style wins for token definitions and this file wins for component-level composition.

---

## 15. Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-15 | Created file to resolve forward references from site-nav §6 and style §12 | Component-level specs needed a home; blueprint §5 planned it |
| 2026-04-15 | Target-state tokens, not current reality | Matches style canonical approach; avoids 4+ rewrites as cleanup items land |
| 2026-04-15 | Components framed as React props, not HTML/CSS | Matches shipped reality (Next.js + React across all 8 apps) |
| 2026-04-15 | Mandatory self-check in §11 for every component before shipping | Consistent with style canonical §11 pattern |
| 2026-04-16 | Modal/Popover/Tooltip tokens updated to `surface-popover` + `surface-overlay` | Old spec referenced `bg-surface-elevated` for floating containers — a 6% alpha token that produces transparent panels over page content. New tokens added to canonical-style.md §2.2 solve the class of bug. |
| 2026-04-18 | Added §11 LeadChatbot component entry | Ships on TTMP; opt-in per app via PlatformConfig.chatbot. Documents Phase 2 aiEnabled scaffold as deliberately inert in v1. |
| 2026-04-18 | Added §12 Analytics → PostHogPageview | PostHog wired as shared analytics provider behind cookie consent (TTMP first adopter). SDK lazy-loads only for opted-in users. Self-check renumbered from §12 → §13; subsequent sections renumbered accordingly. |

Append-only. Do not rewrite prior entries.
