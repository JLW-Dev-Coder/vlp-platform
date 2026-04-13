'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './KwongCard.module.css';

const TAX_COURT_URL = 'https://www.ustaxcourt.gov/';

export default function KwongCard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.card}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <div className={styles.icon}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 18 0A9 9 0 0 0 3 12z" />
            <path d="M12 7v5l4 2" />
          </svg>
        </div>
        <div>
          <div className={styles.headingRow}>
            <span className={styles.title}>Kwong v. Commissioner</span>
            <span className={styles.subtitle}>T.C. Memo. 2024-42</span>
          </div>
          <p className={styles.body}>
            The Tax Court decision that unlocks Form 843 penalty abatement for clients whose
            penalties were assessed without proper IRS managerial approval.
          </p>
          <span className={styles.badge}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Deadline: July 10, 2026
          </span>
          <div>
            <span className={styles.hint}>Read the case details →</span>
          </div>
        </div>
      </button>

      {open && (
        <div
          className={styles.overlay}
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="kwong-modal-title"
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <span className={styles.modalBadge}>T.C. Memo. 2024-42</span>
            <h2 id="kwong-modal-title" className={styles.modalTitle}>
              Kwong v. Commissioner — What It Means for Your Clients
            </h2>
            <div className={styles.modalCitation}>United States Tax Court, 2024</div>

            <p className={styles.modalSummary}>
              The Tax Court ruled that the IRS must follow its own Internal Revenue Manual
              procedures when assessing penalties. If the IRS failed to obtain managerial
              approval before assessing a penalty (as required by IRC §6751(b)), the penalty
              can be abated. This opens the door for Form 843 penalty abatement claims for any
              client who received a penalty without proper IRS managerial approval.
            </p>

            <ul className={styles.modalPoints}>
              <li className={styles.modalPoint}>
                IRC §6751(b) requires written managerial approval before most penalties are assessed.
              </li>
              <li className={styles.modalPoint}>
                When the IRS skips that step, the assessment carries a procedural defect under the IRM.
              </li>
              <li className={styles.modalPoint}>
                Form 843 is the statutory remedy — the vehicle for taxpayers to claim a refund of the improperly assessed penalty.
              </li>
              <li className={styles.modalPoint}>
                Claims tied to the Kwong window must be filed by <strong>July 10, 2026</strong>. After that, the refund window closes.
              </li>
            </ul>

            <div className={styles.modalActions}>
              <Link href="/claim" className={styles.primaryCta}>
                Start a Form 843 Claim →
              </Link>
              <a
                href={TAX_COURT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.secondaryCta}
              >
                Read the full ruling ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
