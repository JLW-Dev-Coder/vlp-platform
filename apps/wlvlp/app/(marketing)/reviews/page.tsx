import { ReviewDisplayPage, generatePageMeta } from '@vlp/member-ui'
import { wlvlpConfig } from '@/lib/platform-config'

export const metadata = generatePageMeta({
  title: 'Reviews - Website Lotto',
  description:
    'See what buyers say about Website Lotto — real reviews from small business owners who acquired their websites through the marketplace.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/reviews',
})

const wlvlpReviewConfig = {
  platform: 'wlvlp',
  platformName: wlvlpConfig.brandName,
  themeColor: wlvlpConfig.brandColor,
  apiBase: wlvlpConfig.apiBaseUrl,
  formTypes: ['review'] as const,
}

export default function ReviewsPage() {
  return <ReviewDisplayPage config={wlvlpReviewConfig} submitPath="/contact" />
}
