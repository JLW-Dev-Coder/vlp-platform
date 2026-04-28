import type { Metadata } from 'next'
import { ReviewDisplayPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Reviews | Tax Avatar Pro',
  description:
    'See what tax professionals say about Tax Avatar Pro — managed AI YouTube channels for tax practices.',
}

const tavlpReviewConfig = {
  platform: 'tavlp',
  platformName: 'Tax Avatar Pro',
  themeColor: '#ec4899',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={tavlpReviewConfig} submitPath="/reviews/submit" />
}
