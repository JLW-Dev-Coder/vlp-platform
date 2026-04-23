import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'

export const metadata = generatePageMeta({
  title: 'Reviews — Tax Tools Arcade',
  description: 'Reviews from tax professionals and taxpayers using Tax Tools Arcade.',
  domain: 'taxtools.taxmonitor.pro',
  path: '/reviews',
})

export default function ReviewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-12">
        <span className="arcade-eyebrow mb-4 inline-block">Reviews</span>
        <h1 className="mb-4 font-sora text-4xl font-bold text-white neon-text-amber sm:text-5xl">
          Reviews Are Rolling In
        </h1>
        <p className="text-lg text-arcade-text-muted">
          Public reviews will appear here once the arcade collects enough feedback. In the meantime, play a game
          and tell us what worked.
        </p>
      </header>

      <div className="arcade-card mb-10 p-8 text-center">
        <div className="mb-4 flex justify-center gap-1 text-neon-amber" aria-hidden
             style={{ textShadow: '0 0 14px currentColor' }}>
          {'★★★★★'.split('').map((s, i) => (<span key={i}>{s}</span>))}
        </div>
        <p className="mb-5 text-arcade-text">Want to leave a review? Reach out directly and we&apos;ll feature it.</p>
        <Link href="/contact" className="arcade-btn arcade-btn-primary">Send Feedback</Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/vesperi" className="arcade-btn arcade-btn-cyan">Meet Vesperi</Link>
        <Link href="/games" className="arcade-btn arcade-btn-secondary">Browse Games</Link>
      </div>
    </div>
  )
}
