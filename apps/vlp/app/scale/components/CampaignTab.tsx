'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import CampaignPostsTab from './CampaignPostsTab'
import CraigslistPostsTab from './CraigslistPostsTab'
import styles from './CampaignTab.module.css'

// ---------------------------------------------------------------------------
// Constants — WLVLP ClickUp custom field IDs (list 901712958064)
// ---------------------------------------------------------------------------
const WLVLP_LIST_ID = '901712958064'

const CUSTOM_FIELD_POST_DATE = '6ce24c8b-5a5c-444b-a9ad-fb842cd30de2'
const CUSTOM_FIELD_PROMOTED_SITE = '360547e5-3869-4af3-b4cf-0e38cf66b99a'
const CUSTOM_FIELD_MEDIA_TYPE = 'eb12d8a5-f4bc-490e-b864-138fe0c77dda'
const CUSTOM_FIELD_POST_SCHEDULED = '138ce832-e678-4979-9bbf-5da997e7813f'

const YT_CATEGORIES = [
  'First Impressions',
  'CTA & Conversion',
  'Trust & Social Proof',
  'SEO & Performance',
  'Mobile & UX',
  'Templates & Tools',
  'Strategy & Mindset',
] as const

const PLATFORMS = [
  { value: 'wlvlp', label: 'WLVLP — Website Lotto' },
  { value: 'vlp', label: 'VLP — Virtual Launch Pro' },
  { value: 'tmp', label: 'TMP — Tax Monitor Pro' },
  { value: 'ttmp', label: 'TTMP — Transcript Tax Monitor' },
  { value: 'tttmp', label: 'TTTMP — Tax Tools' },
  { value: 'dvlp', label: 'DVLP — Developers' },
  { value: 'gvlp', label: 'GVLP — Games' },
  { value: 'tcvlp', label: 'TCVLP — Tax Claim' },
]

const ANTHROPIC_MODEL = 'claude-sonnet-4-20250514'
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

// ---------------------------------------------------------------------------
// Mode selector
// ---------------------------------------------------------------------------
type Mode = 'youtube' | 'community' | 'campaign' | 'craigslist_taxpayer'

export default function CampaignTab() {
  const [mode, setMode] = useState<Mode>('youtube')
  const [showKeys, setShowKeys] = useState(false)
  const [anthropicKey, setAnthropicKey] = useState('')
  const [clickupToken, setClickupToken] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    setAnthropicKey(localStorage.getItem('scale_anthropic_key') || '')
    setClickupToken(localStorage.getItem('scale_clickup_token') || '')
  }, [])

  const onKeyChange = (kind: 'anthropic' | 'clickup', value: string) => {
    if (kind === 'anthropic') {
      setAnthropicKey(value)
      localStorage.setItem('scale_anthropic_key', value)
    } else {
      setClickupToken(value)
      localStorage.setItem('scale_clickup_token', value)
    }
  }

  return (
    <div>
      <div className={styles.modeBar}>
        <div className={styles.modeGroup}>
          <label className={styles.modeLabel}>Content Type</label>
          <select
            className={styles.modeSelect}
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
          >
            <option value="youtube">YouTube Videos</option>
            <option value="community">Community Posts</option>
            <option value="campaign">Campaign Posts (LinkedIn + FB)</option>
            <option value="craigslist_taxpayer">Craigslist Posts (Taxpayer Acq.)</option>
          </select>
        </div>

        <button
          type="button"
          className={styles.keyToggle}
          onClick={() => setShowKeys((v) => !v)}
        >
          {showKeys ? 'Hide API Keys' : 'API Keys'}
        </button>

        {showKeys && (
          <div className={styles.keyPanel}>
            <div className={styles.keyField}>
              <label className={styles.modeLabel}>Anthropic API Key</label>
              <input
                className={styles.keyInput}
                type="password"
                placeholder="sk-ant-..."
                value={anthropicKey}
                onChange={(e) => onKeyChange('anthropic', e.target.value)}
                autoComplete="off"
              />
              <span className={styles.keyHint}>Stored locally in this browser only.</span>
            </div>
            <div className={styles.keyField}>
              <label className={styles.modeLabel}>ClickUp Personal Token</label>
              <input
                className={styles.keyInput}
                type="password"
                placeholder="pk_..."
                value={clickupToken}
                onChange={(e) => onKeyChange('clickup', e.target.value)}
                autoComplete="off"
              />
              <span className={styles.keyHint}>Required only for YouTube task creation.</span>
            </div>
          </div>
        )}
      </div>

      {mode === 'youtube' && (
        <YouTubePanel anthropicKey={anthropicKey} clickupToken={clickupToken} />
      )}
      {mode === 'community' && <CommunityPanel anthropicKey={anthropicKey} />}
      {mode === 'campaign' && <CampaignPostsTab />}
      {mode === 'craigslist_taxpayer' && <CraigslistPostsTab />}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Anthropic helper
// ---------------------------------------------------------------------------
async function callAnthropic(opts: {
  apiKey: string
  system: string
  user: string
  maxTokens?: number
}): Promise<string> {
  if (!opts.apiKey) throw new Error('Anthropic API key is required. Click "API Keys" to add it.')

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': opts.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: opts.maxTokens ?? 4000,
      system: opts.system,
      messages: [{ role: 'user', content: opts.user }],
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 300)}`)
  }

  const data = await res.json()
  const text = data?.content?.[0]?.text
  if (typeof text !== 'string') throw new Error('Unexpected Anthropic response shape')
  return text
}

function parseJsonArray<T>(raw: string): T[] {
  let s = raw.trim()
  if (s.startsWith('```')) s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
  const start = s.indexOf('[')
  const end = s.lastIndexOf(']')
  if (start === -1 || end === -1) throw new Error('Could not find JSON array in model output')
  return JSON.parse(s.slice(start, end + 1)) as T[]
}

