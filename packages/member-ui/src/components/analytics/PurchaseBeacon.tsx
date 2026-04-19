'use client'

/**
 * PurchaseBeacon — fires a single `purchase` PostHog event on mount.
 *
 * Drop into any Stripe return / success page. Reads Stripe session_id and
 * client_reference_id from the URL query string when not explicitly passed.
 * Deduped per-session via sessionStorage — safe to mount multiple times
 * on the same page (e.g., inside a Suspense boundary).
 *
 * sku / amount_cents should be supplied when available. When not in scope,
 * the event is still fired with sku='unknown' and amount_cents=0 so the
 * conversion event count stays accurate even if the revenue attribution
 * must be reconciled from Stripe webhooks separately.
 */

import { useEffect } from 'react'
import { capture } from '../../analytics'

export interface PurchaseBeaconProps {
  app: string
  sku?: string
  amount_cents?: number
  /** Override values pulled from URL query string. */
  sessionId?: string
  clientReferenceId?: string
}

export function PurchaseBeacon({
  app,
  sku,
  amount_cents,
  sessionId,
  clientReferenceId,
}: PurchaseBeaconProps): null {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const stripe_session_id = sessionId ?? params.get('session_id') ?? undefined
    const client_reference_id =
      clientReferenceId ?? params.get('client_reference_id') ?? undefined

    const dedupKey = `vlp_purchase_beacon_${stripe_session_id ?? 'nosession'}_${app}`
    try {
      if (sessionStorage.getItem(dedupKey)) return
      sessionStorage.setItem(dedupKey, '1')
    } catch {
      // ignore
    }

    capture({
      name: 'purchase',
      props: {
        app,
        sku: sku ?? 'unknown',
        amount_cents: amount_cents ?? 0,
        stripe_session_id,
        client_reference_id,
      },
    })
  }, [app, sku, amount_cents, sessionId, clientReferenceId])

  return null
}
