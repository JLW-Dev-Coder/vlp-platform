import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';
import { BusinessJsonLd } from '@vlp/member-ui';
import './globals.css';

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-raleway',
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
    <html lang="en" className={raleway.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
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
