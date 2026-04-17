'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { ttmpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'uploading-transcripts',
    title: 'Uploading transcripts',
    body: [
      'Drop an IRS account transcript PDF into the Transcript Parser on the dashboard. Text-based PDFs parse in seconds; scanned images will not.',
      'If a client can only provide a scan, ask them to redownload the transcript directly from IRS.gov — that PDF always contains embedded text.',
    ],
  },
  {
    id: 'parser-output',
    title: 'Reading parser output',
    body: [
      'Parser output organizes transactions by tax year, flags penalty rows, and identifies Kwong-window eligibility (Jan 20 2020 – Jul 10 2023).',
      'Each transaction row lists the IRS code, description, date, and amount. Use the code lookup tool for definitions of uncommon codes.',
    ],
    links: [
      { label: 'IRS Code Lookup', href: '/tools/code-lookup' },
      { label: 'Transcript Codes Resource', href: '/resources/transcript-codes' },
    ],
  },
  {
    id: 'token-packs',
    title: 'Token packs',
    body: [
      'Parsing a transcript and generating a client report consume tokens. Top up from the Token Usage page inside your account area.',
      'Tokens never expire and carry over month to month on top of any included plan allowance.',
    ],
  },
  {
    id: 'sharing-reports',
    title: 'Sharing reports with clients',
    body: [
      'Generated client reports are written in plain English and can be downloaded as a PDF or shared via link.',
      'All reports are stored in your account under Reports — regenerate or re-share at any time.',
    ],
  },
  {
    id: 'subscription-tiers',
    title: 'Subscription tiers',
    body: [
      'Choose the tier that matches your volume. All tiers include the parser, client reports, and token allowances — higher tiers unlock higher monthly caps and priority processing.',
      'See the pricing page for current tier details. Upgrade or downgrade at any time from Account.',
    ],
    links: [{ label: 'Pricing', href: '/pricing' }],
  },
  {
    id: 'refunds',
    title: 'Refunds',
    body: [
      'Subscriptions can be cancelled at any time; access continues until the end of the current billing period. Prior periods are non-refundable.',
      'Token packs are non-refundable once credited to your account. For billing disputes, contact support before filing a chargeback.',
    ],
    links: [{ label: 'Refund Policy', href: '/legal/refund' }],
  },
];

export default function HelpClient() {
  return <HelpCenter config={ttmpConfig} topics={TOPICS} />;
}
