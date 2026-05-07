import { MarketingHeader, MarketingFooter, CookieConsent } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-bg">
      <MarketingHeader config={tppConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={tppConfig} />
      <CookieConsent config={tppConfig} />
    </div>
  )
}
