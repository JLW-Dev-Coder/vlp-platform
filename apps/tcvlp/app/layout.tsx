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
    default: 'TaxClaim Pro',
    template: '%s | TaxClaim Pro',
  },
  description: 'Help your clients claim IRS penalties using the Kwong v. US ruling. Branded landing pages for tax professionals.',
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
        <meta name="x-vlp-platform" content="tcvlp" />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <BusinessJsonLd
          name="TaxClaim Pro"
          description="Form 843 penalty abatement preparation tool for tax professionals. Help clients claim IRS penalties using the Kwong v. US ruling."
          url="https://taxclaim.virtuallaunch.pro"
          type="ProfessionalService"
          priceRange="$10/mo"
        />
        {children}
      </body>
    </html>
  );
}
