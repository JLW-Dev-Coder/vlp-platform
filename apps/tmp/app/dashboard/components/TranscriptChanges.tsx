'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import type { MonitoringEngagement, MonitoringUpload, MonitoringAlert, AlertSeverity } from '@/lib/api'
import styles from './components.module.css'

const TIER_LABEL: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  snapshot: 'Snapshot',
}

const STATUS_LABEL: Record<string, string> = {
  pending_pro: 'Pending Pro',
  active: 'Active',
  completed: 'Completed',
  expired: 'Expired',
  abandoned: 'Abandoned',
}

function statusBadgeClass(status: string): string {
  if (status === 'active') return styles.badgeSuccess
  if (status === 'pending_pro') return styles.badgeWarning
  if (status === 'expired' || status === 'abandoned') return styles.badgeError
  return styles.badgeDefault
}

function severityBadgeClass(sev: AlertSeverity): string {
  if (sev === 'critical') return styles.badgeError
  if (sev === 'warning') return styles.badgeWarning
  return styles.badgeBlue
}

function formatDate(raw?: string | null): string {
  if (!raw) return '—'
  try {
    return new Date(raw).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return raw
  }
}

function progressLabel(eng: MonitoringEngagement): string {
  if (eng.status === 'completed') return 'Completed'
  if (eng.status === 'expired') return 'Expired'
  if (eng.tier === 'snapshot') {
    return eng.total_uploads > 0 ? 'Snapshot delivered' : 'Awaiting transcript'
  }
  if (!eng.started_at || !eng.duration_weeks) return 'Not started'
  const start = new Date(eng.started_at).getTime()
  const weeksElapsed = Math.max(0, Math.floor((Date.now() - start) / (7 * 24 * 60 * 60 * 1000)))
  const wk = Math.min(weeksElapsed + 1, eng.duration_weeks)
  return `Week ${wk} of ${eng.duration_weeks}`
}

function daysRemaining(eng: MonitoringEngagement): number | null {
  if (eng.status !== 'active' || !eng.ends_at) return null
  const ms = new Date(eng.ends_at).getTime() - Date.now()
  if (Number.isNaN(ms)) return null
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)))
}

function alertSeverityCounts(alerts: MonitoringAlert[]) {
  const counts = { critical: 0, warning: 0, info: 0 }
  for (const a of alerts) {
    if (a.severity === 'critical') counts.critical++
    else if (a.severity === 'warning') counts.warning++
    else counts.info++
  }
  return counts
}

