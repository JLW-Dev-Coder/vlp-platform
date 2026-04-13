import styles from './DeadlineBanner.module.css';

export default function DeadlineBanner() {
  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon}>⚠️</span>
      <span className={styles.text}>
        <strong>Kwong claim deadline: July 10, 2026.</strong>{' '}
        File before this date to recover your penalties.
      </span>
    </div>
  );
}
