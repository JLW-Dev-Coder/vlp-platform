import { generatePageMeta } from '@vlp/member-ui'
import HomePage from '@/components/marketing/HomePage'

export const metadata = generatePageMeta({
  title: 'Virtual Launch Pro — The Operating System for Tax Practices',
  description: 'Ten specialized platforms — monitoring, automation, AI, and lead-gen — unified under one account. Built for tax professionals, taxpayers, business owners, and developers.',
  domain: 'virtuallaunch.pro',
  path: '/',
})

export default function Page() {
  return <HomePage />
}
