import type { Metadata } from 'next'
import Link from 'next/link'
import CtaBand from '@/components/CtaBand'

export const metadata: Metadata = {
  title: 'How It Works | Transcript Tax Monitor Pro',
  description:
    'See how Transcript Tax Monitor Pro turns a raw IRS transcript PDF into a client-ready, plain-English report in three steps — upload, parse, deliver.',
}

const STEPS = [
  {
    number: '01',
    title: 'Upload the transcript',
    body: 'Drop a PDF straight from SOAR or an IRS account. Parsing runs locally in your browser via PDF.js — no upload, no cloud round-trip, no client data leaving your machine.',
  },
  {
    number: '02',
    title: 'Parse and interpret automatically',
    body: 'Every transaction code, date, and amount is extracted and matched against the TTMP code library. The parser auto-detects the transcript type (Account, Return, Record of Account, Wage & Income) and structures the JSON before anything touches the API.',
  },
  {
    number: '03',
    title: 'Deliver a branded, client-ready report',
    body: 'Save with one token to render a multi-page PDF — taxpayer info, account status, transaction timeline, practitioner notes, plain-English code descriptions, and your firm logo. Email the link directly from the dashboard.',
  },
]

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div
            style={{
              display: 'inline-block',
              background: 'rgba(20,184,166,0.12)',
              border: '1px solid rgba(20,184,166,0.35)',
              color: '#14b8a6',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '0.35rem 0.9rem',
              borderRadius: 100,
              marginBottom: '1.5rem',
            }}
          >
            How It Works
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              color: 'var(--text, #f9fafb)',
            }}
          >
            From raw transcript to client-ready report — in three steps
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-muted, #9ca3af)',
              maxWidth: 580,
              margin: '0 auto 2rem',
              lineHeight: 1.7,
            }}
          >
            Transcript Tax Monitor Pro removes the manual lookup work between
            an IRS transcript landing in your inbox and a polished, plain-English
            report ready to send to your client.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/tools/code-lookup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#14b8a6',
                color: '#000',
                fontWeight: 700,
                fontSize: '1rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              Try the Free Code Lookup
            </Link>
            <Link
              href="/pricing/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: 'var(--surface, #111827)',
                border: '1px solid var(--surface-border, #1f2937)',
                color: 'var(--text, #f9fafb)',
                fontWeight: 600,
                fontSize: '1rem',
                padding: '0.75rem 1.75rem',
                borderRadius: 10,
                textDecoration: 'none',
              }}
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section
        style={{
          padding: '3rem 1.5rem 5rem',
          borderTop: '1px solid var(--surface-border, #1f2937)',
          background: 'var(--surface, #111827)',
        }}
      >
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {STEPS.map((step) => (
              <div
                key={step.number}
                style={{
                  background: 'var(--bg, #0a0f1e)',
                  border: '1px solid var(--surface-border, #1f2937)',
                  borderRadius: 12,
                  padding: '2rem 1.5rem',
                }}
              >
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: '#14b8a6',
                    letterSpacing: '0.1em',
                    marginBottom: '0.75rem',
                  }}
                >
                  STEP {step.number}
                </div>
                <h2
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: 'var(--text, #f9fafb)',
                    marginBottom: '0.75rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {step.title}
                </h2>
                <p
                  style={{
                    fontSize: '0.95rem',
                    color: 'var(--text-muted, #9ca3af)',
                    lineHeight: 1.65,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <CtaBand
        title="Ready to see it on a real transcript?"
        body="Upload a client's IRS transcript PDF and watch a plain-English analysis report render in seconds — every transaction code explained, with practitioner notes included."
        primaryLabel="Try the Parser Free"
        primaryHref="/app/dashboard/"
        secondaryLabel="See Pricing"
        secondaryHref="/pricing/"
      />
    </div>
  )
}
