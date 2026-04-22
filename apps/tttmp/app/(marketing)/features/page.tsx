import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Features — Tax Tools Arcade',
  description: 'Game types, token system, Vesperi AI guide, and walkthroughs — everything inside the arcade.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/features',
})

const gameTypes = [
  { name: 'Matching', body: 'Drag, drop, and pair. Transaction codes to meanings, notices to actions.' },
  { name: 'Quiz', body: 'Fast true/false and multiple-choice rounds with explanation-as-you-go.' },
  { name: 'Scavenger', body: 'Hunt a transcript for the right line, the right date, the right amount.' },
  { name: 'Timeline', body: 'Put IRS events in order — statute dates, collection steps, audit sequences.' },
  { name: 'Adventure', body: 'Branch-path scenarios where your choices change the outcome.' },
  { name: 'RPG', body: 'Level up as you work a multi-stage case end-to-end.' },
  { name: 'Puzzle', body: 'Logic puzzles grounded in real tax-code edge cases.' },
  { name: 'Simulator', body: 'Fill out live forms against realistic taxpayer data.' },
]

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-primary">Features</p>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">Everything in the Arcade</h1>
        <p className="max-w-2xl text-lg text-text-muted">
          Eight game formats, a token system that scales with depth, an AI game guide, and walkthrough videos for
          every title.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-semibold text-text-primary">Game types</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gameTypes.map((g) => (
            <div key={g.name} className="rounded-xl border border-default bg-surface-elevated p-5">
              <h3 className="mb-1 font-semibold text-text-primary">{g.name}</h3>
              <p className="text-sm text-text-muted">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">Token system</h2>
          <p className="mb-4 text-text-muted">
            No subscription. Buy tokens, spend them per game. Each game is priced by depth:
          </p>
          <ul className="space-y-2 text-text-muted">
            <li><span className="font-semibold text-text-primary">Starter (2 tokens)</span> — foundational terms and quick drills.</li>
            <li><span className="font-semibold text-text-primary">Intermediate (5 tokens)</span> — applied workflows and case scenarios.</li>
            <li><span className="font-semibold text-text-primary">Advanced (8 tokens)</span> — deep simulations and multi-step cases.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">Vesperi — your AI game guide</h2>
          <p className="mb-4 text-text-muted">
            Don&apos;t know where to start? Tell Vesperi what you need to learn and she&apos;ll route you to the
            right game in under a minute.
          </p>
          <Link href="/vesperi" className="text-brand-primary underline hover:text-brand-hover">
            Try Vesperi →
          </Link>
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">Walkthrough videos</h2>
          <p className="mb-4 text-text-muted">
            Every game has a short companion video explaining the underlying IRS form or concept, so you learn
            the tax material either way.
          </p>
          <Link href="/learn" className="text-brand-primary underline hover:text-brand-hover">
            Browse walkthroughs →
          </Link>
        </div>
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">For tax pros &amp; taxpayers</h2>
          <p className="text-text-muted">
            Pros: send games to clients before appointments so they walk in understanding what they&apos;re
            signing. Taxpayers: learn the forms on your return without wading through the IRS website.
          </p>
        </div>
      </section>

      <div>
        <Link
          href="/pricing"
          className="rounded-lg bg-brand-primary px-5 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover"
        >
          Get Started
        </Link>
      </div>
    </div>
  )
}
