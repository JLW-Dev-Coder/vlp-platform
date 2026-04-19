import { MarketingHeader, MarketingFooter } from '@vlp/member-ui'
import { wlvlpConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader config={wlvlpConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={wlvlpConfig} />
    </div>
  )
}
