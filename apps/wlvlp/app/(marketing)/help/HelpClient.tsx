'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { wlvlpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'buying-template',
    title: 'Buying a template',
    body: [
      'Browse the template catalog, pick a design, and check out. After purchase the template is linked to your account and available to edit from your dashboard.',
      'Each template includes all source assets and a starter content set so you can publish quickly.',
    ],
  },
  {
    id: 'bidding-auctions',
    title: 'Bidding in auctions',
    body: [
      'Select sites are sold via timed auction. Place a bid from the listing page; the highest bid at close wins.',
      'You are not charged unless you win the auction. Payment captures automatically at close.',
    ],
  },
  {
    id: 'scratch-prizes',
    title: 'Scratch tickets and prizes',
    body: [
      'Scratch tickets drop with specific purchases and events. Redeem from the Scratch page to reveal prizes — discounts, free hosting months, or template credits.',
      'Prize redemption is tracked on your account.',
    ],
    links: [{ label: 'Scratch', href: '/scratch' }],
  },
  {
    id: 'custom-domain',
    title: 'Connecting your custom domain',
    body: [
      'From the site dashboard, enter your custom domain and follow the DNS instructions. Most registrars propagate within a few minutes; full propagation can take up to 24 hours.',
      'SSL is provisioned automatically once DNS resolves.',
    ],
  },
  {
    id: 'editing-site',
    title: 'Editing your purchased site',
    body: [
      'Open your site from the dashboard to edit content, swap assets, and adjust branding. Changes publish live on save.',
      'Rollback to a previous version from the version history panel if needed.',
    ],
  },
  {
    id: 'hosting-plans',
    title: 'Hosting plans',
    body: [
      'Hosting is billed monthly via Stripe. Plans differ by bandwidth, custom domain support, and included sites.',
      'Upgrade or downgrade any time from the account page.',
    ],
  },
  {
    id: 'refunds-policies',
    title: 'Refunds and policies',
    body: [
      'Template purchases are non-refundable once the source assets are delivered. Hosting is refundable pro rata within the first 7 days.',
      'For any dispute, contact support before initiating a chargeback.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={wlvlpConfig} topics={TOPICS} />;
}
