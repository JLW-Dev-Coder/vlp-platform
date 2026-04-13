import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BusinessJsonLd } from '@vlp/member-ui'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BusinessJsonLd
        type="ProfessionalService"
        name="Transcript Tax Monitor Pro"
        description="IRS transcript analysis tool for tax professionals. Parse transcripts in seconds, generate plain-English client reports, and save hours every week."
        url="https://transcript.taxmonitor.pro"
        priceRange="$"
      />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
