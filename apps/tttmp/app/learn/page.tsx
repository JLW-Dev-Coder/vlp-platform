'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import { getGameBySlug, type VesperiGame } from '@/lib/vesperi-tree'
import { getVideoBySlug, TOPIC_CLUSTERS, type TopicClusterId } from '@/lib/youtube-content'

function tierMeta(tokens: 2 | 5 | 8): { label: string; badge: string } {
  if (tokens === 2) return { label: 'Starter', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
  if (tokens === 5) return { label: 'Intermediate', badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30' }
  return { label: 'Advanced', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
}

function LearnCard({ game }: { game: VesperiGame }) {
  const tier = tierMeta(game.tokens)
  const video = getVideoBySlug(game.slug)
  const published = Boolean(video?.youtubeUrl)
  return (
    <Link
      href={`/learn/${game.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all backdrop-blur hover:-translate-y-0.5 hover:border-[rgba(139,92,246,0.40)] hover:bg-white/[0.05] hover:shadow-lg hover:shadow-[rgba(139,92,246,0.20)]"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          {game.type}
        </span>
        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tier.badge}`}>
          {tier.label}
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold leading-tight text-white group-hover:text-[#c4b5fd]">{game.title}</h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-white/60">{game.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs font-semibold text-white/50">{game.tokens} tokens</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            published
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
              : 'border-white/10 bg-white/[0.04] text-white/50'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-emerald-400' : 'bg-white/40'}`} />
          {published ? 'Video live' : 'Coming soon'}
        </span>
      </div>
    </Link>
  )
}

const ALL_FILTER = 'all' as const
type FilterId = typeof ALL_FILTER | TopicClusterId

export default function LearnIndexPage() {
  const [filter, setFilter] = useState<FilterId>(ALL_FILTER)

  const clusters = useMemo(() => {
    return TOPIC_CLUSTERS.map((c) => ({
      ...c,
      games: c.gameSlugs.map(getGameBySlug).filter((g): g is VesperiGame => Boolean(g)),
    }))
  }, [])

  const visibleClusters =
    filter === ALL_FILTER ? clusters : clusters.filter((c) => c.id === filter)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0a0714] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[rgba(139,92,246,0.12)] via-[rgba(139,92,246,0.04)] to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c4b5fd]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]" />
              Guides & Walkthroughs
            </div>
            <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Learn — Tax Tools Arcade
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
              Video walkthroughs and guides for every game in the Tax Tools Arcade.
            </p>
          </div>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setFilter(ALL_FILTER)}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                filter === ALL_FILTER
                  ? 'border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.15)] text-white'
                  : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white'
              }`}
            >
              All Topics
            </button>
            {TOPIC_CLUSTERS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  filter === c.id
                    ? 'border-[rgba(139,92,246,0.6)] bg-[rgba(139,92,246,0.15)] text-white'
                    : 'border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {visibleClusters.map((cluster) => (
            <section key={cluster.id} className="mb-12">
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-xl font-bold text-white">
                  {cluster.label}
                  <span className="ml-2 text-sm font-medium text-white/50">
                    · {cluster.games.length} games
                  </span>
                </h2>
              </div>
              <p className="mb-5 text-sm text-white/55">{cluster.description}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cluster.games.map((g) => (
                  <LearnCard key={g.slug} game={g} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
