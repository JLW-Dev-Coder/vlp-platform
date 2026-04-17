'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { dvlpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'developer-profile',
    title: 'Posting your developer profile',
    body: [
      'Complete onboarding to publish your developer profile. Include your specialties, rates, portfolio links, and availability so potential clients can evaluate fit quickly.',
      'Profiles are editable any time from the dashboard. Keep your availability accurate to avoid stale leads.',
    ],
  },
  {
    id: 'finding-clients',
    title: 'Finding clients',
    body: [
      'Clients browse and filter the public developer directory by specialty, rate, and availability. Keep your profile polished and responses fast to improve your standing.',
      'The Find Developers page on the marketing site lists active profiles.',
    ],
    links: [{ label: 'Find Developers', href: '/find-developers' }],
  },
  {
    id: 'match-requests',
    title: 'Submitting client match requests',
    body: [
      'When a client requests a match, you receive a notification with the project brief and budget.',
      'Respond from the dashboard with a short proposal. Fast responses — ideally within a few hours — materially improve conversion.',
    ],
  },
  {
    id: 'subscription-tiers',
    title: 'Subscription tiers',
    body: [
      'Tiers determine listing visibility, number of open proposals, and access to premium leads.',
      'Upgrade or downgrade any time from the account page. Changes apply at the next billing cycle.',
    ],
    links: [{ label: 'Pricing', href: '/pricing' }],
  },
  {
    id: 'reviews-ratings',
    title: 'Reviews and ratings',
    body: [
      'Clients can review developers after a project closes. High-rated developers rank higher in directory results.',
      'If a review appears to violate guidelines, contact support — reviews are moderated but not pre-screened.',
    ],
  },
  {
    id: 'payment-onboarding',
    title: 'Payment and onboarding',
    body: [
      'Subscriptions are billed via Stripe. Onboarding collects your public profile details and payout preferences for affiliate earnings.',
      'Stripe Connect Express handles payouts for the affiliate program at a 20% flat lifetime commission.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={dvlpConfig} topics={TOPICS} />;
}
