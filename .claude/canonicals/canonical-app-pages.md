# canonical-app-pages.md — VLP Ecosystem SETTINGS Pages Canonical

**Status:** Authoritative
**Last updated:** 2026-04-17
**Owner:** JLW (Principal Engineer review required for changes)
**Scope:** All 8 apps in the vlp-platform monorepo
**Parent:** `canonical-app-blueprint.md` (see §1 hierarchy)

This canonical defines the SETTINGS-sidebar page contract. All decisions in the parent blueprint apply here. When this file and the blueprint disagree, the blueprint wins and this file gets corrected.

---

## 1. Purpose & scope

This canonical defines the contract for the 4 SETTINGS sidebar items — **Account**, **Profile**, **Support**, **Usage** — across all 8 apps in the vlp-platform monorepo. `canonical-site-nav.md` §2 is the source of truth for the sidebar item placement and per-app shell path; this canonical defines what those pages contain, how they wrap auth and the AppShell, which Worker endpoints they call, and the loading/error/D5-redirect rules they must satisfy.

Per-app shell-path conventions (`/(member)/*`, `/app/*`, `/operator/*`, `/dashboard/*`) are defined in `canonical-site-nav.md` §2 and carried here without modification. If this file and `canonical-site-nav.md` diverge on path or placement, `canonical-site-nav.md` wins.

VLP `apps/vlp/app/(member)/{account,profile,support,usage}` is the canonical reference implementation. When Phase 3 per-app sweeps land, each app is brought into compliance with the contract described here by lifting VLP patterns (not VLP JSX verbatim — each app has its own brand tokens and shell path).

---

## 2. Authenticated-page shell contract

Every SETTINGS page — in every app — MUST wrap content in this exact order:

```
AuthGate (or AdminGate for DVLP) → AppShell → Page content
```

No page may skip a layer; no page may implement its own session-check or redirect logic ahead of AuthGate.

### 2.1 AuthGate wrap

- Use `@vlp/member-ui` **AuthGate** for all apps EXCEPT DVLP.
- **DVLP** uses **AdminGate** (operator-only role check) — functionally equivalent wrapper for the operator-only shell.
- AuthGate handles 401 redirect to `/sign-in?redirect={path}` before page mounts.
- Pages MUST NOT implement their own manual redirect-on-session-failure. That anti-pattern caused the TTTMP audit gap fixed in `8947262` (`fix(tttmp): wrap /account in AuthGate per canonical pattern`). Any page that duplicates AuthGate's responsibilities is out of compliance.

### 2.2 AppShell wrap

- Use `@vlp/member-ui` **AppShell** with the app's `PlatformConfig` (e.g. `vlpConfig`, `tcvlpConfig`) imported from `@/lib/platform-config`.
- AppShell renders the sidebar, topbar, and content frame; it also provides session and config via `useAppShell()` context.
- Page content is the direct child of `<AppShell config={...}>`.

### 2.3 Session data access

- Read `account_id`, `email`, `role`, and other session fields from `useAppShell().session`.
- Worker returns a `{ ok, session: {...} }` envelope; AppShell already unwraps it (per A2 hot-fix). Pages consume the flat session object — they do not re-unwrap.
- Do not re-fetch `/v1/auth/session` inside a SETTINGS page. AuthGate + AppShell have already done it.

### 2.4 Authenticated fetches

- Every Worker call made from a SETTINGS page uses `credentials: 'include'`.
- Use `config.apiBaseUrl` from `useAppShell().config` when constructing URLs. Never hardcode the API host (`api.virtuallaunch.pro`, etc.) inside a page.

### 2.5 Loading state pattern

- Match VLP reference: skeleton card grid (animate-pulse rounded cards sized to match the final layout).
- No spinner-only states. No full-screen "Loading…" text.
- Lift the exact skeleton shape from `apps/vlp/app/(member)/account/AccountClient.tsx` (`AccountSkeleton`) for Account, and the per-page equivalent for Profile/Support/Usage.

