# canonical-style.md — VLP Ecosystem Style Canonical

**Status:** Authoritative
**Last updated:** 2026-04-15
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 8 apps in the vlp-platform monorepo
**Parent:** `canonical-app-blueprint.md` (see §1 hierarchy)

This canonical defines design tokens, component patterns, and style conventions. All decisions in the parent blueprint apply here. When this file and the blueprint disagree, the blueprint wins and this file gets corrected.

---

## 1. Token architecture

Tokens live in a two-layer system. Both layers are authoritative within their scope.

### 1.1 Shared layer — `packages/member-ui`

**Location:**
- TypeScript tokens: `packages/member-ui/tailwind.config.ts`
- CSS variables: `packages/member-ui/src/styles/tokens.css`
- Import from apps via: `@import '@vlp/member-ui/styles';`

**Contains:** Structural tokens that are identical across all 8 apps — surface hierarchy, border states, typography scale, spacing semantics, radius scale, shadow elevation, animations, z-index. These values do NOT vary by platform.

**Consumer contract:** Every app's `app/globals.css` MUST `@import '@vlp/member-ui/styles'` as its first line. Apps that don't import shared tokens are drift.

### 1.2 Per-app layer — `apps/<app>/`

**Location:**
- TypeScript tokens: `apps/<app>/tailwind.config.ts`
- CSS variables: `apps/<app>/app/globals.css`

**Contains:** Brand overrides (the six tokens from blueprint §4.5) and any platform-specific token overrides documented in the app's CLAUDE.md "Theming Divergences" section.

**Override rule:** Per-app layer MAY override any shared variable. Undocumented overrides are drift.

### 1.3 What does NOT belong in either layer

- Raw hex values in component code (use token references)
- CSS Modules for tokenable values (use Tailwind classes or CSS variables)
- External CSS frameworks (no Bootstrap, no Material UI, no Shadcn-full imports)
- Font CDN `<link>` tags (use `next/font` per blueprint §4.8)

---

## 2. Color tokens

### 2.1 Brand tokens (per-app layer, blueprint §4.5)

Every app defines exactly these six brand tokens in its `tailwind.config.ts`:

```typescript
// apps/<app>/tailwind.config.ts
theme: {
  extend: {
    colors: {
      brand: {
        primary: '<hex>',             // blueprint §4.5
        hover: '<hex>',
        dark: '<hex>',
        light: '<hex>',
        glow: '<hex>',                // used for focus rings + emphasis
        'text-on-primary': '<hex>',   // foreground on brand.primary surfaces
      },
    },
  },
}
```

**Authoritative values live in each app's `tailwind.config.ts`.** Hex values are NOT duplicated here per blueprint §4.6. Root `CLAUDE.md` Platform Registry holds the human-readable index.

### 2.2 Surface tokens (shared layer, blueprint §4.15)

Four-level dark-mode surface hierarchy. Defined as CSS variables in `packages/member-ui/src/styles/tokens.css`:

| Token | Current value | Usage |
|-------|--------------|-------|
| `--surface-bg` | `#0a0e27` (currently `--member-bg`) | Page background, deepest |
| `--surface-card` | `rgba(255, 255, 255, 0.04)` (currently `--member-card`) | Cards, panels, primary container |
| `--surface-elevated` | `rgba(255, 255, 255, 0.06)` (currently `--member-card-hover`) | Modals, popovers, dropdowns |
| `--surface-input` | `rgba(255, 255, 255, 0.04)` | Form fields, code blocks, inset surfaces |

**Tailwind exposure** (in `packages/member-ui/tailwind.config.ts`):
```typescript
colors: {
  surface: {
    bg: 'var(--surface-bg)',
    card: 'var(--surface-card)',
    elevated: 'var(--surface-elevated)',
    input: 'var(--surface-input)',
  },
}
```

**Current drift (flagged for cleanup):** The shared layer currently uses `--member-*` naming (`--member-bg`, `--member-card`, `--member-card-hover`, `--member-border`). These will be aliased to new `--surface-*` names during cleanup, then `--member-*` names retired. See §10 cleanup list.

### 2.3 Border tokens (shared layer, blueprint §4.16)

Four-state border system:

