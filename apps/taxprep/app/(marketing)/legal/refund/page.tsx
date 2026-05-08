import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Refund Policy | Tax Prep Pro',
  description: 'Refund Policy for Tax Prep Pro buildouts, subscriptions, and digital deliverables.',
}

// TODO(legal): Adapted from apps/tcvlp refund with TPP-specific language —
// Form 843/Kwong sections removed, buildout-specific clauses added.
// Refund-window length still pending Jamie sign-off.

export default function RefundPage() {
  return (
    <LegalPageLayout
      config={tppConfig}
      title="Refund Policy"
      subtitle="Buildouts, Subscriptions & Digital Deliverables"
      lastUpdated="May 6, 2026"
      currentPage="refund"
    >
      <LegalSection>
        <p>
          Tax Prep Pro provides productized SuiteDash buildouts, member training, optional bundles, and
          related digital deliverables (the &ldquo;Service&rdquo;). This Refund Policy applies to all purchases of the
          Service. For help with an order, use the{' '}
          <Link href="/contact" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            contact page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="A. What You're Buying">
        <ul className="space-y-2">
          {[
            'A productized SuiteDash buildout, member training, and related digital deliverables.',
            'Digitally delivered access and work product, not a physical shipped good.',
            'Buildouts and subscriptions that begin promptly after kickoff.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="B. General Rule">
        <p>
          {/* TODO(legal): Confirm exact refund-window length with Jamie. */}
          Because Tax Prep Pro buildouts begin shortly after kickoff and are paired with a subscription,
          purchases are generally <strong className="text-text-primary">non-refundable once buildout work has
          started, workspace access has been granted, training has been delivered, or the subscription has
          begun</strong>.
        </p>
      </LegalSection>

      <LegalSection title="C. When We May Approve a Refund">
        <p className="mb-4">We may approve a refund, partial refund, service credit, or adjustment in situations such as:</p>
        <ul className="space-y-2">
          {[
            'Duplicate charge for the same order.',
            'Unauthorized purchase claim, subject to review and payment processor rules.',
            'Technical failure where paid digital access was never delivered.',
            'Provider-side inability to deliver the purchased Service within the stated scope for reasons not caused by Client delay or third-party platform restrictions.',
            'Verified billing error or materially incorrect charge amount.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs opacity-70">
          Refund decisions are case-by-case and may require documentation, timestamps, platform details, or
          payment evidence.
        </p>
      </LegalSection>

      <LegalSection title="D. When We Don't Refund">
        <p className="mb-4">Refunds are not typically provided for:</p>
        <ul className="space-y-2">
          {[
            'Change of mind after kickoff.',
            'Buildout work already performed, including configuration, branding, and journey installation.',
            'Member training already delivered.',
            'Client delay in providing branding assets, intake content, approvals, or required responses.',
            'Third-party platform limitations, outages, or policy changes outside Provider control (including SuiteDash, Stripe, Cloudflare).',
            'Mismatch between purchased scope and unpurchased custom requests.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="E. Subscription Cancellation">
        {/* TODO(legal): Jamie to confirm subscription cancellation terms. */}
        <p>
          Monthly per-active-member subscription fees may be canceled at any time effective at the end of the
          then-current billing cycle. No prorated refunds are provided for partial months. Cancellation
          requests must be submitted through the contact page.
        </p>
      </LegalSection>

      <LegalSection title="F. How to Request a Refund Review">
        <ol className="space-y-2">
          {[
            'Submit your request through the Tax Prep Pro contact page.',
            'Include your name, purchase email, order date, and a clear description of the issue.',
            'If available, include invoice, receipt, transaction ID, and any relevant project or workspace identifiers.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-primary/20 text-xs font-bold text-brand-primary">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </LegalSection>

      <LegalSection title="G. Chargebacks">
        <p>
          Initiating a chargeback or payment dispute may result in temporary suspension of access, pausing of
          buildout work, deprovisioning of the SuiteDash workspace, or withholding of undelivered items while
          the matter is reviewed.
        </p>
      </LegalSection>

      <LegalSection title="H. Policy Changes">
        <p>
          We may update this policy from time to time. The last updated date reflects the most recent
          revision.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
