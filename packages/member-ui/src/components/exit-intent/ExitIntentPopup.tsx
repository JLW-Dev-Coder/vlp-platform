'use client'

import { useEffect, useId, useRef, useState } from 'react'
import type { PlatformConfig } from '../../types/config'

const SHOWN_KEY_SUFFIX = '_exit_shown'
const SHOWN_TTL_DAYS = 7
const MOBILE_INACTIVITY_MS = 45_000
const TRIGGER_DELAY_MS = 500

function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches
}

function shouldSuppress(brandAbbrev: string): boolean {
  if (typeof window === 'undefined') return true
  try {
    const raw = localStorage.getItem(`${brandAbbrev.toLowerCase()}${SHOWN_KEY_SUFFIX}`)
    if (!raw) return false
    const ts = Number(raw)
    if (!Number.isFinite(ts)) return false
    return Date.now() - ts < SHOWN_TTL_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function markShown(brandAbbrev: string) {
  try {
    localStorage.setItem(`${brandAbbrev.toLowerCase()}${SHOWN_KEY_SUFFIX}`, String(Date.now()))
  } catch { /* ignore */ }
}

export interface ExitIntentPopupProps {
  config: PlatformConfig
}

export function ExitIntentPopup({ config }: ExitIntentPopupProps) {
  const ei = config.exitIntent
  const brandColor = config.brandColor
  const headingId = useId()

  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState<null | 'success' | 'already'>(null)
  const [error, setError] = useState<string | null>(null)

  const triggerTimer = useRef<number | null>(null)
  const autoCloseTimer = useRef<number | null>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const armedRef = useRef(false)

  // Hook ordering: useEffect for trigger wiring runs unconditionally, but bails
  // out internally if there's no enabled config. The early return for "not
  // enabled" lives after all hooks to keep hook order stable.
  useEffect(() => {
    if (!ei?.enabled) return
    if (typeof window === 'undefined') return
    if (shouldSuppress(config.brandAbbrev)) return
    armedRef.current = true

    const fire = () => {
      if (!armedRef.current) return
      armedRef.current = false
      if (triggerTimer.current) window.clearTimeout(triggerTimer.current)
      triggerTimer.current = window.setTimeout(() => {
        setOpen(true)
        markShown(config.brandAbbrev)
      }, TRIGGER_DELAY_MS)
    }

    let inactivityTimer: number | null = null
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY < 0 && !e.relatedTarget) fire()
    }
    const resetInactivity = () => {
      if (inactivityTimer) window.clearTimeout(inactivityTimer)
      inactivityTimer = window.setTimeout(fire, MOBILE_INACTIVITY_MS)
    }

    if (isMobile()) {
      resetInactivity()
      window.addEventListener('touchstart', resetInactivity, { passive: true })
      window.addEventListener('scroll', resetInactivity, { passive: true })
    } else {
      document.addEventListener('mouseout', onMouseOut)
    }

    return () => {
      armedRef.current = false
      if (triggerTimer.current) window.clearTimeout(triggerTimer.current)
      if (inactivityTimer) window.clearTimeout(inactivityTimer)
      document.removeEventListener('mouseout', onMouseOut)
      window.removeEventListener('touchstart', resetInactivity)
      window.removeEventListener('scroll', resetInactivity)
    }
  }, [ei?.enabled, ei?.freebieType, config.brandAbbrev])

  // Escape closes; focus management
  useEffect(() => {
    if (!open) return
    previousFocus.current = (document.activeElement as HTMLElement) || null

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'input, button, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)

    // Focus first input
    const t = window.setTimeout(() => {
      const firstInput = panelRef.current?.querySelector<HTMLElement>('input, button')
      firstInput?.focus()
    }, 50)

    return () => {
      document.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function close() {
    if (autoCloseTimer.current) window.clearTimeout(autoCloseTimer.current)
    setOpen(false)
    setTimeout(() => previousFocus.current?.focus?.(), 0)
  }

  if (!ei?.enabled) return null

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !selected || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${config.apiBaseUrl}/v1/leads/freebie`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          platform: config.brandAbbrev.toLowerCase(),
          qualifier_question: ei!.qualifierQuestion,
          qualifier_answer: selected,
          freebie_type: ei!.freebieType,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.ok === false) {
        setError(data?.message || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      setDone(data?.already_subscribed ? 'already' : 'success')
      autoCloseTimer.current = window.setTimeout(close, 3000)
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center bg-surface-overlay backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) close() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        className="relative w-full max-w-md overflow-hidden rounded-xl border border-subtle bg-surface-popover shadow-lg motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95"
        style={{ borderTopWidth: '4px', borderTopColor: brandColor }}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-md p-1 text-text-tertiary hover:bg-surface-elevated hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="p-6">
          {done ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: brandColor }}
                aria-hidden="true"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <p className="text-base font-semibold text-text-primary">
                {done === 'already'
                  ? "You're already signed up! Check your inbox."
                  : ei.successMessage}
              </p>
            </div>
          ) : (
            <>
              <h2 id={headingId} className="text-xl font-bold text-text-primary">
                {ei.headline}
              </h2>
              <p className="mt-2 text-lg font-semibold" style={{ color: brandColor }}>
                {ei.subheadline}
              </p>
              <p className="mt-2 text-sm text-text-muted">{ei.description}</p>

              <form onSubmit={submit} className="mt-5 flex flex-col gap-4">
                <fieldset className="flex flex-col gap-2">
                  <legend className="mb-1 text-sm font-semibold text-text-primary">
                    {ei.qualifierQuestion}
                  </legend>
                  {ei.qualifierOptions.map((opt) => {
                    const checked = selected === opt
                    return (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary transition-colors hover:bg-surface-elevated"
                        style={checked ? { borderColor: brandColor } : undefined}
                      >
                        <input
                          type="radio"
                          name="exit-qualifier"
                          value={opt}
                          checked={checked}
                          onChange={() => setSelected(opt)}
                          required
                          className="h-4 w-4 cursor-pointer"
                          style={{ accentColor: brandColor }}
                        />
                        <span>{opt}</span>
                      </label>
                    )
                  })}
                </fieldset>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="rounded-md border border-subtle bg-surface-popover px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:shadow-focus"
                />

                {error && (
                  <p className="text-xs text-red-500" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email || !selected}
                  className="rounded-md px-4 py-2.5 text-sm font-bold text-white transition-opacity motion-safe:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:shadow-focus"
                  style={{ backgroundColor: brandColor }}
                >
                  {submitting ? 'Sending…' : ei.ctaLabel}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
