import type { Metadata } from 'next'
import { ReviewSubmitPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Share Your Experience',
  description:
    'Submit a review, case study, or testimonial about Transcript Tax Monitor Pro.',
}

const ttmpReviewConfig = {
  platform: 'ttmp',
  platformName: 'Transcript Tax Monitor Pro',
  themeColor: '#14b8a6',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={ttmpReviewConfig} />
}
