import { Suspense } from 'react'
import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import { CookieConsent, ExitIntentPopup, LeadChatbot, PostHogPageview } from '@vlp/member-ui'
import { tavlpConfig } from '@/lib/platform-config'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-bg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <LeadChatbot config={tavlpConfig} />
      <ExitIntentPopup config={tavlpConfig} />
      <CookieConsent config={tavlpConfig} />
      <Suspense fallback={null}>
        <PostHogPageview />
      </Suspense>
    </div>
  )
}