| Token | Current value | Usage |
|-------|--------------|-------|
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` (currently `--member-border`) | Dividers, section breaks |
| `--border-default` | `rgba(255, 255, 255, 0.12)` (currently `--line`, VLP-local) | Default component borders |
| `--border-hover` | `rgba(255, 255, 255, 0.20)` | Hover state for interactive elements |
| `--border-focus` | `var(--brand-glow)` | Focused inputs, selected cards — references brand token |

### 2.4 Text tokens (shared layer)

| Token | Current value | Usage |
|-------|--------------|-------|
| `--text-primary` | `rgba(255, 255, 255, 0.92)` (currently `--fg`, VLP-local) | Body text, headings |
| `--text-muted` | `rgba(255, 255, 255, 0.66)` (currently `--muted`, VLP-local) | Secondary text, captions |
| `--text-disabled` | `rgba(255, 255, 255, 0.40)` | Disabled form text, inactive states |
| `--text-on-brand` | `var(--brand-text-on-primary)` | Foreground on brand surfaces — references brand token |

### 2.5 Semantic tokens (shared layer)

For status colors, not brand:

| Token | Current value | Usage |
|-------|--------------|-------|
| `--color-success` | `#22c55e` | Success states, positive feedback |
| `--color-warning` | `#f59e0b` | Warnings, non-critical alerts |
| `--color-error` | `#ef4444` | Errors, destructive actions |
| `--color-info` | `#3b82f6` | Info banners, neutral emphasis |

**Note:** These semantic colors must not collide with any app's brand color. When a platform's `brand.primary` matches a semantic color (e.g. GVLP = green, collision with success), the app's CLAUDE.md "Theming Divergences" must document the collision and the app must use `brand.primary` for brand contexts and `--color-success` for status contexts — never interchangeably.

---

## 3. Typography (blueprint §4.8)

### 3.1 Font families

Three families per blueprint:

| Family | CSS variable | Tailwind class | Usage |
|--------|-------------|----------------|-------|
| **Sora** | `--font-sora` | `font-sora` | Display, headings |
| **DM Sans** | `--font-dm-sans` | `font-sans` (default) | Body, UI |
| **IBM Plex Mono** | `--font-plex-mono` | `font-mono` | Code, data, numeric tables |

**Loading:** Apps load via `next/font/google` in `app/layout.tsx`, inject as CSS variables, reference through Tailwind. CDN `<link>` tags are forbidden.

**Current drift (flagged for cleanup):** VLP currently ships Raleway (via `--font-raleway`), not Sora + DM Sans + IBM Plex Mono. This is a scheduled font migration. Until migration lands, treat blueprint §4.8 as the target state, not the current reality. See §10 cleanup list.

### 3.2 Type scale — Marketing (blueprint §4.10)

Used on public pages, landing, pricing, long-form content:

| Token | Size | Line height | Weight | Tailwind |
|-------|------|-------------|--------|----------|
| `display-xl` | 4.5rem (72px) | 1.05 | 700 | `text-[4.5rem]` |
| `display-lg` | 3.5rem (56px) | 1.1 | 700 | `text-[3.5rem]` |
| `h1` | 3rem (48px) | 1.15 | 700 | `text-5xl` |
| `h2` | 2.25rem (36px) | 1.2 | 600 | `text-4xl` |
| `h3` | 1.875rem (30px) | 1.25 | 600 | `text-3xl` |
| `h4` | 1.5rem (24px) | 1.3 | 600 | `text-2xl` |

### 3.3 Type scale — App (blueprint §4.10)

Used on authenticated dashboards. Smaller than marketing to maximize information density:

| Token | Size | Line height | Weight | Tailwind |
|-------|------|-------------|--------|----------|
| `h1` | 1.875rem (30px) | 1.25 | 600 | `text-3xl` |
| `h2` | 1.5rem (24px) | 1.3 | 600 | `text-2xl` |
| `h3` | 1.25rem (20px) | 1.35 | 600 | `text-xl` |
| `h4` | 1.125rem (18px) | 1.4 | 500 | `text-lg` |
| `h5` | 1rem (16px) | 1.5 | 500 | `text-base` |

### 3.4 Body + utility sizes (both scales)

| Token | Size | Tailwind | Usage |
|-------|------|----------|-------|
| `body-lg` | 1.125rem (18px) | `text-lg` | Lead paragraphs, hero subcopy |
| `body` | 1rem (16px) | `text-base` | Default body text (also iOS zoom floor) |
| `body-sm` | 0.875rem (14px) | `text-sm` | Secondary text, metadata |
| `caption` | 0.75rem (12px) | `text-xs` | Badges, microcopy, table headers |

### 3.5 Weights

