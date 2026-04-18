'use client'

import { useEffect } from 'react'

export default function SignInRedirectPage() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const redirect = params.get('redirect') || '/app/dashboard/'
    window.location.replace(`/login/?redirect=${encodeURIComponent(redirect)}`)
  }, [])

  return null
}
