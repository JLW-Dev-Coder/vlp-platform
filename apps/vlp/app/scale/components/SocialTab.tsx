'use client'

import { useCallback, useEffect, useState } from 'react'
import PostsPanel from './PostsPanel'
import styles from '../page.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface SuggestedReply {
  label: string
  text: string
}

interface RedditOpportunity {
  post_id: string
  subreddit: string
  title: string
  selftext: string
  author: string
  url: string
  permalink: string
  created_utc: number
  score: number
  num_comments: number
  matched_keywords: string[]
  matched_codes: string[]
  suggested_replies: SuggestedReply[]
  status: 'new' | 'replied' | 'dismissed'
  discovered_at: string
}

type SocialFilter = '' | 'new' | 'replied' | 'dismissed'

function timeAgo(utcSeconds: number): string {
  const diff = Math.max(0, Math.floor(Date.now() / 1000 - utcSeconds))
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

// Glass card wrappers (match the /scale page style)
function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.glassCard} ${className}`}>{children}</div>
}
function GlassCardTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.glassCardTitle}>{children}</div>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function SocialTab() {
  const [opportunities, setOpportunities] = useState<RedditOpportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<SocialFilter>('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)

  const fetchSocial = useCallback(async () => {
    try {
      const res = await fetch('https://api.virtuallaunch.pro/v1/scale/social/opportunities', {
        credentials: 'include',
      })
      if (!res.ok) return
      const json = await res.json()
      if (json.ok && Array.isArray(json.opportunities)) {
        setOpportunities(json.opportunities)
      }
    } catch {
      /* non-critical */
    }
  }, [])

  useEffect(() => {
    fetchSocial().finally(() => setLoading(false))
  }, [fetchSocial])

  const filtered = filter
    ? opportunities.filter((o) => o.status === filter)
    : opportunities

  const handleCopy = async (postId: string, replyIdx: number, text: string) => {
    await navigator.clipboard.writeText(text)
    const key = `${postId}-${replyIdx}`
    setCopiedId(key)
    setTimeout(() => setCopiedId((prev) => (prev === key ? null : prev)), 2000)
  }

  const handleStatusUpdate = async (postId: string, newStatus: 'replied' | 'dismissed') => {
    try {
      const res = await fetch(`https://api.virtuallaunch.pro/v1/scale/social/opportunities/${postId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) return
      setOpportunities((prev) =>
        prev.map((o) => (o.post_id === postId ? { ...o, status: newStatus } : o))
      )
    } catch {
      /* silent */
    }
  }

  const handleScanNow = async () => {
    setScanning(true)
    try {
      await fetch('https://api.virtuallaunch.pro/v1/scale/social/scan-now', {
        method: 'POST',
        credentials: 'include',
      })
      const res = await fetch('https://api.virtuallaunch.pro/v1/scale/social/opportunities', {
        credentials: 'include',
      })
      if (res.ok) {
        const json = await res.json()
        if (json.ok && Array.isArray(json.opportunities)) {
          setOpportunities(json.opportunities)
        }
      }
    } catch {
      /* silent */
    }
    setScanning(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={styles.skeletonCard}></div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Posts tracker */}
      <GlassCard>
        <GlassCardTitle>Posts</GlassCardTitle>
        <PostsPanel />
      </GlassCard>

      {/* Reddit Opportunities */}
      <GlassCard>
        <GlassCardTitle>Reddit Opportunities</GlassCardTitle>
        <div className="space-y-4">
          {/* Controls row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className={styles.socialFilterBar}>
              {([['', 'All'], ['new', 'New'], ['replied', 'Replied'], ['dismissed', 'Dismissed']] as const).map(
                ([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    className={`${styles.socialFilterBtn} ${filter === val ? styles.socialFilterBtnActive : ''}`}
                    onClick={() => setFilter(val as SocialFilter)}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
            <button
              type="button"
              className={styles.socialScanBtn}
              disabled={scanning}
              onClick={handleScanNow}
            >
              {scanning ? 'Scanning...' : 'Scan Now'}
            </button>
          </div>

          {/* Results count */}
          <div className="text-xs text-slate-500">
            {filtered.length} opportunit{filtered.length === 1 ? 'y' : 'ies'}
            {filter ? ` (${filter})` : ''} from last 7 days
          </div>

          {/* Opportunity cards */}
          {filtered.length === 0 ? (
            <GlassCard>
              <div className={styles.glassCardPlaceholder}>
                <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-2.247m0 0A8.966 8.966 0 013 12c0-1.777.514-3.434 1.4-4.83" />
                </svg>
                <span className={styles.glassCardMuted}>
                  No opportunities found. Hit &quot;Scan Now&quot; to check Reddit, or wait for the next cron run.
                </span>
              </div>
            </GlassCard>
          ) : (
            filtered.map((opp) => (
              <div
                key={opp.post_id}
                className={`${styles.oppCard} ${opp.status === 'dismissed' ? styles.oppCardDimmed : ''}`}
              >
                {/* Meta line */}
                <div className={styles.oppMeta}>
                  <span className={styles.oppSubreddit}>r/{opp.subreddit}</span>
                  <span>{timeAgo(opp.created_utc)}</span>
                  <span>Score: {opp.score}</span>
                  <span>{opp.num_comments} comment{opp.num_comments !== 1 ? 's' : ''}</span>
                  {opp.status !== 'new' && (
                    <span style={{ color: opp.status === 'replied' ? 'rgb(74,222,128)' : 'rgb(148,163,184)' }}>
                      {opp.status}
                    </span>
                  )}
                </div>

                {/* Title */}
                <a
                  href={opp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.oppTitle}
                >
                  {opp.title}
                </a>

                {/* Selftext preview */}
                {opp.selftext && (
                  <div className={styles.oppSelftext}>{opp.selftext.slice(0, 200)}</div>
                )}

                {/* Keyword badges */}
                <div className={styles.oppKeywords}>
                  {opp.matched_keywords.map((kw) => (
                    <span key={kw} className={styles.oppKeywordBadge}>{kw}</span>
                  ))}
                </div>

                {/* Suggested replies */}
                <div className={styles.oppReplies}>
                  <div className={styles.oppRepliesLabel}>Suggested Replies</div>
                  {opp.suggested_replies.map((reply, idx) => {
                    const copyKey = `${opp.post_id}-${idx}`
                    return (
                      <div
                        key={idx}
                        className={styles.oppReplyBox}
                        onClick={() => handleCopy(opp.post_id, idx, reply.text)}
                        title="Click to copy"
                      >
                        <div className={styles.oppReplyLabel}>{reply.label}</div>
                        <div className={styles.oppReplyText}>{reply.text}</div>
                        {copiedId === copyKey && (
                          <span className={styles.oppReplyCopied}>Copied!</span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Action buttons */}
                <div className={styles.oppActions}>
                  <a
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.oppActionBtn}
                  >
                    Open on Reddit
                  </a>
                  {opp.status !== 'replied' && (
                    <button
                      type="button"
                      className={`${styles.oppActionBtn} ${styles.oppActionBtnGreen}`}
                      onClick={() => handleStatusUpdate(opp.post_id, 'replied')}
                    >
                      Mark Done
                    </button>
                  )}
                  {opp.status !== 'dismissed' && (
                    <button
                      type="button"
                      className={`${styles.oppActionBtn} ${styles.oppActionBtnRed}`}
                      onClick={() => handleStatusUpdate(opp.post_id, 'dismissed')}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  )
}
