import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { dvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Privacy Policy | Developers VLP',
  description: 'Privacy Policy for Developers VLP installs, templates, onboarding systems, and related digital services.',
}

const sections = [
  { id: 'a', title: 'A. Information Provider May Receive', body: "Provider may receive or have access to Client-provided information such as account credentials, workspace configuration, business contact information, forms, workflows, portal content, files, templates, onboarding assets, task data, automation settings, and related administrative information. Depending on the service, Provider may also incidentally view information uploaded by Client or Client's end users." },
  { id: 'b', title: 'B. Purpose of Access', body: 'Provider will access and use information only as reasonably necessary to complete the purchased service, perform setup or configuration, troubleshoot issues, verify deliverables, provide support, maintain records, and transfer administrative control back to Client where applicable.' },
  { id: 'c', title: 'C. Data Minimization', body: 'Provider will make reasonable efforts to minimize access to information not required for service delivery, testing, troubleshooting, fraud prevention, documentation, or recordkeeping. Client is encouraged not to expose sensitive information during setup unless required for the requested work.' },
  { id: 'd', title: 'D. Confidentiality & Security', body: 'Provider will maintain commercially reasonable administrative, technical, and organizational safeguards to protect information accessed during service delivery. Client remains responsible for secure passwords, platform-level security settings, user permissions, and device security after access is transferred or services are completed.' },
  { id: 'e', title: 'E. Credential Handling', body: 'Client may provide credentials, temporary invites, API keys, or access links needed to complete the service. Client may revoke Provider access at any time, but doing so may pause or prevent completion. After completion, Client should rotate temporary credentials, revoke temporary invitations, and confirm final administrative ownership and access settings.' },
  { id: 'f', title: 'F. Third-Party Platforms', body: "Developers VLP services may involve third-party platforms, software, hosting providers, payment providers, automation tools, and workspace systems. Provider does not control and is not responsible for those third parties' privacy practices, security controls, hosting terms, retention practices, or processing policies. Client is responsible for reviewing and accepting the terms and privacy policies of any third-party platforms Client uses." },
  { id: 'g', title: 'G. Data Retention', body: 'Provider does not intend to retain Client information longer than reasonably necessary for service delivery, support, invoicing, bookkeeping, proof of delivery, security, dispute resolution, or legal compliance. Limited records, screenshots, configuration notes, receipts, or support artifacts may be retained for business and legal purposes.' },
  { id: 'h', title: 'H. Client Requests', body: 'Client may request deletion of Provider-held materials containing Client information, to the extent Provider is not required to retain them for legal, tax, accounting, security, dispute, or operational recordkeeping obligations.' },
]

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={dvlpConfig}
      title="Privacy Policy"
      subtitle="Install, Template, and Service Data Handling"
      lastUpdated="March 17, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>
          This Privacy Policy explains how Developers VLP and its operator (&ldquo;Provider&rdquo;) may access, use, and handle Client information in connection with installs, setup work, templates, automation configuration, support, and related digital services.
        </p>
      </LegalSection>

      {sections.map((s) => (
        <LegalSection key={s.id} title={s.title}>
          <p>{s.body}</p>
        </LegalSection>
      ))}

      <LegalSection title="Contact">
        <p>
          For questions regarding this Privacy Policy, contact Developers VLP through the{' '}
          <Link href="/support" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>{' '}
          or by mail at 1175 Avocado Avenue Suite 101 PMB 1010, El Cajon, CA 92020.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
