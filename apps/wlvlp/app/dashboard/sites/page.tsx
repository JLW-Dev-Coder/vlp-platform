'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import { getMySites, createHostingRenewalCheckout, connectDomain, PurchasedSite } from '@/lib/api';

const MAIN = 'flex-1 w-full pb-15';
const TITLE = 'font-sora text-3xl font-extrabold text-white mt-0 mb-2 -tracking-[0.5px]';
const SUBTITLE = 'text-white/55 text-[0.95rem] m-0';
const STATE = 'flex justify-center py-20';
const ERROR_BOX = 'bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.25)] rounded-xl p-5';
const ERROR_TITLE = 'text-[var(--color-error)] font-bold m-0 mb-1';
const ERROR_MSG = 'text-white/60 text-[0.88rem] m-0';
const EMPTY_BOX = 'text-center py-20 px-6 bg-white/[0.02] border border-white/[0.07] rounded-2xl';
const BROWSE_BTN = 'inline-block px-7 py-3 bg-brand-primary text-white font-bold text-[0.9rem] rounded-lg no-underline transition-all shadow-brand hover:-translate-y-0.5';

export default function MySitesPage() {
  const { session } = useAppShell();
  const accountId = session.account_id;
  const [sites, setSites] = useState<PurchasedSite[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accountId) return;
    getMySites(accountId)
      .then(setSites)
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Failed to load sites'))
      .finally(() => setLoading(false));
  }, [accountId]);

  return (
    <main className={MAIN}>
      <header className="mb-7">
        <h1 className={TITLE}>My Sites</h1>
        <p className={SUBTITLE}>Templates you&apos;ve claimed and are hosting with Website Lotto.</p>
      </header>

      {loading && <div className={STATE}><span className="spinner" /></div>}

      {!loading && error && (
        <div className={ERROR_BOX}>
          <p className={ERROR_TITLE}>Couldn&apos;t load your sites</p>
          <p className={ERROR_MSG}>{error}</p>
        </div>
      )}

      {!loading && !error && sites && sites.length === 0 && (
        <div className={EMPTY_BOX}>
          <h2 className="font-sora text-2xl font-bold text-white m-0 mb-2">No sites yet</h2>
          <p className="text-white/50 m-0 mb-5">Browse the marketplace to claim your first template.</p>
          <a href="/" target="_blank" rel="noopener noreferrer" className={BROWSE_BTN}>Browse Templates</a>
        </div>
      )}

      {!loading && !error && sites && sites.length > 0 && (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(380px,1fr))]">
          {sites.map((s) => (
            <SiteCard key={s.slug} site={s} />
          ))}
        </div>
      )}
    </main>
  );
}

