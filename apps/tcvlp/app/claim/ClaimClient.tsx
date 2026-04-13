'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DeadlineBanner from '@/components/DeadlineBanner';
import {
  TaxPro,
  MailingAddress,
  TranscriptResult,
  Form843Result,
  getMailingAddress,
  uploadTranscript,
  generateForm843,
  submitForm843,
  downloadForm843,
  checkSubscription,
} from '@/lib/api';
import styles from './page.module.css';

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois',
  'Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts',
  'Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
  'Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina',
  'South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington',
  'West Virginia','Wisconsin','Wyoming',
];

const PENALTY_TYPES = [
  'Failure to File',
  'Failure to Pay',
  'Estimated Tax Penalty',
  'Other',
];

const TAX_YEARS = [2020, 2021, 2022, 2023];

interface Props {
  pro: TaxPro | null;
  slug: string;
}

export default function ClaimClient({ pro, slug }: Props) {
  const [step, setStep] = useState(1);

  // Step 1 – transcript
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Step 2 – taxpayer info
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('');
  const [mailingAddress, setMailingAddress] = useState<MailingAddress | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);

  // Step 3 – penalty details
  const [taxYear, setTaxYear] = useState<number>(2023);
  const [penaltyType, setPenaltyType] = useState('Failure to Pay');
  const [penaltyAmount, setPenaltyAmount] = useState('');

  // Step 4/5 – form generation
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [form843Result, setForm843Result] = useState<Form843Result | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  // Subscription gating — pro must have active subscription for unlimited client access
  const [subActive, setSubActive] = useState<boolean | null>(null);
  useEffect(() => {
    let cancelled = false;
    if (slug) {
      checkSubscription(slug).then((s) => {
        if (!cancelled) setSubActive(s.active);
      });
    }
    return () => { cancelled = true; };
  }, [slug]);

  if (!pro) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Page Not Available</h1>
          <p className={styles.notFoundSub}>
            The page <strong>{slug}.taxclaim.virtuallaunch.pro</strong> is not currently active.
            If you received this link from a tax professional, please contact them directly.
          </p>
          <Link href="/" className={styles.notFoundLink}>Learn about TaxClaim Pro →</Link>
        </div>
      </div>
    );
  }

  const handleUploadTranscript = async () => {
    if (!transcriptFile) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('transcript', transcriptFile);
      if (pro.pro_id) fd.append('pro_id', pro.pro_id);
      const result = await uploadTranscript(fd);
      setTranscript(result);
      if (result.tax_years.length) setTaxYear(result.tax_years[result.tax_years.length - 1]);
      if (result.total_penalty_amount) setpenaltyAmountFromTranscript(result.total_penalty_amount);
      setStep(2);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  function setpenaltyAmountFromTranscript(amount: number) {
    setTranscript((prev) => prev); // keep transcript in state
    setPenaltyAmount(amount.toFixed(2));
  }

  const handleStateChange = async (s: string) => {
    setState(s);
    if (!s) return;
    setLoadingAddress(true);
    try {
      const addr = await getMailingAddress(s);
      setMailingAddress(addr);
    } catch {
      setMailingAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleGenerate = async () => {
    if (!mailingAddress) return;
    if (subActive === false) {
      setGenError('This tax professional does not currently have an active TaxClaim Pro subscription. Please contact them or visit /pricing to activate.');
      return;
    }
    setGenerating(true);
    setGenError('');
    try {
      const result = await generateForm843({
        pro_id: pro.pro_id,
        full_name: fullName,
        email: email || undefined,
        state,
        tax_year: taxYear,
        penalty_type: penaltyType,
        penalty_amount: parseFloat(penaltyAmount),
        mailing_address: mailingAddress,
      });
      setForm843Result(result);
      setStep(5);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate preparation guide.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!form843Result) return;
    setDownloading(true);
    setDownloadError('');
    try {
      const blob = await downloadForm843(form843Result.submission_id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `form-843-${form843Result.submission_id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : 'Download failed.');
    } finally {
      setDownloading(false);
    }
  };

  const handleSubmit = async () => {
    if (!form843Result) return;
    setSubmitting(true);
    try {
      await submitForm843(form843Result.submission_id);
      setSubmitted(true);
    } catch {
      // still show submitted UI — they may have already filed
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const STEP_LABELS = ['Upload Transcript', 'Your Info', 'Penalty Details', 'Review & Generate', 'Preparation Guide'];

  return (
    <div className={styles.root}>
      <DeadlineBanner />

      {/* Header with pro branding */}
      <header className={styles.proHeader}>
        <div className={styles.proHeaderInner}>
          {pro.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={pro.logo_url} alt={`${pro.firm_name} logo`} className={styles.proLogoImg} />
          ) : (
            <div className={styles.proLogoBox}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          )}
          <div>
            <div className={styles.proFirmName}>{pro.firm_name}</div>
            {pro.display_name && <div className={styles.proDisplayName}>{pro.display_name}</div>}
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {subActive === false && (
          <div className={styles.subGateBanner}>
            <strong>Subscription inactive.</strong> This firm&apos;s TaxClaim Pro subscription is not currently active.
            You can still walk through the flow, but Form 843 generation is disabled until the firm reactivates.
            <Link href="/pricing" className={styles.subGateLink}> View pricing →</Link>
          </div>
        )}

        {/* Welcome */}
        {pro.welcome_message && (
          <div className={styles.welcomeCard}>
            <p>{pro.welcome_message}</p>
          </div>
        )}

        {/* Step progress */}
        <div className={styles.stepProgress}>
          {STEP_LABELS.map((label, idx) => (
            <div key={label} className={`${styles.stepDot} ${step > idx + 1 ? styles.stepDone : ''} ${step === idx + 1 ? styles.stepCurrent : ''}`}>
              <div className={styles.dotCircle}>{step > idx + 1 ? '✓' : idx + 1}</div>
              <span className={styles.dotLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Step 1: Transcript Upload ── */}
        {step === 1 && (
          <div className={styles.card}>
            <h2 className={styles.stepTitle}>Step 1 — Upload Your IRS Transcript (Optional)</h2>
            <p className={styles.stepDesc}>
              Upload your IRS Account Transcript (PDF) to auto-fill your penalty data. This step is optional — you can enter details manually.
            </p>

            {transcript ? (
              <div className={styles.transcriptResult}>
                <div className={styles.transcriptSuccess}>✓ Transcript processed successfully</div>
                <div className={styles.transcriptSummary}>
                  <div className={styles.tRow}><span>Total penalty found</span><strong>${transcript.total_penalty_amount.toFixed(2)}</strong></div>
                  <div className={styles.tRow}><span>Tax years</span><strong>{transcript.tax_years.join(', ')}</strong></div>
                </div>
                <h3 className={styles.tSubhead}>Transactions Found</h3>
                <div className={styles.transactionTable}>
                  <div className={styles.tHead}>
                    <span>Date</span><span>Code</span><span>Amount</span><span>Description</span>
                  </div>
                  {transcript.transactions.map((t, i) => (
                    <div key={i} className={styles.tRow2}>
                      <span>{t.date}</span><span>{t.code}</span><span>${t.amount.toFixed(2)}</span><span>{t.description}</span>
                    </div>
                  ))}
                </div>
                <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                  Use These Values →
                </button>
              </div>
            ) : (
              <div className={styles.uploadArea}>
                <input
                  type="file"
                  accept=".pdf"
                  id="transcriptFile"
                  className={styles.fileInput}
                  onChange={(e) => setTranscriptFile(e.target.files?.[0] ?? null)}
                />
                <label htmlFor="transcriptFile" className={styles.fileLabel}>
                  {transcriptFile ? (
                    <span>📄 {transcriptFile.name}</span>
                  ) : (
                    <>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Click to upload IRS transcript (PDF)</span>
                    </>
                  )}
                </label>
                {uploadError && <div className={styles.errorMsg}>{uploadError}</div>}
                <div className={styles.uploadBtns}>
                  {transcriptFile && (
                    <button className={styles.primaryBtn} onClick={handleUploadTranscript} disabled={uploading}>
                      {uploading ? 'Processing…' : 'Upload & Auto-Fill →'}
                    </button>
                  )}
                  <button className={styles.skipBtn} onClick={() => setStep(2)}>
                    Skip — Enter Manually →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Taxpayer Info ── */}
        {step === 2 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
            <h2 className={styles.stepTitle}>Step 2 — Your Information</h2>
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Full Name <span className={styles.required}>*</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>State <span className={styles.required}>*</span></label>
                <select value={state} onChange={(e) => handleStateChange(e.target.value)} required>
                  <option value="">Select your state…</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {loadingAddress && <span className={styles.hint}>Looking up IRS mailing address…</span>}
                {mailingAddress && (
                  <div className={styles.addressBox}>
                    <div className={styles.addressLabel}>📍 IRS Mailing Address for {state}</div>
                    <div className={styles.addressText}>
                      {mailingAddress.full ?? `${mailingAddress.street}, ${mailingAddress.city}, ${mailingAddress.state} ${mailingAddress.zip}`}
                    </div>
                  </div>
                )}
              </div>
              <button
                className={styles.primaryBtn}
                onClick={() => setStep(3)}
                disabled={!fullName || !state}
              >
                Next: Penalty Details →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Penalty Details ── */}
        {step === 3 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(2)}>← Back</button>
            <h2 className={styles.stepTitle}>Step 3 — Penalty Details</h2>
            {transcript && (
              <div className={styles.prefillNotice}>✓ Pre-filled from your transcript</div>
            )}
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Tax Year <span className={styles.required}>*</span></label>
                <select value={taxYear} onChange={(e) => setTaxYear(Number(e.target.value))}>
                  {TAX_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Penalty Type <span className={styles.required}>*</span></label>
                <select value={penaltyType} onChange={(e) => setPenaltyType(e.target.value)}>
                  {PENALTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Penalty Amount ($) <span className={styles.required}>*</span></label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={penaltyAmount}
                  onChange={(e) => setPenaltyAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              {mailingAddress && (
                <div className={styles.addressBox}>
                  <div className={styles.addressLabel}>📍 IRS Mailing Address — {state}</div>
                  <div className={styles.addressText}>
                    {mailingAddress.full ?? `${mailingAddress.street}, ${mailingAddress.city}, ${mailingAddress.state} ${mailingAddress.zip}`}
                  </div>
                </div>
              )}
              <button
                className={styles.primaryBtn}
                onClick={() => setStep(4)}
                disabled={!penaltyAmount || !taxYear}
              >
                Next: Review →
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Review & Generate ── */}
        {step === 4 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(3)}>← Back</button>
            <h2 className={styles.stepTitle}>Step 4 — Review & Generate</h2>

            <div className={styles.watermarkNotice}>
              ⚠️ This generates a <strong>PREPARATION GUIDE</strong>, not an official IRS form.{' '}
              <a href="https://www.irs.gov/pub/irs-pdf/f843.pdf" target="_blank" rel="noopener noreferrer" className={styles.irsLink}>
                View official IRS Form 843 →
              </a>
            </div>

            <div className={styles.reviewSummary}>
              {[
                ['Name', fullName],
                ['Email', email || '—'],
                ['State', state],
                ['Tax Year', String(taxYear)],
                ['Penalty Type', penaltyType],
                ['Penalty Amount', `$${parseFloat(penaltyAmount || '0').toFixed(2)}`],
                ['IRS Address', mailingAddress?.full ?? mailingAddress ? `${mailingAddress?.street}, ${mailingAddress?.city}` : '—'],
              ].map(([k, v]) => (
                <div key={k} className={styles.reviewRow}>
                  <span className={styles.reviewKey}>{k}</span>
                  <span className={styles.reviewVal}>{v}</span>
                </div>
              ))}
            </div>

            {genError && <div className={styles.errorMsg}>{genError}</div>}

            <button
              className={styles.primaryBtn}
              onClick={handleGenerate}
              disabled={generating || subActive === false}
            >
              {generating ? 'Generating…' : subActive === false ? 'Subscription Required' : 'Generate Preparation Guide →'}
            </button>
          </div>
        )}

        {/* ── Step 5: Preparation Guide ── */}
        {step === 5 && form843Result && (
          <div className={styles.card}>
            {submitted ? (
              <div className={styles.thankyou}>
                <div className={styles.thankyouIcon}>✓</div>
                <h2 className={styles.thankyouTitle}>Thank You!</h2>
                <p className={styles.thankyouBody}>
                  Your filing has been confirmed. Remember to mail your completed Form 843 to the IRS address shown above.
                </p>
                <a
                  href="https://www.irs.gov/pub/irs-pdf/f843.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Download Official IRS Form 843 →
                </a>
              </div>
            ) : (
              <>
                <h2 className={styles.stepTitle}>Step 5 — Your Preparation Guide</h2>

                {/* Watermark banner */}
                <div className={styles.watermarkBanner}>
                  PREPARATION GUIDE — NOT AN OFFICIAL IRS FORM
                </div>

                {/* Guide fields */}
                <div className={styles.guideFields}>
                  {Object.entries(form843Result.fields).map(([k, v]) => (
                    <div key={k} className={styles.guideField}>
                      <span className={styles.guideFieldKey}>{k}</span>
                      <span className={styles.guideFieldVal}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Kwong citation */}
                <div className={styles.kwongBox}>
                  <h3 className={styles.kwongTitle}>Claim Basis — Kwong v. United States</h3>
                  <p className={styles.kwongBody}>{form843Result.kwong_citation}</p>
                  <p className={styles.kwongBody}>{form843Result.claim_basis}</p>
                </div>

                {/* Mailing address */}
                <div className={styles.mailingBox}>
                  <div className={styles.mailingLabel}>📍 Mail Your Form 843 To</div>
                  <div className={styles.mailingAddress}>
                    {form843Result.mailing_address.full ??
                      `${form843Result.mailing_address.street}, ${form843Result.mailing_address.city}, ${form843Result.mailing_address.state} ${form843Result.mailing_address.zip}`}
                  </div>
                </div>

                {/* Deadline */}
                <div className={styles.deadlineNotice}>
                  <strong>IMPORTANT:</strong> Claims must be filed by <strong>July 10, 2026</strong>.
                </div>

                <div className={styles.guideActions}>
                  <button className={styles.printBtn} onClick={() => window.print()}>
                    🖨 Print Guide
                  </button>
                  <button
                    className={styles.printBtn}
                    onClick={handleDownloadPdf}
                    disabled={downloading}
                  >
                    {downloading ? 'Downloading…' : '⬇ Download PDF'}
                  </button>
                  <button
                    className={styles.confirmBtn}
                    onClick={handleSubmit}
                    disabled={submitting}
                  >
                    {submitting ? 'Confirming…' : '✓ Confirm I Have Filed'}
                  </button>
                </div>
                {downloadError && <div className={styles.errorMsg}>{downloadError}</div>}

                <p className={styles.officialFormNote}>
                  Use this guide to fill out the{' '}
                  <a href="https://www.irs.gov/pub/irs-pdf/f843.pdf" target="_blank" rel="noopener noreferrer" className={styles.irsLink}>
                    official IRS Form 843
                  </a>{' '}
                  before mailing.
                </p>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
