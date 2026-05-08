import type { Metadata } from 'next'
import { ReviewSubmitPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Share Your Experience | Tax Prep Pro',
  description:
    'Submit a review, case study, or testimonial about your Tax Prep Pro buildout and the 8-phase client journey.',
}

const tppReviewConfig = {
  platform: 'taxprep',
  platformName: 'Tax Prep Pro',
  themeColor: '#E91E63',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={tppReviewConfig} />
}
