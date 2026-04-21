'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Server, Globe2, AlertCircle, CheckCircle2, Inbox } from 'lucide-react';
import { useAppShell } from '@vlp/member-ui';
import { getMySites, createHostingRenewalCheckout, type PurchasedSite } from '@/lib/api';

export default function HostingPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [sites, setSites] = useState<PurchasedSite[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getMySites(accountId)
      .then(setSites)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load hosting'))
      .finally(() => setLoading(false));
  }, [accountId]);

  return (
    <div className="space-y-8">
      <header className="mb-7">
        <h1 className="font-sora text-3xl font-extrabold text-white mt-0 mb-2 -tracking-[0.5px]">Hosting</h1>
        <p className="text-white/55 text-[0.95rem] m-0">
          Manage domains and hosting status for your Website Lotto sites.
        </p>
      </header>

      {loading && (
        <div className="h-40 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      )}

      {!loading && error && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Couldn&apos;t load hosting status</p>
            <p className="mt-1 text-amber-200/70">{error}</p>
          </div>
        </div>
      )}

      {!loading && !error && sites && sites.length === 0 && (
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
            <Inbox className="h-6 w-6 text-white/30" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-white">No hosted sites yet</h2>
          <p className="mt-2 text-sm text-white/50">
            Purchase or win a template to start hosting your site on Website Lotto.
          </p>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90"
          >
            Browse Templates
          </a>
        </div>
      )}

      {!loading && !error && sites && sites.length > 0 && (
        <div className="space-y-4">
          {sites.map((s) => (
            <HostingRow key={s.slug} site={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function HostingRow({ site }: { site: PurchasedSite }) {
  const [renewing, setRenewing] = useState(false);
  const [renewError, setRenewError] = useState('');

  const expiresDate = site.hosting_expires_at ? new Date(site.hosting_expires_at) : null;
  const expires = expiresDate
    ? expiresDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : null;
  const daysUntilExpiry = expiresDate
    ? Math.ceil((expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isExpired = site.hosting_status === 'expired';
  const isExpiringSoon =
    !isExpired && daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

  const statusLabel =
    site.hosting_status === 'active' ? 'Active'
    : site.hosting_status === 'expired' ? 'Expired'
    : 'Pending';
  const statusClass =
    site.hosting_status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    : site.hosting_status === 'expired' ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
    : 'text-amber-400 bg-amber-500/10 border-amber-500/20';

  const domainLabel = site.custom_domain ?? 'No custom domain';
  const domainStatus = site.domain_status
    ? site.domain_status === 'verified' ? 'Verified'
      : site.domain_status === 'failed' ? 'Verification failed'
      : 'Pending DNS'
    : null;

  async function handleRenew() {
    setRenewing(true);
    setRenewError('');
    try {
      const res = await createHostingRenewalCheckout(site.slug);
      const url = res.session_url ?? res.url;
      if (url) window.location.href = url;
      else throw new Error('No checkout URL returned');
    } catch (err: unknown) {
      setRenewError(err instanceof Error ? err.message : 'Failed to start renewal');
      setRenewing(false);
    }
  }

  return (
    <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
            <Server className="h-5 w-5 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">{site.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-xs text-white/50">
              <Globe2 className="h-3.5 w-3.5" />
              <span>{domainLabel}</span>
              {domainStatus && (
                <span className="ml-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/60">
                  {domainStatus}
                </span>
              )}
            </div>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${statusClass}`}>
          {site.hosting_status === 'active' && <CheckCircle2 className="h-3 w-3" />}
          {statusLabel}
        </span>
      </div>

      {isExpired && (
        <div className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-2.5 text-sm text-rose-300">
          Hosting expired — renew to keep your site live.
        </div>
      )}
      {isExpiringSoon && expires && (
        <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-2.5 text-sm text-amber-200">
          Hosting expires {expires}.
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-xs uppercase tracking-wider text-white/40">Site URL</dt>
          <dd className="mt-1 truncate text-white/80">
            <a href={site.site_url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary">
              {site.site_url}
            </a>
          </dd>
        </div>
        {expires && (
          <div>
            <dt className="text-xs uppercase tracking-wider text-white/40">
              {isExpired ? 'Expired on' : 'Renews on'}
            </dt>
            <dd className="mt-1 text-white/80">{expires}</dd>
          </div>
        )}
      </dl>

      {renewError && (
        <p className="mt-3 text-xs text-rose-400">{renewError}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={`/dashboard/sites/${site.slug}/edit`}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--member-border)] bg-white/5 px-3.5 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          Manage Domain
        </Link>
        {(isExpired || isExpiringSoon) && (
          <button
            type="button"
            onClick={handleRenew}
            disabled={renewing}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-sm font-medium text-white shadow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {renewing ? 'Starting checkout…' : 'Renew Hosting'}
          </button>
        )}
      </div>
    </div>
  );
}
