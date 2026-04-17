'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { tttmpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'how-to-play',
    title: 'How to play and earn tokens',
    body: [
      'Pick a game from the arcade, read the brief, and play. Each game teaches a specific tax or compliance concept through a short, scored challenge.',
      'Completing a game rewards tokens, which can be spent on other games, upgrades, and exports.',
    ],
  },
  {
    id: 'tokens-pricing',
    title: 'Game tokens and pricing',
    body: [
      'Top up tokens directly from the account area. Tokens never expire and are spent transparently — each game shows its cost before you start.',
      'Subscribers get a monthly token allowance. Additional packs can be purchased any time.',
    ],
    links: [{ label: 'Pricing', href: '/pricing' }],
  },
  {
    id: 'ce-credit',
    title: 'Continuing education credit',
    body: [
      'Select games carry CE credit. Look for the CE badge on the game tile and complete the game in full — including the post-play quiz — to earn credit.',
      'CE certificates are emailed on completion and stored in your account.',
    ],
  },
  {
    id: 'subscription-tiers',
    title: 'Subscription tiers',
    body: [
      'Tiers unlock larger monthly token allowances, advanced game modes, and CE-credit-eligible content.',
      'Upgrade or downgrade any time — changes take effect at the next billing cycle.',
    ],
  },
  {
    id: 'account-setup',
    title: 'Account setup',
    body: [
      'Create an account with email and password, or sign in with Google. Verify your email to unlock CE certificates and receipts.',
      'Update your profile and preferences from the Account page.',
    ],
  },
  {
    id: 'refunds',
    title: 'Refunds',
    body: [
      'Subscriptions can be cancelled at any time; access continues until the end of the current billing period. Prior periods are non-refundable.',
      'Token packs are non-refundable once credited. For billing disputes, contact support before initiating a chargeback.',
    ],
    links: [{ label: 'Refund Policy', href: '/refunds' }],
  },
];

export default function HelpClient() {
  return <HelpCenter config={tttmpConfig} topics={TOPICS} />;
}
