'use client';

import { HelpCenter, type HelpTopic } from '@vlp/member-ui';
import { tcvlpConfig } from '@/lib/platform-config';

const TOPICS: HelpTopic[] = [
  {
    id: 'branded-claim-page',
    title: 'Setting up your branded claim page',
    body: [
      'Complete onboarding to generate your firm slug. Your branded claim page lives at /claim?slug=your-firm-slug and uses your logo, firm name, and contact details.',
      'Update your firm profile at any time from Dashboard → Settings. Logo, firm name, phone, and contact email are editable from a single form.',
    ],
  },
  {
    id: 'client-transcript-submission',
    title: 'How clients submit transcripts',
    body: [
      'Clients land on your branded claim page, upload their IRS account transcript PDF, and walk through the five-step Form 843 wizard.',
      'Transcripts are parsed server-side. Kwong-eligible penalty rows (Jan 20 2020 – Jul 10 2023) are auto-identified and pre-filled into Form 843 line items.',
    ],
  },
  {
    id: 'form-843-generation',
    title: 'Generating Form 843 from transcript data',
    body: [
      'After eligibility is verified in Step 2, Step 3 populates Form 843 fields from parsed transcript data. A taxpayer letter is appended as additional pages of the generated PDF.',
      'Step 4 provides the filing deadline (Jul 10 2026) and the correct IRS mailing address for the taxpayer state. Clients can opt in for email/phone/SMS status notifications.',
    ],
  },
  {
    id: 'subscription-billing',
    title: 'Subscription and billing',
    body: [
      'TaxClaim Pro offers three tiers: Starter ($10/mo), Professional ($29/mo), and Firm ($79/mo). Upgrades are immediate; downgrades apply at the next billing cycle.',
      'All charges run through Stripe. Receipts and invoices are available from Dashboard → Settings. Cancel anytime — access continues through the end of the current billing period.',
    ],
  },
  {
    id: 'submissions-notifications',
    title: 'Submissions and notifications',
    body: [
      'Every client submission appears in Dashboard → Submissions with taxpayer name, claim amount, and contact preference.',
      'When a client submits Form 843, you receive an email notification via Resend. Toggle notifications on/off from Dashboard → Settings.',
    ],
  },
  {
    id: 'refunds-cancellations',
    title: 'Refunds and cancellations',
    body: [
      'Subscriptions can be cancelled at any time. Prior billing periods are non-refundable; access continues until the end of the paid period.',
      'For billing disputes, contact support before initiating a chargeback — we resolve most issues within one business day.',
    ],
    links: [
      { label: 'Refund Policy', href: '/legal/refund' },
      { label: 'Terms of Service', href: '/legal/terms' },
    ],
  },
  {
    id: 'transcript-parsing-issues',
    title: 'Common transcript parsing issues',
    body: [
      'Scanned or image-only PDFs without embedded text will not parse. Request the taxpayer download the IRS account transcript directly from IRS.gov — that PDF always contains extractable text.',
      'If parsing succeeds but penalty rows look wrong, check the tax year range on the transcript and confirm it overlaps with the Kwong window (Jan 20 2020 – Jul 10 2023).',
    ],
  },
  {
    id: 'team-members',
    title: 'Adding team members',
    body: [
      'Firm-tier subscribers can invite additional practitioners from Dashboard → Settings. Each team member gets their own login and access to firm submissions.',
      'Starter and Professional tiers are single-user. Upgrade to Firm to enable multi-practitioner access.',
    ],
  },
];

export default function HelpClient() {
  return <HelpCenter config={tcvlpConfig} topics={TOPICS} />;
}
