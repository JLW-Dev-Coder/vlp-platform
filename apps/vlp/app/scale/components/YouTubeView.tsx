'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'

interface YouTubeChannel {
  id: string
  title: string
  handle: string
  description: string
  published_at: string | null
  thumbnail_url: string
  subscriber_count: number | null
  subscriber_hidden?: boolean
  view_count: number
  video_count: number
}

interface YouTubeVideo {
  id: string
  title: string
  published_at: string | null
  thumbnail_url: string
  duration_seconds: number
  duration_display: string
  is_short: boolean
  view_count: number
  like_count: number
  comment_count: number
  youtube_url: string
}

interface YouTubeDerived {
  avg_views_per_video: number
  recent_avg_views: number
  engagement_rate_pct: number
  publishing_cadence_days: number
  publishing_cadence_text: string
  short_count: number
  longform_count: number
  short_ratio_pct: number
  longform_ratio_pct: number
  top_recent_video_id: string | null
  top_recent_video_title: string | null
  top_recent_video_views: number
}

interface YouTubeCache {
  cached_at: string
  fresh: boolean
  ttl_seconds: number
  stale_reason?: string
}

interface YouTubePayload {
  channel: YouTubeChannel
  videos: YouTubeVideo[]
  derived: YouTubeDerived
  cache: YouTubeCache
}

interface YouTubeError {
  error: string
  upstream_status?: number
}

