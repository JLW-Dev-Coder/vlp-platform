'use client';

import { useState } from 'react';
import { Session, TaxPro, createCheckout } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  pro: TaxPro | null;
  session: Session;
}

export default function Upgrade({ pro, session }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    setLoading(true);
    setError('');
    try {
      const checkout = await createCheckout(session.account_id, 'tcvlp');
      window.location.href = checkout.session_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setLoading(false);
    }
  };

  const isActive = pro?.subscription_status === 'active';

  return (
    <div>
      <h1 className={styles.pageTitle}>Plan & Billing</h1>

      <div className={styles.planCard}>
        <div className={styles.planHeader}>
          <span className={styles.planName}>TaxClaim Pro</span>
          <span className={`${styles.planStatus} ${isActive ? styles.statusActive : styles.statusInactive}`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className={styles.planPrice}>
          <span className={styles.planAmount}>$10</span>
          <span className={styles.planPeriod}>/month</span>
        </div>
        <ul className={styles.planFeatures}>
          {[
            'Branded subdomain landing page',
            'Unlimited Form 843 preparation guides',
            'IRS transcript upload & auto-fill',
            'State-based mailing address lookup',
            'Submission tracking via email',
          ].map((f) => (
            <li key={f} className={styles.planFeature}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        {!isActive && (
          <>
            {error && <div className={styles.errorMsg}>{error}</div>}
            <button className={styles.saveBtn} onClick={handleUpgrade} disabled={loading}>
              {loading ? 'Redirecting to Stripe…' : 'Subscribe — $10/month'}
            </button>
          </>
        )}

        {isActive && (
          <p className={styles.hint} style={{ textAlign: 'center', marginTop: '1rem' }}>
            To manage your subscription or cancel, contact{' '}
            <a href="/support" style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}>support</a>.
          </p>
        )}
      </div>

      <div className={styles.deadlineCard}>
        <strong>⏰ Reminder:</strong> Kwong claim deadline is <strong>July 10, 2026</strong>.
        Keep your subscription active to serve clients through this window.
      </div>
    </div>
  );
}
