import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'How It Works — Tax Tools Arcade',
  description: 'Three steps to tax mastery: pick a path with Vesperi, spend tokens, and learn by doing.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/how-it-works',
})

const steps = [
  { n: 1, color: 'violet' as const, title: 'Choose your path',
    body: <>Use <Link href="/vesperi" className="text-neon-cyan underline-offset-4 hover:underline">Vesperi</Link>, our AI guide, to get a tailored game pick — or browse the full <Link href="/games" className="text-neon-cyan underline-offset-4 hover:underline">game library</Link> directly.</> },
  { n: 2, color: 'cyan' as const, title: 'Use tokens',
    body: <>Each game costs 2, 5, or 8 tokens depending on depth. Buy a pack once — tokens don&apos;t expire. VLP members get tokens included.</> },
  { n: 3, color: 'pink' as const, title: 'Learn by doing',
    body: <>Every game is grounded in a real IRS form, code section, or workflow — and explains the concept as you play. Every title has a companion walkthrough video if you want to review.</> },
]

const badgeBg = {
  violet: 'bg-neon-violet/15 border-neon-violet/50 text-neon-violet',
  cyan:   'bg-neon-cyan/15 border-neon-cyan/50 text-neon-cyan',
  pink:   'bg-neon-pink/15 border-neon-pink/50 text-neon-pink',
}

const hColor = {
  violet: 'text-neon-violet',
  cyan:   'text-neon-cyan',
  pink:   'text-neon-pink',
}

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="mb-12">
        <span className="arcade-eyebrow mb-4 inline-block">How It Works</span>
        <h1 className="mb-4 font-sora text-4xl font-bold text-white neon-text-violet sm:text-5xl">
          Three Steps to Tax Mastery
        </h1>
        <p className="text-lg text-arcade-text-muted">
          No syllabus. No lectures. Just games that teach IRS procedures by making you do them.
        </p>
      </header>

      <ol className="mb-16 space-y-6">
        {steps.map((s, i) => (
          <li
            key={s.n}
            className="arcade-card p-6 animate-fade-up"
            style={{ animationDelay: `${i * 90}ms`, animationFillMode: 'backwards' }}
          >
            <div className="mb-3 flex items-center gap-4">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full font-bold border ${badgeBg[s.color]}`}
                    style={{ boxShadow: '0 0 16px currentColor' }}>
                {s.n}
              </span>
              <h2 className={`font-sora text-xl font-bold ${hColor[s.color]}`}>{s.title}</h2>
            </div>
            <p className="text-arcade-text-muted">{s.body}</p>
          </li>
        ))}
      </ol>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="arcade-card p-6">
          <h2 className="mb-2 font-sora text-xl font-bold text-neon-green">For tax pros</h2>
          <p className="text-arcade-text-muted">
            Send game links to clients before appointments. They walk in understanding their transcript, their
            notice, or what a Form 843 even is — and the meeting gets shorter.
          </p>
        </div>
        <div className="arcade-card p-6">
          <h2 className="mb-2 font-sora text-xl font-bold text-neon-amber">For taxpayers</h2>
          <p className="text-arcade-text-muted">
            Stop signing things you don&apos;t understand. Play the game for your form and you&apos;ll know what
            each line means before you file.
          </p>
        </div>
      </section>

      <Link href="/vesperi" className="arcade-btn arcade-btn-primary">Start with Vesperi</Link>
    </div>
  )
}
