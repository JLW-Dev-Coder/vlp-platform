'use client'

import { useState, useEffect, useRef } from 'react'

const GALA_VIDEO_BASE = 'https://api.virtuallaunch.pro/v1/tcvlp/gala'

type Clip = { id: string; label: string; duration: number | null; loop: boolean }

const CLIPS: Record<string, Clip> = {
  idle:            { id: 'idle',            label: 'Waiting',         duration: null, loop: true },
  greeting:        { id: 'greeting',        label: 'Welcome',         duration: 18,   loop: false },
  'kwong-intro':   { id: 'kwong-intro',     label: 'Kwong Overview',  duration: 45,   loop: false },
  'kwong-example': { id: 'kwong-example',   label: 'Kwong Example',   duration: 40,   loop: false },
  'refund-path':   { id: 'refund-path',     label: 'Refund Path',     duration: 30,   loop: false },
  'notice-path':   { id: 'notice-path',     label: 'Notice Path',     duration: 35,   loop: false },
  'not-sure':      { id: 'not-sure',        label: 'Not Sure',        duration: 25,   loop: false },
  'qualify-yes':   { id: 'qualify-yes',     label: 'May Qualify',     duration: 20,   loop: false },
  'qualify-no':    { id: 'qualify-no',      label: 'May Not Qualify', duration: 20,   loop: false },
  'next-steps':    { id: 'next-steps',      label: 'Next Steps',      duration: 25,   loop: false },
  'book-review':   { id: 'book-review',     label: 'Book Review',     duration: 15,   loop: false },
  'quick-explain': { id: 'quick-explain',   label: 'Quick Explainer', duration: 60,   loop: false },
}

type Button = { label: string; next?: string; action?: 'book' | 'done' }
type Branch = { clip: string; transcript: string; buttons: Button[]; showIntake?: boolean }

const BRANCHES: Record<string, Branch> = {
  greeting: {
    clip: 'greeting',
    transcript:
      "Hi, I'm Gala. I can walk you through whether the Kwong claim logic may apply to your situation. Start by choosing the option that best matches your case.",
    buttons: [
      { label: 'Explain the claim first', next: 'explain' },
      { label: 'I already know the issue', next: 'already-know' },
      { label: 'I received an IRS notice', next: 'notice' },
      { label: 'I think the IRS applied something wrong', next: 'already-know' },
      { label: 'Quick explanation first', next: 'quick' },
    ],
  },
  explain: {
    clip: 'kwong-intro',
    transcript:
      'The Kwong v. United States ruling established that the IRS improperly applied certain penalties during a specific window — January 2020 through July 2023. If you were assessed a failure-to-file, failure-to-pay, or estimated tax penalty during that period, you may be entitled to a refund or abatement. Let me show you what that means in practice.',
    buttons: [
      { label: 'I think this fits my situation', next: 'qualify-yes' },
      { label: 'Can you walk me through an example?', next: 'example' },
      { label: 'This sounds different from my case', next: 'qualify-no' },
    ],
  },
  example: {
    clip: 'kwong-example',
    transcript:
      "Here's a real scenario. A taxpayer filed their 2021 return three months late and was assessed a $2,400 failure-to-file penalty. Under the Kwong ruling, that penalty may have been improperly calculated. By filing Form 843, they requested — and received — a full refund of the penalty plus interest. The key factors were: the tax year fell within the Kwong window, the penalty type was covered, and they filed before the July 2026 deadline.",
    buttons: [
      { label: 'That sounds like my situation', next: 'qualify-yes' },
      { label: 'My case is different', next: 'qualify-no' },
      { label: 'Start over', next: 'greeting' },
    ],
  },
  'already-know': {
    clip: 'refund-path',
    transcript:
      "If you already know the IRS assessed a penalty you believe was incorrect — whether you paid it and want money back, or you're disputing a balance — the next step is straightforward. We'll collect a few details about your situation and generate the Form 843 to request abatement or a refund.",
    buttons: [
      { label: "Let's start the claim", next: 'intake' },
      { label: 'Wait, explain the Kwong ruling first', next: 'explain' },
    ],
  },
  notice: {
    clip: 'notice-path',
    transcript:
      "If you received an IRS notice mentioning penalties, the first question is whether those penalties fall within the Kwong window — January 2020 through July 2023. If they do, the Kwong ruling may provide grounds for abatement or refund. Let's figure out which applies to you.",
    buttons: [
      { label: 'Penalties are from 2020–2023', next: 'qualify-yes' },
      { label: 'The notice is about something else', next: 'qualify-no' },
      { label: "I'm not sure what my notice says", next: 'not-sure-notice' },
    ],
  },
  'not-sure-notice': {
    clip: 'not-sure',
    transcript:
      "That's completely fine. Many IRS notices are confusing. If you can share the notice or describe what it says, we can help determine whether the Kwong claim applies. You can also upload a copy of the notice in the next step — we'll review it and let you know.",
    buttons: [
      { label: "I'll submit my details", next: 'intake' },
      { label: 'Let me hear the Kwong overview first', next: 'explain' },
      { label: 'Start over', next: 'greeting' },
    ],
  },
  quick: {
    clip: 'quick-explain',
    transcript:
      "Here's the short version. In Kwong v. United States, the court found that the IRS miscalculated certain penalties assessed between January 2020 and July 2023. If you were hit with a failure-to-file, failure-to-pay, or estimated tax penalty during that window, you may be owed money back — or you may be able to get the penalty removed entirely. The catch: you need to file Form 843 before July 2026. That's the deadline. After that, the window closes. Ready to check if this applies to you?",
    buttons: [
      { label: 'Explain the claim first', next: 'explain' },
      { label: 'I already know the issue', next: 'already-know' },
      { label: 'I received an IRS notice', next: 'notice' },
      { label: 'I think the IRS applied something wrong', next: 'already-know' },
    ],
  },
  'qualify-yes': {
    clip: 'qualify-yes',
    transcript:
      'Based on what you\'ve described, the Kwong claim logic may apply to your situation. The next step is to provide some details so we can generate your Form 843 and get the process started. This takes about two minutes.',
    buttons: [
      { label: 'Start my claim', next: 'intake' },
      { label: 'I have more questions first', next: 'explain' },
    ],
  },
  'qualify-no': {
    clip: 'qualify-no',
    transcript:
      "Based on what you've described, the Kwong claim framework may not be the right fit for your situation. That doesn't mean you're out of options — there are other penalty abatement strategies, and a tax professional can review your case. We can still connect you with someone who specializes in IRS penalty resolution.",
    buttons: [
      { label: 'Connect me with a tax professional', next: 'intake' },
      { label: 'Let me re-check my situation', next: 'greeting' },
    ],
  },
  intake: {
    clip: 'next-steps',
    transcript:
      "Great. I'll need a few details to get your Form 843 started. Fill out the form below — it takes about two minutes. Once submitted, a tax professional will review your case and follow up with next steps.",
    buttons: [],
    showIntake: true,
  },
  submitted: {
    clip: 'book-review',
    transcript:
      'Your information has been submitted. A tax professional will review your case details and reach out using your preferred contact method — usually within one business day. If you want to expedite the process, you can book a review call right now.',
    buttons: [
      { label: 'Book a review call', action: 'book' },
      { label: "I'll wait for the follow-up", action: 'done' },
    ],
  },
}

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

