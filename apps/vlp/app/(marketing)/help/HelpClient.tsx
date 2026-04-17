'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { vlpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'account-payment',
    title: 'Account & Payment',
    body: [
      "When you upgrade your plan, you'll be directed to a secure Stripe checkout. After completing payment, your membership is activated immediately and reflected on your dashboard.",
      'Receipts are available under the Receipts page in your app dashboard. Stripe sends an automatic email receipt to your registered email address after each successful charge.',
      'If you see an unexpected charge or have a billing question, contact us through Support and include the last 4 digits of the card and the charge date.',
    ],
  },
  {
    id: 'contact-support',
    title: 'Contact Support',
    body: [
      'When contacting support, please include your registered email address, a clear description of the issue, steps you have already tried, screenshots if applicable, and the date and time the issue occurred.',
      'You can reach us through the Support page in your dashboard (fastest) or through the Contact page on this site. We respond within 1 business day.',
    ],
  },
  {
    id: 'download-access',
    title: 'Download & Access',
    body: [
      'All plan features are available immediately after checkout. Sign in to your dashboard at virtuallaunch.pro to access your tools.',
      'If your membership shows "Free" after a successful payment, try signing out and back in — this forces a session refresh. If the issue persists, contact support with your Stripe receipt number.',
      'Booking and calendar features require connecting your Cal.com account from the Calendar page.',
    ],
  },
  {
    id: 'token-packs',
    title: 'Token Packs',
    body: [
      'Token packs let you add tax game tokens or transcript tokens to your account outside of your monthly plan. Small Pack — 5,000 tokens. Medium Pack — 15,000 tokens. Large Pack — 50,000 tokens.',
      'All tokens are added to your existing balance and never expire. They are available immediately after purchase. You can monitor your token balance and usage on the Token Usage page in your dashboard.',
    ],
  },
  {
    id: 'free-previews',
    title: 'Free Previews',
    body: [
      'Several tools on Virtual Launch Pro offer free preview modes. These let you explore the interface and sample output without spending any tokens or requiring an active paid membership.',
      "Free previews are clearly labeled within the tool. When you're ready to run a full analysis, a paid plan or token pack is required.",
      'Free accounts have access to free previews across all tool categories.',
    ],
  },
  {
    id: 'refunds-policies',
    title: 'Refunds & Policies',
    body: [
      'Subscription plans are billed monthly or annually. You may cancel at any time — your access continues until the end of the current billing period. We do not offer prorated refunds for partial periods.',
      'Token packs are non-refundable once purchased since tokens are added to your account immediately.',
      'For disputes or questions about a specific charge, contact support before initiating a chargeback.',
    ],
    links: [
      { label: 'Privacy Policy', href: '/legal/privacy' },
      { label: 'Refund Policy', href: '/legal/refund' },
      { label: 'Terms of Service', href: '/legal/terms' },
    ],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    body: [
      'Membership shows "Free" after payment — sign out and back in, or hard-refresh the account page. Calendar not connecting — ensure you have an active Cal.com account and are not using an ad blocker.',
      "Tokens not appearing — allow up to 60 seconds after checkout; contact support if they don't appear after 5 minutes. Can't sign in — check that you're using the same email you registered with. Magic links expire after 15 minutes.",
      'Booking link not working — paste your Cal.com booking URL on the Calendar page and click Save.',
    ],
  },
  {
    id: 'using-tools',
    title: 'Using Your Tools',
    body: [
      'Tax Game — Select a scenario type, configure parameters, and run a simulation. Each run costs tokens based on complexity. Transcript Tool — Upload or paste a transcript text, select analysis type, and submit.',
      'Public Profile — Complete the Profile Setup wizard under Onboarding. Your profile appears in the Tax Monitor directory once submitted. Booking — Connect your Cal.com account on the Calendar page.',
      'Inquiries — Tax professionals receive taxpayer intake inquiries in the Inquiries section of the dashboard.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={vlpConfig} topics={TOPICS} />;
}
