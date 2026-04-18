'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Coins, FileText, BarChart3, Zap, Upload, FolderOpen } from 'lucide-react'

import { KPICard, HeroCard, ContentCard, useAppShell } from '@vlp/member-ui'
import { useBalance } from '@/lib/balance-context'

const WORKER_BASE = 'https://api.taxmonitor.pro'

interface ReportEntry {
  report_id: string
  event_id?: string
  created_at?: string
  taxpayer_name?: string
  tax_year?: string
  transcript_type?: string
}

export default function DashboardClient() {
  const { session } = useAppShell()
  const { data: balanceData } = useBalance()
  const balance = balanceData?.transcript_tokens ?? 0
  const [reports, setReports] = useState<ReportEntry[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)
  const [totalReports, setTotalReports] = useState(0)

  useEffect(() => {
    // Fetch reports
    fetch(`${WORKER_BASE}/v1/transcripts/reports`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.reports) {
          setReports(data.reports)
          setTotalReports(data.reports.length)
        } else if (Array.isArray(data)) {
          setReports(data)
          setTotalReports(data.length)
        }
      })
      .catch(() => {})
      .finally(() => setReportsLoading(false))
  }, [])

  // Derive monthly stats from reports
  const now = new Date()
  const currentMonthName = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  const reportsThisMonth = reports.filter(r => {
    if (!r.created_at) return false
    const d = new Date(r.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  // Format member-since date from session (fallback to current month if not available)
  const memberSince = currentMonthName

  const recentReports = reports.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <HeroCard
        brandColor="#14b8a6"
        userName={(session.email ?? 'member').split('@')[0]}
        planName="Token-based Plan"
        memberSince={memberSince}
      />

      {/* KPI Grid — 2x2 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <KPICard
          label="Token Balance"
          value={String(balance)}
          subtitle={balance === 0 ? 'Buy tokens to parse transcripts' : undefined}
          trend="neutral"
          icon={Coins}
        />
        <KPICard
          label="Reports Saved"
          value={reportsLoading ? '...' : String(totalReports)}
          subtitle="All time"
          trend="neutral"
          icon={FileText}
        />
        <KPICard
          label="Reports This Month"
          value={reportsLoading ? '...' : String(reportsThisMonth)}
          subtitle={currentMonthName}
          trend="neutral"
          icon={BarChart3}
        />
        <KPICard
          label="Tokens Used This Month"
          value={reportsLoading ? '...' : String(reportsThisMonth)}
          subtitle={currentMonthName}
          trend="neutral"
          icon={Zap}
        />
        {/* TODO: add monthly stats endpoint for accurate tokens-used count */}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="mb-3 text-[11px] font-bold uppercase tracking-widest text-white/40">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link href="/app/tools/" className="group">
            <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-5 transition hover:bg-[var(--member-card-hover)]">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 transition group-hover:bg-teal-500/20">
                  <Upload className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">Parse a Transcript</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/60">Upload an IRS transcript PDF and generate a client report</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/app/reports/" className="group">
            <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-5 transition hover:bg-[var(--member-card-hover)]">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 transition group-hover:bg-teal-500/20">
                  <FolderOpen className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/90">View Reports</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-white/60">Browse and resend saved reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Reports */}
      <ContentCard title="Recent Reports">
        {reportsLoading ? (
          <p className="text-sm text-white/40">Loading reports...</p>
        ) : recentReports.length === 0 ? (
          <p className="text-sm text-white/40">No reports yet. Parse your first transcript to get started.</p>
        ) : (
          <div className="divide-y divide-[var(--member-border)]">
            {recentReports.map((report) => {
              const date = report.created_at
                ? new Date(report.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Unknown date'
              const label = [
                report.taxpayer_name,
                report.transcript_type,
                report.tax_year,
              ].filter(Boolean).join(' \u2014 ') || report.report_id

              return (
                <div key={report.report_id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/80">{label}</p>
                    <p className="text-xs text-white/40">{date}</p>
                  </div>
                  <Link
                    href={`/app/report/?report_id=${report.report_id}`}
                    className="ml-4 shrink-0 text-[13px] font-medium text-teal-400 hover:text-teal-300"
                  >
                    View
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </ContentCard>
    </div>
  )
}
