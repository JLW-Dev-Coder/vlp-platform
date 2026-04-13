'use client';

import { useState } from 'react';
import { Session, TaxPro } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  session: Session;
  pro: TaxPro | null;
}

export default function Overview({ session, pro }: Props) {
  const [copied, setCopied] = useState(false);
  const landingUrl = pro?.slug ? `https://${pro.slug}.taxclaim.virtuallaunch.pro` : null;

  const handleCopy = () => {
    if (!landingUrl) return;
    navigator.clipboard.writeText(landingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          <div className={styles.statLabel}>Subscription</div>
          <div className={styles.statValue} style={{ color: pro?.subscription_status === 'active' ? '#4ade80' : '#f87171' }}>
            {pro?.subscription_status ?? 'Inactive'}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statLabel}>Total Submissions</div>
          <div className={styles.statValue}>{pro?.submission_count ?? 0}</div>
        </div>
      </div>

      {landingUrl && (
        <div className={styles.urlCard}>
          <div className={styles.urlCardLabel}>Your Client Landing Page</div>
          <div className={styles.urlRow}>
            <a href={landingUrl} target="_blank" rel="noopener noreferrer" className={styles.urlLink}>
              {landingUrl}
            </a>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy URL'}
            </button>
          </div>
          <p className={styles.urlNote}>Share this URL with clients to start their Kwong claim preparation.</p>
        </div>
      )}
    </div>
  );
}
