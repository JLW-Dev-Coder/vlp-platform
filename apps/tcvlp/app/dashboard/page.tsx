'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { Session, TaxPro, getPro, getProfile, getSubscriptionStatus, SubscriptionStatus } from '@/lib/api';
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
  const router = useRouter();
  const [view, setView] = useState<View>('overview');
  const [pro, setPro] = useState<TaxPro | null>(null);
  const [sub, setSub] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPostCheckout] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('checkout') === 'success';
  });

  useEffect(() => {
    async function load() {
      const s = await getSubscriptionStatus();
      setSub(s);
      let p: TaxPro | null = null;
      if (s.pro_id) {
        p = await getPro(s.pro_id);
      }
      if (!p) {
        // Check profile as fallback — if no pro record at all, redirect to onboarding
        const profile = await getProfile();
        if (!profile?.pro_id) {
          router.replace('/onboarding');
          return;
        }
        p = await getPro(profile.pro_id);
      }
      setPro(p);
      setLoading(false);
    }
    load();
  }, [router]);

  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTop}>
            <div className={styles.accountChip}>
              <div className={styles.avatar}>{(session.email ?? '?')[0].toUpperCase()}</div>
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
              {isPostCheckout && !sub?.active && (
                <div className={styles.loadingState} style={{ padding: '1rem', marginBottom: '1rem', background: '#1a1a2e', borderRadius: '0.5rem', textAlign: 'center' }}>
                  Your subscription is being activated. This may take a few seconds.{' '}
                  <button onClick={() => window.location.reload()} style={{ color: '#fbbf24', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Refresh
                  </button>
                </div>
              )}
              {view === 'overview' && <Overview session={session} pro={pro} sub={sub} />}
              {view === 'embed' && <EmbedLink pro={pro} />}
              {view === 'submissions' && <Submissions />}
              {view === 'settings' && <Settings session={session} pro={pro} onUpdated={setPro} />}
              {view === 'upgrade' && <Upgrade pro={pro} session={session} sub={sub} />}
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
