'use client'

import OfficeContent from '@/app/dashboard/components/OfficeContent'
import styles from './components.module.css'

export default function Receipts() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Receipts</h1>
      <OfficeContent />
    </div>
  )
}
