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
    <html lang="en" className={raleway.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
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
      </body>
    </html>
  );
}
