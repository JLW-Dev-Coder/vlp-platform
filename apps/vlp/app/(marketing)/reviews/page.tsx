import { ReviewDisplayPage, generatePageMeta } from '@vlp/member-ui'
import { vlpConfig } from '@/lib/platform-config'

export const metadata = generatePageMeta({
  title: 'Reviews — Virtual Launch Pro',
  description:
    'Read reviews from tax professionals using Virtual Launch Pro to grow their practices and respond to leads faster.',
  domain: 'virtuallaunch.pro',
  path: '/reviews',
})

const vlpReviewConfig = {
  platform: 'vlp',
  platformName: vlpConfig.brandName,
  themeColor: vlpConfig.brandColor,
  apiBase: vlpConfig.apiBaseUrl,
  formTypes: ['review', 'case_study', 'testimonial'] as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={vlpReviewConfig} submitPath="/reviews/submit" />
}
