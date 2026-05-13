'use client'

import { useEffect, useState } from 'react'
import styles from '../page.module.css'

// ---------------------------------------------------------------------------
// Types — matches GET /v1/analytics/posthog/repo/:zone
// ---------------------------------------------------------------------------
interface PageviewRow {
  path: string
  count: number
}

interface FunnelData {
  pageview: number
  sign_up: number
  purchase: number
}

interface PostHogZoneData {
  ok: boolean
  zone: string
  days: number
  collecting: boolean
  days_until_ready?: number
  pageviews_by_path: PageviewRow[]
  signups: number
  purchases: number
  revenue_cents: number
  funnel: FunnelData
  error?: string
}

const API_BASE = 'https://api.virtuallaunch.pro'

// The Worker endpoint validates against CF_ZONE_MAP, so the param is a platform
// abbreviation. Pick one representative per unique Cloudflare zone:
//   - vlp   → virtuallaunch.pro zone (also covers dvlp/gvlp/tcvlp/wlvlp)
//   - tmp   → taxmonitor.pro zone (also covers ttmp/tttmp)
const ZONES: { key: string; label: string; domain: string }[] = [
  { key: 'vlp', label: 'virtuallaunch.pro', domain: 'virtuallaunch.pro' },
  { key: 'tmp', label: 'taxmonitor.pro', domain: 'taxmonitor.pro' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatNumber(n: number | undefined): string {
  return (n ?? 0).toLocaleString()
}

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.glassCard} ${className}`}>{children}</div>
}

function GlassCardTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.glassCardTitle}>{children}</div>
}

function KpiNumber({ value, label, accent }: { value: string | number; label: string; accent?: 'green' }) {
  const accentClass = accent === 'green' ? styles.statusGreen : ''
  return (
    <div className={styles.kpiBlock}>
      <div className={`${styles.kpiNumber} ${accentClass}`}>{value}</div>
      <div className={styles.kpiLabel}>{label}</div>
    </div>
  )
}

function FunnelBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className={styles.funnelRow}>
      <div className={styles.funnelLabel}>{label}</div>
      <div className={styles.funnelBarTrack}>
        <div className={styles.funnelBarFill} style={{ width: `${pct}%`, background: color }} />
      </div>
      <div className={styles.funnelValue}>{value.toLocaleString()}</div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Zone card
// ---------------------------------------------------------------------------
function ZoneCard({
  zoneKey,
  zoneLabel,
  data,
  error,
}: {
  zoneKey: string
  zoneLabel: string
  data: PostHogZoneData | null
  error: string | null
}) {
  if (error) {
    return (
      <GlassCard>
        <GlassCardTitle>{zoneLabel}</GlassCardTitle>
        <div className={styles.glassCardMuted}>{error}</div>
      </GlassCard>
    )
  }

  if (!data) {
    return (
      <GlassCard>
        <GlassCardTitle>{zoneLabel}</GlassCardTitle>
        <div className={styles.glassCardMuted}>Loading…</div>
      </GlassCard>
    )
  }

  if (data.error === 'POSTHOG_NOT_CONFIGURED') {
    return (
      <GlassCard>
        <GlassCardTitle>{zoneLabel}</GlassCardTitle>
        <div className={styles.glassCardMuted}>
          PostHog analytics unavailable. Ensure POSTHOG_PERSONAL_API_KEY and POSTHOG_PROJECT_ID are set as Worker secrets.
        </div>
      </GlassCard>
    )
  }

  if (data.collecting) {
    return (
      <GlassCard>
        <GlassCardTitle>{zoneLabel}</GlassCardTitle>
        <div className={styles.glassCardMuted}>
          PostHog is collecting data. Analytics will appear here once enough traffic has been recorded.
        </div>
      </GlassCard>
    )
  }

  const totalPageviews = data.funnel.pageview
  const funnelMax = Math.max(data.funnel.pageview, data.funnel.sign_up, data.funnel.purchase, 1)

  return (
    <div className="space-y-4">
      <GlassCard>
        <GlassCardTitle>{zoneLabel} · Last {data.days} days</GlassCardTitle>
        <div className={styles.kpiRow}>
          <KpiNumber value={formatNumber(totalPageviews)} label="Pageviews" />
          <KpiNumber value={formatNumber(data.signups)} label="Signups" accent={data.signups > 0 ? 'green' : undefined} />
          <KpiNumber value={formatNumber(data.purchases)} label="Purchases" accent={data.purchases > 0 ? 'green' : undefined} />
          <KpiNumber value={formatCurrency(data.revenue_cents)} label="Revenue" accent={data.revenue_cents > 0 ? 'green' : undefined} />
        </div>
      </GlassCard>

      <GlassCard>
        <GlassCardTitle>Funnel — Pageview → Signup → Purchase</GlassCardTitle>
        <div className={styles.funnelContainer}>
          <FunnelBar label="Pageviews" value={data.funnel.pageview} max={funnelMax} color="linear-gradient(to right, #3b82f6, #6366f1)" />
          <FunnelBar label="Signups" value={data.funnel.sign_up} max={funnelMax} color="linear-gradient(to right, #f97316, #f59e0b)" />
          <FunnelBar label="Purchases" value={data.funnel.purchase} max={funnelMax} color="linear-gradient(to right, #22c55e, #14b8a6)" />
        </div>
      </GlassCard>

      <GlassCard>
        <GlassCardTitle>Top Pages</GlassCardTitle>
        {data.pageviews_by_path.length > 0 ? (
          <div className={styles.tableContainer}>
            <table className={styles.glassTable}>
              <thead>
                <tr>
                  <th>Path</th>
                  <th>Pageviews</th>
                </tr>
              </thead>
              <tbody>
                {data.pageviews_by_path.map((row, i) => (
                  <tr key={`${zoneKey}-${i}`}>
                    <td>{row.path}</td>
                    <td>{row.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.glassCardMuted}>No pageviews recorded in window.</div>
        )}
      </GlassCard>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tab component
// ---------------------------------------------------------------------------
export default function PostHogTab() {
  const [results, setResults] = useState<Record<string, PostHogZoneData | null>>({})
  const [errors, setErrors] = useState<Record<string, string | null>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const entries = await Promise.all(
        ZONES.map(async ({ key }) => {
          try {
            const res = await fetch(`${API_BASE}/v1/analytics/posthog/repo/${key}`, {
              credentials: 'include',
            })
            if (!res.ok) {
              return [key, null, `HTTP ${res.status}`] as const
            }
            const json = (await res.json()) as PostHogZoneData
            return [key, json, null] as const
          } catch (e) {
            return [key, null, e instanceof Error ? e.message : 'fetch failed'] as const
          }
        })
      )
      if (cancelled) return
      const nextResults: Record<string, PostHogZoneData | null> = {}
      const nextErrors: Record<string, string | null> = {}
      for (const [key, data, err] of entries) {
        nextResults[key] = data
        nextErrors[key] = err
      }
      setResults(nextResults)
      setErrors(nextErrors)
      setLoading(false)
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2">
        {ZONES.map((z) => (
          <div key={z.key} className={styles.skeletonCard}></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {ZONES.map(({ key, label }) => (
        <ZoneCard
          key={key}
          zoneKey={key}
          zoneLabel={label}
          data={results[key]}
          error={errors[key]}
        />
      ))}
    </div>
  )
}
