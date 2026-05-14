import { MarketingHeader } from '@vlp/member-ui'
import { gsvlpConfig } from '@/lib/platform-config'

export default function Header() {
  return <MarketingHeader config={gsvlpConfig} />
}
