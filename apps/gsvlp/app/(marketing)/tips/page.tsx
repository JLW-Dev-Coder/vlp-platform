'use client'

import { useState } from 'react'

const API_BASE = 'https://api.virtuallaunch.pro'

const TIPS = [
  {
    n: '01',
    title: 'The pen trick',
    body: 'Hold a pen sideways between your teeth for 5 seconds before you dial. Your voice comes out warmer and more confident. Setters who actually do it say it makes the single biggest difference on call one.',
  },
  {
    n: '02',
    title: 'The 3-second pause',
    body: 'After you say your opener, shut up. Three full seconds of silence. Most people break it themselves and start booking — silence is uncomfortable for the prospect, not for you.',
  },
  {
    n: '03',
    title: 'Stand up on your first calls',
    body: 'Sitting flattens your voice. Standing up — even pacing — adds energy the prospect can hear. After a week you can sit, but day one: stand.',
  },
  {
    n: '04',
    title: '“No” is a gift — collect them fast',
    body: 'If 1 in 10 calls books and the average commission is $100, every “no” is worth about $11. Nine no’s and one yes = $100. Most setters quit after 3 no’s and never see the yes.',
  },
  {
    n: '05',
    title: 'Read the script word-for-word — even when it feels weird',
    body: 'The script is 28 seconds. Improvising costs you appointments. The setters who book the most are the ones who trust the words on the screen and just read.',
  },
]

export default function TipsPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${API_BASE}/v1/gsvlp/tips/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data?.ok === false) {
        setStatus('error')
        setErrorMsg(data?.error || data?.message || 'Something went wrong. Try again.')
        return
      }
      setStatus('success')
    } catch (_e) {
      setStatus('error')
      setErrorMsg('Network error. Please try again.')
    }
  }

  return (
    <div style={{ background: '#0A0A0A', color: '#F5F5F5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '64px 24px 96px' }}>
        <span
          style={{
            display: 'inline-block',
            background: 'rgba(34,197,94,0.15)',
            color: '#22C55E',
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          Free Guide
        </span>

        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', lineHeight: 1.1, margin: '20px 0 16px', fontWeight: 800 }}>
          5 Hot Tips No Sales Trainer Will Tell You
        </h1>
        <p style={{ fontSize: 18, color: '#A3A3A3', margin: '0 0 36px', lineHeight: 1.5 }}>
          Real tricks for sounding confident, staying calm, and booking appointments — even on your first
          call. Enter your email and it&apos;s yours.
        </p>

        {status !== 'success' ? (
          <form
            onSubmit={onSubmit}
            style={{
              background: '#141414',
              border: '1px solid #262626',
              borderRadius: 16,
              padding: 24,
              marginBottom: 48,
            }}
          >
            <label htmlFor="email" style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#D4D4D4' }}>
              Your email address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                background: '#1A1A1A',
                border: '1px solid #2D2D2D',
                borderRadius: 10,
                padding: '14px 16px',
                fontSize: 16,
                color: '#F5F5F5',
                outline: 'none',
                marginBottom: 12,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#22C55E' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#2D2D2D' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                width: '100%',
                height: 56,
                background: '#22C55E',
                color: '#0A0A0A',
                border: 'none',
                borderRadius: 10,
                fontSize: 16,
                fontWeight: 700,
                cursor: status === 'loading' ? 'wait' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
              }}
            >
              {status === 'loading' ? 'Sending…' : 'Send Me the Tips'}
            </button>
            {status === 'error' && (
              <p style={{ color: '#F87171', fontSize: 14, margin: '12px 0 0' }}>{errorMsg}</p>
            )}
            <p style={{ fontSize: 12, color: '#737373', margin: '14px 0 0', lineHeight: 1.5 }}>
              No spam. Just 6 emails over 3 weeks with tips to help you start earning.
            </p>
          </form>
        ) : (
          <div
            style={{
              background: '#141414',
              border: '1px solid #22C55E',
              borderRadius: 16,
              padding: 32,
              marginBottom: 48,
              textAlign: 'center',
            }}
          >
            <div style={{ width: 56, height: 56, margin: '0 auto 16px', background: 'rgba(34,197,94,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" aria-hidden="true">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 style={{ fontSize: 24, margin: '0 0 12px', fontWeight: 700 }}>Check your email!</h2>
            <p style={{ color: '#A3A3A3', margin: '0 0 20px', lineHeight: 1.5 }}>
              We just sent you the download link. If you don&apos;t see it in 2 minutes, check your spam folder.
            </p>
            <p style={{ color: '#D4D4D4', margin: 0 }}>
              Ready to start earning?{' '}
              <a href="/sign-in" style={{ color: '#22C55E', fontWeight: 600 }}>
                Sign up free →
              </a>
            </p>
          </div>
        )}

        <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 24px', color: '#F5F5F5' }}>
          What&apos;s inside
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {TIPS.map((t) => (
            <li
              key={t.n}
              style={{
                background: '#141414',
                border: '1px solid #262626',
                borderRadius: 12,
                padding: 20,
                marginBottom: 12,
                display: 'flex',
                gap: 16,
              }}
            >
              <div style={{ color: '#22C55E', fontSize: 20, fontWeight: 800, minWidth: 36 }}>{t.n}</div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: '0 0 6px', color: '#F5F5F5' }}>{t.title}</h3>
                <p style={{ fontSize: 14, color: '#A3A3A3', margin: 0, lineHeight: 1.55 }}>{t.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
