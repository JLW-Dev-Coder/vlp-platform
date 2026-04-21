import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Sora, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { BusinessJsonLd, CookieConsent, PostHogPageview } from '@vlp/member-ui'
import { tmpConfig } from '@/lib/platform-config'
import './globals.css'
import Footer from '@/components/Footer'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: {
    default: 'Tax Monitor Pro',
    template: '%s | Tax Monitor Pro',
  },
  description:
    'Professional IRS transcript monitoring and tax resolution services.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <meta name="x-vlp-platform" content="tmp" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        <BusinessJsonLd
          name="Tax Monitor Pro"
          description="Professional IRS transcript monitoring, compliance tracking, and tax resolution services for taxpayers and tax professionals."
          url="https://taxmonitor.pro"
          type="ProfessionalService"
          priceRange="$0 - $39/mo"
        />
        {children}
        <Footer />
        <CookieConsent config={tmpConfig} />
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  )
}
