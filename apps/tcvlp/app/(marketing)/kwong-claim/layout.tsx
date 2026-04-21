import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Kwong Claim Check — Does It Apply to You? | TaxClaim Pro',
  description:
    'Free guided walkthrough to check if the Kwong v. US ruling applies to your IRS penalty. Takes 2 minutes, no account required. File Form 843 before the July 2026 deadline.',
  domain: 'taxclaim.virtuallaunch.pro',
  path: '/kwong-claim',
})

export default function KwongClaimLayout({ children }: { children: React.ReactNode }) {
  return children
}
