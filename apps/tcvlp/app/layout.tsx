import type { Metadata } from 'next';
import { DM_Sans, Raleway } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['700', '800', '900'],
  variable: '--font-display',
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
    <html lang="en" className={`${dmSans.variable} ${raleway.variable}`}>
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
