'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import { KENNEDY_TREE, type KennedyNode } from '@/lib/kennedy-tree'
import { tcvlpConfig } from '@/lib/platform-config'
import { track } from '@/lib/posthog'

const CAL_LINK = tcvlpConfig.calIntroSlug
const CAL_NAMESPACE = tcvlpConfig.calIntroNamespace
const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'

function useCountdown(targetDate: string) {
  const [remaining, setRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const now = Date.now()
      const diff = Math.max(0, target - now)
      setRemaining({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])
  return remaining
}

export default function KennedyPage() {
  const [currentId, setCurrentId] = useState<string>('entry')
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)
  const [clipEnded, setClipEnded] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const preloadRefs = useRef<Record<string, HTMLLinkElement>>({})
  const countdown = useCountdown('2026-07-15T00:00:00')

  const node: KennedyNode | undefined = KENNEDY_TREE[currentId]
  const hasVideo = Boolean(node?.clipUrl)

  const navigate = useCallback((nextId: string) => {
    setHistory((h) => [...h, currentId])
    setCurrentId(nextId)
    setClipEnded(false)
    track('kennedy_navigate', { from: currentId, to: nextId })
  }, [currentId])

  const goBack = useCallback(() => {
    if (!history.length) return
    const prev = history[history.length - 1]
    setHistory((h) => h.slice(0, -1))
    setCurrentId(prev)
    setClipEnded(false)
    track('kennedy_back', { from: currentId, to: prev })
  }, [history, currentId])

  const reset = useCallback(() => {
    setHistory([])
    setCurrentId('entry')
    setClipEnded(false)
    track('kennedy_reset')
  }, [])

  // Load + play the current clip when the node changes (only after user has started)
  useEffect(() => {
    if (!started) return
    const v = videoRef.current
    if (!v || !node) return
    if (!hasVideo) {
      setClipEnded(true)
      return
    }
    v.src = node.clipUrl
    v.muted = muted
    v.play().catch(() => {})
  }, [started, currentId, node, hasVideo, muted])

  // Auto-advance
  useEffect(() => {
    if (!node) return
    if (clipEnded && node.autoNext) {
      const t = setTimeout(() => navigate(node.autoNext as string), 250)
      return () => clearTimeout(t)
    }
  }, [clipEnded, node, navigate])

  // Preload next-step clips for instant transitions
  useEffect(() => {
    if (!node) return
    const nextIds = new Set<string>()
    if (node.autoNext) nextIds.add(node.autoNext)
    node.options?.forEach((o) => nextIds.add(o.next))

    nextIds.forEach((id) => {
      const n = KENNEDY_TREE[id]
      if (!n?.clipUrl || preloadRefs.current[id]) return
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'video'
      link.href = n.clipUrl
      document.head.appendChild(link)
      preloadRefs.current[id] = link
    })
  }, [node])

  useEffect(() => {
    return () => {
      Object.values(preloadRefs.current).forEach((l) => l.remove())
      preloadRefs.current = {}
    }
  }, [])

  const showOptions = !hasVideo || clipEnded
  const showCta = showOptions && node?.cta && node.cta.length > 0
  const showChoices = showOptions && node?.options && node.options.length > 0

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* URGENCY BAR */}
      <div
        className="bg-yellow-500 text-black py-2 text-center text-sm font-bold tracking-wide"
        style={{ fontFamily: "'Space Mono', monospace" }}
      >
        <span className="opacity-70">KWONG CLAIM DEADLINE</span>
        <span className="mx-3">·</span>
        <span>
          {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s remaining
        </span>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-500/10 blur-[120px] rounded-full" />

        <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-semibold tracking-wider uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            Talk to Kennedy
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
            File Every Kwong-Eligible Claim
            <br />
            <span className="text-yellow-500">Before July.</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            TaxClaim Pro automates Form 843 for CPAs, EAs, and tax attorneys. Talk to Kennedy to see how it fits your practice.
          </p>

          {!started && (
            <button
              type="button"
              onClick={() => {
                setStarted(true)
                track('kennedy_started')
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Talk to Kennedy
            </button>
          )}
        </div>
      </div>

      {/* VIDEO + INTERACTION PANEL */}
      {started && node && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl shadow-yellow-500/5 mb-6">
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover bg-black"
              playsInline
              controls={false}
              onEnded={() => {
                setClipEnded(true)
                track('kennedy_clip_ended', { node: currentId })
              }}
              style={{ display: hasVideo ? 'block' : 'none' }}
            />

            {!hasVideo && (
              <div className="w-full aspect-video bg-gradient-to-br from-zinc-900 via-black to-zinc-900 flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs font-semibold tracking-wider uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                    Kennedy
                  </div>
                </div>
              </div>
            )}

            {/* Mute toggle */}
            {hasVideo && (
              <button
                type="button"
                onClick={() => {
                  setMuted((m) => !m)
                  const v = videoRef.current
                  if (v) v.muted = !v.muted
                }}
                className="absolute bottom-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                  </svg>
                )}
                {muted ? 'Unmute' : 'Mute'}
              </button>
            )}

            {history.length > 0 && (
              <button
                type="button"
                onClick={goBack}
                className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-xs text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            )}

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-zinc-300 font-medium">
              Kennedy
            </div>
          </div>

          {/* Question overlay / prompt */}
          {showOptions && node.question && (
            <div className="mb-6 p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-yellow-500">K</span>
                </div>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                  Kennedy
                </span>
              </div>
              <p className="text-zinc-100 text-base leading-relaxed font-medium">{node.question}</p>
            </div>
          )}

          {/* Option buttons */}
          {showChoices && (
            <div className="space-y-3 max-w-lg mx-auto">
              {node.options!.map((opt, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate(opt.next)}
                  className="w-full text-left px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 hover:bg-zinc-900/80 transition-all group flex items-center justify-between"
                >
                  <span className="text-zinc-200 group-hover:text-white font-medium text-sm">
                    {opt.label}
                  </span>
                  <svg
                    className="w-4 h-4 text-zinc-600 group-hover:text-yellow-500 transition-colors flex-shrink-0 ml-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* CTA buttons (terminal nodes) */}
          {showCta && (
            <div className="space-y-3 max-w-lg mx-auto mt-2">
              {node.cta!.map((cta, i) => {
                if (cta.href === '#cal-booking') {
                  return (
                    <button
                      key={i}
                      type="button"
                      data-cal-namespace={CAL_NAMESPACE}
                      data-cal-link={CAL_LINK}
                      data-cal-config={CAL_CONFIG}
                      onClick={() => track('kennedy_cta_click', { node: currentId, cta: 'cal-booking' })}
                      className={
                        cta.variant === 'primary'
                          ? 'w-full text-center px-5 py-4 rounded-xl font-semibold transition-all bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                          : 'w-full text-center px-5 py-4 rounded-xl font-semibold transition-all border border-yellow-500/60 text-yellow-500 hover:bg-yellow-500/10'
                      }
                    >
                      {cta.label}
                    </button>
                  )
                }
                return (
                  <Link
                    key={i}
                    href={cta.href}
                    onClick={() => track('kennedy_cta_click', { node: currentId, cta: cta.href })}
                    className={
                      cta.variant === 'primary'
                        ? 'w-full block text-center px-5 py-4 rounded-xl font-semibold transition-all bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                        : 'w-full block text-center px-5 py-4 rounded-xl font-semibold transition-all border border-yellow-500/60 text-yellow-500 hover:bg-yellow-500/10'
                    }
                  >
                    {cta.label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* Start over */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={reset}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* TRUST STRIP */}
      <div className="border-t border-zinc-900 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '~3 min', label: 'Average conversation' },
            { stat: 'July 2026', label: 'Filing deadline' },
            { stat: '$10/mo', label: 'Starter tier' },
          ].map((item, i) => (
            <div key={i}>
              <p
                className="text-2xl font-bold text-yellow-500"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {item.stat}
              </p>
              <p className="text-sm text-zinc-500 mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER DISCLAIMER */}
      <div className="border-t border-zinc-900 py-8 text-center">
        <p className="text-xs text-zinc-600 max-w-2xl mx-auto px-6">
          TaxClaim Pro is a tool for generating IRS Form 843 penalty abatement claims. It does not
          provide legal or tax advice. Consult a qualified tax professional for guidance specific
          to your situation. Results are not guaranteed. The Kwong v. United States ruling applies
          to specific penalty types and time periods.
        </p>
      </div>

      {/* Cal.com init script — element-click popup pattern */}
      <Script id="cal-init-tcvlp-intro-kennedy" strategy="afterInteractive">{`
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", ${JSON.stringify(CAL_NAMESPACE)}, {origin:"https://app.cal.com"});
Cal.ns[${JSON.stringify(CAL_NAMESPACE)}]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":${JSON.stringify(tcvlpConfig.brandColor)}}},"hideEventTypeDetails":false,"layout":"month_view"});
`}</Script>
    </div>
  )
}
