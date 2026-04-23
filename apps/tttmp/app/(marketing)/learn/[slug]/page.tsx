import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { GAME_CATALOG, getGameBySlug, type VesperiGame } from '@/lib/vesperi-tree'
import { getVideoBySlug, TOPIC_CLUSTERS, YOUTUBE_CHANNEL_URL } from '@/lib/youtube-content'

export function generateStaticParams() {
  return GAME_CATALOG.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const video = getVideoBySlug(slug)
  const game = getGameBySlug(slug)
  if (!video || !game) return { title: 'Not Found' }
  const url = `https://taxtools.taxmonitor.pro/learn/${slug}`
  return {
    title: `${video.companionTitle} — Tax Tools Arcade`,
    description: video.companionDescription,
    alternates: { canonical: url },
    openGraph: {
      title: `${video.companionTitle} — Tax Tools Arcade`,
      description: video.companionDescription,
      url,
      siteName: 'Tax Tools Arcade',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${video.companionTitle} — Tax Tools Arcade`,
      description: video.companionDescription,
    },
  }
}

function tierMeta(tokens: 2 | 5 | 8): { label: string; badge: string } {
  if (tokens === 2) return { label: 'Starter',      badge: 'token-badge token-badge-2' }
  if (tokens === 5) return { label: 'Intermediate', badge: 'token-badge token-badge-5' }
  return               { label: 'Advanced',     badge: 'token-badge token-badge-8' }
}

function keyConcepts(game: VesperiGame): string[] {
  const base = [
    `${game.type} gameplay — ${game.description.replace(/\.$/, '').toLowerCase()}.`,
    `Tier: ${tierMeta(game.tokens).label} (${game.tokens} tokens).`,
    `Learn by doing — no lectures, no jargon.`,
  ]
  return base
}

function relatedGames(slug: string): VesperiGame[] {
  const cluster = TOPIC_CLUSTERS.find((c) => c.gameSlugs.includes(slug))
  if (!cluster) return []
  return cluster.gameSlugs
    .filter((s) => s !== slug)
    .map(getGameBySlug)
    .filter((g): g is VesperiGame => Boolean(g))
    .slice(0, 3)
}

const CAL_URL = 'https://cal.com/tax-monitor-pro/tttmp-intro'

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const video = getVideoBySlug(slug)
  const game = getGameBySlug(slug)
  if (!video || !game) notFound()

  const tier = tierMeta(game.tokens)
  const related = relatedGames(slug)

  const videoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description,
    thumbnailUrl: 'https://taxtools.taxmonitor.pro/og-default.png',
    uploadDate: '2026-04-21',
    ...(video.youtubeUrl
      ? {
          contentUrl: video.youtubeUrl,
          embedUrl: video.youtubeUrl.replace('watch?v=', 'embed/'),
        }
      : {}),
    publisher: {
      '@type': 'Organization',
      name: 'Tax Tools Arcade',
      url: 'https://taxtools.taxmonitor.pro',
    },
  }

  const youtubeEmbedUrl = video.youtubeUrl
    ? video.youtubeUrl.replace('watch?v=', 'embed/')
    : null

  return (
    <>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }}
      />
      <div className="min-h-screen">
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
          <div className="mb-6">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 rounded-full border border-arcade-border bg-arcade-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neon-cyan transition-all hover:border-neon-cyan/60 hover:shadow-glow-cyan hover:text-white"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              All Guides
            </Link>
          </div>

          <div className="mb-8 text-center">
            <span className="arcade-eyebrow mb-4 inline-block">▶ Video Walkthrough</span>
            <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-white neon-text-violet sm:text-5xl">
              {video.companionTitle}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-arcade-text-muted sm:text-lg">
              {video.companionDescription}
            </p>
          </div>

          <div className="arcade-card-static mb-8 overflow-hidden shadow-glow-violet">
            <div className="aspect-video w-full bg-gradient-to-br from-[#1a0e2e] via-[#0f0a1f] to-black">
              {youtubeEmbedUrl ? (
                <iframe
                  className="h-full w-full"
                  src={youtubeEmbedUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(139,92,246,0.15)] text-[#a78bfa]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p className="max-w-md text-base font-semibold text-white/80">
                    Video coming soon
                  </p>
                  <p className="max-w-md text-sm text-white/55">
                    We’re publishing walkthroughs for every game in the Tax Tools Arcade. Check back once our YouTube channel launches — or play the game now.
                  </p>
                  <a
                    href={YOUTUBE_CHANNEL_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/70 transition-colors hover:border-white/20 hover:text-white"
                  >
                    Subscribe on YouTube
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="arcade-card-static mb-8 p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neon-cyan">
                    {game.type}
                  </span>
                  <span className={tier.badge}>
                    {tier.label} · {game.tokens}t
                  </span>
                </div>
                <h2 className="font-sora text-2xl font-bold text-white">{game.title}</h2>
              </div>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-arcade-text sm:text-base">
              {game.description}
            </p>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row">
              <Link href={`/games/${game.slug}`} className="arcade-btn arcade-btn-primary flex-1">
                ▶ Play This Game
              </Link>
              <Link href="/vesperi" className="arcade-btn arcade-btn-cyan flex-1">
                Find Your Game with Vesperi
              </Link>
              <a href={CAL_URL} target="_blank" rel="noopener noreferrer" className="arcade-btn arcade-btn-secondary flex-1">
                Talk to Us
              </a>
            </div>
          </div>

          <div className="arcade-card-static mb-8 p-6">
            <h3 className="mb-4 font-sora text-lg font-bold text-neon-violet">What you&apos;ll learn</h3>
            <ul className="space-y-3">
              {keyConcepts(game).map((concept, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-arcade-text sm:text-base">
                  <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-neon-green/15 text-neon-green border border-neon-green/40"
                        style={{ boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
          </div>

          {related.length > 0 && (
            <div>
              <h3 className="mb-4 font-sora text-lg font-bold text-neon-pink">Related games</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((g) => {
                  const t = tierMeta(g.tokens)
                  return (
                    <Link key={g.slug} href={`/learn/${g.slug}`} className="arcade-card group flex flex-col p-5">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <span className="inline-flex items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neon-cyan">
                          {g.type}
                        </span>
                        <span className={t.badge}>{g.tokens}t</span>
                      </div>
                      <h4 className="font-sora text-base font-bold text-white group-hover:text-neon-violet transition-colors">{g.title}</h4>
                      <p className="mt-2 text-xs text-arcade-text-muted">{g.description}</p>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
