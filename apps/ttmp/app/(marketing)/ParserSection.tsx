'use client'

import { useState, useRef } from 'react'
import styles from './page.module.css'
import {
  extractRawTextFromPdf,
  parseTranscriptText,
  getCodeDescription,
  type ParsedTranscript,
} from '@/lib/parseTranscript'

type Status = 'idle' | 'parsing' | 'done' | 'error'

const SAMPLE_URL = '/assets/sample-transcript.pdf'

export default function ParserSection() {
  const [status, setStatus] = useState<Status>('idle')
  const [parsed, setParsed] = useState<ParsedTranscript | null>(null)
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function parseFile(file: File) {
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF file.')
      setStatus('error')
      return
    }
    setStatus('parsing')
    setError(null)
    setParsed(null)
    setFileName(file.name)
    try {
      const text = await extractRawTextFromPdf(file)
      const result = parseTranscriptText(text)
      setParsed(result)
      setStatus('done')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not parse this PDF. Please try another file.')
      setStatus('error')
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleTrySample() {
    try {
      setStatus('parsing')
      setError(null)
      const res = await fetch(SAMPLE_URL)
      if (!res.ok) throw new Error(`Sample unavailable (${res.status})`)
      const blob = await res.blob()
      const file = new File([blob], 'sample-transcript.pdf', { type: 'application/pdf' })
      await parseFile(file)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not load sample transcript.')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setParsed(null)
    setError(null)
    setFileName('')
  }

  return (
    <div className={`${styles.parserWrapper} parser-preview`}>
      {status === 'idle' && (
        <div
          className={styles.parserLoading}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) parseFile(f) }}
          style={dragging ? { outline: '2px dashed var(--brand-500, #14b8a6)', outlineOffset: -4, borderRadius: 12 } : {}}
        >
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: 'rgba(20,184,166,0.12)',
            border: '1px solid rgba(20,184,166,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '0.5rem',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 12 15 15"/>
            </svg>
          </div>
          <p className={styles.parserLoadingText} style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.25rem' }}>
            Try It — Parse a Transcript in Your Browser
          </p>
          <p className={styles.parserLoadingText}>
            Drop an IRS transcript PDF, pick one, or try our sample. Parsing runs entirely in your browser — no upload, no account needed.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) parseFile(f) }}
            style={{ display: 'none' }}
            id="transcript-upload"
          />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className={styles.btnPrimary} onClick={handleTrySample}>
              Try Sample Transcript
            </button>
            <label htmlFor="transcript-upload" className={styles.btnSecondary} style={{ cursor: 'pointer' }}>
              Upload Your PDF
            </label>
          </div>
          <p className={styles.parserLoadingText} style={{ marginTop: '0.875rem', fontSize: '0.75rem' }}>
            Preview is free. Your file never leaves your computer.
          </p>
        </div>
      )}

      {status === 'parsing' && (
        <div className={styles.parserLoading}>
          <span className={styles.spinner} aria-hidden="true" />
          <p className={styles.parserLoadingText}>Parsing {fileName || 'transcript'}&hellip;</p>
        </div>
      )}

      {status === 'error' && (
        <div className={styles.parserLoading}>
          <p style={{ color: '#f87171', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{error}</p>
          <button className={styles.btnSecondary} onClick={reset}>
            Try Again
          </button>
        </div>
      )}

      {status === 'done' && parsed && (
        <ParsedPreview parsed={parsed} fileName={fileName} onReset={reset} />
      )}

      <style>{`
        @media print {
          .parser-preview { display: none !important; }
        }
      `}</style>
    </div>
  )
}

