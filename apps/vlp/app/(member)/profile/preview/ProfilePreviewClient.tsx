'use client'

import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Award,
  Briefcase,
  Check,
  Clock,
  ExternalLink,
  Eye,
  Globe,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react'
import { HeroCard } from '@vlp/member-ui'
import { getDashboard } from '@/lib/api/dashboard'
import { getProfile } from '@/lib/api/member'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready'
      profile: Record<string, unknown> | null
      professionalId: string | null
      email: string
      fallbackName: string
    }

function getNested(obj: Record<string, unknown> | null, path: string): unknown {
  if (!obj) return undefined
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

function asString(v: unknown, fallback = ''): string {
  if (typeof v === 'string' && v.trim()) return v
  return fallback
}

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x) => typeof x === 'string')
  return []
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'VL'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function ProfilePreviewClient() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const dashboard = await getDashboard()
        if (cancelled) return
        const professionalId = dashboard.account.professional_id
        if (!professionalId) {
          setState({
            status: 'ready',
            profile: null,
            professionalId: null,
            email: dashboard.account.email,
            fallbackName: dashboard.account.name,
          })
          return
        }
        const profile = await getProfile(professionalId).catch(() => null)
        if (!cancelled) {
          setState({
            status: 'ready',
            profile,
            professionalId,
            email: dashboard.account.email,
            fallbackName: dashboard.account.name,
          })
        }
      } catch (err) {
        if (!cancelled)
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Could not load profile',
          })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (state.status === 'loading') return <PreviewSkeleton />
  if (state.status === 'error') return <PreviewFallback message={state.message} />

  const { profile, professionalId, email, fallbackName } = state

  if (!profile) {
    return (
      <div className="space-y-8">
        <div>
          <a
            href="/profile"
            className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </a>
          <h1 className="text-2xl font-semibold text-white">Profile Preview</h1>
          <p className="mt-1 text-sm text-white/50">
            This is how your profile appears in the public directory.
          </p>
        </div>
        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-10 text-center">
          <p className="text-sm text-white/40">
            Your directory profile is not set up yet.
          </p>
          <a
            href="/profile/onboarding"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-5 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            Complete your profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    )
  }

  const displayName =
    asString(getNested(profile, 'profile.display_name')) ||
    asString(getNested(profile, 'hero.headline')) ||
    fallbackName
  const credential =
    asString(getNested(profile, 'professional.credential')) ||
    asString(getNested(profile, 'hero.credential_label')) ||
    'Tax Professional'
  const city = asString(getNested(profile, 'contact.city'))
  const stateAbbrev = asString(getNested(profile, 'contact.state'))
  const location = [city, stateAbbrev].filter(Boolean).join(', ')
  const yearsExperience = getNested(profile, 'professional.years_experience')
  const credentialBadge =
    asString(getNested(profile, 'professional.credential')) ||
    asString(getNested(profile, 'hero.credential_label'))
  const bioShort = asString(getNested(profile, 'bio.bio_short'))
  const services = asArray(getNested(profile, 'services.items'))
  const contactEmail =
    asString(getNested(profile, 'contact.contact_email')) || email
  const phone = asString(getNested(profile, 'contact.phone'))
  const website = asString(getNested(profile, 'contact.website'))
  const firmName = asString(getNested(profile, 'professional.firm_name'))

  return (
    <div className="space-y-8">
      <div>
        <a
          href="/profile"
          className="mb-3 inline-flex items-center gap-1.5 text-sm text-white/40 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </a>
        <h1 className="text-2xl font-semibold text-white">Profile Preview</h1>
        <p className="mt-1 text-sm text-white/50">
          This is how your profile appears in the public directory.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 border-l-4 border-l-blue-400 bg-blue-500/5 px-5 py-4">
        <Eye className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
        <div>
          <p className="text-sm font-medium text-blue-300">Preview Mode</p>
          <p className="mt-0.5 text-xs text-blue-300/70">
            This is a preview of your public directory listing. Edits made on your Profile page appear here after saving.
          </p>
        </div>
      </div>

      <HeroCard brandColor="#f97316">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-hover text-2xl font-bold text-white">
            {initials(displayName)}
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            <p className="mt-1 text-sm font-medium text-brand-primary">{credential}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {location}
                </span>
              )}
              {typeof yearsExperience === 'number' && yearsExperience > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {yearsExperience}+ Years Experience
                </span>
              )}
              {credentialBadge && (
                <span className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {credentialBadge}
                </span>
              )}
            </div>
            {bioShort && (
              <p className="mt-4 text-sm leading-relaxed text-white/60">{bioShort}</p>
            )}
          </div>
        </div>
      </HeroCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Services Offered</h3>
          {services.length === 0 ? (
            <p className="mt-4 text-sm text-white/40">No services listed yet.</p>
          ) : (
            <div className="mt-4 flex flex-wrap gap-2">
              {services.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1 rounded-full border border-brand-primary/20 bg-brand-primary/5 px-3 py-1 text-xs font-medium text-brand-primary"
                >
                  <Check className="h-3 w-3" />
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Contact Information</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Mail className="h-4 w-4 text-white/30" />
              {contactEmail || '—'}
            </div>
            {phone && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="h-4 w-4 text-white/30" />
                {phone}
              </div>
            )}
            {website && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Globe className="h-4 w-4 text-white/30" />
                {website}
              </div>
            )}
            {firmName && (
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Briefcase className="h-4 w-4 text-white/30" />
                {firmName}
              </div>
            )}
          </div>
        </div>
      </div>

      {professionalId && (
        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6 text-center">
          <p className="text-sm text-white/50">
            Your public profile is live and visible to potential clients in the VLP directory.
          </p>
          <a
            href={`/profile/${professionalId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-5 py-2.5 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            View Live Public Profile
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}
    </div>
  )
}

function PreviewSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile Preview</h1>
        <p className="mt-1 text-sm text-white/50">Loading your public profile…</p>
      </div>
      <div className="h-40 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-48 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
        <div className="h-48 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      </div>
    </div>
  )
}

function PreviewFallback({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile Preview</h1>
        <p className="mt-1 text-sm text-white/50">
          This is how your profile appears in the public directory.
        </p>
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
