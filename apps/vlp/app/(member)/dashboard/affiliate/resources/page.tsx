import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS } from './resources-data'

export const metadata: Metadata = { title: 'Affiliate Resources' }

export default function AffiliateResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard/affiliate"
          className="text-sm text-[--member-muted] transition hover:text-[--member-text]"
        >
          ← Back to affiliate dashboard
        </Link>
      </div>

      <div className="mb-10">
        <h1 className="mb-2 text-3xl font-semibold text-[--member-text]">Affiliate Resources</h1>
        <p className="text-sm leading-relaxed text-[--member-muted]">
          Outreach scripts, talking points, proposal templates, and FAQ responses for every VLP product. Pick a product to see its full asset pack — your referral link is auto-inserted into every script.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((product) => (
          <Link
            key={product.slug}
            href={`/dashboard/affiliate/resources/${product.slug}`}
            className="group rounded-xl border border-[--member-border] bg-[--member-card] p-6 transition hover:border-brand-primary/50"
          >
            <h2 className="mb-1 text-lg font-semibold text-[--member-text]">{product.name}</h2>
            <p className="mb-3 text-xs uppercase tracking-wider text-brand-primary">{product.tagline}</p>
            <p className="mb-4 text-sm leading-relaxed text-[--member-muted]">{product.summary}</p>
            <span className="text-sm font-medium text-brand-primary transition group-hover:underline">
              View asset pack →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
