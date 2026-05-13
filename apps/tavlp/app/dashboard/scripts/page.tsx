'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Script } from '@/lib/api';
import styles from '../dashboard.module.css';

function statusBadge(s: Script) {
  if (s.status === 'published') return <span className={`${styles.badge} ${styles.badgePublished}`}>Published</span>;
  if (s.status === 'rendered') return <span className={`${styles.badge} ${styles.badgeRendered}`}>Ready to Upload</span>;
  if (s.status === 'rendering') return <span className={`${styles.badge} ${styles.badgeRendering}`}>Rendering</span>;
  if (s.status === 'approved' || s.approved) return <span className={`${styles.badge} ${styles.badgeApproved}`}>Ready to Render</span>;
  return <span className={`${styles.badge} ${styles.badgePending}`}>Pending Review</span>;
}

export default function ScriptsPage() {
  const { session } = useAppShell();
  const accountId = session.account_id || '';
  const [scripts, setScripts] = useState<Script[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(4);
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const load = () => {
    if (!accountId) return;
    setLoading(true);
    tavlpApi.listScripts(accountId)
      .then((r) => setScripts(r.scripts || []))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, [accountId]);

  const onGenerate = async () => {
    if (!topic.trim() || !accountId) return;
    setGenerating(true);
    setError(null);
    try {
      await tavlpApi.generateScripts({ account_id: accountId, topic: topic.trim(), count });
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate scripts');
    } finally {
      setGenerating(false);
    }
  };

  const onApprove = async (scriptId: string) => {
    setError(null);
    try {
      await tavlpApi.approveScript(scriptId);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve script');
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Scripts</h1>
      <p className={styles.pageDesc}>Review and approve scripts before they enter the render pipeline.</p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.card} style={{ marginBottom: '1.75rem' }}>
        <h2 className={styles.sectionTitle}>Generate New Scripts</h2>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Topic</label>
          <input
            className={styles.input}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. IRS code 810 — what it means for refunds"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Number of scripts</label>
          <select className={styles.select} value={count} onChange={(e) => setCount(Number(e.target.value))}>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button className={styles.btn} onClick={onGenerate} disabled={generating || !topic.trim()}>
          {generating ? (<><span className={styles.spinner} /> &nbsp;Generating…</>) : 'Generate Scripts'}
        </button>
      </div>

      <h2 className={styles.sectionTitle}>Your Scripts</h2>
      {loading ? (
        <div className={styles.emptyState}>Loading…</div>
      ) : scripts.length === 0 ? (
        <div className={styles.emptyState}>No scripts yet. Generate your first batch above.</div>
      ) : (
        scripts.map((s) => {
          const fullText = s.body || s.script || '';
          const pending = !s.approved && s.status !== 'approved' && s.status !== 'published' && s.status !== 'rendering' && s.status !== 'rendered';
          return (
            <div key={s.script_id} className={styles.scriptItem}>
              <div className={styles.scriptHeader}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className={styles.scriptTitle}>{s.title || s.topic || 'Untitled script'}</div>
                  {s.hook && <div className={styles.scriptHook}>{s.hook}</div>}
                </div>
                <div className={styles.row}>
                  {statusBadge(s)}
                  {pending && (
                    <button className={styles.btn} onClick={() => onApprove(s.script_id)}>
                      Approve
                    </button>
                  )}
                </div>
              </div>
              {fullText && (
                <button
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  style={{ marginTop: '0.75rem', fontSize: '0.8125rem', padding: '0.375rem 0.75rem' }}
                  onClick={() => setExpanded((p) => ({ ...p, [s.script_id]: !p[s.script_id] }))}
                >
                  {expanded[s.script_id] ? 'Hide' : 'View Full Script'}
                </button>
              )}
              {expanded[s.script_id] && fullText && (
                <div className={styles.expander}>{fullText}</div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
