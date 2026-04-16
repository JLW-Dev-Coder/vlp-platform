'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TaxPro } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  pro: TaxPro | null;
}

export default function EmbedLink({ pro }: Props) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const landingUrl = pro?.slug ? `https://taxclaim.virtuallaunch.pro/claim?slug=${pro.slug}` : null;

  useEffect(() => {
    if (!landingUrl) return;
    QRCode.toDataURL(landingUrl, {
      width: 200,
      margin: 2,
      color: { dark: '#1a1a2e', light: '#ffffff' },
    }).then(setQrDataUrl).catch(() => {});
  }, [landingUrl]);

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
            {qrDataUrl ? (
              <div className={styles.qrPlaceholder}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="QR code for your landing page" width={200} height={200} style={{ borderRadius: '0.5rem' }} />
                <span>Scan to visit your landing page</span>
              </div>
            ) : (
              <div className={styles.qrPlaceholder}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" /><path d="M14 14h7v7" /><path d="M14 14v3h3" />
                </svg>
                <span>Generating QR code…</span>
              </div>
            )}
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

          <a href="/onboarding" style={{ color: '#eab308', fontSize: '0.875rem', textDecoration: 'none', marginTop: '1rem', display: 'inline-block' }}>
            Edit your hosted page settings →
          </a>
        </>
      )}
    </div>
  );
}