export default function TranscriptChanges() {
  const [loading, setLoading] = useState(true)
  const [engagements, setEngagements] = useState<MonitoringEngagement[]>([])
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<{
    engagement: MonitoringEngagement
    uploads: MonitoringUpload[]
    alerts: MonitoringAlert[]
  } | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchList = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getMonitoringEngagements()
      setEngagements(res.engagements ?? [])
      setViewerId(res.viewer_account_id ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load monitoring engagements')
      setEngagements([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const handleExpand = async (engagementId: string) => {
    if (expandedId === engagementId) {
      setExpandedId(null)
      setDetail(null)
      return
    }
    setExpandedId(engagementId)
    setDetail(null)
    setDetailLoading(true)
    try {
      const res = await api.getMonitoringEngagement(engagementId)
      setDetail({ engagement: res.engagement, uploads: res.uploads ?? [], alerts: res.alerts ?? [] })
    } catch {
      setDetail(null)
    } finally {
      setDetailLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Loading monitoring engagements…</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Transcript Changes</h1>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchList}>Retry</button>
        </div>
      </div>
    )
  }

  if (engagements.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Transcript Changes</h1>
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>
            <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={styles.emptyTitle}>No monitoring engagements yet</h3>
          <p className={styles.emptyText}>
            Start a monitoring package to have a tax pro pull your IRS transcript on a recurring cadence and alert you to every change.
          </p>
          <Link href="/pricing#plan-ii" className={styles.btnPrimary} style={{ display: 'inline-block', marginTop: '1rem', textDecoration: 'none' }}>
            Start Monitoring →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Transcript Changes</h1>

      <div className={styles.glassCard}>
        <h2 className={styles.cardTitle}>
          Engagements <span style={{ color: 'var(--text-muted)' }}>({engagements.length})</span>
        </h2>
        <div className={styles.activityList}>
          {engagements.map((eng) => {
            const isPro = viewerId !== null && eng.professional_account_id === viewerId
            const expanded = expandedId === eng.engagement_id
            const days = daysRemaining(eng)
            return (
              <div key={eng.engagement_id} className={styles.activityRow} style={{ flexDirection: 'column', alignItems: 'stretch', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                      <span className={`${styles.badge} ${styles.badgeBlue}`}>
                        {TIER_LABEL[eng.tier] ?? eng.tier}
                      </span>
                      <span className={`${styles.badge} ${statusBadgeClass(eng.status)}`}>
                        {STATUS_LABEL[eng.status] ?? eng.status}
                      </span>
                      {eng.mfj_spouse ? (
                        <span className={`${styles.badge} ${styles.badgeDefault}`}>MFJ</span>
                      ) : null}
                    </div>
                    <div className={styles.activityDesc}>
                      {isPro
                        ? eng.taxpayer_name || 'Taxpayer (no name on file)'
                        : eng.professional_account_id
                          ? 'Assigned professional'
                          : 'Awaiting assignment'}
                    </div>
                    <div className={styles.activityMeta}>
                      {eng.tier === 'snapshot'
                        ? 'One-time snapshot'
                        : `${eng.duration_weeks ?? '—'} weeks · check every ${eng.cadence_days} day${eng.cadence_days === 1 ? '' : 's'}`}
                      {' · '}{progressLabel(eng)}
                      {days !== null ? ` · ${days} day${days === 1 ? '' : 's'} remaining` : ''}
                    </div>
                    <div className={styles.activityMeta}>
                      Last upload: {formatDate(eng.last_upload_at)} · Alerts: {eng.total_alerts}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                    <button
                      className={styles.btnSecondary}
                      onClick={() => handleExpand(eng.engagement_id)}
                    >
                      {expanded ? 'Hide details' : 'View details'}
                    </button>
                    {isPro && eng.status === 'active' ? (
                      <Link
                        href={`/dashboard/transcript-changes/upload?engagement=${eng.engagement_id}`}
                        className={styles.btnPrimary}
                        style={{ textDecoration: 'none', textAlign: 'center' }}
                      >
                        Upload Transcript
                      </Link>
                    ) : null}
                    {isPro && eng.status === 'active' && eng.last_upload_at ? (
                      (() => {
                        const sinceMs = Date.now() - new Date(eng.last_upload_at as string).getTime()
                        const overdue = sinceMs > eng.cadence_days * 24 * 60 * 60 * 1000
                        return overdue ? (
                          <span className={`${styles.badge} ${styles.badgeError}`}>Overdue</span>
                        ) : null
                      })()
                    ) : null}
                  </div>
                </div>

                {expanded ? (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                    {detailLoading || !detail ? (
                      <div className={styles.loadingText}>Loading details…</div>
                    ) : (
                      <>
                        <div style={{ marginBottom: '1rem' }}>
                          <div className={styles.cardTitle} style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            Uploads ({detail.uploads.length})
                          </div>
                          {detail.uploads.length === 0 ? (
                            <div className={styles.activityMeta}>No transcripts uploaded yet.</div>
                          ) : (
                            <div className={styles.activityList}>
                              {detail.uploads.map((u) => (
                                <div key={u.upload_id} className={styles.activityRow}>
                                  <div>
                                    <div className={styles.activityDesc}>Transcript pulled</div>
                                    <div className={styles.activityMeta}>{formatDate(u.uploaded_at)}</div>
                                  </div>
                                  <span className={`${styles.badge} ${u.changes_detected ? styles.badgeWarning : styles.badgeDefault}`}>
                                    {u.changes_detected ? `${u.changes_detected} change${u.changes_detected === 1 ? '' : 's'}` : 'No changes'}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className={styles.cardTitle} style={{ fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                            Alerts ({detail.alerts.length})
                            {detail.alerts.length > 0 ? (
                              <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                                {(() => {
                                  const c = alertSeverityCounts(detail.alerts)
                                  return `${c.critical} critical · ${c.warning} warning · ${c.info} info`
                                })()}
                              </span>
                            ) : null}
                          </div>
                          {detail.alerts.length === 0 ? (
                            <div className={styles.activityMeta}>No alerts on this engagement.</div>
                          ) : (
                            <div className={styles.activityList}>
                              {detail.alerts.map((a) => (
                                <div key={a.alert_id} className={styles.activityRow}>
                                  <div style={{ flex: 1 }}>
                                    <div className={styles.activityDesc}>
                                      {a.alert_type}
                                      {a.transaction_code ? (
                                        <span style={{ marginLeft: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                          [TC {a.transaction_code}]
                                        </span>
                                      ) : null}
                                    </div>
                                    <div className={styles.activityMeta}>{a.description}</div>
                                    {(a.old_value || a.new_value) ? (
                                      <div className={styles.activityMeta} style={{ marginTop: '0.25rem' }}>
                                        {a.old_value ?? '—'} → {a.new_value ?? '—'}
                                      </div>
                                    ) : null}
                                    <div className={styles.activityMeta}>{formatDate(a.created_at)}</div>
                                  </div>
                                  <span className={`${styles.badge} ${severityBadgeClass(a.severity)}`}>
                                    {a.severity}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
