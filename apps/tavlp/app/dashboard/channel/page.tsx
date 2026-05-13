'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';
import { tavlpApi, type Avatar, type Channel, type CustomAvatar } from '@/lib/api';
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
  const [customAvatar, setCustomAvatar] = useState<CustomAvatar | null>(null);
  const [customPhoto, setCustomPhoto] = useState<File | null>(null);
  const [customGender, setCustomGender] = useState<'male' | 'female'>('female');
  const [uploadingCustom, setUploadingCustom] = useState(false);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!accountId) return;
    Promise.all([
      tavlpApi.getChannel(accountId).catch(() => ({ channel: null as Channel | null })),
      tavlpApi.listAvatars().catch(() => ({ avatars: [] as Avatar[] })),
      tavlpApi.getCustomAvatarStatus(accountId).catch(() => ({ custom_avatar: null as CustomAvatar | null })),
    ]).then(([c, a, ca]) => {
      const ch = (c as { channel?: Channel | null }).channel || null;
      setChannel(ch);
      setSelectedAvatar(ch?.avatar_preference || ch?.selected_avatar || '');
      setAvatars((a as { avatars: Avatar[] }).avatars || []);
      setCustomAvatar((ca as { custom_avatar: CustomAvatar | null }).custom_avatar || null);
      setLoading(false);
    });
  }, [accountId]);

  // Poll training status while pending/training.
  useEffect(() => {
    if (!accountId || !customAvatar) return;
    if (customAvatar.training_status !== 'pending' && customAvatar.training_status !== 'training') return;
    const t = setInterval(async () => {
      try {
        const r = await tavlpApi.getCustomAvatarStatus(accountId);
        if (r.custom_avatar) setCustomAvatar(r.custom_avatar);
      } catch {}
    }, 15000);
    return () => clearInterval(t);
  }, [accountId, customAvatar]);

  const uploadCustom = async () => {
    if (!accountId || !customPhoto) return;
    setUploadingCustom(true);
    setError(null); setSuccess(null);
    try {
      const r = await tavlpApi.uploadCustomAvatar(accountId, customPhoto, customGender);
      setCustomAvatar({
        group_id: r.group_id,
        talking_photo_id: r.talking_photo_id,
        training_status: r.training_status,
        gender: customGender,
      });
      setCustomPhoto(null);
      if (photoInputRef.current) photoInputRef.current.value = '';
      setSuccess(r.message || 'Your custom avatar is being created. This usually takes a few minutes.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to upload photo');
    } finally {
      setUploadingCustom(false);
    }
  };

  const useCustomAvatar = async () => {
    if (!accountId) return;
    setSubmitting(true);
    setError(null); setSuccess(null);
    try {
      await tavlpApi.setChannel(accountId, { avatar_preference: 'custom' });
      setSelectedAvatar('custom');
      setSuccess('Custom avatar set as your preference.');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to set custom avatar');
    } finally {
      setSubmitting(false);
    }
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    if (f && f.size > 10 * 1024 * 1024) {
      setError('Photo must be under 10MB');
      e.target.value = '';
      return;
    }
    if (f && f.type !== 'image/jpeg' && f.type !== 'image/png') {
      setError('Photo must be JPEG or PNG');
      e.target.value = '';
      return;
    }
    setError(null);
    setCustomPhoto(f);
  };

  const saveAvatar = async () => {
    if (!accountId || !selectedAvatar) return;
    setSubmitting(true);
    setError(null); setSuccess(null);
    try {
      await tavlpApi.setChannel(accountId, { selected_avatar: selectedAvatar, avatar_preference: selectedAvatar });
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
        <h2 className={styles.sectionTitle}>
          Custom Avatar{' '}
          <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#ec4899', border: '1px solid #ec4899', borderRadius: '0.375rem', padding: '0.125rem 0.5rem', marginLeft: '0.5rem', verticalAlign: 'middle' }}>
            Pro
          </span>
        </h2>
        <div className={styles.card}>
          {!customAvatar && (
            <>
              <p style={{ fontSize: '0.9375rem', marginBottom: '1rem', color: 'var(--color-text-2, #94a3b8)' }}>
                Upload your photo and we&apos;ll create a custom AI avatar trained on your likeness. Used for your videos instead of the stock avatars above.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
                  <input type="radio" name="custom-gender" checked={customGender === 'female'} onChange={() => setCustomGender('female')} />
                  <span>Female</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'pointer' }}>
                  <input type="radio" name="custom-gender" checked={customGender === 'male'} onChange={() => setCustomGender('male')} />
                  <span>Male</span>
                </label>
              </div>
              <input
                ref={photoInputRef}
                type="file"
                accept="image/jpeg,image/png"
                onChange={onPhotoChange}
                style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.875rem' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-3, #64748b)', marginBottom: '1rem' }}>
                JPEG or PNG, max 10MB. Use a clear, well-lit, front-facing photo for best results.
              </p>
              <button className={styles.btn} onClick={uploadCustom} disabled={uploadingCustom || !customPhoto}>
                {uploadingCustom ? <span className={styles.spinner} /> : 'Create My Avatar'}
              </button>
            </>
          )}
          {customAvatar && (customAvatar.training_status === 'pending' || customAvatar.training_status === 'training') && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className={styles.spinner} />
              <span>Your custom avatar is being trained… This usually takes a few minutes.</span>
            </div>
          )}
          {customAvatar && customAvatar.training_status === 'ready' && (
            <>
              <div style={{ marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#22c55e', border: '1px solid #22c55e', borderRadius: '0.375rem', padding: '0.125rem 0.5rem' }}>
                  Ready
                </span>
                <span style={{ marginLeft: '0.5rem', fontSize: '0.9375rem' }}>
                  Your custom avatar is ready to use.
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  className={styles.btn}
                  onClick={useCustomAvatar}
                  disabled={submitting || selectedAvatar === 'custom'}
                >
                  {selectedAvatar === 'custom' ? 'Custom Avatar Selected' : 'Use Custom Avatar'}
                </button>
                <button
                  className={styles.btn}
                  onClick={() => setCustomAvatar(null)}
                  disabled={submitting || uploadingCustom}
                  style={{ background: 'transparent', border: '1px solid var(--color-border, rgba(255,255,255,0.16))' }}
                >
                  Upload New Photo
                </button>
              </div>
            </>
          )}
          {customAvatar && customAvatar.training_status === 'failed' && (
            <>
              <p style={{ color: '#ef4444', marginBottom: '0.75rem' }}>Custom avatar training failed. Please try again with a different photo.</p>
              <button
                className={styles.btn}
                onClick={() => setCustomAvatar(null)}
              >
                Try Again
              </button>
            </>
          )}
        </div>
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
