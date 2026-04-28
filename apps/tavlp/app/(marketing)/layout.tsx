import Header from '@/components/marketing/Header'
import Footer from '@/components/marketing/Footer'
import { CookieConsent } from '@vlp/member-ui'
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
      <CookieConsent config={tavlpConfig} />
    </div>
  )
}
