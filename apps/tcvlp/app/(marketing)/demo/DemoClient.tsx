'use client';

import Link from 'next/link';
import { useState, type ReactNode } from 'react';
import styles from './page.module.css';

const API_BASE = 'https://api.virtuallaunch.pro';
const SAMPLE_URL = '/assets/sample-transcript.pdf';

type Transaction = {
  code: string;
  date: string;
  amount: number;
  description: string;
};

type UploadResponse = {
  ok: boolean;
  parsed: boolean;
  kwong_penalties: {
    total_amount: number;
    tax_years: string[];
    transactions: Transaction[];
    date_range: { start: string; end: string };
  };
  all_transactions_count?: number;
  kwong_eligible_count?: number;
};

type PreviewResponse = {
  ok: boolean;
  demo: boolean;
  preview: {
    item8_text: string;
    cover_letter: {
      intro: string;
      legal_authority: string;
      facts_intro: string;
      computation: string;
      alternative_theory: string;
      protective_claim_notice: string;
      closing: string;
    };
    checklist_items: string[];
    summary: {
      taxpayer_name: string;
      tax_years: string[];
      tax_year_range: string;
      ftf_amount: number;
      ftp_amount: number;
      interest_amount: number;
      total: number;
      mailing_address: { street: string; city: string; state: string; zip: string; full: string };
      irc_sections: string;
    };
  };
};

const FTF_CODES = new Set(['160', '170', '304']);
const FTP_CODES = new Set(['270', '276', '306']);
const INT_CODES = new Set(['196', '199', '308']);

