import { MarketingHeader, MarketingFooter } from '@vlp/member-ui'
import { ttmpConfig } from '@/lib/platform-config'

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-bg">
      <MarketingHeader config={ttmpConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={ttmpConfig} />
    </div>
  )
}
