import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Sora, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import { BusinessJsonLd, CookieConsent, PostHogPageview } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  display: 'swap',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: {
    default: 'Games VLP',
    template: '%s | Games VLP',
  },
  description: 'Engage your clients with interactive tax education games. Powered by Virtual Launch Pro.',
  icons: {
    icon: 'https://virtuallaunch.pro/assets/favicon.ico',
    apple: 'https://virtuallaunch.pro/assets/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}>
      <head>
        <meta name="x-vlp-platform" content="gvlp" />
      </head>
      <body>
        <BusinessJsonLd
          name="Games VLP"
          description="Interactive tax education games for accountants and tax professionals. Embed engaging games on your website to boost client engagement."
          url="https://games.virtuallaunch.pro"
          type="SoftwareApplication"
          priceRange="$0 - $39/mo"
        />
        {children}
        <CookieConsent config={gvlpConfig} />
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  );
}
