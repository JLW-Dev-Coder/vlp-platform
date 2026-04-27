'use client'

import { useEffect, useState } from 'react'
import { renderMarkdown } from '@/components/scale/MarkdownRenderer'
import UploadTab from '@/components/scale/UploadTab'
import CampaignTab from '../components/CampaignTab'
import DailyWorkflowPlanner from '../components/DailyWorkflowPlanner'
import KpiTab from '../components/KpiTab'
import OutreachTab from '../components/OutreachTab'
import SocialTab from '../components/SocialTab'
import styles from '../page.module.css'

// ---------------------------------------------------------------------------
// Workflow content (last tab)
// ---------------------------------------------------------------------------
function WorkflowContent() {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch('https://api.virtuallaunch.pro/v1/admin/scale/workflow', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.text()
      })
      .then((text) => {
        if (!cancelled) setMarkdown(text)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load WORKFLOW.md')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      {loading && (
        <div className="flex items-center justify-center py-16">
          <svg className={styles.spinner} viewBox="0 0 24 24" style={{ width: 28, height: 28 }}>
            <circle className={styles.spinnerCircle} cx="12" cy="12" r="10" />
          </svg>
        </div>
      )}

      {error && (
        <div className="text-center py-12 text-red-400/90 text-sm">Error: {error}</div>
      )}

      {!loading && !error && markdown !== null && (
        <div
          className={styles.workflowMarkdown}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
        />
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
// Page — 5-tab outreach command center
// ---------------------------------------------------------------------------
type Tab = 'planner' | 'upload' | 'posts' | 'outreach' | 'social' | 'kpi' | 'workflow'

const TAB_DESCRIPTIONS: Record<Tab, React.ReactNode> = {
  planner: 'Daily workflow planner — what to do today across email, social, content, and bookings',
  upload: 'Clay CSV upload and email pipeline monitor',
  posts: 'YouTube video scripts, community posts, or 10-day LinkedIn/FB campaign — Claude-authored, optional ClickUp tasks',
  outreach: 'LinkedIn cold connections from the prospect list with canned messages',
  social: (
    <>
      Scheduled posts synced from ClickUp + Reddit opportunity monitor
    </>
  ),
  kpi: 'Kwong campaign weekly snapshots — gala/inquiry leads, tax pro signups, claims filed vs. 10-week targets',
  workflow: (
    <>
      Synced from <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-amber-400/90">scale/WORKFLOW.md</code> — push updates via <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded border border-white/10 text-amber-400/90">node scale/push-workflow.js</code>
    </>
  ),
}

export default function WorkflowPage() {
  const [tab, setTab] = useState<Tab>('planner')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Outreach Command Center</h1>
        <p className="mt-1 text-sm text-slate-500 italic">
          {TAB_DESCRIPTIONS[tab]}
        </p>
      </div>

      <div className={styles.tabBar} role="tablist">
        {(['planner', 'upload', 'posts', 'outreach', 'social', 'kpi', 'workflow'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`${styles.tabButton} ${tab === t ? styles.tabButtonActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'planner' ? 'Planner' : t === 'upload' ? 'Email' : t === 'posts' ? 'Campaign' : t === 'outreach' ? 'Outreach' : t === 'social' ? 'Posts' : t === 'kpi' ? 'Campaign KPIs' : 'Workflow'}
          </button>
        ))}
      </div>

      {tab === 'planner' && <DailyWorkflowPlanner />}
      {tab === 'upload' && <UploadTab />}
      {tab === 'posts' && <CampaignTab />}
      {tab === 'outreach' && <OutreachTab />}
      {tab === 'social' && <SocialTab />}
      {tab === 'kpi' && <KpiTab />}
      {tab === 'workflow' && <WorkflowContent />}
    </div>
  )
}
