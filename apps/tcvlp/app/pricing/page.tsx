import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/Header';
import DeadlineBanner from '@/components/DeadlineBanner';
import Footer from '@/components/Footer';
import styles from './pricing.module.css';

export const metadata: Metadata = {
  title: 'Pricing — TaxClaim Pro',
  description:
    'TaxClaim Pro pricing: Starter $10/mo, Professional $29/mo, Firm $79/mo. Automate IRS Form 843 penalty abatement claims.',
};

const STRIPE_PRICES = {
  starter: 'price_1TDvQe9ROeyeXOqek1fpOWWH',
  professional: 'price_1TMI7d9ROeyeXOqeRSrkysQW',
  firm: 'price_1TMI7k9ROeyeXOqeUlKb4Uso',
} as const;

const TIERS = [
  {
    name: 'Starter',
    price: 10,
    description: 'For solo practitioners handling a few penalty abatement cases.',
    priceId: STRIPE_PRICES.starter,
    popular: false,
    features: [
      { name: 'Form 843 generation', included: true },
      { name: 'Branded claim page (1)', included: true },
      { name: 'Penalty calculations', included: true },
      { name: 'Taxpayer dashboard', included: true },
      { name: 'Kwong eligibility checker', included: true },
      { name: 'Email support', included: true },
      { name: 'Unlimited claim pages', included: false },
      { name: 'Priority generation', included: false },
      { name: 'Bulk PDF export', included: false },
      { name: 'Transcript integration', included: false },
      { name: 'White-label branding', included: false },
      { name: 'Multi-practitioner access', included: false },
      { name: 'API access', included: false },
      { name: 'Dedicated support (4hr)', included: false },
    ],
  },
  {
    name: 'Professional',
    price: 29,
    description: 'For practices processing 10+ clients before the Kwong deadline.',
    priceId: STRIPE_PRICES.professional,
    popular: true,
    features: [
      { name: 'Form 843 generation', included: true },
      { name: 'Branded claim page (1)', included: true },
      { name: 'Penalty calculations', included: true },
      { name: 'Taxpayer dashboard', included: true },
      { name: 'Kwong eligibility checker', included: true },
      { name: 'Email support', included: true },
      { name: 'Unlimited claim pages', included: true },
      { name: 'Priority generation', included: true },
      { name: 'Bulk PDF export', included: true },
      { name: 'Transcript integration', included: true },
      { name: 'White-label branding', included: false },
      { name: 'Multi-practitioner access', included: false },
      { name: 'API access', included: false },
      { name: 'Dedicated support (4hr)', included: false },
    ],
  },
  {
    name: 'Firm',
    price: 79,
    description: 'For multi-practitioner firms with custom branding and API needs.',
    priceId: STRIPE_PRICES.firm,
    popular: false,
    features: [
      { name: 'Form 843 generation', included: true },
      { name: 'Branded claim page (1)', included: true },
      { name: 'Penalty calculations', included: true },
      { name: 'Taxpayer dashboard', included: true },
      { name: 'Kwong eligibility checker', included: true },
      { name: 'Email support', included: true },
      { name: 'Unlimited claim pages', included: true },
      { name: 'Priority generation', included: true },
      { name: 'Bulk PDF export', included: true },
      { name: 'Transcript integration', included: true },
      { name: 'White-label branding', included: true },
      { name: 'Multi-practitioner access', included: true },
      { name: 'API access', included: true },
      { name: 'Dedicated support (4hr)', included: true },
    ],
  },
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <div className={styles.root}>
      <DeadlineBanner />
      <Header showNav />

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.badge}>Kwong Window: ~10 Weeks Remaining</div>
          <h1 className={styles.headline}>Choose Your Plan</h1>
          <p className={styles.sub}>
            No per-client fees. No setup charges. Cancel anytime.
          </p>
        </div>
      </section>

      <section className={styles.tiersSection}>
        <div className={styles.tiersInner}>
          <div className={styles.tiersGrid}>
            {TIERS.map((tier) => (
              <div key={tier.name} className={tier.popular ? styles.tierCardPopular : styles.tierCard}>
                {tier.popular && <div className={styles.popularBadge}>Most Popular</div>}
                <div className={styles.tierName}>{tier.name}</div>
                <p className={styles.tierDesc}>{tier.description}</p>
                <div className={styles.priceRow}>
                  <span className={styles.priceCurrency}>$</span>
                  <span className={styles.priceAmount}>{tier.price}</span>
                  <span className={styles.pricePeriod}>/mo</span>
                </div>
                <Link
                  href={`/sign-in?redirect=/onboarding&price_id=${tier.priceId}`}
                  className={tier.popular ? styles.ctaBtn : styles.ctaBtnOutline}
                >
                  Get Started
                </Link>
                <ul className={styles.featureList}>
                  {tier.features.map((f) => (
                    <li key={f.name} className={f.included ? styles.featureIncluded : styles.featureExcluded}>
                      {f.included ? <CheckIcon /> : <XIcon />}
                      {f.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.compareSection}>
        <div className={styles.compareInner}>
          <h2 className={styles.compareTitle}>Feature Comparison</h2>
          <div className={styles.tableWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th className={styles.thFeature}>Feature</th>
                  <th className={styles.thTier}>Starter</th>
                  <th className={styles.thTierPopular}>Professional</th>
                  <th className={styles.thTier}>Firm</th>
                </tr>
              </thead>
              <tbody>
                {TIERS[0].features.map((f) => (
                  <tr key={f.name} className={styles.compareRow}>
                    <td className={styles.tdFeature}>{f.name}</td>
                    {TIERS.map((tier) => {
                      const feat = tier.features.find((tf) => tf.name === f.name);
                      return (
                        <td key={tier.name} className={styles.tdCheck}>
                          {feat?.included ? <CheckIcon /> : <XIcon />}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className={styles.compareRow}>
                  <td className={styles.tdFeature}>Price</td>
                  <td className={styles.tdCheck}>$10/mo</td>
                  <td className={styles.tdCheck}>$29/mo</td>
                  <td className={styles.tdCheck}>$79/mo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <p className={styles.ctaText}>
            The Kwong window closes in July 2026. Start generating Form 843 claims for your clients today.
          </p>
          <Link href={`/sign-in?redirect=/onboarding&price_id=${STRIPE_PRICES.starter}`} className={styles.ctaBtn}>
            Get Started &mdash; $10/mo
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
