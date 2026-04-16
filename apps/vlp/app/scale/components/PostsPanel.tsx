'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from './PostsPanel.module.css'

// ---------------------------------------------------------------------------
// Types — mirrors R2 schema scale/posts/tasks/{task_id}.json
// ---------------------------------------------------------------------------
interface ScalePost {
  task_id: string
  task_name: string
  task_url: string
  post_body?: string
  platform: string | null          // "Facebook" | "LinkedIn" | "Reddit"
  post_type?: string | null        // "Account" | "Group"
  campaign_name: string | null
  campaign_task_id?: string | null
  promoted_site?: string | null
  post_date: string | null         // ISO date
  scheduled?: boolean
  post_link?: string | null
  image_prompt?: string | null
  updated_at?: string
}

const PLATFORM_CLASS: Record<string, string> = {
  linkedin: styles.platformLinkedin,
  facebook: styles.platformFacebook,
  reddit: styles.platformReddit,
}

const API = 'https://api.virtuallaunch.pro'

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function PostsPanel() {
  const [posts, setPosts] = useState<ScalePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API}/v1/scale/posts`, { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const rows = Array.isArray(data?.posts) ? data.posts : Array.isArray(data) ? data : []
      setPosts(rows)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Sort by post_date desc (newest first), nulls last
  const sorted = [...posts].sort((a, b) => {
    if (!a.post_date && !b.post_date) return 0
    if (!a.post_date) return 1
    if (!b.post_date) return -1
    return b.post_date.localeCompare(a.post_date)
  })

  if (loading) {
    return <div className={styles.emptyState}>Loading posts...</div>
  }

  if (error) {
    return <div className={styles.emptyState}>Error: {error}</div>
  }

  if (sorted.length === 0) {
    return (
      <div className={styles.emptyState}>
        No posts synced yet. Posts flow in automatically via ClickUp webhook.
      </div>
    )
  }

  return (
    <div className={styles.postsPanel}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Platform</th>
              <th>Date Posted</th>
              <th>Post Subject</th>
              <th>Campaign</th>
              <th>Link</th>
              <th>ClickUp Task Link</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((post) => {
              const platformKey = (post.platform || '').toLowerCase()
              return (
                <tr key={post.task_id}>
                  <td>
                    <span className={`${styles.platformBadge} ${PLATFORM_CLASS[platformKey] || ''}`}>
                      {post.platform || '—'}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDate(post.post_date)}</td>
                  <td>
                    <div className={styles.previewText}>{post.task_name || '—'}</div>
                  </td>
                  <td>{post.campaign_name || '—'}</td>
                  <td>
                    {post.post_link ? (
                      <a
                        href={post.post_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.openLink}
                      >
                        Open
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>—</span>
                    )}
                  </td>
                  <td>
                    {post.task_url ? (
                      <a
                        href={post.task_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.openLink}
                      >
                        Task
                      </a>
                    ) : (
                      <span style={{ color: 'rgba(148, 163, 184, 0.6)' }}>—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