### 2.6 Error state pattern

- Match VLP reference: inline error message rendered inside a card using amber accent tokens, with a retry affordance where the failure is recoverable (most data fetches).
- Worker errors are caught in the page's fetch effect and surfaced via the error card (see `AccountFallback` in VLP reference).
- Uncaught errors fall through to AppShell's error boundary — do not shadow the boundary with try/catch that swallows unknown errors.

### 2.7 D5 enforcement (no dashboard auto-redirect)

SETTINGS pages MUST NOT redirect authenticated users to onboarding flows, billing-setup flows, or any other gated path based on profile/billing/onboarding completeness.

- Onboarding entry points are **CTAs in Account** (e.g. "Complete Setup" buttons), never auto-redirects out of the SETTINGS area.
- Reference: TCVLP hot-fixes `9a805e0` (remove dashboard onboarding redirect) and `9f2c880` (add Firm Setup card to `/dashboard/account`) established this pattern.
- The Phase 1 audit confirmed no other app currently violates D5. Phase 3 sweeps must preserve compliance.

---

## 3. Account page contract

The canonical reference is `apps/vlp/app/(member)/account/AccountClient.tsx`. Every app's Account page lifts its behavior from this file.

### 3.1 Required UI sections

- **Account Details card** — `account_id`, `email`, `created_at` / member-since date, account status (rendered via a status badge).
- **Current Plan / Membership card** — plan label, price, feature bullets, next-renewal date. Apps without tiered plans show a simplified single-plan card.
- **Billing management** — see §3.3.
- **Sign out** — NOT page content. Sign-out lives in the AppShell topbar account menu and is provided by `@vlp/member-ui`. Pages must not render a second sign-out button.

### 3.2 Editable fields

- **Email** update via `PATCH /v1/accounts/:account_id`.
- Additional editable fields (display name, timezone, etc.) per VLP reference — lift the exact field list from `AccountClient.tsx`.
- Form fields are optimistic-save-on-blur only when the VLP reference does so; otherwise use an explicit Save button that's enabled only when the form is dirty.

### 3.3 Billing management — CANONICAL HOME

Per Owner rulings D1 + D2 + D3 (2026-04-17):

- **Account is the canonical home for billing management across all 8 apps.** There is no separate "Plan & Billing", "Subscription", or "Billing" sidebar item on any app.
- **Stripe-billed apps** include a **"Manage Subscription"** button that opens the Stripe Customer Portal via the shared Worker endpoint `POST /v1/billing/portal/sessions`.
  - Implementation pattern: button `onClick` issues a `fetch` to the endpoint with `credentials: 'include'`, receives `{ url }`, and performs `window.location.assign(url)`.
  - The endpoint resolves the Stripe customer ID from the authenticated session — there are **no platform-specific portal endpoints**.
- **Apps without Stripe billing** — none currently; all 8 apps have Stripe checkout. If a future app ships without Stripe, Account hosts billing UI directly as a placeholder until first-party receipts ship.
- **"Subscribed but missing app-row" recovery** — precedent set by the TCVLP Firm Setup card (commit `9f2c880`). Apps that can enter this inconsistent state MUST surface a **"Complete Setup"** CTA card on Account that detects the state (via an app-specific subscription/status endpoint) and routes the user to the app's onboarding flow.

### 3.4 Worker endpoints used

- `GET  /v1/auth/session` — called by AppShell; pages consume the result, do not re-call.
- `GET  /v1/accounts/:account_id` — page-specific account row fetch.
- `PATCH /v1/accounts/:account_id` — email and editable-field updates.
- `POST /v1/billing/portal/sessions` — Manage Subscription button on Stripe-billed apps.
- App-specific subscription/status endpoints (e.g. `/v1/tcvlp/subscription/status`) where the app needs to detect the recovery state described in §3.3.

---

## 4. Profile page contract

