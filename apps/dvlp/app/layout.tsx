import type { Metadata } from 'next';
import { Sora, DM_Sans, IBM_Plex_Mono } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
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
    default: 'Developers VLP',
    template: '%s | Developers VLP',
  },
  description: 'Connect talented developers with premium U.S. clients.',
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
      <body>
        <BusinessJsonLd
          name="Developers VLP"
          description="Developer marketplace connecting talented freelance developers with premium U.S. clients through Virtual Launch Pro."
          url="https://developers.virtuallaunch.pro"
          type="Organization"
          priceRange="$0 - $2.99/mo"
        />
        {children}
      </body>
    </html>
  );
}
