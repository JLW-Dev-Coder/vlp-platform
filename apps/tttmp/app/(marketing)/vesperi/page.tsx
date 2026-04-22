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

function tierClasses(tokens: 2 | 5 | 8): { badge: string; ring: string; label: string } {
  if (tokens === 2)
    return {
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      ring: 'hover:border-emerald-500/40',
      label: 'Starter',
    }
  if (tokens === 5)
    return {
      badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      ring: 'hover:border-sky-500/40',
      label: 'Intermediate',
    }
  return {
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    ring: 'hover:border-amber-500/40',
    label: 'Advanced',
  }
}

function GameCard({ game, onPlay }: { game: VesperiGame; onPlay: (g: VesperiGame) => void }) {
  const tier = tierClasses(game.tokens)
  return (
    <article
      className={`group relative flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all backdrop-blur ${tier.ring} hover:-translate-y-0.5 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-[var(--brand-glow,rgba(139,92,246,0.30))]`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/60">
          {game.type}
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tier.badge}`}
          title={`${tier.label} tier`}
        >
          {game.tokens} tokens
        </span>
      </div>
      <h3 className="mb-1.5 text-base font-bold leading-tight text-white">{game.title}</h3>
      <p className="mb-5 flex-1 text-sm leading-relaxed text-white/65">{game.description}</p>
      <button
        type="button"
        onClick={() => onPlay(game)}
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[rgba(139,92,246,0.25)] transition-all hover:from-[#9469f7] hover:to-[#8b5cf6] hover:shadow-[rgba(139,92,246,0.40)] active:translate-y-px"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M8 5v14l11-7z" />
        </svg>
        Play
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
      const res = await fetch('https://api.virtuallaunch.pro/v1/tttmp/vesperi/intake', {
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
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-300">
          Thanks! We’ll send game tips and new releases to {email.trim()}.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
          Optional
        </span>
      </div>
      <h4 className="mb-1 text-base font-bold text-white">Stay in the loop</h4>
      <p className="mb-4 text-sm text-white/60">
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
          className="flex-1 rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[#8b5cf6] focus:ring-2 focus:ring-[rgba(139,92,246,0.25)]"
        />
        <button
          type="submit"
          disabled={!emailValid || status === 'submitting'}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[rgba(139,92,246,0.25)] transition-all hover:from-[#9469f7] hover:to-[#8b5cf6] disabled:cursor-not-allowed disabled:opacity-50"
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
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl shadow-black/40">
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
      <div className="mb-4 flex items-baseline justify-between">
        <h3 className="text-lg font-bold text-white">
          {label}
          <span className="ml-2 text-sm font-medium text-white/50">
            · {tokens} tokens · {games.length} games
          </span>
        </h3>
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${tier.badge}`}
        >
          {tier.label}
        </span>
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

      <main className="min-h-screen bg-[#0a0714] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-[rgba(139,92,246,0.12)] via-[rgba(139,92,246,0.04)] to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.3)] bg-[rgba(139,92,246,0.1)] px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#c4b5fd]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a78bfa]" />
              Your AI Game Guide
            </div>
            <h1 className="font-sora text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Meet <span className="bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] bg-clip-text text-transparent">Vesperi</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-base text-white/60 sm:text-lg">
              21 games. 3 token tiers. Let Vesperi help you find the right place to start.
            </p>
          </div>

          <div className="mb-6">
            <VesperiVideo nodeId={node.id} fallbackText={node.videoFallbackText} />
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-white/65 sm:text-base">
              {node.contextLine}
            </p>
            <details className="mx-auto mt-3 max-w-2xl">
              <summary className="cursor-pointer text-center text-xs font-semibold uppercase tracking-wider text-white/40 transition-colors hover:text-white/60">
                Read transcript
              </summary>
              <p className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-white/75">
                {node.transcript}
              </p>
            </details>
          </div>

          {history.length > 0 && (
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
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
              {node.options.map((opt) => (
                <button
                  key={opt.targetNodeId}
                  type="button"
                  onClick={() => navigate(opt.targetNodeId, opt.label)}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition-all hover:-translate-y-0.5 hover:border-[rgba(139,92,246,0.40)] hover:bg-[rgba(139,92,246,0.06)] hover:shadow-lg hover:shadow-[rgba(139,92,246,0.20)]"
                >
                  <span className="font-semibold text-white">{opt.label}</span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="flex-shrink-0 text-white/40 transition-colors group-hover:text-[#a78bfa]"
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
                  <button
                    type="button"
                    onClick={onCalClick}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white/80 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Talk to Us
                  </button>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-[rgba(139,92,246,0.25)] transition-all hover:from-[#9469f7] hover:to-[#8b5cf6]"
                  >
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
      </main>
    </>
  )
}
