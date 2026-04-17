'use client';

import { useEffect, useState } from 'react';
import { getPlays } from '@/lib/api';
import { useOperator } from '@/lib/operator-context';
import styles from './Overview.module.css';

const GAME_META: Record<string, { name: string; emoji: string }> = {
  'tax-trivia':          { name: 'Tax Trivia',         emoji: '🏛️' },
  'tax-match-mania':     { name: 'Tax Match Mania',     emoji: '🃏' },
  'tax-spin-wheel':      { name: 'Tax Spin Wheel',      emoji: '🎰' },
  'tax-word-search':     { name: 'Tax Word Search',     emoji: '🔍' },
  'irs-fact-or-fiction': { name: 'IRS Fact or Fiction', emoji: '🤔' },
  'capital-gains-climb': { name: 'Capital Gains Climb', emoji: '📈' },
  'deduction-dash':      { name: 'Deduction Dash',      emoji: '⚡' },
  'refund-rush':         { name: 'Refund Rush',         emoji: '💰' },
  'audit-escape-room':   { name: 'Audit Escape Room',   emoji: '🔐' },
};

const TIER_COLORS: Record<string, string> = {
  starter:    '#9a7a85',
  apprentice: '#4a90d9',
  strategist: '#ffd700',
  navigator:  '#c41e3a',
};

export default function Overview() {
  const { data: operator } = useOperator();
  const [playCount, setPlayCount] = useState<number | null>(null);
  const [loadingPlays, setLoadingPlays] = useState(true);

  useEffect(() => {
    if (!operator) return;
    getPlays(operator.account_id, { days: '30' })
      .then((r) => setPlayCount(r.total))
      .catch(() => setPlayCount(null))
      .finally(() => setLoadingPlays(false));
  }, [operator?.account_id]);

  if (!operator) return null;

  const tierLabel = operator.tier.charAt(0).toUpperCase() + operator.tier.slice(1);
  const tierColor = TIER_COLORS[operator.tier] ?? '#9a7a85';

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        Welcome back{operator.name ? `, ${operator.name}` : ''}
      </h1>
      <p className={styles.subheading}>Here&apos;s a snapshot of your GVLP account.</p>

      <div className={styles.statsRow}>
        {/* Tier card */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Current Plan</div>
          <div className={styles.tierBadge} style={{ '--tier-color': tierColor } as React.CSSProperties}>
            {tierLabel}
          </div>
        </div>

        {/* Token balance */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Token Balance</div>
          <div className={styles.statValue}>
            {operator.tokens_balance.toLocaleString()}
          </div>
          <div className={styles.statSub}>tokens remaining</div>
        </div>

        {/* Plays last 30 days */}
        <div className={styles.card}>
          <div className={styles.cardLabel}>Plays (last 30 days)</div>
          <div className={styles.statValue}>
            {loadingPlays ? '…' : playCount !== null ? playCount.toLocaleString() : '—'}
          </div>
          <div className={styles.statSub}>total game sessions</div>
        </div>
      </div>

      {/* Unlocked games */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Unlocked Games</h2>
        {operator.unlocked_games.length === 0 ? (
          <p className={styles.empty}>No games unlocked yet. Upgrade your plan to add games.</p>
        ) : (
          <div className={styles.gameGrid}>
            {operator.unlocked_games.map((slug) => {
              const meta = GAME_META[slug] ?? { name: slug, emoji: '🎮' };
              return (
                <div key={slug} className={styles.gameCard}>
                  <span className={styles.gameEmoji}>{meta.emoji}</span>
                  <span className={styles.gameName}>{meta.name}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
