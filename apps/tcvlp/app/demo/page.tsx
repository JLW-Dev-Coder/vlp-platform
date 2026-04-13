import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import DeadlineBanner from '@/components/DeadlineBanner';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Demo — How Your Clients Claim Their Refund | TaxClaim Pro',
};

const STEPS = [
  {
    n: 1,
    icon: '📄',
    title: 'Pull Your Transcripts',
    items: [
      <>Access your IRS transcript at <a href="https://www.irs.gov/individuals/get-transcript" target="_blank" rel="noopener noreferrer">irs.gov/get-transcript</a> or call <strong>800-908-9946</strong></>,
      <>Print your Account Transcript for tax years <strong>2020 through 2023</strong></>,
    ],
  },
  {
    n: 2,
    icon: '🛡',
    title: 'Confirm Your Eligibility',
    items: [
      <>Review penalties or interest assessed between <strong>Jan 20, 2020 – July 10, 2023</strong></>,
      <>Look for Failure-to-File, Failure-to-Pay, or interest charges</>,
      <>If penalties or interest exist, proceed to the Form 843 preparation guide</>,
    ],
  },
  {
    n: 3,
    icon: '📝',
    title: 'Generate Your Preparation Guide',
    items: [
      <>Visit your tax pro&apos;s branded page and click <strong>Generate Preparation Guide</strong></>,
      <>Optionally upload your transcript PDF to auto-fill penalty details</>,
      <>Enter your name, state, tax year, and penalty amount</>,
    ],
  },
  {
    n: 4,
    icon: '🖨',
    title: 'Print & Review the Guide',
    items: [
      <>The preparation guide is clearly watermarked <strong>&quot;PREPARATION GUIDE — NOT AN OFFICIAL IRS FORM&quot;</strong></>,
      <>Use the guide to fill out the official IRS Form 843 (linked in the guide)</>,
      <>Verify all fields match your transcript data</>,
    ],
  },
  {
    n: 5,
    icon: '📬',
    title: 'Mail to the IRS',
    items: [
      <>Mail your completed Form 843 to the address shown in the preparation guide (based on your state)</>,
      <><strong>IMPORTANT:</strong> Claims must be postmarked by <strong>July 10, 2026</strong></>,
      <>Keep a copy for your records</>,
    ],
  },
];

export default function DemoPage() {
  return (
    <div className={styles.root}>
      <DeadlineBanner />
      <Header showNav />

      <div className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.deadlineBadge}>
            ⚠️ Submit before July 10, 2026
          </div>
          <h1 className={styles.headline}>How Your Clients Claim Their Refund</h1>
          <p className={styles.subheadline}>
            Follow these steps to generate, print, and mail your IRS Form 843 safely and correctly.
          </p>
          <div className={styles.heroCtas}>
            <Link href="/sign-in?redirect=/onboarding" className={styles.primaryBtn}>
              Generate Preparation Guide
            </Link>
            <Link href="/support" className={styles.secondaryBtn}>
              Contact Tax Pro
            </Link>
          </div>
        </div>
      </div>

      <main className={styles.main}>
        <div className={styles.steps}>
          {STEPS.map((step, idx) => (
            <div key={step.n} className={styles.stepRow}>
              {idx < STEPS.length - 1 && <div className={styles.connector} />}
              <div className={styles.stepCircle}>{step.n}</div>
              <div className={styles.stepCard}>
                <div className={styles.stepHeader}>
                  <span className={styles.stepIcon}>{step.icon}</span>
                  <h2 className={styles.stepTitle}>{step.title}</h2>
                </div>
                <ul className={styles.stepList}>
                  {step.items.map((item, i) => (
                    <li key={i} className={styles.stepItem}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 3 }}>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaBlock}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Help Your Clients?</h2>
            <p className={styles.ctaBody}>
              Set up your branded page in 5 minutes. $10/month. Deadline July 10, 2026.
            </p>
            <Link href="/sign-in?redirect=/onboarding" className={styles.primaryBtn}>
              Get Started →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
