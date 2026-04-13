import type { Metadata } from 'next'
import { Raleway } from 'next/font/google'
import { BusinessJsonLd } from '@vlp/member-ui'
import './globals.css'
import CtaBanner from '@/components/CtaBanner'
import SiteFooter from '@/components/SiteFooter'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-raleway',
})

export const metadata: Metadata = {
  title: {
    default: 'Tax Tools Arcade',
    template: '%s | Tax Tools Arcade',
  },
  description: 'Gamified tax education tools for tax professionals.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={raleway.variable}>
      <body>
        <BusinessJsonLd
          name="Tax Tools Arcade"
          description="Gamified tax education tools for tax professionals. Learn tax concepts through interactive arcade-style games."
          url="https://taxtools.taxmonitor.pro"
          type="WebApplication"
          priceRange="$0 - $49"
        />
        {children}
        <CtaBanner />
        <SiteFooter />
      </body>
    </html>
  )
}
