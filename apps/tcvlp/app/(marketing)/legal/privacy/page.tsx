import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tcvlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Privacy Policy | TaxClaim Pro',
  description: 'Privacy Policy for TaxClaim Pro Form 843 preparation, transcript parsing, branded client pages, and related digital services.',
}

const sections = [
  { id: 'a', title: 'A. Information Provider May Receive', body: "Provider may receive or have access to Client-provided information such as account credentials, firm name, display name, logo, contact information, branded landing page configuration, client data submitted through the claim form (taxpayer name, state, tax year, penalty amount), uploaded IRS transcript files, and Form 843 preparation guide contents. Depending on the service, Provider may also incidentally view information submitted by end-taxpayers through Client's branded claim page." },
  { id: 'b', title: 'B. Purpose of Access', body: 'Provider will access and use information only as reasonably necessary to generate Form 843 preparation guides, render branded client pages, calculate penalty amounts, check Kwong eligibility, process subscription payments, provide support, maintain records, and deliver other services Client has requested.' },
  { id: 'c', title: 'C. Data Minimization', body: 'Provider will make reasonable efforts to minimize access to information not required for service delivery, troubleshooting, fraud prevention, documentation, or recordkeeping. Client should not submit information unrelated to Form 843 preparation (full Social Security Numbers beyond what the form requires, banking details, medical data, etc.) through the platform.' },
  { id: 'd', title: 'D. Confidentiality & Security', body: 'Provider will maintain commercially reasonable administrative, technical, and organizational safeguards to protect information handled during service delivery. Client remains responsible for secure passwords, access to the Client dashboard, and the security of any files Client downloads from the platform.' },
  { id: 'e', title: 'E. Third-Party Processors', body: "TaxClaim Pro uses the following third-party processors to deliver services: Stripe (subscription billing), Cloudflare (hosting, session management, DNS), Resend (transactional email), Cal.com (appointment booking), and Google (authentication via OAuth and magic-link delivery). Each processor has its own privacy policy. Provider does not control and is not responsible for those processors' privacy practices, but selects them based on their published commitments to industry-standard security." },
  { id: 'f', title: 'F. IRS Transcript Data', body: "When Client uploads an IRS transcript, the transcript text is parsed by Provider to extract penalty data for Form 843 generation. Transcripts are processed in memory and stored as part of the claim submission record in Provider's secure R2 object storage. Transcripts are not transmitted to any third-party processor beyond what is required for the original upload, parsing, and storage operations." },
  { id: 'g', title: 'G. Data Retention', body: 'Provider does not intend to retain Client information longer than reasonably necessary for service delivery, support, billing reconciliation, proof of submission, security, dispute resolution, or legal compliance. Claim submission records may be retained for up to seven years after submission to allow Client and their clients to reference past Form 843 preparations. Limited business records (invoices, support artifacts, audit logs) may be retained longer for legal and tax purposes.' },
  { id: 'h', title: 'H. Client Requests & Right to Deletion', body: 'Client may request deletion of Provider-held materials containing Client information, to the extent Provider is not required to retain them for legal, tax, accounting, security, dispute, or operational recordkeeping obligations. Deletion requests should be made through the support page or by email to the contact listed in the address card above. Verified requests will be completed within 30 days unless a longer period is required by law.' },
  { id: 'i', title: 'I. California Privacy Rights (CCPA/CPRA)', body: 'Residents of California have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA): the right to know what personal information is collected, the right to delete personal information, the right to correct inaccurate personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. TaxClaim Pro does not sell personal information. To exercise any of these rights, contact us through the support page or by email. We will respond to verified requests within 45 days.' },
  { id: 'j', title: 'J. International Users (GDPR)', body: 'TaxClaim Pro is operated from the United States and is designed primarily for tax professionals serving United States taxpayers. Users located in the European Economic Area, United Kingdom, or other jurisdictions with data protection laws equivalent to the GDPR have additional rights, including the right to access, rectify, erase, restrict, or object to the processing of personal data, and the right to data portability. TaxClaim Pro does not knowingly process personal data of individuals located in these jurisdictions. If you believe your data has been processed in error, contact us and we will take appropriate action within 30 days.' },
]

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={tcvlpConfig}
      title="Privacy Policy"
      subtitle="Form 843 Preparation, Transcript Parsing, and Service Data Handling"
      lastUpdated="April 16, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>
          This Privacy Policy explains how TaxClaim Pro and its operator (&ldquo;Provider&rdquo;) may access, use, and handle Client information in connection with Form 843 preparation guides, branded client landing pages, IRS transcript parsing, subscription billing, support, and related digital services.
        </p>
      </LegalSection>

      {sections.map((s) => (
        <LegalSection key={s.id} title={s.title}>
          <p>{s.body}</p>
        </LegalSection>
      ))}

      <LegalSection title="Contact">
        <p>
          For questions regarding this Privacy Policy or to exercise any of the rights described above, contact TaxClaim Pro through the{' '}
          <Link href="/support" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            support page
          </Link>{' '}
          or by mail at 1175 Avocado Avenue Suite 101 PMB 1010, El Cajon, CA 92020.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
