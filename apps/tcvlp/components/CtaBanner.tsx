import Link from 'next/link';
import styles from './CtaBanner.module.css';

export default function CtaBanner() {
  return (
    <div className={styles.wrapper}>
      <section className={styles.primary}>
        <h2 className={styles.primaryTitle}>Generate your Form 843 automatically</h2>
        <p className={styles.primarySub}>
          Stop manually preparing penalty abatement requests. Upload transcript data and get a complete Form 843 in minutes.
        </p>
        <Link href="/#pricing" className={styles.primaryBtn}>
          Get started — $10/month
        </Link>
      </section>

      <section className={styles.secondary}>
        <p className={styles.secondaryText}>
          Need help with a penalty abatement?{' '}
          <a href="https://taxmonitor.pro/directory" className={styles.secondaryLink}>
            Find a tax professional
          </a>{' '}
          who specializes in IRS penalty relief.
        </p>
      </section>
    </div>
  );
}
