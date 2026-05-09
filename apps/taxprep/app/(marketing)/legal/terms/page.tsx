import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Terms of Service | Tax Prep Pro',
  description:
    'Terms for Tax Prep Pro buildouts, SuiteDash workspaces, member training, and related digital deliverables.',
}

// TODO(legal): Adapted from apps/tcvlp terms with TPP-specific language —
// Form 843/Kwong sections removed, SuiteDash-buildout sections added.
// Awaiting Jamie sign-off on final wording.

export default function TermsPage() {
  return (
    <LegalPageLayout
      config={tppConfig}
      title="Terms of Service"
      subtitle="Buildout & Subscription Agreement"
      lastUpdated="May 6, 2026"
      currentPage="terms"
    >
      <LegalSection>
        <p>
          Tax Prep Pro provides productized SuiteDash buildouts, member training, and related digital
          deliverables (the &ldquo;Service&rdquo;). This Agreement is entered into by and between Tax Prep Pro&rsquo;s
          operating entity (&ldquo;Provider&rdquo;) and the individual or entity purchasing, accessing, or using the
          Service (&ldquo;Client&rdquo;).
        </p>
      </LegalSection>

      <LegalSection title="Section 1. Covered Services & Scope of Use">
        <ul className="mb-4 space-y-2">
          {[
            'A branded SuiteDash workspace provisioned under Provider’s reseller plan',
            'The 8-phase client journey installed into the workspace',
            'Adaptive intake forms for the filing types Client elects',
            'Member training (videos and live walkthrough)',
            'Optional Tax Monitor Pro bundle and Ongoing Support tiers',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p>
          Unless expressly stated in writing, purchases do not include unlimited revisions, custom development
          beyond the purchased scope, legal review, compliance review, tax advice, accounting advice, or
          regulated professional services.
        </p>
      </LegalSection>

      <LegalSection title="Section 2. No Professional or Regulated Advice">
        <p className="mb-3">
          Client acknowledges that Provider does not provide legal, tax, accounting, financial, compliance,
          HR, employment, or other regulated professional advice under this Agreement unless separately and
          expressly stated in writing.
        </p>
        <p>
          Any templates, examples, content, structure, prompts, or suggestions provided through the Service
          are for operational and informational purposes only.
        </p>
      </LegalSection>

      <LegalSection title="Section 3. Client Responsibilities">
        <ul className="space-y-2">
          {[
            'Provide accurate business, billing, and access information.',
            'Provide branding assets, intake-question content, and engagement-letter language in a timely manner.',
            'Review all deliverables before relying on them in operations or client onboarding.',
            "Ensure that Client's use of the workspace complies with Client's professional obligations, licenses, and applicable law.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 4. SuiteDash Reseller Provisioning">
        {/* TODO(legal): Jamie to confirm reseller-relationship language. */}
        <p>
          Tax Prep Pro workspaces are provisioned as child accounts under Provider&rsquo;s SuiteDash reseller
          plan. Provider retains administrative access for buildout, support, billing reconciliation, and
          deprovisioning at end of engagement. Client retains operational control of the workspace.
        </p>
      </LegalSection>

      <LegalSection title="Section 5. Third-Party Platforms">
        <p>
          The Service depends on third-party platforms including SuiteDash, Stripe, Cloudflare, Resend, and
          Google. Provider is not responsible for outages, policy changes, pricing changes, API changes, or
          feature removals caused by third-party providers.
        </p>
      </LegalSection>

      <LegalSection title="Section 6. Acceptance of Deliverables">
        <p className="mb-3">A deliverable is deemed accepted upon the earliest of:</p>
        <ul className="space-y-2">
          {[
            'Delivery of files, workspace access, or configuration handoff,',
            'The Service becoming available for Client use, or',
            'Client using, approving, or onboarding live taxpayers into the workspace.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 7. Fees and Payment">
        <p className="mb-3">
          {/* TODO(legal): Confirm refund-window length with Jamie. */}
          Client agrees to pay the fees presented at checkout, invoice, proposal, or service order — including
          the setup fee at engagement kickoff and the monthly per-active-member subscription thereafter.
        </p>
        <p>
          Unless otherwise stated in writing, fees are due in advance and are non-refundable except as
          described in the{' '}
          <Link href="/legal/refund" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            Refund Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Section 8. Privacy and Data Handling">
        <p>
          Provider may access and handle Client information only as reasonably necessary to deliver the
          Service. Additional details are described in the{' '}
          <Link href="/legal/privacy" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            Privacy Policy
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="Section 9. Intellectual Property & License">
        <p className="mb-3">
          Provider retains all rights in Provider-owned templates, design systems, frameworks, code, training
          materials, processes, and related proprietary materials except where a separate written transfer or
          license expressly says otherwise.
        </p>
        <p>
          Client receives a limited, non-exclusive, non-transferable license to use purchased deliverables for
          Client&rsquo;s internal business use. Client may not resell, redistribute, sublicense, or falsely claim
          authorship of Provider-owned materials unless expressly authorized in writing.
        </p>
      </LegalSection>

      <LegalSection title="Section 10. Revisions, Scope, and Change Requests">
        <p>
          Any changes, additions, integrations, or customizations to the Service outside the purchased scope
          are outside this Agreement unless separately approved in writing.
        </p>
      </LegalSection>

      <LegalSection title="Section 11. No Guarantees">
        <p>
          Provider does not guarantee revenue, lead volume, conversion rate, client retention, hiring success,
          time savings, business outcomes, regulatory outcomes, or uninterrupted availability of any
          third-party platform.
        </p>
      </LegalSection>

      <LegalSection title="Section 12. Limitation of Liability">
        <p className="mb-3">
          To the maximum extent permitted by law, Provider will not be liable for any indirect, incidental,
          special, consequential, exemplary, or punitive damages, including lost revenue, lost profits, lost
          data, business interruption, or reliance-based harm arising out of or related to this Agreement.
        </p>
        <p>
          Provider&rsquo;s total aggregate liability under this Agreement will not exceed the amount actually paid
          by Client for the specific product or service giving rise to the claim.
        </p>
      </LegalSection>

      <LegalSection title="Section 13. Indemnification">
        <ul className="space-y-2">
          {[
            "Client's misuse of deliverables or systems,",
            "Client's breach of this Agreement,",
            "Client's violation of applicable law, or",
            "Client's violation of a third party's rights, terms, or content restrictions.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 14. Suspension or Termination">
        <p>
          Provider may suspend or terminate access or buildout work if Client materially breaches this
          Agreement, fails to pay, engages in abusive conduct, misuses systems, creates security risk, or
          initiates fraudulent payment activity.
        </p>
      </LegalSection>

      <LegalSection title="Section 15. Governing Law & Venue">
        <p className="mb-3">
          This Agreement is governed by the laws of the State of California, without regard to conflict-of-law
          principles.
        </p>
        <p>
          Any dispute arising from this Agreement will be resolved in the state or federal courts located in
          San Diego County, California, unless the Parties agree in writing to another dispute process.
        </p>
      </LegalSection>

      <LegalSection title="Section 16. Entire Agreement">
        <p>
          This Agreement, together with the Privacy Policy, Refund Policy, and any written invoice, proposal,
          order, or scope document expressly incorporated by reference, constitutes the entire agreement
          between the Parties regarding the subject matter described here.
        </p>
      </LegalSection>

      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Electronic Acceptance</h2>
        <p className="text-sm leading-relaxed text-text-muted">
          By purchasing, scheduling, accessing, or using the Service, Client acknowledges that they have read,
          understood, and agreed to be bound by these terms.
        </p>
      </div>
    </LegalPageLayout>
  )
}
