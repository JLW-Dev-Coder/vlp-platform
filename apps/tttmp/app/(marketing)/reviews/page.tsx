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
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-brand-primary">Reviews</p>
        <h1 className="mb-4 text-4xl font-bold text-text-primary sm:text-5xl">Reviews Are Rolling In</h1>
        <p className="text-lg text-text-muted">
          Public reviews will appear here once the arcade collects enough feedback. In the meantime, play a game
          and tell us what worked.
        </p>
      </header>

      <div className="mb-10 rounded-2xl border border-default bg-surface-elevated p-8 text-center">
        <p className="mb-4 text-text-muted">Want to leave a review? Reach out directly and we&apos;ll feature it.</p>
        <Link
          href="/contact"
          className="inline-block rounded-lg bg-brand-primary px-5 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover"
        >
          Send Feedback
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/vesperi"
          className="rounded-lg border border-default bg-surface-elevated px-5 py-3 font-semibold text-text-primary hover:bg-surface-popover"
        >
          Meet Vesperi
        </Link>
        <Link
          href="/games"
          className="rounded-lg border border-default bg-surface-elevated px-5 py-3 font-semibold text-text-primary hover:bg-surface-popover"
        >
          Browse Games
        </Link>
      </div>
    </div>
  )
}
