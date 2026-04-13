'use client';

import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import styles from './page.module.css';

export default function CalendarPage() {
  return (
    <AuthGuard>
      {() => (
        <main className={styles.main}>
          <div className={styles.container}>
            <h1 className={styles.heading}>Schedule a Client Session</h1>
            <p className={styles.description}>
              Book time to walk a client through a gamified tax education session on your site.
            </p>
            <div className={styles.iframeWrapper}>
              <iframe
                src="https://cal.com/vlp/gvlp-session"
                title="Schedule a Client Session"
                className={styles.iframe}
                allow="camera; microphone; fullscreen"
              />
            </div>
            <Link href="/dashboard" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
          </div>
        </main>
      )}
    </AuthGuard>
  );
}
