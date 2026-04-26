'use client'

import { useEffect, use } from 'react'
import { useRouter } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default function InquiryDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  useEffect(() => {
    router.replace(`/messages/${id}`)
  }, [router, id])
  return null
}
