'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, Globe2, Server, AlertCircle } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import { getMySites, type PurchasedSite } from '@/lib/api';

export default function UsagePage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [sites, setSites] = useState<PurchasedSite[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getMySites(accountId)
      .then(setSites)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load usage'))
      .finally(() => setLoading(false));
  }, [accountId]);

  const totalSites = sites?.length ?? 0;
  const activeSites = sites?.filter((s) => s.hosting_status === 'active').length ?? 0;
  const customDomains = sites?.filter((s) => s.custom_domain).length ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Usage</h1>
        <p className="mt-1 text-sm text-white/50">
          Your Website Lotto activity — sites, hosting, and custom domains in use.
        </p>
      </div>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Couldn&apos;t load usage data</p>
            <p className="mt-1 text-amber-200/70">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-3">
          <UsageStat icon={<Activity className="h-4 w-4 text-white/30" />} label="Sites Owned" value={totalSites} />
          <UsageStat icon={<Server className="h-4 w-4 text-white/30" />} label="Active Hosting" value={activeSites} />
          <UsageStat icon={<Globe2 className="h-4 w-4 text-white/30" />} label="Custom Domains" value={customDomains} />
        </div>
      )}

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <h3 className="text-xs uppercase tracking-widest text-white/40">Manage usage</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Link
            href="/dashboard/sites"
            className="inline-flex items-center justify-between rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
          >
            <span>My Sites</span>
            <span className="text-white/40">→</span>
          </Link>
          <Link
            href="/dashboard/hosting"
            className="inline-flex items-center justify-between rounded-lg border border-[var(--member-border)] bg-white/5 px-4 py-3 text-sm text-white/80 transition hover:bg-white/10"
          >
            <span>Hosting &amp; Domains</span>
            <span className="text-white/40">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function UsageStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-xs uppercase tracking-widest text-white/40">{label}</h3>
      </div>
      <p className="mt-4 text-4xl font-bold text-brand-primary">{value}</p>
    </div>
  );
}
