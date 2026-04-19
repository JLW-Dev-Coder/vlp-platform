'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useState } from 'react';
import { PurchaseBeacon } from '@vlp/member-ui';
import styles from './page.module.css';

function SuccessContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') ?? 'YOUR_CLIENT_ID';
  const [copied, setCopied] = useState(false);

  const embedCode = `<iframe \n  src="https://games.virtuallaunch.pro/embed?client_id=${clientId}&game=tax-trivia"\n  width="100%" height="600" frameborder="0">\n</iframe>`;

  function handleCopy() {
    navigator.clipboard.writeText(embedCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <main className={styles.main}>
      <PurchaseBeacon app="gvlp" clientReferenceId={clientId} />
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />

      <div className={styles.container}>
        {/* Checkmark */}
        <div className={styles.iconWrap}>
          <span className={styles.checkmark}>&#10003;</span>
        </div>

        <h1 className={styles.headline}>You&apos;re all set!</h1>
        <p className={styles.description}>
          Your payment was successful. Your games are ready to embed on your site.
          Use the code below to get started.
        </p>

        {/* Client ID */}
        <div className={styles.clientIdCard}>
          <p className={styles.cardLabel}>Your Client ID</p>
          <p className={styles.clientId}>{clientId}</p>
        </div>

        {/* Embed code */}
        <div className={styles.embedCard}>
          <p className={styles.cardLabel}>Embed Code</p>
          <pre className={styles.codeBlock}>{embedCode}</pre>
          <button
            className={copied ? styles.copyBtnCopied : styles.copyBtn}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
          </button>
        </div>

        {/* Dashboard link */}
        <Link href="/dashboard" className={styles.dashboardLink}>
          Go to Dashboard &rarr;
        </Link>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className={styles.loading}>Loading&hellip;</div>}>
      <SuccessContent />
    </Suspense>
  );
}
