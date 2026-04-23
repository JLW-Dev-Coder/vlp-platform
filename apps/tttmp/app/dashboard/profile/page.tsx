'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { Camera, Mail, UserPen } from 'lucide-react'
import { tttmpConfig } from '@/lib/platform-config'

const API_BASE = tttmpConfig.apiBaseUrl

interface Session {
  account_id: string
  email: string
}

interface AccountDetails {
  account_id: string
  email: string
  created_at?: string
}

interface Profile {
  professional_id?: string
  display_name?: string | null
  bio?: string | null
  role?: string | null
  credentials?: string | null
  phone?: string | null
  website?: string | null
  photo_url?: string | null
  [k: string]: unknown
}

interface Preferences {
  email_notifications?: boolean
  game_reminders?: boolean
  marketing_emails?: boolean
  theme?: string
  [k: string]: unknown
}

function formatMonthYear(iso?: string | null) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function initials(name?: string | null, fallback?: string | null): string {
  const source = (name || fallback || '').trim()
  if (!source) return 'TT'
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length === 0) return source.slice(0, 2).toUpperCase()
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('1')) {
    const a = digits.slice(1, 4)
    const b = digits.slice(4, 7)
    const c = digits.slice(7, 11)
    return `+1 (${a}) ${b}-${c}`
  }
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  return input.trim()
}

