'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { tppConfig } from '@/lib/platform-config'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PDF_PATH = '/resources/8-phase-client-journey-blueprint.pdf'

type ErrorCode = 'validation' | 'quota' | 'rate_limited' | 'duplicate' | 'server'

export default function BlueprintClient() {
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (submitting) return false
    if (!EMAIL_RE.test(email.trim())) return false
    return true
  }, [email, submitting])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setErrorCode(null)
    setErrorMsg('')

    // Honeypot — silently "succeed" to avoid tipping off bots.
    if (website.trim().length > 0) {
      setSubmittedEmail(email.trim())
      return
    }

    setSubmitting(true)
    const eventId = crypto.randomUUID()
    const payload = {
      email: email.trim(),
      platform: 'tpp',
      freebie_type: 'client_journey_blueprint',
      event_id: eventId,
    }

    try {
      const res = await fetch(`${tppConfig.apiBaseUrl}/v1/leads/freebie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(payload),
      })
      let data: { ok?: boolean; error?: ErrorCode; message?: string; already_subscribed?: boolean } = {}
      try {
        data = (await res.json()) as typeof data
      } catch {
        // fall through
      }

      if (data.ok) {
        setSubmittedEmail(payload.email)
        return
      }
      const code: ErrorCode =
        data.error === 'validation' ||
        data.error === 'quota' ||
        data.error === 'rate_limited' ||
        data.error === 'duplicate'
          ? data.error
          : 'server'
      setErrorCode(code)
      setErrorMsg(typeof data.message === 'string' ? data.message : '')
    } catch {
      setErrorCode('server')
      setErrorMsg('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-[1280px] px-6 py-20 md:px-8 md:py-24">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-crimson)]">
          Free Download
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--color-text-1)] md:text-5xl">
          The 8-Phase Tax Prep{' '}
          <span className="italic text-[var(--tpp-rose)]">Client Journey.</span>
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-text-2)]">
          Every phase, every step, every automation — mapped out so your systems stop being the bottleneck.
        </p>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* LEFT — What's inside */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">
            What&rsquo;s inside
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-2)]">
            A practitioner-grade reference for any tax prep firm building a repeatable client workflow.
          </p>
          <ul className="mt-6 space-y-4">
            {[
              '8 phases from first contact to filed return',
              'Every form, notification, and status update mapped',
              'Automation triggers at every step',
              'Platform-agnostic — works with any tool stack',
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-[var(--color-text-1)]">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[var(--tpp-blush)] text-[var(--tpp-rose)]"
                >
                  ✓
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT — Form or success */}
        <div className="rounded-2xl border border-[var(--tpp-rose)] bg-[var(--color-surface)] p-7 shadow-[0_24px_60px_-30px_rgba(233,30,99,0.55)]">
          {submittedEmail ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">
                Success
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-1)]">
                Your blueprint is on the way!
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-2)]">
                Check your inbox at{' '}
                <span className="font-semibold text-[var(--color-text-1)]">{submittedEmail}</span>{' '}
                for the download link.
              </p>
              <a
                href={PDF_PATH}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tpp-rose)] px-5 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)]"
              >
                Download Now
              </a>
              <div className="mt-8 border-t border-[var(--color-border)] pt-6">
                <p className="text-sm text-[var(--color-text-2)]">
                  Want this built for your firm?
                </p>
                <Link
                  href="/contact"
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-[var(--tpp-rose)] underline-offset-4 hover:underline"
                >
                  Book a Discovery Call <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">
                Get the Blueprint
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-2)]">
                Enter your email and we&rsquo;ll send it over right now.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[var(--color-text-1)]"
                >
                  Email
                  <span className="ml-0.5 text-[var(--tpp-rose)]">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-1)] outline-none transition focus:border-[var(--tpp-rose)] focus:ring-2 focus:ring-[var(--tpp-rose)]/30"
                />
              </div>

              {/* Honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ display: 'none' }}
                aria-hidden="true"
              />

              {errorCode ? (
                <div className="mt-6 rounded-lg border border-[var(--tpp-rose)] bg-[var(--tpp-blush)] p-4 text-sm text-[var(--color-text-1)]">
                  {errorCode === 'validation' ? (
                    <p>{errorMsg || 'Please enter a valid email and try again.'}</p>
                  ) : errorCode === 'duplicate' ? (
                    <p>
                      Looks like you already grabbed this. Check your inbox, or{' '}
                      <a
                        href={PDF_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                        className="underline underline-offset-2"
                      >
                        download it directly
                      </a>
                      .
                    </p>
                  ) : errorCode === 'quota' ? (
                    <p>
                      We&rsquo;re at capacity right now. Please{' '}
                      <Link href="/contact" className="underline underline-offset-2">
                        book a Discovery Call
                      </Link>{' '}
                      instead.
                    </p>
                  ) : errorCode === 'rate_limited' ? (
                    <p>
                      Too many attempts. Please wait an hour and try again.
                    </p>
                  ) : (
                    <p>
                      Something went wrong. Please try again, or{' '}
                      <Link href="/contact" className="underline underline-offset-2">
                        book a Discovery Call
                      </Link>
                      .
                    </p>
                  )}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={!canSubmit}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tpp-rose)] px-5 py-3 font-medium text-white transition hover:bg-[var(--tpp-rose-deep)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'Sending…' : 'Download Free Blueprint'}
              </button>
              <p className="mt-3 text-center text-xs text-[var(--color-text-3)]">
                Instant access · No credit card · Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
