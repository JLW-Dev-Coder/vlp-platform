import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tavlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Refund Policy | Tax Avatar Pro',
  description: 'Refund Policy for Tax Avatar Pro monthly subscriptions and related digital purchases.',
}

export default function RefundPage() {
  return (
    <LegalPageLayout
      config={tavlpConfig}
      title="Refund Policy"
      subtitle="Monthly Subscription Purchases"
      lastUpdated="April 27, 2026"
      currentPage="refund"
    >
      <LegalSection>
        <p>
          Tax Avatar Pro is a $29/mo managed AI YouTube channel subscription (the &ldquo;Service&rdquo;), sold as an add-on to TaxClaim Pro. This Refund Policy applies to all purchases of the Service. For help with an order, use the{' '}
          <Link href="/contact" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            contact page
          </Link>.
        </p>
      </LegalSection>

      <LegalSection title="A. What You're Buying">
        <ul className="space-y-2">
          {[
            'A monthly subscription to a managed AI YouTube channel service.',
            'Avatar selection, script writing, episode generation, channel publishing, and growth activities delivered as a continuous service.',
            'Digitally delivered work product, not a physical shipped good.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="B. General Rule">
        <p>Because Tax Avatar Pro begins delivering work and committing production capacity immediately upon subscription, monthly fees are <strong className="text-text-primary">non-refundable once the billing period has begun</strong>. Cancellation stops future billing but does not refund the current month.</p>
      </LegalSection>

      <LegalSection title="C. When We May Approve a Refund">
        <p className="mb-4">We may approve a refund, partial refund, service credit, or adjustment in situations such as:</p>
        <ul className="space-y-2">
          {[
            'Duplicate charge for the same billing period.',
            'Unauthorized purchase claim, subject to review and payment processor rules.',
            'Technical failure where paid Service was never delivered (e.g., no episodes produced or published during the billing period).',
            'Provider-side inability to deliver the purchased Service for reasons not caused by Client delay, missing information, or third-party platform restrictions.',
            'Verified billing error or materially incorrect charge amount.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="D. When We Don't Refund">
        <p className="mb-4">Refunds are not typically provided for:</p>
        <ul className="space-y-2">
          {[
            'Change of mind after the billing period has begun.',
            'Episodes already produced or published during the billing period.',
            'Client delay in approving scripts, granting YouTube access, or providing required responses.',
            'Third-party platform limitations, outages, account restrictions, or policy changes outside Provider control (including HeyGen and YouTube).',
            'YouTube subscriber, view count, watch time, or monetization outcomes.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="E. How to Request a Refund Review">
        <ol className="space-y-2">
          {[
            'Submit your request through the Tax Avatar Pro contact page.',
            'Include your name, purchase email, billing date, and a clear description of the issue.',
            'If available, include invoice, receipt, transaction ID, and any relevant channel or workspace identifiers.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">{i+1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection title="F. Chargebacks">
        <p>Initiating a chargeback or payment dispute may result in immediate suspension of access, pausing of episode production, and removal of unpublished content while the matter is reviewed.</p>
      </LegalSection>

      <LegalSection title="G. Cancellation vs. Refund">
        <p>Cancellation stops future billing at the end of the current billing period. Cancellation is not a refund. Use the Client dashboard to cancel at any time.</p>
      </LegalSection>

      <LegalSection title="H. Policy Changes">
        <p>We may update this policy from time to time. The last updated date reflects the most recent revision.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
