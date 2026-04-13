import Link from 'next/link';
import styles from './Header.module.css';

interface HeaderProps {
  showNav?: boolean;
}

export default function Header({ showNav = true }: HeaderProps) {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logoBox}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>TaxClaim Pro</span>
            <span className={styles.brandSub}>Powered by Virtual Launch Pro</span>
          </div>
        </Link>

        {showNav && (
          <div className={styles.links}>
            <Link href="/#how" className={styles.navLink}>How It Works</Link>
            <Link href="/#reviews" className={styles.navLink}>Reviews</Link>
            <Link href="/#pricing" className={styles.navLink}>Pricing</Link>
            <Link href="/support" className={styles.navLink}>Support</Link>
            <Link href="/sign-in?redirect=/onboarding" className={styles.ctaBtn}>Get Started</Link>
          </div>
        )}

        {!showNav && (
          <div className={styles.links}>
            <Link href="/dashboard" className={styles.navLink}>Dashboard</Link>
            <Link href="/affiliate" className={styles.navLink}>Affiliate</Link>
            <Link href="/support" className={styles.navLink}>Support</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
