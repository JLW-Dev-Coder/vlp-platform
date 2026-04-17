'use client'

import { useEffect } from 'react'

export default function AffiliateRedirect() {
  useEffect(() => {
    window.location.replace('/dashboard/affiliate')
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to affiliate…
    </div>
  )
}
