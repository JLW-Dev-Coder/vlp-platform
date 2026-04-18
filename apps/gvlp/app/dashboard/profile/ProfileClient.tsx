'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  User,
  Award,
  Clock,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Building2,
  MapPin,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { HeroCard, useAppShell } from '@vlp/member-ui';
import { API_BASE } from '@/lib/api';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | {
      status: 'ready';
      profile: Record<string, unknown> | null;
      email: string;
      fallbackName: string;
    };

function getNested(obj: Record<string, unknown> | null, path: string): unknown {
  if (!obj) return undefined;
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function asString(v: unknown, fallback = '—'): string {
  if (typeof v === 'string' && v.trim()) return v;
  return fallback;
}

function computeCompleteness(profile: Record<string, unknown> | null): number {
  if (!profile) return 0;
  const sections = ['profile', 'contact', 'services', 'hero', 'languages'];
  const present = sections.filter((k) => {
    const section = profile[k];
    if (!section || typeof section !== 'object') return false;
    return Object.keys(section as Record<string, unknown>).length > 0;
  }).length;
  return Math.round((present / sections.length) * 100);
}

export default function ProfileClient() {
  const { session } = useAppShell();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const dashRes = await fetch(`${API_BASE}/v1/dashboard`, {
          credentials: 'include',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!dashRes.ok) {
          const body = await dashRes.json().catch(() => ({}));
          throw new Error(
            (body as { message?: string })?.message ?? `Dashboard request failed (${dashRes.status})`
          );
        }
        const dashData = (await dashRes.json()) as {
          ok: boolean;
          dashboard: { account: { email: string; name: string; professional_id?: string | null } };
        };
        if (cancelled) return;
        const account = dashData.dashboard.account;
        const professionalId = account.professional_id;
        if (!professionalId) {
          setState({
            status: 'ready',
            profile: null,
            email: account.email,
            fallbackName: account.name,
          });
          return;
        }
        try {
          const profRes = await fetch(
            `${API_BASE}/v1/profiles/${encodeURIComponent(professionalId)}`,
            {
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
            }
          );
          if (!profRes.ok) throw new Error(`Profile request failed (${profRes.status})`);
          const profData = (await profRes.json()) as {
            ok: boolean;
            profile: Record<string, unknown>;
          };
          if (!cancelled)
            setState({
              status: 'ready',
              profile: profData.profile,
              email: account.email,
              fallbackName: account.name,
            });
        } catch {
          if (!cancelled)
            setState({
              status: 'ready',
              profile: null,
              email: account.email,
              fallbackName: account.name,
            });
        }
      } catch (err) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: err instanceof Error ? err.message : 'Could not load profile',
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [session.account_id]);

  const completeness = useMemo(() => {
    if (state.status !== 'ready') return 0;
    return computeCompleteness(state.profile);
  }, [state]);

  if (state.status === 'loading') return <ProfileSkeleton />;
  if (state.status === 'error') return <ProfileFallback message={state.message} />;

  const { profile, email, fallbackName } = state;

  const displayName = asString(getNested(profile, 'profile.name'), fallbackName);
  const credential = asString(getNested(profile, 'profile.profession'), '—');
  const years = asString(getNested(profile, 'profile.years_experience'), '—');
  const specialization = asString(getNested(profile, 'profile.specialization'), '—');
  const bio = asString(
    getNested(profile, 'profile.bio') ?? getNested(profile, 'hero.bio'),
    'Add a bio from the onboarding wizard.'
  );
  const phone = asString(getNested(profile, 'contact.phone'), '—');
  const website = asString(getNested(profile, 'contact.website'), '—');
  const firmName = asString(getNested(profile, 'contact.firm_name'), '—');
  const city = asString(getNested(profile, 'contact.city'), '');
  const stateRegion = asString(getNested(profile, 'contact.state'), '');
  const location = [city, stateRegion].filter((s) => s && s !== '—').join(', ') || '—';
  const licenseNumber = asString(
    getNested(profile, 'credentials.license_number'),
    'Not verified'
  );
  const initials = displayName
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your professional profile and credentials.
        </p>
      </div>

      <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Profile Completeness</h3>
          <span className="text-sm font-semibold text-brand-primary">{completeness}%</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-hover transition-all"
            style={{ width: `${completeness}%` }}
          />
        </div>
        <p className="mt-3 text-xs text-white/40">
          {completeness >= 100
            ? 'All profile sections are complete.'
            : 'Complete the onboarding wizard to reach 100%.'}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Professional Details</h3>
          <div className="mt-5 space-y-4">
            <Detail icon={<User className="h-4 w-4 text-brand-primary" />} label="Full Name" value={displayName} />
            <Detail icon={<Award className="h-4 w-4 text-brand-primary" />} label="Credentials" value={credential} />
            <Detail icon={<Clock className="h-4 w-4 text-brand-primary" />} label="Years of Experience" value={years} />
            <Detail
              icon={<Briefcase className="h-4 w-4 text-brand-primary" />}
              label="Specialization"
              value={specialization}
            />
          </div>
        </div>

        <HeroCard brandColor="#22c55e">
          <h3 className="text-xs uppercase tracking-widest text-brand-primary/70">Profile Preview</h3>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-hover text-xl font-bold text-white">
              {initials || 'GV'}
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{displayName}</p>
              <p className="text-sm text-brand-primary">{credential}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/60">{bio}</p>
        </HeroCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Contact Information</h3>
          <div className="mt-5 space-y-4">
            <Detail icon={<Mail className="h-4 w-4 text-brand-primary" />} label="Email" value={email} />
            <Detail icon={<Phone className="h-4 w-4 text-brand-primary" />} label="Phone" value={phone} />
            <Detail
              icon={<Globe className="h-4 w-4 text-brand-primary" />}
              label="Website"
              value={website}
              valueClass="text-brand-primary"
            />
          </div>
        </div>

        <div className="rounded-xl border border-[--member-border] bg-[--member-card] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Business Information</h3>
          <div className="mt-5 space-y-4">
            <Detail icon={<Building2 className="h-4 w-4 text-brand-primary" />} label="Business Name" value={firmName} />
            <Detail icon={<MapPin className="h-4 w-4 text-brand-primary" />} label="Location" value={location} />
            <Detail
              icon={<FileCheck className="h-4 w-4 text-brand-primary" />}
              label="License #"
              value={licenseNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">{icon}</div>
      <div>
        <p className="text-[11px] uppercase tracking-widest text-white/40">{label}</p>
        <p className={`text-sm font-medium ${valueClass ?? 'text-white'}`}>{value}</p>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/50">Loading profile…</p>
      </div>
      <div className="h-24 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
        <div className="h-64 animate-pulse rounded-xl border border-[--member-border] bg-[--member-card]" />
      </div>
    </div>
  );
}

function ProfileFallback({ message }: { message: string }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your professional profile and credentials.
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
  );
}
