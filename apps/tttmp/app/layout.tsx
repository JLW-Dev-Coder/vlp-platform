import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Sora, DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import { BusinessJsonLd, CookieConsent, PostHogPageview } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'
import './globals.css'
import CtaBanner from '@/components/CtaBanner'
import SiteFooter from '@/components/SiteFooter'

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
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <meta name="x-vlp-platform" content="tttmp" />
      </head>
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
        <CookieConsent config={tttmpConfig} />
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  )
}
