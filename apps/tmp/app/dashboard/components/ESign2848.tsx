'use client'

import styles from './components.module.css'

export default function ESign2848() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>ESign 2848</h1>
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-8 text-center">
        <h2 className="text-xl font-semibold text-white mb-3">Form 2848 — Power of Attorney</h2>
        <p className="text-white/50 mb-6">Generate IRS Form 2848 for your client.</p>
        <a href="/forms/2848" className="inline-block rounded-lg bg-brand-primary px-6 py-3 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          Open Form 2848 Generator
        </a>
      </div>
    </div>
  )
}
