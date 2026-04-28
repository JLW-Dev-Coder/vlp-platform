import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { tavlpConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: 'Terms of Service | Tax Avatar Pro',
  description: 'Terms for Tax Avatar Pro managed AI YouTube channel subscriptions and related services.',
}

export default function TermsPage() {
  return (
    <LegalPageLayout
      config={tavlpConfig}
      title="Terms of Service"
      subtitle="Managed Channel Service Agreement"
      lastUpdated="April 27, 2026"
      currentPage="terms"
    >
      <LegalSection>
        <p>Tax Avatar Pro provides a managed AI YouTube channel service for tax professionals (the &ldquo;Service&rdquo;), sold as a $29/mo add-on to TaxClaim Pro. This Agreement is entered into by and between Tax Avatar Pro&apos;s operating entity (&ldquo;Provider&rdquo;) and the individual or entity purchasing, accessing, or using the Service (&ldquo;Client&rdquo;).</p>
      </LegalSection>

      <LegalSection title="Section 1. Covered Services & Scope of Use">
        <ul className="mb-4 space-y-2">
          {[
            'Avatar selection from Provider roster',
            'Script writing for YouTube episodes',
            'AI avatar episode generation via HeyGen',
            'Episode publishing to Client-designated YouTube channel',
            'Channel growth activities (thumbnails, descriptions, scheduling)',
            'Monthly performance reporting',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
        <p>Tax Avatar Pro requires an active TaxClaim Pro subscription. Cancellation of TaxClaim Pro will result in cancellation of Tax Avatar Pro.</p>
      </LegalSection>

      <LegalSection title="Section 2. No Professional or Regulated Advice">
        <p>Provider does not provide legal, tax, accounting, financial, compliance, or other regulated professional advice through the Service or in any episode content. Episode scripts are general informational content branded for Client&apos;s practice; Client is responsible for reviewing all scripts before publication.</p>
      </LegalSection>

      <LegalSection title="Section 3. Client Responsibilities">
        <ul className="space-y-2">
          {[
            'Provide accurate business, billing, and channel access information.',
            'Grant YouTube channel access necessary for Provider to publish episodes.',
            'Review and approve episode scripts within the agreed turnaround window.',
            "Ensure that Client's use of any deliverable complies with Client's professional ethics rules and applicable law.",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-primary" /><span>{item}</span></li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title="Section 4. Content Ownership">
        <p className="mb-3">Episode videos generated for Client and published to Client&apos;s YouTube channel are owned by Client. Client receives a perpetual license to the script text and final episode files produced under this Agreement.</p>
        <p>Provider retains rights in proprietary tooling, prompt structures, production workflows, and roster of avatar likenesses. Client may not reuse Provider&apos;s avatar selections to produce episodes outside this Service.</p>
      </LegalSection>

      <LegalSection title="Section 5. Channel Transfer">
        <p>Upon cancellation, the Client&apos;s YouTube channel and all published episodes remain under Client control. Provider will revoke its own access to the channel within a reasonable period after cancellation. Client is responsible for any subsequent channel management, monetization, or content moderation.</p>
      </LegalSection>

      <LegalSection title="Section 6. Cancellation">
        <p>Subscriptions are billed monthly in advance and may be cancelled at any time through the Client dashboard. Cancellation takes effect at the end of the current billing period. Episodes already produced and published remain on Client&apos;s channel.</p>
      </LegalSection>

      <LegalSection title="Section 7. Third-Party Platforms">
        <p>The Service depends on third-party platforms including HeyGen (AI avatar generation), YouTube (publishing), Stripe (billing), and Cloudflare (hosting). Provider is not responsible for outages, policy changes, pricing changes, account restrictions, or feature removals caused by third-party providers.</p>
      </LegalSection>

      <LegalSection title="Section 8. Fees and Payment">
        <p className="mb-3">Client agrees to pay $29/mo in advance for Tax Avatar Pro, in addition to the $10/mo TaxClaim Pro base subscription required to access this add-on.</p>
        <p>Fees are non-refundable except as described in the <Link href="/legal/refund" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Refund Policy</Link>.</p>
      </LegalSection>

      <LegalSection title="Section 9. No Guarantees">
        <p>Provider does not guarantee subscriber growth, view counts, watch time, monetization eligibility, lead generation, conversion rate, business outcomes, or YouTube algorithm performance.</p>
      </LegalSection>

      <LegalSection title="Section 10. Limitation of Liability">
        <p className="mb-3">To the maximum extent permitted by law, Provider will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or related to this Agreement.</p>
        <p>Provider&apos;s total aggregate liability under this Agreement will not exceed the amount actually paid by Client for the Service in the twelve months preceding the claim.</p>
      </LegalSection>

      <LegalSection title="Section 11. Privacy and Data Handling">
        <p>Provider may access and handle Client information only as reasonably necessary to deliver the Service. Additional details are described in the <Link href="/legal/privacy" className="text-brand-primary underline underline-offset-2 hover:text-brand-hover">Privacy Policy</Link>.</p>
      </LegalSection>

      <LegalSection title="Section 12. Suspension or Termination">
        <p>Provider may suspend or terminate the Service if Client materially breaches this Agreement, fails to pay, engages in abusive conduct, requests episode content that violates law or YouTube policies, or initiates fraudulent payment activity.</p>
      </LegalSection>

      <LegalSection title="Section 13. Governing Law & Venue">
        <p className="mb-3">This Agreement is governed by the laws of the State of California, without regard to conflict-of-law principles.</p>
        <p>Any dispute arising from this Agreement will be resolved in the state or federal courts located in San Diego County, California.</p>
      </LegalSection>

      <div className="rounded-2xl border border-brand-primary/20 bg-brand-primary/5 p-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Electronic Acceptance</h2>
        <p className="text-sm leading-relaxed text-text-muted">By purchasing, scheduling, accessing, or using the Service, Client acknowledges that they have read, understood, and agreed to be bound by these terms.</p>
      </div>
    </LegalPageLayout>
  )
}
