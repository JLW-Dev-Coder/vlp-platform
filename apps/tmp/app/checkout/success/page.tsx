import { Suspense } from 'react'
import SuccessClient from './SuccessClient'

export const dynamic = 'force-static'

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: 48, textAlign: 'center' }}>Loading…</div>}>
      <SuccessClient />
    </Suspense>
  )
}
