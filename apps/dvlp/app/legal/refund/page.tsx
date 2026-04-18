import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { dvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Refund Policy | Developers VLP',
  description: 'Refund Policy for Developers VLP subscriptions, tokens, and related digital purchases.',
}

export default function RefundPage() {
  return (
    <LegalPageLayout
      config={dvlpConfig}
      title="Refund Policy"
      subtitle="Digital Service Purchases"
      lastUpdated="April 17, 2026"
      currentPage="refund"
    >
      <LegalSection>
        <p>
          Developers VLP provides a digital service offering subscriptions, tokens, and related digital deliverables (the &ldquo;Service&rdquo;). This Refund Policy applies to all purchases of the Service made through Developers VLP. For help with an order, use the{' '}
          <Link href="/support" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>.
        </p>
      </LegalSection>

      <LegalSection title="A. What You're Buying">
        <ul className="space-y-2">
          {['Subscriptions, tokens, digital deliverables, and related services delivered through the Service.','Digitally delivered access or work product, not a physical shipped good.','Subscriptions, tokens, and services that may be activated or begin promptly after purchase.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="B. General Rule">
        <p>Because Developers VLP offers digital products and services that can be activated or started quickly, purchases are generally <strong className="text-text-primary">non-refundable once delivery has started, access has been granted, files have been sent, or the Service has begun</strong>.</p>
      </LegalSection>

      <LegalSection title="C. When We May Approve a Refund">
        <p className="mb-4">We may approve a refund, partial refund, service credit, or adjustment in situations such as:</p>
        <ul className="space-y-2">
          {['Duplicate charge for the same order.','Unauthorized purchase claim, subject to review and payment processor rules.','Technical failure where paid digital access or files were never delivered.','Provider-side inability to deliver the purchased Service within the stated scope for reasons not caused by Client delay, missing information, or third-party platform restrictions.','Verified billing error or materially incorrect charge amount.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-4 text-xs opacity-70">Refund decisions are case-by-case and may require documentation, timestamps, platform details, or payment evidence.</p>
      </LegalSection>

      <LegalSection title="D. When We Don't Refund">
        <p className="mb-4">Refunds are not typically provided for:</p>
        <ul className="space-y-2">
          {['Change of mind after purchase.','Services already performed or consumed through the Service, including research, configuration, or revisions.','Delivered digital files or deliverables.','Client delay in providing content, credentials, approvals, access, or required responses.','Third-party platform limitations, outages, account restrictions, or policy changes outside Provider control.','Mismatch between purchased scope and unpurchased custom requests.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="E. How to Request a Refund Review">
        <ol className="space-y-2">
          {['Submit your request through your official Developers VLP support channel.','Include your name, purchase email, order date, and a clear description of the issue.','If available, include invoice, receipt, transaction ID, and any relevant project or workspace identifiers.'].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">{i+1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection title="F. Chargebacks">
        <p>Initiating a chargeback or payment dispute may result in temporary suspension of access, pausing of project work, or withholding of undelivered items while the matter is reviewed.</p>
      </LegalSection>

      <LegalSection title="G. Policy Changes">
        <p>We may update this policy from time to time. The last updated date reflects the most recent revision.</p>
      </LegalSection>
    </LegalPageLayout>
  )
}
