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
  downloadForm843,
  submitForm843,
  checkSubscription,
} from '@/lib/api';
import styles from './page.module.css';

/* ── Constants ────────────────────────────────────────────────────────────── */

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

const STEP_LABELS = ['Pull Transcript', 'Verify Eligibility', 'Generate Form', 'Print & Mail', 'Get Help'];

/* ── SVG Icons (stroke-based, matching demo page) ─────────────────────────── */

function DocumentIcon({ size = 28, color = '#eab308' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function FilePlusIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="12" y1="18" x2="12" y2="12" />
      <line x1="9" y1="15" x2="15" y2="15" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function CheckCircle({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────────── */

interface Props {
  pro: TaxPro | null;
  slug: string;
}

export default function ClaimClient({ pro, slug }: Props) {
  const [step, setStep] = useState(1);

  /* Step 1 — transcript */
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [uploadError, setUploadError] = useState('');

  /* Step 3 — form fields */
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('');
  const [mailingAddress, setMailingAddress] = useState<MailingAddress | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [taxYear, setTaxYear] = useState<number>(2023);
  const [penaltyType, setPenaltyType] = useState('Failure to Pay');
  const [penaltyAmount, setPenaltyAmount] = useState('');
  const [interestAmount, setInterestAmount] = useState('');

  /* Generation (Step 3 → 4) */
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [form843Result, setForm843Result] = useState<Form843Result | null>(null);

  /* Download / submit (Step 4 → 5) */
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  /* Subscription */
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

  /* ── Not found ────────────────────────────────────────────────────────── */

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

  /* ── Handlers ─────────────────────────────────────────────────────────── */

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
      if (result.kwong_penalties) {
        const kp = result.kwong_penalties;
        if (kp.tax_years.length) setTaxYear(Number(kp.tax_years[kp.tax_years.length - 1]));
        if (kp.total_amount) setPenaltyAmount(kp.total_amount.toFixed(2));
      }
      setStep(2);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

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
        state,
        tax_year: taxYear,
        penalty_type: penaltyType,
        penalty_amount: parseFloat(penaltyAmount),
        interest_amount: interestAmount ? parseFloat(interestAmount) : undefined,
        mailing_address: mailingAddress,
      });
      setForm843Result(result);
      setStep(4);
    } catch (err) {
      setGenError(err instanceof Error ? err.message : 'Failed to generate Form 843.');
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

  const handleMarkSubmitted = async () => {
    if (form843Result) {
      try {
        await submitForm843(form843Result.submission_id);
      } catch {
        /* still advance — they may have already filed */
      }
    }
    setStep(5);
  };

  const progressPct = (step / 5) * 100;

  const canGenerate = fullName && state && mailingAddress && penaltyAmount && taxYear;

  /* ── Render ───────────────────────────────────────────────────────────── */

  return (
    <div className={styles.root}>
      <DeadlineBanner />

      {/* Pro header */}
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
        {/* Subscription gate */}
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

        {/* Progress bar */}
        <div>
          <div className={styles.progressLabel}>
            <span className={styles.progressText}>{STEP_LABELS[step - 1]}</span>
            <span className={styles.progressText}>Step {step} of 5</span>
          </div>
          <div className={styles.progressBarWrap}>
            <div className={styles.progressBarFill} style={{ width: `${progressPct}%` }} />
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 1: Pull Your Transcript                                      */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className={styles.card}>
            <div className={styles.stepBadge}>Step 1 of 5</div>

            <div className={styles.stepHeader}>
              <div className={styles.stepIconWrap}><DocumentIcon /></div>
              <div>
                <h2 className={styles.stepTitle}>Pull Your Transcript</h2>
                <p className={styles.stepDesc}>
                  To file a penalty refund claim, you need your IRS Account Transcript. Here&apos;s how to get it.
                </p>
              </div>
            </div>

            <div className={styles.infoBoxBlue}>
              <div className={styles.infoBoxTitle}>How to get your IRS Account Transcript</div>
              <p>
                <strong>Online:</strong> Visit{' '}
                <a href="https://www.irs.gov/individuals/get-transcript" target="_blank" rel="noopener noreferrer" className={styles.infoBoxLink}>
                  irs.gov/transcripts
                </a>{' '}
                and sign in or create an account. Select &ldquo;Account Transcript&rdquo; for each tax year.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                <strong>By phone:</strong> Call <strong>800-908-9946</strong> to request a transcript by mail (5-10 business days).
              </p>
            </div>

            {transcript ? (
              <div className={styles.transcriptResult}>
                <div className={styles.transcriptSuccess}>
                  <CheckCircle size={18} /> Transcript processed successfully
                </div>
                {transcript.kwong_penalties && (
                  <>
                    <div className={styles.transcriptSummary}>
                      <div className={styles.tRow}><span>Total eligible penalty</span><strong>${transcript.kwong_penalties.total_amount.toFixed(2)}</strong></div>
                      <div className={styles.tRow}><span>Tax years</span><strong>{transcript.kwong_penalties.tax_years.join(', ')}</strong></div>
                      <div className={styles.tRow}><span>Eligible transactions</span><strong>{transcript.kwong_eligible_count ?? transcript.kwong_penalties.transactions.length}</strong></div>
                    </div>
                    {transcript.kwong_penalties.transactions.length > 0 && (
                      <>
                        <h3 className={styles.tSubhead}>Eligible Transactions</h3>
                        <div className={styles.transactionTable}>
                          <div className={styles.tHead}>
                            <span>Date</span><span>Code</span><span>Amount</span><span>Description</span>
                          </div>
                          {transcript.kwong_penalties.transactions.map((t, i) => (
                            <div key={i} className={styles.tRow2}>
                              <span>{t.date}</span><span>{t.code}</span><span>${t.amount.toFixed(2)}</span><span>{t.description}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}
                <button className={styles.primaryBtn} onClick={() => setStep(2)}>
                  Continue to Eligibility Check
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
                    <span className={styles.fileName}>
                      <DocumentIcon size={20} color="#9ca3af" />
                      {transcriptFile.name}
                    </span>
                  ) : (
                    <>
                      <UploadIcon />
                      <span>Click to upload IRS transcript (PDF)</span>
                    </>
                  )}
                </label>
                {uploadError && <div className={styles.errorMsg}>{uploadError}</div>}
                <div className={styles.uploadBtns}>
                  {transcriptFile && (
                    <button className={styles.primaryBtn} onClick={handleUploadTranscript} disabled={uploading}>
                      {uploading ? 'Processing...' : 'Upload & Auto-Fill'}
                    </button>
                  )}
                  <button className={styles.secondaryBtn} onClick={() => setStep(2)}>
                    Already have it — Check Eligibility
                  </button>
                  <button className={styles.skipBtn} onClick={() => setStep(3)}>
                    I don&apos;t have a transcript — Enter Manually
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 2: Verify Your Penalties Are Eligible                        */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(1)}>
              <ArrowLeftIcon /> Back
            </button>
            <div className={styles.stepBadge}>Step 2 of 5</div>

            <div className={styles.stepHeader}>
              <div className={styles.stepIconWrap}><ShieldCheckIcon /></div>
              <div>
                <h2 className={styles.stepTitle}>Verify Your Penalties Are Eligible</h2>
                <p className={styles.stepDesc}>
                  Under the <em>Kwong v. United States</em> ruling, only penalties assessed within a specific window qualify for a refund.
                </p>
              </div>
            </div>

            <div className={styles.kwongWindow}>
              Eligibility window: <span className={styles.kwongWindowAccent}>January 20, 2020</span> through <span className={styles.kwongWindowAccent}>July 10, 2023</span>
            </div>

            <div className={styles.eligibilityList}>
              <div className={styles.eligibleItem}>
                <div className={styles.eligibleIcon}><CheckCircle /></div>
                <div>
                  <div className={styles.eligibleLabel}>Failure-to-File Penalty</div>
                  <div className={styles.eligibleDesc}>Assessed within the Kwong window — ELIGIBLE for refund</div>
                </div>
              </div>
              <div className={styles.eligibleItem}>
                <div className={styles.eligibleIcon}><CheckCircle /></div>
                <div>
                  <div className={styles.eligibleLabel}>Failure-to-Pay Penalty</div>
                  <div className={styles.eligibleDesc}>Assessed within the Kwong window — ELIGIBLE for refund</div>
                </div>
              </div>
              <div className={styles.eligibleItem}>
                <div className={styles.eligibleIcon}><CheckCircle /></div>
                <div>
                  <div className={styles.eligibleLabel}>Interest on Penalties</div>
                  <div className={styles.eligibleDesc}>Accrued on eligible penalties — ELIGIBLE FOR REFUND</div>
                </div>
              </div>
            </div>

            <div className={styles.ineligibleNote}>
              Penalties assessed <strong>before January 20, 2020</strong> or <strong>after July 10, 2023</strong> are not eligible under the Kwong ruling.
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(3)}>
              My Penalties Are Eligible — Continue
            </button>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 3: Generate Your Form 843                                    */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(2)}>
              <ArrowLeftIcon /> Back
            </button>
            <div className={styles.stepBadge}>Step 3 of 5</div>

            <div className={styles.stepHeader}>
              <div className={styles.stepIconWrap}><FilePlusIcon /></div>
              <div>
                <h2 className={styles.stepTitle}>Generate Your Form 843</h2>
                <p className={styles.stepDesc}>
                  Fill in your details below to generate a preparation guide with IRS-compliant language referencing penalty relief under the Kwong decision.
                </p>
              </div>
            </div>

            {transcript && (
              <div className={styles.prefillNotice}>
                <CheckCircle size={16} /> Pre-filled from your transcript
              </div>
            )}

            {subActive === false && (
              <div className={styles.infoBoxRed}>
                <div className={styles.infoBoxTitle}>Subscription Required</div>
                <p>
                  Form 843 generation requires an active TaxClaim Pro subscription.
                  <Link href="/pricing" className={styles.subGateLink}> View pricing →</Link>
                </p>
              </div>
            )}

            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Taxpayer Name <span className={styles.required}>*</span></label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required />
              </div>

              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Tax Period <span className={styles.required}>*</span></label>
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
              </div>

              <div className={styles.field}>
                <label className={styles.label}>State <span className={styles.required}>*</span></label>
                <select value={state} onChange={(e) => handleStateChange(e.target.value)} required>
                  <option value="">Select your state...</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {loadingAddress && <span className={styles.hint}>Looking up IRS mailing address...</span>}
                {mailingAddress && (
                  <div className={styles.addressBox}>
                    <div className={styles.addressLabel}>
                      <MapPinIcon /> IRS Mailing Address for {state}
                    </div>
                    <div className={styles.addressText}>
                      {mailingAddress.full ?? `${mailingAddress.street}, ${mailingAddress.city}, ${mailingAddress.state} ${mailingAddress.zip}`}
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.formRow}>
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
                <div className={styles.field}>
                  <label className={styles.label}>Interest Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={interestAmount}
                    onChange={(e) => setInterestAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {genError && <div className={styles.errorMsg}>{genError}</div>}

              <button
                className={styles.primaryBtn}
                onClick={handleGenerate}
                disabled={generating || !canGenerate || subActive === false}
              >
                {generating ? 'Generating...' : subActive === false ? 'Subscription Required' : 'Generate Form 843'}
              </button>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 4: Print and Mail to the IRS                                 */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 4 && (
          <div className={styles.card}>
            <button className={styles.backBtn} onClick={() => setStep(3)}>
              <ArrowLeftIcon /> Back
            </button>
            <div className={styles.stepBadge}>Step 4 of 5</div>

            <div className={styles.stepHeader}>
              <div className={styles.stepIconWrap}><MailIcon /></div>
              <div>
                <h2 className={styles.stepTitle}>Print and Mail to the IRS</h2>
                <p className={styles.stepDesc}>
                  Your preparation guide has been generated. Download it, fill out the official Form 843, and mail it to the IRS.
                </p>
              </div>
            </div>

            {/* Filing deadline */}
            <div className={styles.deadlineBox}>
              <div className={styles.deadlineLabel}>Filing Deadline</div>
              <div className={styles.deadlineDate}>July 10, 2026</div>
            </div>

            {/* Mailing address */}
            {(form843Result?.mailing_address || mailingAddress) && (
              <div className={styles.mailingBox}>
                <div className={styles.mailingLabel}>
                  <MapPinIcon /> Mail Your Form 843 To
                </div>
                <div className={styles.mailingAddress}>
                  {(() => {
                    const addr = form843Result?.mailing_address ?? mailingAddress;
                    return addr?.full ?? `${addr?.street}\n${addr?.city}, ${addr?.state} ${addr?.zip}`;
                  })()}
                </div>
              </div>
            )}

            {/* Mailing tips */}
            <div className={styles.infoBoxYellow}>
              <div className={styles.infoBoxTitle}>Mailing Tips</div>
            </div>
            <div className={styles.tipsList}>
              <div className={styles.tipItem}>
                <div className={styles.tipBullet} />
                <span>Use <strong>certified mail with return receipt</strong> for proof of filing</span>
              </div>
              <div className={styles.tipItem}>
                <div className={styles.tipBullet} />
                <span>Include your <strong>SSN and tax period</strong> on every page</span>
              </div>
              <div className={styles.tipItem}>
                <div className={styles.tipBullet} />
                <span>Keep copies of <strong>everything you mail</strong> for your records</span>
              </div>
              <div className={styles.tipItem}>
                <div className={styles.tipBullet} />
                <span>Allow <strong>6-8 weeks</strong> for the IRS to process your claim</span>
              </div>
            </div>

            {/* Download buttons */}
            <div className={styles.downloadBtns}>
              <a
                href="https://www.irs.gov/pub/irs-pdf/f843.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadBtn}
              >
                <DownloadIcon /> Download Official Form 843
              </a>
              {form843Result && (
                <button
                  className={styles.downloadBtn}
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                >
                  <DownloadIcon /> {downloading ? 'Downloading...' : 'Download Preparation Guide'}
                </button>
              )}
            </div>

            {downloadError && <div className={styles.errorMsg}>{downloadError}</div>}

            <button className={styles.primaryBtn} onClick={handleMarkSubmitted}>
              Form Submitted — Continue
            </button>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 5: Need Professional Help?                                   */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 5 && (
          <div className={styles.card}>
            <div className={styles.stepBadge}>Step 5 of 5</div>

            <div className={styles.stepHeader}>
              <div className={styles.stepIconWrap}><UsersIcon /></div>
              <div>
                <h2 className={styles.stepTitle}>Need Professional Help?</h2>
                <p className={styles.stepDesc}>
                  If you need assistance completing your claim or have questions about the process, your tax professional is here to help.
                </p>
              </div>
            </div>

            {/* Contact card */}
            {(pro.display_name || pro.firm_name) && (
              <div className={styles.contactCard}>
                {pro.display_name && <div className={styles.contactName}>{pro.display_name}</div>}
                <div className={styles.contactFirm}>{pro.firm_name}</div>

                {(pro.firm_phone || pro.firm_website) && (
                  <div className={styles.contactDetails}>
                    {pro.firm_phone && (
                      <div className={styles.contactDetailRow}>
                        <PhoneIcon />
                        <a href={`tel:${pro.firm_phone}`}>{pro.firm_phone}</a>
                      </div>
                    )}
                    {pro.firm_website && (
                      <div className={styles.contactDetailRow}>
                        <GlobeIcon />
                        <a href={pro.firm_website.startsWith('http') ? pro.firm_website : `https://${pro.firm_website}`} target="_blank" rel="noopener noreferrer">
                          {pro.firm_website}
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* When to reach out */}
            <div className={styles.reachOutTitle}>When to reach out</div>
            <div className={styles.reachOutList}>
              <div className={styles.reachOutItem}>
                <div className={styles.tipBullet} />
                <span>Questions about your specific case or eligibility</span>
              </div>
              <div className={styles.reachOutItem}>
                <div className={styles.tipBullet} />
                <span>Help completing your Form 843</span>
              </div>
              <div className={styles.reachOutItem}>
                <div className={styles.tipBullet} />
                <span>IRS correspondence or follow-up notices</span>
              </div>
              <div className={styles.reachOutItem}>
                <div className={styles.tipBullet} />
                <span>Want them to handle the entire claim for you</span>
              </div>
            </div>

            {/* Contact button */}
            {pro.firm_phone ? (
              <a href={`tel:${pro.firm_phone}`} className={styles.primaryBtn}>
                Call {pro.display_name ?? pro.firm_name}
              </a>
            ) : (
              <div className={styles.infoBoxBlue}>
                Contact your tax professional directly for personalized assistance with your Form 843 claim.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
