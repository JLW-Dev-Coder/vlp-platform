import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import styles from './page.module.css';

interface Game {
  slug: string;
  name: string;
  emoji: string;
  desc: string;
  tier: 'Starter' | 'Apprentice' | 'Strategist' | 'Navigator';
}

const GAMES: Game[] = [
  { slug: 'tax-trivia',          name: 'Tax Trivia',           emoji: '🏛️', desc: 'Test tax knowledge with 10 rapid-fire questions. Educational and addictive.',           tier: 'Starter' },
  { slug: 'tax-match-mania',     name: 'Tax Match Mania',       emoji: '🃏', desc: 'Match tax terms to definitions in this fast-paced memory game.',                      tier: 'Apprentice' },
  { slug: 'tax-spin-wheel',      name: 'Tax Spin Wheel',        emoji: '🎰', desc: 'Spin to reveal tax tips, discounts, or bonuses. Clients love the suspense.',           tier: 'Apprentice' },
  { slug: 'tax-word-search',     name: 'Tax Word Search',       emoji: '🔍', desc: 'Hunt for hidden tax terms in a letter grid. Calming and educational.',                  tier: 'Strategist' },
  { slug: 'irs-fact-or-fiction', name: 'IRS Fact or Fiction',   emoji: '🤔', desc: 'Distinguish real IRS rules from tax myths. Swipe and learn.',                          tier: 'Strategist' },
  { slug: 'capital-gains-climb', name: 'Capital Gains Climb',   emoji: '📈', desc: 'Answer capital gains questions to climb the leaderboard.',                              tier: 'Strategist' },
  { slug: 'deduction-dash',      name: 'Deduction Dash',        emoji: '⚡', desc: 'Race the clock to identify valid deductions. Fast-paced and surprising.',               tier: 'Navigator' },
  { slug: 'refund-rush',         name: 'Refund Rush',           emoji: '💰', desc: 'Maximize refunds by making smart filing decisions in this strategy game.',              tier: 'Navigator' },
  { slug: 'audit-escape-room',   name: 'Audit Escape Room',     emoji: '🔐', desc: 'Solve tax puzzles to escape a simulated audit. Thrilling compliance training.',        tier: 'Navigator' },
];

const TIER_LABELS: Record<Game['tier'], string> = {
  Starter:    'Starter',
  Apprentice: 'Apprentice',
  Strategist: 'Strategist',
  Navigator:  'Navigator',
};

export default function GamesPage() {
  return (
    <>
      <Nav />
      <main className={styles.main}>
        {/* Background blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />

        {/* Hero */}
        <section className={styles.hero}>
          <p className={styles.heroEyebrow}>Interactive Tax Education</p>
          <h1 className={styles.heroHeadline}>Our Game Library</h1>
          <p className={styles.heroSub}>
            Nine professionally crafted games designed to engage your clients, reinforce tax
            literacy, and keep your firm top-of-mind — all embeddable in one line of code.
          </p>
        </section>

        {/* Game grid */}
        <section className={styles.gridSection}>
          <div className={styles.grid}>
            {GAMES.map((game) => (
              <div key={game.slug} className={styles.card}>
                <div className={styles.cardEmoji}>{game.emoji}</div>
                <h2 className={styles.cardName}>{game.name}</h2>
                <p className={styles.cardDesc}>{game.desc}</p>
                <span className={`${styles.tierBadge} ${styles[`tier${game.tier}`]}`}>
                  Requires {TIER_LABELS[game.tier]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className={styles.ctaStrip}>
          <h2 className={styles.ctaHeading}>Ready to unlock your game library?</h2>
          <p className={styles.ctaSub}>Choose a plan and embed games on your site in minutes.</p>
          <a href="/onboarding" className={styles.ctaBtn}>Get Started</a>
        </section>
      </main>
      <CtaBanner />
      <Footer />
    </>
  );
}
