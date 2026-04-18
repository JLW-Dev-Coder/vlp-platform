# Canonical: Legal Pages

Last updated: 2026-04-17

## §1. Purpose

All 8 VLP ecosystem apps MUST expose three legal pages under `/legal/`:

- `/legal/privacy` — Privacy Policy
- `/legal/refund` — Refund Policy
- `/legal/terms` — Terms of Service

Content is ecosystem-wide and identical across all apps. Each app renders the same copy through shared components (`LegalPageLayout`, `LegalSection` from `@vlp/member-ui`) with its own `PlatformConfig` supplying brand name, brand colors, and business info. Per-app copy forks are not permitted; divergence that predates this canonical gets fixed on migration, not grandfathered.

The canonical copy below is the source of truth. The lifted copy comes from VLP's live legal pages at `apps/vlp/app/(marketing)/legal/{privacy,refund,terms}/page.tsx`.

**Platform-name substitution:** everywhere the copy below says "Virtual Launch Pro", each app must substitute its own product name (Tax Monitor Pro, Transcript Tax Monitor, Tax Tools Arcade, Developers VLP, Games VLP, Tax Claim VLP, Website Lotto VLP). Legal entity stays "Lenore, Inc." on every app.

---

## §2. Privacy Policy

**Route:** `/legal/privacy`
**Title:** `Privacy Policy`
**Subtitle:** `Install, Template, and Service Data Handling`
**Last updated (content):** `March 17, 2026`
**Metadata title:** `Privacy Policy | {Platform Name}`
**Metadata description:** `Privacy Policy for {Platform Name} installs, templates, onboarding systems, and related digital services.`

### Intro paragraph (unlabeled LegalSection)

> This Privacy Policy explains how {Platform Name} and its operator ("Provider") may access, use, and handle Client information in connection with installs, setup work, templates, automation configuration, support, and related digital services.

### Sections

**A. Information Provider May Receive**

> Provider may receive or have access to Client-provided information such as account credentials, workspace configuration, business contact information, forms, workflows, portal content, files, templates, onboarding assets, task data, automation settings, and related administrative information. Depending on the service, Provider may also incidentally view information uploaded by Client or Client's end users.

**B. Purpose of Access**

> Provider will access and use information only as reasonably necessary to complete the purchased service, perform setup or configuration, troubleshoot issues, verify deliverables, provide support, maintain records, and transfer administrative control back to Client where applicable.

**C. Data Minimization**

> Provider will make reasonable efforts to minimize access to information not required for service delivery, testing, troubleshooting, fraud prevention, documentation, or recordkeeping. Client is encouraged not to expose sensitive information during setup unless required for the requested work.

**D. Confidentiality & Security**

> Provider will maintain commercially reasonable administrative, technical, and organizational safeguards to protect information accessed during service delivery. Client remains responsible for secure passwords, platform-level security settings, user permissions, and device security after access is transferred or services are completed.

**E. Credential Handling**

> Client may provide credentials, temporary invites, API keys, or access links needed to complete the service. Client may revoke Provider access at any time, but doing so may pause or prevent completion. After completion, Client should rotate temporary credentials, revoke temporary invitations, and confirm final administrative ownership and access settings.

**F. Third-Party Platforms**

> {Platform Name} services may involve third-party platforms, software, hosting providers, payment providers, automation tools, and workspace systems. Provider does not control and is not responsible for those third parties' privacy practices, security controls, hosting terms, retention practices, or processing policies. Client is responsible for reviewing and accepting the terms and privacy policies of any third-party platforms Client uses.

**G. Data Retention**

> Provider does not intend to retain Client information longer than reasonably necessary for service delivery, support, invoicing, bookkeeping, proof of delivery, security, dispute resolution, or legal compliance. Limited records, screenshots, configuration notes, receipts, or support artifacts may be retained for business and legal purposes.

**H. Client Requests**

> Client may request deletion of Provider-held materials containing Client information, to the extent Provider is not required to retain them for legal, tax, accounting, security, dispute, or operational recordkeeping obligations.

**Contact** (rendered as final LegalSection)

