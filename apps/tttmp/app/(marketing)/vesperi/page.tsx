'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { getPostHogClient } from '@vlp/member-ui'
import {
  VESPERI_TREE,
  GAME_CATALOG,
  VESPERI_VIDEO_BASE,
  clipNameForNode,
  getGameBySlug,
  type VesperiNode,
  type VesperiGame,
  type Audience,
  type TopicId,
} from '@/lib/vesperi-tree'

function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return
  try {
    const client = getPostHogClient()
    if (!client) return
    if (client.has_opted_out_capturing?.()) return
    client.capture(event, props)
  } catch {
    /* analytics must never break UX */
  }
}

function emailDomain(email: string): string {
  const at = email.indexOf('@')
  return at >= 0 ? email.slice(at + 1).toLowerCase() : ''
}

function tierClasses(tokens: 2 | 5 | 8): { badge: string; label: string } {
  if (tokens === 2) return { badge: 'token-badge token-badge-2', label: 'Starter' }
  if (tokens === 5) return { badge: 'token-badge token-badge-5', label: 'Intermediate' }
  return { badge: 'token-badge token-badge-8', label: 'Advanced' }
}

function GameCard({ game, onPlay }: { game: VesperiGame; onPlay: (g: VesperiGame) => void }) {
  const tier = tierClasses(game.tokens)
  return (
    <article className="arcade-card-interactive group relative flex flex-col p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-neon-cyan/30 bg-neon-cyan/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-neon-cyan">
          {game.type}
        </span>
        <span className={tier.badge} title={`${tier.label} tier`}>
          {game.tokens}t
        </span>
      </div>
      <h3 className="mb-1.5 font-sora text-base font-bold leading-tight text-white">{game.title}</h3>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-arcade-text-muted">{game.description}</p>
      <button type="button" onClick={() => onPlay(game)} className="arcade-btn arcade-btn-primary mt-auto">
        ▶ Play
      </button>
    </article>
  )
}

type IntakeStatus = 'idle' | 'submitting' | 'success' | 'error'

function IntakeForm({
  audience,
  topic,
  sourceNode,
}: {
  audience: Audience
  topic: TopicId
  sourceNode: string
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<IntakeStatus>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!emailValid || status === 'submitting') return
    setStatus('submitting')
    setErrorMsg(null)
    try {
      const url = new URL(window.location.href)
      const res = await fetch('https://api.taxmonitor.pro/v1/tttmp/vesperi/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          audience,
          topic,
          source_node: sourceNode,
          utm_source: url.searchParams.get('utm_source') || 'vesperi',
          utm_medium: url.searchParams.get('utm_medium') || 'landing',
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Submission failed' }))
        throw new Error(err?.error || 'Submission failed')
      }
      setStatus('success')
      track('vesperi_intake_submit', {
        audience,
        topic,
        email_domain: emailDomain(email.trim()),
      })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-neon-green/40 bg-neon-green/10 p-5 text-center shadow-glow-green">
        <p className="text-sm font-bold text-neon-green">
          ✓ Thanks! We&apos;ll send game tips and new releases to {email.trim()}.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="arcade-card-static p-6">
      <div className="mb-1 flex items-center gap-2">
        <span className="arcade-eyebrow">Optional</span>
      </div>
      <h4 className="mb-1 mt-3 font-sora text-base font-bold text-white">Stay in the loop</h4>
      <p className="mb-4 text-sm text-arcade-text-muted">
        Get a monthly email when we add new games or update existing ones. Unsubscribe anytime.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="arcade-input flex-1"
        />
        <button
          type="submit"
          disabled={!emailValid || status === 'submitting'}
          className="arcade-btn arcade-btn-primary"
        >
          {status === 'submitting' ? 'Submitting…' : 'Get Game Updates'}
        </button>
      </div>
      {status === 'error' && errorMsg && (
        <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
      )}
    </form>
  )
}

