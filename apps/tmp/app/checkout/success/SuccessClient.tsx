'use client'

import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'

export default function SuccessClient() {
  const params = useSearchParams()
  const sessionId = params.get('session_id') || ''

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <section style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 12 }}>
          Your case has been submitted
        </h1>
        <p style={{ color: '#475569', fontSize: 17, marginBottom: 32 }}>
          Payment received. A qualified tax professional in your state will review and claim your case shortly.
        </p>

        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, textAlign: 'left' }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>What happens next</h2>
          <ol style={{ paddingLeft: 20, color: '#334155', lineHeight: 1.8 }}>
            <li>You'll receive a confirmation email with your case reference number.</li>
            <li>A credentialed tax professional will be matched to your case based on state and service.</li>
            <li>Once a professional claims your case, you'll receive an email and they'll contact you directly to begin work.</li>
            <li>You can request a full refund any time before a professional claims your case.</li>
          </ol>
        </div>

        {sessionId && (
          <p style={{ marginTop: 24, fontSize: 13, color: '#64748b' }}>
            Reference: <code>{sessionId}</code>
          </p>
        )}

        <p style={{ marginTop: 32, fontSize: 14, color: '#64748b' }}>
          Questions? See our{' '}
          <a href="/legal/refund" style={{ color: '#f97316' }}>Refund Policy</a> or{' '}
          <a href="/help" style={{ color: '#f97316' }}>contact support</a>.
        </p>
      </section>
    </main>
  )
}