| Weight | Tailwind | Usage |
|--------|----------|-------|
| 400 | `font-normal` | Body default |
| 500 | `font-medium` | Emphasized body, app h4/h5 |
| 600 | `font-semibold` | Headings, button labels |
| 700 | `font-bold` | Marketing display sizes only |

Letter-spacing `tracking-tight` applied to display sizes and h1 only.

---

## 4. Spacing (blueprint §4.11)

### 4.1 Base scale

Tailwind's default 4px-base spacing scale is preserved unchanged. Use raw values (`p-4`, `gap-6`, `mt-12`) for component-internal spacing.

### 4.2 Semantic spacing tokens (shared layer)

For layout primitives, use semantic tokens. These live in `packages/member-ui/tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `space-section` | 6rem (96px) | Vertical spacing between top-level page sections |
| `space-block` | 3rem (48px) | Spacing between content blocks within a section |
| `space-inline` | 1.5rem (24px) | Spacing between sibling elements in a row/flex |
| `space-tight` | 0.5rem (8px) | Tight spacing within dense UI (chips, badges) |

**Rule:** Use semantic tokens for layout. Use raw values for one-off adjustments inside components.

### 4.3 Common component spacing

| Element | Tailwind | Value |
|---------|----------|-------|
| Card padding | `p-6` | 24px |
| Button padding (default) | `px-6 py-3` | 24px / 12px |
| Button padding (small) | `px-4 py-2` | 16px / 8px |
| Input padding | `px-4 py-3` | 16px / 12px |
| Badge padding | `px-2 py-1` | 8px / 4px |
| Section padding (page) | `py-16 md:py-24` | 64px / 96px |

---

## 5. Radius (blueprint §4.12)

Six steps plus pill. Defined in `packages/member-ui/tailwind.config.ts`:

| Token | Value | Tailwind | Component default |
|-------|-------|----------|-------------------|
| `rounded-none` | 0 | `rounded-none` | — |
| `rounded-sm` | 0.25rem (4px) | `rounded-sm` | Inline elements, tags |
| `rounded-md` | 0.5rem (8px) | `rounded-md` | Buttons, inputs, selects |
| `rounded-lg` | 0.75rem (12px) | `rounded-lg` | Cards, panels |
| `rounded-xl` | 1rem (16px) | `rounded-xl` | Modals, large surfaces |
| `rounded-2xl` | 1.5rem (24px) | `rounded-2xl` | Hero blocks, feature cards |
| `rounded-full` | 9999px | `rounded-full` | Avatars, pills, badges |

Component defaults (button = `md`, card = `lg`, modal = `xl`, badge = `full`) are mandatory for new work.

---

## 6. Shadows (blueprint §4.17)

Three elevation tiers plus two effect shadows. Defined in `packages/member-ui/tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-sm` | `0 1px 2px 0 rgba(0,0,0,0.25)` | Cards, subtle lift |
| `shadow-md` | `0 4px 12px 0 rgba(0,0,0,0.35)` | Popovers, dropdowns |
| `shadow-lg` | `0 10px 30px 0 rgba(0,0,0,0.50)` | Modals, high-elevation overlays |
| `shadow-focus` | `0 0 0 3px var(--brand-glow)` | Focus ring — uses brand token |
| `shadow-brand` | `0 8px 24px 0 var(--brand-glow)` | Brand emphasis glow — uses brand token |

**Rule:** Do not invent new shadow values. If a component needs emphasis beyond these five, use a border or glow token combination instead.

---

## 7. Animations (blueprint §4.18)

### 7.1 Keyframes

Six named keyframes, defined in `packages/member-ui/tailwind.config.ts`:

| Keyframe | Purpose |
|----------|---------|
| `fade-in` | Element appearance |
| `fade-out` | Element removal |
| `slide-up` | Enter from below (mobile drawers, toasts) |
| `slide-down` | Enter from above (dropdowns, banners) |
| `scale-in` | Modal enter, popover enter |
| `pulse-subtle` | Attention without alarm (loading, notification dot) |

### 7.2 Timing tokens

| Token | Value | Usage |
|-------|-------|-------|
| `duration-fast` | 150ms | Hover states, micro-transitions |
| `duration-base` | 250ms | Default for most enter/exit |
| `duration-slow` | 400ms | Modals, drawers, full-page transitions |

### 7.3 Easing

- `ease-out` — element entering
- `ease-in` — element leaving
- `ease-in-out` — neutral or reversing transitions

### 7.4 Reduced motion

Required for new work. Every new animation MUST be wrapped in `motion-safe:` Tailwind variant or inside `@media (prefers-reduced-motion: no-preference)`. Existing animations are grandfathered per blueprint §4.9 — bring into compliance when the containing component is touched.

---

## 8. Z-index (blueprint §4.19)

Six named tokens, defined in `packages/member-ui/tailwind.config.ts`:

| Token | Value | Usage |
|-------|-------|-------|
| `z-base` | 0 | Default |
| `z-dropdown` | 10 | Dropdowns, select menus, avatar menu |
| `z-sticky` | 20 | Sticky headers, topbars |
| `z-overlay` | 30 | Modal backdrops, drawer backdrops |
| `z-modal` | 40 | Modal content, drawer content |
| `z-toast` | 50 | Toasts, notifications |

Raw `z-[N]` arbitrary values are drift.

---

## 9. Dropdown / Select Styling (mandatory)

All `<select>` elements must be styled to match the form's design system. Never use plain browser-default dropdowns.

Required properties:
- `appearance: none` — remove browser chrome
- Background matching the form's input fields (e.g. `bg-surface-input` or `bg-[var(--surface-input)]`)
- Border and border-radius matching adjacent text inputs
- Custom dropdown arrow via CSS `background-image` (inline SVG chevron) or a positioned pseudo-element
- Minimum padding: `py-3 px-4` (12px vertical, 16px horizontal)
- Minimum `text-base` (16px) — never smaller than body text (prevents iOS zoom)
- Focus state: brand-color border + subtle ring (`focus:ring-2 focus:ring-brand-glow`)
- Consistent height with adjacent text inputs (`h-[48px]` or matching)
- Disabled state: `opacity-60 cursor-not-allowed`

Tailwind example:
```html
className="appearance-none bg-surface-input border border-border-default rounded-md px-4 py-3
text-base focus:border-brand-primary focus:ring-2 focus:ring-brand-glow
bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 viewBox=%220 0 12 8%22 fill=%22none%22><path d=%22M1 1.5L6 6.5L11 1.5%22 stroke=%22currentColor%22 stroke-width=%221.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_12px_center]"
```

**Changes from prior version:** `{brand}` placeholder replaced with `brand-primary` / `brand-glow` token references. `bg-white` replaced with `bg-surface-input`. Truncated SVG data URI replaced with complete chevron SVG.

---

## 10. Phone Number Input Normalization (mandatory)

All phone number inputs across every platform must normalize on blur:

**Behavior:**
- Accept any common format during typing: `1234567890`, `123-456-7890`, `(123) 456-7890`, `+1 123 456 7890`
- Allow only digits, spaces, hyphens, parentheses, and `+` during input
- On blur: format as `(XXX) XXX-XXXX` for 10-digit US numbers
- On blur: format as `+1 (XXX) XXX-XXXX` for 11-digit numbers starting with `1`
- Store as digits only (with optional country code prefix)

**HTML attributes:**
- `type="tel"`
- `inputMode="numeric"` (mobile numeric keyboard)
- `placeholder="(555) 123-4567"`

**Implementation pattern (React):**
```tsx
import { formatPhone, filterPhoneInput } from '@/lib/phone';