function VesperiVideo({ nodeId, fallbackText }: { nodeId: string; fallbackText: string }) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [muted, setMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const src = `${VESPERI_VIDEO_BASE}/${clipNameForNode(nodeId)}.mp4`

  useEffect(() => {
    setState('loading')
    const v = videoRef.current
    if (!v) return
    v.load()
    v.play().catch(() => {
      /* autoplay may be blocked */
    })
  }, [nodeId])

  return (
    <div className="arcade-card-static relative overflow-hidden shadow-glow-violet">
      <div className="aspect-video w-full bg-gradient-to-br from-[#1a0e2e] via-[#0f0a1f] to-black">
        {state === 'error' ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(139,92,246,0.15)] text-[#a78bfa]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
              </svg>
            </div>
            <p className="max-w-sm text-sm text-white/70">{fallbackText}</p>
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white/50">
              Video coming soon
            </span>
          </div>
        ) : (
          <>
            {state === 'loading' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-10 w-10 animate-pulse rounded-full bg-[rgba(139,92,246,0.25)]" />
              </div>
            )}
            <video
              ref={videoRef}
              key={nodeId}
              className="h-full w-full object-cover"
              src={src}
              autoPlay
              muted={muted}
              playsInline
              preload="metadata"
              onCanPlay={() => setState('ready')}
              onError={() => setState('error')}
              onLoadedData={() => setState('ready')}
            />
          </>
        )}
      </div>

      {state === 'ready' && (
        <button
          type="button"
          onClick={() => {
            const v = videoRef.current
            if (!v) return
            const next = !muted
            v.muted = next
            setMuted(next)
            if (!next) v.play().catch(() => {})
          }}
          className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-black/80"
          aria-label={muted ? 'Unmute Vesperi' : 'Mute Vesperi'}
        >
          {muted ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
          {muted ? 'Unmute' : 'Mute'}
        </button>
      )}

      <div className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white/80 backdrop-blur">
        <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa]" />
        Vesperi
      </div>
    </div>
  )
}

function GamesByTier({
  games,
  onPlay,
  label,
  tokens,
}: {
  games: VesperiGame[]
  onPlay: (g: VesperiGame) => void
  label: string
  tokens: 2 | 5 | 8
}) {
  if (games.length === 0) return null
  const tier = tierClasses(tokens)
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h3 className="font-sora text-lg font-bold text-white">
          {label}
          <span className="ml-3 text-sm font-medium text-arcade-text-muted">
            · {tokens}t · {games.length} games
          </span>
        </h3>
        <span className={tier.badge}>{tier.label}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {games.map((g) => (
          <GameCard key={g.slug} game={g} onPlay={onPlay} />
        ))}
      </div>
    </div>
  )
}

const CAL_URL = 'https://cal.com/tax-monitor-pro/tttmp-intro'

