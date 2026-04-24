'use client'

import { useCallback, useRef, useState } from 'react'
import styles from './CampaignPostsTab.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CraigslistPost {
  title: string
  body: string
  angle_note: string
}

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const ANGLES: Array<{ value: string; label: string; description: string }> = [
  {
    value: 'penalty_refund',
    label: 'Penalty Refund (Kwong)',
    description:
      'Taxpayers who received IRS penalties between 2020-2023 and may be owed money back under Kwong v. US. Deadline: July 2026.',
  },
  {
    value: 'back_taxes',
    label: 'Back Taxes / Unfiled Returns',
    description:
      'Taxpayers who owe back taxes or have unfiled returns and need professional help resolving with the IRS.',
  },
  {
    value: 'small_biz_tax',
    label: 'Small Business Tax Help',
    description:
      'Small business owners (LLC, S-Corp, sole prop) who need tax preparation, planning, or IRS issue resolution.',
  },
  {
    value: 'construction_trades',
    label: 'Construction & Trades',
    description:
      'Construction workers, contractors, tradespeople with tax issues — W-2/1099 confusion, unreported income, IRS notices.',
  },
  {
    value: 'real_estate',
    label: 'Real Estate Investors',
    description:
      'Real estate investors, landlords, flippers with tax planning needs, depreciation questions, or IRS issues.',
  },
  {
    value: 'gig_workers',
    label: 'Gig Workers & 1099s',
    description:
      'Rideshare drivers, freelancers, delivery workers who received 1099s and need tax help or owe unexpectedly.',
  },
  {
    value: 'general',
    label: 'General Tax Help',
    description:
      'Broad — anyone with an unresolved tax issue, back taxes, or who needs a tax professional.',
  },
]

const CITIES: Array<{ value: string; label: string }> = [
  { value: 'san_diego', label: 'San Diego, CA' },
  { value: 'los_angeles', label: 'Los Angeles, CA' },
  { value: 'phoenix', label: 'Phoenix, AZ' },
  { value: 'dallas', label: 'Dallas, TX' },
  { value: 'houston', label: 'Houston, TX' },
  { value: 'atlanta', label: 'Atlanta, GA' },
  { value: 'miami', label: 'Miami, FL' },
  { value: 'chicago', label: 'Chicago, IL' },
  { value: 'new_york', label: 'New York, NY' },
  { value: 'national', label: 'National (no city reference)' },
]

function buildSystemPrompt(cityLabel: string, angleLabel: string, angleDescription: string): string {
  return `You are writing 10 Craigslist posts for the "services > financial" or "services > tax services" category. These posts target TAXPAYERS (not tax professionals) in ${cityLabel}.

Angle: ${angleLabel} — ${angleDescription}

Rules:
- Each post has a TITLE (max 70 chars) and BODY (150-250 words)
- Write for people scrolling Craigslist looking for help, not professionals
- No jargon. No acronyms (IRS is fine). No platform names.
- Tone: helpful, direct, trustworthy. Like a neighbor who happens to be a tax expert.
- Each post takes a slightly different angle or hook on the same theme
- Include "Licensed Enrolled Agent" or "licensed tax professional" in every post body
- Include the city name naturally in at least 5 of the 10 posts
- End each post with a clear call to action: "Message me" or "Reply to this post"
- Do NOT include URLs, links, or web addresses (Craigslist prohibits them in some categories)
- Do NOT include phone numbers in the post body
- Do NOT include email addresses — Craigslist provides its own anonymous reply system
- For the Kwong/penalty angle: explain that the IRS may owe them money, don't assume they know what Kwong is
- If the city is "National (no city reference)", do not reference any specific city — write for a general US audience
- Posts should feel like they were written by a real person, not a company

Output format — return ONLY a JSON array, no markdown, no preamble:
[
  { "title": "...", "body": "...", "angle_note": "one line on why this hook" },
  ...
]`
}

