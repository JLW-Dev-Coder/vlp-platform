import { Outfit, Inter } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
import { defaultMetadata } from '@/lib/metadata';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <meta name="x-vlp-platform" content="gsvlp" />
      </head>
      <body style={{ fontFamily: 'var(--font-body)' }}>
        <BusinessJsonLd
          name="Growth Setter Pro"
          description="Recruitment and affiliate platform for appointment setters. Book calls for tax professionals and earn 20% commission on closed deals."
          url="https://growthsetters.virtuallaunch.pro"
          type="ProfessionalService"
          priceRange="Free"
        />
        {children}
      </body>
    </html>
  );
}
