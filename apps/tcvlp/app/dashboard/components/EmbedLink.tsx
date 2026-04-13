'use client';

import { useState } from 'react';
import { TaxPro } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  pro: TaxPro | null;
}

export default function EmbedLink({ pro }: Props) {
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
      <h1 className={styles.pageTitle}>Embed Link & QR Code</h1>
      <p className={styles.pageDesc}>Share your branded page with clients via link or QR code.</p>

      {!landingUrl ? (
        <div className={styles.warningBox}>
          Complete onboarding to generate your embed link.
          <a href="/onboarding" className={styles.inlineLink}>Start onboarding →</a>
        </div>
      ) : (
        <>
          <div className={styles.urlCard}>
            <div className={styles.urlCardLabel}>Your Landing URL</div>
            <div className={styles.urlRow}>
              <code className={styles.urlCode}>{landingUrl}</code>
              <button className={styles.copyBtn} onClick={handleCopy}>
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.qrPlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7" /><path d="M14 14v3h3" />
              </svg>
              <span>QR code generation coming soon</span>
            </div>
          </div>

          <div className={styles.instructionsCard}>
            <h2 className={styles.subTitle}>How to Share</h2>
            <ul className={styles.instructionList}>
              <li>Copy the URL above and paste it in emails to clients</li>
              <li>Add the link to your email signature</li>
              <li>Share on your firm&apos;s website or social media</li>
              <li>Print the QR code and include it in mailings</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
