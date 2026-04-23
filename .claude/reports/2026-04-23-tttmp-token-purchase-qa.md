# TTTMP Token Purchase Flow — QA Report

Date: 2026-04-23
Worker version: `b2a8e5ea-f1d5-4030-8a91-331b2e2e035d`

```
TOKEN PURCHASE FLOW — QA REPORT
================================
Checkout session:       GAP — metadata.type not set, promo codes disabled
Coupon/promo codes:     NOT SUPPORTED — needs allow_promotion_codes: true on POST /v1/tttmp/checkout/sessions
Token crediting:        GAP — two paths, both broken:
                          • Webhook branch exists but checkout session omits metadata.type="token_purchase", so it's skipped
                          • GET /v1/tttmp/checkout/status hardcodes creditsAdded = 10 and has no idempotency
Token balance endpoint: WORKS — GET /v1/tokens/balance/:account_id + GET /v1/tttmp/tokens/balance
Grant access (spend):   WORKS — POST /v1/tokens/spend (idempotent via receiptKey, R2-canonical, D1 projection)
End game:               N/A — no explicit end-game endpoint; game plays are recorded at spend time
                        into tttmp_game_plays. Legacy /v1/tttmp/grant-access and /v1/tttmp/end-game are removed.
Overall:                BLOCKED for live testing by two fixes below.
```

## Details

### 1. POST /v1/tttmp/checkout/sessions (apps/worker/src/index.js:11803)

- Creates Stripe checkout session on the VLP Stripe account (`STRIPE_SECRET_KEY_VLP`).
- Stores order at R2 `tttmp/orders/{session_id}.json` and a receipt at `receipts/tttmp/checkout/{EVT_*}.json`.
- Sets `metadata = { account_id, platform: 'tttmp' }`.
- **Does NOT set `metadata.type = 'token_purchase'`** — this is the flag the webhook branch at index.js:5049 checks for. Without it, the webhook's token-credit block never runs.
- **Does NOT pass `allow_promotion_codes: true`** to Stripe — users cannot enter a promo code at Stripe Checkout. Compare index.js:17971 where other flows set it conditionally.

### 2. GET /v1/tttmp/checkout/status (apps/worker/src/index.js:11865)

- Ownership check: `stripeSession.metadata.account_id !== session.account_id` → 404.
- On `payment_status === 'paid'`:
  - `creditsAdded = 10` is hardcoded, ignoring the purchased price_id (30/80/200 token packages).
  - Calls `creditTokens(account_id, 10, 'tax_game', env)` — no idempotency key, so repeated polls after payment could repeatedly add 10 tokens.
- Recommend: remove the credit logic from this endpoint and rely on the webhook (after fixing #1), OR make it idempotent (check R2 `tokens/receipts/purchases/{account_id}/...` for a receipt with this session_id before crediting) and use the same `TOKEN_PURCHASE_MAP` as the webhook.

### 3. Webhook — checkout.session.completed (apps/worker/src/index.js:5047)

- Gated on `obj.metadata?.type === 'token_purchase'` — never true for current TTTMP sessions (see #1).
- If reached, correctly maps price_id → { type, quantity } via `TOKEN_PURCHASE_MAP`, writes receipt at `tokens/receipts/purchases/{account_id}/{ts}.json`, and upserts D1 `tokens` row.
- Price env vars referenced: `STRIPE_PRICE_TTTMP_30_TOKENS`, `STRIPE_PRICE_TTTMP_80_TOKENS`, `STRIPE_PRICE_TTTMP_200_TOKENS`.

### 4. Spend / Access

- `POST /v1/tokens/spend` (index.js:6581): R2-canonical pipeline — receipt → grant → balance → D1 projection → `tttmp_game_plays` row. Idempotent via `receipts/tttmp/tokens-spend/{idempotencyKey}.json` and guarded by account_id mismatch (returns 409).
- `GET /v1/games/access` (index.js:6743): reads `game-grants/{account_id}/{slug}.json` and returns `{ allowed, grantId }`.
- R2 key pattern for balances: `tokens/{account_id}.json` — matches the feature matrix.

### 5. What's missing end-to-end

- No `POST /v1/tttmp/end-game` — the canonical design appears to be "spend creates a session-based grant; playing consumes it; the front-end doesn't need an end call." If end-of-game analytics or grant invalidation is desired, it does not exist today.

## Recommended fixes (not applied in this commit)

1. In `POST /v1/tttmp/checkout/sessions`, set `metadata.type = 'token_purchase'` and `allow_promotion_codes: true` on the Stripe params.
2. In `GET /v1/tttmp/checkout/status`, either (a) stop crediting and let the webhook handle it, or (b) look up credits from `TOKEN_PURCHASE_MAP` by price_id and gate on a per-session idempotency receipt.

Either fix #1 alone is the minimum to unblock live testing — it makes the webhook credit correctly. Fix #2b is a belt-and-braces for users who don't receive the webhook before landing on the success page.