function ProfileContent() {
  const [session, setSession] = useState<Session | null>(null)
  const [account, setAccount] = useState<AccountDetails | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [prefs, setPrefs] = useState<Preferences | null>(null)
  const [loading, setLoading] = useState(true)
  const [editDetails, setEditDetails] = useState(false)
  const [editContact, setEditContact] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  // form state
  const [fDisplayName, setFDisplayName] = useState('')
  const [fBio, setFBio] = useState('')
  const [fRole, setFRole] = useState('')
  const [fPhone, setFPhone] = useState('')
  const [fWebsite, setFWebsite] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const sRes = await fetch(`${API_BASE}/v1/auth/session`, { credentials: 'include' })
        const sJson = await sRes.json().catch(() => null)
        const sess: Session | undefined = sJson?.session
        if (!sess?.account_id) {
          if (!cancelled) setLoading(false)
          return
        }
        if (cancelled) return
        setSession(sess)

        const [accRes, profRes, prefRes] = await Promise.all([
          fetch(`${API_BASE}/v1/accounts/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/profiles/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
          fetch(`${API_BASE}/v1/accounts/preferences/${sess.account_id}`, { credentials: 'include' }).catch(() => null),
        ])

        if (!cancelled && accRes?.ok) {
          const aj = await accRes.json().catch(() => null)
          setAccount(aj?.account || { account_id: sess.account_id, email: sess.email })
        } else if (!cancelled) {
          setAccount({ account_id: sess.account_id, email: sess.email })
        }

        if (!cancelled && profRes?.ok) {
          const pj = await profRes.json().catch(() => null)
          const p: Profile | null = pj?.profile || pj || null
          setProfile(p)
          setFDisplayName(p?.display_name || '')
          setFBio(p?.bio || '')
          setFRole(p?.role || p?.credentials || '')
          setFPhone(p?.phone || '')
          setFWebsite(p?.website || '')
        }

        if (!cancelled && prefRes?.ok) {
          const rj = await prefRes.json().catch(() => null)
          setPrefs(rj?.preferences || rj || {})
        } else if (!cancelled) {
          setPrefs({})
        }
      } catch {
        // degrade gracefully
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const displayName = profile?.display_name || (session?.email ? session.email.split('@')[0] : '') || ''
  const bio = profile?.bio || ''
  const role = profile?.role || profile?.credentials || ''
  const phone = profile?.phone || ''
  const website = profile?.website || ''
  const photoUrl = profile?.photo_url || ''

  const completeness = useMemo(() => {
    let pct = 0
    if (displayName) pct += 20
    if (bio) pct += 20
    if (photoUrl) pct += 20
    if (phone) pct += 10
    if (website) pct += 10
    if (role) pct += 20
    return pct
  }, [displayName, bio, photoUrl, phone, website, role])

  const completenessTip = useMemo(() => {
    const missing: string[] = []
    if (!photoUrl) missing.push('a profile photo')
    if (!bio) missing.push('a short bio')
    if (!role) missing.push('your role')
    if (!phone) missing.push('a phone number')
    if (!website) missing.push('a website')
    if (missing.length === 0) return 'Your profile is complete — nice!'
    const list = missing.slice(0, 2).join(' and ')
    return `Add ${list} to increase visibility.`
  }, [photoUrl, bio, role, phone, website])

  async function saveProfile(patch: Partial<Profile>) {
    if (!session) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch(`${API_BASE}/v1/profiles/${session.account_id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error('Save failed')
      const j = await res.json().catch(() => null)
      const updated: Profile = j?.profile || { ...(profile || {}), ...patch }
      setProfile(updated)
      setMessage({ type: 'ok', text: 'Profile updated.' })
    } catch {
      setMessage({ type: 'err', text: 'Could not save. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  async function savePreferences(patch: Partial<Preferences>) {
    if (!session) return
    const next = { ...(prefs || {}), ...patch }
    setPrefs(next)
    try {
      await fetch(`${API_BASE}/v1/accounts/preferences/${session.account_id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
    } catch {
      // keep optimistic update; user can retry
    }
  }

  async function handlePhotoUpload(file: File) {
    if (!session || !file) return
    setUploading(true)
    setMessage(null)
    try {
      const initRes = await fetch(`${API_BASE}/v1/accounts/photo-upload-init`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type || 'image/jpeg',
          size: file.size,
        }),
      })
      if (!initRes.ok) throw new Error('init failed')
      const initJson = await initRes.json()
      const uploadUrl: string | undefined = initJson.upload_url || initJson.url
      const uploadKey: string | undefined = initJson.key || initJson.upload_key || initJson.photo_key

      if (uploadUrl) {
        const putRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'image/jpeg' },
          body: file,
        })
        if (!putRes.ok) throw new Error('upload failed')
      }

      const doneRes = await fetch(`${API_BASE}/v1/accounts/photo-upload-complete`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: uploadKey }),
      })
      if (!doneRes.ok) throw new Error('finalize failed')
      const doneJson = await doneRes.json().catch(() => null)
      const newUrl: string | undefined = doneJson?.photo_url || doneJson?.url
      if (newUrl) {
        setProfile((p) => ({ ...(p || {}), photo_url: newUrl }))
      }
      setMessage({ type: 'ok', text: 'Photo updated.' })
    } catch {
      setMessage({ type: 'err', text: 'Photo upload failed. Please try again.' })
    } finally {
      setUploading(false)
    }
  }

  function triggerPhotoPicker() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = () => {
      const f = input.files?.[0]
      if (f) handlePhotoUpload(f)
    }
    input.click()
  }

  if (loading) {
    return (
      <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-[var(--arcade-text-muted)]">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <h1
            className="font-sora text-3xl font-extrabold text-white"
            style={{ textShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
          >
            Profile
          </h1>
          <p className="mt-1 text-[0.95rem] text-[var(--arcade-text-muted)]">
            Manage your profile and preferences.
          </p>
        </header>

        {message && (
          <div
            className="mb-6 rounded-lg border px-4 py-3 text-sm"
            style={{
              background:
                message.type === 'ok' ? 'rgba(34, 197, 94, 0.08)' : 'rgba(239, 68, 68, 0.08)',
              borderColor:
                message.type === 'ok' ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)',
              color: message.type === 'ok' ? 'var(--neon-green)' : '#f87171',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Completeness */}
        <section className="arcade-card mb-6 p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Profile Completeness</h2>
            <span className="font-sora text-xl font-extrabold" style={{ color: 'var(--neon-violet)' }}>
              {completeness}%
            </span>
          </div>
          <div
            className="h-3 w-full overflow-hidden rounded-full"
            style={{ background: 'var(--arcade-surface-hover)' }}
          >
            <div
              className="h-full rounded-full transition-[width]"
              style={{
                width: `${completeness}%`,
                background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                boxShadow: '0 0 16px rgba(139, 92, 246, 0.5)',
              }}
            />
          </div>
          <p className="mt-3 text-xs text-[var(--arcade-text-muted)]">{completenessTip}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Personal Details */}
          <section className="arcade-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Personal Details</h2>
            {editDetails ? (
              <div className="space-y-4">
                <Field label="Display Name">
                  <input
                    type="text"
                    value={fDisplayName}
                    onChange={(e) => setFDisplayName(e.target.value)}
                    className="arcade-input"
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    value={fBio}
                    onChange={(e) => setFBio(e.target.value)}
                    rows={3}
                    className="arcade-input resize-none"
                  />
                </Field>
                <Field label="Role">
                  <select
                    value={fRole}
                    onChange={(e) => setFRole(e.target.value)}
                    className="arcade-input"
                  >
                    <option value="">Not specified</option>
                    <option value="Tax Professional">Tax Professional</option>
                    <option value="Taxpayer">Taxpayer</option>
                    <option value="Student">Student</option>
                  </select>
                </Field>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      await saveProfile({
                        display_name: fDisplayName,
                        bio: fBio,
                        role: fRole,
                      })
                      setEditDetails(false)
                    }}
                    className="arcade-btn arcade-btn-primary inline-flex h-10 items-center px-5 text-sm"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFDisplayName(profile?.display_name || '')
                      setFBio(profile?.bio || '')
                      setFRole(profile?.role || profile?.credentials || '')
                      setEditDetails(false)
                    }}
                    className="arcade-btn arcade-btn-secondary inline-flex h-10 items-center px-5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <LabelValue label="Display Name" value={displayName || 'Not set'} />
                <LabelValue label="Bio" value={bio || 'Not set'} />
                <LabelValue label="Role" value={role || 'Not specified'} />
                <LabelValue label="Member Since" value={formatMonthYear(account?.created_at)} />
              </div>
            )}
          </section>

          {/* Profile Preview */}
          <section className="arcade-card flex flex-col items-center p-6 text-center">
            <h2 className="mb-4 self-start text-lg font-semibold text-white">Profile Preview</h2>
            <div className="flex flex-1 flex-col items-center justify-center py-2">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={displayName || 'Profile photo'}
                  className="h-20 w-20 rounded-full object-cover"
                  style={{ boxShadow: '0 0 18px rgba(139, 92, 246, 0.55)' }}
                />
              ) : (
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full font-sora text-xl font-extrabold text-white"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    boxShadow: '0 0 18px rgba(139, 92, 246, 0.55)',
                  }}
                >
                  {initials(displayName, session?.email)}
                </div>
              )}
              <p className="mt-3 font-sora text-lg font-bold text-white">{displayName || '—'}</p>
              {role && (
                <p className="mt-1 text-xs text-[var(--arcade-text-muted)]">{role}</p>
              )}
              {bio && (
                <p className="mt-2 max-w-sm text-sm italic text-[var(--arcade-text-muted)]">
                  “{bio}”
                </p>
              )}
            </div>
            {profile?.professional_id ? (
              <Link
                href={`/professionals/${profile.professional_id}`}
                className="mt-4 text-sm font-semibold hover:underline"
                style={{ color: 'var(--neon-cyan)' }}
              >
                View Public Profile →
              </Link>
            ) : (
              <span className="mt-4 text-xs text-[var(--arcade-text-muted)]">
                Public profile coming soon
              </span>
            )}
          </section>

          {/* Contact Information */}
          <section className="arcade-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Contact Information</h2>
            {editContact ? (
              <div className="space-y-4">
                <Field label="Phone">
                  <input
                    type="tel"
                    value={fPhone}
                    onChange={(e) => setFPhone(e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="arcade-input"
                  />
                </Field>
                <Field label="Website">
                  <input
                    type="url"
                    value={fWebsite}
                    onChange={(e) => setFWebsite(e.target.value)}
                    placeholder="https://example.com"
                    className="arcade-input"
                  />
                </Field>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={async () => {
                      await saveProfile({
                        phone: normalizePhone(fPhone),
                        website: fWebsite.trim(),
                      })
                      setEditContact(false)
                    }}
                    className="arcade-btn arcade-btn-primary inline-flex h-10 items-center px-5 text-sm"
                  >
                    {saving ? 'Saving…' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFPhone(profile?.phone || '')
                      setFWebsite(profile?.website || '')
                      setEditContact(false)
                    }}
                    className="arcade-btn arcade-btn-secondary inline-flex h-10 items-center px-5 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">
                    Email
                  </p>
                  <p className="mt-1 text-sm text-[var(--arcade-text)]">
                    {session?.email || account?.email || '—'}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--arcade-text-muted)]">
                    Change from <Link href="/account" className="hover:underline" style={{ color: 'var(--neon-violet)' }}>Account</Link>
                  </p>
                </div>
                <LabelValue label="Phone" value={phone || 'Not set'} />
                <LabelValue label="Website" value={website || 'Not set'} />
              </div>
            )}
          </section>

          {/* Preferences */}
          <section className="arcade-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Preferences</h2>
            <div className="space-y-4">
              <ToggleRow
                label="Email Notifications"
                value={!!prefs?.email_notifications}
                onChange={(v) => savePreferences({ email_notifications: v })}
              />
              <ToggleRow
                label="Game Reminders"
                value={!!prefs?.game_reminders}
                onChange={(v) => savePreferences({ game_reminders: v })}
              />
              <ToggleRow
                label="Marketing Emails"
                value={!!prefs?.marketing_emails}
                onChange={(v) => savePreferences({ marketing_emails: v })}
              />
              <div className="border-t pt-4" style={{ borderColor: 'var(--arcade-border)' }}>
                <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">
                  Theme
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{
                      background: 'var(--neon-violet)',
                      boxShadow: '0 0 8px rgba(139, 92, 246, 0.6)',
                    }}
                  />
                  <span className="text-sm text-white">Dark (Arcade)</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Edit actions */}
        <section className="mt-6">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
            Edit Profile
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <ActionCard
              icon={<UserPen className="h-5 w-5" />}
              label="Edit Details"
              onClick={() => setEditDetails((v) => !v)}
              active={editDetails}
            />
            <ActionCard
              icon={<Camera className="h-5 w-5" />}
              label={uploading ? 'Uploading…' : 'Upload Photo'}
              onClick={triggerPhotoPicker}
              disabled={uploading}
            />
            <ActionCard
              icon={<Mail className="h-5 w-5" />}
              label="Update Contact Info"
              onClick={() => setEditContact((v) => !v)}
              active={editContact}
            />
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">
        {label}
      </span>
      {children}
    </label>
  )
}

function LabelValue({ label, value }: { label: string; value: string }) {
  const isEmpty = value === 'Not set' || value === 'Not specified' || value === '—'
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-[var(--arcade-text-muted)]">{label}</p>
      <p
        className="mt-1 text-sm"
        style={{ color: isEmpty ? 'var(--arcade-text-muted)' : 'var(--arcade-text)' }}
      >
        {value}
      </p>
    </div>
  )
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className="relative inline-flex h-6 w-11 flex-shrink-0 rounded-full transition-colors"
        style={{
          background: value ? 'var(--neon-violet)' : 'var(--arcade-surface-hover)',
          border: '1px solid var(--arcade-border)',
          boxShadow: value ? '0 0 12px rgba(139, 92, 246, 0.5)' : 'none',
        }}
      >
        <span
          className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
          style={{
            transform: value ? 'translateX(22px)' : 'translateX(4px)',
            marginTop: '3px',
          }}
        />
      </button>
    </div>
  )
}

function ActionCard({
  icon,
  label,
  onClick,
  active,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="arcade-card-interactive flex items-center gap-3 p-4 text-left disabled:opacity-60"
      style={active ? { borderColor: 'var(--neon-violet)', boxShadow: 'var(--arcade-glow-violet)' } : undefined}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--neon-violet)' }}
      >
        {icon}
      </span>
      <span className="text-sm font-semibold text-white">{label}</span>
    </button>
  )
}

export default function ProfilePage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <ProfileContent />
      </AppShell>
    </AuthGate>
  )
}
