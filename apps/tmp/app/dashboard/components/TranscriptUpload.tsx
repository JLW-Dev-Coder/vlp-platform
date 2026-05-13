'use client'

import { useEffect, useMemo, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { api, ApiError } from '@/lib/api'
import type { MonitoringEngagement } from '@/lib/api'
import styles from './components.module.css'

const TRANSCRIPT_TYPES = [
  { value: 'account_transcript', label: 'Account Transcript' },
  { value: 'return_transcript', label: 'Return Transcript' },
  { value: 'wage_and_income', label: 'Wage & Income' },
  { value: 'record_of_account', label: 'Record of Account' },
]

interface TxnRow {
  code: string
  date: string
  amount: string
}

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

const EMPTY_ROW: TxnRow = { code: '', date: '', amount: '' }

function emptyRows(n: number): TxnRow[] {
  return Array.from({ length: n }, () => ({ ...EMPTY_ROW }))
}

function TranscriptUploadInner() {
  const searchParams = useSearchParams()
  const preselectId = searchParams.get('engagement') ?? ''

  const [loading, setLoading] = useState(true)
  const [engagements, setEngagements] = useState<MonitoringEngagement[]>([])
  const [viewerId, setViewerId] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [engagementId, setEngagementId] = useState<string>('')
  const [transcriptType, setTranscriptType] = useState<string>('account_transcript')
  const [mode, setMode] = useState<'manual' | 'paste'>('manual')
  const [rows, setRows] = useState<TxnRow[]>(emptyRows(5))
  const [pasted, setPasted] = useState<string>('')

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

  const updateRow = (idx: number, field: keyof TxnRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: value } : r)))
  }

  const addRow = () => setRows((prev) => [...prev, { ...EMPTY_ROW }])
  const removeRow = (idx: number) =>
    setRows((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== idx)))

  const parsedFromPaste = useMemo(() => {
    if (mode !== 'paste' || !pasted.trim()) return null
    try {
      const obj = JSON.parse(pasted)
      const td = obj.transcript_data ?? obj
      if (!td || typeof td !== 'object') throw new Error('Expected an object')
      if (!Array.isArray(td.transactions) || td.transactions.length === 0) {
        throw new Error('transactions array is required and must be non-empty')
      }
      for (const t of td.transactions) {
        if (!t.code || !t.date || t.amount === undefined) {
          throw new Error('Each transaction needs code, date, and amount')
        }
      }
      return {
        transcript_type: td.transcript_type || transcriptType,
        transactions: td.transactions.map((t: { code: unknown; date: unknown; amount: unknown }) => ({
          code: String(t.code),
          date: String(t.date),
          amount: Number(t.amount),
        })),
        error: null as string | null,
      }
    } catch (e) {
      return { transcript_type: '', transactions: [], error: e instanceof Error ? e.message : 'Invalid JSON' }
    }
  }, [mode, pasted, transcriptType])

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setSubmitError(null)
    setResult(null)

    if (!engagementId) {
      setSubmitError('Select an engagement first.')
      return
    }

    let transcript_data: { transcript_type: string; transactions: Array<{ code: string; date: string; amount: number }> }

    if (mode === 'manual') {
      const filled = rows
        .map((r) => ({
          code: r.code.trim(),
          date: r.date.trim(),
          amount: r.amount.trim() === '' ? NaN : Number(r.amount),
        }))
        .filter((r) => r.code !== '' || r.date !== '' || !Number.isNaN(r.amount))
      if (filled.length === 0) {
        setSubmitError('Add at least one transaction row.')
        return
      }
      for (const r of filled) {
        if (!r.code || !r.date || Number.isNaN(r.amount)) {
          setSubmitError('Each row needs code, date, and amount.')
          return
        }
      }
      transcript_data = { transcript_type: transcriptType, transactions: filled }
    } else {
      if (!parsedFromPaste || parsedFromPaste.error || parsedFromPaste.transactions.length === 0) {
        setSubmitError(parsedFromPaste?.error || 'Paste valid transcript JSON first.')
        return
      }
      transcript_data = {
        transcript_type: parsedFromPaste.transcript_type || transcriptType,
        transactions: parsedFromPaste.transactions,
      }
    }

    setSubmitting(true)
    try {
      const res = await api.uploadMonitoringTranscript(engagementId, transcript_data)
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
                setRows(emptyRows(5))
                setPasted('')
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
              <div>
                <label style={labelStyle} htmlFor="transcript-type">Transcript type</label>
                <select
                  id="transcript-type"
                  value={transcriptType}
                  onChange={(e) => setTranscriptType(e.target.value)}
                  style={inputStyle}
                >
                  {TRANSCRIPT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 className={styles.cardTitle} style={{ margin: 0 }}>Transactions</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className={mode === 'manual' ? styles.btnPrimary : styles.btnSecondary}
                  onClick={() => setMode('manual')}
                >
                  Manual entry
                </button>
                <button
                  type="button"
                  className={mode === 'paste' ? styles.btnPrimary : styles.btnSecondary}
                  onClick={() => setMode('paste')}
                >
                  Paste JSON
                </button>
              </div>
            </div>

            {mode === 'manual' ? (
              <>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th style={{ width: '20%' }}>Code</th>
                        <th style={{ width: '35%' }}>Date</th>
                        <th style={{ width: '30%' }}>Amount</th>
                        <th style={{ width: '15%' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 150"
                              value={r.code}
                              onChange={(e) => updateRow(idx, 'code', e.target.value)}
                              style={inputStyle}
                            />
                          </td>
                          <td>
                            <input
                              type="date"
                              value={r.date}
                              onChange={(e) => updateRow(idx, 'date', e.target.value)}
                              style={inputStyle}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              value={r.amount}
                              onChange={(e) => updateRow(idx, 'amount', e.target.value)}
                              style={inputStyle}
                            />
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className={styles.btnSecondary}
                              onClick={() => removeRow(idx)}
                              disabled={rows.length <= 1}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button type="button" className={styles.btnSecondary} onClick={addRow} style={{ marginTop: '0.75rem' }}>
                  + Add row
                </button>
              </>
            ) : (
              <>
                <label style={labelStyle} htmlFor="paste">Paste transcript data (JSON)</label>
                <textarea
                  id="paste"
                  value={pasted}
                  onChange={(e) => setPasted(e.target.value)}
                  rows={10}
                  placeholder={'{\n  "transcript_type": "account_transcript",\n  "transactions": [\n    { "code": "150", "date": "2024-04-15", "amount": 12345.67 }\n  ]\n}'}
                  style={{ ...inputStyle, fontFamily: 'var(--font-mono, monospace)', fontSize: '0.8rem' }}
                />
                {parsedFromPaste?.error ? (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    {parsedFromPaste.error}
                  </p>
                ) : parsedFromPaste && parsedFromPaste.transactions.length > 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                    Parsed {parsedFromPaste.transactions.length} transaction{parsedFromPaste.transactions.length === 1 ? '' : 's'}
                    {parsedFromPaste.transcript_type ? ` · type: ${parsedFromPaste.transcript_type}` : ''}
                  </p>
                ) : null}
              </>
            )}
          </div>

          {submitError ? (
            <div className={styles.glassCard} style={{ borderColor: '#ef4444' }}>
              <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0 }}>{submitError}</p>
            </div>
          ) : null}

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button type="submit" className={styles.btnPrimary} disabled={submitting}>
              {submitting ? 'Uploading…' : 'Upload & Analyze'}
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
