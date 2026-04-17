'use client'

import { useEffect } from 'react'

export default function SupportRedirect() {
  useEffect(() => {
    window.location.replace('/help')
  }, [])

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      Redirecting to help center…
    </div>
  )
}
