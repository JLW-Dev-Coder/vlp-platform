'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Render } from '@/lib/api';
import styles from '../dashboard.module.css';

function statusBadge(r: Render) {
  if (r.status === 'published') return <span className={`${styles.badge} ${styles.badgePublished}`}>Published</span>;
  if (r.status === 'completed') return <span className={`${styles.badge} ${styles.badgeRendered}`}>Ready</span>;
  if (r.status === 'failed') return <span className={`${styles.badge} ${styles.badgeFailed}`}>Failed</span>;
  return <span className={`${styles.badge} ${styles.badgeRendering}`}>Processing</span>;
}

export default function VideosPage() {
  const { session } = useAppShell();
  const accountId = session.account_id || '';
  const isAdmin = session.role === 'admin' || session.role === 'operator';
  const [renders, setRenders] = useState<Render[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState<string | null>(null);

  const load = () => {
    if (!accountId) return;
    setLoading(true);
    tavlpApi.listRenders(accountId)
      .then((r) => setRenders(r.renders || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [accountId]);

  const checkStatus = async (renderId: string) => {
    setChecking(renderId);
    try {
      await tavlpApi.renderStatus(renderId);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to check status');
    } finally {
      setChecking(null);
    }
  };

  const sorted = [...renders].sort((a, b) => {
    const ad = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bd = b.created_at ? new Date(b.created_at).getTime() : 0;
    return bd - ad;
  });

  return (
    <div>
      <h1 className={styles.pageTitle}>Videos</h1>
      <p className={styles.pageDesc}>Track renders from production through publication.</p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      {loading ? (
        <div className={styles.emptyState}>Loading…</div>
      ) : sorted.length === 0 ? (
        <div className={styles.emptyState}>No videos yet. Approve a script to start your first render.</div>
      ) : (
        sorted.map((r) => (
          <div key={r.render_id} className={styles.scriptItem}>
            <div className={styles.scriptHeader}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.scriptTitle}>
                  {r.script_title || 'Untitled video'}
                </div>
                <div className={styles.scriptHook}>
                  Avatar: <strong>{r.avatar_name || '—'}</strong>
                  {r.created_at && ` · ${new Date(r.created_at).toLocaleDateString()}`}
                </div>
                {r.status === 'failed' && r.error && (
                  <div className={styles.scriptHook} style={{ color: '#f87171' }}>{r.error}</div>
                )}
              </div>
              <div className={styles.row}>
                {statusBadge(r)}
                {(r.status === 'processing' || r.status === 'rendering') && (
                  <button
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => checkStatus(r.render_id)}
                    disabled={checking === r.render_id}
                  >
                    {checking === r.render_id ? <span className={styles.spinner} /> : 'Check Status'}
                  </button>
                )}
                {r.status === 'published' && r.youtube_url && (
                  <a href={r.youtube_url} target="_blank" rel="noopener noreferrer" className={styles.btn}>
                    Watch on YouTube ↗
                  </a>
                )}
                {r.status === 'completed' && isAdmin && (
                  <span className={`${styles.badge} ${styles.badgeApproved}`}>Admin: Upload via Worker</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
