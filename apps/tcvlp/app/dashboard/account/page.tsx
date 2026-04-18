'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTaxPro, useSubscriptionStatus } from '@/lib/account-context';
import { tierLabel, tierPrice } from '@/lib/tiers';
import { getProfile, updateProfile } from '@/lib/api';
import styles from '../components/shared.module.css';

export default function AccountPage() {
  const { data: pro, loading: proLoading } = useTaxPro();
  const { data: sub, loading: subLoading } = useSubscriptionStatus();
  const [copied, setCopied] = useState(false);

  const loading = proLoading || subLoading;
  const landingUrl = pro?.slug
    ? `https://taxclaim.virtuallaunch.pro/claim?slug=${pro.slug}`
    : null;

  const handleCopy = () => {
    if (!landingUrl) return;
    navigator.clipboard.writeText(landingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Account</h1>
      <p className={styles.pageDesc}>
        Manage your firm profile, claim page, and subscription.
      </p>

      {loading ? (
        <div style={{ color: 'var(--color-text-3)', fontSize: '0.875rem' }}>
          Loading…
        </div>
      ) : (
        <>
          <FirmSetupCard
            pro={pro}
            subActive={sub?.active ?? false}
            subPlan={sub?.plan}
            landingUrl={landingUrl}
            copied={copied}
            onCopy={handleCopy}
          />
          <NotificationsCard />
        </>
      )}
    </div>
  );
}

function NotificationsCard() {
  const [enabled, setEnabled] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getProfile().then((p) => {
      if (cancelled || !p) return;
      if (p.notifications_enabled !== undefined) {
        setEnabled(p.notifications_enabled !== false);
      }
      setLoaded(true);
    }).catch(() => setLoaded(true));
    return () => { cancelled = true; };
  }, []);

  const handleToggle = async (checked: boolean) => {
    const prev = enabled;
    setEnabled(checked);
    setSaving(true);
    setError('');
    try {
      await updateProfile({ notifications_enabled: checked });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setEnabled(prev);
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.urlCard} style={{ marginTop: '1rem' }}>
      <div className={styles.urlCardLabel}>Notifications</div>
      <div className={styles.field} style={{ marginTop: '0.75rem' }}>
        <label className={styles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={enabled}
            disabled={!loaded || saving}
            onChange={(e) => handleToggle(e.target.checked)}
            style={{ width: '1.125rem', height: '1.125rem', accentColor: '#eab308', cursor: 'pointer' }}
          />
          Receive email when a client submits a Form 843
        </label>
        <span className={styles.hint}>
          When enabled, you will receive an email notification with submission details each time a client confirms filing through your branded page.
        </span>
      </div>
      {error && <div className={styles.errorMsg}>{error}</div>}
      {saved && <div className={styles.successMsg}>✓ Saved</div>}
    </div>
  );
}

function FirmSetupCard({
  pro,
  subActive,
  subPlan,
  landingUrl,
  copied,
  onCopy,
}: {
  pro: { firm_name?: string | null; slug?: string | null } | null;
  subActive: boolean;
  subPlan?: string;
  landingUrl: string | null;
  copied: boolean;
  onCopy: () => void;
}) {
  // State A — no pro, no active sub
  if (!pro && !subActive) {
    return (
      <div className={styles.urlCard}>
        <div className={styles.urlCardLabel}>Firm Setup</div>
        <p className={styles.urlNote}>
          Set up your firm profile and subscription to publish claim pages,
          generate Form 843s, and access the full TaxClaim Pro dashboard.
        </p>
        <Link href="/onboarding" className={styles.saveBtn} style={{ display: 'inline-block', textDecoration: 'none', marginTop: '0.75rem' }}>
          Start Setup
        </Link>
      </div>
    );
  }

  // State B — active sub but no pro row (recovers H_other case)
  if (!pro && subActive) {
    return (
      <div className={styles.urlCard}>
        <div className={styles.urlCardLabel}>Firm Setup</div>
        <p className={styles.urlNote}>
          Your subscription is active, but your firm profile is not yet set up.
          Complete the setup to start publishing claim pages.
        </p>
        <Link href="/onboarding" className={styles.saveBtn} style={{ display: 'inline-block', textDecoration: 'none', marginTop: '0.75rem' }}>
          Complete Setup
        </Link>
      </div>
    );
  }

  // State C — pro exists
  return (
    <div className={styles.urlCard}>
      <div className={styles.urlCardLabel}>Firm Setup</div>

      <div className={styles.statsGrid} style={{ marginTop: '0.75rem', marginBottom: '1rem' }}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Firm Name</div>
          <div className={styles.statValue}>{pro?.firm_name ?? '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Subscription</div>
          <div
            className={styles.statValue}
            style={{ color: subActive ? '#fbbf24' : '#f87171' }}
          >
            {subActive && subPlan
              ? `${tierLabel(subPlan)} ($${tierPrice(subPlan)}/mo)`
              : 'Inactive'}
          </div>
        </div>
      </div>

      {landingUrl && (
        <div style={{ marginBottom: '1rem' }}>
          <div className={styles.statLabel} style={{ marginBottom: '0.375rem' }}>
            Claim Page URL
          </div>
          <div className={styles.urlRow}>
            <a
              href={landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.urlLink}
            >
              {landingUrl}
            </a>
            <button className={styles.copyBtn} onClick={onCopy}>
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Link
          href="/dashboard/upgrade"
          className={styles.saveBtn}
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          Manage Subscription
        </Link>
        <Link
          href="/onboarding"
          style={{
            fontSize: '0.875rem',
            color: '#eab308',
            textDecoration: 'none',
          }}
        >
          Edit Firm Details →
        </Link>
      </div>
    </div>
  );
}
