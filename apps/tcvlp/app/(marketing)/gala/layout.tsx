import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Gala — AI Claim Guide | TaxClaim Pro',
  description:
    'Free guided walkthrough to check if IRS penalty abatement applies to your situation. Takes 2 minutes, no account required.',
  domain: 'taxclaim.virtuallaunch.pro',
  path: '/gala',
})

export default function GalaLayout({ children }: { children: React.ReactNode }) {
  return children
}
