import { MarketingHeader } from '@vlp/member-ui'
import { tavlpConfig } from '@/lib/platform-config'

export default function Header() {
  return <MarketingHeader config={tavlpConfig} />
}
