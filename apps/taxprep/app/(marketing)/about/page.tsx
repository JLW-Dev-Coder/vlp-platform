import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Tax Prep Pro is the productized SuiteDash buildout for service bureaus and credentialed tax practitioners.',
}

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="font-display text-5xl font-semibold tracking-tight text-[var(--color-text-1)]">
        About <span className="italic text-[var(--tpp-rose)]">Tax Prep Pro</span>
      </h1>

      <div className="mt-10 space-y-8 text-lg leading-relaxed text-[var(--color-text-2)]">
        <p>
          Tax Prep Pro is the productized SuiteDash buildout for service bureaus and credentialed tax practitioners — EAs, CPAs, and attorneys who want a clear 8-phase client journey, a branded portal, and member training without spending six months wiring it themselves.
        </p>
        <p>
          We don&rsquo;t replace your tax software, your e-file pipeline, or your professional judgment. We replace the swirl of clipboards, email threads, signed PDFs, and &ldquo;did you upload that yet?&rdquo; with one branded workspace your clients actually finish.
        </p>
        <p>
          The platform is opinionated on workflow and quiet on branding so your bureau&rsquo;s identity is the thing clients see — not ours.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2">
        {[
          { title: "Who it's for", body: 'Solo practitioners, 2–5 person bureaus, and multi-preparer firms who want a defensible, repeatable client journey.' },
          { title: 'What you get', body: 'Branded SuiteDash workspace, intake → filing → delivery, member training, optional Tax Monitor Pro bundle.' },
          { title: 'How it ships', body: '~30 days from kickoff to a ready-to-onboard client workspace. Discovery Call → setup → handoff → ongoing support.' },
          { title: 'Why SD-led', body: 'Members live where the work happens. SuiteDash handles auth, files, e-sign, billing, and the audit trail your practice already needs.' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--tpp-rose)]">
              {card.title}
            </h2>
            <p className="mt-3 text-base text-[var(--color-text-2)]">{card.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
