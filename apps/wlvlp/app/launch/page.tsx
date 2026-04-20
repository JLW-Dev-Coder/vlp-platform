import type { Metadata } from 'next';
import LaunchClient from './LaunchClient';

export const dynamic = 'force-static';

const TITLE = 'Launch Your Website Today | Website Lotto';
const DESCRIPTION =
  'Stop gambling on your website. Pick a proven layout, customize it, connect payments, and go live fast — all for one flat monthly price.';
const URL = 'https://websitelotto.virtuallaunch.pro/launch';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: 'Website Lotto',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function LaunchPage() {
  return <LaunchClient />;
}
