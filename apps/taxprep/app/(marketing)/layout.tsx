import { MarketingHeader, MarketingFooter, CookieConsent, LeadChatbot } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="flex min-h-screen flex-col bg-surface-bg text-text-primary"
      data-theme={tppConfig.themeMode === 'light' ? 'light' : undefined}
      style={
        tppConfig.themeMode === 'light'
          ? ({ ['--theme-color' as string]: tppConfig.brandColor } as React.CSSProperties)
          : undefined
      }
    >
      <MarketingHeader config={tppConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={tppConfig} />
      <LeadChatbot config={tppConfig} />
      <CookieConsent config={tppConfig} />
    </div>
  )
}
