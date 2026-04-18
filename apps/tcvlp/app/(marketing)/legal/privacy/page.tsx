import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tcvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Privacy Policy | TaxClaim Pro',
  description: 'Privacy Policy for TaxClaim Pro installs, templates, onboarding systems, and related digital services.',
}

const sections = [
  { id: 'a', title: 'A. Information Provider May Receive', body: "Provider may receive or have access to Client-provided information such as account credentials, workspace configuration, business contact information, forms, workflows, portal content, files, templates, onboarding assets, task data, automation settings, and related administrative information. Depending on the service, Provider may also incidentally view information uploaded by Client or Client's end users." },
  { id: 'b', title: 'B. Purpose of Access', body: 'Provider will access and use information only as reasonably necessary to complete the purchased service, perform setup or configuration, troubleshoot issues, verify deliverables, provide support, maintain records, and transfer administrative control back to Client where applicable.' },
  { id: 'c', title: 'C. Data Minimization', body: 'Provider will make reasonable efforts to minimize access to information not required for service delivery, testing, troubleshooting, fraud prevention, documentation, or recordkeeping. Client is encouraged not to expose sensitive information during setup unless required for the requested work.' },
  { id: 'd', title: 'D. Confidentiality & Security', body: 'Provider will maintain commercially reasonable administrative, technical, and organizational safeguards to protect information accessed during service delivery. Client remains responsible for secure passwords, platform-level security settings, user permissions, and device security after access is transferred or services are completed.' },
  { id: 'e', title: 'E. Third-Party Processors', body: "TaxClaim Pro uses the following third-party processors to deliver services: Stripe (subscription billing), Cloudflare (hosting, session management, DNS), Resend (transactional email), Cal.com (appointment booking), and Google (authentication via OAuth and magic-link delivery). Each processor has its own privacy policy. Provider does not control and is not responsible for those processors' privacy practices, but selects them based on their published commitments to industry-standard security." },
  { id: 'f', title: 'F. IRS Transcript Data', body: "When Client uploads an IRS transcript, the transcript text is parsed by Provider to extract penalty data for Form 843 generation. Transcripts are processed in memory and stored as part of the claim submission record in Provider's secure R2 object storage. Transcripts are not transmitted to any third-party processor beyond what is required for the original upload, parsing, and storage operations." },
  { id: 'g', title: 'G. Data Retention', body: 'Provider does not intend to retain Client information longer than reasonably necessary for service delivery, support, invoicing, bookkeeping, proof of delivery, security, dispute resolution, or legal compliance. Limited records, screenshots, configuration notes, receipts, or support artifacts may be retained for business and legal purposes.' },
  { id: 'h', title: 'H. Client Requests', body: 'Client may request deletion of Provider-held materials containing Client information, to the extent Provider is not required to retain them for legal, tax, accounting, security, dispute, or operational recordkeeping obligations.' },
  { id: 'i', title: 'I. California Privacy Rights (CCPA/CPRA)', body: 'Residents of California have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA): the right to know what personal information is collected, the right to delete personal information, the right to correct inaccurate personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. TaxClaim Pro does not sell personal information. To exercise any of these rights, contact us through the support page or by email. We will respond to verified requests within 45 days.' },
]

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={tcvlpConfig}
      title="Privacy Policy"
      subtitle="Install, Template, and Service Data Handling"
      lastUpdated="March 17, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>
          This Privacy Policy explains how TaxClaim Pro and its operator (&ldquo;Provider&rdquo;) may access, use, and handle Client information in connection with installs, setup work, templates, automation configuration, support, and related digital services.
        </p>
      </LegalSection>

      {sections.map((s) => (
        <LegalSection key={s.id} title={s.title}>
          <p>{s.body}</p>
        </LegalSection>
      ))}

      <LegalSection title="Contact">
        <p>
          For questions regarding this Privacy Policy, contact TaxClaim Pro through the{' '}
          <Link href="/support" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>{' '}
          or by mail at 1175 Avocado Avenue Suite 101 PMB 1010, El Cajon, CA 92020.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
