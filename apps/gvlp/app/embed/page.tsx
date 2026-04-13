'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getGvlpConfig, useToken, GvlpConfig } from '@/lib/api';
import { getVisitorId } from '@/lib/visitor';
import styles from './page.module.css';

type EmbedState = 'loading' | 'locked' | 'depleted' | 'ready' | 'playing' | 'error';

function EmbedContent() {
  const searchParams = useSearchParams();
  const clientId = searchParams.get('client_id') ?? '';
  const gameSlug = searchParams.get('game') ?? '';

  const [state, setState] = useState<EmbedState>('loading');
  const [config, setConfig] = useState<GvlpConfig | null>(null);
  const [tokenBalance, setTokenBalance] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!clientId || !gameSlug) {
      setErrorMsg('Missing client_id or game parameter.');
      setState('error');
      return;
    }

    getGvlpConfig(clientId)
      .then((cfg) => {
        setConfig(cfg);
        setTokenBalance(cfg.tokens_balance);

        if (!cfg.unlocked_games.includes(gameSlug)) {
          setState('locked');
          return;
        }
        if (cfg.tokens_balance === 0) {
          setState('depleted');
          return;
        }
        setState('ready');
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to load configuration.';
        setErrorMsg(message);
        setState('error');
      });
  }, [clientId, gameSlug]);

  async function handlePlay() {
    if (!config) return;
    setState('playing');
    const visitorId = getVisitorId();
    try {
      const result = await useToken(clientId, visitorId, gameSlug);
      setTokenBalance(result.balance);
    } catch {
      // Token use failed — still allow play, balance may be stale
    }
  }

  if (state === 'loading') {
    return (
      <div className={styles.centeredState}>
        <div className={styles.spinner} aria-label="Loading" />
        <p className={styles.stateLabel}>Loading game...</p>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className={styles.centeredState}>
        <span className={styles.stateIcon}>⚠️</span>
        <p className={styles.stateLabel}>{errorMsg || 'Something went wrong. Please try again.'}</p>
      </div>
    );
  }

  if (state === 'locked') {
    return (
      <div className={styles.centeredState}>
        <span className={styles.stateIcon}>🔒</span>
        <h2 className={styles.stateHeading}>Game Locked</h2>
        <p className={styles.stateLabel}>
          This game requires an upgraded plan. Contact your tax professional.
        </p>
      </div>
    );
  }

  if (state === 'depleted') {
    return (
      <div className={styles.centeredState}>
        <span className={styles.stateIcon}>👛</span>
        <h2 className={styles.stateHeading}>No Tokens Remaining</h2>
        <p className={styles.stateLabel}>
          Token balance depleted. Contact your tax professional to add more tokens.
        </p>
      </div>
    );
  }

  if (state === 'ready') {
    return (
      <div className={styles.centeredState}>
        <span className={styles.stateIcon}>🎮</span>
        <h2 className={styles.stateHeading}>Ready to Play</h2>
        <p className={styles.stateLabel}>
          {gameSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </p>
        <button className={styles.playBtn} onClick={handlePlay}>
          Play Now
        </button>
        <p className={styles.tokenHint}>🪙 {tokenBalance} token{tokenBalance !== 1 ? 's' : ''} available</p>
      </div>
    );
  }

  // state === 'playing'
  return (
    <div className={styles.playingWrapper}>
      <div className={styles.tokenBadge}>🪙 {tokenBalance} tokens</div>
      <iframe
        className={styles.gameFrame}
        src={`/games/${gameSlug}.html`}
        title={gameSlug}
        allow="fullscreen"
        sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
      />
    </div>
  );
}

export default function EmbedPage() {
  return (
    <div className={styles.wrapper}>
      <Suspense
        fallback={
          <div className={styles.centeredState}>
            <div className={styles.spinner} aria-label="Loading" />
          </div>
        }
      >
        <EmbedContent />
      </Suspense>
    </div>
  );
}
