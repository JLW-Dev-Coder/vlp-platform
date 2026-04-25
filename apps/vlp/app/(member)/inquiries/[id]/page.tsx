import type { Metadata } from 'next'
import InquiryDetailClient from './InquiryDetailClient'

export const metadata: Metadata = { title: 'Inquiry' }

export const dynamic = 'force-dynamic'

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <InquiryDetailClient id={id} />
}