The canonical reference is `apps/vlp/app/(member)/profile/ProfileClient.tsx`. Every app's Profile page lifts its behavior from this file.

### 4.1 Required UI sections

- Public-profile fields (display name, photo, bio, and any app-specific public fields) — lift the exact list from the VLP reference for the base case.
- Visibility toggle (public / unlisted) where the app supports a public directory.
- **Save button enabled only when the form is dirty** — no continuous auto-save.
- Photo upload flow via the two-step init/complete pattern (see §4.3).

### 4.2 TCVLP specialization (per Owner ruling D4)

- TCVLP SETTINGS includes **BOTH** "Account" and "Firm Profile" sidebar items.
- "Firm Profile" routes to **`/dashboard/profile`** (per Owner ruling Q7 — no path exception; Firm Profile occupies the canonical Profile slot on TCVLP).
- Firm Profile content is the public-facing pro identity (firm name, bio, services, slug). Billing and firm-setup (setup/recovery CTA) live on **Account**, not on Firm Profile.
- The other 7 apps use a single Profile item per `canonical-site-nav.md` §2.

### 4.3 Worker endpoints used

- `GET   /v1/profiles/:id`
- `PATCH /v1/profiles/:id`
- `POST  /v1/accounts/photo-upload-init`
- `POST  /v1/accounts/photo-upload-complete`

---

## 5. Support page contract

The canonical reference is `apps/vlp/app/(member)/support/page.tsx` + `SupportClient.tsx`. Every app's Support page lifts its behavior from this pair.

### 5.1 Required UI sections

