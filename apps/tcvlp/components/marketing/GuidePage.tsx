'use client'

import { useState } from 'react'

const API_BASE = 'https://api.virtuallaunch.pro'

const FEATURES = [
  'Exactly what to write on Form 843',
  'Which IRS service center to mail it to',
  'How to get your transcript (free from IRS)',
  'Certified mail checklist',
  'What supporting documents to include',
  'Deadline math: 3-year vs. 2-year rule explained',
  'Common mistakes the NTA flagged',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function GuidePage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()

    if (!trimmedName) {
      setError('Please enter your name.')
      return
    }
    if (!EMAIL_RE.test(trimmedEmail)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/v1/tcvlp/guide/download`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, email: trimmedEmail }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.success || !data?.download_url) {
        setError(data?.message || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }
      const path = String(data.download_url)
      const fullUrl = path.startsWith('http') ? path : `${API_BASE}${path}`
      setDownloadUrl(fullUrl)
    } catch (_err) {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-primary/30 bg-brand-primary/15 px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
            </svg>
            <span className="text-sm font-semibold text-brand-primary">Free Download</span>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl text-text-primary">
            Protective Claim{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Filing Guide
            </span>
          </h1>

          <p className="mx-auto mb-6 max-w-3xl text-xl leading-relaxed text-text-muted md:text-2xl">
            Step-by-step instructions to file your Kwong v. US protective claim before the July 10, 2026 deadline.
          </p>
        </div>
      </section>

      {/* What's inside + Form */}
      <section className="py-12 md:py-16 bg-surface-card">
        <div className="max-w-5xl mx-auto px-4 grid gap-10 md:grid-cols-2 md:gap-12 items-start">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-6">What&apos;s inside</h2>
            <ul className="space-y-3 text-lg text-text-muted leading-relaxed">
              {FEATURES.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-brand-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-primary/30 bg-[var(--surface-card)] p-6 md:p-8 shadow-xl">
            {!downloadUrl ? (
              <form onSubmit={handleSubmit} noValidate>
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                  Get your free guide
                </h3>
                <p className="text-text-muted mb-6 text-sm">
                  Enter your name and email — we&apos;ll show your download link immediately.
                </p>

                <label className="block mb-4">
                  <span className="block text-sm font-semibold text-text-primary mb-1">Name</span>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-subtle bg-surface-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="Jane Doe"
                    disabled={submitting}
                  />
                </label>

                <label className="block mb-5">
                  <span className="block text-sm font-semibold text-text-primary mb-1">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-subtle bg-surface-elevated px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="you@example.com"
                    disabled={submitting}
                  />
                </label>

                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg shadow-brand-glow transition-all duration-200 hover:from-brand-hover hover:to-brand-primary disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : 'Get My Free Guide'}
                </button>

                <p className="mt-4 text-xs text-text-muted text-center">
                  We&apos;ll also send you updates on the Kwong case. Unsubscribe anytime.
                </p>
              </form>
            ) : (
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-primary border border-brand-primary/20">
                  Ready
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
                  Your guide is ready.
                </h3>
                <p className="text-text-muted mb-6">
                  Click below to download the PDF.
                </p>
                <a
                  href={downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-gradient-to px-8 py-4 text-lg font-semibold text-brand-text-on-primary shadow-lg shadow-brand-glow transition-all duration-200 hover:from-brand-hover hover:to-brand-primary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
                  </svg>
                  Download the PDF
                </a>
                <p className="mt-4 text-sm text-text-muted text-center">
                  Check your email — we&apos;ll send you a copy too.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Post-download CTAs */}
      {downloadUrl && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Next steps</h2>
            <p className="text-lg text-text-muted mb-8 max-w-2xl mx-auto">
              Want help applying it to your specific situation? Gala can walk through it with you in a few minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/gala" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">
                Talk to Gala →
              </a>
              <a href="/news" className="bg-surface-elevated hover:bg-surface-card text-text-primary font-semibold px-10 py-4 rounded-xl text-lg border border-brand-primary/20 transition-all">
                Read the latest Kwong updates
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Bottom context (always shown) */}
      {!downloadUrl && (
        <section className="py-16 md:py-20 bg-gradient-to-b from-surface-bg to-surface-card">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-6 text-center">
              Why this matters
            </h2>
            <div className="space-y-4 text-lg text-text-muted leading-relaxed text-center max-w-3xl mx-auto">
              <p>
                The National Taxpayer Advocate confirmed the July 10, 2026 deadline for Kwong-related refund claims. Relief is not automatic — taxpayers must file Form 843, properly, on time.
              </p>
              <p>
                This guide gives you the exact steps so you can file with confidence — even if you&apos;ve never done it before.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