function fmtNumber(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString()
}

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return ''
  const then = Date.parse(iso)
  if (!isFinite(then)) return ''
  const diff = Math.max(0, Date.now() - then)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} hour${h === 1 ? '' : 's'} ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d} day${d === 1 ? '' : 's'} ago`
  const w = Math.floor(d / 7)
  if (w < 5) return `${w} week${w === 1 ? '' : 's'} ago`
  const mo = Math.floor(d / 30)
  if (mo < 12) return `${mo} month${mo === 1 ? '' : 's'} ago`
  const y = Math.floor(d / 365)
  return `${y} year${y === 1 ? '' : 's'} ago`
}

function formatJoinedMonth(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `Joined ${d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}`
}

function errorMessage(code: string): string {
  if (code === 'youtube_api_not_configured') {
    return 'Admin setup incomplete — YouTube API key not configured in Worker.'
  }
  if (code === 'youtube_channel_not_found') {
    return 'Configured YouTube channel not found.'
  }
  return 'YouTube API is temporarily unavailable. Try again in a minute.'
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums text-white">{value}</div>
    </div>
  )
}

function Skeleton() {
  return (
    <div className="space-y-6">
      <div className="h-20 animate-pulse rounded-xl bg-white/5" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
      <div className="h-40 animate-pulse rounded-xl bg-white/5" />
      <div className="h-64 animate-pulse rounded-xl bg-white/5" />
    </div>
  )
}

export default function YouTubeView() {
  const [data, setData] = useState<YouTubePayload | null>(null)
  const [err, setErr] = useState<{ code: string; upstream?: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  async function load() {
    try {
      const res = await fetch(
        'https://api.virtuallaunch.pro/v1/scale/youtube-analytics',
        { credentials: 'include', cache: 'no-store' },
      )
      const body: YouTubePayload | YouTubeError = await res.json()
      if ((body as YouTubeError).error) {
        const e = body as YouTubeError
        setErr({ code: e.error, upstream: e.upstream_status })
        setData(null)
      } else {
        setData(body as YouTubePayload)
        setErr(null)
      }
    } catch {
      setErr({ code: 'youtube_api_upstream_error' })
    }
  }

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  async function handleRefresh() {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  if (loading) return <Skeleton />

  if (err) {
    return (
      <Card>
        <div className="p-6 text-center">
          <div className="text-sm text-slate-300">{errorMessage(err.code)}</div>
          <div className="mt-1 text-xs text-slate-500">
            code: {err.code}{err.upstream ? ` · upstream ${err.upstream}` : ''}
          </div>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/[0.08]"
          >
            {refreshing ? 'Retrying…' : 'Retry'}
          </button>
        </div>
      </Card>
    )
  }

  if (!data) return null

  const { channel, videos, derived, cache } = data
  const visibleVideos = expanded ? videos : videos.slice(0, 5)
  const subsLabel =
    channel.subscriber_hidden || channel.subscriber_count === null
      ? 'Hidden'
      : fmtNumber(channel.subscriber_count)

  return (
    <div className="space-y-6">
      {!cache.fresh && cache.stale_reason && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200">
          Showing cached data from {relativeTime(cache.cached_at)} ({new Date(cache.cached_at).toLocaleString()}) — upstream: {cache.stale_reason}
        </div>
      )}

      {/* Channel header */}
      <Card>
        <div className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <ChannelAvatar src={channel.thumbnail_url} title={channel.title} />
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white">{channel.title}</div>
              <div className="text-xs text-slate-400">
                {channel.handle} · {formatJoinedMonth(channel.published_at)}
              </div>
            </div>
          </div>
          <a
            href={`https://www.youtube.com/channel/${channel.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs font-semibold text-orange-400 hover:text-orange-300"
          >
            View channel ↗
          </a>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Subscribers" value={subsLabel} />
        <StatCard label="Total views" value={fmtNumber(channel.view_count)} />
        <StatCard label="Videos" value={fmtNumber(channel.video_count)} />
        <StatCard label="Avg views/video" value={fmtNumber(derived.avg_views_per_video)} />
      </div>

      {/* Derived insights */}
      <Card>
        <div className="p-4">
          <div className="mb-3 text-sm font-semibold text-white">Derived insights</div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Insight
              label="Publishing cadence"
              value={derived.publishing_cadence_text}
            />
            <Insight
              label="Engagement rate"
              value={`${derived.engagement_rate_pct}%`}
              hint="(likes + comments / views)"
            />
            <Insight
              label="Content mix"
              value={`${derived.longform_ratio_pct}% long-form · ${derived.short_ratio_pct}% Shorts`}
            />
            <Insight
              label="Top recent video"
              value={derived.top_recent_video_title || '—'}
              hint={
                derived.top_recent_video_views > 0
                  ? `— ${derived.top_recent_video_views.toLocaleString()} views`
                  : undefined
              }
            />
          </div>
        </div>
      </Card>

      {/* Recent videos */}
      <Card>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Recent videos</div>
            <div className="text-xs text-slate-400">
              Showing {visibleVideos.length} of {videos.length}
            </div>
          </div>
          <ul className="divide-y divide-white/5">
            {visibleVideos.map((v) => (
              <li key={v.id}>
                <a
                  href={v.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 hover:bg-white/[0.03]"
                >
                  <div className="relative h-[45px] w-[80px] shrink-0 overflow-hidden rounded bg-black/40">
                    {v.thumbnail_url ? (
                      <img src={v.thumbnail_url} alt="" className="h-full w-full object-cover" />
                    ) : null}
                    {v.is_short && (
                      <span className="absolute right-1 top-1 rounded bg-red-600 px-1 py-[1px] text-[9px] font-bold uppercase text-white">
                        Short
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-white">{v.title}</div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {relativeTime(v.published_at)} · {v.duration_display}
                    </div>
                  </div>
                  <div className="shrink-0 text-right tabular-nums">
                    <div className="text-xs font-semibold text-white">
                      {v.view_count.toLocaleString()} views
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {v.like_count.toLocaleString()} likes · {v.comment_count.toLocaleString()} comments
                    </div>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {!expanded && videos.length > 5 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-white hover:bg-white/[0.08]"
            >
              View all {videos.length}
            </button>
          )}
        </div>
      </Card>

      {/* Footer row */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Last refreshed {relativeTime(cache.cached_at)} · Cached {cache.ttl_seconds}s
        </div>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={refreshing}
          className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-semibold text-white hover:bg-white/[0.08]"
        >
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Not-available notice */}
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs text-amber-200/90">
        <strong className="font-semibold">Not available via public API:</strong>{' '}
        watch time · audience retention · traffic sources · CTR · demographics · revenue ·
        community posts · subscriber history. These require OAuth, which is planned for a
        follow-up release.
      </div>
    </div>
  )
}

function Insight({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
      {hint && <div className="mt-0.5 text-[11px] text-slate-500">{hint}</div>}
    </div>
  )
}

function ChannelAvatar({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false)
  const initials = title
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'TT'
  if (!src || failed) {
    return (
      <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-sm font-bold text-slate-900">
        {initials}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt=""
      onError={() => setFailed(true)}
      className="h-[52px] w-[52px] shrink-0 rounded-full object-cover"
    />
  )
}
