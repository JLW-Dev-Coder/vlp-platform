'use client'

import { useCallback, useEffect, useState } from 'react'
import styles from '../page.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface MetricBucket {
  thisWeek: number
  cumulative: number
}

interface KpiSnapshot {
  weekNumber: number
  dateRange: { from: string; to: string }
  galaLeads: MetricBucket
  inquiryLeads: MetricBucket
  kennedySignups: MetricBucket
  claimsFiled: MetricBucket
  createdAt: string
}

interface KpiResponse {
  ok: boolean
  snapshots: KpiSnapshot[]
  targets: {
    taxpayerLeads: [number, number]
    taxProSignups: [number, number]
    claimsFiled: [number, number]
  }
}

const API_BASE = 'https://api.virtuallaunch.pro'

const DEFAULT_TARGETS: KpiResponse['targets'] = {
  taxpayerLeads: [200, 400],
  taxProSignups: [15, 20],
  claimsFiled: [30, 60],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function trendIcon(thisWeek: number, prev: number | null) {
  if (prev === null) return <span className="text-slate-500">—</span>
  if (thisWeek > prev) return <span className="text-emerald-400" aria-label="up">▲</span>
  if (thisWeek < prev) return <span className="text-red-400" aria-label="down">▼</span>
  return <span className="text-slate-500" aria-label="flat">—</span>
}

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.glassCard} ${className}`}>{children}</div>
}
function GlassCardTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.glassCardTitle}>{children}</div>
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function KpiTab() {
  const [snapshots, setSnapshots] = useState<KpiSnapshot[]>([])
  const [targets, setTargets] = useState<KpiResponse['targets']>(DEFAULT_TARGETS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)

  const fetchKpi = useCallback(async () => {
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/v1/scale/kpi/snapshots`, { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = (await res.json()) as KpiResponse
      const sorted = [...(json.snapshots || [])].sort((a, b) => a.weekNumber - b.weekNumber)
      setSnapshots(sorted)
      setTargets(json.targets || DEFAULT_TARGETS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load KPI snapshots')
    }
  }, [])

  useEffect(() => {
    fetchKpi().finally(() => setLoading(false))
  }, [fetchKpi])

  const runSnapshotNow = async () => {
    setRunning(true)
    try {
      await fetch(`${API_BASE}/v1/scale/kpi/snapshot-now`, {
        method: 'POST',
        credentials: 'include',
      })
      await fetchKpi()
    } catch {
      /* surfaced via fetchKpi error state */
    }
    setRunning(false)
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

  if (error) {
    return (
      <GlassCard>
        <div className={styles.glassCardPlaceholder}>
          <span className={styles.glassCardMuted}>Error: {error}</span>
          <button
            type="button"
            onClick={() => { setLoading(true); fetchKpi().finally(() => setLoading(false)) }}
            className="mt-3 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </GlassCard>
    )
  }

  const latest = snapshots.length > 0 ? snapshots[snapshots.length - 1] : null
  const prior = snapshots.length > 1 ? snapshots[snapshots.length - 2] : null

  // Empty state
  if (!latest) {
    return (
      <GlassCard>
        <GlassCardTitle>Campaign KPIs</GlassCardTitle>
        <div className={styles.glassCardPlaceholder}>
          <span className={styles.glassCardMuted}>
            No KPI data yet. Snapshots are collected weekly on Sunday at midnight PT.
            Use the button below to run a snapshot now.
          </span>
          <button
            type="button"
            onClick={runSnapshotNow}
            disabled={running}
            className="mt-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 px-4 py-2 rounded-lg text-sm"
          >
            {running ? 'Running…' : 'Run Snapshot Now'}
          </button>
        </div>
      </GlassCard>
    )
  }

  // ---- Stat cards ----
  const cards: Array<{ label: string; bucket: MetricBucket; priorThisWeek: number | null }> = [
    {
      label: 'Gala Leads',
      bucket: latest.galaLeads,
      priorThisWeek: prior ? prior.galaLeads.thisWeek : null,
    },
    {
      label: 'Inquiry Leads',
      bucket: latest.inquiryLeads,
      priorThisWeek: prior ? prior.inquiryLeads.thisWeek : null,
    },
    {
      label: 'Tax Pro Signups',
      bucket: latest.kennedySignups,
      priorThisWeek: prior ? prior.kennedySignups.thisWeek : null,
    },
    {
      label: 'Claims Filed',
      bucket: latest.claimsFiled,
      priorThisWeek: prior ? prior.claimsFiled.thisWeek : null,
    },
  ]

  // ---- Progress bars ----
  const taxpayerLeadsCum = latest.galaLeads.cumulative + latest.inquiryLeads.cumulative
  const proSignupsCum = latest.kennedySignups.cumulative
  const claimsFiledCum = latest.claimsFiled.cumulative

  const bars: Array<{ label: string; current: number; target: [number, number] }> = [
    { label: 'Taxpayer Leads', current: taxpayerLeadsCum, target: targets.taxpayerLeads },
    { label: 'Tax Pro Signups', current: proSignupsCum, target: targets.taxProSignups },
    { label: 'Claims Filed', current: claimsFiledCum, target: targets.claimsFiled },
  ]

  return (
    <div className="space-y-6">
      {/* Header + manual trigger */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {snapshots.length} week{snapshots.length === 1 ? '' : 's'} of data ·
          latest: week {latest.weekNumber} ({latest.dateRange.from} → {latest.dateRange.to})
        </div>
        <button
          type="button"
          onClick={runSnapshotNow}
          disabled={running}
          className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 px-4 py-2 rounded-lg text-sm"
        >
          {running ? 'Running…' : 'Run Snapshot Now'}
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400 uppercase tracking-wide">{card.label}</div>
              <div className="text-base">{trendIcon(card.bucket.thisWeek, card.priorThisWeek)}</div>
            </div>
            <div className="mt-2 text-3xl font-semibold text-white" style={{ fontFamily: 'var(--font-sora, Sora, sans-serif)' }}>
              {card.bucket.thisWeek}
            </div>
            <div className="mt-1 text-xs text-slate-500">Total: {card.bucket.cumulative}</div>
          </div>
        ))}
      </div>

      {/* Progress bars */}
      <GlassCard>
        <GlassCardTitle>10-Week Targets (Cumulative)</GlassCardTitle>
        <div className="space-y-4">
          {bars.map((bar) => {
            const [min, max] = bar.target
            const pct = Math.min(100, max > 0 ? (bar.current / max) * 100 : 0)
            const onTrack = bar.current >= min
            const fillClass = onTrack ? 'bg-emerald-500' : 'bg-amber-400'
            const labelClass = onTrack ? 'text-slate-300' : 'text-amber-400'
            return (
              <div key={bar.label}>
                <div className="flex items-center justify-between mb-2 text-sm">
                  <span className={labelClass}>{bar.label}</span>
                  <span className="text-slate-400 tabular-nums">
                    {bar.current} / {min}–{max}
                  </span>
                </div>
                <div className="bg-slate-700/30 rounded-full h-3">
                  <div
                    className={`${fillClass} rounded-full h-3 transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Weekly table */}
      <GlassCard>
        <GlassCardTitle>Weekly Breakdown</GlassCardTitle>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 uppercase tracking-wide border-b border-slate-700/50">
                <th className="text-left py-2 px-3 font-medium">Week</th>
                <th className="text-left py-2 px-3 font-medium">Date Range</th>
                <th className="text-right py-2 px-3 font-medium">Gala</th>
                <th className="text-right py-2 px-3 font-medium">Inquiry</th>
                <th className="text-right py-2 px-3 font-medium">Pro Signups</th>
                <th className="text-right py-2 px-3 font-medium">Claims</th>
                <th className="text-right py-2 px-3 font-medium">Total Leads</th>
              </tr>
            </thead>
            <tbody>
              {snapshots.map((s) => {
                const totalLeads = s.galaLeads.thisWeek + s.inquiryLeads.thisWeek
                return (
                  <tr key={s.weekNumber} className="bg-slate-800/30 border-b border-slate-700/30 text-slate-300">
                    <td className="py-2 px-3">{s.weekNumber}</td>
                    <td className="py-2 px-3 text-slate-400">{s.dateRange.from} → {s.dateRange.to}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{s.galaLeads.thisWeek}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{s.inquiryLeads.thisWeek}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{s.kennedySignups.thisWeek}</td>
                    <td className="py-2 px-3 text-right tabular-nums">{s.claimsFiled.thisWeek}</td>
                    <td className="py-2 px-3 text-right tabular-nums font-medium text-white">{totalLeads}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
