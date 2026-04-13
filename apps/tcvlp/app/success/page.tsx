'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import styles from './page.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') ?? '';
  const [copied, setCopied] = useState(false);

  const landingUrl = slug ? `https://${slug}.taxclaim.virtuallaunch.pro` : '';

  const handleCopy = () => {
    if (!landingUrl) return;
    navigator.clipboard.writeText(landingUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.checkIcon}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className={styles.title}>You&apos;re All Set!</h1>
      <p className={styles.sub}>Your TaxClaim Pro account is active and your branded page is live.</p>

      {landingUrl && (
        <div className={styles.urlSection}>
          <div className={styles.urlLabel}>Your Landing Page URL</div>
          <div className={styles.urlRow}>
            <code className={styles.urlCode}>{landingUrl}</code>
            <button className={styles.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}

      <div className={styles.nextSteps}>
        <h2 className={styles.nextTitle}>Next Steps</h2>
        <ul className={styles.nextList}>
          <li className={styles.nextItem}>
            <div className={styles.nextIcon}>📤</div>
            <div>
              <strong>Share with clients</strong>
              <p>Send your landing URL directly to clients who may have Kwong penalties to claim.</p>
            </div>
          </li>
          <li className={styles.nextItem}>
            <div className={styles.nextIcon}>🔖</div>
            <div>
              <strong>Bookmark your dashboard</strong>
              <p>Track submissions, update your branding, and manage settings from your dashboard.</p>
            </div>
          </li>
          <li className={styles.nextItem}>
            <div className={styles.nextIcon}>⏰</div>
            <div>
              <strong>Remind clients of the deadline</strong>
              <p>Claims must be filed by <strong>July 10, 2026</strong>. Don&apos;t let clients miss this window.</p>
            </div>
          </li>
        </ul>
      </div>

      <div className={styles.actions}>
        <Link href="/dashboard" className={styles.primaryBtn}>
          Go to Dashboard →
        </Link>
        <a
          href="https://www.irs.gov/pub/irs-pdf/f843.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.secondaryBtn}
        >
          Official IRS Form 843 ↗
        </a>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.inner}>
        <Suspense fallback={<div className={styles.card} style={{ color: '#6b7280', textAlign: 'center' }}>Loading…</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