function parseJsonArray<T>(raw: string): T[] {
  let s = raw.trim()
  if (s.startsWith('```')) s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  const start = s.indexOf('[')
  const end = s.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('Could not find JSON array in model output')
  return JSON.parse(s.slice(start, end + 1)) as T[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CraigslistPostsTab({ anthropicKey }: { anthropicKey: string }) {
  const [angle, setAngle] = useState<string>('penalty_refund')
  const [city, setCity] = useState<string>('san_diego')
  const [campaignName, setCampaignName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))

  const [posts, setPosts] = useState<CraigslistPost[]>([])
  const [generating, setGenerating] = useState(false)

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const [copiedField, setCopiedField] = useState<string | null>(null)
  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField((prev) => (prev === field ? null : prev)), 2000)
    } catch {
      showToast('error', 'Clipboard write failed')
    }
  }

  const handleGenerate = async () => {
    if (!anthropicKey) {
      showToast('error', 'Anthropic API key is required. Open the parent "API Keys" panel to add it.')
      return
    }
    const angleDef = ANGLES.find((a) => a.value === angle)!
    const cityDef = CITIES.find((c) => c.value === city)!
    setGenerating(true)
    try {
      const system = buildSystemPrompt(cityDef.label, angleDef.label, angleDef.description)
      const user = `Generate 10 Craigslist posts now. Angle: ${angleDef.label}. City: ${cityDef.label}. Return only the JSON array.`
      const res = await fetch(ANTHROPIC_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 6000,
          system,
          messages: [{ role: 'user', content: user }],
        }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Anthropic ${res.status}: ${errText.slice(0, 300)}`)
      }
      const data = await res.json()
      const text = data?.content?.[0]?.text
      if (typeof text !== 'string') throw new Error('Unexpected Anthropic response shape')
      const parsed = parseJsonArray<CraigslistPost>(text)
      setPosts(parsed)
      showToast('success', `Generated ${parsed.length} Craigslist posts`)
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to generate posts')
    } finally {
      setGenerating(false)
    }
  }

  const angleLabel = ANGLES.find((a) => a.value === angle)?.label ?? ''
  const cityLabel = CITIES.find((c) => c.value === city)?.label ?? ''

  return (
    <div className={styles.container}>
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.text}
        </div>
      )}

      <div className={styles.generatorCard}>
        <div className={styles.generatorTitle}>Generate 10 Craigslist Posts (Taxpayer Acquisition)</div>
        <div className={styles.generatorForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Angle</label>
            <select
              className={styles.formSelect}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            >
              {ANGLES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Target City</label>
            <select
              className={styles.formSelect}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              {CITIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Campaign Name</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="e.g., SD Penalty Refund"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Start Date</label>
            <input
              className={styles.formInput}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <button
            className={styles.generateBtn}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating...' : 'Generate 10 Posts'}
          </button>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          No Craigslist posts yet. Pick an angle and city, then click Generate.
        </div>
      ) : (
        <div className={styles.postList}>
          {posts.map((post, i) => {
            const titleKey = `cl-title-${i}`
            const bodyKey = `cl-body-${i}`
            const bothKey = `cl-both-${i}`
            const both = `${post.title}\n\n${post.body}`
            return (
              <div key={i} className={styles.postCard}>
                <div className={styles.postCardHeader}>
                  <div className={styles.postCardDay}>Post {i + 1}</div>
                  <div className={styles.postCardDate}>
                    {cityLabel} · {angleLabel}
                  </div>
                </div>
                <div className={styles.postCardHeadline}>{post.title}</div>
                <div className={styles.postSection}>
                  <div className={styles.postBody} style={{ whiteSpace: 'pre-wrap' }}>
                    {post.body}
                  </div>
                  {post.angle_note && (
                    <div
                      className={styles.postBody}
                      style={{ opacity: 0.65, fontSize: '0.8rem', marginTop: '0.5rem' }}
                    >
                      {post.angle_note}
                    </div>
                  )}
                </div>
                <div className={styles.postCardActions}>
                  <button
                    className={styles.smallBtn}
                    onClick={() => handleCopy(post.title, titleKey)}
                  >
                    {copiedField === titleKey ? 'Copied' : 'Copy Title'}
                  </button>
                  <button
                    className={styles.smallBtn}
                    onClick={() => handleCopy(post.body, bodyKey)}
                  >
                    {copiedField === bodyKey ? 'Copied' : 'Copy Body'}
                  </button>
                  <button
                    className={styles.smallBtn}
                    onClick={() => handleCopy(both, bothKey)}
                  >
                    {copiedField === bothKey ? 'Copied' : 'Copy Both'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {campaignName && startDate && posts.length > 0 && (
        <div style={{ marginTop: '1rem', opacity: 0.6, fontSize: '0.75rem' }}>
          Campaign: {campaignName} · Starting {startDate}
        </div>
      )}
    </div>
  )
}
