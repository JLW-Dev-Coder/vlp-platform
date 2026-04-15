import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import DeadlineBanner from '@/components/DeadlineBanner';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'TaxClaim Pro — Automate IRS Form 843 Penalty Abatement Claims',
  description:
    'Generate IRS Form 843 penalty abatement requests from transcript data in minutes. The Kwong v. US window closes July 2026. Three tiers from $10/mo.',
};

const VALUE_CARDS = [
  {
    icon: '\u{1F4C4}',
    title: 'Automated Form 843',
    body: 'Enter penalty data, generate a complete Form 843. Print and mail.',
  },
  {
    icon: '\u{1F4C5}',
    title: 'Kwong Deadline Built In',
    body: 'Eligibility checker flags which client penalties fall in the Jan 2020 \u2013 July 2023 window.',
  },
  {
    icon: '\u{1F3E2}',
    title: 'Branded Client Pages',
    body: 'Your clients submit penalty details through your branded landing page.',
  },
  {
    icon: '\u26A1',
    title: '5 Minutes vs 30',
    body: 'Manual Form 843 prep takes 30 minutes per client. This takes 5.',
  },
];

const HOW_STEPS = [
  {
    n: 1,
    title: 'Enter Penalty Details',
    body: "Enter your client's penalty details or parse their IRS transcript to auto-populate the form.",
  },
  {
    n: 2,
    title: 'Generate Form 843',
    body: 'The system calculates penalty amounts, identifies Kwong arguments, and generates a ready-to-file Form 843.',
  },
  {
    n: 3,
    title: 'Print, Mail, Track',
    body: 'Print the form, mail to the IRS, and track claim status in your dashboard.',
  },
];

const STATS = [
  { value: '30 \u2192 5 min', label: 'Per Form 843 preparation' },
  { value: '$10/mo', label: 'Less than one billable hour' },
  { value: '~10 weeks', label: 'Kwong window remaining' },
];

const TIERS = [
  {
    name: 'Starter',
    price: 10,
    popular: false,
    features: [
      'Form 843 generation',
      'Branded claim page (1)',
      'Penalty calculations',
      'Taxpayer dashboard',
      'Kwong eligibility checker',
      'Email support',
    ],
  },
  {
    name: 'Professional',
    price: 29,
    popular: true,
    features: [
      'Everything in Starter',
      'Unlimited claim pages',
      'Priority generation',
      'Bulk PDF export (ZIP)',
      'Transcript integration (TTMP)',
    ],
  },
  {
    name: 'Firm',
    price: 79,
    popular: false,
    features: [
      'Everything in Professional',
      'White-label branding',
      'Multi-practitioner access',
      'API access',
      'Dedicated support (4hr SLA)',
    ],
  },
];

