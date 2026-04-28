import type { Metadata } from 'next';
import { Sora } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
import './globals.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Tax Avatar Pro — AI YouTube Channel for Tax Pros',
    template: '%s | Tax Avatar Pro',
  },
  description: 'Tax Avatar Pro is a fully-managed AI YouTube channel for tax professionals. We pick the avatar, write the scripts, publish the episodes, and grow your audience — for $29/mo as an add-on to TaxClaim Pro.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
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
        <meta name="x-vlp-platform" content="tavlp" />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <BusinessJsonLd
          name="Tax Avatar Pro"
          description="Managed AI YouTube channel for tax professionals. Avatar selection, script writing, episode production, and channel growth handled end-to-end."
          url="https://taxavatar.virtuallaunch.pro"
          type="ProfessionalService"
          priceRange="$29/mo"
        />
        {children}
      </body>
    </html>
  );
}
