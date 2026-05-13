'use client';

import { useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Avatar, type Channel } from '@/lib/api';
import styles from '../dashboard.module.css';

const TRANSFER_DISCLAIMER =
  'By clicking continue, we will have the option to cancel your request. Once approved, this action cannot be reversed. Your subscription will immediately be cancelled. Transfer will occur within 7 business days. You can always have us upload new videos by re-subscribing and inviting us back as manager.';

export default function ChannelPage() {
  const { session } = useAppShell();
  const accountId = session.account_id || '';
  const [channel, setChannel] = useState<Channel | null>(null);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  const [transferOptIn, setTransferOptIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accountId) return;
    Promise.all([
      tavlpApi.getChannel(accountId).catch(() => ({ channel: null as Channel | null })),
      tavlpApi.listAvatars().catch(() => ({ avatars: [] as Avatar[] })),
    ]).then(([c, a]) => {
      const ch = (c as { channel?: Channel | null }).channel || null;
      setChannel(ch);
      setSelectedAvatar(ch?.selected_avatar || '');
      setAvatars((a as { avatars: Avatar[] }).avatars || []);
      setLoading(false);
    });
  }, [accountId]);

  const saveAvatar = async () => {
    if (!accountId || !selectedAvatar) return;
    setSubmitting(true);
    setError(null); setSuccess(null);
    try {
      await tavlpApi.setChannel(accountId, { selected_avatar: selectedAvatar });
      setSuccess('Avatar updated.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save avatar');
    } finally {
      setSubmitting(false);
    }
  };

  const requestTransfer = async () => {
    if (!accountId || !transferOptIn) return;
    setSubmitting(true);
    setError(null); setSuccess(null);
    try {
      await tavlpApi.setChannel(accountId, { ...(channel || {}), transfer_requested: true, transfer_requested_at: new Date().toISOString() } as Partial<Channel>);
      setSuccess('Transfer request submitted. We will be in touch within 1 business day.');
      setTransferOptIn(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to submit transfer request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className={styles.pageTitle}>Channel</h1>
        <div className={styles.emptyState}>Loading…</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Channel</h1>
      <p className={styles.pageDesc}>Your YouTube channel info, avatar selection, and ownership transfer.</p>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {success && <div className={styles.successMsg}>{success}</div>}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Channel Info</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.label}>Channel Name</div>
            <div className={styles.value} style={{ fontSize: '1.125rem' }}>{channel?.channel_name || '—'}</div>
            {channel?.channel_url && (
              <a href={channel.channel_url} target="_blank" rel="noopener noreferrer" style={{ color: '#ec4899', fontSize: '0.8125rem', textDecoration: 'underline' }}>
                Open ↗
              </a>
            )}
          </div>
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

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Avatar</h2>
        {avatars.length === 0 ? (
          <div className={styles.emptyState}>No avatars available. Check back shortly.</div>
        ) : (
          <>
            <div className={styles.grid}>
              {avatars.map((a) => {
                const preview = a.looks?.[0]?.preview_image_url;
                const selected = selectedAvatar === a.name;
                return (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => setSelectedAvatar(a.name)}
                    className={`${styles.avatarOption} ${selected ? styles.avatarOptionSelected : ''}`}
                  >
                    {preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview} alt={a.name} className={styles.avatarPreview} />
                    ) : (
                      <div className={styles.avatarPreview} />
                    )}
                    <div className={styles.avatarName}>{a.name}</div>
                    <div className={styles.avatarMeta}>{a.looks_count} looks</div>
                  </button>
                );
              })}
            </div>
            <button className={styles.btn} onClick={saveAvatar} disabled={submitting || !selectedAvatar || selectedAvatar === channel?.selected_avatar}>
              {submitting ? <span className={styles.spinner} /> : 'Save Avatar'}
            </button>
          </>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Channel Ownership Transfer</h2>
        <div className={styles.card}>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={transferOptIn}
              onChange={(e) => setTransferOptIn(e.target.checked)}
              style={{ marginTop: '0.25rem' }}
            />
            <span style={{ fontSize: '0.9375rem' }}>I&apos;d like to transfer ownership of the channel to me</span>
          </label>
          <div className={styles.disclaimer}>{TRANSFER_DISCLAIMER}</div>
          <button
            className={styles.btn}
            onClick={requestTransfer}
            disabled={!transferOptIn || submitting}
          >
            {submitting ? <span className={styles.spinner} /> : 'Continue to review & approve transfer'}
          </button>
        </div>
      </div>
    </div>
  );
}
