import { ReviewSubmitPage, generatePageMeta } from '@vlp/member-ui'
import { vlpConfig } from '@/lib/platform-config'

export const metadata = generatePageMeta({
  title: 'Share Your Experience — Virtual Launch Pro',
  description:
    'Submit a review, case study, or testimonial about Virtual Launch Pro.',
  domain: 'virtuallaunch.pro',
  path: '/reviews/submit',
})

const vlpReviewConfig = {
  platform: 'vlp',
  platformName: vlpConfig.brandName,
  themeColor: vlpConfig.brandColor,
  apiBase: vlpConfig.apiBaseUrl,
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function SubmitReviewPage() {
  return <ReviewSubmitPage config={vlpReviewConfig} />
}
