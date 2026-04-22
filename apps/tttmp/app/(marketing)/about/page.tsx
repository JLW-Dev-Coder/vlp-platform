import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'About Tax Tools Arcade',
  description: 'Tax Tools Arcade is 21 interactive games that teach IRS forms, tax concepts, and filing requirements by playing.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-primary">About</p>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">Tax Tools Arcade — Learn Tax by Playing</h1>
        <p className="text-lg text-text-muted">
          21 interactive games that turn IRS forms, transaction codes, and filing rules into something you can
          actually remember.
        </p>
      </header>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">What it is</h2>
          <p className="text-text-muted">
            A growing library of short, focused games covering real IRS material: Form 843, Form 1040 Schedule A,
            transaction codes, collection notices, Circular 230, and more. Each game teaches one concept by
            making you do it.
          </p>
        </div>
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">Who it&apos;s for</h2>
          <p className="text-text-muted">
            Tax professionals sharpening skills before busy season. Students prepping for EA, CPA, or tax-law
            exams. Taxpayers who want to understand what they&apos;re actually signing and owing.
          </p>
        </div>
      </section>

      <section className="mb-12 rounded-2xl border border-default bg-surface-elevated p-8">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">How it works</h2>
        <ol className="space-y-3 text-text-muted">
          <li><span className="font-semibold text-text-primary">1. Buy tokens.</span> Small packs, no subscription required.</li>
          <li><span className="font-semibold text-text-primary">2. Pick a game.</span> Use Vesperi (our AI guide) or browse the catalog directly.</li>
          <li><span className="font-semibold text-text-primary">3. Learn by doing.</span> Every game explains the concept as you play and tracks your progress.</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-text-primary">The game library</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-default bg-surface-elevated p-5">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-emerald-400">Starter — 2 tokens</p>
            <p className="text-text-muted">Quick matching and quiz games for foundational concepts and terminology.</p>
          </div>
          <div className="rounded-xl border border-default bg-surface-elevated p-5">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-sky-400">Intermediate — 5 tokens</p>
            <p className="text-text-muted">Scenario-based games covering transcripts, notices, and filing workflows.</p>
          </div>
          <div className="rounded-xl border border-default bg-surface-elevated p-5">
            <p className="mb-1 text-sm font-semibold uppercase tracking-wider text-amber-400">Advanced — 8 tokens</p>
            <p className="text-text-muted">Deep-dive simulators, adventures, and RPG-style scenarios through complex rule sets.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/vesperi"
          className="rounded-lg bg-brand-primary px-5 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover"
        >
          Find Your Game
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border border-default bg-surface-elevated px-5 py-3 font-semibold text-text-primary hover:bg-surface-popover"
        >
          View Pricing
        </Link>
      </div>
    </div>
  )
}
