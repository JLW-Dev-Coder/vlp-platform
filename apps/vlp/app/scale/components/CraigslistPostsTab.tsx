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

interface ClickupMeta {
  campaign_task_id: string | null
  campaign_task_url: string | null
  doc_page_url: string | null
  doc_page_id: string | null
  post_task_ids: string[]
  post_count: number
  errors?: Array<Record<string, unknown>>
}

const API = 'https://api.virtuallaunch.pro'

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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CraigslistPostsTab() {
  const [angle, setAngle] = useState<string>('penalty_refund')
  const [city, setCity] = useState<string>('san_diego')
  const [campaignName, setCampaignName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))

  const [posts, setPosts] = useState<CraigslistPost[]>([])
  const [clickup, setClickup] = useState<ClickupMeta | null>(null)
  const [generating, setGenerating] = useState(false)

  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 4000)
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
    const angleDef = ANGLES.find((a) => a.value === angle)!
    const cityDef = CITIES.find((c) => c.value === city)!
    setGenerating(true)
    try {
      const res = await fetch(`${API}/v1/scale/campaigns/craigslist/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          angle,
          angle_label: angleDef.label,
          angle_description: angleDef.description,
          city,
          city_label: cityDef.label,
          campaign_name: campaignName || `${angleDef.label} — ${cityDef.label}`,
          start_date: startDate,
        }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`Worker ${res.status}: ${errText.slice(0, 300)}`)
      }
      const data = await res.json()
      if (!data.ok || !Array.isArray(data.posts)) {
        throw new Error('Unexpected response shape')
      }
      setPosts(data.posts)
      setClickup(data.clickup || null)
      const cuErrors = data.clickup?.errors?.length || 0
      if (cuErrors > 0) {
        showToast('success', `Generated ${data.posts.length} posts · ClickUp sync had ${cuErrors} issue(s)`)
      } else {
        showToast('success', `Generated ${data.posts.length} posts · ClickUp campaign created`)
      }
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

      {clickup && (clickup.campaign_task_url || clickup.doc_page_url) && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            background: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.3)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center',
            fontSize: '0.875rem',
          }}
        >
          <span>✓ Campaign created in ClickUp — {clickup.post_count} posts queued</span>
          {clickup.campaign_task_url && (
            <a
              href={clickup.campaign_task_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#22c55e', fontWeight: 600 }}
            >
              View Campaign Task ↗
            </a>
          )}
          {clickup.doc_page_url && (
            <a
              href={clickup.doc_page_url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#22c55e', fontWeight: 600 }}
            >
              View Campaign Doc ↗
            </a>
          )}
          {clickup.errors && clickup.errors.length > 0 && (
            <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>
              ({clickup.errors.length} ClickUp sync issue(s))
            </span>
          )}
        </div>
      )}

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
