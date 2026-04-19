'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MarketingHeader, capture } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';
import { getSession, createCheckout } from '@/lib/api';
import styles from './page.module.css';

/* ── Tier data ──────────────────────────────────────── */
type TierKey = 'starter' | 'apprentice' | 'strategist' | 'navigator';

interface TierInfo {
  label: string;
  tokens: number;
  games: number;
  monthly: number;
  icon: string;
  iconClass: string;
  popular?: boolean;
}

const TIERS: Record<TierKey, TierInfo> = {
  starter: {
    label: 'Starter',
    tokens: 100,
    games: 1,
    monthly: 0,
    icon: '⚡',
    iconClass: styles.tierIconGold,
  },
  apprentice: {
    label: 'Apprentice',
    tokens: 500,
    games: 3,
    monthly: 9,
    icon: '🔥',
    iconClass: styles.tierIconPink,
  },
  strategist: {
    label: 'Strategist',
    tokens: 1500,
    games: 6,
    monthly: 19,
    icon: '📈',
    iconClass: styles.tierIconRed,
    popular: true,
  },
  navigator: {
    label: 'Navigator',
    tokens: 5000,
    games: 9,
    monthly: 39,
    icon: '👑',
    iconClass: styles.tierIconCrown,
  },
};

const TIER_KEYS = Object.keys(TIERS) as TierKey[];

function isTierKey(value: string): value is TierKey {
  return TIER_KEYS.includes(value as TierKey);
}

