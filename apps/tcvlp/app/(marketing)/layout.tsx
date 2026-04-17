import { MarketingHeader, MarketingFooter, CookieConsent } from '@vlp/member-ui'
import DeadlineBanner from '@/components/DeadlineBanner'
import { tcvlpConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-bg">
      <DeadlineBanner />
      <MarketingHeader config={tcvlpConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={tcvlpConfig} />
      <CookieConsent config={tcvlpConfig} />
    </div>
  )
}
