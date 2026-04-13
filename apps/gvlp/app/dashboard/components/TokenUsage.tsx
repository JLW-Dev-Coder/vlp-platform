'use client';

import { useEffect, useState } from 'react';
import { Operator, Play, getPlays } from '@/lib/api';
import styles from './TokenUsage.module.css';

const GVLP_TIERS: Record<string, { tokens: number }> = {
  starter:    { tokens: 100  },
  apprentice: { tokens: 500  },
  strategist: { tokens: 1500 },
  navigator:  { tokens: 5000 },
};

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

interface Props {
  operator: Operator;
}

export default function TokenUsage({ operator }: Props) {
  const [plays, setPlays] = useState<Play[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPlays(operator.account_id, { days: '30' })
      .then((r) => setPlays(r.plays))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [operator.account_id]);

  const tierInfo = GVLP_TIERS[operator.tier] ?? { tokens: operator.tokens_balance };
  const total = tierInfo.tokens;
  const used = Math.max(0, total - operator.tokens_balance);
  const usedPct = total > 0 ? Math.min(100, (used / total) * 100) : 0;

  const barColor = usedPct >= 90 ? '#c41e3a' : usedPct >= 65 ? '#ffd700' : '#2aaa60';

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Token Usage</h1>
      <p className={styles.subheading}>Monitor your token consumption and recent plays.</p>

      {/* Balance bar */}
      <div className={styles.balanceCard}>
        <div className={styles.balanceHeader}>
          <span className={styles.balanceLabel}>Token Balance</span>
          <span className={styles.balanceFraction}>
            {used.toLocaleString()} / {total.toLocaleString()} used
          </span>
        </div>
        <div className={styles.barTrack}>
          <div
            className={styles.barFill}
            style={{ width: `${usedPct}%`, '--bar-color': barColor } as React.CSSProperties}
          />
        </div>
        <div className={styles.balanceFooter}>
          <span className={styles.remaining}>
            {operator.tokens_balance.toLocaleString()} tokens remaining
          </span>
          <span className={styles.pct}>{Math.round(usedPct)}% used</span>
        </div>
      </div>

      {/* Plays table */}
      <div className={styles.tableSection}>
        <h2 className={styles.tableTitle}>Last 30 Days — Play History</h2>

        {loading && <p className={styles.stateMsg}>Loading plays…</p>}
        {error   && <p className={styles.errorMsg}>⚠️ {error}</p>}

        {!loading && !error && plays.length === 0 && (
          <p className={styles.stateMsg}>No plays recorded in the last 30 days.</p>
        )}

        {!loading && !error && plays.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Game</th>
                  <th>Visitor ID</th>
                  <th>Date</th>
                  <th>Tokens Used</th>
                </tr>
              </thead>
              <tbody>
                {plays.map((play) => {
                  const meta = GAME_META[play.game_slug] ?? { name: play.game_slug, emoji: '🎮' };
                  const date = new Date(play.played_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  });
                  const shortVisitor = play.visitor_id.length > 16
                    ? `${play.visitor_id.slice(0, 8)}…${play.visitor_id.slice(-6)}`
                    : play.visitor_id;

                  return (
                    <tr key={play.id}>
                      <td>
                        <span className={styles.gameCell}>
                          <span>{meta.emoji}</span>
                          <span>{meta.name}</span>
                        </span>
                      </td>
                      <td>
                        <code className={styles.visitorId}>{shortVisitor}</code>
                      </td>
                      <td>{date}</td>
                      <td>
                        <span className={styles.tokensUsed}>{play.tokens_used}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