function SiteCard({ site }: { site: PurchasedSite }) {
  const [renewing, setRenewing] = useState(false);
  const [renewError, setRenewError] = useState('');
  const [domainOpen, setDomainOpen] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [domainSubmitting, setDomainSubmitting] = useState(false);
  const [domainError, setDomainError] = useState('');
  const [savedDomain, setSavedDomain] = useState<string | undefined>(site.custom_domain);

  const purchasedDate = site.purchased_at ? new Date(site.purchased_at) : null;
  const purchasedValid = purchasedDate && !isNaN(purchasedDate.getTime()) && purchasedDate.getFullYear() >= 2020;
  const purchased = purchasedValid
    ? purchasedDate!.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    : '—';
  const expiresDate = site.hosting_expires_at ? new Date(site.hosting_expires_at) : null;
  const expires = expiresDate
    ? expiresDate.toLocaleDateString(undefined, {
        year: 'numeric', month: 'short', day: 'numeric',
      })
    : null;

  const now = Date.now();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysUntilExpiry = expiresDate
    ? Math.ceil((expiresDate.getTime() - now) / msPerDay)
    : null;

  const isExpired = site.hosting_status === 'expired';
  const isExpiringSoon =
    !isExpired && daysUntilExpiry !== null && daysUntilExpiry >= 0 && daysUntilExpiry <= 30;

  const hasDomain = Boolean(savedDomain);
  const domainPending = hasDomain && site.domain_status !== 'verified';

  let statusLabel: string;
  let statusClass: string;
  if (isExpired) {
    statusLabel = 'Expired';
    statusClass = 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] border border-[rgba(239,68,68,0.3)]';
  } else if (domainPending) {
    statusLabel = 'Domain Pending';
    statusClass = 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)] border border-[rgba(245,158,11,0.35)]';
  } else {
    statusLabel = 'Live';
    statusClass = 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]';
  }

  const tierLabel = site.tier
    ? site.tier.charAt(0).toUpperCase() + site.tier.slice(1).toLowerCase()
    : null;

  async function handleRenew() {
    setRenewing(true);
    setRenewError('');
    try {
      const res = await createHostingRenewalCheckout(site.slug);
      const url = res.session_url ?? res.url;
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: unknown) {
      setRenewError(err instanceof Error ? err.message : 'Failed to start renewal');
      setRenewing(false);
    }
  }

  async function handleDomainSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!value) {
      setDomainError('Enter a domain name');
      return;
    }
    setDomainSubmitting(true);
    setDomainError('');
    try {
      const res = await connectDomain(site.slug, value);
      setSavedDomain(res.domain ?? value);
      setDomainInput('');
    } catch (err: unknown) {
      setDomainError(err instanceof Error ? err.message : 'Failed to connect domain');
    } finally {
      setDomainSubmitting(false);
    }
  }

  return (
    <div className="bg-white/[0.02] border border-white/[0.07] rounded-[14px] p-[22px] flex flex-col gap-3.5 transition-all hover:border-brand-primary/30 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2.5">
        <h3 className="font-sora text-[1.05rem] font-bold text-white m-0 leading-tight">{site.title}</h3>
        <span className={`px-2.5 py-[3px] rounded-full text-[0.72rem] font-bold uppercase tracking-wider flex-shrink-0 whitespace-nowrap ${statusClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 -mt-2">
        {site.category && (
          <span className="text-[0.72rem] font-semibold text-white/55 uppercase tracking-wider">{site.category}</span>
        )}
        {tierLabel && (
          <span className="px-2 py-[2px] rounded-full text-[0.68rem] font-bold uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/30">
            {tierLabel}
          </span>
        )}
      </div>

      {isExpired && (
        <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.35)] text-[var(--color-error)] rounded-lg px-3 py-2.5 text-[0.82rem] font-semibold">
          Hosting expired — renew to keep your site live
        </div>
      )}
      {isExpiringSoon && expires && (
        <div className="bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.35)] text-[var(--color-warning)] rounded-lg px-3 py-2.5 text-[0.82rem] font-semibold">
          Hosting expires {expires}
        </div>
      )}

      <dl className="m-0 flex flex-col gap-1.5">
        <div className="flex justify-between text-[0.83rem]">
          <dt className="text-white/45 m-0">Purchased</dt>
          <dd className="text-white/85 m-0 font-medium">{purchased}</dd>
        </div>
        {expires && (
          <div className="flex justify-between text-[0.83rem]">
            <dt className="text-white/45 m-0">{isExpired ? 'Expired on' : 'Renews on'}</dt>
            <dd className="text-white/85 m-0 font-medium">{expires}</dd>
          </div>
        )}
      </dl>

      {renewError && (
        <div className={ERROR_BOX}>
          <p className={ERROR_MSG}>{renewError}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5 mt-1">
        <Link
          href={`/dashboard/sites/${site.slug}/edit`}
          className="flex-1 text-center px-3.5 py-2 bg-brand-primary text-white font-bold text-[0.85rem] rounded-lg no-underline transition-all shadow-brand hover:-translate-y-0.5"
        >
          Edit Site
        </Link>
        <button
          type="button"
          onClick={() => setDomainOpen(o => !o)}
          aria-expanded={domainOpen}
          className="flex-1 text-center px-3.5 py-2 bg-transparent border border-brand-primary/40 rounded-lg text-brand-primary font-semibold text-[0.85rem] cursor-pointer transition-all hover:bg-brand-primary/10 hover:border-brand-primary"
        >
          {domainOpen ? 'Hide Domain' : 'Connect Domain'}
        </button>
        <a
          href={site.site_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center px-3.5 py-2 rounded-lg text-white/70 font-semibold text-[0.85rem] no-underline transition-all hover:text-brand-primary"
        >
          View Live Site ↗
        </a>
      </div>

      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${domainOpen ? '[grid-template-rows:1fr]' : '[grid-template-rows:0fr]'}`}
      >
        <div className="overflow-hidden">
          <div className="mt-1 rounded-lg border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
            {hasDomain ? (
              <>
                <div>
                  <div className="text-[0.72rem] font-semibold text-white/45 uppercase tracking-wider mb-1">Custom domain</div>
                  <div className="font-mono text-[0.9rem] text-white break-all">{savedDomain}</div>
                </div>
                <DnsInstructions />
                <button
                  type="button"
                  onClick={() => { setSavedDomain(undefined); setDomainInput(savedDomain ?? ''); }}
                  className="self-start text-[0.8rem] text-white/55 hover:text-brand-primary underline cursor-pointer"
                >
                  Change domain
                </button>
              </>
            ) : (
              <>
                <form onSubmit={handleDomainSubmit} className="flex flex-col gap-2">
                  <label htmlFor={`domain-${site.slug}`} className="text-[0.8rem] text-white/70 font-medium">
                    Enter your custom domain
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      id={`domain-${site.slug}`}
                      type="text"
                      value={domainInput}
                      onChange={e => setDomainInput(e.target.value)}
                      placeholder="www.mybusiness.com"
                      className="flex-1 px-3 py-2 bg-white/[0.04] border border-white/15 rounded-lg text-white text-[0.88rem] placeholder:text-white/30 focus:outline-none focus:border-brand-primary"
                      disabled={domainSubmitting}
                    />
                    <button
                      type="submit"
                      disabled={domainSubmitting}
                      className="px-4 py-2 bg-brand-primary text-white font-bold text-[0.85rem] rounded-lg border-0 cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {domainSubmitting ? 'Connecting…' : 'Connect'}
                    </button>
                  </div>
                  {domainError && (
                    <p className="text-[var(--color-error)] text-[0.8rem] m-0">{domainError}</p>
                  )}
                </form>
                <DnsInstructions />
              </>
            )}
          </div>
        </div>
      </div>

      {(isExpired || isExpiringSoon) && (
        <button
          type="button"
          className="w-full px-3.5 py-2.5 bg-brand-primary text-white font-bold text-[0.88rem] border-0 rounded-lg cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleRenew}
          disabled={renewing}
        >
          {renewing ? 'Starting checkout…' : 'Renew Hosting — $14/mo'}
        </button>
      )}
    </div>
  );
}

function DnsInstructions() {
  return (
    <div className="rounded-md bg-white/[0.03] border border-white/10 p-3 text-[0.8rem] text-white/70 leading-relaxed">
      Point your domain&apos;s <span className="font-mono text-white">CNAME</span> record to{' '}
      <span className="font-mono text-brand-primary break-all">websitelotto.virtuallaunch.pro</span>.
      SSL will be provisioned automatically once DNS propagates (usually 1–24 hours).
    </div>
  );
}
