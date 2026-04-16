import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { vlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Refund Policy | Virtual Launch Pro',
  description: 'Refund Policy for Virtual Launch Pro installs, templates, setup services, and related digital purchases.',
}

export default function RefundPage() {
  return (
    <LegalPageLayout
      config={vlpConfig}
      title="Refund Policy"
      subtitle="Digital Installs, Templates, and Service Purchases"
      lastUpdated="March 17, 2026"
      currentPage="refund"
    >
      <LegalSection>
        <p>
          This Refund Policy applies to purchases made through Virtual Launch Pro, including setup packages, digital templates, implementation services, onboarding systems, automation builds, and related digital deliverables. For help with an order, use the{' '}
          <Link href="/contact" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>.
        </p>
      </LegalSection>

      <LegalSection title="A. What You're Buying">
        <ul className="space-y-2">
          {['Digital products and service-based setup work, including templates, workflows, configuration, implementation, and related assets.','Digitally delivered access or work product, not a physical shipped good.','Fixed-scope or staged services that may begin promptly after purchase, scheduling, kickoff, or credential handoff.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="B. General Rule">
        <p>Because Virtual Launch Pro offers digital products, implementation work, and time-based service capacity that can be reserved or started quickly, purchases are generally <strong className="text-text-primary">non-refundable once delivery has started, access has been granted, files have been sent, or implementation work has begun</strong>.</p>
      </LegalSection>

      <LegalSection title="C. When We May Approve a Refund">
        <p className="mb-4">We may approve a refund, partial refund, service credit, or adjustment in situations such as:</p>
        <ul className="space-y-2">
          {['Duplicate charge for the same order.','Unauthorized purchase claim, subject to review and payment processor rules.','Technical failure where paid digital access or files were never delivered.','Provider-side inability to start the purchased service within the stated scope for reasons not caused by Client delay, missing information, or third-party platform restrictions.','Verified billing error or materially incorrect charge amount.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p className="mt-4 text-xs opacity-70">Refund decisions are case-by-case and may require documentation, timestamps, platform details, or payment evidence.</p>
      </LegalSection>

      <LegalSection title="D. When We Don't Refund">
        <p className="mb-4">Refunds are not typically provided for:</p>
        <ul className="space-y-2">
          {['Change of mind after purchase.','Work already performed, including research, setup, implementation, revision rounds, automation configuration, or template customization.','Delivered digital files or assets.','Client delay in providing content, credentials, approvals, access, or required responses.','Third-party platform limitations, outages, account restrictions, or policy changes outside Provider control.','Mismatch between purchased scope and unpurchased custom requests.'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="E. How to Request a Refund Review">
        <ol className="space-y-2">
          {['Submit your request through your official Virtual Launch Pro support channel.','Include your name, purchase email, order date, and a clear description of the issue.','If available, include invoice, receipt, transaction ID, and any relevant project or workspace identifiers.'].map((item, i) => (
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