type IntakeData = {
  taxYears: string[]
  penaltyType: string
  amount: string
  description: string
  name: string
  email: string
  phone: string
  contactPref: string
}

function IntakeForm({ onSubmit }: { onSubmit: (data: IntakeData) => void }) {
  const [form, setForm] = useState<IntakeData>({
    taxYears: [],
    penaltyType: '',
    amount: '',
    description: '',
    name: '',
    email: '',
    phone: '',
    contactPref: 'email',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const update = <K extends keyof IntakeData>(k: K, v: IntakeData[K]) =>
    setForm((p) => ({ ...p, [k]: v }))
  const toggleYear = (y: string) =>
    setForm((p) => ({
      ...p,
      taxYears: p.taxYears.includes(y) ? p.taxYears.filter((x) => x !== y) : [...p.taxYears, y],
    }))

  const validate = () => {
    const e: Record<string, string> = {}
    if (form.taxYears.length === 0) e.taxYears = 'Select at least one tax year'
    if (!form.penaltyType) e.penaltyType = 'Select a penalty type'
    if (!form.description.trim()) e.description = 'Describe what happened'
    if (!form.name.trim()) e.name = 'Enter your name'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email'
    if (!form.contactPref) e.contactPref = 'Select a contact preference'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) onSubmit(form)
  }

  const inputClass = (field: string) =>
    `w-full px-4 py-3 bg-zinc-900/80 border ${
      errors[field] ? 'border-red-500' : 'border-zinc-700'
    } rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/30 transition-colors`

  return (
    <div className="space-y-5 max-w-lg mx-auto">
      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Tax Year(s) *</label>
        <div className="flex gap-2 flex-wrap">
          {['2020', '2021', '2022', '2023'].map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => toggleYear(y)}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                form.taxYears.includes(y)
                  ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
              }`}
            >
              {y}
            </button>
          ))}
        </div>
        {errors.taxYears && <p className="text-red-400 text-xs mt-1">{errors.taxYears}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">Penalty Type *</label>
        <select
          value={form.penaltyType}
          onChange={(e) => update('penaltyType', e.target.value)}
          className={inputClass('penaltyType')}
        >
          <option value="">Select one...</option>
          <option value="failure-to-file">Failure to File</option>
          <option value="failure-to-pay">Failure to Pay</option>
          <option value="estimated-tax">Estimated Tax Penalty</option>
          <option value="other">Other / Not Sure</option>
        </select>
        {errors.penaltyType && <p className="text-red-400 text-xs mt-1">{errors.penaltyType}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">
          Approximate Penalty Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
          <input
            type="text"
            placeholder="2,400"
            value={form.amount}
            onChange={(e) => update('amount', e.target.value.replace(/[^0-9.,]/g, ''))}
            className={`${inputClass('amount')} pl-8`}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-300 mb-2">What Happened *</label>
        <textarea
          rows={3}
          placeholder="Briefly describe your situation — e.g., filed late due to COVID, received CP14 notice..."
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
          className={inputClass('description')}
        />
        {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
      </div>

      <div className="border-t border-zinc-800 pt-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name *</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputClass('name')}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
          <input
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputClass('email')}
          />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Phone</label>
          <input
            type="tel"
            placeholder="(555) 123-4567"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className={inputClass('phone')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Contact Preference *
          </label>
          <div className="flex gap-3">
            {[
              { value: 'email', label: 'Email' },
              { value: 'phone', label: 'Phone' },
              { value: 'text', label: 'Text' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update('contactPref', opt.value)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  form.contactPref === opt.value
                    ? 'bg-yellow-500 text-black'
                    : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.contactPref && (
            <p className="text-red-400 text-xs mt-1">{errors.contactPref}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:translate-y-0"
      >
        Submit My Case Details
      </button>
    </div>
  )
}

export default function KwongClaimPage() {
  const [currentBranch, setCurrentBranch] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const countdown = useCountdown('2026-07-15T00:00:00')

  const branch = currentBranch ? BRANCHES[currentBranch] : null

  const navigate = (branchId: string) => {
    if (currentBranch) setHistory((h) => [...h, currentBranch])
    setCurrentBranch(branchId)
    setIsPlaying(true)
  }

  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1]
      setHistory((h) => h.slice(0, -1))
      setCurrentBranch(prev)
      setIsPlaying(true)
    }
  }

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const clip = branch?.clip
    if (!clip) return
    v.src = `${GALA_VIDEO_BASE}/${clip}.mp4`
    v.loop = clip === 'idle'
    v.muted = false
    v.play().catch(() => {})
  }, [currentBranch, branch?.clip])

  const handleIntakeSubmit = (formData: IntakeData) => {
    console.log('Intake submitted:', formData)
    setFormSubmitted(true)
    setCurrentBranch('submitted')
  }

  const handleButtonAction = (btn: Button) => {
    if (btn.action === 'book') {
      window.open('https://cal.com/vlp/tcvlp-discovery', '_blank')
    } else if (btn.action === 'done') {
      // stay on page
    } else if (btn.next) {
      navigate(btn.next)
    }
  }

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
            Kwong v. United States
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-4">
            Could the Kwong claim logic
            <br />
            <span className="text-yellow-500">apply to your case?</span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
            Gala will walk you through it in under 2 minutes. No account needed.
          </p>

          {!currentBranch && (
            <button
              type="button"
              onClick={() => navigate('greeting')}
              className="inline-flex items-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl transition-all shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start with Gala
            </button>
          )}
        </div>
      </div>

      {/* VIDEO + INTERACTION PANEL */}
      {currentBranch && (
        <div className="max-w-4xl mx-auto px-6 pb-16">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl mb-6">
            <video
              ref={videoRef}
              className="w-full aspect-video object-cover bg-black"
              playsInline
              onEnded={() => setIsPlaying(false)}
            />

            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs text-zinc-300 font-medium">
              {branch?.clip && CLIPS[branch.clip] ? CLIPS[branch.clip].label : 'Idle'}
            </div>

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
          </div>

          {showTranscript && branch?.transcript && (
            <div className="mb-6 p-5 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-yellow-500">G</span>
                </div>
                <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
                  Gala
                </span>
                <button
                  type="button"
                  onClick={() => setShowTranscript(false)}
                  className="ml-auto text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  Hide
                </button>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{branch.transcript}</p>
            </div>
          )}

          {!showTranscript && (
            <button
              type="button"
              onClick={() => setShowTranscript(true)}
              className="mb-6 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Show transcript
            </button>
          )}

          {branch?.buttons && branch.buttons.length > 0 && !branch.showIntake && currentBranch !== 'submitted' && (
            <div className="space-y-3 max-w-lg mx-auto">
              {branch.buttons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleButtonAction(btn)}
                  className="w-full text-left px-5 py-4 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-yellow-500/40 hover:bg-zinc-900/80 transition-all group flex items-center justify-between"
                >
                  <span className="text-zinc-200 group-hover:text-white font-medium text-sm">
                    {btn.label}
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

          {branch?.showIntake && !formSubmitted && (
            <div className="mt-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-white mb-1">Case Details</h2>
                <p className="text-sm text-zinc-500">
                  Takes about 2 minutes. All information is confidential.
                </p>
              </div>
              <IntakeForm onSubmit={handleIntakeSubmit} />
            </div>
          )}

          {currentBranch === 'submitted' && branch?.buttons && (
            <div className="space-y-3 max-w-lg mx-auto mt-6">
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Case details submitted
                </div>
              </div>
              {branch.buttons.map((btn, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleButtonAction(btn)}
                  className={`w-full text-center px-5 py-4 rounded-xl font-semibold transition-all ${
                    i === 0
                      ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TRUST STRIP */}
      <div className="border-t border-zinc-900 py-12">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { stat: '2 min', label: 'Average walkthrough time' },
            { stat: 'July 2026', label: 'Filing deadline' },
            { stat: '$0', label: 'Cost to check eligibility' },
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
    </div>
  )
}
