import { MarketingHeader, MarketingFooter } from '@vlp/member-ui'
import { wlvlpConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Top Vegas marquee strip */}
      <div className="marquee-strip w-full" aria-hidden="true" />
      <MarketingHeader config={wlvlpConfig} />
      <main className="flex-1">{children}</main>
      {/* Neon line divider above footer */}
      <div className="neon-line" aria-hidden="true" />
      <MarketingFooter config={wlvlpConfig} />
      {/* Bottom Vegas marquee strip */}
      <div className="marquee-strip w-full" aria-hidden="true" />
    </div>
  )
}
