'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Channel } from '@/lib/api';
import styles from '../dashboard.module.css';

export default function SettingsPage() {
  const { session } = useAppShell();
  const accountId = session.account_id || '';
  const [channel, setChannel] = useState<Channel | null>(null);
  const [topic, setTopic] = useState('');
  const [notifyScript, setNotifyScript] = useState(true);
  const [notifyPublished, setNotifyPublished] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!accountId) return;
    tavlpApi.getChannel(accountId)
      .then((r) => {
        const ch = r.channel || null;
        setChannel(ch);
        setTopic(ch?.topic || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [accountId]);

  const save = async () => {
    if (!accountId) return;
    setSaving(true);
    setError(null); setSuccess(null);
    try {
      await tavlpApi.setChannel(accountId, {
        ...(channel || {}),
        topic,
        notify_script_ready: notifyScript,
        notify_video_published: notifyPublished,
      } as Partial<Channel>);
      setSuccess('Settings saved.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Settings</h1>
      <p className={styles.pageDesc}>Account, subscription, and notification preferences.</p>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.card}>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Email</label>
            <input className={styles.input} value={session.email || ''} readOnly />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription</h2>
        <div className={styles.card}>
          <div className={styles.label}>Current Tier</div>
          <div className={styles.value} style={{ fontSize: '1.125rem' }}>Launch · $49/mo</div>
          <div style={{ marginTop: '1rem' }}>
            <a href="https://billing.stripe.com/p/login/aEUcMS9Bmb6JaXC288" target="_blank" rel="noopener noreferrer" className={`${styles.btn} ${styles.btnSecondary}`}>
              Manage Billing ↗
            </a>
          </div>
        </div>
      </div>

      <div className={styles.section} id="topic">
        <h2 className={styles.sectionTitle}>Your Tax Topic</h2>
        <div className={styles.card}>
          {!loading && !channel?.topic && (
            <div
              style={{
                marginBottom: '0.875rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(236, 72, 153, 0.35)',
                background: 'rgba(236, 72, 153, 0.08)',
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.875rem',
              }}
            >
              Set your tax topic to get scripts tailored to your specialty. Without it, scripts default to general tax education.
            </div>
          )}
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Tax Topic</label>
            <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.5rem 0' }}>
              Your AI scripts are tailored to this specialty. Change it anytime — your next batch of scripts will use the new topic.
            </p>
            <input
              className={styles.input}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. IRS transcript codes for tax pros"
              maxLength={200}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Notifications</h2>
        <div className={styles.card}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.75rem' }}>
            <input type="checkbox" checked={notifyScript} onChange={(e) => setNotifyScript(e.target.checked)} />
            <span style={{ fontSize: '0.9375rem' }}>Email me when a new script is ready to review</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <input type="checkbox" checked={notifyPublished} onChange={(e) => setNotifyPublished(e.target.checked)} />
            <span style={{ fontSize: '0.9375rem' }}>Email me when a video is published</span>
          </label>
        </div>
      </div>

      <button className={styles.btn} onClick={save} disabled={saving || loading}>
        {saving ? <span className={styles.spinner} /> : 'Save Settings'}
      </button>
    </div>
  );
}
