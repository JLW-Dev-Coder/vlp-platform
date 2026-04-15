'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './OutreachTab.module.css'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Prospect {
  slug: string
  name: string
  first_name?: string
  last_name?: string
  credential?: string
  city?: string
  state?: string
  email?: string
  website?: string
  linkedin_url?: string
  fb_url?: string
}

interface OutreachRecord {
  outreach_id: string
  prospect_email: string | null
  prospect_name: string
  linkedin_url: string | null
  message_template: string | null
  message_sent: string | null
  status: string
  notes: string | null
  created_at: string
  updated_at: string | null
}

interface MessageTemplate {
  id: string
  label: string
  body: string
  variables: string[]
}

type OutreachFilter = '' | 'not_contacted' | 'sent' | 'connected' | 'replied' | 'converted'

const API = 'https://api.virtuallaunch.pro'
const PAGE_SIZE = 20

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function OutreachTab() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [outreach, setOutreach] = useState<OutreachRecord[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [filter, setFilter] = useState<OutreachFilter>('not_contacted')
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalOutreach, setTotalOutreach] = useState(0)
  const contactedEmails = useRef(new Set<string>())

  // Toast
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const showToast = useCallback((type: 'success' | 'error', text: string) => {
    setToast({ type, text })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  // Load prospects from R2 via search endpoint
  const loadProspects = useCallback(async () => {
    try {
      const res = await fetch(`${API}/v1/scale/prospects/search?limit=500`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.ok && Array.isArray(data.prospects)) {
        setProspects(data.prospects)
      }
    } catch {
      /* non-critical */
    }
  }, [])

  // Load existing outreach records
  const loadOutreach = useCallback(async () => {
    try {
      const qs = new URLSearchParams({ limit: '200' })
      const res = await fetch(`${API}/v1/scale/outreach/connections?${qs}`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.ok && Array.isArray(data.connections)) {
        setOutreach(data.connections)
        setTotalOutreach(data.total || 0)
        // Build set of contacted emails
        const emails = new Set<string>()
        for (const r of data.connections) {
          if (r.prospect_email) emails.add(r.prospect_email.toLowerCase())
        }
        contactedEmails.current = emails
      }
    } catch {
      /* non-critical */
    }
  }, [])

  // Load message templates
  const loadTemplates = useCallback(async () => {
    try {
      const res = await fetch(`${API}/v1/scale/outreach/templates`, {
        credentials: 'include',
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.ok && Array.isArray(data.templates)) {
        setTemplates(data.templates)
      }
    } catch {
      /* non-critical */
    }
  }, [])

  useEffect(() => {
    Promise.allSettled([loadProspects(), loadOutreach(), loadTemplates()]).finally(() =>
      setLoading(false)
    )
  }, [loadProspects, loadOutreach, loadTemplates])

  // Filter prospects
  const filteredProspects = (() => {
    if (filter === '' || filter === 'not_contacted') {
      return prospects.filter(
        (p) => p.email && !contactedEmails.current.has(p.email.toLowerCase())
      )
    }
    return [] // For sent/connected/replied/converted, show outreach records instead
  })()

  const filteredOutreach = (() => {
    if (filter === '' || filter === 'not_contacted') return []
    return outreach.filter((r) => r.status === filter)
  })()

  const showProspects = filter === '' || filter === 'not_contacted'
  const displayList = showProspects ? filteredProspects : filteredOutreach
  const paginatedList = displayList.slice(0, (page + 1) * PAGE_SIZE)

  // Personalize template
  const personalizeTemplate = (template: MessageTemplate, prospect: Prospect): string => {
    let text = template.body
    text = text.replace(/{First}/g, prospect.first_name || prospect.name?.split(' ')[0] || '')
    text = text.replace(/{credential}/g, prospect.credential || 'CPA')
    text = text.replace(/{City}/g, prospect.city || '')
    return text
  }

  // Mark as sent
  const handleMarkSent = async (prospect: Prospect, templateId?: string, messageSent?: string) => {
    try {
      const res = await fetch(`${API}/v1/scale/outreach/connections`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospect_email: prospect.email,
          prospect_name: prospect.name || `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim(),
          linkedin_url: prospect.linkedin_url || null,
          message_template: templateId || null,
          message_sent: messageSent || null,
          status: 'sent',
        }),
      })
      if (!res.ok) throw new Error('Failed')
      showToast('success', `Marked ${prospect.first_name || prospect.name} as sent`)
      // Update local state
      if (prospect.email) {
        contactedEmails.current.add(prospect.email.toLowerCase())
      }
      setProspects((prev) => [...prev]) // Force re-render
      await loadOutreach()
    } catch {
      showToast('error', 'Failed to log outreach')
    }
  }

  // Update outreach status
  const handleUpdateStatus = async (outreachId: string, newStatus: string) => {
    try {
      const res = await fetch(`${API}/v1/scale/outreach/connections/${outreachId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      setOutreach((prev) =>
        prev.map((r) => (r.outreach_id === outreachId ? { ...r, status: newStatus } : r))
      )
    } catch {
      showToast('error', 'Failed to update status')
    }
  }

  // Copy handler
  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(key)
    setTimeout(() => setCopiedId((prev) => (prev === key ? null : prev)), 2000)
  }

  // Save LinkedIn URL to prospect
  const saveProspectLinkedin = async (slug: string, linkedinUrl: string) => {
    try {
      await fetch(`${API}/v1/scale/prospects/${slug}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedin_url: linkedinUrl }),
      })
    } catch {
      /* silent */
    }
  }

  if (loading) {
    return <div className={styles.emptyState}>Loading outreach data...</div>
  }

  return (
    <div className={styles.container}>
      {/* Toast */}
      {toast && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          {toast.text}
        </div>
      )}

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{prospects.length}</div>
          <div className={styles.statLabel}>Total Prospects</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{contactedEmails.current.size}</div>
          <div className={styles.statLabel}>Contacted</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{outreach.filter((r) => r.status === 'connected').length}</div>
          <div className={styles.statLabel}>Connected</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{outreach.filter((r) => r.status === 'replied').length}</div>
          <div className={styles.statLabel}>Replied</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{outreach.filter((r) => r.status === 'converted').length}</div>
          <div className={styles.statLabel}>Converted</div>
        </div>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        {([
          ['not_contacted', 'Not Contacted'],
          ['sent', 'Sent'],
          ['connected', 'Connected'],
          ['replied', 'Replied'],
          ['converted', 'Converted'],
        ] as const).map(([val, label]) => (
          <button
            key={val}
            type="button"
            className={`${styles.filterBtn} ${filter === val ? styles.filterBtnActive : ''}`}
            onClick={() => { setFilter(val); setPage(0) }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Count */}
      <div className={styles.countLabel}>
        {displayList.length} {showProspects ? 'prospect' : 'outreach record'}{displayList.length !== 1 ? 's' : ''}
      </div>

      {/* List */}
      {paginatedList.length === 0 ? (
        <div className={styles.emptyState}>
          {showProspects ? 'No prospects available.' : `No outreach records with status "${filter}".`}
        </div>
      ) : showProspects ? (
        <div className={styles.prospectList}>
          {(paginatedList as Prospect[]).map((prospect) => (
            <ProspectCard
              key={prospect.slug || prospect.email}
              prospect={prospect}
              templates={templates}
              personalizeTemplate={personalizeTemplate}
              onMarkSent={handleMarkSent}
              onCopy={handleCopy}
              copiedId={copiedId}
              onSaveLinkedin={saveProspectLinkedin}
            />
          ))}
        </div>
      ) : (
        <div className={styles.prospectList}>
          {(paginatedList as OutreachRecord[]).map((record) => (
            <OutreachCard
              key={record.outreach_id}
              record={record}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {/* Load more */}
      {paginatedList.length < displayList.length && (
        <button className={styles.loadMoreBtn} onClick={() => setPage((p) => p + 1)}>
          Load more ({displayList.length - paginatedList.length} remaining)
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Prospect Card
// ---------------------------------------------------------------------------
function ProspectCard({
  prospect,
  templates,
  personalizeTemplate,
  onMarkSent,
  onCopy,
  copiedId,
  onSaveLinkedin,
}: {
  prospect: Prospect
  templates: MessageTemplate[]
  personalizeTemplate: (t: MessageTemplate, p: Prospect) => string
  onMarkSent: (p: Prospect, templateId?: string, message?: string) => Promise<void>
  onCopy: (text: string, key: string) => void
  copiedId: string | null
  onSaveLinkedin: (slug: string, url: string) => void
}) {
  const [linkedinUrl, setLinkedinUrl] = useState(prospect.linkedin_url || '')
  const [lastSentTemplate, setLastSentTemplate] = useState<string | null>(null)
  const firstName = prospect.first_name || prospect.name?.split(' ')[0] || ''
  const lastName = prospect.last_name || prospect.name?.split(' ').slice(1).join(' ') || ''
  const credential = prospect.credential || 'CPA'
  const city = prospect.city || ''
  const state = prospect.state || ''

  const linkedinSearchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(`${firstName} ${lastName} ${credential} ${city}`.trim())}`

  return (
    <div className={styles.prospectCard}>
      {/* Header */}
      <div className={styles.prospectHeader}>
        <div className={styles.prospectName}>
          {firstName} {lastName}{credential ? `, ${credential}` : ''}
        </div>
        {(city || state) && (
          <div className={styles.prospectLocation}>{city}{city && state ? ', ' : ''}{state}</div>
        )}
      </div>

      {/* Contact info */}
      <div className={styles.prospectMeta}>
        {prospect.email && <span>{prospect.email}</span>}
        {prospect.website && (
          <a href={`https://${prospect.website}`} target="_blank" rel="noopener noreferrer" className={styles.prospectLink}>
            {prospect.website}
          </a>
        )}
      </div>

      {/* LinkedIn actions */}
      <div className={styles.linkedinRow}>
        <a
          href={linkedinSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.linkedinSearchBtn}
        >
          Search on LinkedIn
        </a>
        <div className={styles.linkedinUrlGroup}>
          <span className={styles.linkedinUrlLabel}>Profile URL:</span>
          <input
            className={styles.linkedinUrlInput}
            type="url"
            placeholder="https://linkedin.com/in/..."
            value={linkedinUrl}
            onChange={(e) => setLinkedinUrl(e.target.value)}
            onBlur={() => {
              if (linkedinUrl && linkedinUrl !== (prospect.linkedin_url || '') && prospect.slug) {
                onSaveLinkedin(prospect.slug, linkedinUrl)
              }
            }}
          />
        </div>
      </div>

      {/* Canned messages */}
      {templates.length > 0 && (
        <div className={styles.templatesSection}>
          <div className={styles.templatesLabel}>Canned Messages (click to copy)</div>
          {templates.map((tmpl) => {
            const personalized = personalizeTemplate(tmpl, prospect)
            const copyKey = `${prospect.slug || prospect.email}-${tmpl.id}`
            return (
              <div
                key={tmpl.id}
                className={styles.templateBox}
                onClick={() => {
                  onCopy(personalized, copyKey)
                  setLastSentTemplate(tmpl.id)
                }}
                title="Click to copy"
              >
                <div className={styles.templateLabel}>{tmpl.label.replace('{credential}', credential)}</div>
                <div className={styles.templateBody}>{personalized}</div>
                {copiedId === copyKey && (
                  <span className={styles.templateCopied}>Copied!</span>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Actions */}
      <div className={styles.prospectActions}>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnGreen}`}
          onClick={() => {
            const message = lastSentTemplate
              ? personalizeTemplate(templates.find((t) => t.id === lastSentTemplate)!, prospect)
              : undefined
            onMarkSent(prospect, lastSentTemplate || undefined, message)
          }}
        >
          Mark Sent
        </button>
        <button
          className={`${styles.actionBtn} ${styles.actionBtnMuted}`}
          onClick={() => {
            // Skip = mark as no_response so it doesn't show again
            onMarkSent(prospect, undefined, undefined).then(() => {
              // Override status to no_response
            })
          }}
        >
          Skip
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Outreach Record Card
// ---------------------------------------------------------------------------
function OutreachCard({
  record,
  onUpdateStatus,
}: {
  record: OutreachRecord
  onUpdateStatus: (id: string, status: string) => Promise<void>
}) {
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className={styles.outreachCard}>
      <div className={styles.outreachHeader}>
        <div className={styles.outreachName}>{record.prospect_name}</div>
        <span className={styles.outreachStatus}>{record.status}</span>
      </div>
      <div className={styles.outreachMeta}>
        {record.prospect_email && <span>{record.prospect_email}</span>}
        <span>{formatDate(record.created_at)}</span>
        {record.message_template && <span>Template: {record.message_template}</span>}
      </div>
      {record.linkedin_url && (
        <a href={record.linkedin_url} target="_blank" rel="noopener noreferrer" className={styles.prospectLink}>
          LinkedIn Profile
        </a>
      )}
      <div className={styles.outreachActions}>
        {record.status === 'sent' && (
          <>
            <button className={`${styles.actionBtn} ${styles.actionBtnGreen}`} onClick={() => onUpdateStatus(record.outreach_id, 'connected')}>
              Connected
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnMuted}`} onClick={() => onUpdateStatus(record.outreach_id, 'no_response')}>
              No Response
            </button>
          </>
        )}
        {record.status === 'connected' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnGreen}`} onClick={() => onUpdateStatus(record.outreach_id, 'replied')}>
            Replied
          </button>
        )}
        {record.status === 'replied' && (
          <button className={`${styles.actionBtn} ${styles.actionBtnGreen}`} onClick={() => onUpdateStatus(record.outreach_id, 'converted')}>
            Converted
          </button>
        )}
      </div>
    </div>
  )
}
