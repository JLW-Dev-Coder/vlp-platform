'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { Session, getProBySlug, createCheckout, tcvlpOnboarding } from '@/lib/api';
import styles from './page.module.css';

// Slug generation
function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

function OnboardingContent({ session }: { session: Session }) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [firmName, setFirmName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Step 2
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Step 3
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-suggest slug from firm name
  useEffect(() => {
    if (firmName) setSlug(toSlug(firmName));
  }, [firmName]);

  // Debounced slug availability check
  const checkSlug = useCallback(async (s: string) => {
    if (!s || s.length < 2) { setSlugAvailable(null); return; }
    setCheckingSlug(true);
    try {
      const existing = await getProBySlug(s);
      setSlugAvailable(!existing);
    } catch {
      setSlugAvailable(true);
    } finally {
      setCheckingSlug(false);
    }
  }, []);

  useEffect(() => {
    setSlugAvailable(null);
    const t = setTimeout(() => checkSlug(slug), 500);
    return () => clearTimeout(t);
  }, [slug, checkSlug]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugAvailable) return;
    setStep(3);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError('');
    try {
      // Save onboarding data first
      await tcvlpOnboarding({ firm_name: firmName, display_name: displayName, welcome_message: welcomeMessage, slug });
      // Then redirect to Stripe
      const checkout = await createCheckout(session.account_id, 'tcvlp');
      window.location.href = checkout.session_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const STEPS = [
    { n: 1, label: 'Firm Details' },
    { n: 2, label: 'Your Slug' },
    { n: 3, label: 'Payment' },
  ];

  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.inner}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          {STEPS.map((s, idx) => (
            <div key={s.n} className={styles.progressStep}>
              <div className={`${styles.dot} ${step >= s.n ? styles.dotActive : ''} ${step > s.n ? styles.dotDone : ''}`}>
                {step > s.n ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : s.n}
              </div>
              <span className={`${styles.dotLabel} ${step >= s.n ? styles.dotLabelActive : ''}`}>{s.label}</span>
              {idx < STEPS.length - 1 && <div className={`${styles.connector} ${step > s.n ? styles.connectorActive : ''}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Firm Details */}
        {step === 1 && (
          <div className={styles.card}>
            <h1 className={styles.title}>Tell Us About Your Firm</h1>
            <form onSubmit={handleStep1} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Firm Name <span className={styles.required}>*</span></label>
                <input
                  type="text"
                  value={firmName}
                  onChange={(e) => setFirmName(e.target.value)}
                  placeholder="Jones Tax Solutions"
                  required
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Jane Jones, CPA"
                />
                <span className={styles.hint}>Shown on your client landing page</span>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Welcome Message for Clients</label>
                <textarea
                  value={welcomeMessage}
                  onChange={(e) => setWelcomeMessage(e.target.value)}
                  placeholder="Welcome! I specialize in helping clients recover IRS penalties using the Kwong v. US ruling…"
                  rows={3}
                />
                <span className={styles.hint}>Displayed on your client-facing page</span>
              </div>
              <button type="submit" className={styles.nextBtn}>
                Next: Choose Your Slug →
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Slug */}
        {step === 2 && (
          <div className={styles.card}>
            <button onClick={() => setStep(1)} className={styles.backBtn}>← Back</button>
            <h1 className={styles.title}>Choose Your URL Slug</h1>
            <form onSubmit={handleStep2} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Subdomain Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  placeholder="jones-tax"
                  minLength={2}
                  maxLength={40}
                  required
                />
                {slug && (
                  <div className={styles.slugPreview}>
                    <span className={styles.slugPreviewUrl}>
                      {slug}.taxclaim.virtuallaunch.pro
                    </span>
                    {checkingSlug && <span className={styles.slugChecking}>Checking…</span>}
                    {!checkingSlug && slugAvailable === true && (
                      <span className={styles.slugAvailable}>✓ Available</span>
                    )}
                    {!checkingSlug && slugAvailable === false && (
                      <span className={styles.slugTaken}>✗ Already taken</span>
                    )}
                  </div>
                )}
                <span className={styles.hint}>Lowercase letters, numbers, hyphens only</span>
              </div>
              <button
                type="submit"
                className={styles.nextBtn}
                disabled={!slugAvailable || checkingSlug}
              >
                Next: Payment →
              </button>
            </form>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className={styles.card}>
            <button onClick={() => setStep(2)} className={styles.backBtn}>← Back</button>
            <h1 className={styles.title}>Complete Setup</h1>

            <div className={styles.summaryBox}>
              <h2 className={styles.summaryTitle}>Your Setup Summary</h2>
              <div className={styles.summaryRow}><span>Firm Name</span><strong>{firmName}</strong></div>
              {displayName && <div className={styles.summaryRow}><span>Display Name</span><strong>{displayName}</strong></div>}
              <div className={styles.summaryRow}><span>Your URL</span><strong>{slug}.taxclaim.virtuallaunch.pro</strong></div>
              <div className={styles.summaryRow}><span>Plan</span><strong>TaxClaim Pro — $10/month</strong></div>
            </div>

            {error && <div className={styles.errorMsg}>{error}</div>}

            <button
              className={styles.payBtn}
              onClick={handleCheckout}
              disabled={checkoutLoading}
            >
              {checkoutLoading ? 'Redirecting to Stripe…' : 'Pay $10/month → Activate Now'}
            </button>
            <p className={styles.payNote}>Cancel anytime. Deadline: July 10, 2026.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <AuthGuard>{(session) => <OnboardingContent session={session} />}</AuthGuard>;
}
