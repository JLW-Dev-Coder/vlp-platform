'use client'

import { useMemo, useState } from 'react'
import styles from './DailyWorkflowPlanner.module.css'

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

interface CampaignDay {
  day: number
  theme: string
  ttmpAngle: string
  tcvlpAngle: string
}

const CAMPAIGN_DAYS: CampaignDay[] = [
  { day: 1, theme: 'Pain Point', ttmpAngle: 'Hours lost manually reviewing transcripts', tcvlpAngle: 'Hours lost manually preparing Form 843' },
  { day: 2, theme: 'Social Proof', ttmpAngle: 'EA saved 6 hrs/week with automated parsing', tcvlpAngle: 'CPA filed 12 abatements in one afternoon' },
  { day: 3, theme: 'Deadline Urgency', ttmpAngle: 'Tax season backlog compounds daily', tcvlpAngle: 'Kwong v. US window closes July 2026' },
  { day: 4, theme: 'Cost Comparison', ttmpAngle: '$19/mo vs $150/hr manual review', tcvlpAngle: '$10/mo vs 2-4 hrs per Form 843' },
  { day: 5, theme: 'Feature Deep-Dive', ttmpAngle: 'Code lookup + automated penalty detection', tcvlpAngle: 'Transcript upload → Form 843 in minutes' },
  { day: 6, theme: 'Cross-Sell', ttmpAngle: 'Transcript parsing feeds penalty ID → TCVLP', tcvlpAngle: 'TCVLP pairs with TTMP for full workflow' },
  { day: 7, theme: 'Authority', ttmpAngle: 'Built for EAs, CPAs, and tax attorneys', tcvlpAngle: 'Kwong ruling explained — what it means for your clients' },
  { day: 8, theme: 'Objection Handling', ttmpAngle: '"I already review transcripts manually" — here is what you miss', tcvlpAngle: '"I only have a few penalty cases" — $10/mo still saves hours' },
  { day: 9, theme: 'Case Study', ttmpAngle: 'Solo EA practice: 348 hrs/yr recovered', tcvlpAngle: 'Local firm: 15 Form 843s filed before deadline' },
  { day: 10, theme: 'Final CTA', ttmpAngle: 'Free code lookup — see what your transcripts reveal', tcvlpAngle: 'Free penalty estimate — see what Kwong means for your clients' },
]

const FB_GROUPS = [
  'Tax Pros on Facebook',
  'Enrolled Agents Network',
  'CPA Firm Owners',
  'Tax Resolution Professionals',
  'IRS Representation & Tax Resolution',
  'Tax Preparation & Planning',
  'Small Firm Tax Pros',
  'Women in Tax',
]

const REDDIT_SUBS = [
  'r/tax',
  'r/taxpros',
  'r/Accounting',
  'r/IRS',
  'r/taxpreparer',
  'r/CPA',
]

const KWONG_DEADLINE = new Date('2026-07-01T00:00:00')

