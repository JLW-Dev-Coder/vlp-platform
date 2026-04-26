import type { Metadata } from 'next'
import MessageDetailClient from './MessageDetailClient'

export const metadata: Metadata = { title: 'Message' }

export const dynamic = 'force-dynamic'

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <MessageDetailClient id={id} />
}
