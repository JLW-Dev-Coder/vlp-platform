'use client'

import { useState, useEffect } from 'react'
import {
  Star,
  ArrowLeft,
  FileText,
  MessageSquare,
  Video,
  Shield,
  Clock,
  Users,
  Upload,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'
import type { ReviewConfig } from '../../types/review'

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type FormType = 'review' | 'case_study' | 'testimonial'
type View = 'landing' | FormType

const FORM_META: Record<FormType, { title: string; desc: string; icon: typeof Star }> = {
  review: {
    title: 'Write a Review',
    desc: 'Share your honest experience — what worked, what surprised you, what you\u2019d tell a colleague.',
    icon: MessageSquare,
  },
  case_study: {
    title: 'Share a Case Study',
    desc: 'Walk us through a real engagement — the situation, what you found, and the outcome.',
    icon: FileText,
  },
  testimonial: {
    title: 'Record a Testimonial',
    desc: 'Share a brief video or written testimonial about your experience.',
    icon: Video,
  },
}

const USE_CASE_OPTIONS = [
  'Tax preparation',
  'Audit support',
  'Compliance review',
  'Research & discovery',
  'Other',
]

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function InteractiveStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1.5" role="radiogroup" aria-label="Star rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          className="cursor-pointer transition-transform hover:scale-110"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(i)}
          aria-label={`${i} star${i !== 1 ? 's' : ''}`}
          role="radio"
          aria-checked={value === i}
        >
          <Star
            size={28}
            fill={(hover || value) >= i ? '#fbbf24' : 'transparent'}
            stroke={(hover || value) >= i ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
          />
        </button>
      ))}
    </div>
  )
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  const Icon = type === 'success' ? CheckCircle : AlertCircle
  return (
    <div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-lg shadow-2xl text-white text-sm font-medium animate-[fadeIn_0.3s_ease]"
      style={{
        background: type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
        backdropFilter: 'blur(8px)',
      }}
      role="alert"
    >
      <Icon size={18} />
      {message}
    </div>
  )
}

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-300">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-500">{hint}</p>}
    </div>
  )
}

function UploadPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="rounded-xl border-2 border-dashed border-white/10 p-8 text-center cursor-default"
      onDrop={(e) => {
        e.preventDefault()
        console.log('[ReviewSubmit] File drop — upload not yet implemented (Phase 2)')
      }}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="mx-auto mb-3 text-gray-500" size={32} />
      <p className="text-gray-400 text-sm font-medium">{label}</p>
      <p className="text-gray-600 text-xs mt-1">Drag & drop or click to browse (coming soon)</p>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Shared input styles                                                */
/* ------------------------------------------------------------------ */

const INPUT_CLS =
  'w-full rounded-lg bg-gray-800/80 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition focus:border-white/30 focus:ring-1 focus:ring-white/20'
const TEXTAREA_CLS = INPUT_CLS + ' resize-none'
const SELECT_CLS = INPUT_CLS + ' appearance-none'
const CHECKBOX_LABEL =
  'flex items-start gap-3 cursor-pointer text-sm text-gray-300 select-none'

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

