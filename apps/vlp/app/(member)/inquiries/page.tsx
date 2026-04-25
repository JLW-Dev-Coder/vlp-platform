import type { Metadata } from 'next'
import InquiriesClient from './InquiriesClient'

export const metadata: Metadata = { title: 'Inquiries' }

export default function InquiriesPage() {
  return <InquiriesClient />
}
