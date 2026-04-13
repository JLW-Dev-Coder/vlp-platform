import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <span className={styles.logoBox}>VLP</span>
            <span className={styles.logoText}>Games</span>
          </div>
          <p className={styles.tagline}>Interactive tax education games that engage, educate, and convert.</p>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <h4>Product</h4>
            <Link href="/games">Game Library</Link>
            <Link href="/#pricing">Pricing</Link>
            <Link href="/onboarding">Get Started</Link>
          </div>
          <div className={styles.col}>
            <h4>Company</h4>
            <Link href="/reviews">Reviews</Link>
            <Link href="/support">Support</Link>
            <Link href="/sign-in">Sign In</Link>
          </div>
          <div className={styles.col}>
            <h4>Legal</h4>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Virtual Launch Pro. All rights reserved.</p>
      </div>
    </footer>
  );
}