function fmtMoney(v: number): string {
  return v.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function fmtDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${m}/${d}/${y}`;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function fmtLetterDate(d: Date = new Date()): string {
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

const CHECKLIST_ITEMS: Array<{ title: string; detail: string }> = [
  {
    title: 'Verify form selection',
    detail: 'Use Form 843 for penalty and interest abatement only. For income-tax overpayment, file Form 1040-X instead (26 C.F.R. § 301.6402-3(a)(2)).',
  },
  {
    title: 'One form per year, per penalty type',
    detail: 'Do not combine multiple tax years or distinct penalty types on a single Form 843 — file a separate form for each year and penalty type.',
  },
  {
    title: 'Label protective claims',
    detail: 'Write "Protective Refund Claim Pursuant to Kwong v. United States" across the top of each Form 843 in bold ink.',
  },
  {
    title: 'Include supporting documents',
    detail: 'Attach the IRS Account Transcript, the Item 8 explanation, and copies of any IRS notices referencing the assessed penalties.',
  },
  {
    title: 'Consider § 6751(b) challenge',
    detail: 'For exam-assessed penalties (TC 240 / TC 300), evaluate a separate § 6751(b) supervisory-approval challenge in addition to the Kwong claim.',
  },
  {
    title: 'Mail certified with return receipt',
    detail: 'Send via USPS Certified Mail with return receipt requested to the IRS service center for the taxpayer’s state of residence.',
  },
  {
    title: 'Verify both deadlines',
    detail: 'Confirm filing before July 10, 2026 (the three-year Kwong deadline) and within two years of payment for each individual penalty entry, whichever is later.',
  },
  {
    title: 'Keep records 3+ years',
    detail: 'Retain a complete copy of everything mailed — Form 843, attachments, cover letter, certified-mail receipt — for at least three years after filing.',
  },
];

function renderItem8(text: string): ReactNode {
  const HEADERS = ['LEGAL AUTHORITY', 'COMPUTATION', 'ALTERNATIVE THEORY', 'FACTS', 'PROTECTIVE CLAIM NOTICE'];
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const trimmed = line.trim();
    if (trimmed && HEADERS.includes(trimmed)) {
      return (
        <span key={i} className={styles.item8Header}>{line}{'\n'}</span>
      );
    }
    return <span key={i}>{line}{i < lines.length - 1 ? '\n' : ''}</span>;
  });
}

type Phase = 'idle' | 'uploading' | 'parsed' | 'generating' | 'preview' | 'error';

export default function DemoClient() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [parsed, setParsed] = useState<UploadResponse['kwong_penalties'] | null>(null);
  const [preview, setPreview] = useState<PreviewResponse['preview'] | null>(null);

  async function runUpload() {
    setPhase('uploading');
    setErrorMsg('');
    try {
      const pdfResp = await fetch(SAMPLE_URL);
      if (!pdfResp.ok) throw new Error('Could not load sample transcript.');
      const pdfBlob = await pdfResp.blob();
      const form = new FormData();
      form.append('transcript', new File([pdfBlob], 'sample-transcript.pdf', { type: 'application/pdf' }));
      form.append('demo', 'true');
      const r = await fetch(`${API_BASE}/v1/tcvlp/transcript/upload`, { method: 'POST', body: form });
      const data = (await r.json()) as UploadResponse;
      if (!r.ok || !data.ok) throw new Error('Upload failed.');
      if (!data.parsed || data.kwong_penalties.transactions.length === 0) {
        throw new Error('Sample transcript returned no Kwong-eligible transactions.');
      }
      setParsed(data.kwong_penalties);
      setPhase('parsed');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Upload failed.');
      setPhase('error');
    }
  }

  async function runGenerate() {
    if (!parsed) return;
    setPhase('generating');
    setErrorMsg('');
    try {
      let ftf = 0, ftp = 0, ioa = 0;
      const perYearMap: Record<string, { failure_to_file: number; failure_to_pay: number; interest: number }> = {};
      for (const tx of parsed.transactions) {
        const yr = tx.date.slice(0, 4);
        perYearMap[yr] ??= { failure_to_file: 0, failure_to_pay: 0, interest: 0 };
        const amt = Math.abs(tx.amount);
        if (FTF_CODES.has(tx.code)) { ftf += amt; perYearMap[yr].failure_to_file += amt; }
        else if (FTP_CODES.has(tx.code)) { ftp += amt; perYearMap[yr].failure_to_pay += amt; }
        else if (INT_CODES.has(tx.code)) { ioa += amt; perYearMap[yr].interest += amt; }
      }
      const per_year = Object.entries(perYearMap)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([tax_year, v]) => ({ tax_year, ...v }));

      const body = {
        demo: true,
        taxpayer_name: 'Maria Garcia',
        tax_year: parsed.tax_years[0] || '2021',
        state: 'NJ',
        failure_to_file: ftf,
        failure_to_pay: ftp,
        interest_amount: ioa,
        total_amount: ftf + ftp + ioa,
        transactions: parsed.transactions,
        per_year,
      };
      const r = await fetch(`${API_BASE}/v1/tcvlp/forms/843/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await r.json()) as PreviewResponse;
      if (!r.ok || !data.ok || !data.preview) throw new Error('Preview generation failed.');
      setPreview(data.preview);
      setPhase('preview');
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : 'Preview generation failed.');
      setPhase('error');
    }
  }

  function reset() {
    setPhase('idle');
    setParsed(null);
    setPreview(null);
    setErrorMsg('');
  }

  return (
    <section className={styles.demoSection} aria-labelledby="demo-heading">
      <div className={styles.demoHeader}>
        <h2 id="demo-heading" className={styles.demoHeadline}>See It In Action</h2>
        <p className={styles.demoSubhead}>
          Upload a sample IRS transcript and preview the Form 843 output — no account required.
        </p>
      </div>

      {phase === 'idle' && (
        <div className={styles.demoCard}>
          <button type="button" className={styles.primaryBtn} onClick={runUpload}>
            Try with Sample Transcript
          </button>
          <p className={styles.demoNote}>
            Uses a synthetic IRS Account Transcript for taxpayer year 2021–2022.
            No real PII. No data is stored.
          </p>
        </div>
      )}

      {phase === 'uploading' && (
        <div className={styles.demoCard}>
          <div className={styles.spinnerRow}>
            <span className={styles.spinner} aria-hidden />
            <span>Uploading sample transcript and parsing IRS transaction codes…</span>
          </div>
        </div>
      )}

      {phase === 'error' && (
        <div className={styles.demoCard}>
          <p className={styles.errorText}>{errorMsg || 'Something went wrong.'}</p>
          <button type="button" className={styles.secondaryBtn} onClick={reset}>Try again</button>
        </div>
      )}

      {(phase === 'parsed' || phase === 'generating') && parsed && (
        <div className={styles.demoCard}>
          <h3 className={styles.previewTitle}>Kwong-Eligible Penalties Found</h3>
          <div className={styles.parsedGrid}>
            <div>
              <div className={styles.parsedLabel}>Total claimable</div>
              <div className={styles.parsedTotal}>{fmtMoney(parsed.total_amount)}</div>
            </div>
            <div>
              <div className={styles.parsedLabel}>Tax years</div>
              <div className={styles.parsedYears}>{parsed.tax_years.join(', ')}</div>
            </div>
            <div>
              <div className={styles.parsedLabel}>Transactions</div>
              <div className={styles.parsedYears}>{parsed.transactions.length}</div>
            </div>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.txTable}>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Date</th>
                  <th>Description</th>
                  <th className={styles.alignRight}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {parsed.transactions.map((tx, i) => (
                  <tr key={`${tx.code}-${tx.date}-${i}`}>
                    <td>{tx.code}</td>
                    <td>{fmtDate(tx.date)}</td>
                    <td>{tx.description}</td>
                    <td className={styles.alignRight}>{fmtMoney(Math.abs(tx.amount))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.btnRow}>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={runGenerate}
              disabled={phase === 'generating'}
            >
              {phase === 'generating' ? (
                <>
                  <span className={styles.spinner} aria-hidden /> Generating preview…
                </>
              ) : (
                'Generate Preview'
              )}
            </button>
            <button type="button" className={styles.secondaryBtn} onClick={reset}>
              Start over
            </button>
          </div>
        </div>
      )}

      {phase === 'preview' && preview && (
        <div className={styles.previewWrap}>
          <div className={styles.demoCard}>
            <h3 className={styles.previewTitle}>Summary</h3>
            <dl className={styles.summaryGrid}>
              <div><dt>Taxpayer</dt><dd>{preview.summary.taxpayer_name}</dd></div>
              <div><dt>Tax year(s)</dt><dd>{preview.summary.tax_years.join(', ')}</dd></div>
              <div><dt>Failure-to-File</dt><dd>{fmtMoney(preview.summary.ftf_amount)}</dd></div>
              <div><dt>Failure-to-Pay</dt><dd>{fmtMoney(preview.summary.ftp_amount)}</dd></div>
              <div><dt>Interest</dt><dd>{fmtMoney(preview.summary.interest_amount)}</dd></div>
              <div><dt>Total claimed</dt><dd className={styles.summaryTotal}>{fmtMoney(preview.summary.total)}</dd></div>
              <div><dt>IRC sections (Item 6)</dt><dd>{preview.summary.irc_sections}</dd></div>
              <div>
                <dt>Mail to (IRS)</dt>
                <dd>
                  {preview.summary.mailing_address.street}<br />
                  {preview.summary.mailing_address.city}, {preview.summary.mailing_address.state} {preview.summary.mailing_address.zip}
                </dd>
              </div>
            </dl>
          </div>

          <div className={styles.docLabel}>Form 843 — Item 8 (Explanation)</div>
          <div className={styles.documentPage}>
            <pre className={styles.item8Body}>{renderItem8(preview.item8_text)}</pre>
          </div>

          <div className={styles.docLabel}>
            Cover Letter Preview — as it would appear in the mailed Form 843 package
          </div>
          <div className={styles.documentPage}>
            <div className={styles.letterDate}>{fmtLetterDate()}</div>
            <div className={styles.letterAddress}>
              Internal Revenue Service<br />
              {preview.summary.mailing_address.street}<br />
              {preview.summary.mailing_address.city}, {preview.summary.mailing_address.state} {preview.summary.mailing_address.zip}
            </div>

            <p className={styles.letterRe}>
              <strong>Re: Form 843 Claim for Refund and Request for Abatement</strong>
            </p>
            <dl className={styles.letterReList}>
              <div>
                <dt>Taxpayer:</dt>
                <dd>{preview.summary.taxpayer_name}</dd>
              </div>
              <div>
                <dt>Tax Year(s):</dt>
                <dd>{preview.summary.tax_years.join(', ')}</dd>
              </div>
              <div>
                <dt>Total Claimed:</dt>
                <dd>{fmtMoney(preview.summary.total)}</dd>
              </div>
            </dl>

            <p className={styles.letterSalutation}>To Whom It May Concern:</p>

            <p className={styles.letterPara}>{preview.cover_letter.intro}</p>

            <h4 className={styles.letterSectionHead}>Legal Authority</h4>
            <p className={styles.letterPara}>{preview.cover_letter.legal_authority}</p>

            <h4 className={styles.letterSectionHead}>Facts</h4>
            <p className={styles.letterPara}>{preview.cover_letter.facts_intro}</p>

            {parsed && parsed.transactions.length > 0 && (
              <div className={styles.letterTableWrap}>
                <table className={styles.letterTable}>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Date</th>
                      <th>Description</th>
                      <th className={styles.alignRight}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsed.transactions.map((tx, i) => (
                      <tr key={`letter-${tx.code}-${tx.date}-${i}`}>
                        <td>{tx.code}</td>
                        <td>{fmtDate(tx.date)}</td>
                        <td>{tx.description}</td>
                        <td className={styles.alignRight}>{fmtMoney(Math.abs(tx.amount))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <h4 className={styles.letterSubHead}>Summary Totals (All Years)</h4>
            <dl className={styles.letterTotals}>
              <div>
                <dt>Failure-to-File Penalty:</dt>
                <dd>{fmtMoney(preview.summary.ftf_amount)}</dd>
              </div>
              <div>
                <dt>Failure-to-Pay Penalty:</dt>
                <dd>{fmtMoney(preview.summary.ftp_amount)}</dd>
              </div>
              <div>
                <dt>Interest on Penalties:</dt>
                <dd>{fmtMoney(preview.summary.interest_amount)}</dd>
              </div>
              <div className={styles.letterTotalsRow}>
                <dt>Total Refund Requested:</dt>
                <dd>{fmtMoney(preview.summary.total)}</dd>
              </div>
            </dl>

            <h4 className={styles.letterSectionHead}>Computation</h4>
            <p className={styles.letterPara}>{preview.cover_letter.computation}</p>

            <h4 className={styles.letterSectionHead}>Alternative Theory</h4>
            <p className={styles.letterPara}>{preview.cover_letter.alternative_theory}</p>

            <h4 className={styles.letterSectionHead}>Protective Claim Notice</h4>
            <p className={styles.letterPara}>{preview.cover_letter.protective_claim_notice}</p>

            <p className={styles.letterPara}>{preview.cover_letter.closing}</p>

            <p className={styles.letterSignoff}>Sincerely,</p>
            <div className={styles.letterSigBlock}>
              <div className={styles.sigLine} />
              <div className={styles.sigCaption}>{preview.summary.taxpayer_name}</div>
            </div>
            <div className={styles.letterSigBlock}>
              <div className={styles.sigLine} />
              <div className={styles.sigCaption}>Date</div>
            </div>
          </div>

          <div className={styles.docLabel}>
            Filing Checklist — included with every generated Form 843
          </div>
          <div className={styles.documentPage}>
            <h4 className={styles.checklistTitle}>Before You Mail</h4>
            <ol className={styles.checklistList}>
              {CHECKLIST_ITEMS.map((item, i) => (
                <li key={i} className={styles.checklistItem}>
                  <div className={styles.checklistItemTitle}>{item.title}</div>
                  <div className={styles.checklistItemDetail}>{item.detail}</div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.demoFinalCta}>
            <h3 className={styles.ctaTitle}>Ready to generate real Form 843s for your clients?</h3>
            <p className={styles.ctaBody}>
              Set up your branded claim page in 5 minutes. Each client uploads their transcript,
              you generate Form 843 + cover letter + checklist as a single deliverable.
            </p>
            <div className={styles.btnRow}>
              <Link href="/sign-in?redirect=/onboarding" className={styles.primaryBtn}>Get Started</Link>
              <Link href="/pricing" className={styles.secondaryBtn}>See Pricing</Link>
              <button type="button" className={styles.linkBtn} onClick={reset}>Run demo again</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