export function ReviewSubmitPage({ config }: { config: ReviewConfig }) {
  const [view, setView] = useState<View>('landing')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  /* --- Review form state --- */
  const [rating, setRating] = useState(0)
  const [content, setContent] = useState('')
  const [useCase, setUseCase] = useState('')
  const [name, setName] = useState('')
  const [firm, setFirm] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [consentPublish, setConsentPublish] = useState(false)
  const [consentMarketing, setConsentMarketing] = useState(false)

  /* --- Case study form state --- */
  const [csIndustry, setCsIndustry] = useState('')
  const [csFirmType, setCsFirmType] = useState('')
  const [csSituation, setCsSituation] = useState('')
  const [csIssue, setCsIssue] = useState('')
  const [csFindings, setCsFindings] = useState('')
  const [csOutcome, setCsOutcome] = useState('')
  const [csTimeSaved, setCsTimeSaved] = useState('')
  const [csDollarImpact, setCsDollarImpact] = useState('')

  /* --- Testimonial form state --- */
  const [tSummary, setTSummary] = useState('')
  const [tProfession, setTProfession] = useState('')
  const [tPracticeArea, setTPracticeArea] = useState('')

  function resetAll() {
    setRating(0); setContent(''); setUseCase(''); setName(''); setFirm('')
    setAnonymous(false); setConsentPublish(false); setConsentMarketing(false)
    setCsIndustry(''); setCsFirmType(''); setCsSituation(''); setCsIssue('')
    setCsFindings(''); setCsOutcome(''); setCsTimeSaved(''); setCsDollarImpact('')
    setTSummary(''); setTProfession(''); setTPracticeArea('')
  }

  function showToast(message: string, type: 'success' | 'error') {
    setToast({ message, type })
    if (type === 'success') {
      setTimeout(() => {
        setToast(null)
        setView('landing')
        resetAll()
      }, 3000)
    } else {
      setTimeout(() => setToast(null), 5000)
    }
  }

  /* --- Validation helpers --- */
  function isReviewValid() {
    return rating > 0 && content.trim().length >= 10 && content.trim().length <= 2000 && consentPublish
  }
  function isCaseStudyValid() {
    return csSituation.trim().length > 0 && csIssue.trim().length > 0 && csOutcome.trim().length > 0 && consentPublish
  }
  function isTestimonialValid() {
    return tSummary.trim().length > 0 && consentPublish
  }
  function isCurrentFormValid(): boolean {
    if (view === 'review') return isReviewValid()
    if (view === 'case_study') return isCaseStudyValid()
    if (view === 'testimonial') return isTestimonialValid()
    return false
  }

  /* --- Submit --- */
  async function handleSubmit() {
    if (!isCurrentFormValid() || submitting) return
    setSubmitting(true)

    let payload: Record<string, unknown> = {
      platform: config.platform,
      form_type: view,
      name: name.trim() || undefined,
      firm: firm.trim() || undefined,
      anonymous,
      consent_publish: consentPublish,
      consent_marketing: consentMarketing,
    }

    if (view === 'review') {
      payload = {
        ...payload,
        rating,
        content: content.trim(),
        use_case: useCase || undefined,
      }
    } else if (view === 'case_study') {
      payload = {
        ...payload,
        situation_industry: csIndustry.trim() || undefined,
        situation_firm_type: csFirmType.trim() || undefined,
        situation_description: csSituation.trim(),
        issue: csIssue.trim(),
        findings: csFindings.trim() || undefined,
        result_outcome: csOutcome.trim(),
        result_time_saved: csTimeSaved.trim() || undefined,
        result_dollar_impact: csDollarImpact.trim() || undefined,
      }
    } else if (view === 'testimonial') {
      payload = {
        ...payload,
        content: tSummary.trim(),
        profession: tProfession.trim() || undefined,
        practice_area: tPracticeArea.trim() || undefined,
      }
    }

    try {
      const res = await fetch(`${config.apiBase}/v1/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error || `Request failed (${res.status})`)
      }
      showToast('Submission received. Thank you for sharing your experience.', 'success')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      showToast(message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /* --- Scroll to top on view change --- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [view])

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="min-h-screen bg-gray-950 text-white relative">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}

      {view === 'landing' ? (
        /* ============================================================ */
        /*  LANDING VIEW                                                 */
        /* ============================================================ */
        <>
          {/* Hero */}
          <section
            className="relative py-24 px-4 text-center overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(${hexToRgba(config.themeColor, 0.03)} 1px, transparent 1px),
                linear-gradient(90deg, ${hexToRgba(config.themeColor, 0.03)} 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          >
            <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {config.heroHeadline || (
                  <>
                    Share Your Experience With{' '}
                    <span style={{ color: config.themeColor }}>{config.platformName}</span>
                  </>
                )}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {config.heroSubheadline ||
                  'Your feedback helps us improve and helps other professionals make informed decisions.'}
              </p>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-24"
              style={{ background: 'linear-gradient(transparent, rgb(3, 7, 18))' }}
            />
          </section>

          {/* Form type cards */}
          <section className="max-w-4xl mx-auto px-4 -mt-4 relative z-10">
            <div className={`grid gap-6 ${config.formTypes.length === 1 ? 'max-w-md mx-auto' : config.formTypes.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3'}`}>
              {config.formTypes.map((type) => {
                const meta = FORM_META[type]
                const Icon = meta.icon
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setView(type)}
                    className="group text-left rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{
                      background: 'rgba(17, 24, 39, 0.5)',
                      border: `1px solid ${hexToRgba(config.themeColor, 0.1)}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = hexToRgba(config.themeColor, 0.5)
                      e.currentTarget.style.boxShadow = `0 8px 32px ${hexToRgba(config.themeColor, 0.15)}`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = hexToRgba(config.themeColor, 0.1)
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4"
                      style={{ background: hexToRgba(config.themeColor, 0.15) }}
                    >
                      <Icon size={24} style={{ color: config.themeColor }} />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{meta.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">{meta.desc}</p>
                    <span
                      className="text-sm font-medium inline-flex items-center gap-1"
                      style={{ color: config.themeColor }}
                    >
                      Get Started &rarr;
                    </span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* Why Share */}
          <section className="max-w-4xl mx-auto px-4 py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              Why Share Your Experience
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Users,
                  title: 'Help Fellow Professionals',
                  desc: 'Your review helps other tax professionals evaluate tools and make better decisions for their practice.',
                },
                {
                  icon: MessageSquare,
                  title: 'Shape the Product',
                  desc: 'Direct feedback drives product improvements. Tell us what works and what needs attention.',
                },
                {
                  icon: Clock,
                  title: 'Build Your Reputation',
                  desc: 'Published reviews are attributed to you (unless anonymous), building visibility in the community.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="rounded-xl p-6 text-center"
                    style={{
                      background: 'rgba(17, 24, 39, 0.5)',
                      border: `1px solid ${hexToRgba(config.themeColor, 0.08)}`,
                    }}
                  >
                    <div
                      className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4"
                      style={{ background: hexToRgba(config.themeColor, 0.1) }}
                    >
                      <Icon size={22} style={{ color: config.themeColor }} />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </section>

          {/* What We Accept */}
          <section className="max-w-3xl mx-auto px-4 pb-16">
            <h2 className="text-2xl font-bold text-center mb-6">What We Accept</h2>
            <div
              className="rounded-xl p-6 space-y-3"
              style={{
                background: 'rgba(17, 24, 39, 0.5)',
                border: `1px solid ${hexToRgba(config.themeColor, 0.08)}`,
              }}
            >
              {[
                'Honest, specific feedback about your experience using the platform',
                'Real case studies with anonymized client details',
                'Constructive criticism — we value what didn\u2019t work as much as what did',
                'Short or long — a few sentences or a detailed breakdown',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle size={18} className="mt-0.5 flex-shrink-0" style={{ color: config.themeColor }} />
                  <p className="text-gray-300 text-sm">{item}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Trust & Privacy */}
          <section className="max-w-3xl mx-auto px-4 pb-16 text-center">
            <Shield className="mx-auto mb-3 text-gray-500" size={32} />
            <h3 className="text-lg font-semibold mb-2">Your Privacy Matters</h3>
            <p className="text-gray-400 text-sm max-w-xl mx-auto leading-relaxed">
              All submissions are reviewed before publishing. You can choose to post anonymously.
              No personal data is shared without your explicit consent.
            </p>
          </section>

          {/* Footer CTA */}
          <section
            className="py-16 px-4 text-center"
            style={{ background: hexToRgba(config.themeColor, 0.05) }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Share?</h2>
            <p className="text-gray-400 mb-6">Pick a format above and get started in under 5 minutes.</p>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: config.themeColor }}
            >
              Choose a Format &uarr;
            </button>
          </section>
        </>
      ) : (
        /* ============================================================ */
        /*  FORM VIEW                                                    */
        /* ============================================================ */
        <>
          {/* Back button + header */}
          <section className="max-w-2xl mx-auto px-4 pt-10 pb-6">
            <button
              type="button"
              onClick={() => { setView('landing'); resetAll() }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-8"
            >
              <ArrowLeft size={16} /> Back to options
            </button>
            <div className="flex items-center gap-4 mb-2">
              {(() => {
                const Icon = FORM_META[view].icon
                return (
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg"
                    style={{ background: hexToRgba(config.themeColor, 0.15) }}
                  >
                    <Icon size={20} style={{ color: config.themeColor }} />
                  </div>
                )
              })()}
              <h1 className="text-2xl md:text-3xl font-bold">{FORM_META[view].title}</h1>
            </div>
            <p className="text-gray-400 text-sm">{FORM_META[view].desc}</p>
          </section>

          {/* Form body */}
          <section className="max-w-2xl mx-auto px-4 pb-32">
            <div
              className="rounded-xl p-6 md:p-8 space-y-6"
              style={{
                background: 'rgba(17, 24, 39, 0.5)',
                border: `1px solid ${hexToRgba(config.themeColor, 0.1)}`,
              }}
            >
              {/* ---- REVIEW FORM ---- */}
              {view === 'review' && (
                <>
                  <FormField label="Rating" required>
                    <InteractiveStars value={rating} onChange={setRating} />
                  </FormField>

                  <FormField
                    label="What stood out most?"
                    required
                    hint={`${content.length}/2000 characters (minimum 10)`}
                  >
                    <textarea
                      className={TEXTAREA_CLS}
                      rows={5}
                      maxLength={2000}
                      placeholder="Tell us about your experience..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </FormField>

                  <FormField label={`How are you using ${config.platformName}?`}>
                    <select
                      className={SELECT_CLS}
                      value={useCase}
                      onChange={(e) => setUseCase(e.target.value)}
                    >
                      <option value="">Select an option</option>
                      {USE_CASE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormField>
                    <FormField label="Firm name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Smith Tax Group"
                        value={firm}
                        onChange={(e) => setFirm(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <label className={CHECKBOX_LABEL}>
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-current"
                      style={{ accentColor: config.themeColor }}
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    Post as anonymous
                  </label>
                </>
              )}

              {/* ---- CASE STUDY FORM ---- */}
              {view === 'case_study' && (
                <>
                  <div>
                    <h3 className="text-white font-semibold mb-4">Situation</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Industry">
                          <input
                            type="text"
                            className={INPUT_CLS}
                            placeholder="e.g., Real estate"
                            value={csIndustry}
                            onChange={(e) => setCsIndustry(e.target.value)}
                          />
                        </FormField>
                        <FormField label="Firm size / type">
                          <input
                            type="text"
                            className={INPUT_CLS}
                            placeholder="e.g., Solo practitioner"
                            value={csFirmType}
                            onChange={(e) => setCsFirmType(e.target.value)}
                          />
                        </FormField>
                      </div>
                      <FormField label="Describe the situation" required>
                        <textarea
                          className={TEXTAREA_CLS}
                          rows={4}
                          placeholder="What was the context? What challenge were you facing?"
                          value={csSituation}
                          onChange={(e) => setCsSituation(e.target.value)}
                        />
                      </FormField>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Issue</h3>
                    <FormField label="What was revealed?" required>
                      <textarea
                        className={TEXTAREA_CLS}
                        rows={4}
                        placeholder="What specific issue or discrepancy did you discover?"
                        value={csIssue}
                        onChange={(e) => setCsIssue(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Findings</h3>
                    <FormField label="What was uncovered?">
                      <textarea
                        className={TEXTAREA_CLS}
                        rows={4}
                        placeholder="Detailed findings from your analysis..."
                        value={csFindings}
                        onChange={(e) => setCsFindings(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div>
                    <h3 className="text-white font-semibold mb-4">Result</h3>
                    <div className="space-y-4">
                      <FormField label="Outcome" required>
                        <textarea
                          className={TEXTAREA_CLS}
                          rows={4}
                          placeholder="What was the final result?"
                          value={csOutcome}
                          onChange={(e) => setCsOutcome(e.target.value)}
                        />
                      </FormField>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Time saved">
                          <input
                            type="text"
                            className={INPUT_CLS}
                            placeholder="e.g., 12 hours"
                            value={csTimeSaved}
                            onChange={(e) => setCsTimeSaved(e.target.value)}
                          />
                        </FormField>
                        <FormField label="Dollar impact">
                          <input
                            type="text"
                            className={INPUT_CLS}
                            placeholder="e.g., $15,000 recovered"
                            value={csDollarImpact}
                            onChange={(e) => setCsDollarImpact(e.target.value)}
                          />
                        </FormField>
                      </div>
                    </div>
                  </div>

                  <UploadPlaceholder label="Attach supporting documents" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormField>
                    <FormField label="Firm name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Smith Tax Group"
                        value={firm}
                        onChange={(e) => setFirm(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <label className={CHECKBOX_LABEL}>
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      style={{ accentColor: config.themeColor }}
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    Post as anonymous
                  </label>
                </>
              )}

              {/* ---- TESTIMONIAL FORM ---- */}
              {view === 'testimonial' && (
                <>
                  <UploadPlaceholder label="Upload a video testimonial" />

                  <FormField label="Summary of your testimonial" required>
                    <textarea
                      className={TEXTAREA_CLS}
                      rows={5}
                      placeholder="Briefly describe your experience..."
                      value={tSummary}
                      onChange={(e) => setTSummary(e.target.value)}
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Profession">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="e.g., CPA, EA, Tax Attorney"
                        value={tProfession}
                        onChange={(e) => setTProfession(e.target.value)}
                      />
                    </FormField>
                    <FormField label="Practice area">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="e.g., Individual returns, Business tax"
                        value={tPracticeArea}
                        onChange={(e) => setTPracticeArea(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Jane Smith"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </FormField>
                    <FormField label="Firm name">
                      <input
                        type="text"
                        className={INPUT_CLS}
                        placeholder="Smith Tax Group"
                        value={firm}
                        onChange={(e) => setFirm(e.target.value)}
                      />
                    </FormField>
                  </div>

                  <label className={CHECKBOX_LABEL}>
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      style={{ accentColor: config.themeColor }}
                      checked={anonymous}
                      onChange={(e) => setAnonymous(e.target.checked)}
                    />
                    Post as anonymous
                  </label>
                </>
              )}

              {/* ---- Consent checkboxes (shared across all forms) ---- */}
              <div className="border-t border-white/10 pt-6 space-y-3">
                <label className={CHECKBOX_LABEL}>
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    style={{ accentColor: config.themeColor }}
                    checked={consentPublish}
                    onChange={(e) => setConsentPublish(e.target.checked)}
                  />
                  <span>
                    I approve publishing this submission on the {config.platformName} website
                    <span className="text-red-400 ml-0.5">*</span>
                  </span>
                </label>
                <label className={CHECKBOX_LABEL}>
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    style={{ accentColor: config.themeColor }}
                    checked={consentMarketing}
                    onChange={(e) => setConsentMarketing(e.target.checked)}
                  />
                  I agree it may be used in marketing materials
                </label>
              </div>
            </div>
          </section>

          {/* Sticky action bar */}
          <div
            className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10"
            style={{
              background: 'rgba(3, 7, 18, 0.95)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
              <button
                type="button"
                disabled
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-500 bg-gray-800/50 border border-white/5 cursor-not-allowed"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={!isCurrentFormValid() || submitting}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
                style={{ background: isCurrentFormValid() && !submitting ? config.themeColor : undefined }}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
