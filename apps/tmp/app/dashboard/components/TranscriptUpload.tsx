'use client'

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import type { MonitoringEngagement } from '@/lib/api'
import styles from './components.module.css'

const MAX_FILE_BYTES = 10 * 1024 * 1024

interface UploadResult {
  upload_id: string
  changes_detected: number
  alerts: Array<{
    alert_id: string
    alert_type: string
    description: string
    transaction_code: string | null
    old_value: string | null
    new_value: string | null
    severity: string
  }>
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

function TranscriptUploadInner() {
  const searchParams = useSearchParams()
  const preselectId = searchParams.get('engagement') ?? ''

  const [loading, setLoading] = useState(true)
  const [engagements, setEngagements] = useState<MonitoringEngagement[]>([])
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [engagementId, setEngagementId] = useState<string>('')
  const [file, setFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)

  const fetchEngagements = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      const res = await api.getMonitoringEngagements()
      setEngagements(res.engagements ?? [])
      setViewerId(res.viewer_account_id ?? null)
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load engagements')
      setEngagements([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEngagements()
  }, [fetchEngagements])

  const myActive = useMemo(() => {
    if (!viewerId) return []
    return engagements.filter(
      (e) => e.status === 'active' && e.professional_account_id === viewerId,
    )
  }, [engagements, viewerId])

  useEffect(() => {
    if (engagementId) return
    if (preselectId && myActive.some((e) => e.engagement_id === preselectId)) {
      setEngagementId(preselectId)
    } else if (myActive.length === 1) {
      setEngagementId(myActive[0].engagement_id)
    }
  }, [preselectId, myActive, engagementId])

  const validateAndSetFile = (candidate: File | null) => {
    setSubmitError(null)
    if (!candidate) {
      setFile(null)
      return
    }
    const isPdf = candidate.type === 'application/pdf' || candidate.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      setSubmitError('Only PDF files are accepted.')
      setFile(null)
      return
    }
    if (candidate.size > MAX_FILE_BYTES) {
      setSubmitError('PDF must be under 10 MB.')
      setFile(null)
      return
    }
    setFile(candidate)
  }

  const handleFileSelect = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0] ?? null
    validateAndSetFile(f)
  }

  const handleDrop = (ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    setDragActive(false)
    const f = ev.dataTransfer.files?.[0] ?? null
    validateAndSetFile(f)
  }

  const handleDragOver = (ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    if (!dragActive) setDragActive(true)
  }

  const handleDragLeave = (ev: React.DragEvent<HTMLLabelElement>) => {
    ev.preventDefault()
    ev.stopPropagation()
    setDragActive(false)
  }

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitError(null)
    setResult(null)

    if (!engagementId) {
      setSubmitError('Select an engagement first.')
      return
    }
    if (!file) {
      setSubmitError('Choose an IRS transcript PDF to upload.')
      return
    }

    setSubmitting(true)
    try {
      const res = await api.uploadMonitoringTranscriptPdf(engagementId, file)
      setResult({
        upload_id: res.upload_id,
        changes_detected: res.changes_detected,
        alerts: res.alerts ?? [],
      })
    } catch (e) {
      setSubmitError(
        e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Upload failed',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <span className={styles.loadingText}>Loading engagements…</span>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Upload Transcript</h1>
        <div className={styles.errorState}>
          <p className={styles.errorText}>{loadError}</p>
          <button className={styles.retryBtn} onClick={fetchEngagements}>Retry</button>
        </div>
      </div>
    )
  }

  if (myActive.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.pageTitle}>Upload Transcript</h1>
        <div className={styles.glassCard}>
          <p style={{ color: 'var(--text-muted)' }}>
            You don&apos;t have any active engagements assigned to you. Only the assigned professional on an
            <em> active</em> engagement may upload transcripts.
          </p>
          <Link href="/dashboard/transcript-changes" className={styles.btnSecondary} style={{ display: 'inline-block', marginTop: '0.75rem', textDecoration: 'none' }}>
            ← Back to Transcript Changes
          </Link>
        </div>
      </div>
    )
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: 'var(--text-subtle)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.35rem',
  }
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--surface-mid)',
    border: '1px solid var(--surface-border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
  }

  const dropzoneStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '2.5rem 1.5rem',
    borderRadius: 'var(--radius-md, 0.5rem)',
    border: `2px dashed ${dragActive ? '#f97316' : 'var(--surface-border)'}`,
    background: dragActive ? 'rgba(249, 115, 22, 0.08)' : 'var(--surface-mid)',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'border-color 120ms ease, background 120ms ease',
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Upload Transcript</h1>

      {result ? (
        <div className={styles.glassCard}>
          <h2 className={styles.cardTitle}>
            Upload complete · {result.changes_detected} change{result.changes_detected === 1 ? '' : 's'} detected
          </h2>
          {result.alerts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              No changes detected against the previous transcript on this engagement.
            </p>
          ) : (
            <div className={styles.activityList}>
              {result.alerts.map((a) => (
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
                  </div>
                  <span className={styles.badge}>{a.severity}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <Link
              href="/dashboard/transcript-changes"
              className={styles.btnPrimary}
              style={{ textDecoration: 'none' }}
            >
              Back to Transcript Changes
            </Link>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => {
                setResult(null)
                setFile(null)
              }}
            >
              Upload another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className={styles.glassCard}>
            <h2 className={styles.cardTitle}>Engagement</h2>
            <div>
              <label style={labelStyle} htmlFor="engagement">Engagement</label>
              <select
                id="engagement"
                value={engagementId}
                onChange={(e) => setEngagementId(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">— Select an active engagement —</option>
                {myActive.map((e) => (
                  <option key={e.engagement_id} value={e.engagement_id}>
                    {e.taxpayer_name || 'Taxpayer'} · {e.tier} · {e.engagement_id.slice(0, 8)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.glassCard}>
            <h2 className={styles.cardTitle}>IRS Transcript PDF</h2>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              id="transcript-upload"
            />
            <label
              htmlFor="transcript-upload"
              style={dropzoneStyle}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--text-muted)' }}>
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {file ? (
                <>
                  <p style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.95rem', margin: 0 }}>
                    {file.name}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                    {formatBytes(file.size)} · click or drop to replace
                  </p>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--text)', fontSize: '0.95rem', margin: 0 }}>
                    Drop your IRS transcript PDF here, or <span style={{ color: '#f97316', textDecoration: 'underline' }}>click to browse</span>
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: 0 }}>
                    PDF files only · max 10&nbsp;MB · transcript type detected automatically
                  </p>
                </>
              )}
            </label>
          </div>

          {submitError ? (
            <div className={styles.glassCard} style={{ borderColor: '#ef4444' }}>
              <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>{submitError}</p>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" className={styles.btnPrimary} disabled={submitting || !file}>
              {submitting ? 'Uploading & analyzing…' : 'Upload & Analyze'}
            </button>
            <Link href="/dashboard/transcript-changes" className={styles.btnSecondary} style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  )
}

export default function TranscriptUpload() {
  return (
    <Suspense fallback={<div className={styles.loadingWrap}><div className={styles.spinner} /></div>}>
      <TranscriptUploadInner />
    </Suspense>
  )
}
