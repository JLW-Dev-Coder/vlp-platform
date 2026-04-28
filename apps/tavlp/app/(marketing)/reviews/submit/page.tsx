import type { Metadata } from 'next'
import { ReviewSubmitPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Share Your Experience | Tax Avatar Pro',
  description:
    'Submit a review, case study, or testimonial about Tax Avatar Pro and your AI YouTube channel experience.',
}

const tavlpReviewConfig = {
  platform: 'tavlp',
  platformName: 'Tax Avatar Pro',
  themeColor: '#ec4899',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={tavlpReviewConfig} />
}