> For questions regarding this Privacy Policy, contact {Platform Name} through the [support page](/contact) or by mail at {businessInfo.address.line1} {businessInfo.address.line2}, {businessInfo.address.city}, {businessInfo.address.state} {businessInfo.address.zip}.

---

## §2.5 Optional sections — jurisdiction & data-profile

Apps with specific data-handling profiles (taxpayer PII, IRS data, California users at scale, EU users, processor disclosure requirements) MAY include these additional Privacy Policy sections. Apps that do NOT trigger the relevant requirement MUST NOT include the section (extra disclosures imply data-handling that doesn't exist and create liability).

Sections are opt-in and content is locked here. Apps that opt in copy the section verbatim into their `LegalPageLayout` children, after the base A–H sections and before the `Contact` section. Each optional section is rendered as a `LegalSection` with the titles shown below.

### Section: California Privacy Rights (CCPA/CPRA)

**Required for:** any app that handles personal information of California residents in a way substantial enough to warrant disclosure. Most VLP apps technically qualify if they have any California users; opt in only when the data-handling profile justifies the disclosure (currently TCVLP only).

**Section title (verbatim):** `I. California Privacy Rights (CCPA/CPRA)`

> Residents of California have specific rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA): the right to know what personal information is collected, the right to delete personal information, the right to correct inaccurate personal information, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. {Platform Name} does not sell personal information. To exercise any of these rights, contact us through the support page or by email. We will respond to verified requests within 45 days.

### Section: Third-Party Processors

**Required for:** apps that share user data with named third-party service providers in a way users would reasonably want disclosed (payment processors, email senders, calendar integrations, authentication providers). Currently TCVLP only.

**Section title (verbatim):** `E. Third-Party Processors`

> {Platform Name} uses the following third-party processors to deliver services: Stripe (subscription billing), Cloudflare (hosting, session management, DNS), Resend (transactional email), Cal.com (appointment booking), and Google (authentication via OAuth and magic-link delivery). Each processor has its own privacy policy. Provider does not control and is not responsible for those processors' privacy practices, but selects them based on their published commitments to industry-standard security.

**Note:** when an app opts into `Third-Party Processors`, it replaces the base `E. Credential Handling` section slot. The processors list is more load-bearing than generic credential-handling language for apps that actually disclose named processors.

### Section: IRS Transcript Handling

**Required for:** apps that ingest, store, or process IRS taxpayer transcript data (currently TCVLP only — TTMP processes transcripts client-side and does not store them long-term, so this section does not apply).

**Section title (verbatim):** `F. IRS Transcript Data`

> When Client uploads an IRS transcript, the transcript text is parsed by Provider to extract penalty data for Form 843 generation. Transcripts are processed in memory and stored as part of the claim submission record in Provider's secure R2 object storage. Transcripts are not transmitted to any third-party processor beyond what is required for the original upload, parsing, and storage operations.

**Note:** when an app opts into `IRS Transcript Handling`, it replaces the base `F. Third-Party Platforms` section slot. The transcript-handling disclosure is more specific and load-bearing for apps that actually ingest IRS transcript data.

---

### Adoption matrix (opt-ins per app)

| App | CCPA/CPRA | Third-Party Processors | IRS Transcript Handling |
|-----|-----------|------------------------|-------------------------|
| VLP | — | — | — |
| TMP | — | — | — |
| TTMP | — | — | — |
| TTTMP | — | — | — |
| DVLP | — | — | — |
| GVLP | — | — | — |
| TCVLP | ✓ | ✓ | ✓ |
| WLVLP | — | — | — |

TCVLP opt-ins confirmed live 2026-04-17 after privacy alignment landed (commit `4ad6575`). Apps add a row check by amending this table during their migration.

---

## §3. Refund Policy

**Route:** `/legal/refund`
**Title:** `Refund Policy`
**Subtitle:** `Digital Installs, Templates, and Service Purchases`
**Last updated (content):** `March 17, 2026`
**Metadata title:** `Refund Policy | {Platform Name}`
**Metadata description:** `Refund Policy for {Platform Name} installs, templates, setup services, and related digital purchases.`

