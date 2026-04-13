import Link from 'next/link';
import styles from './CtaBanner.module.css';

export default function CtaBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>
          Add interactive tax games to your professional website
        </h2>
        <p className={styles.body}>
          Gamified tax education keeps clients engaged between appointments.
          Embed subscriptions start at $9/month.
        </p>
        <div className={styles.actions}>
          <Link href="/#pricing" className={styles.primaryBtn}>
            See plans
          </Link>
          <a
            href="https://taxmonitor.pro/directory"
            className={styles.secondaryBtn}
            target="_blank"
            rel="noopener noreferrer"
          >
            Need personal tax help? Find a tax professional
          </a>
        </div>
      </div>
    </section>
  );
}
