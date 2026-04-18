import { MarketingHeader, MarketingFooter } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';
import CtaBanner from '@/components/CtaBanner';
import styles from './page.module.css';

const testimonials = [
  {
    quote:
      'My clients love spinning the wheel after their consultations. Engagement is up 40%!',
    name: 'Jennifer M.',
    firm: 'Tax Pro',
  },
  {
    quote: 'The trivia game keeps clients entertained while they wait. It\u2019s a huge hit!',
    name: 'David K.',
    firm: 'CPA',
  },
  {
    quote: 'I\u2019ve seen a 3x increase in referrals since adding these games to my site.',
    name: 'Sarah L.',
    firm: 'Enrolled Agent',
  },
  {
    quote:
      'Finally a tool that makes taxes fun. My clients actually look forward to appointments now.',
    name: 'Marcus T.',
    firm: 'Tax Advisor',
  },
  {
    quote: 'Setup was easy and support has been fantastic. Worth every penny.',
    name: 'Rachel B.',
    firm: 'CFP',
  },
  {
    quote:
      'The games are educational AND entertaining. My clients leave knowing more about taxes.',
    name: 'Antonio R.',
    firm: 'CPA',
  },
];

function Stars() {
  return (
    <div className={styles.stars} aria-label="5 stars">
      {'★★★★★'.split('').map((star, i) => (
        <span key={i} className={styles.star}>
          {star}
        </span>
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <>
      <MarketingHeader config={gvlpConfig} />
      <main className={styles.main}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroHeadline}>What Tax Pros Are Saying</h1>
          <p className={styles.heroSub}>
            Real results from tax professionals who added games to their client experience.
          </p>
        </section>

        {/* Testimonial cards */}
        <section className={styles.section}>
          <div className={styles.grid}>
            {testimonials.map((t, i) => (
              <article key={i} className={styles.card}>
                <Stars />
                <blockquote className={styles.quote}>&ldquo;{t.quote}&rdquo;</blockquote>
                <footer className={styles.reviewer}>
                  <span className={styles.reviewerName}>{t.name}</span>
                  <span className={styles.reviewerFirm}>{t.firm}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className={styles.ctaStrip}>
          <h2 className={styles.ctaHeadline}>Ready to see results like these?</h2>
          <a href="/onboarding" className={styles.ctaBtn}>
            Get Started Today &rarr;
          </a>
        </section>
      </main>
      <CtaBanner />
      <MarketingFooter config={gvlpConfig} />
    </>
  );
}
