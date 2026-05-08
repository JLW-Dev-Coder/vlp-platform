import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tax Prep Pro',
  description: 'Privacy Policy for Tax Prep Pro buildouts, SuiteDash workspaces, and related digital deliverables.',
}

// TODO(legal): Adapted from apps/tcvlp privacy with TPP-specific language —
// Form 843/Kwong sections removed, SuiteDash third-party-processor section
// added. Awaiting Jamie sign-off on final wording.

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={tppConfig}
      title="Privacy Policy"
      subtitle="Buildouts, Subscriptions & Digital Deliverables"
      lastUpdated="May 6, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>
          This Privacy Policy describes how Tax Prep Pro&rsquo;s operating entity (&ldquo;Provider&rdquo;) handles
          information accessed during delivery of Tax Prep Pro buildouts, SuiteDash workspaces, member
          training, and related digital deliverables (the &ldquo;Service&rdquo;). For help, use the{' '}
          <Link href="/contact" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            contact page
          </Link>
          .
        </p>
      </LegalSection>

      <LegalSection title="A. Information Provider May Receive">
        <p>
          Provider may receive or have access to Client-provided information such as bureau name, branding
          assets, contact information, billing details, intake-form configuration, workspace settings, files
          uploaded to the SuiteDash workspace during buildout, and related administrative records. Depending on
          the Service, Provider may also incidentally view information uploaded by Client or Client&rsquo;s end
          taxpayers in the course of testing or troubleshooting.
        </p>
      </LegalSection>

      <LegalSection title="B. Purpose of Access">
        <p>
          Provider will access and use information only as reasonably necessary to deliver the Service,
          configure and maintain the workspace, troubleshoot issues, verify deliverables, provide support,
          maintain records, and transfer administrative control back to Client where applicable.
        </p>
      </LegalSection>

      <LegalSection title="C. Data Minimization">
        <p>
          Provider will make reasonable efforts to minimize access to information not required for Service
          delivery. Client is encouraged not to expose end-taxpayer data during buildout, testing, or training
          sessions unless required for the requested work.
        </p>
      </LegalSection>

      <LegalSection title="D. Confidentiality & Security">
        <p>
          Provider will maintain commercially reasonable safeguards to protect information accessed during
          Service delivery. Client remains responsible for secure passwords, platform-level security settings,
          user permissions, and device security after access is transferred or Services are completed.
        </p>
      </LegalSection>

      <LegalSection title="E. Third-Party Processors">
        <p>
          Tax Prep Pro relies on the following third-party processors to deliver the Service:{' '}
          <strong className="text-text-primary">SuiteDash</strong> (member workspace, file storage, e-signature,
          intake forms, billing connectors); <strong className="text-text-primary">Stripe</strong> (subscription
          billing for the per-active-member fee); <strong className="text-text-primary">Cloudflare</strong>{' '}
          (hosting, DNS, session management for this marketing site);{' '}
          <strong className="text-text-primary">Resend</strong> (transactional email);{' '}
          <strong className="text-text-primary">Google</strong> (authentication via OAuth where used). Each
          processor has its own privacy policy. Provider does not control and is not responsible for those
          processors&rsquo; practices, but selects them based on their published commitments to industry-standard
          security.
        </p>
      </LegalSection>

      <LegalSection title="F. SuiteDash Workspace Data">
        {/* TODO(legal): Confirm wording with Jamie — child-account provisioning under reseller. */}
        <p>
          Tax Prep Pro workspaces are provisioned as child accounts under Provider&rsquo;s SuiteDash reseller
          plan. Client retains operational control of the workspace; Provider retains administrative access
          for support, billing reconciliation, and deprovisioning at end of engagement. End-taxpayer data
          uploaded to the workspace is governed by SuiteDash&rsquo;s own data-handling commitments in addition to
          this policy.
        </p>
      </LegalSection>

      <LegalSection title="G. Data Retention">
        <p>
          Provider does not intend to retain Client information longer than reasonably necessary for Service
          delivery, support, invoicing, bookkeeping, security, dispute resolution, or legal compliance.
          Limited records, screenshots, configuration notes, receipts, or support artifacts may be retained
          for business and legal purposes.
        </p>
      </LegalSection>

      <LegalSection title="H. Client Requests">
        <p>
          Client may request deletion of Provider-held materials containing Client information, to the extent
          Provider is not required to retain them for legal, tax, accounting, security, dispute, or
          operational recordkeeping obligations.
        </p>
      </LegalSection>

      <LegalSection title="I. California Privacy Rights (CCPA/CPRA)">
        <p>
          Residents of California have specific rights under the CCPA and CPRA: the right to know what personal
          information is collected, the right to delete personal information, the right to correct inaccurate
          personal information, the right to opt out of the sale or sharing of personal information, and the
          right to non-discrimination. Tax Prep Pro does not sell personal information. To exercise any of
          these rights, contact us through the contact page or by email. We will respond to verified requests
          within 45 days.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
