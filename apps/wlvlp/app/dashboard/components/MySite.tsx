'use client';
import { useBuyer } from '@/lib/account-context';
import styles from './components.module.css';

export default function MySite() {
  const { data: dashboard } = useBuyer();
  if (!dashboard) return null;
  const { template } = dashboard;
  const siteUrl = `https://${template.slug}.websitelotto.virtuallaunch.pro`;
  return (
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>My Site</h2>
      <div className={styles.siteInfo}>
        <div className={styles.siteLabel}>{template.title}</div>
        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
          Visit My Site ↗
        </a>
      </div>
      <div className={styles.iframeWrap}>
        <iframe
          src={siteUrl}
          className={styles.iframe}
          title="Site Preview"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
