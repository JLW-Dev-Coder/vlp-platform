import Header from '@/components/ui/Header'
import Footer from '@/components/ui/Footer'
import { BusinessJsonLd } from '@vlp/member-ui'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <BusinessJsonLd
        name="Virtual Launch Pro"
        description="Calm launch systems for tax professionals. Membership management, transcript tools, booking analytics, and directory profiles."
        url="https://virtuallaunch.pro"
        type="SoftwareApplication"
        priceRange="$0 - $499/mo"
      />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
