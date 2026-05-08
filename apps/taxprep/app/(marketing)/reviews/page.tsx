import type { Metadata } from 'next'
import { ReviewDisplayPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Reviews | Tax Prep Pro',
  description:
    'See what service bureaus and credentialed tax practitioners say about Tax Prep Pro and the productized SuiteDash buildout.',
}

const tppReviewConfig = {
  platform: 'taxprep',
  platformName: 'Tax Prep Pro',
  themeColor: '#E91E63',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
  themeMode: 'light' as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={tppReviewConfig} submitPath="/reviews/submit" />
}
