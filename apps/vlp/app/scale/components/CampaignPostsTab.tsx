'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './CampaignPostsTab.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface CampaignPost {
  post_id: string
  day: number
  scheduled_date: string
  theme: string
  headline: string
  linkedin_body: string
  fb_body: string
  canva_direction: string
  status: 'draft' | 'scheduled' | 'posted' | 'skipped'
  linkedin_url: string | null
  fb_url: string | null
  campaign_id: string
  campaign_name: string
  platform: string
  notes: string | null
  created_at: string
}

const API = 'https://api.virtuallaunch.pro'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function CampaignPostsTab() {
  const [posts, setPosts] = useState<CampaignPost[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Generator form
  const [angle, setAngle] = useState('revenue_stream')
  const [campaignName, setCampaignName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  // Load existing campaign posts
  const loadPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/v1/scale/social/posts?limit=200&post_type=campaign`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Failed to load posts')
      const data = await res.json()
      // Filter to campaign posts that have a campaign_id
      const campaignPosts = (data.posts || []).filter((p: CampaignPost) => p.campaign_id || p.theme)
      setPosts(campaignPosts)
    } catch {
      // Non-critical — show empty state
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  // Generate campaign
  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const res = await fetch(`${API}/v1/scale/campaigns/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: 'ttmp',
          campaign_name: campaignName || `${angle === 'tax_day' ? 'Tax Day' : 'Revenue Stream'} Campaign`,
          start_date: startDate,
          num_days: 10,
          angle,
        }),
      })
      if (!res.ok) throw new Error('Failed to generate campaign')
      const data = await res.json()
      if (data.ok && data.posts) {
        setPosts(data.posts)
        showToast('success', `Generated ${data.posts.length} posts for "${data.campaign_name}"`)
      }
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to generate campaign')
    } finally {
      setGenerating(false)
    }
  }

  // Update a post
  const patchPost = async (postId: string, updates: Partial<CampaignPost>) => {
    try {
      const res = await fetch(`${API}/v1/scale/social/posts/${postId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) throw new Error('Failed to update')
      setPosts((prev) =>
        prev.map((p) => (p.post_id === postId ? { ...p, ...updates } : p))
      )
    } catch {
      showToast('error', 'Failed to update post')
    }
  }

  return (
    <div className={styles.container}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.text}
        </div>
      )}

      {/* Campaign Generator */}
      <div className={styles.generatorCard}>
        <div className={styles.generatorTitle}>Generate 10-Day Campaign</div>
        <div className={styles.generatorForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Angle</label>
            <select
              className={styles.formSelect}
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            >
              <option value="revenue_stream">Revenue Stream</option>
              <option value="tax_day">Tax Day</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Campaign Name</label>
            <input
              className={styles.formInput}
              type="text"
              placeholder="e.g., Tax Day Revenue Stream"
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

      {/* Post Schedule */}
      {loading ? (
        <div className={styles.emptyState}>Loading campaign posts...</div>
      ) : posts.length === 0 ? (
        <div className={styles.emptyState}>No campaign posts yet. Generate a campaign above to get started.</div>
      ) : (
        <div className={styles.postList}>
          {posts
            .sort((a, b) => (a.day || 0) - (b.day || 0) || (a.scheduled_date || '').localeCompare(b.scheduled_date || ''))
            .map((post) => (
              <PostCard key={post.post_id} post={post} onPatch={patchPost} showToast={showToast} />
            ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Post Card
// ---------------------------------------------------------------------------
function PostCard({
  post,
  onPatch,
  showToast,
}: {
  post: CampaignPost
  onPatch: (id: string, updates: Partial<CampaignPost>) => Promise<void>
  showToast: (type: 'success' | 'error', text: string) => void
}) {
  const [expandLinkedin, setExpandLinkedin] = useState(false)
  const [expandFb, setExpandFb] = useState(false)
  const [expandCanva, setExpandCanva] = useState(false)
  const [editingLinkedin, setEditingLinkedin] = useState(false)
  const [editingFb, setEditingFb] = useState(false)
  const [linkedinBody, setLinkedinBody] = useState(post.linkedin_body)
  const [fbBody, setFbBody] = useState(post.fb_body)
  const [linkedinUrl, setLinkedinUrl] = useState(post.linkedin_url || '')
  const [fbUrl, setFbUrl] = useState(post.fb_url || '')
  const [notes, setNotes] = useState(post.notes || '')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const handleCopy = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField((prev) => (prev === field ? null : prev)), 2000)
  }

  const statusColor: Record<string, string> = {
    draft: styles.statusDraft,
    scheduled: styles.statusScheduled,
    posted: styles.statusPosted,
    skipped: styles.statusSkipped,
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={`${styles.postCard} ${post.status === 'skipped' ? styles.postCardDimmed : ''}`}>
      {/* Header */}
      <div className={styles.postCardHeader}>
        <div className={styles.postCardDay}>Day {post.day}</div>
        <div className={styles.postCardDate}>{formatDate(post.scheduled_date)}</div>
        <span className={`${styles.postCardStatus} ${statusColor[post.status] || ''}`}>
          {post.status.toUpperCase()}
        </span>
      </div>

      {/* Headline */}
      <div className={styles.postCardHeadline}>{post.headline}</div>

      {/* LinkedIn section */}
      <div className={styles.postSection}>
        <div className={styles.postSectionHeader}>
          <span className={styles.postSectionLabel}>LinkedIn</span>
          <div className={styles.postSectionActions}>
            <button
              className={styles.smallBtn}
              onClick={() => handleCopy(post.linkedin_body, `li-${post.post_id}`)}
            >
              {copiedField === `li-${post.post_id}` ? 'Copied' : 'Copy'}
            </button>
            <button
              className={styles.smallBtn}
              onClick={() => {
                if (editingLinkedin) {
                  onPatch(post.post_id, { linkedin_body: linkedinBody })
                  setEditingLinkedin(false)
                } else {
                  setEditingLinkedin(true)
                  setExpandLinkedin(true)
                }
              }}
            >
              {editingLinkedin ? 'Save' : 'Edit'}
            </button>
            <button className={styles.smallBtn} onClick={() => setExpandLinkedin(!expandLinkedin)}>
              {expandLinkedin ? 'Collapse' : 'Expand'}
            </button>
            {post.linkedin_url && <span className={styles.postedCheck}>Posted</span>}
          </div>
        </div>
        {expandLinkedin && (
          editingLinkedin ? (
            <textarea
              className={styles.postBodyTextarea}
              value={linkedinBody}
              onChange={(e) => setLinkedinBody(e.target.value)}
              rows={8}
            />
          ) : (
            <div className={styles.postBody}>{post.linkedin_body}</div>
          )
        )}
        <div className={styles.urlRow}>
          <span className={styles.urlLabel}>URL:</span>
          <input
            className={styles.urlInput}
            type="url"
            placeholder="Paste LinkedIn post URL after posting..."
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            onBlur={() => {
              if (linkedinUrl !== (post.linkedin_url || '')) {
                onPatch(post.post_id, { linkedin_url: linkedinUrl || null })
              }
            }}
          />
        </div>
      </div>

      {/* Facebook section */}
      <div className={styles.postSection}>
        <div className={styles.postSectionHeader}>
          <span className={styles.postSectionLabel}>Facebook</span>
          <div className={styles.postSectionActions}>
            <button
              className={styles.smallBtn}
              onClick={() => handleCopy(post.fb_body, `fb-${post.post_id}`)}
            >
              {copiedField === `fb-${post.post_id}` ? 'Copied' : 'Copy'}
            </button>
            <button
              className={styles.smallBtn}
              onClick={() => {
                if (editingFb) {
                  onPatch(post.post_id, { fb_body: fbBody })
                  setEditingFb(false)
                } else {
                  setEditingFb(true)
                  setExpandFb(true)
                }
              }}
            >
              {editingFb ? 'Save' : 'Edit'}
            </button>
            <button className={styles.smallBtn} onClick={() => setExpandFb(!expandFb)}>
              {expandFb ? 'Collapse' : 'Expand'}
            </button>
            {post.fb_url && <span className={styles.postedCheck}>Posted</span>}
          </div>
        </div>
        {expandFb && (
          editingFb ? (
            <textarea
              className={styles.postBodyTextarea}
              value={fbBody}
              onChange={(e) => setFbBody(e.target.value)}
              rows={6}
            />
          ) : (
            <div className={styles.postBody}>{post.fb_body}</div>
          )
        )}
        <div className={styles.urlRow}>
          <span className={styles.urlLabel}>URL:</span>
          <input
            className={styles.urlInput}
            type="url"
            placeholder="Paste Facebook post URL after posting..."
            value={fbUrl}
            onChange={(e) => setFbUrl(e.target.value)}
            onBlur={() => {
              if (fbUrl !== (post.fb_url || '')) {
                onPatch(post.post_id, { fb_url: fbUrl || null })
              }
            }}
          />
        </div>
      </div>

      {/* Canva direction */}
      <div className={styles.postSection}>
        <div className={styles.postSectionHeader}>
          <span className={styles.postSectionLabel}>Canva Direction</span>
          <button className={styles.smallBtn} onClick={() => setExpandCanva(!expandCanva)}>
            {expandCanva ? 'Collapse' : 'Expand'}
          </button>
        </div>
        {expandCanva && <div className={styles.postBody}>{post.canva_direction}</div>}
      </div>

      {/* Notes */}
      <div className={styles.notesRow}>
        <input
          className={styles.notesInput}
          type="text"
          placeholder="Notes (engagement, comments received...)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (post.notes || '')) {
              onPatch(post.post_id, { notes })
            }
          }}
        />
      </div>

      {/* Action buttons */}
      <div className={styles.postCardActions}>
        <button
          className={styles.smallBtn}
          onClick={() => {
            const newDate = prompt('New date (YYYY-MM-DD):', post.scheduled_date)
            if (newDate && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
              onPatch(post.post_id, { scheduled_date: newDate })
            }
          }}
        >
          Edit Date
        </button>
        {post.status !== 'posted' && (
          <button
            className={`${styles.smallBtn} ${styles.smallBtnGreen}`}
            onClick={() => onPatch(post.post_id, { status: 'posted' })}
          >
            Mark Posted
          </button>
        )}
        {post.status === 'draft' && (
          <button
            className={`${styles.smallBtn} ${styles.smallBtnBlue}`}
            onClick={() => onPatch(post.post_id, { status: 'scheduled' })}
          >
            Mark Scheduled
          </button>
        )}
        {post.status !== 'skipped' && (
          <button
            className={`${styles.smallBtn} ${styles.smallBtnMuted}`}
            onClick={() => onPatch(post.post_id, { status: 'skipped' })}
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
