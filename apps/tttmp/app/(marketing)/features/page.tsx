import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Features — Tax Tools Arcade',
  description: 'Game types, token system, Vesperi AI guide, and walkthroughs — everything inside the arcade.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/features',
})

const gameTypes: { name: string; body: string; color: 'violet' | 'cyan' | 'pink' | 'green' | 'amber' }[] = [
  { name: 'Matching',  body: 'Drag, drop, and pair. Transaction codes to meanings, notices to actions.',          color: 'violet' },
  { name: 'Quiz',      body: 'Fast true/false and multiple-choice rounds with explanation-as-you-go.',             color: 'cyan' },
  { name: 'Scavenger', body: 'Hunt a transcript for the right line, the right date, the right amount.',           color: 'pink' },
  { name: 'Timeline',  body: 'Put IRS events in order — statute dates, collection steps, audit sequences.',        color: 'green' },
  { name: 'Adventure', body: 'Branch-path scenarios where your choices change the outcome.',                       color: 'amber' },
  { name: 'RPG',       body: 'Level up as you work a multi-stage case end-to-end.',                                color: 'violet' },
  { name: 'Puzzle',    body: 'Logic puzzles grounded in real tax-code edge cases.',                                color: 'cyan' },
  { name: 'Simulator', body: 'Fill out live forms against realistic taxpayer data.',                               color: 'pink' },
]

const dotColor = {
  violet: 'bg-neon-violet shadow-glow-violet',
  cyan:   'bg-neon-cyan shadow-glow-cyan',
  pink:   'bg-neon-pink shadow-glow-pink',
  green:  'bg-neon-green shadow-glow-green',
  amber:  'bg-neon-amber shadow-glow-amber',
}

const textColor = {
  violet: 'text-neon-violet',
  cyan:   'text-neon-cyan',
  pink:   'text-neon-pink',
  green:  'text-neon-green',
  amber:  'text-neon-amber',
}

export default function FeaturesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <header className="mb-12">
        <span className="arcade-eyebrow mb-4 inline-block">Features</span>
        <h1 className="mb-4 font-sora text-4xl font-bold text-white neon-text-violet sm:text-5xl">Everything in the Arcade</h1>
        <p className="max-w-2xl text-lg text-arcade-text-muted">
          Eight game formats, a token system that scales with depth, an AI game guide, and walkthrough videos for
          every title.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="mb-6 font-sora text-2xl font-bold text-white">Game types</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {gameTypes.map((g, i) => (
            <div
              key={g.name}
              className="arcade-card p-5 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <div className={`w-2.5 h-2.5 rounded-full mb-3 ${dotColor[g.color]}`} />
              <h3 className={`mb-1 font-sora font-bold ${textColor[g.color]}`}>{g.name}</h3>
              <p className="text-sm text-arcade-text-muted">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="arcade-card p-6">
          <h2 className="mb-3 font-sora text-xl font-bold text-neon-violet">Token system</h2>
          <p className="mb-4 text-arcade-text-muted">
            No subscription. Buy tokens, spend them per game. Each game is priced by depth:
          </p>
          <ul className="space-y-3 text-arcade-text-muted">
            <li className="flex items-start gap-3"><span className="token-badge token-badge-2 flex-shrink-0 mt-0.5">2t</span><span><strong className="text-white">Starter</strong> — foundational terms and quick drills.</span></li>
            <li className="flex items-start gap-3"><span className="token-badge token-badge-5 flex-shrink-0 mt-0.5">5t</span><span><strong className="text-white">Intermediate</strong> — applied workflows and case scenarios.</span></li>
            <li className="flex items-start gap-3"><span className="token-badge token-badge-8 flex-shrink-0 mt-0.5">8t</span><span><strong className="text-white">Advanced</strong> — deep simulations and multi-step cases.</span></li>
          </ul>
        </div>
        <div className="arcade-card p-6">
          <h2 className="mb-3 font-sora text-xl font-bold text-neon-pink">Vesperi — your AI game guide</h2>
          <p className="mb-4 text-arcade-text-muted">
            Don&apos;t know where to start? Tell Vesperi what you need to learn and she&apos;ll route you to the
            right game in under a minute.
          </p>
          <Link href="/vesperi" className="text-neon-cyan underline-offset-4 hover:underline hover:text-white transition-colors">
            Try Vesperi →
          </Link>
        </div>
      </section>

      <section className="mb-16 grid gap-6 md:grid-cols-2">
        <div className="arcade-card p-6">
          <h2 className="mb-3 font-sora text-xl font-bold text-neon-green">Walkthrough videos</h2>
          <p className="mb-4 text-arcade-text-muted">
            Every game has a short companion video explaining the underlying IRS form or concept, so you learn
            the tax material either way.
          </p>
          <Link href="/learn" className="text-neon-cyan underline-offset-4 hover:underline hover:text-white transition-colors">
            Browse walkthroughs →
          </Link>
        </div>
        <div className="arcade-card p-6">
          <h2 className="mb-3 font-sora text-xl font-bold text-neon-amber">For tax pros &amp; taxpayers</h2>
          <p className="text-arcade-text-muted">
            Pros: send games to clients before appointments so they walk in understanding what they&apos;re
            signing. Taxpayers: learn the forms on your return without wading through the IRS website.
          </p>
        </div>
      </section>

      <div>
        <Link href="/pricing" className="arcade-btn arcade-btn-primary">Get Started</Link>
      </div>
    </div>
  )
}