function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(Date.UTC(y, (m || 1) - 1, d || 1))
  dt.setUTCDate(dt.getUTCDate() + days)
  return dt.toISOString().slice(0, 10)
}

// ---------------------------------------------------------------------------
// YouTube Videos panel
// ---------------------------------------------------------------------------
interface YTScript {
  number: number
  title: string
  script: string
  category: string
  ytNumber?: number
  clickupTaskId?: string
}

const YT_SYSTEM_PROMPT = `You are Xavier, an African American young male YouTube host. You are expressive, confident, slightly intense in the opening, then settle into a calm teaching tone.

Write YouTube video scripts about website conversion optimization for the Website Lotto channel. Each script follows this formula:

Hook (1-2 sentences, attention grab)
Problem (2-3 sentences, what's wrong)
Fix (3-5 sentences, what to do instead)
CTA (2 sentences, Website Lotto plug + "link in the description")

Each script should be 150-200 words. Tone: direct, confident, no fluff.
Every script ends with a Website Lotto CTA mentioning "link in the description."

Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`

function YouTubePanel({
  anthropicKey,
  clickupToken,
}: {
  anthropicKey: string
  clickupToken: string
}) {
  const [platform, setPlatform] = useState('wlvlp')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState(5)
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [startNumber, setStartNumber] = useState(1)
  const [scripts, setScripts] = useState<YTScript[]>([])
  const [generating, setGenerating] = useState(false)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setError(null)
    setMessage(null)
    if (!topic.trim()) {
      setError('Enter a topic or title.')
      return
    }
    setGenerating(true)
    try {
      const userMsg = `Generate ${count} video scripts. Topics: ${topic}. Output JSON array: [{ "number": 1, "title": "YT### — Title", "script": "full script text", "category": "one of: ${YT_CATEGORIES.join(', ')}" }]`
      const raw = await callAnthropic({
        apiKey: anthropicKey,
        system: YT_SYSTEM_PROMPT,
        user: userMsg,
        maxTokens: Math.min(8000, 1200 * count),
      })
      const parsed = parseJsonArray<YTScript>(raw)
      const withNumbers = parsed.map((s, i) => ({
        ...s,
        ytNumber: startNumber + i,
      }))
      setScripts(withNumbers)
      setMessage(`Generated ${withNumbers.length} scripts.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }, [anthropicKey, topic, count, startNumber])

  const handleCreateTasks = useCallback(async () => {
    setError(null)
    setMessage(null)
    if (!clickupToken) {
      setError('ClickUp personal token is required. Click "API Keys" to add it.')
      return
    }
    if (scripts.length === 0) return
    setCreating(true)
    let createdCount = 0
    const updated = [...scripts]
    try {
      for (let i = 0; i < updated.length; i++) {
        const s = updated[i]
        if (s.clickupTaskId) continue
        const postDate = addDaysISO(startDate, i)
        const postDateMs = new Date(postDate + 'T09:00:00Z').getTime()
        const pad = String(s.ytNumber ?? startNumber + i).padStart(3, '0')
        const cleanTitle = s.title.replace(/^YT\d+\s*[—–-]\s*/i, '').trim()
        const name = `YT${pad} — ${cleanTitle}`

        const body = {
          name,
          description: s.script,
          status: 'hold',
          custom_fields: [
            { id: CUSTOM_FIELD_POST_DATE, value: postDateMs },
            { id: CUSTOM_FIELD_PROMOTED_SITE, value: platform },
            { id: CUSTOM_FIELD_MEDIA_TYPE, value: 'youtube' },
            { id: CUSTOM_FIELD_POST_SCHEDULED, value: 'no' },
          ],
        }

        const res = await fetch(
          `https://api.clickup.com/api/v2/list/${WLVLP_LIST_ID}/task`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: clickupToken,
            },
            body: JSON.stringify(body),
          }
        )
        if (!res.ok) {
          const errText = await res.text()
          throw new Error(`ClickUp ${res.status} on "${name}": ${errText.slice(0, 200)}`)
        }
        const data = await res.json()
        updated[i] = { ...s, clickupTaskId: data?.id }
        createdCount++
        setScripts([...updated])
      }
      setMessage(`Created ${createdCount} ClickUp task(s) in list ${WLVLP_LIST_ID}.`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Task creation failed')
    } finally {
      setCreating(false)
    }
  }, [clickupToken, scripts, startDate, platform])

  const copyScript = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div>
      <div className={styles.genCard}>
        <div className={styles.genTitle}>YouTube Video Scripts</div>
        <div className={styles.genForm}>
          <div className={styles.field}>
            <label className={styles.label}>Platform</label>
            <select
              className={styles.select}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>Topic / Title</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g., Hero section mistakes that kill conversions"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Count</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              max={30}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(30, Number(e.target.value) || 1)))}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Start Date</label>
            <input
              className={styles.input}
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Start YT #</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              value={startNumber}
              onChange={(e) => setStartNumber(Math.max(1, Number(e.target.value) || 1))}
            />
          </div>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {message && <div className={styles.successMsg}>{message}</div>}

      {scripts.length === 0 ? (
        <div className={styles.emptyState}>
          No scripts yet. Enter a topic and click Generate.
        </div>
      ) : (
        <>
          <div className={styles.resultBar}>
            <div className={styles.resultCount}>
              {scripts.length} script{scripts.length === 1 ? '' : 's'} · starting{' '}
              {startDate}
            </div>
            <div className={styles.resultBarActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleCreateTasks}
                disabled={creating}
              >
                {creating ? 'Creating…' : 'Create ClickUp Tasks'}
              </button>
            </div>
          </div>
          <div className={styles.resultList}>
            {scripts.map((s, i) => {
              const pad = String(s.ytNumber ?? startNumber + i).padStart(3, '0')
              const titleNoPrefix = s.title.replace(/^YT\d+\s*[—–-]\s*/i, '').trim()
              return (
                <div key={i} className={styles.resultCard}>
                  <div className={styles.resultCardHeader}>
                    <div className={styles.resultTitle}>
                      YT{pad} — {titleNoPrefix}
                    </div>
                    <span className={styles.resultCategory}>{s.category}</span>
                  </div>
                  <div className={styles.resultMeta}>
                    <span>Post date: {addDaysISO(startDate, i)}</span>
                    {s.clickupTaskId && <span>ClickUp: {s.clickupTaskId}</span>}
                  </div>
                  <div className={styles.resultBody}>{s.script}</div>
                  <div className={styles.resultActions}>
                    <button
                      type="button"
                      className={styles.miniBtn}
                      onClick={() => copyScript(s.script)}
                    >
                      Copy script
                    </button>
                    {s.clickupTaskId && (
                      <span className={`${styles.miniBtn} ${styles.miniBtnCreated}`}>
                        ✓ Task created
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Community Posts panel
// ---------------------------------------------------------------------------
interface CommunityPost {
  variant: number
  text: string
}

const COMMUNITY_SYSTEM_PROMPT = `You write YouTube Community posts for the Website Lotto channel. Posts are short (2-4 sentences), punchy, and promote a specific video. End with "Link in bio." or "New video explains."

Respond ONLY with valid JSON. No markdown, no backticks, no preamble.`

function CommunityPanel({ anthropicKey }: { anthropicKey: string }) {
  const [platform, setPlatform] = useState('wlvlp')
  const [videoTitle, setVideoTitle] = useState('')
  const [count, setCount] = useState(3)
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleGenerate = useCallback(async () => {
    setError(null)
    setMessage(null)
    if (!videoTitle.trim()) {
      setError('Enter the video title this post promotes.')
      return
    }
    setGenerating(true)
    try {
      const userMsg = `Generate ${count} community post variants for this video: "${videoTitle}". Output JSON array: [{ "variant": 1, "text": "post text" }]`
      const raw = await callAnthropic({
        apiKey: anthropicKey,
        system: COMMUNITY_SYSTEM_PROMPT,
        user: userMsg,
        maxTokens: 1500,
      })
      const parsed = parseJsonArray<CommunityPost>(raw)
      setPosts(parsed)
      setMessage(`Generated ${parsed.length} variant(s).`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
    } finally {
      setGenerating(false)
    }
  }, [anthropicKey, videoTitle, count])

  const combined = useMemo(() => posts.map((p) => p.text).join('\n---\n'), [posts])

  const handleCopyAll = () => {
    if (!combined) return
    navigator.clipboard.writeText(combined).then(
      () => setMessage('Copied all posts to clipboard.'),
      () => setError('Clipboard write failed.')
    )
  }

  const handleCopyOne = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {})
  }

  return (
    <div>
      <div className={styles.genCard}>
        <div className={styles.genTitle}>YouTube Community Posts</div>
        <div className={styles.genForm}>
          <div className={styles.field}>
            <label className={styles.label}>Platform</label>
            <select
              className={styles.select}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className={`${styles.field} ${styles.fieldWide}`}>
            <label className={styles.label}>Video Title</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g., Hero section mistakes that kill conversions"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Count</label>
            <input
              className={styles.input}
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(10, Number(e.target.value) || 1)))}
            />
          </div>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Generating…' : 'Generate'}
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {message && <div className={styles.successMsg}>{message}</div>}

      {posts.length === 0 ? (
        <div className={styles.emptyState}>
          No posts yet. Enter a video title and click Generate.
        </div>
      ) : (
        <>
          <div className={styles.resultBar}>
            <div className={styles.resultCount}>
              {posts.length} variant{posts.length === 1 ? '' : 's'} for: {videoTitle}
              {' · platform '}
              {platform}
            </div>
            <div className={styles.resultBarActions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleCopyAll}
              >
                Copy All
              </button>
            </div>
          </div>
          <div className={styles.resultList}>
            {posts.map((p) => (
              <div key={p.variant} className={styles.resultCard}>
                <div className={styles.resultCardHeader}>
                  <div className={styles.resultTitle}>Variant {p.variant}</div>
                </div>
                <div className={styles.resultBody}>{p.text}</div>
                <div className={styles.resultActions}>
                  <button
                    type="button"
                    className={styles.miniBtn}
                    onClick={() => handleCopyOne(p.text)}
                  >
                    Copy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