const FAQ = [
  {
    q: 'What is Form 843?',
    a: 'IRS Form 843 is the official form for requesting a refund or abatement of certain taxes, penalties, or interest. TaxClaim Pro generates this form from your client data so you can print it, sign it, and mail it to the IRS.',
  },
  {
    q: 'What is the Kwong v. US ruling?',
    a: 'Kwong v. United States is a court ruling that enables penalty challenges for IRS penalties assessed between January 2020 and July 2023. The window for filing under this ruling closes in July 2026.',
  },
  {
    q: 'Does TaxClaim Pro file the form with the IRS?',
    a: 'No. TaxClaim Pro generates the completed Form 843. You review the form, your client signs it, and you mail it to the IRS at the address provided. We do not file on your behalf.',
  },
  {
    q: 'Can I use this with IRS transcripts?',
    a: 'Yes. Professional and Firm tiers include direct integration with Tax Transcript AI (TTMP) \u2014 parse a transcript and the penalty data auto-populates into Form 843. Starter tier users enter data manually.',
  },
  {
    q: 'What happens after July 2026?',
    a: 'The Kwong-specific eligibility window closes. Form 843 generation continues to work for standard penalty abatement claims outside the Kwong ruling.',
  },
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className={styles.root}>
      <DeadlineBanner />
      <Header showNav />

      {/* 1. Hero */}
      <section className={styles.hero} id="hero">
        <div className={styles.heroBg} />
        <div className={styles.heroGlow} />
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              Kwong Window Closes July 2026
            </div>
            <h1 className={styles.heroHeadline}>
              Your clients&rsquo; IRS penalties from 2020&ndash;2023 are challengeable. Automate the claim.
            </h1>
            <p className={styles.heroSub}>
              TaxClaim Pro generates Form 843 penalty abatement requests from your transcript data &mdash; in minutes, not hours. The Kwong v. US window closes July 2026.
            </p>
            <div className={styles.heroCtas}>
              <Link href="/demo" className={styles.primaryBtn}>
                Start Free Demo
              </Link>
              <Link href="/pricing" className={styles.secondaryBtn}>
                See Pricing
              </Link>
            </div>
            <div className={styles.trustBadges}>
              <span className={styles.trustBadge} style={{ color: '#22c55e' }}>Court-Backed</span>
              <span className={styles.trustBadge} style={{ color: '#eab308' }}>3 Tiers from $10/mo</span>
              <span className={styles.trustBadge} style={{ color: '#3b82f6' }}>5-Min Setup</span>
            </div>
          </div>

          <div className={styles.heroCard}>
            <div className={styles.demoBadge}>DEMO</div>
            <div className={styles.deadlineBox}>
              <div className={styles.deadlineLabel}>Deadline</div>
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

      {/* 2. Value Proposition */}
      <section className={styles.valueSection} id="value">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Why Tax Professionals Choose TaxClaim Pro</h2>
            <p className={styles.sectionSub}>Automate the paperwork. Focus on the clients.</p>
          </div>
          <div className={styles.valueGrid}>
            {VALUE_CARDS.map((card) => (
              <div key={card.title} className={styles.valueCard}>
                <div className={styles.valueIcon}>{card.icon}</div>
                <h3 className={styles.valueTitle}>{card.title}</h3>
                <p className={styles.valueText}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section className={styles.howSection} id="how">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSub}>Three steps from penalty data to filed Form 843</p>
          </div>
          <div className={styles.stepsGrid}>
            {HOW_STEPS.map((step) => (
              <div key={step.n} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.n}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Social Proof — Stats */}
      <section className={styles.statsSection} id="stats">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>By the Numbers</h2>
          </div>
          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Pricing Preview */}
      <section className={styles.pricingSection} id="pricing">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Pricing</h2>
            <p className={styles.sectionSub}>Three tiers. No per-client fees. Cancel anytime.</p>
          </div>
          <div className={styles.pricingGrid}>
            {TIERS.map((tier) => (
              <div key={tier.name} className={tier.popular ? styles.pricingCardPopular : styles.pricingCard}>
                {tier.popular && <div className={styles.pricingBadge}>Most Popular</div>}
                <div className={styles.pricingTierName}>{tier.name}</div>
                <div className={styles.priceDisplay}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>{tier.price}</span>
                  <span className={styles.pricePeriod}>/mo</span>
                </div>
                <ul className={styles.featureList}>
                  {tier.features.map((f) => (
                    <li key={f} className={styles.featureItem}>
                      <CheckIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={tier.popular ? styles.pricingCta : styles.pricingCtaOutline}
                >
                  {tier.popular ? 'Get Started' : 'View Details'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className={styles.faqSection} id="faq">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
          </div>
          <div className={styles.faqList}>
            {FAQ.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>{item.q}</h3>
                <p className={styles.faqAnswer}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className={styles.finalCta} id="cta">
        <div className={styles.sectionInner}>
          <p className={styles.finalCtaText}>
            The Kwong window closes in July. Start processing your clients&rsquo; claims today.
          </p>
          <Link href="/pricing" className={styles.primaryBtn}>
            Get Started &mdash; $10/mo
          </Link>
        </div>
      </section>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
}