<input
  type="tel"
  inputMode="numeric"
  value={phone}
  onChange={(e) => setPhone(filterPhoneInput(e.target.value))}
  onBlur={() => setPhone(formatPhone(phone))}
  placeholder="(555) 123-4567"
/>
```

**Shared utility (`lib/phone.ts`):**
```typescript
export function stripPhone(value: string): string {
  return value.replace(/[^\d]/g, '');
}
export function formatPhone(value: string): string {
  const digits = stripPhone(value);
  if (digits.length === 10) return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
  if (digits.length === 11 && digits[0] === '1') return `+1 (${digits.slice(1,4)}) ${digits.slice(4,7)}-${digits.slice(7)}`;
  return value;
}
export function filterPhoneInput(value: string): string {
  return value.replace(/[^\d\s\-()+ ]/g, '');
}
```

---

## 11. Self-check

Before delivering any styled page, verify:

- [ ] Brand colors use the six blueprint §4.5 tokens (`brand.primary`, `brand.hover`, `brand.dark`, `brand.light`, `brand.glow`, `brand.text-on-primary`)
- [ ] Surfaces use `surface.*` tokens, not raw hex or RGBA
- [ ] Borders use `border.*` tokens (subtle / default / hover / focus)
- [ ] Typography uses the correct scale (marketing OR app, not mixed)
- [ ] Shadows use `shadow-sm` / `shadow-md` / `shadow-lg` / `shadow-focus` / `shadow-brand` — no custom values
- [ ] Z-index uses named tokens (`z-sticky`, `z-dropdown`, etc.) — no raw `z-[N]`
- [ ] Spacing uses semantic tokens for layout, raw values for component-internal
- [ ] Radius uses a named step (button=md, card=lg, modal=xl, badge=full)
- [ ] Mobile responsive at all breakpoints (sm/md/lg/xl/2xl Tailwind defaults)
- [ ] Accessible contrast ratios (WCAG AA minimum)
- [ ] No external CSS frameworks (no Bootstrap, no Material UI, no Shadcn-full)
- [ ] All `<select>` elements use §9 custom styling
- [ ] All phone inputs use §10 normalization
- [ ] Animations wrapped in `motion-safe:` or `prefers-reduced-motion` media query (for new work)

---

## 12. Relationship to other canonicals

| Canonical | What lives there |
|-----------|-----------------|
| `canonical-app-blueprint.md` | Parent. Token categories and structure. All apply here. |
| `canonical-site-nav.md` | Nav-specific patterns. Uses tokens from this file. |
| `canonical-app-components.md` | *(planned — not yet created)* Component-level specs. Uses tokens from this file. |
| `canonical-stack.md` | Tech stack + PlatformConfig shape. Consumed for the per-app brand-token pattern. |

When this file conflicts with the blueprint, the blueprint wins. When this file conflicts with `canonical-site-nav.md`, the site-nav file wins for nav-scoped concerns and this file wins for everything else.

---

## 13. Cleanup list (flagged drift, not yet fixed)

Documented here so cleanup is scheduled, not forgotten. Each item gets its own commit when addressed. Principal prioritizes.

1. **Token namespace migration** — `--member-bg` / `--member-card` / `--member-card-hover` / `--member-border` → `--surface-bg` / `--surface-card` / `--surface-elevated` / `--border-subtle`. Alias first, then retire old names across all apps.
2. **VLP-local duplicates** — `--bg`, `--fg`, `--muted`, `--card`, `--line` in `apps/vlp/app/globals.css` duplicate shared tokens. Remove VLP locals, use shared tokens.
3. **Font migration** — VLP currently uses Raleway (`--font-raleway`). Migrate to blueprint §4.8 stack (Sora + DM Sans + IBM Plex Mono). All 8 apps in scope.
4. **Brand color scale cleanup** — VLP defines `brand.orange` + `brand.amber` + `brand.400` + `brand.500` with overlapping values. Consolidate to the six-token structure from §2.1.
5. **Gradient hex drift** — `backgroundImage.gradient-brand` in VLP hardcodes `#f97316` + `#f59e0b`. Replace with `var(--brand-primary)` + `var(--brand-light)` references.
6. **Missing blueprint tokens** — Apps don't yet define `brand.hover`, `brand.dark`, `brand.light`, `brand.glow`, `brand.text-on-primary` (only `brand.primary` exists). Add the missing five to every app's tailwind config.
7. **Shadow / animation / z-index tokens** — None exist in shared layer yet. Add per §6, §7, §8.
8. **Semantic spacing tokens** — `space-section`, `space-block`, `space-inline`, `space-tight` not yet in shared layer. Add per §4.2.
9. ~~**Shared token file rename** — Consider renaming `packages/member-ui/src/styles/globals.css` to `tokens.css` to match the pattern (globals.css in apps, tokens in the shared layer).~~ Resolved 2026-04-16.

---

## 14. Decision log

| Date | Decision | Rationale |
|------|----------|-----------|
| (pre-2026-04-15) | Initial template-style authoring | Placeholder pre-dating the blueprint |
| 2026-04-15 | Full rewrite to align with blueprint §4 | 11 blueprint conflicts; template framing inconsistent with canonical role |
| 2026-04-15 | Two-layer token architecture documented (shared + per-app) | Matches shipped reality; shared=`packages/member-ui`, per-app=`apps/<app>` |
| 2026-04-15 | §§9, 10, 11 preserved (dropdown, phone, self-check) with token updates | Working content, strongest in prior version |
| 2026-04-15 | Cleanup list (§13) added instead of inline TODO notes | Scheduled drift, not forgotten drift |

Append-only. Do not rewrite prior entries.
