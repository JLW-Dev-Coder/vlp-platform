'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  Eye,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  Inbox,
} from 'lucide-react'
import { KPICard, ContentCard } from '@vlp/member-ui'
import { getDashboard } from '@/lib/api/dashboard'
import { getProfile } from '@/lib/api/member'
import type { DashboardPayload } from '@/lib/api/types'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      dashboard: DashboardPayload
      profile: Record<string, unknown> | null
    }

function isProfileComplete(profile: Record<string, unknown> | null): boolean {
  if (!profile) return false
  const required = ['profile', 'contact', 'services']
  return required.every((k) => {
    const section = profile[k]
    return section && typeof section === 'object' && Object.keys(section as Record<string, unknown>).length > 0
  })
}

export default function DashboardClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dashboard = await getDashboard()
        let profile: Record<string, unknown> | null = null
        if (dashboard.account.professional_id) {
          try {
            profile = await getProfile(dashboard.account.professional_id)
          } catch {
            profile = null
          }
        }
        if (!cancelled) setState({ status: 'ready', dashboard, profile })
      } catch (err) {
        if (!cancelled) setState({ status: 'error', message: (err as Error)?.message ?? 'Unknown error' })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') return <DashboardSkeleton />
  if (state.status === 'error') return <DashboardFallback message={state.message} />

  const { dashboard, profile } = state
  const profileComplete = isProfileComplete(profile)
  const inquiriesThisMonth = 0
  const profileViews = 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Welcome back{dashboard.account.name ? `, ${dashboard.account.name.split(' ')[0]}` : ''}.
        </p>
      </div>

      {!profileComplete && (
        <div className="rounded-xl border border-brand-primary/40 bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest text-brand-primary">Action Required</p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                Complete Your Profile to Start Receiving Leads
              </h2>
              <p className="mt-2 text-sm text-white/70">
                Add your credential, location, and services to go live in the directory.
                Taxpayers in your area are searching right now.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-5 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90"
            >
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          label="Inquiries This Month"
          value={String(inquiriesThisMonth)}
          subtitle={inquiriesThisMonth === 0 ? 'No inquiries yet' : 'This month'}
          icon={MessageSquare}
        />
        <KPICard
          label="Profile Views"
          value={String(profileViews)}
          subtitle={profileComplete ? 'This month' : 'Profile not live'}
          icon={Eye}
        />
        <KPICard
          label="Response Rate"
          value="—"
          subtitle="Awaiting first inquiry"
          icon={TrendingUp}
        />
      </div>

      <ContentCard title="Recent Inquiries">
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <Inbox className="h-6 w-6 text-brand-primary" />
          </div>
          <p className="mt-4 text-sm font-medium text-white">No inquiries yet</p>
          <p className="mt-1 max-w-sm text-sm text-white/50">
            {profileComplete
              ? 'Once a taxpayer in your area submits an inquiry, it will appear here.'
              : 'Complete your profile to start receiving leads from taxpayers in your area.'}
          </p>
          {!profileComplete && (
            <Link
              href="/profile"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
            >
              Complete Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
          {profileComplete && (
            <Link
              href="/messages"
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-brand-primary/30 px-4 py-2 text-sm font-medium text-brand-primary transition hover:bg-brand-primary/10"
            >
              View Messaging
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </ContentCard>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Loading your overview…</p>
      </div>
      <div className="h-32 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
    </div>
  )
}

function DashboardFallback({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">Welcome back.</p>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">Could not load live data</p>
          <p className="mt-1 text-amber-200/70">{message}</p>
        </div>
      </div>
    </div>
  )
}
