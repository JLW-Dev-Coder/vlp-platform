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
        <span className="arcade-eyebrow mb-4 inline-block">About</span>
        <h1 className="mb-4 font-sora text-4xl font-bold text-white neon-text-violet sm:text-5xl">
          Tax Tools Arcade — Learn Tax by Playing
        </h1>
        <p className="text-lg text-arcade-text-muted max-w-3xl">
          21 interactive games that turn IRS forms, transaction codes, and filing rules into something you can
          actually remember.
        </p>
      </header>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="arcade-card p-6">
          <h2 className="mb-2 font-sora text-xl font-bold text-neon-cyan">What it is</h2>
          <p className="text-arcade-text-muted">
            A growing library of short, focused games covering real IRS material: Form 843, Form 1040 Schedule A,
            transaction codes, collection notices, Circular 230, and more. Each game teaches one concept by
            making you do it.
          </p>
        </div>
        <div className="arcade-card p-6">
          <h2 className="mb-2 font-sora text-xl font-bold text-neon-pink">Who it&apos;s for</h2>
          <p className="text-arcade-text-muted">
            Tax professionals sharpening skills before busy season. Students prepping for EA, CPA, or tax-law
            exams. Taxpayers who want to understand what they&apos;re actually signing and owing.
          </p>
        </div>
      </section>

      <section className="arcade-card-static mb-12 p-8">
        <h2 className="mb-4 font-sora text-2xl font-bold text-white neon-text-violet">How it works</h2>
        <ol className="space-y-3 text-arcade-text-muted">
          <li><span className="font-bold text-neon-green">1. Buy tokens.</span> Small packs, no subscription required.</li>
          <li><span className="font-bold text-neon-cyan">2. Pick a game.</span> Use Vesperi (our AI guide) or browse the catalog directly.</li>
          <li><span className="font-bold text-neon-pink">3. Learn by doing.</span> Every game explains the concept as you play and tracks your progress.</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="mb-4 font-sora text-2xl font-bold text-white">The game library</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="arcade-card p-5">
            <span className="token-badge token-badge-2 mb-3">Starter · 2t</span>
            <p className="text-arcade-text-muted mt-3">Quick matching and quiz games for foundational concepts and terminology.</p>
          </div>
          <div className="arcade-card p-5">
            <span className="token-badge token-badge-5 mb-3">Intermediate · 5t</span>
            <p className="text-arcade-text-muted mt-3">Scenario-based games covering transcripts, notices, and filing workflows.</p>
          </div>
          <div className="arcade-card p-5">
            <span className="token-badge token-badge-8 mb-3">Advanced · 8t</span>
            <p className="text-arcade-text-muted mt-3">Deep-dive simulators, adventures, and RPG-style scenarios through complex rule sets.</p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/vesperi" className="arcade-btn arcade-btn-primary">Find Your Game</Link>
        <Link href="/pricing" className="arcade-btn arcade-btn-secondary">View Pricing</Link>
      </div>
    </div>
  )
}