- **Ticket list**, sorted by `updated_at` desc, with status badges on each row.
- **Create-ticket form** — subject, body, category. On submit, new ticket is prepended to the list and form resets.
- **Ticket detail view** — modal or inline expansion (match VLP's chosen pattern; do not invent a new one).

### 5.2 Co-location pattern

`SupportClient.tsx` co-located with `page.tsx` is the canonical separation for every SETTINGS page, not just Support:

- `page.tsx` handles server-side concerns: route metadata, route config, and rendering the Client component.
- `*Client.tsx` is `'use client'` and owns interactivity, state, effects, and fetches.

Lift the exact split from VLP for every page. Do not combine `page.tsx` and the client into a single file.

### 5.3 Status badges

- Values: `open`, `in_progress`, `resolved`, `closed`.
- Lift the exact color mapping and label text from the VLP `StatusBadge` usage in `SupportClient.tsx`.

### 5.4 Worker endpoints used

- `POST   /v1/support/tickets`
- `GET    /v1/support/tickets/by-account/:id`
- `GET    /v1/support/tickets/:id`
- `PATCH  /v1/support/tickets/:id`

---

## 6. Usage page contract

The canonical reference is `apps/vlp/app/(member)/usage/page.tsx` + `UsageClient.tsx`. Every app's Usage page lifts its behavior from this pair.

### 6.1 Required UI sections

- **Per-tool usage table** — tool name, count, last-used timestamp.
- **Date-range filter**, defaulting to **last 30 days** (match VLP default).
- **Pagination** if the result set exceeds the VLP page-size constant — lift `N` from the VLP reference rather than inventing a new page size.

### 6.2 Worker endpoints used

- `GET /v1/usage/by-account/:id`

### 6.3 Status note

`canonical-feature-matrix.md` marks Tool Usage History as **"partial — route exists, UI incomplete on most platforms"**. This canonical establishes the UI contract; the Phase 3 sweep brings each app into compliance one at a time.

---

## 7. Per-app shell-path conventions

Reproduced from `canonical-site-nav.md` §2 for at-a-glance reference only. If this table and `canonical-site-nav.md` diverge, **`canonical-site-nav.md` wins**.

| App  | Pattern              | Account path             |
|------|----------------------|--------------------------|
| VLP  | `(member)/*`         | `/(member)/account`      |
| TTMP | `/app/*`             | `/app/account`           |
| DVLP | `/operator/*`        | `/operator/account`      |
| TMP, TTTMP, GVLP, TCVLP, WLVLP | `/dashboard/*` | `/dashboard/account` |

Profile, Support, and Usage follow the same per-app shell pattern as Account — substitute the last segment.

---

## 8. Stub pattern for missing pages

For apps that don't yet ship a SETTINGS page at the moment a Phase 3 sweep begins — though every app is expected to ship all 4 pages once the sweep completes — use this scaffold. It satisfies the shell contract in §2 and renders a "Coming soon" card until the real UI lands.

```tsx
'use client'
import { AuthGate, AppShell } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

export default function UsagePage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <div className="rounded-xl border border-[var(--member-border)]
                        bg-[var(--member-card-bg)] p-8">
          <h1 className="text-xl font-semibold">Usage</h1>
          <p className="mt-2 text-sm text-[var(--member-text-muted)]">
            Coming soon.
          </p>
        </div>
      </AppShell>
    </AuthGate>
  )
}
```

Use this pattern when scaffolding a page whose backend endpoint is shipped but whose rendering UI hasn't been built. Structurally identical to the Track C-GVLP achievement-guide stubs.

---

## 9. Per-app SETTINGS sidebar items (final state after Phase 3)

Per Owner rulings Q1–Q7 from the A5 Phase 1 audit:

| App   | Account | Profile           | Support | Usage   | Notes |
|-------|---------|-------------------|---------|---------|-------|
| VLP   | ✓       | ✓                 | ✓       | ✓       | canonical reference |
| TMP   | + (P3)  | ✓                 | ✓       | + (P3)  | Q3 — Phase 3 creates Account + Usage |
| TTMP  | ✓       | ✓                 | ✓       | ✓       | token-usage is the Usage variant |
| TTTMP | ✓       | + (P3)            | + (P3)  | + (P3)  | Q1 hot-fix done; Phase 3 creates Profile / Support / Usage |
| DVLP  | + (P3)  | + (P3)            | ✓       | + (P3)  | Q5 — `/operator/*` shell, AdminGate wrap |
| GVLP  | ✓       | ✓                 | ✓       | ✓       | — |
| TCVLP | ✓       | ✓ (Firm Profile)  | ✓       | + (P3)  | Q2, Q4, Q7 — collapse legacy Plan & Billing, rename to `/dashboard/profile`, Phase 3 creates Usage |
| WLVLP | + (P3)  | + (P3)            | ✓       | + (P3)  | Q6 — Phase 3 creates 3 pages; portal button handles hosting renewals |

**Legend:** ✓ = shipped per audit; **+ (P3)** = Phase 3 creates.

---

## 10. Decision log

Append-only. New entries go at the bottom of the table.

| Date       | Decision | Rationale |
|------------|----------|-----------|
| 2026-04-17 | Initial canonical drafted from A5 Phase 1 audit + 7 Owner rulings | A5 Phase 2 deliverable; locks contract for Phase 3 per-app sweep |
| 2026-04-17 | Account is the canonical billing-management home (D1) | Single sidebar item per app; no separate Plan / Billing / Subscription items |
| 2026-04-17 | Stripe Customer Portal endpoint `/v1/billing/portal/sessions` adopted ecosystem-wide (D2, Q4) | Existing shared route resolves customer ID from session; no per-platform billing endpoints needed |
| 2026-04-17 | TCVLP retains Firm Profile as Profile specialization, routed to `/dashboard/profile` (D4, Q7) | Firm Profile is the public-facing pro identity and occupies the canonical Profile slot; no path exception |
| 2026-04-17 | DVLP in scope, AdminGate accepted as auth wrap (Q5) | Operator-only role is the DVLP context; AdminGate is functionally equivalent to AuthGate for canonical purposes |
| 2026-04-17 | D5 codified: SETTINGS pages may not redirect on profile / billing / onboarding state | Established by TCVLP hot-fixes `9a805e0` + `9f2c880`; Phase 1 audit confirmed no other app currently violates |
