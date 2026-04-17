'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { tmpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'monitoring-setup',
    title: 'Tax monitoring setup',
    body: [
      'Navigate to the Directory to find a licensed tax professional and add them to your monitoring list. Once added, Tax Monitor Pro periodically checks IRS transcript records and alerts you when something changes.',
      'Alerts are delivered to your dashboard and, if enabled, via email. Configure notification preferences from Dashboard → Profile.',
    ],
  },
  {
    id: 'compliance-reports',
    title: 'Understanding compliance reports',
    body: [
      'Compliance reports summarize transcript-level changes across a selected time window: new filings, adjusted balances, status updates, and penalty activity.',
      'Access reports from Dashboard → Compliance Report. Exported PDFs are formatted for client review.',
    ],
  },
  {
    id: 'esign-2848',
    title: 'ESign 2848 workflow',
    body: [
      'Generate a Form 2848 directly from Dashboard → eSign 2848. Clients receive a signing link via email; completed forms are stored in your account and delivered to the IRS CAF.',
      'Signed forms are available for download alongside your compliance reports.',
    ],
  },
  {
    id: 'active-alerts',
    title: 'Active alerts and notifications',
    body: [
      'Active Alerts surface transcript changes since your last review. Each alert links back to the source transcript row for context.',
      'Mark alerts as read or archive them once addressed. Configure email delivery from Dashboard → Profile.',
    ],
  },
  {
    id: 'tokens-pricing',
    title: 'Token usage and pricing',
    body: [
      'Tokens power transcript pulls, report generation, and premium features. Purchase token packs from Dashboard → Tokens — tokens are credited instantly and never expire.',
      'Monitor consumption from the Tokens page; each operation lists its token cost before you confirm.',
    ],
  },
  {
    id: 'receipts-billing',
    title: 'Receipts and billing history',
    body: [
      'Every Stripe charge generates an emailed receipt. Full invoice history is available at Dashboard → Receipts.',
      'For billing questions, contact support with the charge date and the last 4 digits of the card.',
    ],
  },
  {
    id: 'profile-2fa',
    title: 'Profile and 2FA',
    body: [
      'Update your name, email, phone, and firm details from Dashboard → Profile. Two-factor authentication can be enabled in the same view for added account security.',
      'If you lose access to your 2FA device, contact support to reset — a short identity-verification step is required.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={tmpConfig} topics={TOPICS} />;
}
