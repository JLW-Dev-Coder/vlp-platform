import { Suspense } from 'react'
import CheckoutClient from './CheckoutClient'

export const dynamic = 'force-static'

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48, textAlign: 'center' }}>Loading…</div>}>
      <CheckoutClient />
    </Suspense>
  )
}
