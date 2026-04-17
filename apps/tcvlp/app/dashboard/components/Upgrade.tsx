'use client';

import { useState } from 'react';
import { createTcvlpCheckout } from '@/lib/api';
import { TcvlpTier, tierLabel, tierPrice, STRIPE_PRICES } from '@/lib/tiers';
import { useSubscriptionStatus } from '@/lib/account-context';
import styles from './shared.module.css';

const TIER_FEATURES: Record<TcvlpTier, string[]> = {
  tcvlp_starter: [
    'Form 843 generation',
    'Branded claim page (1)',
    'Penalty calculations',
    'Taxpayer dashboard',
    'Kwong eligibility checker',
    'Email support',
  ],
  tcvlp_professional: [
    'Everything in Starter',
    'Unlimited claim pages',
    'Priority generation',
    'Bulk PDF export (ZIP)',
    'Transcript integration (TTMP)',
  ],
  tcvlp_firm: [
    'Everything in Professional',
    'White-label branding',
    'Multi-practitioner access',
    'API access',
    'Dedicated support (4hr SLA)',
  ],
};

const TIERS: TcvlpTier[] = ['tcvlp_starter', 'tcvlp_professional', 'tcvlp_firm'];

export default function Upgrade() {
  const { data: sub } = useSubscriptionStatus();
  const [loading, setLoading] = useState<TcvlpTier | null>(null);
  const [error, setError] = useState('');

  const currentTier = (sub?.plan || null) as TcvlpTier | null;
  const isActive = sub?.active ?? false;

  const handleCheckout = async (tier: TcvlpTier) => {
    setLoading(tier);
    setError('');
    try {
      const result = await createTcvlpCheckout(STRIPE_PRICES[tier]);
      const url = result.url || result.session_url;
      if (url) {
        window.location.href = url;
      } else {
        setError('Failed to get checkout URL');
        setLoading(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
      setLoading(null);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Plan & Billing</h1>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <div className={styles.tiersGrid}>
        {TIERS.map((tier) => {
          const isCurrent = isActive && currentTier === tier;
          return (
            <div
              key={tier}
              className={`${styles.planCard} ${tier === 'tcvlp_professional' ? styles.planCardPopular : ''}`}
            >
              {tier === 'tcvlp_professional' && (
                <div className={styles.popularBadge}>Most Popular</div>
              )}
              <div className={styles.planHeader}>
                <span className={styles.planName}>{tierLabel(tier)}</span>
                {isCurrent && (
                  <span className={`${styles.planStatus} ${styles.statusActive}`}>Current Plan</span>
                )}
              </div>
              <div className={styles.planPrice}>
                <span className={styles.planAmount}>${tierPrice(tier)}</span>
                <span className={styles.planPeriod}>/month</span>
              </div>
              <ul className={styles.planFeatures}>
                {TIER_FEATURES[tier].map((f) => (
                  <li key={f} className={styles.planFeature}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <p className={styles.hint} style={{ textAlign: 'center', marginTop: '1rem' }}>
                  To manage your subscription or cancel, contact{' '}
                  <a href="/support" style={{ color: 'var(--color-blue)', textDecoration: 'underline' }}>support</a>.
                </p>
              ) : (
                <button
                  className={styles.saveBtn}
                  onClick={() => handleCheckout(tier)}
                  disabled={loading !== null}
                >
                  {loading === tier
                    ? 'Redirecting to Stripe...'
                    : isCurrent
                    ? 'Current Plan'
                    : `Subscribe — $${tierPrice(tier)}/mo`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.deadlineCard}>
        <strong>Deadline:</strong> Kwong claim deadline is <strong>July 10, 2026</strong>.
        Keep your subscription active to serve clients through this window.
      </div>
    </div>
  );
}
