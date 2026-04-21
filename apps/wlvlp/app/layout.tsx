import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Sora, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import { BusinessJsonLd, CookieConsent, PostHogPageview } from '@vlp/member-ui';
import { wlvlpConfig } from '@/lib/platform-config';
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
    default: 'Website Lotto',
    template: '%s | Website Lotto',
  },
  description: 'Claim a high-converting website template. Buy Now, Bid, or Scratch to Win.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
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
        <meta name="x-vlp-platform" content="wlvlp" />
      </head>
      <body>
        <BusinessJsonLd
          name="Website Lotto"
          description="Ready-made website template marketplace. Claim a high-converting website for your business — buy now, bid, or scratch to win."
          url="https://websitelotto.virtuallaunch.pro"
          type="Product"
          priceRange="$249 - $399"
        />
        {children}
        <CookieConsent config={wlvlpConfig} />
        <Suspense fallback={null}>
          <PostHogPageview />
        </Suspense>
      </body>
    </html>
  );
}
