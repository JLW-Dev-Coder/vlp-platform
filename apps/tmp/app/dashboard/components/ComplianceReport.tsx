'use client'

import ReportContent from '@/app/dashboard/components/ReportContent'
import styles from './components.module.css'

export default function ComplianceReport() {
  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Compliance Report</h1>
      <ReportContent />
    </div>
  )
}
