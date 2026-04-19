import { MarketingHeader, MarketingFooter, BusinessJsonLd, LeadChatbot } from '@vlp/member-ui'
import { ttmpConfig } from '@/lib/platform-config'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-bg">
      <BusinessJsonLd
        type="ProfessionalService"
        name="Transcript Tax Monitor Pro"
        description="IRS transcript analysis tool for tax professionals. Parse transcripts in seconds, generate plain-English client reports, and save hours every week."
        url="https://transcript.taxmonitor.pro"
        priceRange="$"
      />
      <MarketingHeader config={ttmpConfig} />
      <main className="flex-1">{children}</main>
      <MarketingFooter config={ttmpConfig} />
      <LeadChatbot config={ttmpConfig} />
    </div>
  )
}