/* ── Component ──────────────────────────────────────── */
function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTier = ((): TierKey => {
    const param = searchParams.get('tier') ?? '';
    return isTierKey(param) ? param : 'starter';
  })();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTier, setSelectedTier] = useState<TierKey>(initialTier);

  // Step 2 – operator info
  const [name, setName] = useState('');
  const [firmName, setFirmName] = useState('');
  const [email, setEmail] = useState('');

  // Async state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync tier from URL param on mount
  useEffect(() => {
    const param = searchParams.get('tier') ?? '';
    if (isTierKey(param)) setSelectedTier(param);
  }, [searchParams]);

  /* ── Stepper helpers ──────────────────────────────── */
  const dotClass = useCallback(
    (dotStep: number): string => {
      if (dotStep < step) return styles.stepDotCompleted;
      if (dotStep === step) return styles.stepDotActive;
      return styles.stepDotInactive;
    },
    [step],
  );

  const lineFill = (afterStep: number): string =>
    step > afterStep ? '100%' : '0%';

  /* ── Step 1 ───────────────────────────────────────── */
  const Step1 = (
    <section className={styles.stepSection} key="step1">
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Select Your Tier</h2>
        <p className={styles.stepSubtitle}>
          Choose the plan that fits your practice
        </p>
      </div>

      <div className={styles.tierGrid}>
        {TIER_KEYS.map((key) => {
          const t = TIERS[key];
          const isSelected = selectedTier === key;
          return (
            <div
              key={key}
              className={[
                styles.tierCard,
                isSelected ? styles.tierCardSelected : '',
                t.popular ? styles.tierCardPopular : '',
              ]
                .join(' ')
                .trim()}
              onClick={() => setSelectedTier(key)}
            >
              {t.popular && (
                <span className={styles.popularBadge}>Popular</span>
              )}
              <div className={[styles.tierIconWrap, t.iconClass].join(' ')}>
                {t.icon}
              </div>
              <h3 className={styles.tierName}>{t.label}</h3>
              <p className={styles.tierPrice}>
                {t.monthly === 0 ? 'Free' : `$${t.monthly}/mo`}
              </p>
              <p className={styles.tierMeta}>
                {t.games} game{t.games !== 1 ? 's' : ''} · {t.tokens.toLocaleString()} tokens
              </p>
              <ul className={styles.tierFeatures}>
                <li className={styles.tierFeature}>
                  <span className={styles.tierCheck}>✓</span>
                  {t.games} game{t.games !== 1 ? 's' : ''} included
                </li>
                <li className={styles.tierFeature}>
                  <span className={styles.tierCheck}>✓</span>
                  {t.tokens.toLocaleString()} tokens/mo
                </li>
                <li className={styles.tierFeature}>
                  <span className={styles.tierCheck}>✓</span>
                  {key === 'starter'
                    ? 'Basic support'
                    : key === 'apprentice'
                    ? 'Email support'
                    : key === 'strategist'
                    ? 'Priority support'
                    : 'Dedicated support'}
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      <div className={styles.btnRow}>
        <button
          className={styles.btnPrimary}
          onClick={() => setStep(2)}
        >
          Continue →
        </button>
      </div>
    </section>
  );

  /* ── Step 2 ───────────────────────────────────────── */
  const step2Valid =
    name.trim().length > 0 && email.trim().length > 0;

  const Step2 = (
    <section className={styles.stepSection} key="step2">
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Your Information</h2>
        <p className={styles.stepSubtitle}>
          Tell us a bit about you and your firm
        </p>
      </div>

      <div className={[styles.glassGold, styles.formWrap].join(' ')}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="ob-name">
            Full Name *
          </label>
          <input
            id="ob-name"
            type="text"
            className={styles.formInput}
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="ob-firm">
            Firm Name
          </label>
          <input
            id="ob-firm"
            type="text"
            className={styles.formInput}
            placeholder="Doe Tax & Accounting"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="ob-email">
            Email Address *
          </label>
          <input
            id="ob-email"
            type="email"
            className={styles.formInput}
            placeholder="jane@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.btnRow}>
          <button
            className={styles.btnSecondary}
            onClick={() => setStep(1)}
          >
            ← Back
          </button>
          <button
            className={styles.btnPrimary}
            disabled={!step2Valid}
            onClick={() => setStep(3)}
          >
            Continue →
          </button>
        </div>
      </div>
    </section>
  );

  /* ── Step 3 – submit ──────────────────────────────── */
  const tier = TIERS[selectedTier];

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const session = await getSession();
      if (!session) {
        router.push('/sign-in?redirect=/onboarding');
        return;
      }
      const checkout = await createCheckout(session.account_id, selectedTier);
      capture({
        name: 'checkout_started',
        props: {
          app: 'gvlp',
          sku: selectedTier,
          amount_cents: TIERS[selectedTier].monthly * 100,
        },
      });
      router.push(checkout.session_url);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setError(message);
      setLoading(false);
    }
  };

  const Step3 = (
    <section className={styles.stepSection} key="step3">
      <div className={styles.stepHeader}>
        <h2 className={styles.stepTitle}>Review &amp; Confirm</h2>
        <p className={styles.stepSubtitle}>
          Double-check everything before we take you to checkout
        </p>
      </div>

      <div className={[styles.glass, styles.reviewCard].join(' ')}>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Plan</span>
          <span className={styles.reviewValue}>{tier.label}</span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Price</span>
          <span className={styles.reviewValueGold}>
            {tier.monthly === 0 ? 'Free' : `$${tier.monthly}/mo`}
          </span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Tokens</span>
          <span className={styles.reviewValue}>
            {tier.tokens.toLocaleString()} / month
          </span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Games</span>
          <span className={styles.reviewValue}>
            {tier.games} game{tier.games !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Name</span>
          <span className={styles.reviewValue}>{name}</span>
        </div>
        {firmName && (
          <div className={styles.reviewRow}>
            <span className={styles.reviewLabel}>Firm</span>
            <span className={styles.reviewValue}>{firmName}</span>
          </div>
        )}
        <div className={styles.reviewRow}>
          <span className={styles.reviewLabel}>Email</span>
          <span className={styles.reviewValue}>{email}</span>
        </div>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.btnRow}>
        <button
          className={styles.btnSecondary}
          onClick={() => { setStep(2); setError(''); }}
          disabled={loading}
        >
          ← Back
        </button>
        <button
          className={styles.btnPrimary}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading && <span className={styles.loadingSpinner} />}
          {loading ? 'Redirecting…' : 'Go to Checkout →'}
        </button>
      </div>
    </section>
  );

  /* ── Render ───────────────────────────────────────── */
  return (
    <div className={styles.page}>
      {/* Ambient blobs */}
      <div className={[styles.blob, styles.blob1].join(' ')} />
      <div className={[styles.blob, styles.blob2].join(' ')} />
      <div className={[styles.blob, styles.blob3].join(' ')} />
      <div className={[styles.blob, styles.blob4].join(' ')} />

      <MarketingHeader config={gvlpConfig} />

      <main className={styles.content}>
        {/* Page header */}
        <header className={styles.pageHeader}>
          <div className={styles.badge}>✦ Onboarding</div>
          <h1 className={styles.title}>Welcome to Virtual Launch Pro</h1>
          <p className={styles.subtitle}>
            Complete these 3 steps to go live
          </p>
        </header>

        {/* Stepper */}
        <nav className={styles.stepper} aria-label="Onboarding progress">
          <div className={[styles.stepDot, dotClass(1)].join(' ')}>1</div>
          <div className={styles.stepLine}>
            <div
              className={styles.stepLineFill}
              style={{ width: lineFill(1) }}
            />
          </div>
          <div className={[styles.stepDot, dotClass(2)].join(' ')}>2</div>
          <div className={styles.stepLine}>
            <div
              className={styles.stepLineFill}
              style={{ width: lineFill(2) }}
            />
          </div>
          <div className={[styles.stepDot, dotClass(3)].join(' ')}>3</div>
        </nav>

        {/* Step panels */}
        {step === 1 && Step1}
        {step === 2 && Step2}
        {step === 3 && Step3}
      </main>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#1a0a10' }} />}>
      <OnboardingContent />
    </Suspense>
  );
}
