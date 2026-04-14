'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './PostsPanel.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SocialPost {
  post_id: string
  platform: string
  url: string
  campaign_day: number | null
  campaign_name: string | null
  post_type: string
  content_preview: string | null
  notes: string | null
  likes: number
  comments: number
  shares: number
  clicks: number
  created_at: string
}

type Platform = 'linkedin' | 'facebook' | 'reddit' | 'youtube' | 'twitter'

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'twitter', label: 'Twitter' },
]

const PLATFORM_CLASS: Record<string, string> = {
  linkedin: styles.platformLinkedin,
  facebook: styles.platformFacebook,
  reddit: styles.platformReddit,
  youtube: styles.platformYoutube,
  twitter: styles.platformTwitter,
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
const API = 'https://api.virtuallaunch.pro'
const PAGE_SIZE = 20

async function fetchPosts(params: {
  platform?: string
  campaign_name?: string
  limit?: number
  offset?: number
}): Promise<{ ok: boolean; posts: SocialPost[]; total: number }> {
  const qs = new URLSearchParams()
  if (params.platform) qs.set('platform', params.platform)
  if (params.campaign_name) qs.set('campaign_name', params.campaign_name)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))

  const res = await fetch(`${API}/v1/scale/social/posts?${qs.toString()}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load posts')
  return res.json()
}

async function createPost(body: {
  platform: string
  url: string
  campaign_day?: number
  campaign_name?: string
  content_preview?: string
}): Promise<{ ok: boolean; post_id: string }> {
  const res = await fetch(`${API}/v1/scale/social/posts`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.message || err.error || 'Failed to create post')
  }
  return res.json()
}

async function patchPost(
  id: string,
  body: { notes?: string; engagement?: { likes?: number; comments?: number; shares?: number; clicks?: number } },
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/v1/scale/social/posts/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update post')
  return res.json()
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PostsPanel() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Quick-add form state
  const [formPlatform, setFormPlatform] = useState<Platform>('linkedin')
  const [formUrl, setFormUrl] = useState('')
  const [formDay, setFormDay] = useState('')
  const [formCampaign, setFormCampaign] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>()

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  // Load posts
  const loadPosts = useCallback(async (append = false, offset = 0) => {
    try {
      const data = await fetchPosts({ limit: PAGE_SIZE, offset })
      if (append) {
        setPosts((prev) => [...prev, ...data.posts])
      } else {
        setPosts(data.posts)
      }
      setTotal(data.total)
    } catch {
      showToast('error', 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { loadPosts() }, [loadPosts])

  // Submit new post
  const handleSubmit = async () => {
    if (!formUrl.trim()) return
    setSubmitting(true)
    try {
      await createPost({
        platform: formPlatform,
        url: formUrl.trim(),
        campaign_day: formDay ? parseInt(formDay, 10) : undefined,
        campaign_name: formCampaign.trim() || undefined,
      })
      setFormUrl('')
      setFormDay('')
      showToast('success', 'Post logged')
      await loadPosts()
    } catch (e) {
      showToast('error', e instanceof Error ? e.message : 'Failed to log post')
    } finally {
      setSubmitting(false)
    }
  }

  // Inline notes save
  const handleNotesBlur = async (postId: string, notes: string) => {
    try {
      await patchPost(postId, { notes })
    } catch {
      showToast('error', 'Failed to save notes')
    }
  }

  // Stats
  const stats = useMemo(() => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString()
    const thisWeek = posts.filter((p) => p.created_at >= weekAgo).length
    const byPlatform: Record<string, number> = {}
    for (const p of posts) {
      byPlatform[p.platform] = (byPlatform[p.platform] || 0) + 1
    }
    return { total, thisWeek, byPlatform }
  }, [posts, total])

  // Date formatting
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={styles.postsPanel}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.text}
        </div>
      )}

      {/* Quick-add form */}
      <div className={styles.addForm}>
        <select
          className={styles.formSelect}
          value={formPlatform}
          onChange={(e) => setFormPlatform(e.target.value as Platform)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>

        <input
          className={styles.formInput}
          type="url"
          placeholder="https://linkedin.com/posts/..."
          value={formUrl}
          onChange={(e) => setFormUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <input
          className={`${styles.formInput} ${styles.formInputSmall}`}
          type="number"
          placeholder="Day #"
          min={1}
          value={formDay}
          onChange={(e) => setFormDay(e.target.value)}
        />

        <input
          className={`${styles.formInput} ${styles.formInputMedium}`}
          type="text"
          placeholder="Campaign name"
          value={formCampaign}
          onChange={(e) => setFormCampaign(e.target.value)}
        />

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitting || !formUrl.trim()}
        >
          {submitting ? 'Logging...' : 'Log Post'}
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.total}</div>
          <div className={styles.statLabel}>Total Posts</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.thisWeek}</div>
          <div className={styles.statLabel}>This Week</div>
        </div>
        {PLATFORMS.slice(0, 2).map((p) => (
          <div key={p.value} className={styles.statCard}>
            <div className={styles.statValue}>{stats.byPlatform[p.value] || 0}</div>
            <div className={styles.statLabel}>{p.label}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.emptyState}>Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className={styles.emptyState}>No posts logged yet. Use the form above to track your first post.</div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Platform</th>
                  <th>Date</th>
                  <th>Campaign</th>
                  <th>Preview</th>
                  <th>Engagement</th>
                  <th>Link</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <PostRow
                    key={post.post_id}
                    post={post}
                    formatDate={formatDate}
                    onNotesBlur={handleNotesBlur}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {posts.length < total && (
            <button
              className={styles.loadMore}
              onClick={() => loadPosts(true, posts.length)}
            >
              Load more ({total - posts.length} remaining)
            </button>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Post row — extracted to avoid re-rendering whole table on notes change
// ---------------------------------------------------------------------------
function PostRow({
  post,
  formatDate,
  onNotesBlur,
}: {
  post: SocialPost
  formatDate: (iso: string) => string
  onNotesBlur: (id: string, notes: string) => void
}) {
  const [notes, setNotes] = useState(post.notes || '')

  const campaignLabel = post.campaign_day
    ? `Day ${post.campaign_day}${post.campaign_name ? ' — ' + post.campaign_name : ''}`
    : post.campaign_name || '—'

  return (
    <tr>
      <td>
        <span className={`${styles.platformBadge} ${PLATFORM_CLASS[post.platform] || ''}`}>
          {post.platform}
        </span>
      </td>
      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(post.created_at)}</td>
      <td>{campaignLabel}</td>
      <td>
        <div className={styles.previewText}>{post.content_preview || '—'}</div>
      </td>
      <td>
        <div className={styles.engagementCell}>
          <span className={styles.engagementStat}>
            <svg className={styles.engagementIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {post.likes}
          </span>
          <span className={styles.engagementStat}>
            <svg className={styles.engagementIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {post.comments}
          </span>
          <span className={styles.engagementStat}>
            <svg className={styles.engagementIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            {post.shares}
          </span>
        </div>
      </td>
      <td>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.openLink}
        >
          Open
          <svg className={styles.engagementIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </td>
      <td>
        <input
          className={styles.notesInput}
          type="text"
          value={notes}
          placeholder="Add notes..."
          onChange={(e) => setNotes(e.target.value)}
          onBlur={() => {
            if (notes !== (post.notes || '')) {
              onNotesBlur(post.post_id, notes)
            }
          }}
        />
      </td>
    </tr>
  )
}