function ParsedPreview({ parsed, fileName, onReset }: { parsed: ParsedTranscript; fileName: string; onReset: () => void }) {
  const tp = parsed.taxpayer || {}
  const rs = parsed.returnSummary || {}
  const bal = parsed.balances || {}
  const txs = parsed.transactions || []
  const typeLabel = parsed.metadata?.transcriptType || parsed.transcriptType

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1.5rem',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--surface-border)',
        flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#14b8a6', display: 'inline-block' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)' }}>
            {typeLabel} — free preview
          </span>
        </div>
        <button
          className={styles.btnSecondary}
          style={{ fontSize: '0.8125rem', padding: '0.4rem 1rem' }}
          onClick={onReset}
          type="button"
        >
          Parse Another
        </button>
      </div>

      <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem' }}>
        <section>
          <h4 style={sectionTitleStyle}>Taxpayer</h4>
          <dl style={dlStyle}>
            <KV label="Name" value={tp.name} />
            <KV label="SSN" value={tp.ssn} />
            <KV label="Tax Year" value={tp.taxYear} />
            <KV label="Filing Status" value={tp.filingStatus} />
            <KV label="Form" value={tp.formNumber} />
            <KV label="Request Date" value={tp.requestDate} />
          </dl>
        </section>

        {Object.keys(rs).length > 0 && (
          <section>
            <h4 style={sectionTitleStyle}>Return Summary</h4>
            <dl style={dlStyle}>
              <KV label="Adjusted Gross Income" value={rs.adjustedGrossIncome} />
              <KV label="Taxable Income" value={rs.taxableIncome} />
              <KV label="Tax Per Return" value={rs.taxPerReturn} />
              <KV label="Processing Date" value={rs.processingDate} />
              <KV label="Return Due Date" value={rs.returnDueDate} />
            </dl>
          </section>
        )}

        {Object.keys(bal).length > 0 && (
          <section>
            <h4 style={sectionTitleStyle}>Account Balance</h4>
            <dl style={dlStyle}>
              <KV label="Balance" value={bal.balance} />
              <KV label="Accrued Interest" value={bal.accruedInt} />
              <KV label="Accrued Penalty" value={bal.accruedPenalty} />
              <KV label="Payoff" value={bal.payoffAmount} />
            </dl>
          </section>
        )}

        {txs.length > 0 && (
          <section>
            <h4 style={sectionTitleStyle}>Transactions ({txs.length})</h4>
            <div style={{ overflowX: 'auto', border: '1px solid var(--surface-border)', borderRadius: 10 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ background: 'var(--surface)' }}>
                    <th style={thStyle}>Code</th>
                    <th style={thStyle}>Plain-English Meaning</th>
                    <th style={thStyle}>Date</th>
                    <th style={{ ...thStyle, textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {txs.map((t, i) => (
                    <tr key={`${t.code}-${t.date}-${i}`} style={{ borderTop: '1px solid var(--surface-border)' }}>
                      <td style={tdStyle}><code style={codeStyle}>{t.code}</code></td>
                      <td style={tdStyle}>{getCodeDescription(t.code)}</td>
                      <td style={{ ...tdStyle, whiteSpace: 'nowrap', color: 'var(--text-muted)' }}>{t.date}</td>
                      <td style={{ ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div style={{
          marginTop: '0.5rem',
          background: 'var(--surface)',
          border: '1px solid var(--surface-border)',
          borderRadius: 12,
          padding: '1.25rem 1.5rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '1rem',
        }}>
          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              Want to save this report?
            </p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
              Unlock branded PDF export, email-to-client, and a saved history — one token per report.
            </p>
          </div>
          <a href="/pricing" className={styles.btnPrimary} style={{ fontSize: '0.875rem' }}>
            Get transcript tokens →
          </a>
        </div>
      </div>
    </div>
  )
}

function KV({ label, value }: { label: string; value?: string }) {
  if (!value || value === '\u2014') return null
  return (
    <>
      <dt style={dtStyle}>{label}</dt>
      <dd style={ddStyle}>{value}</dd>
    </>
  )
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-muted)', margin: '0 0 0.625rem',
}
const dlStyle: React.CSSProperties = {
  display: 'grid', gridTemplateColumns: 'max-content 1fr',
  columnGap: '1.25rem', rowGap: '0.375rem', margin: 0,
}
const dtStyle: React.CSSProperties = { fontSize: '0.8125rem', color: 'var(--text-muted)' }
const ddStyle: React.CSSProperties = { fontSize: '0.875rem', color: 'var(--text)', margin: 0 }
const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '0.625rem 0.875rem',
  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
  textTransform: 'uppercase', color: 'var(--text-muted)',
}
const tdStyle: React.CSSProperties = { padding: '0.625rem 0.875rem', color: 'var(--text)', verticalAlign: 'top' }
const codeStyle: React.CSSProperties = {
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '0.8125rem', fontWeight: 700, color: '#14b8a6',
  background: 'rgba(20,184,166,0.08)', padding: '0.15rem 0.45rem', borderRadius: 6,
}
