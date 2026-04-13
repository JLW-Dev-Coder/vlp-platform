import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CtaBanner from '@/components/CtaBanner';
import styles from './page.module.css';

/* -------------------------------------------------------
   Tier definitions (GVLP_TIERS)
------------------------------------------------------- */
const GVLP_TIERS = [
  {
    id: 'starter',
    name: 'Starter',
    emoji: '🌱',
    tokens: 100,
    games: 1,
    price: 0,
    priceLabel: 'Free',
    popular: false,
    features: ['100 tokens / month', '1 game slot', 'Basic analytics', 'Email support'],
  },
  {
    id: 'apprentice',
    name: 'Apprentice',
    emoji: '⚡',
    tokens: 500,
    games: 3,
    price: 9,
    priceLabel: '$9',
    popular: false,
    features: ['500 tokens / month', '3 game slots', 'Standard analytics', 'Priority email support'],
  },
  {
    id: 'strategist',
    name: 'Strategist',
    emoji: '🎯',
    tokens: 1500,
    games: 6,
    price: 19,
    priceLabel: '$19',
    popular: true,
    features: ['1,500 tokens / month', '6 game slots', 'Advanced analytics', 'Live chat support'],
  },
  {
    id: 'navigator',
    name: 'Navigator',
    emoji: '🚀',
    tokens: 5000,
    games: 9,
    price: 39,
    priceLabel: '$39',
    popular: false,
    features: ['5,000 tokens / month', '9 game slots', 'Full analytics suite', 'Dedicated support'],
  },
] as const;

/* -------------------------------------------------------
   Featured games
------------------------------------------------------- */
const FEATURED_GAMES = [
  {
    id: 'spin',
    title: 'Tax Spin Wheel',
    icon: '🎪',
    bgIcon: '🎡',
    tagline: 'Vibrant spin wheel with 8 segments. Win tax discounts, bonuses, and IRS facts.',
    desc: 'Animated wheel with instant prizes and tax facts. Token-based gameplay with scoreboard.',
    replayLabel: '∞ Replayable',
    href: '/games/tax-spin-wheel',
    cardClass: styles.gameCardGold,
    cornerClass: styles.gameCardCornerGold,
    tagClass: styles.gameTagGold,
    btnClass: styles.gamePlayBtnGold,
  },
  {
    id: 'match',
    title: 'Tax Match Mania',
    icon: '🎰',
    bgIcon: '🃏',
    tagline: 'Fast-paced 4×4 matching game with tax forms and symbols.',
    desc: 'Match cards, unlock tax tips, and compete on the leaderboard with animated effects.',
    replayLabel: '⏱️ Timed',
    href: '/games/tax-match-mania',
    cardClass: styles.gameCardPurple,
    cornerClass: styles.gameCardCornerPurple,
    tagClass: styles.gameTagPurple,
    btnClass: styles.gamePlayBtnPurple,
  },
  {
    id: 'trivia',
    title: 'Tax Trivia',
    icon: '🧠',
    bgIcon: '🧠',
    tagline: 'Quiz game with multiple-choice tax questions and illustrations.',
    desc: '4 answer options, progress bar, and fun explanations after each question.',
    replayLabel: '⏱️ Timed',
    href: '/games/tax-trivia',
    cardClass: styles.gameCardBlue,
    cornerClass: styles.gameCardCornerBlue,
    tagClass: styles.gameTagBlue,
    btnClass: styles.gamePlayBtnBlue,
  },
] as const;

/* -------------------------------------------------------
   Testimonials
------------------------------------------------------- */
const TESTIMONIALS = [
  {
    quote:
      '"My clients actually look forward to visiting my website now. The Tax Spin Wheel is a hit every tax season. I\'ve seen a 40% uptick in repeat visits."',
    name: 'Sandra K.',
    role: 'CPA, 12 years in practice',
    initial: 'S',
    avatarBg: '#c41e3a',
  },
  {
    quote:
      '"I was skeptical at first — but the onboarding took literally 4 minutes. Three weeks later I had already earned back my subscription cost five times over."',
    name: 'Marcus T.',
    role: 'Tax Strategist, Mid-size firm',
    initial: 'M',
    avatarBg: '#e8446d',
  },
  {
    quote:
      '"The games keep my clients engaged between appointments. Tax Trivia has become a genuine talking point — they bring it up in meetings!"',
    name: 'Priya N.',
    role: 'Enrolled Agent',
    initial: 'P',
    avatarBg: '#ffd700',
  },
] as const;