### Intro paragraph (unlabeled LegalSection)

> This Refund Policy applies to purchases made through {Platform Name}, including setup packages, digital templates, implementation services, onboarding systems, automation builds, and related digital deliverables. For help with an order, use the [support page](/contact).

### Sections

**A. What You're Buying** — bulleted list

- Digital products and service-based setup work, including templates, workflows, configuration, implementation, and related assets.
- Digitally delivered access or work product, not a physical shipped good.
- Fixed-scope or staged services that may begin promptly after purchase, scheduling, kickoff, or credential handoff.

**B. General Rule**

> Because {Platform Name} offers digital products, implementation work, and time-based service capacity that can be reserved or started quickly, purchases are generally **non-refundable once delivery has started, access has been granted, files have been sent, or implementation work has begun**.

**C. When We May Approve a Refund**

> We may approve a refund, partial refund, service credit, or adjustment in situations such as:

- Duplicate charge for the same order.
- Unauthorized purchase claim, subject to review and payment processor rules.
- Technical failure where paid digital access or files were never delivered.
- Provider-side inability to start the purchased service within the stated scope for reasons not caused by Client delay, missing information, or third-party platform restrictions.
- Verified billing error or materially incorrect charge amount.

> Refund decisions are case-by-case and may require documentation, timestamps, platform details, or payment evidence. *(rendered in small opaque text)*

**D. When We Don't Refund**

> Refunds are not typically provided for:

- Change of mind after purchase.
- Work already performed, including research, setup, implementation, revision rounds, automation configuration, or template customization.
- Delivered digital files or assets.
- Client delay in providing content, credentials, approvals, access, or required responses.
- Third-party platform limitations, outages, account restrictions, or policy changes outside Provider control.
- Mismatch between purchased scope and unpurchased custom requests.

**E. How to Request a Refund Review** — ordered list

1. Submit your request through your official {Platform Name} support channel.
2. Include your name, purchase email, order date, and a clear description of the issue.
3. If available, include invoice, receipt, transaction ID, and any relevant project or workspace identifiers.

**F. Chargebacks**

> Initiating a chargeback or payment dispute may result in temporary suspension of access, pausing of project work, or withholding of undelivered items while the matter is reviewed.

**G. Policy Changes**

> We may update this policy from time to time. The last updated date reflects the most recent revision.

---

## §4. Terms of Service

**Route:** `/legal/terms`
**Title:** `Terms of Service`
**Subtitle:** `Digital Products, Installs, and Service Use Agreement`
**Last updated (content):** `March 17, 2026`
**Metadata title:** `Terms of Service | {Platform Name}`
**Metadata description:** `Terms for {Platform Name} digital products, installs, templates, implementation services, and platform use.`

### Intro paragraph (unlabeled LegalSection)

> This Agreement is entered into by and between {Platform Name}'s operating entity ("Provider") and the individual or entity purchasing, accessing, or using {Platform Name} products or services ("Client").

### Sections

**Section 1. Covered Services & Scope of Use** — bulleted list + paragraph

- Digital templates, documents, and workflow assets
- Setup, implementation, and onboarding services
- Automation configuration and platform customization
- Related account access, training, support, and digital deliverables

> Unless expressly stated in writing, purchases do not include unlimited revisions, custom development beyond the purchased scope, legal review, compliance review, tax advice, accounting advice, employment advice, or regulated professional services.

**Section 2. No Professional or Regulated Advice**

> Client acknowledges that Provider does not provide legal, tax, accounting, financial, compliance, HR, employment, or other regulated professional advice under this Agreement unless separately and expressly stated in writing.
>
> Any templates, examples, workflows, automations, labels, prompts, structure, content, or implementation suggestions are provided for operational and informational purposes only.

**Section 3. Client Responsibilities** — bulleted list

- Provide accurate business, billing, and access information.
- Provide required content, approvals, credentials, and feedback in a timely manner.
- Review all deliverables before relying on them in operations, sales, hiring, service delivery, or compliance activity.
- Ensure that Client's use of any deliverable complies with Client's own obligations, licenses, contracts, policies, and applicable law.

