'use client';

import { useState } from 'react';
import { useOperator } from '@/lib/operator-context';
import styles from './EmbedCode.module.css';

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

function buildIframe(clientId: string, slug: string): string {
  return `<iframe src="https://games.virtuallaunch.pro/embed?client_id=${clientId}&game=${slug}" width="100%" height="600" frameborder="0"></iframe>`;
}

export default function EmbedCode() {
  const { data: operator } = useOperator();
  const [copied, setCopied] = useState<string | null>(null);

  if (!operator) return null;

  const handleCopy = (slug: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(slug);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Embed Code</h1>
      <p className={styles.subheading}>
        Copy any snippet below and paste it into your website to embed a game.
      </p>

      {operator.unlocked_games.length === 0 ? (
        <div className={styles.empty}>
          <span>🎮</span>
          <p>No games unlocked. Upgrade your plan to get embed codes.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {operator.unlocked_games.map((slug) => {
            const meta = GAME_META[slug] ?? { name: slug, emoji: '🎮' };
            const code = buildIframe(operator.client_id, slug);
            const isCopied = copied === slug;

            return (
              <div key={slug} className={styles.gameBlock}>
                <div className={styles.gameHeader}>
                  <span className={styles.gameEmoji}>{meta.emoji}</span>
                  <span className={styles.gameName}>{meta.name}</span>
                </div>
                <div className={styles.codeWrapper}>
                  <pre className={styles.pre}>
                    <code className={styles.code}>{code}</code>
                  </pre>
                  <button
                    className={`${styles.copyBtn} ${isCopied ? styles.copyBtnSuccess : ''}`}
                    onClick={() => handleCopy(slug, code)}
                    aria-label={`Copy embed code for ${meta.name}`}
                  >
                    {isCopied ? '✓ Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