/* -------------------------------------------------------
   Page component
------------------------------------------------------- */
export default function HomePage() {
  return (
    <div className={styles.page}>
      {/* ── NAV ── */}
      <Nav />

      {/* ══════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════ */}
      <section className={styles.hero}>
        {/* decorative grid + orbs */}
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.orbRed}   aria-hidden="true" />
        <div className={styles.orbPink}  aria-hidden="true" />
        <div className={styles.orbGold}  aria-hidden="true" />

        <div className={styles.heroInner}>
          <div className={styles.heroContent}>

            {/* ---- Left: text ---- */}
            <div className={styles.heroLeft}>
              <span className={styles.heroBadge}>🎮 For Tax Professionals</span>

              <h1 className={styles.heroHeadline}>
                Add Mini-Games.<br />
                <span className={styles.heroGradientText}>Earn Passive Income.</span>
              </h1>

              <p className={styles.heroSub}>
                Transform your tax practice website into an engagement powerhouse.
                Clients play, you earn — it&apos;s that simple.
              </p>

              <div className={styles.heroCtas}>
                <Link href="/onboarding" className={styles.shimmerBtn}>
                  Get Started Free →
                </Link>
                <Link href="/games" className={styles.glassBtn}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" strokeWidth="2" fill="none" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" />
                  </svg>
                  View Games
                </Link>
              </div>

              <div className={styles.heroBullets}>
                <span className={styles.heroBullet}>
                  <span className={styles.checkIcon}>✓</span> No coding
                </span>
                <span className={styles.heroBullet}>
                  <span className={styles.checkIcon}>✓</span> Stripe integrated
                </span>
                <span className={styles.heroBullet}>
                  <span className={styles.checkIcon}>✓</span> IRS compliant
                </span>
              </div>
            </div>

            {/* ---- Right: illustration ---- */}
            <div className={styles.heroRight}>
              <div className={styles.heroIllustration}>
                {/* Laptop SVG */}
                <svg
                  className={styles.laptopSvg}
                  viewBox="0 0 400 400"
                  fill="none"
                  aria-label="Laptop with game controller illustration"
                >
                  {/* Laptop body */}
                  <rect x="60"  y="80"  width="280" height="200" rx="12" fill="#2a0f1e" stroke="#ffd700" strokeWidth="1.5" opacity="0.9" />
                  <rect x="75"  y="95"  width="250" height="170" rx="6"  fill="#1a0a10" />
                  {/* Screen content lines */}
                  <rect x="95"  y="115" width="80"  height="8" rx="2" fill="#c41e3a" opacity="0.7" />
                  <rect x="95"  y="133" width="120" height="6" rx="2" fill="#e8446d" opacity="0.4" />
                  <rect x="95"  y="149" width="100" height="6" rx="2" fill="#e8446d" opacity="0.3" />
                  <rect x="95"  y="165" width="140" height="6" rx="2" fill="#e8446d" opacity="0.2" />
                  {/* Game controller icon */}
                  <circle cx="270" cy="180" r="30" fill="#c41e3a" opacity="0.3" />
                  <text x="270" y="186" textAnchor="middle" fontSize="24" fill="#ffd700">🎮</text>
                  {/* 1040 badge */}
                  <rect x="90"  y="195" width="55" height="25" rx="4" fill="#ffd700" opacity="0.9" />
                  <text x="117" y="212" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1a0a10" fontFamily="JetBrains Mono">1040</text>
                  {/* Dollar signs */}
                  <text x="165" y="215" fontSize="18" fill="#ffd700" opacity="0.8">$$$</text>
                  {/* Laptop base */}
                  <path d="M40 280 L60 280 L60 290 Q60 300 70 300 L330 300 Q340 300 340 290 L340 280 L360 280 L360 290 Q360 310 340 310 L60 310 Q40 310 40 290 Z" fill="#2a0f1e" stroke="#ffd700" strokeWidth="0.8" opacity="0.7" />
                  {/* Neon glow line */}
                  <line x1="100" y1="275" x2="300" y2="275" stroke="#ffd700" strokeWidth="2" opacity="0.6" />
                </svg>

                {/* Floating icons */}
                <div className={`${styles.floatIcon} ${styles.floatIconCalc}`} aria-hidden="true">🧮</div>
                <div className={`${styles.floatIcon} ${styles.floatIconDollar}`} aria-hidden="true">$</div>
                <div className={`${styles.floatIcon} ${styles.floatIconChart}`} aria-hidden="true">📊</div>
                <div className={`${styles.floatIcon} ${styles.floatIconTarget}`} aria-hidden="true">🎯</div>
                <div className={`${styles.floatIcon} ${styles.floatIconW2}`} aria-hidden="true">W2</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS STRIP
      ══════════════════════════════════════════════════════ */}
      <div className={styles.statsStrip}>
        <div className={styles.statsInner}>
          <div>
            <div className={styles.statValue}>12,000+</div>
            <div className={styles.statLabel}>Active Players</div>
          </div>
          <div>
            <div className={styles.statValuePink}>250,000+</div>
            <div className={styles.statLabel}>Games Played</div>
          </div>
          <div>
            <div className={styles.statValueWhite}>$500,000+</div>
            <div className={styles.statLabel}>Revenue Generated</div>
          </div>
          <div>
            <div className={styles.statValue}>8:45</div>
            <div className={styles.statLabel}>Avg Engagement Time</div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS
      ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className={styles.howItWorks}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.sectionBadgeRed}`}>⚙️ Implementation</span>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSub}>
              Four simple steps to integrate games into your platform and start earning revenue.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {/* Step 1 */}
            <div>
              <div className={`${styles.stepCard} ${styles.stepCardRed}`}>
                <div className={styles.stepCornerRed} />
                <div className={styles.stepContent}>
                  <div className={`${styles.stepNumber} ${styles.stepNumberRed}`}>1</div>
                  <h3 className={styles.stepTitle}>Choose Your Tier</h3>
                  <p className={styles.stepDesc}>
                    Pick a subscription plan that fits your practice. Each tier determines how many games
                    you can display and the token allocation for play.
                  </p>
                  <div className={styles.stepMeta}>
                    <span>Starter, Apprentice, Strategist, or Navigator</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className={styles.stepOffset}>
              <div className={`${styles.stepCard} ${styles.stepCardPink}`}>
                <div className={styles.stepCornerPink} />
                <div className={styles.stepContent}>
                  <div className={`${styles.stepNumber} ${styles.stepNumberPink}`}>2</div>
                  <h3 className={styles.stepTitle}>Pick Your Games</h3>
                  <p className={styles.stepDesc}>
                    Mix and match from the available mini-games. Higher tiers unlock more games to embed
                    or play on your site.
                  </p>
                  <div className={styles.stepMeta}>
                    <span>9+ games available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className={`${styles.stepCard} ${styles.stepCardGold}`}>
                <div className={styles.stepCornerGold} />
                <div className={styles.stepContent}>
                  <div className={`${styles.stepNumber} ${styles.stepNumberGold}`}>3</div>
                  <h3 className={styles.stepTitle}>Share with Clients</h3>
                  <p className={styles.stepDesc}>
                    Add your affiliate payout details so you earn when clients play your games. Configure
                    how and where you want to receive revenue.
                  </p>
                  <div className={styles.stepMeta}>
                    <span>Secure Stripe setup</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className={styles.stepOffset}>
              <div className={`${styles.stepCard} ${styles.stepCardGreen}`}>
                <div className={styles.stepCornerGreen} />
                <div className={styles.stepContent}>
                  <div className={`${styles.stepNumber} ${styles.stepNumberGreen}`}>4</div>
                  <h3 className={styles.stepTitle}>Track &amp; Earn</h3>
                  <p className={styles.stepDesc}>
                    Embed the games on your site, track player progress, and watch engagement grow while
                    educating clients on tax topics.
                  </p>
                  <div className={styles.stepMeta}>
                    <span>Go live instantly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRICING
      ══════════════════════════════════════════════════════ */}
      <section id="pricing" className={styles.pricing}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.sectionBadgeGold}`}>💰 Pricing</span>
            <h2 className={styles.sectionTitle}>Simple, Transparent Pricing</h2>
            <p className={styles.sectionSub}>
              Choose the plan that fits your practice. Upgrade or downgrade anytime.
            </p>
          </div>

          <div className={styles.pricingGrid}>
            {GVLP_TIERS.map((tier) => (
              <div
                key={tier.id}
                className={`${styles.tierCard} ${tier.popular ? styles.tierCardPopular : ''}`}
              >
                {tier.popular && (
                  <span className={styles.popularBadge}>Most Popular</span>
                )}

                <div className={styles.tierEmoji}>{tier.emoji}</div>
                <div className={styles.tierName}>{tier.name}</div>

                <div className={styles.tierPrice}>
                  <span className={styles.tierAmount}>{tier.priceLabel}</span>
                  <span className={styles.tierPeriod}>/month</span>
                </div>

                <ul className={styles.tierFeatures}>
                  {tier.features.map((f) => (
                    <li key={f} className={styles.tierFeature}>
                      <span className={styles.tierCheck}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/onboarding?tier=${tier.id}`}
                  className={tier.popular ? styles.tierCtaPopular : styles.tierCta}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          GAMES GALLERY
      ══════════════════════════════════════════════════════ */}
      <section id="games" className={styles.gamesSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.sectionBadgeGold}`}>🎮 Playable Demo</span>
            <h2 className={styles.sectionTitle}>Play Tax Games</h2>
            <p className={styles.sectionSub}>
              Drop-in ready. Fully interactive. Your clients will actually want to visit your website.
            </p>
          </div>

          <div className={styles.gamesGrid}>
            {FEATURED_GAMES.map((game) => (
              <div key={game.id} className={`${styles.gameCard} ${game.cardClass}`}>
                <div className={`${styles.gameCardCorner} ${game.cornerClass}`} />

                <div className={styles.gamePreview}>
                  <div className={styles.gamePreviewBg}>{game.bgIcon}</div>
                  <div className={styles.gamePreviewContent}>
                    <div className={styles.gameIcon}>{game.icon}</div>
                    <h3 className={styles.gameTitle}>{game.title}</h3>
                    <p className={styles.gameTagline}>{game.tagline}</p>
                  </div>
                </div>

                <div className={styles.gameCardBody}>
                  <div className={styles.gameCardMeta}>
                    <div className={styles.gameTags}>
                      <span className={`${styles.gameTag} ${game.tagClass}`}>Interactive</span>
                      <span className={`${styles.gameTag} ${game.tagClass}`}>Mobile</span>
                    </div>
                    <span className={styles.gameReplay}>{game.replayLabel}</span>
                  </div>

                  <p className={styles.gameDesc}>{game.desc}</p>

                  <div className={styles.gameActions}>
                    <Link href={game.href} className={`${styles.gamePlayBtn} ${game.btnClass}`}>
                      Play Now
                    </Link>
                    <Link href={`${game.href}#details`} className={styles.gameDetailsLink}>
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS
      ══════════════════════════════════════════════════════ */}
      <section className={styles.testimonials}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={`${styles.sectionBadge} ${styles.sectionBadgeGold}`}>⭐ Social Proof</span>
            <h2 className={styles.sectionTitle}>Trusted by Tax Professionals</h2>
          </div>

          <div className={styles.testimonialsGrid}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className={styles.testimonialCard}>
                <div className={styles.testimonialStars}>
                  {['★', '★', '★', '★', '★'].map((s, i) => (
                    <span key={i}>{s}</span>
                  ))}
                </div>

                <p className={styles.testimonialQuote}>{t.quote}</p>

                <div className={styles.testimonialAuthor}>
                  <div
                    className={styles.testimonialAvatar}
                    style={{ background: t.avatarBg }}
                  >
                    {t.initial}
                  </div>
                  <div>
                    <div className={styles.testimonialName}>{t.name}</div>
                    <div className={styles.testimonialRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════════════════ */}
      <section className={styles.ctaBanner}>
        <div className={styles.ctaBannerInner}>
          <span className={styles.ctaBannerEmoji} aria-hidden="true">🎰</span>
          <h2 className={styles.ctaBannerTitle}>Ready to Gamify Your Practice?</h2>
          <p className={styles.ctaBannerSub}>
            Join 2,400+ tax professionals already earning passive income. Setup takes under 5 minutes.
          </p>
          <Link href="/onboarding" className={styles.shimmerBtn}>
            Start Earning Today →
          </Link>
          <p className={styles.ctaBannerNote}>Free tier available • No credit card required</p>
        </div>
      </section>

      {/* ── SEO CTA ── */}
      <CtaBanner />

      {/* ── FOOTER ── */}
      <Footer />
    </div>
  );
}
