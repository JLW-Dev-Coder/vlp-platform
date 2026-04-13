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
    <html lang="en" className={raleway.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
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
      </body>
    </html>
  );
}
