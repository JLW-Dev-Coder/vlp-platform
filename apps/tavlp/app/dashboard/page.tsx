'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Script, type Render, type Channel } from '@/lib/api';
import styles from './dashboard.module.css';

export default function OverviewPage() {
  const { session } = useAppShell();
  const accountId = session.account_id || '';
  const [scripts, setScripts] = useState<Script[]>([]);
  const [renders, setRenders] = useState<Render[]>([]);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;
    Promise.all([
      tavlpApi.listScripts(accountId).catch(() => ({ scripts: [] })),
      tavlpApi.listRenders(accountId).catch(() => ({ renders: [] })),
      tavlpApi.getChannel(accountId).catch(() => ({ channel: null as Channel | null })),
    ]).then(([s, r, c]) => {
      setScripts((s as { scripts: Script[] }).scripts || []);
      setRenders((r as { renders: Render[] }).renders || []);
      setChannel((c as { channel?: Channel }).channel || null);
      setLoading(false);
    });
  }, [accountId]);

  const pendingScripts = scripts.filter((s) => !s.approved && s.status !== 'approved' && s.status !== 'published').length;
  const renderingCount = renders.filter((r) => r.status === 'processing' || r.status === 'rendering').length;
  const publishedThisMonth = renders.filter((r) => {
    if (r.status !== 'published') return false;
    if (!r.created_at) return false;
    const d = new Date(r.created_at);
    const now = new Date();
    return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
  }).length;

  const needsSetup = !loading && (!channel?.channel_id || !channel?.selected_avatar || !channel?.topic);

  return (
    <div>
      <h1 className={styles.pageTitle}>Overview</h1>
      <p className={styles.pageDesc}>Welcome back. Here&apos;s the status of your AI YouTube channel.</p>

      {needsSetup && (
        <div
          style={{
            margin: '0 0 1.5rem 0',
            padding: '1rem 1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(236, 72, 153, 0.35)',
            background: 'rgba(236, 72, 153, 0.08)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem' }}>
            <strong style={{ color: '#ec4899' }}>Complete your setup</strong> — pick your avatar and confirm your topic so we can generate scripts.
          </div>
          <Link
            href="/dashboard/channel"
            style={{
              background: '#ec4899',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.8125rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Finish setup →
          </Link>
        </div>
      )}

      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.label}>Subscription</div>
          <div className={styles.value}>Launch</div>
          <div className={styles.subValue}>4 videos / month</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Scripts Pending</div>
          <div className={styles.value}>{loading ? '—' : pendingScripts}</div>
          <Link href="/dashboard/scripts" style={{ color: '#ec4899', fontSize: '0.8125rem', textDecoration: 'underline' }}>
            Review →
          </Link>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Rendering</div>
          <div className={styles.value}>{loading ? '—' : renderingCount}</div>
          <div className={styles.subValue}>Videos in production</div>
        </div>
        <div className={styles.card}>
          <div className={styles.label}>Published (Month)</div>
          <div className={styles.value}>{loading ? '—' : publishedThisMonth}</div>
          <Link href="/dashboard/videos" style={{ color: '#ec4899', fontSize: '0.8125rem', textDecoration: 'underline' }}>
            View →
          </Link>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.row}>
          <Link href="/dashboard/scripts" className={styles.btn}>Generate New Scripts</Link>
          {channel?.channel_url ? (
            <a href={channel.channel_url} target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnSecondary}`}>
              View Channel ↗
            </a>
          ) : (
            <Link href="/dashboard/channel" className={`${styles.btn} ${styles.btnSecondary}`}>
              Configure Channel
            </Link>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Channel Stats</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.label}>Subscribers</div>
            <div className={styles.value}>{channel?.subscriber_count?.toLocaleString() ?? '—'}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.label}>Total Views</div>
            <div className={styles.value}>{channel?.view_count?.toLocaleString() ?? '—'}</div>
          </div>
          <div className={styles.card}>
            <div className={styles.label}>Videos</div>
            <div className={styles.value}>{channel?.video_count ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
