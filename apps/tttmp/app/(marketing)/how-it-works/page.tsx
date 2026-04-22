import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'How It Works — Tax Tools Arcade',
  description: 'Three steps to tax mastery: pick a path with Vesperi, spend tokens, and learn by doing.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/how-it-works',
})

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-primary">How It Works</p>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">Three Steps to Tax Mastery</h1>
        <p className="text-lg text-text-muted">
          No syllabus. No lectures. Just games that teach IRS procedures by making you do them.
        </p>
      </header>

      <ol className="mb-16 space-y-6">
        <li className="rounded-2xl border border-default bg-surface-elevated p-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary font-bold text-brand-text-on-primary">1</span>
            <h2 className="text-xl font-semibold text-text-primary">Choose your path</h2>
          </div>
          <p className="text-text-muted">
            Use <Link href="/vesperi" className="text-brand-primary underline hover:text-brand-hover">Vesperi</Link>,
            our AI guide, to get a tailored game pick — or browse the full <Link href="/games" className="text-brand-primary underline hover:text-brand-hover">game library</Link> directly.
          </p>
        </li>

        <li className="rounded-2xl border border-default bg-surface-elevated p-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary font-bold text-brand-text-on-primary">2</span>
            <h2 className="text-xl font-semibold text-text-primary">Use tokens</h2>
          </div>
          <p className="text-text-muted">
            Each game costs 2, 5, or 8 tokens depending on depth. Buy a pack once — tokens don&apos;t expire.
            VLP members get tokens included.
          </p>
        </li>

        <li className="rounded-2xl border border-default bg-surface-elevated p-6">
          <div className="mb-2 flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary font-bold text-brand-text-on-primary">3</span>
            <h2 className="text-xl font-semibold text-text-primary">Learn by doing</h2>
          </div>
          <p className="text-text-muted">
            Every game is grounded in a real IRS form, code section, or workflow — and explains the concept as
            you play. Every title has a companion walkthrough video if you want to review.
          </p>
        </li>
      </ol>

      <section className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">For tax pros</h2>
          <p className="text-text-muted">
            Send game links to clients before appointments. They walk in understanding their transcript, their
            notice, or what a Form 843 even is — and the meeting gets shorter.
          </p>
        </div>
        <div className="rounded-2xl border border-default bg-surface-elevated p-6">
          <h2 className="mb-2 text-xl font-semibold text-text-primary">For taxpayers</h2>
          <p className="text-text-muted">
            Stop signing things you don&apos;t understand. Play the game for your form and you&apos;ll know what
            each line means before you file.
          </p>
        </div>
      </section>

      <Link
        href="/vesperi"
        className="rounded-lg bg-brand-primary px-5 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover"
      >
        Start with Vesperi
      </Link>
    </div>
  )
}
