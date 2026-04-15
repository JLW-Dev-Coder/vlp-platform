'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Session, TaxPro, SubscriptionStatus } from '@/lib/api';
import { tierLabel, tierPrice } from '@/lib/tiers';
import styles from './shared.module.css';

interface Props {
  session: Session;
  pro: TaxPro | null;
  sub: SubscriptionStatus | null;
}

export default function Overview({ session, pro, sub }: Props) {
  const [copied, setCopied] = useState(false);
  const landingUrl = pro?.slug ? `https://${pro.slug}.taxclaim.virtuallaunch.pro` : null;

  const handleCopy = () => {
    if (!landingUrl) return;
    navigator.clipboard.writeText(landingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const currentTier = sub?.plan || 'tcvlp_starter';

  return (
    <div>
      <h1 className={styles.pageTitle}>Overview</h1>

      {!pro && (
        <div className={styles.warningBox}>
          <strong>No branded page set up yet.</strong> Complete onboarding to get your landing page.
          <a href="/onboarding" className={styles.inlineLink}>Start onboarding →</a>
        </div>
      )}

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Firm Name</div>
          <div className={styles.statValue}>{pro?.firm_name ?? '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Slug</div>
          <div className={styles.statValue}>{pro?.slug ?? '—'}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Plan</div>
          <div className={styles.statValue} style={{ color: sub?.active ? '#fbbf24' : '#f87171' }}>
            {sub?.active ? `${tierLabel(currentTier)} ($${tierPrice(currentTier)}/mo)` : 'Inactive'}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Submissions</div>
          <div className={styles.statValue}>{pro?.submission_count ?? 0}</div>
        </div>
      </div>

      {sub?.active && currentTier === 'tcvlp_starter' && (
        <div className={styles.urlCard}>
          <div className={styles.urlCardLabel}>Upgrade for More Features</div>
          <p className={styles.urlNote}>
            You are on the Starter plan. Upgrade to Professional ($29/mo) for unlimited claim pages,
            priority generation, bulk export, and transcript integration.
          </p>
          <Link href="/pricing" style={{ color: 'var(--color-brand)', textDecoration: 'underline', fontSize: '0.875rem' }}>
            View Plans →
          </Link>
        </div>
      )}

      {landingUrl && (
        <div className={styles.urlCard}>
          <div className={styles.urlCardLabel}>Your Client Landing Page</div>
          <div className={styles.urlRow}>
            <a href={landingUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
              {landingUrl}
            </a>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? 'Copied' : 'Copy URL'}
            </button>
          </div>
          <p className={styles.urlNote}>Share this URL with clients to start their Kwong claim preparation.</p>
        </div>
      )}

      <div className={styles.deadlineCard}>
        <strong>Deadline:</strong> Kwong claim window closes <strong>July 10, 2026</strong>.
        Keep your subscription active to serve clients through this window.
      </div>
    </div>
  );
}
