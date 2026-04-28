import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tavlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Privacy Policy | Tax Avatar Pro',
  description: 'Privacy Policy for Tax Avatar Pro subscriptions, channel data, and AI avatar generation services.',
}

const sections = [
  { id: 'a', title: 'A. Information Provider May Receive', body: "Provider may receive or have access to Client-provided information such as account credentials, business contact information, channel branding details, YouTube channel access (where granted), avatar selection preferences, episode topic preferences, and related administrative information. Provider may also incidentally view information uploaded by Client for use in episode production." },
  { id: 'b', title: 'B. Purpose of Access', body: 'Provider will access and use information only as reasonably necessary to deliver the Service, produce avatar episodes, manage Client YouTube channel, troubleshoot issues, verify deliverables, provide support, maintain records, and transfer administrative control back to Client where applicable.' },
  { id: 'c', title: 'C. Data Minimization', body: 'Provider will make reasonable efforts to minimize access to information not required for Service delivery. Client is encouraged not to expose sensitive client tax information during use of the Service unless required for the requested work.' },
  { id: 'd', title: 'D. Confidentiality & Security', body: 'Provider will maintain commercially reasonable administrative, technical, and organizational safeguards to protect information accessed during Service delivery. Client remains responsible for secure passwords, YouTube channel security settings, user permissions, and device security.' },
  { id: 'e', title: 'E. Third-Party Processors', body: "Tax Avatar Pro uses the following third-party processors to deliver services: Stripe (subscription billing), Cloudflare (hosting, session management, DNS), Resend (transactional email), Cal.com (appointment booking), Google (authentication and YouTube channel management via OAuth), and HeyGen (AI avatar generation). Each processor has its own privacy policy. Provider does not control and is not responsible for those processors' privacy practices, but selects them based on their published commitments to industry-standard security." },
  { id: 'f', title: 'F. YouTube Channel Data', body: "When Client grants Tax Avatar Pro access to a YouTube channel, Provider may access channel analytics, subscriber data, video performance metrics, and channel settings as needed to publish episodes and report performance. Channel data is not transmitted to any third-party processor beyond what is required for episode upload, scheduling, and analytics retrieval. Client may revoke YouTube access at any time through their Google account permissions." },
  { id: 'g', title: 'G. HeyGen Avatar Generation', body: "Avatar episodes are generated using HeyGen's AI avatar platform. The avatar selection, script text, and any voice or likeness preferences shared with Provider are transmitted to HeyGen for the sole purpose of producing the requested episode video. HeyGen has its own data handling practices outlined in its privacy policy. Provider does not use Client-supplied likenesses outside the contracted Service." },
  { id: 'h', title: 'H. Data Retention', body: 'Provider does not intend to retain Client information longer than reasonably necessary for Service delivery, support, invoicing, bookkeeping, proof of delivery, security, dispute resolution, or legal compliance. Generated episode files, scripts, and channel reports may be retained for the life of the subscription and a reasonable archival period thereafter.' },
  { id: 'i', title: 'I. Client Requests', body: 'Client may request deletion of Provider-held materials containing Client information, to the extent Provider is not required to retain them for legal, tax, accounting, security, dispute, or operational recordkeeping obligations. Episodes already published to a Client-owned YouTube channel remain under Client control on YouTube.' },
  { id: 'j', title: 'J. California Privacy Rights (CCPA/CPRA)', body: 'Residents of California have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA): the right to know what personal information is collected, the right to delete personal information, the right to correct inaccurate personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. Tax Avatar Pro does not sell personal information. To exercise any of these rights, contact us through the support page or by email. We will respond to verified requests within 45 days.' },
]

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={tavlpConfig}
      title="Privacy Policy"
      subtitle="Service Data Handling"
      lastUpdated="April 27, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>
          Tax Avatar Pro provides a managed AI YouTube channel service for tax professionals (the &ldquo;Service&rdquo;). This Privacy Policy explains how Tax Avatar Pro and its operator (&ldquo;Provider&rdquo;) may access, use, and handle Client information in connection with the Service and related support.
        </p>
      </LegalSection>

      {sections.map((s) => (
        <LegalSection key={s.id} title={s.title}>
          <p>{s.body}</p>
        </LegalSection>
      ))}

      <LegalSection title="Contact">
        <p>
          For questions regarding this Privacy Policy, contact Tax Avatar Pro through the{' '}
          <Link href="/contact" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">
            contact page
          </Link>{' '}
          or by mail at 1175 Avocado Avenue Suite 101 PMB 1010, El Cajon, CA 92020.
        </p>
      </LegalSection>
    </LegalPageLayout>
  )
}
