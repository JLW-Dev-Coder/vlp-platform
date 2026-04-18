import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { ttmpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Terms of Service | Transcript Tax Monitor',
  description: 'Terms for Transcript Tax Monitor digital products, installs, templates, implementation services, and platform use.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      config={ttmpConfig}
      title="Terms of Service"
      subtitle="Digital Products, Installs, and Service Use Agreement"
      lastUpdated="March 17, 2026"
      currentPage="terms"
    >
      <LegalSection>
        <p>This Agreement is entered into by and between Transcript Tax Monitor&apos;s operating entity (&ldquo;Provider&rdquo;) and the individual or entity purchasing, accessing, or using Transcript Tax Monitor products or services (&ldquo;Client&rdquo;).</p>
      </LegalSection>

      <LegalSection title="Section 1. Covered Services & Scope of Use">
        <ul className="mb-4 space-y-2">
          {['Digital templates, documents, and workflow assets','Setup, implementation, and onboarding services','Automation configuration and platform customization','Related account access, training, support, and digital deliverables'].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p>Unless expressly stated in writing, purchases do not include unlimited revisions, custom development beyond the purchased scope, legal review, compliance review, tax advice, accounting advice, employment advice, or regulated professional services.</p>
      </LegalSection>

      <LegalSection title="Section 2. No Professional or Regulated Advice">
        <p className="mb-3">Client acknowledges that Provider does not provide legal, tax, accounting, financial, compliance, HR, employment, or other regulated professional advice under this Agreement unless separately and expressly stated in writing.</p>
        <p>Any templates, examples, workflows, automations, labels, prompts, structure, content, or implementation suggestions are provided for operational and informational purposes only.</p>
      </LegalSection>

      <LegalSection title="Section 3. Client Responsibilities">
        <ul className="space-y-2">
          {['Provide accurate business, billing, and access information.','Provide required content, approvals, credentials, and feedback in a timely manner.','Review all deliverables before relying on them in operations, sales, hiring, service delivery, or compliance activity.',"Ensure that Client's use of any deliverable complies with Client's own obligations, licenses, contracts, policies, and applicable law."].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 4. Account Access & Credentials">
        <p className="mb-3">Client is responsible for maintaining secure control of the accounts, workspaces, tools, and credentials used in connection with Transcript Tax Monitor services.</p>
        <p>Provider may rely on the credentials, invitations, workspace permissions, billing details, and account-linked identifiers supplied by Client to determine authorized access and service delivery.</p>
      </LegalSection>

      <LegalSection title="Section 5. Third-Party Platforms, Tools, and Dependencies">
        <p className="mb-3">Transcript Tax Monitor services may depend on third-party platforms, hosting providers, payment processors, communication tools, productivity systems, automation platforms, or related software selected by Client or Provider.</p>
        <p>Provider is not responsible for outages, policy changes, pricing changes, API changes, account restrictions, lost access, feature removals, or technical limitations caused by third-party providers.</p>
      </LegalSection>

      <LegalSection title="Section 6. Acceptance of Deliverables">
        <ul className="space-y-2">
          {["Delivery of files, templates, links, system access, or configuration work,","Implementation beginning in Client's environment, or","Client using, approving, publishing, or relying on any deliverable."].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 7. Fees and Payment">
        <p className="mb-3">Client agrees to pay the fees presented at checkout, invoice, proposal, or service order for the purchased Transcript Tax Monitor product or service.</p>
        <p>Unless otherwise stated in writing, fees are due in advance and are non-refundable except as described in the <Link href="/legal/refund" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Refund Policy</Link>.</p>
      </LegalSection>

      <LegalSection title="Section 8. Privacy and Data Handling">
        <p>Provider may access and handle Client information only as reasonably necessary to deliver services, troubleshoot issues, verify work, provide support, maintain records, and protect service integrity. Additional details are described in the <Link href="/legal/privacy" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Privacy Policy</Link>.</p>
      </LegalSection>

      <LegalSection title="Section 9. Intellectual Property & License">
        <p className="mb-3">Provider retains all rights in Provider-owned templates, design systems, frameworks, code, workflows, branding, documentation, processes, and related proprietary materials except where a separate written transfer or license expressly says otherwise.</p>
        <p>Client receives a limited, non-exclusive, non-transferable license to use purchased deliverables for Client&apos;s internal business use. Client may not resell, redistribute, sublicense, or falsely claim authorship of Provider-owned materials unless expressly authorized in writing.</p>
      </LegalSection>

      <LegalSection title="Section 10. Revisions, Scope, and Change Requests">
        <p className="mb-3">Any revisions, edits, additions, integrations, migrations, or customizations outside the purchased scope are outside this Agreement unless separately approved in writing.</p>
        <p>Provider may treat new requirements, delayed feedback, missing assets, changed direction, or expanded technical requests as a scope change requiring a new fee, timeline, or order.</p>
      </LegalSection>

      <LegalSection title="Section 11. No Guarantees">
        <p>Provider does not guarantee revenue, lead volume, conversion rate, client retention, hiring success, time savings, business outcomes, regulatory outcomes, or uninterrupted availability of any third-party platform.</p>
      </LegalSection>

      <LegalSection title="Section 12. Limitation of Liability">
        <p className="mb-3">To the maximum extent permitted by law, Provider will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost revenue, lost profits, lost data, business interruption, or reliance-based harm arising out of or related to this Agreement, the deliverables, or Client&apos;s use of any product or service.</p>
        <p>Provider&apos;s total aggregate liability under this Agreement will not exceed the amount actually paid by Client for the specific product or service giving rise to the claim.</p>
      </LegalSection>

      <LegalSection title="Section 13. Indemnification">
        <ul className="space-y-2">
          {["Client's misuse of deliverables or systems,","Client's breach of this Agreement,","Client's violation of applicable law, or","Client's violation of a third party's rights, terms, or content restrictions."].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 14. Suspension or Termination">
        <p>Provider may suspend or terminate access or project work if Client materially breaches this Agreement, fails to pay, engages in abusive conduct, misuses systems, creates security risk, or initiates fraudulent payment activity.</p>
      </LegalSection>

      <LegalSection title="Section 15. Governing Law & Venue">
        <p className="mb-3">This Agreement is governed by the laws of the State of California, without regard to conflict-of-law principles.</p>
        <p>Any dispute arising from this Agreement will be resolved in the state or federal courts located in San Diego County, California, unless the Parties agree in writing to another dispute process.</p>
      </LegalSection>

      <LegalSection title="Section 16. Entire Agreement">
        <p>This Agreement, together with the Privacy Policy, Refund Policy, and any written invoice, proposal, order, or scope document expressly incorporated by reference, constitutes the entire agreement between the Parties regarding the subject matter described here.</p>
      </LegalSection>

      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Electronic Acceptance</h2>
        <p className="text-sm leading-relaxed text-text-muted">By purchasing, scheduling, accessing, downloading, or using a Transcript Tax Monitor product or service, Client acknowledges that they have read, understood, and agreed to be bound by these terms.</p>
      </div>
    </LegalPageLayout>
  )
}