**Section 4. Account Access & Credentials**

> Client is responsible for maintaining secure control of the accounts, workspaces, tools, and credentials used in connection with {Platform Name} services.
>
> Provider may rely on the credentials, invitations, workspace permissions, billing details, and account-linked identifiers supplied by Client to determine authorized access and service delivery.

**Section 5. Third-Party Platforms, Tools, and Dependencies**

> {Platform Name} services may depend on third-party platforms, hosting providers, payment processors, communication tools, productivity systems, automation platforms, or related software selected by Client or Provider.
>
> Provider is not responsible for outages, policy changes, pricing changes, API changes, account restrictions, lost access, feature removals, or technical limitations caused by third-party providers.

**Section 6. Acceptance of Deliverables** — bulleted list

- Delivery of files, templates, links, system access, or configuration work,
- Implementation beginning in Client's environment, or
- Client using, approving, publishing, or relying on any deliverable.

**Section 7. Fees and Payment**

> Client agrees to pay the fees presented at checkout, invoice, proposal, or service order for the purchased {Platform Name} product or service.
>
> Unless otherwise stated in writing, fees are due in advance and are non-refundable except as described in the [Refund Policy](/legal/refund).

**Section 8. Privacy and Data Handling**

> Provider may access and handle Client information only as reasonably necessary to deliver services, troubleshoot issues, verify work, provide support, maintain records, and protect service integrity. Additional details are described in the [Privacy Policy](/legal/privacy).

**Section 9. Intellectual Property & License**

> Provider retains all rights in Provider-owned templates, design systems, frameworks, code, workflows, branding, documentation, processes, and related proprietary materials except where a separate written transfer or license expressly says otherwise.
>
> Client receives a limited, non-exclusive, non-transferable license to use purchased deliverables for Client's internal business use. Client may not resell, redistribute, sublicense, or falsely claim authorship of Provider-owned materials unless expressly authorized in writing.

**Section 10. Revisions, Scope, and Change Requests**

> Any revisions, edits, additions, integrations, migrations, or customizations outside the purchased scope are outside this Agreement unless separately approved in writing.
>
> Provider may treat new requirements, delayed feedback, missing assets, changed direction, or expanded technical requests as a scope change requiring a new fee, timeline, or order.

**Section 11. No Guarantees**

> Provider does not guarantee revenue, lead volume, conversion rate, client retention, hiring success, time savings, business outcomes, regulatory outcomes, or uninterrupted availability of any third-party platform.

**Section 12. Limitation of Liability**

> To the maximum extent permitted by law, Provider will not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages, including lost revenue, lost profits, lost data, business interruption, or reliance-based harm arising out of or related to this Agreement, the deliverables, or Client's use of any product or service.
>
> Provider's total aggregate liability under this Agreement will not exceed the amount actually paid by Client for the specific product or service giving rise to the claim.

**Section 13. Indemnification** — bulleted list

- Client's misuse of deliverables or systems,
- Client's breach of this Agreement,
- Client's violation of applicable law, or
- Client's violation of a third party's rights, terms, or content restrictions.

**Section 14. Suspension or Termination**

> Provider may suspend or terminate access or project work if Client materially breaches this Agreement, fails to pay, engages in abusive conduct, misuses systems, creates security risk, or initiates fraudulent payment activity.

**Section 15. Governing Law & Venue**

> This Agreement is governed by the laws of the State of California, without regard to conflict-of-law principles.
>
> Any dispute arising from this Agreement will be resolved in the state or federal courts located in San Diego County, California, unless the Parties agree in writing to another dispute process.

**Section 16. Entire Agreement**

> This Agreement, together with the Privacy Policy, Refund Policy, and any written invoice, proposal, order, or scope document expressly incorporated by reference, constitutes the entire agreement between the Parties regarding the subject matter described here.

**Electronic Acceptance** — rendered as callout box (brand-tinted border, not a LegalSection)

