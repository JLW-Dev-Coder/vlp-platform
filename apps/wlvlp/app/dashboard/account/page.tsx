'use client';

import Link from 'next/link';
import { Settings, Mail, ShieldCheck, CreditCard, LogOut } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import { logout } from '@/lib/api';

export default function AccountPage() {
  const { session } = useAppShell();

  async function handleSignOut() {
    try {
      await logout();
    } finally {
      window.location.href = '/sign-in';
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">
          Your Website Lotto account details and subscription.
        </p>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-white/30" />
          <h3 className="text-xs uppercase tracking-widest text-white/40">Account Details</h3>
        </div>
        <dl className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Email</dt>
              <dd className="mt-0.5 text-sm text-white">{session.email ?? '—'}</dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
            <div>
              <dt className="text-xs uppercase tracking-wider text-white/40">Role</dt>
              <dd className="mt-0.5 text-sm capitalize text-white">{session.role ?? 'buyer'}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
              <CreditCard className="h-5 w-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Subscription &amp; Billing</h3>
              <p className="mt-1 text-sm text-white/50">
                Manage your plan, hosting, and billing history.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            Open Subscription
          </Link>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Sign out</h3>
            <p className="mt-1 text-sm text-white/50">End your Website Lotto session on this device.</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
