import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Vesperi — Your Tax Tools Arcade Guide',
  description:
    'Meet Vesperi, your AI guide to the Tax Tools Arcade. Find the right game from 21 interactive tax games — tailored to tax pros and taxpayers.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/vesperi',
})

export default function VesperiLayout({ children }: { children: React.ReactNode }) {
  return children
}
