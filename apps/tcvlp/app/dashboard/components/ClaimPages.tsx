'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClaimPage,
  listClaimPages,
  createClaimPage,
  updateClaimPage,
  deleteClaimPage,
} from '@/lib/api';
import styles from './shared.module.css';

const CLAIM_BASE = 'taxclaim.virtuallaunch.pro/claim?slug=';

function isProTier(plan: string | null): boolean {
  return plan === 'tcvlp_professional' || plan === 'tcvlp_firm';
}

function validSlug(s: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/.test(s);
}

export default function ClaimPages() {
  const [pages, setPages] = useState<ClaimPage[]>([]);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showCreate, setShowCreate] = useState(false);
  const [newSlug, setNewSlug] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const refresh = async () => {
    try {
      const { pages, plan } = await listClaimPages();
      setPages(pages);
      setPlan(plan);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load claim pages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleCopy = (slug: string) => {
    void navigator.clipboard.writeText(`https://${CLAIM_BASE}${slug}`);
  };

  const handleCreate = async () => {
    setCreateError('');
    if (!validSlug(newSlug)) {
      setCreateError('Slug must be 3-50 lowercase letters, numbers, or hyphens (no leading/trailing hyphens).');
      return;
    }
    setCreating(true);
    const res = await createClaimPage({
      slug: newSlug,
      title: newTitle || undefined,
      description: newDesc || undefined,
    });
    setCreating(false);
    if (!res.ok) {
      setCreateError(res.message || res.error || 'Failed to create page.');
      return;
    }
    setShowCreate(false);
    setNewSlug('');
    setNewTitle('');
    setNewDesc('');
    refresh();
  };

  const startEdit = (p: ClaimPage) => {
    setEditingId(p.page_id);
    setEditTitle(p.title ?? '');
    setEditDesc(p.description ?? '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDesc('');
  };

  const saveEdit = async (page_id: string) => {
    setSavingEdit(true);
    const res = await updateClaimPage(page_id, {
      title: editTitle || null,
      description: editDesc || null,
    });
    setSavingEdit(false);
    if (!res.ok) {
      setError(res.message || res.error || 'Failed to save changes.');
      return;
    }
    cancelEdit();
    refresh();
  };

  const toggleActive = async (p: ClaimPage) => {
    if (!p.page_id) return;
    const res = await updateClaimPage(p.page_id, { active: !p.active });
    if (!res.ok) {
      setError(res.message || res.error || 'Failed to update status.');
      return;
    }
    refresh();
  };

  const handleDelete = async (p: ClaimPage) => {
    if (!p.page_id) return;
    if (!confirm(`Deactivate the claim page "${p.slug}"? Clients with this link will no longer be able to access it.`)) return;
    const res = await deleteClaimPage(p.page_id);
    if (!res.ok) {
      setError(res.message || res.error || 'Failed to deactivate page.');
      return;
    }
    refresh();
  };

  const tierOk = isProTier(plan);
  const primary = pages.find((p) => p.primary);
  const additional = pages.filter((p) => !p.primary);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 className={styles.pageTitle}>Claim Pages</h1>
          <p className={styles.pageDesc}>Create and manage branded claim pages for your clients.</p>
        </div>
        <button
          type="button"
          className={styles.copyBtn}
          onClick={() => tierOk && setShowCreate((v) => !v)}
          disabled={!tierOk}
          title={tierOk ? undefined : 'Upgrade to Professional to create additional pages'}
          style={{
            background: tierOk ? '#eab308' : 'var(--color-surface-2)',
            color: tierOk ? '#000' : 'var(--color-text-3)',
            fontWeight: 600,
            cursor: tierOk ? 'pointer' : 'not-allowed',
          }}
        >
          + Create New Page
        </button>
      </div>

      {!tierOk && !loading ? (
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>⭐</div>
          <div>
            <h2 className={styles.subTitle}>Unlimited Claim Pages — Professional &amp; Firm</h2>
            <p className={styles.infoText}>
              Create as many branded claim pages as you need — one per office, partner, campaign, or client group.
              Available on Professional and Firm tiers.
            </p>
            <Link href="/dashboard/upgrade" className={styles.inlineLink} style={{ display: 'inline-block', marginTop: '0.5rem' }}>
              Upgrade now →
            </Link>
          </div>
        </div>
      ) : null}

      {error ? <div className={styles.errorMsg} style={{ marginBottom: '1rem' }}>{error}</div> : null}

      {loading ? (
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading claim pages…</div>
      ) : (
        <>
          {/* Primary page */}
          {primary ? (
            <div className={styles.urlCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div className={styles.urlCardLabel}>
                    Primary Page
                    <span style={{
                      marginLeft: '0.5rem',
                      padding: '0.125rem 0.5rem',
                      borderRadius: '9999px',
                      background: 'rgba(234, 179, 8, 0.15)',
                      color: '#fbbf24',
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>Default</span>
                  </div>
                  <div className={styles.urlCode}>{CLAIM_BASE}{primary.slug}</div>
                </div>
                <button type="button" className={styles.copyBtn} onClick={() => handleCopy(primary.slug)}>Copy URL</button>
              </div>
              <p className={styles.urlNote}>This is your default claim page. It cannot be deleted.</p>
            </div>
          ) : null}

          {/* Create form */}
          {showCreate && tierOk ? (
            <div className={styles.urlCard}>
              <h2 className={styles.subTitle}>New Claim Page</h2>
              <div className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Slug <span className={styles.required}>*</span></label>
                  <input
                    className={styles.input}
                    type="text"
                    value={newSlug}
                    onChange={(e) => setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    placeholder="e.g. boston-office"
                    maxLength={50}
                  />
                  <span className={styles.hint}>
                    Preview: <code style={{ color: '#60a5fa' }}>{CLAIM_BASE}{newSlug || 'your-slug'}</code>
                  </span>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Custom Title (optional)</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Custom page title shown to clients"
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Custom Description (optional)</label>
                  <textarea
                    className={styles.textarea}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Custom description shown to clients"
                    rows={3}
                  />
                </div>
                {createError ? <div className={styles.errorMsg}>{createError}</div> : null}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className={styles.saveBtn} onClick={handleCreate} disabled={creating} style={{ width: 'auto' }}>
                    {creating ? 'Creating…' : 'Create Page'}
                  </button>
                  <button type="button" className={styles.copyBtn} onClick={() => { setShowCreate(false); setCreateError(''); }}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {/* Additional pages */}
          {additional.length === 0 && !showCreate ? (
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>📄</div>
              <div>
                <h2 className={styles.subTitle}>No Additional Claim Pages Yet</h2>
                <p className={styles.infoText}>
                  You haven&apos;t created any additional claim pages yet. Create a new page to share a custom intake link
                  with different client groups, offices, or campaigns.
                </p>
                {tierOk ? (
                  <button
                    type="button"
                    onClick={() => setShowCreate(true)}
                    className={styles.copyBtn}
                    style={{ marginTop: '0.75rem', background: '#eab308', color: '#000', fontWeight: 600 }}
                  >
                    Create Your First Page
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            additional.map((p) => {
              const editing = editingId === p.page_id;
              return (
                <div key={p.page_id ?? p.slug} className={styles.urlCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className={styles.urlCode}>{CLAIM_BASE}{p.slug}</div>
                      {!editing && p.title ? (
                        <div style={{ marginTop: '0.5rem', fontWeight: 600, color: 'var(--color-text-1)' }}>{p.title}</div>
                      ) : null}
                      {!editing && p.description ? (
                        <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: 'var(--color-text-2)' }}>{p.description}</div>
                      ) : null}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.6875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        background: p.active ? 'rgba(34, 197, 94, 0.15)' : 'rgba(220, 38, 38, 0.15)',
                        color: p.active ? '#4ade80' : '#f87171',
                      }}>{p.active ? 'Active' : 'Inactive'}</span>
                      <button type="button" className={styles.copyBtn} onClick={() => handleCopy(p.slug)}>Copy URL</button>
                    </div>
                  </div>

                  {editing ? (
                    <div className={styles.form} style={{ marginTop: '1rem' }}>
                      <div className={styles.field}>
                        <label className={styles.label}>Custom Title</label>
                        <input
                          className={styles.input}
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </div>
                      <div className={styles.field}>
                        <label className={styles.label}>Custom Description</label>
                        <textarea
                          className={styles.textarea}
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className={styles.saveBtn} onClick={() => p.page_id && saveEdit(p.page_id)} disabled={savingEdit} style={{ width: 'auto' }}>
                          {savingEdit ? 'Saving…' : 'Save'}
                        </button>
                        <button type="button" className={styles.copyBtn} onClick={cancelEdit}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button type="button" className={styles.copyBtn} onClick={() => startEdit(p)}>Edit</button>
                      <button type="button" className={styles.copyBtn} onClick={() => toggleActive(p)}>
                        {p.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        type="button"
                        className={styles.copyBtn}
                        onClick={() => handleDelete(p)}
                        style={{ color: '#f87171' }}
                      >
                        Delete
                      </button>
                      {p.created_at ? (
                        <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--color-text-3)' }}>
                          Created {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
