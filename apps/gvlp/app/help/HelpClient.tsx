'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'embedding-games',
    title: 'Embedding games on your site',
    body: [
      'Grab your embed snippet from Dashboard → Embed Code. Paste it into your site; games render in an iframe and track token usage per visitor.',
      'Each embed is scoped to a specific game and your client_id. Create additional embeds for additional games.',
    ],
  },
  {
    id: 'subscription-tiers',
    title: 'Subscription tiers and what is included',
    body: [
      'Tiers determine monthly token allowance, number of embeds, and access to premium game modes.',
      'Upgrade or downgrade any time from the dashboard. Unused token allowance does not roll over; purchased token packs do.',
    ],
  },
  {
    id: 'custom-branding',
    title: 'Customizing branding',
    body: [
      'Higher tiers unlock custom branding on embedded games — your logo, colors, and CTA text.',
      'Branding settings are on the dashboard Settings tab and apply to all active embeds.',
    ],
  },
  {
    id: 'token-usage',
    title: 'Token usage',
    body: [
      'Each game play consumes tokens. Monitor consumption and visitor activity on the Token Usage tab.',
      'Tokens never expire. Top up with additional packs from the dashboard at any time.',
    ],
  },
  {
    id: 'reviews',
    title: 'Reviews',
    body: [
      'Players can leave feedback after a game. Reviews appear on your public reviews page and help new visitors evaluate your offering.',
    ],
    links: [{ label: 'Reviews', href: '/reviews' }],
  },
  {
    id: 'refunds',
    title: 'Refunds',
    body: [
      'Subscriptions can be cancelled at any time; access continues until the end of the current billing period. Prior periods are non-refundable.',
      'Token packs are non-refundable once credited. Contact support before initiating a chargeback.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={gvlpConfig} topics={TOPICS} />;
}
