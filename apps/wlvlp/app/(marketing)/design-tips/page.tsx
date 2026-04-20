import type { Metadata } from 'next';
import DesignTipsClient from './DesignTipsClient';

export const dynamic = 'force-static';

const TITLE = 'Design Tips | Website Lotto';
const DESCRIPTION =
  'Short videos on what makes websites convert. Headlines, layouts, CTAs, and clarity — learn what actually works.';
const URL = 'https://websitelotto.virtuallaunch.pro/design-tips';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, siteName: 'Website Lotto', type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

export default function DesignTipsPage() {
  return <DesignTipsClient />;
}
