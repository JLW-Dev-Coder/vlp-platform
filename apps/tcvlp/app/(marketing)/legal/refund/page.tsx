import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tcvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Refund Policy | TaxClaim Pro',
  description: 'Refund Policy for TaxClaim Pro subscriptions, Form 843 preparation guides, and related digital services.',
}

export default function RefundPage() {
  return (
    <LegalPageLayout
      config={tcvlpConfig}
      title="Refund Policy"
      subtitle="Subscriptions, Preparation Guides, and Service Purchases"
      lastUpdated="April 16, 2026"
      currentPage="refund"
    >
      <LegalSection>
        <p>
          This Refund Policy applies to purchases made through TaxClaim Pro, including monthly subscriptions (Starter, Professional, Firm tiers), Form 843 preparation guides, branded client page setup, and related digital services. For help with an order, use the{' '}
          <Link href="/support" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>.
        </p>
      </LegalSection>

      <LegalSection title="A. What You're Buying">
        <ul className="space-y-2">
          {[
            'Monthly subscription access to TaxClaim Pro dashboard, branded client pages, and Form 843 preparation features.',
            'Digitally delivered preparation guides, not physical goods.',
            'Immediate access to the platform upon successful subscription payment.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="B. General Rule">
        <p>Because TaxClaim Pro is a digital subscription service with immediate access, subscription fees are generally <strong className="text-text-primary">non-refundable once the billing period has begun</strong>. Client may cancel a subscription at any time through the dashboard; cancellation stops future billing but does not refund the current billing period.</p>
      </LegalSection>

      <LegalSection title="C. When We May Approve a Refund">
        <p className="mb-4">We may approve a refund, partial refund, service credit, or adjustment in situations such as:</p>
        <ul className="space-y-2">
          {[
            'Duplicate charge for the same subscription period.',
            'Unauthorized purchase claim, subject to review and payment processor rules.',
            'Technical failure where the dashboard or core services were unavailable for an extended period during the billing cycle.',
            'Verified billing error or materially incorrect charge amount.',
            'Provider-side discontinuation of a core service feature during a paid subscription period.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-4 text-xs opacity-70">Refund decisions are case-by-case and may require documentation, timestamps, platform details, or payment evidence.</p>
      </LegalSection>

      <LegalSection title="D. When We Don't Refund">
        <p className="mb-4">Refunds are not typically provided for:</p>
        <ul className="space-y-2">
          {[
            'Change of mind after a billing period has begun.',
            'Partial-month cancellations (the current billing period remains paid through its end date).',
            'Generated Form 843 preparation guides already created during the billing period.',
            'Client delay in using the platform, configuring the branded page, or submitting claim data.',
            'Third-party platform limitations, outages, or policy changes (Stripe, Cloudflare, Cal.com, etc.) outside Provider control.',
            'IRS rejection, non-acceptance, or delay in processing any Form 843 submission Client prepared using TaxClaim Pro.',
            'Kwong eligibility determinations made by the platform that Client or end-taxpayer disagree with.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="E. How to Request a Refund Review">
        <ol className="space-y-2">
          {[
            'Submit your request through the TaxClaim Pro support page.',
            'Include your name, subscription email, order date, tier, and a clear description of the issue.',
            'If available, include your Stripe subscription ID, invoice, receipt, or transaction ID.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">{i+1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection title="F. Chargebacks">
        <p>Initiating a chargeback or payment dispute with Stripe may result in temporary suspension of access to the TaxClaim Pro dashboard, pausing of branded client page rendering, or withholding of preparation guide generation while the matter is reviewed.</p>
      </LegalSection>

      <LegalSection title="G. Policy Changes">
        <p>We may update this policy from time to time. The last updated date reflects the most recent revision. Material changes will be communicated to active subscribers by email.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
