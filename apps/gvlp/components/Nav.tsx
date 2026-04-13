import Link from 'next/link';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoBox}>VLP</span>
          <span className={styles.logoText}>Games</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/games" className={styles.link}>Games</Link>
          <Link href="/#how-it-works" className={styles.link}>How It Works</Link>
          <Link href="/reviews" className={styles.link}>Reviews</Link>
          <Link href="/support" className={styles.link}>Support</Link>
          <Link href="/affiliate" className={styles.link}>Affiliate</Link>
        </nav>
        <Link href="/onboarding" className={styles.cta}>Get Started</Link>
      </div>
    </header>
  );
}
