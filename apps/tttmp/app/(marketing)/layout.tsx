import { MarketingHeader, MarketingFooter, CookieConsent } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-arcade-bg text-arcade-text arcade-scan-line">
      <MarketingHeader config={tttmpConfig} />
      <main className="flex-1 arcade-grid-bg">{children}</main>
      <MarketingFooter config={tttmpConfig} />
      <CookieConsent config={tttmpConfig} />
    </div>
  )
}
