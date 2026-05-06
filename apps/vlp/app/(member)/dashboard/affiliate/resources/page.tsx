import type { Metadata } from 'next'
import Link from 'next/link'
import { RESOURCE_CATEGORIES, RESOURCES } from './resources-data'

export const metadata: Metadata = { title: 'Affiliate Resources' }

export default function AffiliateResourcesPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/affiliate"
          className="text-sm text-white/50 transition hover:text-white"
        >
          ← Back to affiliate dashboard
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-white">Affiliate Resources</h1>
        <p className="mt-1 text-sm text-white/50">
          Scripts, talking points, proposal templates, and FAQ responses to help you close referrals. Adapt the language to your voice.
        </p>
      </div>

      <div className="space-y-8">
        {RESOURCE_CATEGORIES.map((category) => {
          const items = RESOURCES.filter((r) => r.category === category.id)
          return (
            <section
              key={category.id}
              className="rounded-xl border border-[--member-border] bg-[--member-card] p-6"
            >
              <div className="mb-4 border-b border-[--member-border] pb-3">
                <h2 className="text-lg font-semibold text-white">{category.label}</h2>
                <p className="mt-1 text-sm text-white/50">{category.description}</p>
              </div>
              {items.length === 0 ? (
                <p className="text-sm italic text-white/40">No resources yet.</p>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-lg border border-[--member-border] bg-white/[0.02] p-5"
                    >
                      <h3 className="text-base font-medium text-white">{item.title}</h3>
                      <p className="mt-1 text-sm text-white/50">{item.description}</p>
                      <pre className="mt-3 whitespace-pre-wrap rounded bg-black/30 p-3 text-sm leading-relaxed text-white/70">
{item.body}
                      </pre>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
