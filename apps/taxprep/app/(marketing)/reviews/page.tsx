import type { Metadata } from 'next'
import { ReviewDisplayPage } from '@vlp/member-ui'
import { tppReviewConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Reviews | Tax Prep Pro',
  description:
    'See what service bureaus and credentialed tax practitioners say about Tax Prep Pro and the productized SuiteDash buildout.',
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={tppReviewConfig} submitPath="/reviews/submit" />
}
