import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Kennedy — TaxClaim Pro',
  description:
    'Talk to Kennedy about adding IRS penalty abatement to your practice. Automate Form 843 filing before the Kwong v. US deadline.',
  domain: 'taxclaim.virtuallaunch.pro',
  path: '/kennedy',
})

export default function KennedyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
