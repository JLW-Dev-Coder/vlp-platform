'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { Session, TaxPro, getPro } from '@/lib/api';
import dynamic from 'next/dynamic';
import Overview from './components/Overview';

const EmbedLink = dynamic(() => import('./components/EmbedLink'));
const Submissions = dynamic(() => import('./components/Submissions'));
const Settings = dynamic(() => import('./components/Settings'));
const Upgrade = dynamic(() => import('./components/Upgrade'));
import styles from './page.module.css';

type View = 'overview' | 'embed' | 'submissions' | 'settings' | 'upgrade';

const NAV_ITEMS: { id: View; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'embed', label: 'Embed Link' },
  { id: 'submissions', label: 'Submissions' },
  { id: 'settings', label: 'Settings' },
  { id: 'upgrade', label: 'Upgrade' },
];

function DashboardContent({ session }: { session: Session }) {
  const [view, setView] = useState<View>('overview');
  const [pro, setPro] = useState<TaxPro | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session.pro_id) {
      getPro(session.pro_id)
        .then((p) => setPro(p))
        .finally(() => setLoading(false));
    } else {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }
  }, [session.pro_id]);

  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.accountChip}>
              <div className={styles.avatar}>{session.email[0].toUpperCase()}</div>
              <div className={styles.accountInfo}>
                <span className={styles.accountEmail}>{session.email}</span>
                <span className={styles.accountRole}>Tax Professional</span>
              </div>
            </div>
          </div>
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`${styles.navItem} ${view === item.id ? styles.navItemActive : ''}`}
                onClick={() => setView(item.id)}
              >
                {item.label}
              </button>
            ))}
            <Link href="/calendar" className={styles.navItem}>
              Calendar
            </Link>
            <Link href="/affiliate" className={styles.navItem}>
              Affiliate
            </Link>
          </nav>
        </aside>

        <main className={styles.content}>
          {loading ? (
            <div className={styles.loadingState}>Loading…</div>
          ) : (
            <>
              {view === 'overview' && <Overview session={session} pro={pro} />}
              {view === 'embed' && <EmbedLink pro={pro} />}
              {view === 'submissions' && <Submissions />}
              {view === 'settings' && <Settings session={session} pro={pro} onUpdated={setPro} />}
              {view === 'upgrade' && <Upgrade pro={pro} session={session} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <AuthGuard>{(session) => <DashboardContent session={session} />}</AuthGuard>;
}
