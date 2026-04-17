'use client';

import { useState } from 'react';
import { createCheckout } from '@/lib/api';
import { useOperator } from '@/lib/operator-context';
import styles from './Upgrade.module.css';

const GVLP_TIERS = {
  starter:    { tokens: 100,  games: 1, monthly: 0,  label: 'Starter'    },
  apprentice: { tokens: 500,  games: 3, monthly: 9,  label: 'Apprentice' },
  strategist: { tokens: 1500, games: 6, monthly: 19, label: 'Strategist' },
  navigator:  { tokens: 5000, games: 9, monthly: 39, label: 'Navigator'  },
} as const;

type TierKey = keyof typeof GVLP_TIERS;

const TIER_ORDER: TierKey[] = ['starter', 'apprentice', 'strategist', 'navigator'];

export default function Upgrade() {
  const { data: operator } = useOperator();
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  if (!operator) return null;

  const currentIdx = TIER_ORDER.indexOf(operator.tier as TierKey);

  const handleUpgrade = async (tier: TierKey) => {
    setLoadingTier(tier);
    setCheckoutError(null);
    try {
      const { session_url } = await createCheckout(operator.account_id, tier);
      window.location.href = session_url;
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Upgrade Your Plan</h1>
      <p className={styles.subheading}>
        Choose a plan that fits your practice. Upgrade anytime — pay monthly, cancel anytime.
      </p>

      {checkoutError && (
        <div className={styles.errorMsg}>⚠️ {checkoutError}</div>
      )}

      <div className={styles.tierGrid}>
        {TIER_ORDER.map((key) => {
          const tier = GVLP_TIERS[key];
          const isCurrent = key === operator.tier;
          const tierIdx = TIER_ORDER.indexOf(key);
          const isUpgrade = tierIdx > currentIdx;
          const isDowngrade = tierIdx < currentIdx;

          return (
            <div
              key={key}
              className={`${styles.tierCard} ${isCurrent ? styles.tierCardCurrent : ''} ${key === 'strategist' ? styles.tierCardFeatured : ''}`}
            >
              {key === 'strategist' && (
                <div className={styles.featuredBadge}>Most Popular</div>
              )}

              <div className={styles.tierHeader}>
                <span className={styles.tierLabel}>{tier.label}</span>
                <div className={styles.tierPrice}>
                  {tier.monthly === 0 ? (
                    <span className={styles.priceFree}>Free</span>
                  ) : (
                    <>
                      <span className={styles.priceAmount}>${tier.monthly}</span>
                      <span className={styles.pricePer}>/mo</span>
                    </>
                  )}
                </div>
              </div>

              <ul className={styles.featureList}>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon}>🪙</span>
                  <span><strong>{tier.tokens.toLocaleString()}</strong> tokens / month</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon}>🎮</span>
                  <span><strong>{tier.games}</strong> game{tier.games > 1 ? 's' : ''} unlocked</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon}>🔗</span>
                  <span>Embed code access</span>
                </li>
                <li className={styles.featureItem}>
                  <span className={styles.featureIcon}>📊</span>
                  <span>Play analytics</span>
                </li>
              </ul>

              <div className={styles.tierAction}>
                {isCurrent ? (
                  <span className={styles.currentBadge}>Current Plan</span>
                ) : isUpgrade ? (
                  <button
                    className={styles.upgradeBtn}
                    onClick={() => handleUpgrade(key)}
                    disabled={loadingTier !== null}
                  >
                    {loadingTier === key ? 'Redirecting…' : `Upgrade to ${tier.label}`}
                  </button>
                ) : isDowngrade ? (
                  <button
                    className={styles.downgradeBtn}
                    onClick={() => handleUpgrade(key)}
                    disabled={loadingTier !== null}
                  >
                    {loadingTier === key ? 'Redirecting…' : `Switch to ${tier.label}`}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
