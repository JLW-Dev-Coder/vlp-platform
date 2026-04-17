import type { Metadata } from 'next'
import { ReviewSubmitPage } from '@vlp/member-ui'

export const metadata: Metadata = {
  title: 'Share Your Experience | TaxClaim Pro',
  description:
    'Submit a review, case study, or testimonial about TaxClaim Pro and your Form 843 penalty abatement experience.',
}

const tcvlpReviewConfig = {
  platform: 'tcvlp',
  platformName: 'TaxClaim Pro',
  themeColor: '#eab308',
  apiBase: 'https://api.virtuallaunch.pro',
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={tcvlpReviewConfig} />
}
