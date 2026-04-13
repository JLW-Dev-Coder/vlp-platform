import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.text}>
          &copy; {new Date().getFullYear()} TaxClaim Pro — Powered by Virtual Launch Pro.{' '}
          <Link href="/support" className={styles.link}>Support</Link>
          {' · '}
          <a href="https://www.irs.gov/pub/irs-pdf/f843.pdf" target="_blank" rel="noopener noreferrer" className={styles.link}>
            Official IRS Form 843
          </a>
        </p>
        <p className={styles.disclaimer}>
          This platform generates preparation guides only — not official IRS forms. Always consult a licensed tax professional.
        </p>
      </div>
    </footer>
  );
}
