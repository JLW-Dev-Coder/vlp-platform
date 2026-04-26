'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DirectoryProfileRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/profile/onboarding')
  }, [router])
  return null
}
