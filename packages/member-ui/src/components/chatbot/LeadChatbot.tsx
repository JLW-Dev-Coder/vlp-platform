'use client'

import { useEffect, useRef, useState } from 'react'
import type { PlatformConfig, ChatbotQuestion, ChatbotCtaAction } from '../../types/config'
import { capture } from '../../analytics'

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void
      ns: Record<string, (action: string, ...args: unknown[]) => void>
      loaded?: boolean
    }
  }
}

type View = 'nudge' | 'bubble' | 'home' | 'question' | 'human'

interface BotBubble {
  id: string
  text: string
  from: 'bot' | 'user'
}

const NUDGE_KEY_SUFFIX = '_chatbot_nudge_dismissed_v1'

function readAnalyticsConsent(brandAbbrev: string): boolean {
  try {
    const raw = localStorage.getItem(`${brandAbbrev.toLowerCase()}_cookie_prefs_v1`)
    if (!raw) return false
    const prefs = JSON.parse(raw) as { analytics?: boolean }
    return Boolean(prefs?.analytics)
  } catch {
    return false
  }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function calBindingFor(
  config: PlatformConfig,
  target: 'intro' | 'discovery' | 'booking',
): { slug: string; namespace: string } {
  if (target === 'booking') {
    return { slug: config.calBookingSlug, namespace: config.calBookingNamespace }
  }
  if (target === 'discovery') {
    if (!config.calDiscoverySlug || !config.calDiscoveryNamespace) {
      console.warn('[LeadChatbot] calDiscovery* not set, falling back to intro')
      return { slug: config.calIntroSlug, namespace: config.calIntroNamespace }
    }
    return { slug: config.calDiscoverySlug, namespace: config.calDiscoveryNamespace }
  }
  return { slug: config.calIntroSlug, namespace: config.calIntroNamespace }
}

function ensureCalLoaded(namespace: string, brandColor: string) {
  if (typeof window === 'undefined') return
  const init = () => {
    const Cal = window.Cal
    if (!Cal) return
    Cal('init', namespace, { origin: 'https://app.cal.com' })
    Cal.ns[namespace]('ui', {
      cssVarsPerTheme: {
        light: { 'cal-brand': '#292929' },
        dark: { 'cal-brand': brandColor },
      },
      hideEventTypeDetails: false,
      layout: 'month_view',
    })
  }
  if (window.Cal) {
    init()
    return
  }
  const existing = document.querySelector('script[data-cal-embed="true"]') as HTMLScriptElement | null
  if (existing) {
    existing.addEventListener('load', init, { once: true })
    return
  }
  const script = document.createElement('script')
  script.src = 'https://app.cal.com/embed/embed.js'
  script.async = true
  script.dataset.calEmbed = 'true'
  script.onload = init
  document.head.appendChild(script)
}

export interface LeadChatbotProps {
  config: PlatformConfig
}

export function LeadChatbot({ config }: LeadChatbotProps) {
  const cb = config.chatbot
  if (!cb?.enabled) return null

  const brandColor = config.brandColor
  const nudgeKey = `${config.brandAbbrev.toLowerCase()}${NUDGE_KEY_SUFFIX}`

  const [view, setView] = useState<View>('bubble')
  const [activeQuestion, setActiveQuestion] = useState<ChatbotQuestion | null>(null)
  const [bubbles, setBubbles] = useState<BotBubble[]>([])
  const [typing, setTyping] = useState(false)
  const [emailFooter, setEmailFooter] = useState('')
  const [emailFooterSent, setEmailFooterSent] = useState(false)
  const [messageEmail, setMessageEmail] = useState('')
  const [messageBody, setMessageBody] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const transcriptRef = useRef<HTMLDivElement | null>(null)
  const initRef = useRef(false)

  // Initialize view from localStorage (nudge state)
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    try {
      const dismissed = localStorage.getItem(nudgeKey)
      setView(dismissed ? 'bubble' : 'nudge')
    } catch {
      setView('nudge')
    }
  }, [nudgeKey])

  // Pre-warm Cal namespaces used by this config
  useEffect(() => {
    if (view !== 'human') return
    const target = cb.humanPath.bookCall.calTarget
    const { namespace } = calBindingFor(config, target)
    ensureCalLoaded(namespace, brandColor)
  }, [view, cb.humanPath.bookCall.calTarget, config, brandColor])

  // Escape minimizes
  useEffect(() => {
    if (view !== 'home' && view !== 'question' && view !== 'human') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setView('bubble')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [view])

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [bubbles, typing])

  function dismissNudge() {
    try { localStorage.setItem(nudgeKey, '1') } catch { /* ignore */ }
    setView('bubble')
  }

  function openHome() {
    try { localStorage.setItem(nudgeKey, '1') } catch { /* ignore */ }
    setView('home')
  }

  async function postLead(payload: Record<string, unknown>) {
    try {
      const consent = readAnalyticsConsent(config.brandAbbrev)
      const enriched: Record<string, unknown> = {
        platform: config.brandAbbrev.toLowerCase(),
        ...payload,
      }
      if (consent) {
        enriched.referrer = document.referrer || undefined
        enriched.user_agent = navigator.userAgent || undefined
      }
      await fetch(`${config.apiBaseUrl}/v1/leads/chatbot`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(enriched),
        keepalive: true,
      })
      capture({
        name: 'chatbot_lead',
        props: {
          app: config.brandAbbrev.toLowerCase(),
          intent: typeof payload.intent === 'string' ? payload.intent : undefined,
        },
      })
    } catch {
      // Fire-and-forget; do not block UX
    }
  }

  async function runConversation(q: ChatbotQuestion) {
    setActiveQuestion(q)
    setView('question')
    setBubbles([{ id: `u-${q.id}`, text: q.label, from: 'user' }])
    setTyping(false)

    const reduced = prefersReducedMotion()
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

    const allBot = [...q.response, ...(q.askBack ? [q.askBack] : [])]
    for (let i = 0; i < allBot.length; i++) {
      const text = allBot[i]
      const typeFor = reduced ? 300 : Math.min(1800, Math.max(500, 400 + text.length * 25))
      setTyping(true)
      await wait(typeFor)
      setTyping(false)
      setBubbles((prev) => [...prev, { id: `b-${q.id}-${i}`, text, from: 'bot' }])
      if (i < allBot.length - 1) await wait(reduced ? 100 : 250)
    }

    await postLead({
      question_id: q.id,
      question_label: q.label,
      source: 'chatbot',
    })
  }

  function handleCta(action: ChatbotCtaAction) {
    if (action.type === 'link') {
      if (action.external) {
        window.open(action.href, '_blank', 'noopener,noreferrer')
      } else {
        window.location.href = action.href
      }
      return
    }
    if (action.type === 'human-path') {
      setView('human')
      return
    }
    // cal-* actions: programmatic open via data attributes on a hidden anchor
    const target = action.type === 'cal-intro'
      ? 'intro'
      : action.type === 'cal-discovery'
        ? 'discovery'
        : 'booking'
    const { slug, namespace } = calBindingFor(config, target)
    ensureCalLoaded(namespace, brandColor)
    void postLead({ source: 'chatbot_book_call', cal_booked: true, question_id: activeQuestion?.id })
    const a = document.createElement('a')
    a.setAttribute('data-cal-link', slug)
    a.setAttribute('data-cal-namespace', namespace)
    a.setAttribute('data-cal-config', '{"layout":"month_view"}')
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    setTimeout(() => a.remove(), 100)
  }

  function submitEmailFooter(e: React.FormEvent) {
    e.preventDefault()
    if (!emailFooter) return
    void postLead({
      email: emailFooter,
      source: 'chatbot_email_footer',
      question_id: activeQuestion?.id,
    })
    setEmailFooterSent(true)
  }

  function submitMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!messageBody.trim()) return
    void postLead({
      email: messageEmail || undefined,
      message: messageBody.trim(),
      source: 'chatbot_message',
    })
    setMessageSent(true)
  }

  // ----------- collapsed states -----------

  if (view === 'nudge') {
    return (
      <div className="fixed bottom-4 right-4 z-overlay md:bottom-6 md:right-6">
        <div className="flex items-center gap-2 rounded-md border border-subtle bg-surface-popover p-2 pr-3 shadow-md">
          <button
            type="button"
            onClick={openHome}
            aria-label={`Open chat: ${cb.nudge.label}`}
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
          >
            <span
              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ backgroundColor: brandColor }}
            >
              {cb.header.avatarInitials}
            </span>
            <span className="min-w-0">
              <span className="block text-xs font-bold text-text-primary">{cb.nudge.label}</span>
              <span className="block text-[11px] text-text-muted">{cb.nudge.message}</span>
            </span>
          </button>
          <button
            type="button"
            onClick={dismissNudge}
            aria-label="Dismiss"
            className="rounded-md p-1 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  if (view === 'bubble') {
    return (
      <div className="fixed bottom-4 right-4 z-overlay md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={openHome}
          aria-label="Open chat"
          className="flex h-12 w-12 items-center justify-center rounded-full text-white shadow-md transition-transform motion-safe:hover:scale-105 focus-visible:outline-none focus-visible:shadow-focus"
          style={{ backgroundColor: brandColor }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
    )
  }

  // ----------- expanded panel -----------

  const panelHeader = (
    <div className="flex items-center gap-3 rounded-t-lg border-b border-subtle bg-surface-popover p-3">
      <span
        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: brandColor }}
      >
        {cb.header.avatarInitials}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-text-primary">{cb.header.title}</p>
        <p className="truncate text-[11px] text-text-muted">{cb.header.subtitle}</p>
      </div>
      <div className="flex items-center gap-1">
        {(view === 'question' || view === 'human') && (
          <button
            type="button"
            onClick={() => { setView('home'); setBubbles([]); setActiveQuestion(null); setMessageSent(false) }}
            aria-label="Back to chat menu"
            className="rounded-md p-1 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <button
          type="button"
          onClick={() => setView('bubble')}
          aria-label="Minimize chat"
          className="rounded-md p-1 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  )

  return (
    <div
      role="dialog"
      aria-label={cb.header.title}
      className="fixed bottom-4 right-4 z-overlay flex w-[calc(100vw-2rem)] max-w-sm flex-col rounded-lg border border-subtle bg-surface-popover shadow-md md:bottom-6 md:right-6"
    >
      {panelHeader}

      {view === 'home' && (
        <div className="flex flex-col gap-3 p-3">
          <p className="text-sm leading-relaxed text-text-primary">{cb.welcome}</p>
          <div className="flex flex-col gap-2">
            {cb.questions.map((q) => (
              <button
                key={q.id}
                type="button"
                onClick={() => runConversation(q)}
                className="rounded-md border border-subtle bg-surface-card px-3 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
              >
                {q.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setView('human')}
              className="rounded-md border border-subtle bg-surface-card px-3 py-2 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
            >
              Talk to a human →
            </button>
          </div>
          {/* Phase 2: wire to /v1/leads/chatbot/ai endpoint — see canonical-rc-prompt Prompt 1.5 */}
          {cb.aiEnabled ? <FreeTextInput /> : null}
          {cb.socialProof && (
            <p className="border-t border-subtle pt-2 text-[11px] text-text-tertiary">
              {cb.socialProof.href ? (
                <a href={cb.socialProof.href} target="_blank" rel="noreferrer" className="hover:text-text-primary">
                  {cb.socialProof.text}
                </a>
              ) : (
                cb.socialProof.text
              )}
            </p>
          )}
        </div>
      )}

      {view === 'question' && activeQuestion && (
        <div className="flex flex-col">
          <div ref={transcriptRef} className="flex max-h-80 flex-col gap-2 overflow-y-auto p-3">
            {bubbles.map((b) => (
              <div
                key={b.id}
                className={`max-w-[85%] rounded-md px-3 py-2 text-sm leading-relaxed ${
                  b.from === 'user'
                    ? 'self-end text-white'
                    : 'self-start border border-subtle bg-surface-card text-text-primary'
                }`}
                style={b.from === 'user' ? { backgroundColor: brandColor } : undefined}
              >
                {b.text}
              </div>
            ))}
            {typing && (
              <div className="self-start rounded-md border border-subtle bg-surface-card px-3 py-2" aria-live="polite" aria-label="Assistant is typing">
                <span className="inline-flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary motion-safe:animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary motion-safe:animate-pulse [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-text-tertiary motion-safe:animate-pulse [animation-delay:300ms]" />
                </span>
              </div>
            )}
          </div>

          {!typing && bubbles.length > 1 && (
            <div className="flex flex-col gap-2 border-t border-subtle p-3">
              <button
                type="button"
                onClick={() => handleCta(activeQuestion.primaryCta.action)}
                className="rounded-md px-3 py-2 text-sm font-bold text-white transition-opacity motion-safe:hover:opacity-90 focus-visible:outline-none focus-visible:shadow-focus"
                style={{ backgroundColor: brandColor }}
              >
                {activeQuestion.primaryCta.label}
              </button>
              {activeQuestion.secondaryCta && (
                <button
                  type="button"
                  onClick={() => handleCta(activeQuestion.secondaryCta!.action)}
                  className="rounded-md border border-subtle bg-surface-card px-3 py-2 text-sm font-semibold text-text-primary transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
                >
                  {activeQuestion.secondaryCta.label}
                </button>
              )}

              {emailFooterSent ? (
                <p className="text-[11px] text-text-muted">Thanks — we'll be in touch.</p>
              ) : (
                <form onSubmit={submitEmailFooter} className="flex flex-col gap-2 border-t border-subtle pt-2">
                  <label htmlFor="chatbot-email-footer" className="text-[11px] font-semibold text-text-muted">
                    {cb.emailFooterLabel}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="chatbot-email-footer"
                      type="email"
                      required
                      value={emailFooter}
                      onChange={(e) => setEmailFooter(e.target.value)}
                      placeholder="you@firm.com"
                      className="min-w-0 flex-1 rounded-md border border-subtle bg-surface-card px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
                    />
                    <button
                      type="submit"
                      className="rounded-md border border-subtle bg-surface-card px-3 py-1.5 text-xs font-bold text-text-primary hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'human' && (
        <div className="flex flex-col gap-3 p-3">
          <p className="text-sm leading-relaxed text-text-primary">{cb.humanPath.intro}</p>

          <button
            type="button"
            onClick={() => {
              const t = cb.humanPath.bookCall.calTarget
              const action: ChatbotCtaAction =
                t === 'discovery' ? { type: 'cal-discovery' } :
                t === 'booking' ? { type: 'cal-booking' } :
                { type: 'cal-intro' }
              handleCta(action)
            }}
            className="rounded-md border border-subtle bg-surface-card p-3 text-left transition-colors hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus"
          >
            <p className="text-sm font-bold text-text-primary">{cb.humanPath.bookCall.label}</p>
            <p className="mt-1 text-xs text-text-muted">{cb.humanPath.bookCall.description}</p>
          </button>

          <div className="rounded-md border border-subtle bg-surface-card p-3">
            <p className="text-sm font-bold text-text-primary">{cb.humanPath.sendMessage.label}</p>
            <p className="mt-1 text-xs text-text-muted">{cb.humanPath.sendMessage.description}</p>
            {messageSent ? (
              <p className="mt-2 text-xs text-text-primary">Got it — we'll reply within one business day.</p>
            ) : (
              <form onSubmit={submitMessage} className="mt-2 flex flex-col gap-2">
                <input
                  type="email"
                  required
                  value={messageEmail}
                  onChange={(e) => setMessageEmail(e.target.value)}
                  placeholder="Email"
                  className="rounded-md border border-subtle bg-surface-popover px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
                />
                <textarea
                  required
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  placeholder="What's going on?"
                  rows={3}
                  maxLength={4000}
                  className="rounded-md border border-subtle bg-surface-popover px-2 py-1.5 text-xs text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
                />
                <button
                  type="submit"
                  className="rounded-md px-3 py-2 text-xs font-bold text-white transition-opacity motion-safe:hover:opacity-90 focus-visible:outline-none focus-visible:shadow-focus"
                  style={{ backgroundColor: brandColor }}
                >
                  Send message
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Phase 2 placeholder — renders nothing until aiEnabled is true and wired up.
function FreeTextInput() {
  return null
}
