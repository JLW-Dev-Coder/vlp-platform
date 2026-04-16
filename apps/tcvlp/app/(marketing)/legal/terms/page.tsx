import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tcvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Terms of Service | TaxClaim Pro',
  description: 'Terms for TaxClaim Pro Form 843 preparation, branded client pages, subscription services, and platform use.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      config={tcvlpConfig}
      title="Terms of Service"
      subtitle="Form 843 Preparation, Subscription, and Service Use Agreement"
      lastUpdated="April 16, 2026"
      currentPage="terms"
    >
      <LegalSection>
        <p>This Agreement is entered into by and between TaxClaim Pro&apos;s operating entity (&ldquo;Provider&rdquo;) and the individual or entity purchasing, accessing, or using TaxClaim Pro products or services (&ldquo;Client&rdquo;).</p>
      </LegalSection>

      <LegalSection title="Section 1. Covered Services & Scope of Use">
        <ul className="mb-4 space-y-2">
          {[
            'IRS Form 843 preparation guides generated from Client-submitted data',
            'Branded client landing pages for end-taxpayer claim intake',
            'IRS transcript parsing and automated penalty calculation',
            'Subscription access to dashboard, submission tracking, and related tools',
            'Related account access, support, and digital deliverables',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p className="mb-3"><strong className="text-text-primary">Critical disclaimer:</strong> TaxClaim Pro generates PREPARATION GUIDES for IRS Form 843. The generated document is NOT an official IRS form and cannot be filed with the IRS as-is. Client must transfer the prepared information to the official IRS Form 843 (available at irs.gov/pub/irs-pdf/f843.pdf) before mailing to the IRS.</p>
        <p>Unless expressly stated in writing, subscriptions do not include unlimited preparation guides beyond the tier limits, custom integrations, legal review, compliance review, tax advice, accounting advice, or regulated professional services.</p>
      </LegalSection>

      <LegalSection title="Section 2. No Professional or Regulated Advice">
        <p className="mb-3">Client acknowledges that Provider does not provide legal, tax, accounting, financial, compliance, or other regulated professional advice under this Agreement unless separately and expressly stated in writing.</p>
        <p>Any templates, examples, penalty calculations, eligibility checks, or preparation guidance are provided for operational and informational purposes only. Client is responsible for verifying all computed values, transcript parsings, and Form 843 entries before submitting to the IRS.</p>
      </LegalSection>

      <LegalSection title="Section 3. Client Responsibilities">
        <ul className="space-y-2">
          {[
            'Provide accurate business, billing, and access information.',
            'Provide required content, approvals, credentials, and feedback in a timely manner.',
            'Review all Form 843 preparation guides before using them with end-taxpayers or submitting to the IRS.',
            "Ensure that Client's use of any deliverable complies with Client's own obligations, licenses, contracts, professional ethics rules, and applicable law.",
            'Not submit end-taxpayer data to the platform without appropriate authorization or signed Form 2848 (Power of Attorney) where required.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 4. Account Access & Credentials">
        <p className="mb-3">Client is responsible for maintaining secure control of the accounts, dashboard, branded client pages, and credentials used in connection with TaxClaim Pro services.</p>
        <p>Provider may rely on the credentials, authentication sessions, billing details, and account-linked identifiers supplied by Client to determine authorized access and service delivery.</p>
      </LegalSection>

      <LegalSection title="Section 5. Third-Party Platforms, Tools, and Dependencies">
        <p className="mb-3">TaxClaim Pro depends on third-party platforms including Stripe (payments), Cloudflare (hosting), Resend (email), Cal.com (booking), and Google (authentication).</p>
        <p>Provider is not responsible for outages, policy changes, pricing changes, API changes, account restrictions, lost access, feature removals, or technical limitations caused by third-party providers.</p>
      </LegalSection>

      <LegalSection title="Section 6. Acceptance of Deliverables">
        <p className="mb-3">Client is deemed to have accepted deliverables upon:</p>
        <ul className="space-y-2">
          {[
            'Generation and display of a Form 843 preparation guide through the platform,',
            'Client accessing, downloading, or using any generated preparation guide, or',
            'Client using, publishing, or relying on the branded client page or any submission record.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 7. Fees and Payment">
        <p className="mb-3">Client agrees to pay the subscription fees presented at checkout for the purchased TaxClaim Pro tier (Starter, Professional, or Firm).</p>
        <p>Subscriptions are billed monthly in advance via Stripe and are non-refundable except as described in the <Link href="/legal/refund" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Refund Policy</Link>. Client may cancel a subscription at any time through the dashboard; cancellation stops future billing but does not refund the current billing period.</p>
      </LegalSection>

      <LegalSection title="Section 8. Privacy and Data Handling">
        <p>Provider may access and handle Client information and end-taxpayer data only as reasonably necessary to deliver services, troubleshoot issues, verify work, provide support, maintain records, and protect service integrity. Additional details are described in the <Link href="/legal/privacy" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Privacy Policy</Link>.</p>
      </LegalSection>

      <LegalSection title="Section 9. Intellectual Property & License">
        <p className="mb-3">Provider retains all rights in the TaxClaim Pro platform, brand, code, templates, workflows, Form 843 preparation logic, transcript parsing algorithms, and related proprietary materials except where a separate written transfer or license expressly says otherwise.</p>
        <p>Client receives a limited, non-exclusive, non-transferable license to use generated preparation guides for Client&apos;s own tax practice and end-taxpayer work. Client may not resell the platform, redistribute generated guides as a service to non-Clients, sublicense access, or falsely claim authorship of Provider-owned materials unless expressly authorized in writing.</p>
      </LegalSection>

      <LegalSection title="Section 10. Service Limits & Tier Enforcement">
        <p className="mb-3">Each subscription tier has defined service limits (number of branded pages, preparation guides per month, transcript parses, etc.) as published on the pricing page.</p>
        <p>Provider may enforce these limits through rate limiting, queueing, or feature restrictions. Requests exceeding tier limits may be delayed, denied, or treated as a scope change requiring an upgrade.</p>
      </LegalSection>

      <LegalSection title="Section 11. No Guarantees">
        <p>Provider does not guarantee IRS acceptance of any Form 843 submission, refund amounts, specific claim outcomes, Kwong eligibility determinations, time savings, business outcomes, or uninterrupted availability of any third-party platform. The Kwong v. US ruling window closes July 10, 2026; Provider does not guarantee the continued relevance or availability of Kwong-specific features after that date.</p>
      </LegalSection>

      <LegalSection title="Section 12. Limitation of Liability">
        <p className="mb-3">To the maximum extent permitted by law, Provider will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost revenue, lost profits, lost data, business interruption, IRS rejection of submitted claims, or reliance-based harm arising out of or related to this Agreement, the deliverables, or Client&apos;s use of any product or service.</p>
        <p>Provider&apos;s total aggregate liability under this Agreement will not exceed the subscription fees paid by Client in the twelve months preceding the claim.</p>
      </LegalSection>

      <LegalSection title="Section 13. Indemnification">
        <p className="mb-3">Client agrees to indemnify and hold Provider harmless from any claim, loss, or expense arising from:</p>
        <ul className="space-y-2">
          {[
            "Client's misuse of deliverables or the platform,",
            "Client's breach of this Agreement,",
            "Client's violation of applicable law, professional ethics rules, or IRS regulations, or",
            "Client's violation of end-taxpayer rights, including unauthorized submission of third-party data.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 14. Suspension or Termination">
        <p>Provider may suspend or terminate access if Client materially breaches this Agreement, fails to pay subscription fees, engages in abusive conduct, misuses the platform, creates security risk, or initiates fraudulent payment activity.</p>
      </LegalSection>

      <LegalSection title="Section 15. Governing Law & Venue">
        <p className="mb-3">This Agreement is governed by the laws of the State of California, without regard to conflict-of-law principles.</p>
        <p>Any dispute arising from this Agreement will be resolved in the state or federal courts located in San Diego County, California, unless the Parties agree in writing to another dispute process.</p>
      </LegalSection>

      <LegalSection title="Section 16. Entire Agreement">
        <p>This Agreement, together with the Privacy Policy, Refund Policy, and any written invoice or order expressly incorporated by reference, constitutes the entire agreement between the Parties regarding the subject matter described here.</p>
      </LegalSection>

      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Electronic Acceptance</h2>
        <p className="text-sm leading-relaxed text-text-muted">By purchasing a subscription, accessing the dashboard, generating a Form 843 preparation guide, or using any TaxClaim Pro product or service, Client acknowledges that they have read, understood, and agreed to be bound by these terms.</p>
      </div>
    </LegalPageLayout>
  )
}