> By purchasing, scheduling, accessing, downloading, or using a {Platform Name} product or service, Client acknowledges that they have read, understood, and agreed to be bound by these terms.

---

## §5. PlatformConfig `businessInfo` requirement

`LegalPageLayout` renders the Privacy §Contact mailing address from `config.businessInfo.address`. Every app MUST define `businessInfo` on its `PlatformConfig`. The values are ecosystem-wide (single legal entity, single address):

```ts
businessInfo: {
  legalEntity: 'Lenore, Inc.',
  address: {
    line1: '1175 Avocado Avenue',
    line2: 'Suite 101 PMB 1010',
    city: 'El Cajon',
    state: 'CA',
    zip: '92020',
  },
  phone: '619-800-5457',
  supportEmail: 'outreach@virtuallaunch.pro',
}
```

**Per-app divergence rule:** `legalEntity` and `address` MUST match VLP exactly on all 8 apps. `phone` SHOULD match. `supportEmail` MAY differ if the app already routes support to a different inbox — prefer the app's existing value over the VLP default in that case.

As of 2026-04-17, `businessInfo` is defined on: VLP, TTMP, TCVLP. Missing on: TMP, TTTMP, DVLP, GVLP, WLVLP — backfilled in Phase 1.5.

---

## §6. Shared component usage

All legal pages MUST render through `@vlp/member-ui` components:

- `LegalPageLayout` — wraps the page, renders title / subtitle / last-updated / legal-nav tabs, consumes `PlatformConfig` for brand tokens and business info.
- `LegalSection` — single titled section within the page; optional `title` prop (omit for intro paragraph).

Bespoke per-app legal layouts are not permitted. Any app with pre-canonical bespoke implementations gets rewritten onto the shared components on migration; local `LegalLayout` components orphaned by the rewrite get deleted.

### Standard page skeleton

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { LegalPageLayout, LegalSection } from '@vlp/member-ui'
import { appConfig } from '@/lib/platform-config'

export const metadata: Metadata = {
  title: '{Policy Name} | {Platform Name}',
  description: '...',
}

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      config={appConfig}
      title="..."
      subtitle="..."
      lastUpdated="March 17, 2026"
      currentPage="privacy"
    >
      <LegalSection>
        <p>...intro...</p>
      </LegalSection>

      <LegalSection title="A. ...">
        <p>...</p>
      </LegalSection>

      {/* ... */}
    </LegalPageLayout>
  )
}
```

`currentPage` must be one of `'privacy' | 'refund' | 'terms'` so the layout highlights the active tab.

Cross-links between legal pages use the Tailwind link pattern: `className="text-brand-primary underline underline-offset-2 hover:text-brand-hover"`.

---

## §7. Adoption table

| App | /legal/privacy | /legal/refund | /legal/terms | Uses shared components | businessInfo on config |
|-----|---------------|---------------|--------------|------------------------|------------------------|
| VLP | ✅ | ✅ | ✅ | ✅ (canonical source) | ✅ |
| TMP | ✅ | ✅ | ✅ | ✅ | ✅ |
| TTMP | ✅ | ✅ | ✅ | ✅ | ✅ |
| TTTMP | ✅ | ✅ | ✅ | ✅ | ✅ |
| DVLP | ✅ | ✅ | ✅ | ✅ | ✅ |
| GVLP | ✅ | ✅ | ✅ | ✅ | ✅ |
| TCVLP | ✅ | ⚠️ bespoke | ⚠️ bespoke | ✅ | ✅ |
| WLVLP | ✅ | ✅ | ✅ | ✅ | ✅ |

Legend: ✅ live and on-canonical · ⚠️ live but bespoke (pre-canonical drift, scheduled for rewrite) · ❌ missing

All 24 URLs verified returning 200 (TTMP and WLVLP return 308 → 200 due to trailing-slash).

**TCVLP refund/terms:** retain pre-canonical bespoke pages pending Principal sign-off to remove IRS-specific legally-protective disclaimers (PREPARATION GUIDES disclaimer, Form 2848 authorization, IRS acceptance non-guarantee, Kwong eligibility language). Per §2.3 STOP-clause.
