import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tax Prep Pro Setup — Reference Guide',
  description:
    'Companion documentation for the YouTube series with Zuri. Each section links to the official SuiteDash help article you need to implement what Zuri walks through on video.',
}

type Section = {
  topic: string
  summary: string
  href: string
  linkLabel: string
}

// Section order mirrors the LMS course Zuri teaches on YouTube:
// Welcome → Phases 1–5 → Phase 7 → Phase 8 → Phase 6 (e-sign, taught last
// because it cuts across phases) → Course Closer.
const sections: Section[] = [
  {
    topic: 'Welcome — Meet Zuri & The Order Metaphor',
    summary:
      'Zuri opens the series by introducing herself and the order-fulfillment metaphor that frames the rest of the course: a tax return is an order, and SuiteDash moves it through 8 phases from first contact to final delivery. Everything that follows is a deep-dive into one of those phases.',
    href: 'https://help.suitedash.com/article/467-automations-overview',
    linkLabel: 'Start with SuiteDash Automations Overview →',
  },
  {
    topic: 'Phase 1 — Identify Taxpayer Type',
    summary:
      'Zuri walks through how the booking form and its public landing page capture the taxpayer type before anything else can happen. This is the entry point — the form a prospect fills out from your website that tells SuiteDash what kind of return is in front of you.',
    href: 'https://help.suitedash.com/article/572-pages-creating-a-landing-page',
    linkLabel: 'Build your booking landing page in SuiteDash →',
  },
  {
    topic: 'Phase 2 — Intake Form',
    summary:
      'Zuri shows the two forms that make up intake: the Upload Documents request that collects the taxpayer’s files, and the Intake Form itself that captures personal details, dependents, and filing status. Together they hand you everything you need to prepare the return.',
    href: 'https://help.suitedash.com/article/432-forms-overview',
    linkLabel: 'Configure your intake forms in SuiteDash →',
  },
  {
    topic: 'Phase 3 — Agreement',
    summary:
      'Zuri walks through the service agreement — the form that triggers it and the Document Generator that produces the binding agreement the taxpayer signs. This is where the order becomes a real engagement with terms, scope, and signatures attached.',
    href: 'https://help.suitedash.com/article/49-document-generators',
    linkLabel: 'Set up your Service Agreement Document Generator →',
  },
  {
    topic: 'Phase 4 — Payment',
    summary:
      'Zuri shows how the payment form and the invoice items behind it collect what the taxpayer agreed to pay. Once payment clears, the order moves into prep — Zuri walks through how SuiteDash handles the handoff automatically.',
    href: 'https://help.suitedash.com/article/394-office-billing-your-clients',
    linkLabel: 'Configure invoices and payments in SuiteDash →',
  },
  {
    topic: 'Phase 5 — Prep + Review',
    summary:
      'Zuri covers the internal side of the order: the team tasks that move the return through preparation and review, and the missing-documents follow-up form for when something is incomplete. This is the work your bureau actually does behind the scenes.',
    href: 'https://help.suitedash.com/article/68-task-templates',
    linkLabel: 'Build your prep workflow with Task Templates →',
  },
  {
    topic: 'Phase 7 — File',
    summary:
      'Zuri walks through the Return Filed form — the simple internal form that records the moment the return is transmitted to the IRS or a state. Its purpose is to log what was filed and when, so the rest of the order can move into delivery.',
    href: 'https://help.suitedash.com/article/286-update-forms',
    linkLabel: 'Use Update Forms to record the filed return →',
  },
  {
    topic: 'Phase 8 — Deliver + Close',
    summary:
      'Zuri shows how the order closes: the filing summary handoff, the client exit survey, and the portal experience the taxpayer sees at the end. This is where the relationship transitions from active engagement to closed file.',
    href: 'https://help.suitedash.com/article/53-creating-a-portal-page',
    linkLabel: 'Configure the client Portal Page for delivery →',
  },
  {
    topic: 'Phase 6 — E-Sign',
    summary:
      'Zuri saves e-sign for last because it isn’t a single phase — it touches the agreement in Phase 3, the 8879 authorization between prep and file, and any other document you ever need a taxpayer to sign. She walks through the 8879 generator and the eSign workflow that powers all of it.',
    href: 'https://help.suitedash.com/article/116-documents-digital-signing',
    linkLabel: 'Set up Digital eSigning in SuiteDash →',
  },
  {
    topic: 'Course Closer — Where to Go From Here',
    summary:
      'Zuri recaps the 8 phases and points you at where to go when you need help applying any of it. If you want to go deeper than the videos, the SuiteDash help center is the source of truth for every feature this course touches.',
    href: 'https://help.suitedash.com/',
    linkLabel: 'Browse the general SuiteDash documentation →',
  },
]

const youtubeChannelUrl = 'https://www.youtube.com/@taxpreppro'

export default function ZuriPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="mb-3 inline-flex items-center rounded-full border border-[var(--accent-border)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
        Reference Guide
      </div>

      <h1 className="font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
        Tax Prep Pro Setup{' '}
        <span className="italic" style={{ color: 'var(--theme-color)' }}>
          with Zuri
        </span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--color-text-2)]">
        Companion documentation for the YouTube series. Each section names a
        topic Zuri covers on video and links to the official SuiteDash help
        article you&rsquo;ll need to implement it in your own workspace.
      </p>

      <div className="mt-16 space-y-12">
        {sections.map((section, index) => (
          <article
            key={section.topic}
            className="border-t border-[var(--color-border)] pt-10"
          >
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-primary)]">
              Section {index + 1} of {sections.length}
            </div>
            <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight text-[var(--color-text-1)] sm:text-3xl">
              {section.topic}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-text-2)] sm:text-lg">
              {section.summary}
            </p>
            <a
              href={section.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
              style={{
                backgroundColor: 'var(--accent-soft)',
                border: '1px solid var(--accent-border)',
                color: 'var(--accent-primary)',
              }}
            >
              {section.linkLabel}
            </a>
          </article>
        ))}
      </div>

      <footer className="mt-20 border-t border-[var(--color-border)] pt-10 text-sm text-[var(--color-text-3)]">
        <p>
          Watching on YouTube?{' '}
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[var(--accent-primary)] underline-offset-4 hover:underline"
          >
            Subscribe to the channel
          </a>{' '}
          for the rest of the series.
        </p>
        <p className="mt-2 text-[var(--color-text-3)]">
          SuiteDash help articles open on{' '}
          <span className="text-[var(--color-text-2)]">help.suitedash.com</span>{' '}
          and are maintained by SuiteDash, not Tax Prep Pro.
        </p>
      </footer>
    </section>
  )
}
