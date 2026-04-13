import styles from './shared.module.css';

export default function Submissions() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Submissions</h1>
      <p className={styles.pageDesc}>Track Form 843 preparation guide submissions from your clients.</p>

      <div className={styles.infoCard}>
        <div className={styles.infoIcon}>📬</div>
        <div>
          <h2 className={styles.subTitle}>Submission Notifications</h2>
          <p className={styles.infoText}>
            When a client confirms filing through your branded page, you&apos;ll receive an email notification with their submission details.
            Check your registered email address to review submissions.
          </p>
          <p className={styles.infoText} style={{ marginTop: '0.75rem' }}>
            A full submission history table will be available in an upcoming update.
          </p>
        </div>
      </div>

      <div className={styles.deadlineCard}>
        <strong>⏰ Reminder:</strong> All claims must be filed by <strong>July 10, 2026</strong>.
        Encourage your clients to act soon.
      </div>
    </div>
  );
}
