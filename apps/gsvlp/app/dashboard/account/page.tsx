'use client';

import { useAppShell } from '@vlp/member-ui';

export default function AccountPage() {
  const { session, signOut } = useAppShell();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">
          Your setter account details.
        </p>
      </header>

      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Email</span>
            <span className="text-white">{session.email ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Account ID</span>
            <span className="font-mono text-xs text-white/70">
              {session.account_id ?? '—'}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-base font-semibold text-white">Coming soon</h2>
        <p className="mt-2 text-sm text-white/50">
          Profile editing, payout settings, and notification preferences will
          land here.
        </p>
      </section>

      <button
        type="button"
        onClick={signOut}
        className="rounded border border-white/10 px-4 py-2 text-sm text-red-400/80 hover:text-red-400"
      >
        Sign out
      </button>
    </div>
  );
}
