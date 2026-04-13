'use client';

import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import styles from './page.module.css';

function CalendarContent() {
  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Schedule a Client Consultation</h1>
          <p className={styles.desc}>
            Book time with a client to review their Form 843 penalty abatement eligibility.
          </p>
        </div>

        <div className={styles.iframeWrap}>
          <iframe
            src="https://cal.com/vlp/tcvlp-consultation"
            title="Cal.com booking"
            className={styles.iframe}
            allow="camera; microphone; fullscreen; payment"
          />
        </div>

        <div className={styles.backRow}>
          <Link href="/dashboard" className={styles.backLink}>
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function CalendarPage() {
  return <AuthGuard>{() => <CalendarContent />}</AuthGuard>;
}
