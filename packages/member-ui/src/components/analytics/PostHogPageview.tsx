'use client'

/**
 * PostHogPageview — client-side SPA pageview tracker.
 *
 * Mount once in each app's layout (alongside CookieConsent). On every
 * pathname change, captures a `$pageview` event to PostHog — but only
 * if the user has opted in to analytics cookies (the SDK is lazy-loaded
 * by applyAnalyticsConsent, and this component is a no-op otherwise).
 *
 * Next 15 note: usePathname / useSearchParams require a Suspense boundary
 * at the call site. Consumers should wrap <PostHogPageview /> in
 * <Suspense fallback={null}>.
 */

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { getPostHogClient } from '../../lib/analytics'

export function PostHogPageview(): null {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const client = getPostHogClient()
    if (!client) return
    if (client.has_opted_out_capturing?.()) return

    const url =
      typeof window !== 'undefined'
        ? `${window.location.origin}${pathname}${
            searchParams?.toString() ? `?${searchParams.toString()}` : ''
          }`
        : pathname

    client.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}
