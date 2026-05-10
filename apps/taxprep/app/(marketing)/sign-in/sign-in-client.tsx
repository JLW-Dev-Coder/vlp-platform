'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { tppConfig } from '@/lib/platform-config'

const CATEGORIES = [
  'Coaches & Consultants',
  'Creatives',
  'E-Commerce',
  'Healthcare Providers',
  'Legal & Immigration',
  'Marketing Agencies',
  'Real Estate & Real Estate Investors',
  'Service Bureaus',
  'Tax & Accounting',
  'Tech Founders',
  'VA Agencies',
] as const

const SD_PORTAL_URL = 'https://secure.virtuallaunch.pro/site/login'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type ErrorCode = 'validation' | 'quota' | 'rate_limited' | 'server'

export function SignInClient() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [firmName, setFirmName] = useState('')
  const [category, setCategory] = useState('')
  const [website, setWebsite] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [errorCode, setErrorCode] = useState<ErrorCode | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    if (submitting) return false
    if (firstName.trim().length < 1) return false
    if (lastName.trim().length < 1) return false
    if (!EMAIL_RE.test(email.trim())) return false
    if (firmName.trim().length < 2) return false
    if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) return false
    return true
  }, [firstName, lastName, email, firmName, category, submitting])

  function resetForm() {
    setSubmittedEmail(null)
    setErrorCode(null)
    setErrorMsg('')
  }

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
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      firmName: firmName.trim(),
      category,
      eventId,
    }

    try {
      const res = await fetch(`${tppConfig.apiBaseUrl}/v1/taxprep/onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'omit',
        body: JSON.stringify(payload),
      })
      let data: { ok?: boolean; error?: ErrorCode; message?: string } = {}
      try {
        data = (await res.json()) as typeof data
      } catch {
        // fall through to generic server error
      }

      if (data.ok) {
        setSubmittedEmail(payload.email)
        return
      }
      const code: ErrorCode =
        data.error === 'validation' ||
        data.error === 'quota' ||
        data.error === 'rate_limited'
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--tpp-rose)]">
          Get Started
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[var(--color-text-1)] md:text-5xl">
          Create your account or{' '}
          <span className="italic text-[var(--tpp-rose)]">sign in.</span>
        </h1>
      </header>

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {/* LEFT — Create your account */}
        <div className="rounded-2xl border border-[var(--tpp-rose)] bg-[var(--color-surface)] p-7 shadow-[0_24px_60px_-30px_rgba(233,30,99,0.55)]">
          {submittedEmail ? (
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">
                Check your email
              </h2>
              <p className="mt-4 text-base leading-relaxed text-[var(--color-text-2)]">
                We&rsquo;ve sent a SuiteDash invite to{' '}
                <span className="font-semibold text-[var(--color-text-1)]">{submittedEmail}</span>.
                Click the link in that email to set up your password and access your workspace.
              </p>
              <button
                type="button"
                onClick={resetForm}
                className="mt-6 text-sm text-[var(--tpp-rose)] underline-offset-4 hover:underline"
              >
                Didn&rsquo;t get it? Try a different email →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-[var(--color-text-2)]">
                Get a SuiteDash workspace invite in your inbox. No card, takes 30 seconds.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field
                  id="firstName"
                  label="First name"
                  value={firstName}
                  onChange={setFirstName}
                  required
                  autoComplete="given-name"
                />
                <Field
                  id="lastName"
                  label="Last name"
                  value={lastName}
                  onChange={setLastName}
                  required
                  autoComplete="family-name"
                />
              </div>

              <div className="mt-4">
                <Field
                  id="email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="mt-4">
                <Field
                  id="firmName"
                  label="Company name"
                  value={firmName}
                  onChange={setFirmName}
                  required
                  autoComplete="organization"
                  helperText="If you don't have a company name, enter your full name instead."
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

              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-[var(--color-text-1)]">
                  What kind of business are you?
                </legend>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  {CATEGORIES.map((c) => {
                    const selected = category === c
                    return (
                      <label
                        key={c}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                          selected
                            ? 'border-[var(--tpp-rose)] bg-[var(--tpp-blush)] text-[var(--color-text-1)]'
                            : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-2)] hover:border-[var(--tpp-rose)]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={c}
                          checked={selected}
                          onChange={() => setCategory(c)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`flex h-4 w-4 flex-none items-center justify-center rounded-full border ${
                            selected
                              ? 'border-[var(--tpp-rose)]'
                              : 'border-[var(--color-border)]'
                          }`}
                        >
                          {selected ? (
                            <span className="h-2 w-2 rounded-full bg-[var(--tpp-rose)]" />
                          ) : null}
                        </span>
                        <span>{c}</span>
                      </label>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs text-[var(--color-text-3)]">
                  This helps us route you to the right workflow. Most TPP customers select &ldquo;Tax &amp; Accounting&rdquo; or &ldquo;Service Bureaus&rdquo;.
                </p>
              </fieldset>

              {errorCode ? (
                <div className="mt-6 rounded-lg border border-[var(--tpp-rose)] bg-[var(--tpp-blush)] p-4 text-sm text-[var(--color-text-1)]">
                  {errorCode === 'validation' ? (
                    <p>{errorMsg || 'Please check your details and try again.'}</p>
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
                      Too many attempts. Please wait an hour and try again, or{' '}
                      <Link href="/contact" className="underline underline-offset-2">
                        book a Discovery Call
                      </Link>
                      .
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
                {submitting ? 'Creating…' : 'Create account'}
              </button>
              <p className="mt-3 text-center text-xs text-[var(--color-text-3)]">
                Takes 30 seconds · No credit card · We&rsquo;ll email you a SuiteDash invite to set your password.
              </p>
            </form>
          )}
        </div>

        {/* RIGHT — Already a member */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7">
          <h2 className="font-display text-2xl font-semibold text-[var(--color-text-1)]">
            Already a member?
          </h2>
          <p className="mt-2 text-sm text-[var(--color-text-2)]">
            Sign in to your SuiteDash workspace.
          </p>
          <a
            href={SD_PORTAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--tpp-rose)] px-5 py-3 font-medium text-[var(--tpp-rose)] transition hover:bg-[var(--tpp-blush)]"
          >
            Sign in to portal <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required,
  autoComplete,
  helperText,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
  helperText?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[var(--color-text-1)]">
        {label}
        {required ? <span className="ml-0.5 text-[var(--tpp-rose)]">*</span> : null}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
        className="mt-1.5 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text-1)] outline-none transition focus:border-[var(--tpp-rose)] focus:ring-2 focus:ring-[var(--tpp-rose)]/30"
      />
      {helperText ? (
        <p className="mt-1.5 text-xs text-[var(--color-text-3)]">{helperText}</p>
      ) : null}
    </div>
  )
}
