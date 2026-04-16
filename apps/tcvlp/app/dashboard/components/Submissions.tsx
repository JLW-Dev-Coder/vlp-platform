'use client';

import { useEffect, useState } from 'react';
import { Submission, getSubmissions, API_BASE } from '@/lib/api';
import styles from './shared.module.css';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions().then((s) => {
      setSubmissions(s);
      setLoading(false);
    });
  }, []);

  const statusBadge = (status: string) => {
    const colors: Record<string, { bg: string; color: string }> = {
      submitted: { bg: 'rgba(34, 197, 94, 0.15)', color: '#4ade80' },
      draft: { bg: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24' },
      pending: { bg: 'rgba(96, 165, 250, 0.15)', color: '#60a5fa' },
      filed: { bg: 'rgba(34, 197, 94, 0.25)', color: '#22c55e' },
    };
    const c = colors[status] ?? colors.draft;
    return (
      <span style={{
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 600,
        background: c.bg,
        color: c.color,
        textTransform: 'capitalize',
      }}>
        {status}
      </span>
    );
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Submissions</h1>
      <p className={styles.pageDesc}>Track Form 843 preparation guide submissions from your clients.</p>

      {loading ? (
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading submissions…</div>
      ) : submissions.length === 0 ? (
        <div className={styles.infoCard}>
          <div className={styles.infoIcon}>📬</div>
          <div>
            <h2 className={styles.subTitle}>No Submissions Yet</h2>
            <p className={styles.infoText}>
              When a client submits a Form 843 preparation guide through your branded page, it will appear here.
              Share your landing URL to start receiving submissions.
            </p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {submissions.map((sub) => {
            const amount = parseFloat(sub.penalty_amount ?? '0');
            const date = sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
            const downloadUrl = `${API_BASE}/v1/tcvlp/forms/843/${sub.submission_id}/download`;

            return (
              <div key={sub.submission_id} className={styles.urlCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-1)', fontSize: '1rem' }}>
                      {sub.taxpayer_name}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-3)', marginTop: '0.25rem' }}>
                      {sub.state} · Tax Year {sub.tax_year} · {date}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {statusBadge(sub.status)}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#eab308' }}>
                    ${amount > 0 ? amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {sub.notify_opt_in ? (
                      <span style={{ fontSize: '0.75rem', color: '#60a5fa' }}>
                        Notify: {sub.notify_preference === 'sms' ? 'SMS' : sub.notify_preference === 'phone' ? 'Phone' : 'Email'}
                      </span>
                    ) : null}
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.copyBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      Download PDF
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.deadlineCard}>
        <strong>Reminder:</strong> All claims must be filed by <strong>July 10, 2026</strong>.
        Encourage your clients to act soon.
      </div>
    </div>
  );
}
