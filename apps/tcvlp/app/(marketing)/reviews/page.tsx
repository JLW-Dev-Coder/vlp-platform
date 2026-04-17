import type { Metadata } from 'next'
import { ReviewDisplayPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Reviews | TaxClaim Pro',
  description:
    'See what tax professionals say about TaxClaim Pro, Form 843 automation, and Kwong v. US penalty abatement.',
}

const tcvlpReviewConfig = {
  platform: 'tcvlp',
  platformName: 'TaxClaim Pro',
  themeColor: '#eab308',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={tcvlpReviewConfig} submitPath="/reviews/submit" />
}