export default function VesperiPage() {
  const [nodeId, setNodeId] = useState<string>('root')
  const [history, setHistory] = useState<string[]>([])
  const [audience, setAudience] = useState<Audience | null>(null)

  const node: VesperiNode = VESPERI_TREE[nodeId]

  useEffect(() => {
    const url = new URL(window.location.href)
    track('vesperi_page_view', { source: url.searchParams.get('utm_source') || 'direct' })
  }, [])

  useEffect(() => {
    track('vesperi_node_view', {
      node_id: node.id,
      node_type: node.type,
      audience: audience || node.audience || null,
    })
    if (node.audience && node.audience !== audience) {
      setAudience(node.audience)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeId])

  const navigate = (targetId: string, optionLabel?: string) => {
    track('vesperi_option_click', {
      node_id: node.id,
      option_label: optionLabel || null,
      target_node: targetId,
      audience: audience || node.audience || null,
    })
    setHistory((h) => [...h, nodeId])
    setNodeId(targetId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    track('vesperi_back_click', { from_node: nodeId, to_node: prev })
    setHistory((h) => h.slice(0, -1))
    setNodeId(prev)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onPlay = (g: VesperiGame) => {
    track('vesperi_game_click', {
      game_slug: g.slug,
      game_title: g.title,
      tokens: g.tokens,
      audience: audience || node.audience || null,
    })
    window.location.href = `/games/${g.slug}`
  }

  const onCalClick = () => {
    track('vesperi_cal_click', { node_id: node.id, audience: audience || node.audience || null })
    window.open(CAL_URL, '_blank', 'noopener,noreferrer')
  }

  const leafGames = useMemo<VesperiGame[]>(() => {
    if (!node.gameSlugs) return []
    return node.gameSlugs
      .map((s) => getGameBySlug(s))
      .filter((g): g is VesperiGame => Boolean(g))
  }, [node])

  const starter = useMemo(() => GAME_CATALOG.filter((g) => g.tokens === 2), [])
  const intermediate = useMemo(() => GAME_CATALOG.filter((g) => g.tokens === 5), [])
  const advanced = useMemo(() => GAME_CATALOG.filter((g) => g.tokens === 8), [])

  return (
    <>

      <div className="min-h-screen">
        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
          <div className="mb-8 text-center">
            <span className="arcade-eyebrow animate-neon-pulse mb-4 inline-block">★ Your AI Game Guide ★</span>
            <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-white neon-text-violet sm:text-5xl">
              Meet <span className="bg-gradient-neon bg-clip-text text-transparent animate-shimmer" style={{ backgroundSize: '200% auto' }}>Vesperi</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-arcade-text-muted sm:text-lg">
              21 games. 3 token tiers. Let Vesperi help you find the right place to start.
            </p>
          </div>

          <div className="mb-6">
            <VesperiVideo nodeId={node.id} fallbackText={node.videoFallbackText} />
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-neon-cyan sm:text-base"
               style={{ textShadow: '0 0 12px rgba(6, 182, 212, 0.3)' }}>
              {node.contextLine}
            </p>
            <details className="mx-auto mt-3 max-w-2xl">
              <summary className="cursor-pointer text-center text-xs font-bold uppercase tracking-wider text-arcade-text-muted transition-colors hover:text-neon-violet">
                Read transcript
              </summary>
              <p className="arcade-card-static mt-3 p-4 text-sm leading-relaxed text-arcade-text">
                {node.transcript}
              </p>
            </details>
          </div>

          {history.length > 0 && (
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-full border border-arcade-border bg-arcade-surface px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-neon-cyan transition-all hover:border-neon-cyan/60 hover:shadow-glow-cyan hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5" />
                  <path d="M12 19l-7-7 7-7" />
                </svg>
                Go Back
              </button>
            </div>
          )}

          {node.type === 'branch' && node.options && (
            <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              {node.options.map((opt, i) => (
                <button
                  key={opt.targetNodeId}
                  type="button"
                  onClick={() => navigate(opt.targetNodeId, opt.label)}
                  className="arcade-card-interactive group flex items-center justify-between gap-3 px-5 py-4 text-left animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                >
                  <span className="font-sora font-bold text-white group-hover:text-neon-violet transition-colors">{opt.label}</span>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    className="flex-shrink-0 text-neon-cyan transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {node.type === 'leaf' && (
            <>
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {leafGames.map((g) => (
                  <GameCard key={g.slug} game={g} onPlay={onPlay} />
                ))}
              </div>

              <div className="mx-auto max-w-2xl">
                {node.topic && audience && (
                  <IntakeForm
                    audience={audience}
                    topic={node.topic}
                    sourceNode={node.id}
                  />
                )}

                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <button type="button" onClick={onCalClick} className="arcade-btn arcade-btn-cyan">
                    Talk to Us
                  </button>
                  <Link href="/pricing" className="arcade-btn arcade-btn-primary">
                    Get Tokens
                  </Link>
                </div>
              </div>
            </>
          )}

          {node.type === 'all-games' && (
            <>
              <GamesByTier label="Starter Games" tokens={2} games={starter} onPlay={onPlay} />
              <GamesByTier
                label="Intermediate Games"
                tokens={5}
                games={intermediate}
                onPlay={onPlay}
              />
              <GamesByTier label="Advanced Games" tokens={8} games={advanced} onPlay={onPlay} />

              {audience && (
                <div className="mx-auto mt-6 max-w-2xl">
                  <IntakeForm audience={audience} topic="all-games" sourceNode={node.id} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