const CAL_LINKS = {
  tcvlp: 'https://cal.com/tax-monitor-pro/tcvlp-intro',
  ttmp: 'https://cal.com/tax-monitor-pro/ttmp-discovery',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Checklist item
// ---------------------------------------------------------------------------

interface ChecklistItem {
  id: string
  label: string
  detail?: string
  category: 'email' | 'social' | 'content' | 'booking' | 'admin'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DailyWorkflowPlanner() {
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const today = useMemo(() => new Date(), [])
  const campaignDayIndex = useMemo(() => getDayOfYear(today) % 10, [today])
  const campaignDay = CAMPAIGN_DAYS[campaignDayIndex]

  const daysUntilKwong = useMemo(() => {
    const diff = KWONG_DEADLINE.getTime() - today.getTime()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }, [today])

  const todayFbGroup = useMemo(() => FB_GROUPS[getDayOfYear(today) % FB_GROUPS.length], [today])
  const todayRedditSub = useMemo(() => REDDIT_SUBS[getDayOfYear(today) % REDDIT_SUBS.length], [today])

  const checklist = useMemo<ChecklistItem[]>(() => [
    { id: 'email-check', label: 'Check email pipeline status', detail: 'Review batch logs at /scale — verify sends, bounces, replies', category: 'email' },
    { id: 'email-replies', label: 'Respond to inbound replies', detail: 'Check Gmail for prospect responses, update CRM', category: 'email' },
    { id: 'social-fb', label: `Engage in FB group: ${todayFbGroup}`, detail: `Post or comment using Day ${campaignDay.day} theme: "${campaignDay.theme}"`, category: 'social' },
    { id: 'social-reddit', label: `Check ${todayRedditSub} for opportunities`, detail: 'Find pain-point posts, comment with value (no direct pitch)', category: 'social' },
    { id: 'social-linkedin', label: 'LinkedIn: 5 connection requests + 3 comments', detail: 'Target EAs, CPAs, tax attorneys — use outreach tab for canned messages', category: 'social' },
    { id: 'content-ttmp', label: `TTMP post: ${campaignDay.ttmpAngle}`, detail: `Campaign Day ${campaignDay.day} — "${campaignDay.theme}" angle for LinkedIn + FB`, category: 'content' },
    { id: 'content-tcvlp', label: `TCVLP post: ${campaignDay.tcvlpAngle}`, detail: `Campaign Day ${campaignDay.day} — "${campaignDay.theme}" angle for LinkedIn + FB`, category: 'content' },
    { id: 'booking-check', label: 'Check Cal.com for new bookings', detail: 'Prep for any scheduled calls — review prospect asset page before call', category: 'booking' },
    { id: 'booking-followup', label: 'Follow up on yesterday\'s calls', detail: 'Send recap email, Stripe link if qualified, or next-step booking', category: 'booking' },
    { id: 'admin-metrics', label: 'Log daily metrics', detail: 'Emails sent, opens, clicks, bookings, conversions — update /scale analytics', category: 'admin' },
  ], [campaignDay, todayFbGroup, todayRedditSub])

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const completedCount = checked.size
  const totalCount = checklist.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const categoryLabels: Record<string, string> = {
    email: 'Email Pipeline',
    social: 'Social Engagement',
    content: 'Content Creation',
    booking: 'Bookings & Calls',
    admin: 'Admin & Metrics',
  }

  const groupedChecklist = useMemo(() => {
    const groups: Record<string, ChecklistItem[]> = {}
    for (const item of checklist) {
      if (!groups[item.category]) groups[item.category] = []
      groups[item.category].push(item)
    }
    return groups
  }, [checklist])

  return (
    <div className={styles.planner}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.dateTitle}>{formatDate(today)}</h2>
          <p className={styles.subtitle}>
            Campaign Day {campaignDay.day} of 10 — Theme: <span className={styles.themeHighlight}>{campaignDay.theme}</span>
          </p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.deadlineCard}>
            <span className={styles.deadlineNumber}>{daysUntilKwong}</span>
            <span className={styles.deadlineLabel}>days to Kwong deadline</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressHeader}>
          <span className={styles.progressLabel}>Daily progress</span>
          <span className={styles.progressCount}>{completedCount}/{totalCount} tasks</span>
        </div>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Quick links */}
      <div className={styles.quickLinks}>
        <a
          href={CAL_LINKS.ttmp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          TTMP Discovery Call
        </a>
        <a
          href={CAL_LINKS.tcvlp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.quickLink}
        >
          TCVLP Intro Call
        </a>
        <span className={styles.quickLinkDivider} />
        <span className={styles.quickLinkInfo}>
          FB: {todayFbGroup}
        </span>
        <span className={styles.quickLinkInfo}>
          Reddit: {todayRedditSub}
        </span>
      </div>

      {/* Checklist */}
      <div className={styles.checklistGrid}>
        {Object.entries(groupedChecklist).map(([category, items]) => (
          <div key={category} className={styles.checklistGroup}>
            <h3 className={styles.groupTitle}>{categoryLabels[category] ?? category}</h3>
            <div className={styles.groupItems}>
              {items.map((item) => {
                const done = checked.has(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`${styles.checklistItem} ${done ? styles.checklistItemDone : ''}`}
                    onClick={() => toggle(item.id)}
                  >
                    <span className={styles.checkbox}>
                      {done && (
                        <svg viewBox="0 0 16 16" fill="none" className={styles.checkIcon}>
                          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    <div className={styles.checklistText}>
                      <span className={styles.checklistLabel}>{item.label}</span>
                      {item.detail && (
                        <span className={styles.checklistDetail}>{item.detail}</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Campaign angles for today */}
      <div className={styles.anglesSection}>
        <h3 className={styles.anglesTitle}>Today&apos;s Campaign Angles (Day {campaignDay.day})</h3>
        <div className={styles.anglesGrid}>
          <div className={styles.angleCard}>
            <span className={styles.angleCardPlatform}>TTMP</span>
            <p className={styles.angleCardText}>{campaignDay.ttmpAngle}</p>
          </div>
          <div className={styles.angleCard}>
            <span className={styles.angleCardPlatform}>TCVLP</span>
            <p className={styles.angleCardText}>{campaignDay.tcvlpAngle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
