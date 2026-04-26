'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Header from '@/components/Header'
import { api } from '@/lib/api'

const SERVICES = [
  { key: 'irs_resolution', label: 'IRS Issue Resolution', amount: 299 },
  { key: 'tax_prep_individual', label: 'Tax Preparation (Individual)', amount: 199 },
  { key: 'tax_prep_business', label: 'Tax Preparation (Business)', amount: 399 },
  { key: 'tax_planning', label: 'Tax Planning / Advisory', amount: 249 },
  { key: 'audit_representation', label: 'Audit Representation', amount: 499 },
  { key: 'penalty_abatement', label: 'Penalty Abatement', amount: 199 },
] as const

const ENTITY_TYPES = ['Individual', 'LLC', 'S Corporation', 'C Corporation', 'Partnership', 'Nonprofit', 'Estate/Trust']

export default function CheckoutClient() {
  const params = useSearchParams()
  const initialService = params.get('service') || ''
  const initialState = params.get('state') || ''
  const initialEntity = params.get('entity') || ''

  const [serviceType, setServiceType] = useState(initialService)
  const [entityType, setEntityType] = useState(initialEntity)
  const [state, setState] = useState(initialState)
  const [taxYears, setTaxYears] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const selected = SERVICES.find((s) => s.key === serviceType)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!serviceType || !state.trim() || !name.trim() || !email.trim()) {
      setError('Please complete all required fields.')
      return
    }
    setSubmitting(true)
    try {
      const res = await api.createClientPoolCheckout({
        service_type: serviceType,
        entity_type: entityType || undefined,
        state: state.trim(),
        tax_years: taxYears.trim() || undefined,
        taxpayer_email: email.trim(),
        taxpayer_name: name.trim(),
      })
      if (res?.checkout_url) {
        window.location.href = res.checkout_url
      } else {
        setError('Could not start checkout. Please try again.')
        setSubmitting(false)
      }
    } catch {
      setError('Could not start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <Header />
      <section style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
          Pay to Get Started
        </h1>
        <p style={{ color: '#475569', marginBottom: 32 }}>
          Pre-pay for your service and we'll match you with a qualified tax professional in your state. Full refund available before a professional claims your case.
        </p>

        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'grid', gap: 20 }}>
            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Service *</span>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
                style={inputStyle}
              >
                <option value="">Select a service…</option>
                {SERVICES.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label} — ${s.amount}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Entity Type</span>
              <select value={entityType} onChange={(e) => setEntityType(e.target.value)} style={inputStyle}>
                <option value="">Select…</option>
                {ENTITY_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>State *</span>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. Florida"
                required
                style={inputStyle}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Tax Years</span>
              <input
                type="text"
                value={taxYears}
                onChange={(e) => setTaxYears(e.target.value)}
                placeholder="e.g. 2022, 2023"
                style={inputStyle}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Your Name *</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={inputStyle}
              />
            </label>

            <label style={{ display: 'block' }}>
              <span style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Email *</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
            </label>

            {selected && (
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: 16 }}>
                <div style={{ fontWeight: 600, color: '#9a3412' }}>Order Summary</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span>{selected.label}</span>
                  <span style={{ fontWeight: 600 }}>${selected.amount}.00</span>
                </div>
              </div>
            )}

            {error && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: 12, color: '#991b1b' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: '#f97316',
                color: '#fff',
                fontWeight: 600,
                fontSize: 16,
                padding: '14px 24px',
                borderRadius: 8,
                border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Redirecting to checkout…' : 'Pay and Submit'}
            </button>

            <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
              Secured by Stripe. Full refund available before a professional claims your case. See our{' '}
              <a href="/legal/refund" style={{ color: '#f97316' }}>Refund Policy</a>.
            </p>
          </div>
        </form>
      </section>
    </main>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: 15,
  background: '#fff',
}
