import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
import './globals.css';

// Per Deviation 9: TPP uses Sora for both display and body.
// Sora ships normal-only on Google Fonts; browser-synthesized italic is used
// for editorial accents in the Phase 2 port. If a true italic face is needed,
// pair with a sister display font in Phase 2 — TODO(RC) flag for Phase 2.
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://taxprep.virtuallaunch.pro'),
  title: {
    default: 'Tax Prep Pro',
    template: '%s | Tax Prep Pro',
  },
  description:
    'Productize your service bureau end-to-end. Tax Prep Pro is a SuiteDash-based 8-phase client journey for tax preparers, EAs, CPAs, and attorneys.',
  icons: {
    icon: 'https://virtuallaunch.pro/assets/favicon.ico',
    apple: 'https://virtuallaunch.pro/assets/favicon.ico',
  },
  openGraph: {
    type: 'website',
    siteName: 'Tax Prep Pro',
    title: 'Tax Prep Pro — For Service Bureaus & Tax Pros',
    description:
      'Productize your service bureau end-to-end. 8-phase client journey, branded SuiteDash workspace, member training included.',
    url: 'https://taxprep.virtuallaunch.pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tax Prep Pro — For Service Bureaus & Tax Pros',
    description:
      'Productize your service bureau end-to-end. 8-phase client journey, branded SuiteDash workspace, member training included.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sora.variable}>
      <head>
        <meta name="x-vlp-platform" content="taxprep" />
        <meta name="theme-color" content="#E91E63" />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <BusinessJsonLd
          name="Tax Prep Pro"
          description="SuiteDash-based productized buildout for service bureaus and credentialed tax practitioners. 8-phase client journey, branded portal, member training included."
          url="https://taxprep.virtuallaunch.pro"
          type="ProfessionalService"
          priceRange="$5,000 setup · $5,000 setup + $779/mo per active member · $497/mo ongoing support"
        />
        {children}
      </body>
    </html>
  );
}
