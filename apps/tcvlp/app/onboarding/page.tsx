'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import { Session, getProBySlug, createCheckout, tcvlpOnboarding, getSubscriptionStatus } from '@/lib/api';
import { tierLabel } from '@/lib/tiers';
import { formatPhone, filterPhoneInput } from '@/lib/phone';
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

/* ── SVG Icons ──────────────────────────────────────────────────────────────── */

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1" />
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function OnboardingContent({ session }: { session: Session }) {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1 — Firm details
  const [firmName, setFirmName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('Welcome. Submit your penalty details below and select "Notify Me" so our team can alert you when to check your IRS transcript for updates and keep you informed of any related claim developments.');

  // Step 1 — Contact fields
  const [firmPhone, setFirmPhone] = useState('');
  const [firmEmail, setFirmEmail] = useState('');
  const [firmLinkedin, setFirmLinkedin] = useState('');
  const [firmTelegram, setFirmTelegram] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Step 2
  const [slug, setSlug] = useState('');
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);

  // Step 3
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState('');
  const [subActive, setSubActive] = useState(false);
  const [subPlan, setSubPlan] = useState('');
  const [subLoading, setSubLoading] = useState(false);

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

  // Check subscription status when entering step 3
  useEffect(() => {
    if (step !== 3) return;
    let cancelled = false;
    setSubLoading(true);
    getSubscriptionStatus().then((status) => {
      if (cancelled) return;
      setSubActive(status.active);
      setSubPlan(status.plan || 'TaxClaim Pro');
      setSubLoading(false);
    });
    return () => { cancelled = true; };
  }, [step]);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slugAvailable) return;
    setStep(3);
  };

  const onboardingPayload = () => ({
    firm_name: firmName,
    display_name: displayName,
    welcome_message: welcomeMessage,
    slug,
    firm_phone: firmPhone || undefined,
    firm_email: firmEmail || undefined,
    firm_linkedin: firmLinkedin || undefined,
    firm_telegram: firmTelegram || undefined,
    logo_url: logoUrl || undefined,
  });

  const handleContinueActive = async () => {
    setCheckoutLoading(true);
    setError('');
    try {
      await tcvlpOnboarding(onboardingPayload());
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError('');
    try {
      // Save onboarding data first
      await tcvlpOnboarding(onboardingPayload());
      // Then redirect to Stripe
      const checkout = await createCheckout(session.account_id, 'tcvlp');
      window.location.href = checkout.session_url || checkout.url || '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const STEPS = [
    { n: 1, label: 'Firm Details' },
    { n: 2, label: 'Your Slug' },
    { n: 3, label: 'Launch' },
  ];

  const progressPct = (step / 3) * 100;

  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.inner}>
        {/* Page title */}
        <div className={styles.pageTitleWrap}>
          <h1 className={styles.pageTitle}>Set Up Your TaxClaim Page</h1>
          <p className={styles.pageSubtitle}>Complete setup in 3 steps</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.progressStepLabel}>Step {step} of 3</div>
        </div>

        {/* Step 1: Firm Details */}
        {step === 1 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 1</span>
                <h2 className={styles.stepTitle}>Tell Us About Your Firm</h2>
              </div>
              <div className={styles.stepHeaderIcon}><BuildingIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                Enter your firm details and optional contact information. Clients will see this on your branded claim page.
              </p>

              <form onSubmit={handleStep1} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>Firm Name <span className={styles.required}>*</span></label>
                  <input
                    type="text"
                    value={firmName}
                    onChange={(e) => setFirmName(e.target.value)}
                    placeholder="Jones Tax Solutions"
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Jane Jones, CPA"
                    className={styles.input}
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
                    className={styles.textarea}
                  />
                  <span className={styles.hint}>Displayed on your client-facing page</span>
                </div>

                {/* Contact fields section */}
                <div className={styles.contactSection}>
                  <div className={styles.contactSectionTitle}>Business Contact Info</div>
                  <span className={styles.contactSectionHint}>Optional — shown on Step 5 of the client claim page so clients can reach you</span>

                  <div className={styles.contactField}>
                    <div className={styles.contactFieldIcon}><PhoneIcon /></div>
                    <div className={styles.contactFieldInput}>
                      <label className={styles.label}>Business Phone</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={firmPhone}
                        onChange={(e) => setFirmPhone(filterPhoneInput(e.target.value))}
                        onBlur={() => setFirmPhone(formatPhone(firmPhone))}
                        placeholder="(555) 123-4567"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.contactField}>
                    <div className={styles.contactFieldIcon}><EmailIcon /></div>
                    <div className={styles.contactFieldInput}>
                      <label className={styles.label}>Business Email</label>
                      <input
                        type="email"
                        value={firmEmail}
                        onChange={(e) => setFirmEmail(e.target.value)}
                        placeholder="info@jonestax.com"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.contactField}>
                    <div className={styles.contactFieldIcon}><LinkedInIcon /></div>
                    <div className={styles.contactFieldInput}>
                      <label className={styles.label}>LinkedIn URL</label>
                      <input
                        type="url"
                        value={firmLinkedin}
                        onChange={(e) => setFirmLinkedin(e.target.value)}
                        placeholder="https://linkedin.com/in/janejonescpa"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.contactField}>
                    <div className={styles.contactFieldIcon}><TelegramIcon /></div>
                    <div className={styles.contactFieldInput}>
                      <label className={styles.label}>Telegram</label>
                      <input
                        type="text"
                        value={firmTelegram}
                        onChange={(e) => setFirmTelegram(e.target.value)}
                        placeholder="@jonestax or https://t.me/jonestax"
                        className={styles.input}
                      />
                    </div>
                  </div>

                  <div className={styles.contactField}>
                    <div className={styles.contactFieldIcon}><ImageIcon /></div>
                    <div className={styles.contactFieldInput}>
                      <label className={styles.label}>Logo / Icon URL</label>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className={styles.input}
                      />
                      <span className={styles.hint}>Direct link to your firm logo or icon image</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className={styles.primaryBtn}>
                  Next: Choose Your Slug →
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Step 2: Slug */}
        {step === 2 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 2</span>
                <h2 className={styles.stepTitle}>Choose Your URL Slug</h2>
              </div>
              <div className={styles.stepHeaderIcon}><LinkIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                This is the unique URL where your clients will access their claim page.
              </p>

              <form onSubmit={handleStep2} className={styles.form}>
                <div className={styles.field}>
                  <label className={styles.label}>URL Slug</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(toSlug(e.target.value))}
                    placeholder="jones-tax"
                    minLength={2}
                    maxLength={40}
                    required
                    className={styles.input}
                  />
                  {slug && (
                    <div className={styles.slugPreview}>
                      <span className={styles.slugPreviewUrl}>
                        taxclaim.virtuallaunch.pro/claim?slug={slug}
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

                <div className={styles.btnRow}>
                  <button
                    type="submit"
                    className={styles.primaryBtn}
                    disabled={!slugAvailable || checkingSlug}
                  >
                    Next: Complete Setup →
                  </button>
                  <button type="button" className={styles.secondaryBtn} onClick={() => setStep(1)}>
                    ← Back
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Step 3: Payment / Launch */}
        {step === 3 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 3</span>
                <h2 className={styles.stepTitle}>Complete Setup</h2>
              </div>
              <div className={styles.stepHeaderIcon}><RocketIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                Review your setup and activate your TaxClaim Pro page.
              </p>

              <div className={styles.summaryBox}>
                <h3 className={styles.summaryTitle}>Your Setup Summary</h3>
                <div className={styles.summaryRow}><span>Firm Name</span><strong>{firmName}</strong></div>
                {displayName && <div className={styles.summaryRow}><span>Display Name</span><strong>{displayName}</strong></div>}
                <div className={styles.summaryRow}><span>Your URL</span><strong>taxclaim.virtuallaunch.pro/claim?slug={slug}</strong></div>
                {firmPhone && <div className={styles.summaryRow}><span>Phone</span><strong>{firmPhone}</strong></div>}
                {firmEmail && <div className={styles.summaryRow}><span>Email</span><strong>{firmEmail}</strong></div>}
                {firmLinkedin && <div className={styles.summaryRow}><span>LinkedIn</span><strong>Linked</strong></div>}
                {firmTelegram && <div className={styles.summaryRow}><span>Telegram</span><strong>{firmTelegram}</strong></div>}
                {logoUrl && <div className={styles.summaryRow}><span>Logo</span><strong>Provided</strong></div>}
                {!subActive && <div className={styles.summaryRow}><span>Plan</span><strong>TaxClaim Pro — $10/month</strong></div>}
              </div>

              {error && <div className={styles.errorMsg}>{error}</div>}

              {subLoading ? (
                <div className={styles.subChecking}>Checking subscription status…</div>
              ) : subActive ? (
                <>
                  <div className={styles.subActiveBox}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Subscription active — {tierLabel(subPlan)}</span>
                  </div>
                  <button
                    className={styles.primaryBtn}
                    onClick={handleContinueActive}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Saving…' : 'Continue →'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.primaryBtn}
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Redirecting to Stripe…' : 'Pay $10/month → Activate Now'}
                  </button>
                  <p className={styles.payNote}>Cancel anytime. Deadline: July 10, 2026.</p>
                </>
              )}

              <button type="button" className={styles.secondaryBtn} onClick={() => setStep(2)}>
                ← Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return <AuthGuard>{(session) => <OnboardingContent session={session} />}</AuthGuard>;
}
