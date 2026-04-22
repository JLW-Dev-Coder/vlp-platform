import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Learn — Tax Tools Arcade',
  description:
    'Video walkthroughs and guides for every game in the Tax Tools Arcade. Learn real tax concepts by playing.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/learn',
})

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return children
}
