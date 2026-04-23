'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { getGameBySlug, type VesperiGame } from '@/lib/vesperi-tree'
import { getVideoBySlug, TOPIC_CLUSTERS, type TopicClusterId } from '@/lib/youtube-content'

function tierBadgeClass(tokens: 2 | 5 | 8): string {
  if (tokens === 2) return 'token-badge token-badge-2'
  if (tokens === 5) return 'token-badge token-badge-5'
  return 'token-badge token-badge-8'
}

function LearnCard({ game, index }: { game: VesperiGame; index: number }) {
  const video = getVideoBySlug(game.slug)
  const published = Boolean(video?.youtubeUrl)
  return (
    <Link
      href={`/learn/${game.slug}`}
      className="arcade-card-interactive group flex flex-col p-5 animate-fade-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neon-cyan">
          {game.type}
        </span>
        <span className={tierBadgeClass(game.tokens)}>
          {game.tokens}t
        </span>
      </div>
      <h3 className="mb-1.5 font-sora text-base font-bold leading-tight text-white group-hover:text-neon-violet transition-colors">
        {game.title}
      </h3>
      <p className="mb-4 flex-1 text-sm leading-relaxed text-arcade-text-muted">{game.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs font-semibold text-arcade-text-muted">Walkthrough →</span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
            published
              ? 'border-neon-green/40 bg-neon-green/10 text-neon-green'
              : 'border-neon-amber/30 bg-neon-amber/10 text-neon-amber'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${published ? 'bg-neon-green' : 'bg-neon-amber animate-neon-pulse'}`}
            style={{ boxShadow: '0 0 8px currentColor' }}
          />
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

  function pillClass(active: boolean) {
    return `rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
      active
        ? 'border-neon-violet bg-neon-violet/15 text-white shadow-glow-violet'
        : 'border-arcade-border bg-arcade-surface text-arcade-text-muted hover:border-neon-violet/50 hover:text-white'
    }`
  }

  return (
    <div className="min-h-screen">
      <div className="relative mx-auto max-w-6xl px-4 pt-14 pb-20 sm:px-6">
        <div className="mb-10 text-center">
          <span className="arcade-eyebrow mb-4 inline-block">★ Guides &amp; Walkthroughs ★</span>
          <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-white neon-text-violet sm:text-5xl">
            Learn — Tax Tools Arcade
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-arcade-text-muted sm:text-lg">
            Video walkthroughs and guides for every game in the Tax Tools Arcade.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={() => setFilter(ALL_FILTER)} className={pillClass(filter === ALL_FILTER)}>
            All Topics
          </button>
          {TOPIC_CLUSTERS.map((c) => (
            <button key={c.id} type="button" onClick={() => setFilter(c.id)} className={pillClass(filter === c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        {visibleClusters.map((cluster) => (
          <section key={cluster.id} className="mb-14">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-sora text-2xl font-bold text-white">
                {cluster.label}
                <span className="ml-3 text-sm font-medium text-neon-cyan">
                  · {cluster.games.length} games
                </span>
              </h2>
            </div>
            <p className="mb-5 text-sm text-arcade-text-muted">{cluster.description}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cluster.games.map((g, i) => (
                <LearnCard key={g.slug} game={g} index={i} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
