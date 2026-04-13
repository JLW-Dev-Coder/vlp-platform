import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import DeadlineBanner from '@/components/DeadlineBanner';
import CtaBanner from '@/components/CtaBanner';
import Footer from '@/components/Footer';
import KwongCard from '@/components/KwongCard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'TaxClaim Pro — Branded Form 843 Preparation Guide for Tax Professionals',
};

const REVIEWS = [
  {
    name: 'Sarah M.',
    title: 'CPA, Chicago IL',
    body: 'Set up my branded page in under 5 minutes. My clients love how professional it looks and the deadline reminder keeps them moving.',
    stars: 5,
  },
  {
    name: 'James T.',
    title: 'Enrolled Agent, Austin TX',
    body: 'The transcript upload is a game-changer. Auto-fills everything and my clients just hit print. Worth every penny.',
    stars: 5,
  },
  {
    name: 'Linda K.',
    title: 'Tax Attorney, New York NY',
    body: "I was skeptical about $10/month but I've already recovered over $40k for three clients using this workflow.",
    stars: 5,
  },
];

const HOW_STEPS = [
  {
    n: 1,
    title: 'Clients Visit Your Branded Page',
    body: 'Share your unique URL — e.g., jones-tax.taxclaim.virtuallaunch.pro — directly with clients needing help with Kwong penalty claims.',
  },
  {
    n: 2,
    title: 'Upload IRS Transcript (Optional)',
    body: 'Clients upload their IRS Account Transcript. The system auto-extracts penalty data and pre-fills the preparation guide.',
  },
  {
    n: 3,
    title: 'Enter Penalty Details',
    body: 'Clients confirm tax year, penalty type, and amount. State-based IRS mailing address is looked up automatically.',
  },
  {
    n: 4,
    title: 'Generate Preparation Guide',
    body: 'A comprehensive Form 843 preparation guide is generated — clearly watermarked "PREPARATION GUIDE — NOT AN OFFICIAL IRS FORM."',
  },
  {
    n: 5,
    title: 'Print & Mail to IRS',
    body: 'Client prints the guide, transfers data to the official IRS Form 843, and mails it to the displayed IRS address before July 10, 2026.',
  },
];

export default function HomePage() {
  return (
    <div className={styles.root}>
      <DeadlineBanner />
      <Header showNav />

      {/* Hero */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg} />
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Deadline: July 10, 2026
            </div>
            <h1 className={styles.heroHeadline}>
              Start Your Form 843 Preparation Guide Landing Page Today
            </h1>
            <p className={styles.heroSub}>
              Help your clients claim money the IRS owes them. Quick setup, fully branded, only $10/month.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/sign-in?redirect=/onboarding" className={styles.primaryBtn}>
                Get Started →
              </Link>
              <Link href="/demo" className={styles.secondaryBtn}>
                Demo
              </Link>
            </div>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge} style={{ color: '#22c55e' }}>✓ Court-Backed</span>
              <span className={styles.trustBadge} style={{ color: '#3b82f6' }}>✓ Unlimited Clients</span>
              <span className={styles.trustBadge} style={{ color: '#eab308' }}>★ 5-Min Setup</span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.demoBadge}>DEMO</div>
            <div className={styles.deadlineBox}>
              <div className={styles.deadlineLabel}>⏰ Deadline</div>
              <div className={styles.deadlineDate}>July 10, 2026</div>
              <p className={styles.deadlineNote}>
                Based on the landmark <em>Kwong v. US</em> ruling. Act now before the deadline closes.
              </p>
            </div>
            <div className={styles.skeletonSection}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} style={{ width: '85%' }} />
              <div className={styles.skeleton} style={{ width: '65%' }} />
            </div>
            <div className={styles.skeletonBtns}>
              <div className={styles.skeleton} style={{ flex: 1, height: '2.5rem', borderRadius: '0.5rem' }} />
              <div className={styles.skeleton} style={{ width: '6rem', height: '2.5rem', borderRadius: '0.5rem' }} />
            </div>
            <div className={styles.cardFooter}>
              <span>Auto-populated fields</span>
              <span>Print Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howSection} id="how">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <div className={styles.greenBadge}>Court-Backed Legal Strategy</div>
            <h2 className={styles.sectionTitle}>IRS Form 843: The 5-Step Compliance Process</h2>
            <p className={styles.sectionSub}>Backed by the landmark <em>Kwong v. US</em> court ruling</p>
          </div>

          <KwongCard />

          <div className={styles.stepsGrid}>
            {HOW_STEPS.map((step) => (
              <div key={step.n} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.n}</div>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className={styles.reviewsSection} id="reviews">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What Tax Professionals Are Saying</h2>
          </div>
          <div className={styles.reviewsGrid}>
            {REVIEWS.map((r) => (
              <div key={r.name} className={styles.reviewCard}>
                <div className={styles.reviewStars}>{'★'.repeat(r.stars)}</div>
                <p className={styles.reviewBody}>&ldquo;{r.body}&rdquo;</p>
                <div className={styles.reviewAuthor}>
                  <strong>{r.name}</strong>
                  <span>{r.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricingSection} id="pricing">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Simple, Flat Pricing</h2>
            <p className={styles.sectionSub}>One plan. Everything included. No surprises.</p>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.pricingBadge}>Most Popular</div>
            <div className={styles.priceDisplay}>
              <span className={styles.priceCurrency}>$</span>
              <span className={styles.priceAmount}>10</span>
              <span className={styles.pricePeriod}>/month</span>
            </div>
            <ul className={styles.featureList}>
              {[
                'Branded subdomain: {slug}.taxclaim.virtuallaunch.pro',
                'Unlimited client preparation guide generations',
                'IRS transcript upload + auto-fill',
                'State-based IRS mailing address lookup',
                'Form 843 preparation guide with Kwong citation',
                'QR code & shareable embed link',
                'Submission tracking',
                'Email support',
              ].map((f) => (
                <li key={f} className={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/sign-in?redirect=/onboarding" className={styles.pricingCta}>
              Start Setup →
            </Link>
            <p className={styles.pricingNote}>Cancel anytime · No setup fees · Deadline: July 10, 2026</p>
          </div>
        </div>
      </section>

      <CtaBanner />
      <Footer />
    </div>
  );
}
