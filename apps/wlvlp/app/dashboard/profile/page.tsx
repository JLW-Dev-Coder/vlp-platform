'use client';

import Link from 'next/link';
import { User, Mail, Palette } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';

export default function ProfilePage() {
  const { session } = useAppShell();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/50">
          Your public profile and brand details shown on your hosted sites.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-primary/10">
            <User className="h-6 w-6 text-brand-primary" />
          </div>
          <div>
            <p className="text-base font-semibold text-white">{session.email ?? '—'}</p>
            <p className="mt-0.5 text-xs text-white/40 capitalize">
              {session.role ?? 'buyer'}
            </p>
          </div>
        </div>

        <dl className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Contact Email</dt>
              <dd className="mt-0.5 text-sm text-white">{session.email ?? '—'}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              <Palette className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Brand &amp; Contact Info</h3>
              <p className="mt-1 text-sm text-white/50">
                The logo, colors, and business info used across your hosted sites.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/brand"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              Edit Brand
            </Link>
            <Link
              href="/dashboard/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
            >
              Edit Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
