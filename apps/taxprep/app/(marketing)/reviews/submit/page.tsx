import type { Metadata } from 'next'
import { ReviewSubmitPage } from '@vlp/member-ui'
import { tppReviewConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Share Your Experience | Tax Prep Pro',
  description:
    'Submit a review, case study, or testimonial about your Tax Prep Pro buildout and the 8-phase client journey.',
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={tppReviewConfig} />
}
