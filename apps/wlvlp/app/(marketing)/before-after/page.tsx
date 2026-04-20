import type { Metadata } from 'next';
import BeforeAfterClient from './BeforeAfterClient';

export const dynamic = 'force-static';

const TITLE = 'Before & After | Website Lotto';
const DESCRIPTION =
  'Side-by-side comparisons of common website mistakes and the high-converting fixes. See what a converting website actually looks like.';
const URL = 'https://websitelotto.virtuallaunch.pro/before-after';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: 'Website Lotto', type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function BeforeAfterPage() {
  return <BeforeAfterClient />;
}
