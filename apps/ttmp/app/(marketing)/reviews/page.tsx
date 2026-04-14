import type { Metadata } from 'next'
import { ReviewDisplayPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'See what tax professionals say about Transcript Tax Monitor Pro.',
}

const ttmpReviewConfig = {
  platform: 'ttmp',
  platformName: 'Transcript Tax Monitor Pro',
  themeColor: '#14b8a6',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review'] as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={ttmpReviewConfig} submitPath="/reviews/submit" />
}
