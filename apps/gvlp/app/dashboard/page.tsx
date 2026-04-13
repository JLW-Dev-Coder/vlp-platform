'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { Operator, getOperator } from '@/lib/api';
import Overview from './components/Overview';
import EmbedCode from './components/EmbedCode';
import TokenUsage from './components/TokenUsage';
import Settings from './components/Settings';
import Upgrade from './components/Upgrade';
import styles from './page.module.css';

type View = 'overview' | 'embed' | 'tokens' | 'settings' | 'upgrade';

const NAV_ITEMS: { id: View; label: string; emoji: string }[] = [
  { id: 'overview',  label: 'Overview',    emoji: '📊' },
  { id: 'embed',     label: 'Embed Code',  emoji: '🔗' },
  { id: 'tokens',    label: 'Token Usage', emoji: '🪙' },
  { id: 'settings',  label: 'Settings',    emoji: '⚙️' },
  { id: 'upgrade',   label: 'Upgrade',     emoji: '⬆️' },
];

function DashboardInner({ session }: { session: { account_id: string; email: string; name?: string; tier?: string } }) {
  const [view, setView] = useState<View>('overview');
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOperator(session.account_id)
      .then(setOperator)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [session.account_id]);

  const handleOperatorUpdate = (updated: Operator) => setOperator(updated);

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarBrand}>
          <span className={styles.brandIcon}>🎮</span>
          <span className={styles.brandName}>GVLP</span>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${view === item.id ? styles.navItemActive : ''}`}
              onClick={() => setView(item.id)}
            >
              <span className={styles.navEmoji}>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
          <Link href="/calendar" className={styles.navItem}>
            <span className={styles.navEmoji}>📅</span>
            <span>Calendar</span>
          </Link>
        </nav>
        <div className={styles.sidebarFooter}>
          <span className={styles.footerEmail}>{session.email}</span>
        </div>
      </aside>

      <main className={styles.main}>
        {loading && (
          <div className={styles.loadingState}>
            <span className={styles.loadingDot} />
            <span>Loading your dashboard…</span>
          </div>
        )}
        {error && (
          <div className={styles.errorState}>
            <span>⚠️ {error}</span>
          </div>
        )}
        {!loading && !error && operator && (
          <>
            {view === 'overview'  && <Overview operator={operator} />}
            {view === 'embed'     && <EmbedCode operator={operator} />}
            {view === 'tokens'    && <TokenUsage operator={operator} />}
            {view === 'settings'  && <Settings operator={operator} onUpdate={handleOperatorUpdate} />}
            {view === 'upgrade'   && <Upgrade operator={operator} />}
          </>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      {(session) => <DashboardInner session={session} />}
    </AuthGuard>
  );
}
