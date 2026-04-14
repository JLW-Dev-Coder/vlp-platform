'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styles from './FormsPanel.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface AuditEntry {
  action: string
  by: string
  at: string
  value?: boolean
  reason?: string
}

interface Submission {
  submission_id: string
  platform: string
  form_type: string
  submitter_name: string
  submitter_email: string
  submitter_firm: string
  submitter_credential: string
  anonymous: boolean
  public: boolean
  consent_publish: boolean
  consent_marketing: boolean
  rating?: number
  prospect_slug?: string
  data: Record<string, any>
  audit_log: AuditEntry[]
  created_at: string
  updated_at: string
}

// ---------------------------------------------------------------------------
// API helpers (credentials: 'include' — admin cookie session)
// ---------------------------------------------------------------------------
const API = 'https://api.virtuallaunch.pro'
const PAGE_SIZE = 20

async function fetchSubmissions(params: {
  platform?: string
  form_type?: string
  public?: string
  email?: string
  limit?: number
  offset?: number
}): Promise<{ ok: boolean; submissions: Submission[]; total: number }> {
  const qs = new URLSearchParams()
  if (params.platform) qs.set('platform', params.platform)
  if (params.form_type) qs.set('form_type', params.form_type)
  if (params.public) qs.set('public', params.public)
  if (params.email) qs.set('email', params.email)
  if (params.limit) qs.set('limit', String(params.limit))
  if (params.offset) qs.set('offset', String(params.offset))

  const res = await fetch(`${API}/v1/submissions?${qs.toString()}`, {
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Failed to load submissions')
  return res.json()
}

async function patchVisibility(
  id: string,
  isPublic: boolean,
  reason?: string,
): Promise<{ ok: boolean; public: boolean }> {
  const body: Record<string, any> = { public: isPublic }
  if (reason) body.reason = reason
  const res = await fetch(`${API}/v1/submissions/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update visibility')
  return res.json()
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PLATFORMS = ['All', 'VLP', 'TMP', 'TTMP', 'TTTMP', 'DVLP', 'GVLP', 'TCVLP', 'WLVLP'] as const
const FORM_TYPES = ['All', 'Review', 'Case Study', 'Testimonial', 'Support Ticket', 'Inquiry', 'Onboarding', 'Contact'] as const
const VISIBILITY_OPTIONS = ['All', 'Public', 'Hidden'] as const

const TYPE_COLORS: Record<string, string> = {
  review: '#14b8a6',
  'case study': '#3b82f6',
  testimonial: '#8b5cf6',
  'support ticket': '#eab308',
  inquiry: '#22c55e',
  onboarding: '#94a3b8',
  contact: '#06b6d4',
}

function typeColor(t: string): string {
  return TYPE_COLORS[t.toLowerCase()] ?? '#94a3b8'
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatDateTime(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isWithinLastDays(iso: string, days: number): boolean {
  const d = new Date(iso)
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  return d >= cutoff
}

// ---------------------------------------------------------------------------
// Stars component
// ---------------------------------------------------------------------------
function Stars({ rating, large }: { rating: number; large?: boolean }) {
  const size = large ? 'text-xl' : 'text-sm'
  return (
    <span className={`${size} leading-none`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? '#f59e0b' : 'rgba(148,163,184,0.3)' }}>
          ★
        </span>
      ))}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Toggle switch
// ---------------------------------------------------------------------------
function ToggleSwitch({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean
  disabled?: boolean
  onChange: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`${styles.toggle} ${checked ? styles.toggleOn : styles.toggleOff}`}
      onClick={(e) => {
        e.stopPropagation()
        onChange()
      }}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}

// ---------------------------------------------------------------------------
// Toast
// ---------------------------------------------------------------------------
interface ToastState {
  id: number
  kind: 'success' | 'error'
  message: string
}

// ---------------------------------------------------------------------------
// Hide reason prompt (inline modal)
// ---------------------------------------------------------------------------
function HideReasonPrompt({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const [reason, setReason] = useState('')
  return (
    <div className={styles.hidePromptOverlay} onClick={onCancel}>
      <div className={styles.hidePrompt} onClick={(e) => e.stopPropagation()}>
        <div className={styles.hidePromptTitle}>Reason for hiding? (optional)</div>
        <input
          className={styles.hidePromptInput}
          type="text"
          placeholder="e.g. Duplicate submission"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          autoFocus
        />
        <div className={styles.hidePromptButtons}>
          <button className={styles.hidePromptCancel} onClick={onCancel}>
            Cancel
          </button>
          <button className={styles.hidePromptConfirm} onClick={() => onConfirm(reason)}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Detail slide-over
// ---------------------------------------------------------------------------
function DetailPanel({
  sub,
  onClose,
  onToggle,
  toggling,
}: {
  sub: Submission
  onClose: () => void
  onToggle: (sub: Submission) => void
  toggling: string | null
}) {
  return (
    <div className={styles.slideOverlay} onClick={onClose}>
      <div className={styles.slidePanel} onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className={styles.slideClose} onClick={onClose}>
          ✕
        </button>

        {/* Header */}
        <div className={styles.slideHeader}>
          <span className={styles.typeBadge} style={{ backgroundColor: typeColor(sub.form_type) }}>
            {sub.form_type}
          </span>
          <span className={styles.slideId}>{sub.submission_id}</span>
          <span className={styles.slideDate}>{formatDate(sub.created_at)}</span>
        </div>

        {/* Submitter info */}
        <div className={styles.slideSection}>
          <div className={styles.slideSectionTitle}>Submitter</div>
          <div className={styles.detailGrid}>
            <div className={styles.detailLabel}>Name</div>
            <div className={styles.detailValue}>
              {sub.anonymous ? 'Anonymous' : sub.submitter_name}
            </div>
            <div className={styles.detailLabel}>Email</div>
            <div className={styles.detailValue}>{sub.submitter_email}</div>
            <div className={styles.detailLabel}>Firm</div>
            <div className={styles.detailValue}>{sub.submitter_firm || '—'}</div>
            <div className={styles.detailLabel}>Credential</div>
            <div className={styles.detailValue}>{sub.submitter_credential || '—'}</div>
            <div className={styles.detailLabel}>Platform</div>
            <div className={styles.detailValue}>{sub.platform.toUpperCase()}</div>
          </div>
        </div>

        {/* Submission data */}
        <div className={styles.slideSection}>
          <div className={styles.slideSectionTitle}>Submission Data</div>
          <SubmissionDataView sub={sub} />
        </div>

        {/* Consent */}
        <div className={styles.slideSection}>
          <div className={styles.slideSectionTitle}>Consent</div>
          <div className={styles.detailGrid}>
            <div className={styles.detailLabel}>Publish</div>
            <div className={styles.detailValue}>
              {sub.consent_publish ? (
                <span className={styles.consentYes}>Yes</span>
              ) : (
                <span className={styles.consentNo}>No</span>
              )}
            </div>
            <div className={styles.detailLabel}>Marketing</div>
            <div className={styles.detailValue}>
              {sub.consent_marketing ? (
                <span className={styles.consentYes}>Yes</span>
              ) : (
                <span className={styles.consentNo}>No</span>
              )}
            </div>
          </div>
        </div>

        {/* Visibility toggle */}
        <div className={styles.slideSection}>
          <div className={styles.slideSectionTitle}>Visibility</div>
          <div className={styles.visibilityRow}>
            <ToggleSwitch
              checked={sub.public}
              disabled={toggling === sub.submission_id}
              onChange={() => onToggle(sub)}
            />
            <span className={styles.visibilityLabel}>
              {sub.public ? 'Public' : 'Hidden'}
            </span>
          </div>
        </div>

        {/* Prospect link */}
        {sub.prospect_slug && (
          <div className={styles.slideSection}>
            <div className={styles.slideSectionTitle}>Linked Prospect</div>
            <span className={styles.prospectLink}>{sub.prospect_slug}</span>
          </div>
        )}

        {/* Audit log */}
        <div className={styles.slideSection}>
          <div className={styles.slideSectionTitle}>Audit Log</div>
          <div className={styles.auditTimeline}>
            {sub.audit_log && sub.audit_log.length > 0 ? (
              sub.audit_log.map((entry, i) => (
                <div key={i} className={styles.auditEntry}>
                  <div className={styles.auditTime}>{formatDateTime(entry.at)}</div>
                  <div className={styles.auditAction}>
                    {entry.action === 'created' && 'Created by submitter'}
                    {entry.action === 'visibility_changed' &&
                      `Visibility set to ${entry.value ? 'public' : 'hidden'} by ${entry.by}`}
                    {entry.action !== 'created' &&
                      entry.action !== 'visibility_changed' &&
                      `${entry.action} by ${entry.by}`}
                  </div>
                  {entry.reason && (
                    <div className={styles.auditReason}>Reason: &ldquo;{entry.reason}&rdquo;</div>
                  )}
                </div>
              ))
            ) : (
              <div className={styles.auditEmpty}>No audit entries</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SubmissionDataView({ sub }: { sub: Submission }) {
  const ft = sub.form_type.toLowerCase()
  const d = sub.data || {}

  if (ft === 'review') {
    return (
      <div className="space-y-3">
        {sub.rating != null && (
          <div>
            <Stars rating={sub.rating} large />
          </div>
        )}
        {d.review_text && <p className={styles.dataText}>{d.review_text}</p>}
        {d.use_case && (
          <div>
            <span className={styles.dataLabel}>Use case:</span> {d.use_case}
          </div>
        )}
      </div>
    )
  }

  if (ft === 'case study') {
    return (
      <div className="space-y-2">
        {d.situation && <DataField label="Situation" value={d.situation} />}
        {d.issue && <DataField label="Issue" value={d.issue} />}
        {d.findings && <DataField label="Findings" value={d.findings} />}
        {d.result && <DataField label="Result" value={d.result} />}
        {d.time_saved && <DataField label="Time saved" value={d.time_saved} />}
        {d.dollar_impact && <DataField label="Dollar impact" value={d.dollar_impact} />}
      </div>
    )
  }

  if (ft === 'testimonial') {
    return (
      <div className="space-y-2">
        {d.video_summary && <DataField label="Video summary" value={d.video_summary} />}
        {d.profession && <DataField label="Profession" value={d.profession} />}
        {d.practice_area && <DataField label="Practice area" value={d.practice_area} />}
      </div>
    )
  }

  // Generic: render all data keys
  const entries = Object.entries(d)
  if (entries.length === 0) return <div className={styles.auditEmpty}>No data</div>
  return (
    <div className="space-y-2">
      {entries.map(([key, val]) => (
        <DataField key={key} label={key.replace(/_/g, ' ')} value={String(val)} />
      ))}
    </div>
  )
}

function DataField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className={styles.dataLabel}>{label}:</span>{' '}
      <span className={styles.dataValue}>{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main FormsPanel component
// ---------------------------------------------------------------------------
export default function FormsPanel() {
  // Data
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)

  // Filters
  const [platform, setPlatform] = useState('All')
  const [formType, setFormType] = useState('All')
  const [visibility, setVisibility] = useState('All')
  const [search, setSearch] = useState('')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // UI state
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null)
  const [toggling, setToggling] = useState<string | null>(null)
  const [hideTarget, setHideTarget] = useState<Submission | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [search])

  // Build query params
  const queryParams = useMemo(() => {
    const p: Record<string, any> = { limit: PAGE_SIZE, offset: 0 }
    if (platform !== 'All') p.platform = platform.toLowerCase()
    if (formType !== 'All') p.form_type = formType.toLowerCase()
    if (visibility === 'Public') p.public = 'true'
    if (visibility === 'Hidden') p.public = 'false'
    if (debouncedSearch) p.email = debouncedSearch
    return p
  }, [platform, formType, visibility, debouncedSearch])

  // Fetch on filter change
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setOffset(0)
    try {
      const res = await fetchSubmissions(queryParams)
      setSubmissions(res.submissions)
      setTotal(res.total)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load submissions')
      setSubmissions([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }, [queryParams])

  useEffect(() => {
    load()
  }, [load])

  // Load more
  const handleLoadMore = async () => {
    const newOffset = offset + PAGE_SIZE
    setLoadingMore(true)
    try {
      const res = await fetchSubmissions({ ...queryParams, offset: newOffset })
      setSubmissions((prev) => [...prev, ...res.submissions])
      setOffset(newOffset)
    } catch {
      showToast('error', 'Failed to load more')
    } finally {
      setLoadingMore(false)
    }
  }

  // Toast helper
  const showToast = (kind: ToastState['kind'], message: string) => {
    const id = Date.now()
    setToast({ id, kind, message })
    setTimeout(() => {
      setToast((cur) => (cur && cur.id === id ? null : cur))
    }, 4000)
  }

  // Toggle visibility
  const handleToggle = async (sub: Submission) => {
    if (sub.public) {
      // Turning OFF -> show reason prompt
      setHideTarget(sub)
    } else {
      // Turning ON -> no confirmation
      await doToggle(sub, true)
    }
  }

  const doToggle = async (sub: Submission, newPublic: boolean, reason?: string) => {
    setToggling(sub.submission_id)

    // Optimistic update
    const update = (list: Submission[]) =>
      list.map((s) => (s.submission_id === sub.submission_id ? { ...s, public: newPublic } : s))
    setSubmissions(update)
    if (selectedSub?.submission_id === sub.submission_id) {
      setSelectedSub({ ...sub, public: newPublic })
    }

    try {
      await patchVisibility(sub.submission_id, newPublic, reason)
      showToast('success', newPublic ? 'Review published' : 'Review hidden')
    } catch {
      // Revert
      const revert = (list: Submission[]) =>
        list.map((s) => (s.submission_id === sub.submission_id ? { ...s, public: !newPublic } : s))
      setSubmissions(revert)
      if (selectedSub?.submission_id === sub.submission_id) {
        setSelectedSub({ ...sub, public: !newPublic })
      }
      showToast('error', 'Failed to update visibility')
    } finally {
      setToggling(null)
    }
  }

  const handleHideConfirm = (reason: string) => {
    if (hideTarget) {
      doToggle(hideTarget, false, reason || undefined)
      setHideTarget(null)
    }
  }

  // Stats
  const reviewCount = submissions.filter((s) => s.form_type.toLowerCase() === 'review').length
  const publicCount = submissions.filter((s) => s.public).length
  const thisWeekCount = submissions.filter((s) => isWithinLastDays(s.created_at, 7)).length

  return (
    <div className={styles.formsPanel}>
      {/* Filter bar */}
      <div className={styles.filterBar}>
        <select
          className={styles.filterSelect}
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p} value={p}>
              {p === 'All' ? 'All Platforms' : p}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
        >
          {FORM_TYPES.map((t) => (
            <option key={t} value={t}>
              {t === 'All' ? 'All Types' : t}
            </option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        >
          {VISIBILITY_OPTIONS.map((v) => (
            <option key={v} value={v}>
              {v === 'All' ? 'All Visibility' : v}
            </option>
          ))}
        </select>

        <input
          type="text"
          className={styles.filterSearch}
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{total}</div>
          <div className={styles.statLabel}>Total Submissions</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{reviewCount}</div>
          <div className={styles.statLabel}>Reviews</div>
        </div>
        <div className={styles.statCard}>
          <div className={`${styles.statValue} ${styles.statGreen}`}>{publicCount}</div>
          <div className={styles.statLabel}>Public</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{thisWeekCount}</div>
          <div className={styles.statLabel}>This Week</div>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.loadingShimmer}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className={styles.shimmerRow} />
          ))}
        </div>
      ) : error ? (
        <div className={styles.errorMessage}>{error}</div>
      ) : submissions.length === 0 ? (
        <div className={styles.emptyState}>
          <svg
            className="w-8 h-8 text-slate-600 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>No submissions match your filters</span>
        </div>
      ) : (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.submissionsTable}>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Platform</th>
                  <th>Rating</th>
                  <th>Public</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr
                    key={sub.submission_id}
                    className={styles.tableRow}
                    onClick={() => setSelectedSub(sub)}
                  >
                    <td>
                      <span
                        className={styles.typeBadge}
                        style={{ backgroundColor: typeColor(sub.form_type) }}
                      >
                        {sub.form_type}
                      </span>
                    </td>
                    <td>{sub.anonymous ? 'Anonymous' : sub.submitter_name}</td>
                    <td>
                      <span className={styles.platformBadge}>
                        {sub.platform.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      {sub.rating != null ? <Stars rating={sub.rating} /> : '—'}
                    </td>
                    <td>
                      <ToggleSwitch
                        checked={sub.public}
                        disabled={toggling === sub.submission_id}
                        onChange={() => handleToggle(sub)}
                      />
                    </td>
                    <td className={styles.dateCell}>{formatDate(sub.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {submissions.length < total && (
            <button
              className={styles.loadMoreBtn}
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? 'Loading...' : 'Load more'}
            </button>
          )}
        </>
      )}

      {/* Detail slide-over */}
      {selectedSub && (
        <DetailPanel
          sub={selectedSub}
          onClose={() => setSelectedSub(null)}
          onToggle={handleToggle}
          toggling={toggling}
        />
      )}

      {/* Hide reason prompt */}
      {hideTarget && (
        <HideReasonPrompt
          onConfirm={handleHideConfirm}
          onCancel={() => setHideTarget(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.kind === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.message}
        </div>
      )}
    </div>
  )
}
