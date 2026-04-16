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
  SubmitForm843Data,
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

const KWONG_MIN_YEAR = 2020;
const KWONG_MAX_YEAR = 2023;

/* ── SVG Icons (36×36 stroke, Canva reference) ───────────────────────────── */

function DocumentIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function FileCheckIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <polyline points="9 15 11 17 15 13" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#eab308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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

function UploadIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function SmallDocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
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

  /* Multi-transcript upload (Step 3) */
  type ParsedTranscript = {
    fileName: string;
    taxYear: number | null;
    failureToFile: number;
    failureToPay: number;
    interest: number;
    transactions: { date: string; code: string; amount: number; description: string }[];
    result: TranscriptResult;
  };
  const [parsedTranscripts, setParsedTranscripts] = useState<ParsedTranscript[]>([]);
  const [transcriptFile, setTranscriptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  /* Form fields (Step 3) */
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState('');
  const [mailingAddress, setMailingAddress] = useState<MailingAddress | null>(null);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [failureToFile, setFailureToFile] = useState('');
  const [failureToPay, setFailureToPay] = useState('');
  const [interestOnPenalties, setInterestOnPenalties] = useState('');
  const [disclaimerChecked, setDisclaimerChecked] = useState(false);
  const [noEligibleDates, setNoEligibleDates] = useState<string[]>([]);

  /* Generation (Step 3 → 4) */
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [form843Result, setForm843Result] = useState<Form843Result | null>(null);

  /* Download / submit (Step 4 → 5) */
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');

  /* Notification opt-in (Step 4) */
  const [notifyOptIn, setNotifyOptIn] = useState(false);
  const [notifyPreference, setNotifyPreference] = useState<'email' | 'phone' | 'sms'>('email');
  const [notifyEmail, setNotifyEmail] = useState('');
  const [notifyPhone, setNotifyPhone] = useState('');

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

  /* ── Not found ──────────────────────────────────────────────────────────── */

  if (!pro) {
    return (
      <div className={styles.notFound}>
        <div className={styles.notFoundCard}>
          <h1 className={styles.notFoundTitle}>Page Not Available</h1>
          <p className={styles.notFoundSub}>
            The page <strong>taxclaim.virtuallaunch.pro/claim?slug={slug}</strong> is not currently active.
            If you received this link from a tax professional, please contact them directly.
          </p>
          <Link href="/" className={styles.notFoundLink}>Learn about TaxClaim Pro →</Link>
        </div>
      </div>
    );
  }

  /* ── Handlers ───────────────────────────────────────────────────────────── */

  /* Recalculate aggregated penalty sums from all parsed transcripts */
  const recalcFromTranscripts = (transcripts: ParsedTranscript[]) => {
    let ftf = 0, ftp = 0, interest = 0;
    for (const t of transcripts) {
      ftf += t.failureToFile;
      ftp += t.failureToPay;
      interest += t.interest;
    }
    setFailureToFile(ftf ? ftf.toFixed(2) : '');
    setFailureToPay(ftp ? ftp.toFixed(2) : '');
    setInterestOnPenalties(interest ? interest.toFixed(2) : '');
  };

  const handleUploadTranscript = async () => {
    if (!transcriptFile) return;
    setUploading(true);
    setUploadError('');
    try {
      const fd = new FormData();
      fd.append('transcript', transcriptFile);
      if (pro.pro_id) fd.append('pro_id', pro.pro_id);
      const result = await uploadTranscript(fd);
      console.log('[TCVLP] Transcript upload response:', JSON.stringify(result, null, 2));

      let parsedYear: number | null = null;
      let ftf = 0, ftp = 0, interest = 0;
      let transactions: { date: string; code: string; amount: number; description: string }[] = [];

      if (result.kwong_penalties) {
        const kp = result.kwong_penalties;
        if (kp.tax_years.length) parsedYear = Number(kp.tax_years[kp.tax_years.length - 1]);
        transactions = kp.transactions;

        for (const t of kp.transactions) {
          const code = String(t.code).trim();
          if (code === '160') ftf += Math.abs(t.amount);
          else if (code === '276') ftp += Math.abs(t.amount);
          else if (code === '196' || code === '199') interest += Math.abs(t.amount);
        }

        if (kp.transactions.length === 0) {
          const allDates = (result as { all_transaction_dates?: string[] }).all_transaction_dates ?? [];
          setNoEligibleDates(allDates);
        } else {
          setNoEligibleDates([]);
        }
      }

      const entry: ParsedTranscript = {
        fileName: transcriptFile.name,
        taxYear: parsedYear,
        failureToFile: ftf,
        failureToPay: ftp,
        interest,
        transactions,
        result,
      };

      const updated = [...parsedTranscripts, entry];
      setParsedTranscripts(updated);
      recalcFromTranscripts(updated);

      /* Reset file input for next upload */
      setTranscriptFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveTranscript = (index: number) => {
    const updated = parsedTranscripts.filter((_, i) => i !== index);
    setParsedTranscripts(updated);
    recalcFromTranscripts(updated);
    if (updated.length === 0) setNoEligibleDates([]);
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

  /* Derived: detected tax years from uploaded transcripts */
  const detectedTaxYears = parsedTranscripts
    .map((t) => t.taxYear)
    .filter((y): y is number => y !== null);
  const uniqueDetectedYears = [...new Set(detectedTaxYears)].sort();
  const hasOutOfRangeYear = uniqueDetectedYears.some((y) => y < KWONG_MIN_YEAR || y > KWONG_MAX_YEAR);
  const allOutOfRange = uniqueDetectedYears.length > 0 && uniqueDetectedYears.every((y) => y < KWONG_MIN_YEAR || y > KWONG_MAX_YEAR);

  /* Tax year to send in payload: first detected year, or 0 to indicate full range */
  const payloadTaxYear = uniqueDetectedYears.length > 0
    ? uniqueDetectedYears.filter((y) => y >= KWONG_MIN_YEAR && y <= KWONG_MAX_YEAR)[0] ?? uniqueDetectedYears[0]
    : 2020; // default to start of Kwong range if no transcript

  const handleGenerate = async () => {
    if (!mailingAddress) return;
    if (subActive === false) {
      setGenError('This tax professional does not currently have an active TaxClaim Pro subscription. Please contact them or visit /pricing to activate.');
      return;
    }
    setGenerating(true);
    setGenError('');
    try {
      const ftf = parseFloat(failureToFile) || 0;
      const ftp = parseFloat(failureToPay) || 0;
      const iop = parseFloat(interestOnPenalties) || 0;
      const result = await generateForm843({
        pro_id: pro.pro_id,
        taxpayer_name: fullName,
        state,
        tax_year: payloadTaxYear,
        failure_to_file: ftf,
        failure_to_pay: ftp,
        interest_amount: iop,
        total_amount: ftf + ftp + iop,
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
        const submitData: SubmitForm843Data = {
          submission_id: form843Result.submission_id,
          confirmed: true,
          notify_opt_in: notifyOptIn,
          notify_email: notifyEmail || undefined,
          notify_phone: notifyPhone || undefined,
          notify_preference: notifyOptIn ? notifyPreference : undefined,
        };
        await submitForm843(submitData);
      } catch {
        /* still advance — they may have already filed */
      }
    }
    setStep(5);
  };

  const progressPct = (step / 5) * 100;
  const totalAmount = (parseFloat(failureToFile) || 0) + (parseFloat(failureToPay) || 0) + (parseFloat(interestOnPenalties) || 0);
  const hasAnyAmount = totalAmount > 0;
  const canGenerate = fullName && state && mailingAddress && hasAnyAmount && disclaimerChecked && !allOutOfRange;

  /* ── Render ─────────────────────────────────────────────────────────────── */

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
        {/* Welcome message */}
        {pro.welcome_message && (
          <div className={styles.welcomeCard}>
            <p>{pro.welcome_message}</p>
          </div>
        )}

        {/* Subscription gate */}
        {subActive === false && (
          <div className={styles.subGateBanner}>
            <strong>Subscription inactive.</strong> This firm&apos;s TaxClaim Pro subscription is not currently active.
            You can still walk through the flow, but Form 843 generation is disabled until the firm reactivates.
            <Link href="/pricing" className={styles.subGateLink}> View pricing →</Link>
          </div>
        )}

        {/* Page title */}
        <div className={styles.pageTitleWrap}>
          <h1 className={styles.pageTitle}>How to Claim Your Kwong Relief</h1>
          <p className={styles.pageSubtitle}>Complete Form 843 in 5 steps</p>
        </div>

        {/* Progress bar */}
        <div className={styles.progressWrap}>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
          </div>
          <div className={styles.progressStepLabel}>Step {step} of 5</div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 1: Pull Your IRS Transcript (informational)                  */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 1</span>
                <h2 className={styles.stepTitle}>Pull Your IRS Transcript</h2>
              </div>
              <div className={styles.stepHeaderIcon}><DocumentIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                To file a penalty refund claim, you need your IRS Account Transcript. Here&apos;s how to get it.
              </p>

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
                  <strong>By phone:</strong> Call <strong>800-908-9946</strong> to request a transcript by mail (5–10 business days).
                </p>
              </div>

              <div className={styles.infoBoxGreen}>
                <div className={styles.infoBoxTitle}>What to look for</div>
                <p>Account transcript showing tax periods and penalties assessed. Look for transaction codes 166, 276, and 196.</p>
              </div>

              <p className={styles.expectedTime}>Expected time: 15–20 minutes online, 5–10 business days by mail</p>

              <div className={styles.btnRow}>
                <a
                  href="https://www.irs.gov/individuals/get-transcript"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Get Transcript Online
                </a>
                <button className={styles.secondaryBtn} onClick={() => setStep(2)}>
                  Already have it
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 2: Verify Your Penalties Are Eligible (informational)        */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 2</span>
                <h2 className={styles.stepTitle}>Verify Your Penalties Are Eligible</h2>
              </div>
              <div className={styles.stepHeaderIcon}><ShieldCheckIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                Under the <em>Kwong v. United States</em> ruling, only penalties assessed within a specific window qualify for a refund.
              </p>

              <div className={styles.infoBoxYellow}>
                <div className={styles.infoBoxTitle}>Kwong Eligibility Window</div>
                <p>
                  Penalties must have been assessed between <strong>January 20, 2020</strong> and <strong>July 10, 2023</strong> to qualify for relief under the Kwong decision.
                </p>
              </div>

              <div className={styles.eligibilityList}>
                <div className={styles.eligibleItem}>
                  <div className={styles.eligibleIcon}><CheckCircle /></div>
                  <div>
                    <div className={styles.eligibleLabel}>Failure-to-File Penalty</div>
                    <div className={styles.eligibleDesc}>
                      Assessed within the Kwong window — <span className={styles.eligibleTag}>ELIGIBLE</span>
                    </div>
                  </div>
                </div>
                <div className={styles.eligibleItem}>
                  <div className={styles.eligibleIcon}><CheckCircle /></div>
                  <div>
                    <div className={styles.eligibleLabel}>Failure-to-Pay Penalty</div>
                    <div className={styles.eligibleDesc}>
                      Assessed within the Kwong window — <span className={styles.eligibleTag}>ELIGIBLE</span>
                    </div>
                  </div>
                </div>
                <div className={styles.eligibleItem}>
                  <div className={styles.eligibleIcon}><CheckCircle /></div>
                  <div>
                    <div className={styles.eligibleLabel}>Interest on Penalties</div>
                    <div className={styles.eligibleDesc}>
                      Accrued on eligible penalties — <span className={styles.eligibleTag}>ELIGIBLE</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infoBoxRed}>
                <div className={styles.infoBoxTitle}>Not eligible</div>
                <p>
                  Penalties assessed <strong>before January 20, 2020</strong> or <strong>after July 10, 2023</strong> are not eligible under the Kwong ruling.
                </p>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.primaryBtn} onClick={() => setStep(3)}>
                  My penalties are eligible
                </button>
                <button className={styles.secondaryBtn} onClick={() => setStep(1)}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 3: Generate Your Form 843 (action step)                      */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 3</span>
                <h2 className={styles.stepTitle}>Generate Your Form 843</h2>
              </div>
              <div className={styles.stepHeaderIcon}><FileCheckIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                Fill in your details below to generate a preparation guide with IRS-compliant language referencing penalty relief under the Kwong decision.
              </p>

              <div className={styles.infoBoxGreen}>
                <div className={styles.infoBoxTitle}>Pre-filled</div>
                <p>Your claim will include IRS-compliant language referencing penalty relief under the Kwong decision.</p>
              </div>

              {/* Transcript upload area — multi-file */}
              <div className={styles.uploadSection}>
                <div className={styles.uploadLabel}>
                  {parsedTranscripts.length > 0
                    ? 'Upload another transcript'
                    : 'Upload IRS Account Transcripts (one or more)'}
                </div>
                <div className={styles.uploadHint}>We&apos;ll automatically identify Kwong-eligible penalties</div>

                {/* Summary cards for already-uploaded transcripts */}
                {parsedTranscripts.length > 0 && (
                  <div className={styles.transcriptList}>
                    {parsedTranscripts.map((pt, idx) => {
                      const penaltyCount = pt.transactions.length;
                      const totalAmt = pt.failureToFile + pt.failureToPay + pt.interest;
                      return (
                        <div key={idx} className={styles.transcriptCard}>
                          <div className={styles.transcriptCardInfo}>
                            <span className={styles.transcriptCardYear}>
                              {pt.taxYear ? `${pt.taxYear} transcript` : pt.fileName}
                            </span>
                            <span className={styles.transcriptCardDetails}>
                              {penaltyCount} {penaltyCount === 1 ? 'penalty' : 'penalties'} found (${totalAmt.toFixed(2)})
                            </span>
                          </div>
                          <button
                            className={styles.transcriptRemoveBtn}
                            onClick={() => handleRemoveTranscript(idx)}
                            type="button"
                          >
                            x remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Upload input — always visible */}
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    accept=".pdf"
                    id="transcriptFile"
                    className={styles.fileInput}
                    onChange={(e) => { setTranscriptFile(e.target.files?.[0] ?? null); e.target.value = ''; }}
                  />
                  <label htmlFor="transcriptFile" className={styles.fileLabel}>
                    {transcriptFile ? (
                      <span className={styles.fileName}>
                        <SmallDocIcon />
                        {transcriptFile.name}
                      </span>
                    ) : (
                      <>
                        <UploadIcon />
                        <span>Drag and drop or click to upload PDF</span>
                      </>
                    )}
                  </label>
                  {uploadError && <div className={styles.errorMsg}>{uploadError}</div>}
                  {transcriptFile && (
                    <div className={styles.uploadBtns}>
                      <button className={styles.secondaryBtn} onClick={handleUploadTranscript} disabled={uploading}>
                        {uploading ? 'Processing...' : 'Upload & Auto-Fill'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription gate within form */}
              {subActive === false && (
                <div className={styles.infoBoxRed}>
                  <div className={styles.infoBoxTitle}>Subscription Required</div>
                  <p>
                    Form 843 generation requires an active TaxClaim Pro subscription.
                    <Link href="/pricing" className={styles.subGateLink}> View pricing →</Link>
                  </p>
                </div>
              )}

              {/* Form fields */}
              <div className={styles.form}>
                {parsedTranscripts.length > 0 && (
                  <div className={styles.prefillNotice}>
                    <CheckCircle size={16} /> Pre-filled from {parsedTranscripts.length === 1 ? 'your transcript' : `${parsedTranscripts.length} transcripts`}
                  </div>
                )}

                <div className={styles.field}>
                  <label className={styles.label}>Taxpayer Name <span className={styles.required}>*</span></label>
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" required />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Tax Period</label>
                    {uniqueDetectedYears.length === 0 ? (
                      <div className={styles.taxPeriodReadonly}>
                        <div className={styles.taxPeriodValue}>
                          {KWONG_MIN_YEAR} &mdash; {KWONG_MAX_YEAR} (Kwong eligibility window)
                        </div>
                      </div>
                    ) : hasOutOfRangeYear && allOutOfRange ? (
                      <div className={`${styles.taxPeriodReadonly} ${styles.taxPeriodWarning}`}>
                        <div className={styles.taxPeriodValue}>
                          {uniqueDetectedYears.join(', ')} &mdash; Outside Kwong eligibility window ({KWONG_MIN_YEAR}-{KWONG_MAX_YEAR})
                        </div>
                        <div className={styles.taxPeriodWarningNote}>
                          This transcript covers a tax period outside the Kwong v. US ruling window. Penalties from this period are not eligible for abatement under this claim.
                        </div>
                      </div>
                    ) : (
                      <div className={styles.taxPeriodReadonly}>
                        <div className={styles.taxPeriodValue}>
                          {uniqueDetectedYears.join(', ')}
                        </div>
                        <span className={styles.taxPeriodDetected}>Detected from transcript</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>State <span className={styles.required}>*</span></label>
                    <select value={state} onChange={(e) => handleStateChange(e.target.value)} required>
                      <option value="">Select state...</option>
                      {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

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

                {/* Penalty & Interest Amounts */}
                <div className={styles.penaltySection}>
                  <div className={styles.penaltySectionTitle}>Penalty &amp; Interest Amounts</div>

                  {noEligibleDates.length > 0 && (
                    <div className={styles.noEligibleBox}>
                      <strong>No penalties within the Kwong eligibility window</strong> (Jan 20, 2020 — Jul 10, 2023) were found in this transcript.
                      {noEligibleDates.length > 0 && (
                        <> The penalties on this transcript were assessed on {noEligibleDates.join(', ')}.</>
                      )}
                      {' '}You can still enter amounts manually if you believe they qualify.
                    </div>
                  )}

                  <div className={styles.field}>
                    <label className={styles.label}>Failure-to-File Penalty ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={failureToFile}
                      onChange={(e) => setFailureToFile(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className={styles.field} style={{ marginTop: '1rem' }}>
                    <label className={styles.label}>Failure-to-Pay Penalty ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={failureToPay}
                      onChange={(e) => setFailureToPay(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className={styles.field} style={{ marginTop: '1rem' }}>
                    <label className={styles.label}>Interest on Penalties ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={interestOnPenalties}
                      onChange={(e) => setInterestOnPenalties(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className={styles.totalFieldHero}>
                    <label className={styles.totalFieldHeroLabel}>Total Refund Requested</label>
                    <div className={styles.totalFieldHeroAmount}>
                      ${totalAmount > 0 ? totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                    </div>
                    <div className={styles.totalFieldHeroRef}>IRS Form 843, Item 2: Amount to be refunded or abated</div>
                  </div>
                </div>

                {genError && <div className={styles.errorMsg}>{genError}</div>}

                {/* Verification disclaimer */}
                <label className={styles.disclaimerWrap}>
                  <input
                    type="checkbox"
                    className={styles.disclaimerCheckbox}
                    checked={disclaimerChecked}
                    onChange={(e) => setDisclaimerChecked(e.target.checked)}
                  />
                  <span className={styles.disclaimerLabel}>
                    I have reviewed the amounts above against my IRS transcript and confirm they are accurate. I understand this generates a preparation guide, not an official IRS filing.
                  </span>
                </label>
              </div>

              <div className={styles.btnRow}>
                <button
                  className={styles.primaryBtn}
                  onClick={handleGenerate}
                  disabled={generating || !canGenerate || subActive === false}
                  title={allOutOfRange ? 'Tax period outside Kwong eligibility window' : !disclaimerChecked ? 'Please confirm the disclaimer above' : undefined}
                >
                  {generating ? 'Generating...' : subActive === false ? 'Subscription Required' : allOutOfRange ? 'Not Eligible' : 'Generate Form'}
                </button>
                <button className={styles.secondaryBtn} onClick={() => setStep(2)}>
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 4: Print & Mail to the IRS                                   */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 4 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 4</span>
                <h2 className={styles.stepTitle}>Print &amp; Mail to the IRS</h2>
              </div>
              <div className={styles.stepHeaderIcon}><MailIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                Your preparation guide has been generated. Download it, fill out the official Form 843, and mail it to the IRS.
              </p>

              {/* Filing deadline */}
              <div className={styles.infoBoxRed}>
                <div className={styles.infoBoxTitle}>Filing Deadline</div>
                <p>Submit your Form 843 by <strong>July 10, 2026</strong> to be eligible for penalty relief under the Kwong decision.</p>
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
              <div className={styles.infoBoxGreen}>
                <div className={styles.infoBoxTitle}>Mailing Tips</div>
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
                    <span>Allow <strong>6–8 weeks</strong> for the IRS to process your claim</span>
                  </div>
                </div>
              </div>

              {/* Notify Me opt-in card */}
              <div className={styles.notifyCard} onClick={() => setNotifyOptIn(!notifyOptIn)}>
                <input
                  type="checkbox"
                  className={styles.notifyCheckbox}
                  checked={notifyOptIn}
                  onChange={(e) => { e.stopPropagation(); setNotifyOptIn(e.target.checked); }}
                />
                <div className={styles.notifyContent}>
                  <span className={styles.notifyLabel}>
                    Notify me when I need to check my IRS transcript for updates on my claim and of any related news on this claim or related claims.
                  </span>
                  <span className={styles.notifySmall}>
                    By checking this box, you allow the tax professional and their team to contact you about this claim or related claims via your preferred contact method below.
                  </span>
                </div>
              </div>

              {/* Contact preference fields */}
              <div className={styles.contactPrefs}>
                <div className={styles.contactPrefsTitle}>Preferred contact method:</div>
                <div className={styles.radioGroup}>
                  <div className={styles.radioRow}>
                    <input
                      type="radio"
                      id="pref-email"
                      name="notifyPref"
                      className={styles.radioInput}
                      checked={notifyPreference === 'email'}
                      onChange={() => setNotifyPreference('email')}
                    />
                    <label htmlFor="pref-email" className={styles.radioLabel}>Email</label>
                    <input
                      type="email"
                      className={styles.radioFieldInput}
                      placeholder="you@example.com"
                      value={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.value)}
                    />
                  </div>
                  <div className={styles.radioRow}>
                    <input
                      type="radio"
                      id="pref-phone"
                      name="notifyPref"
                      className={styles.radioInput}
                      checked={notifyPreference === 'phone'}
                      onChange={() => setNotifyPreference('phone')}
                    />
                    <label htmlFor="pref-phone" className={styles.radioLabel}>Phone</label>
                    <input
                      type="tel"
                      className={styles.radioFieldInput}
                      placeholder="(555) 123-4567"
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                    />
                  </div>
                  <div className={styles.radioRow}>
                    <input
                      type="radio"
                      id="pref-sms"
                      name="notifyPref"
                      className={styles.radioInput}
                      checked={notifyPreference === 'sms'}
                      onChange={() => setNotifyPreference('sms')}
                    />
                    <label htmlFor="pref-sms" className={styles.radioLabel}>Text/SMS</label>
                    <input
                      type="tel"
                      className={styles.radioFieldInput}
                      placeholder="(555) 123-4567"
                      value={notifyPhone}
                      onChange={(e) => setNotifyPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.contactEmailField}>
                  <label className={styles.label}>Email <span style={{ color: '#eab308' }}>*</span></label>
                  <input
                    type="email"
                    placeholder="Required for submission confirmation"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    required
                  />
                  <span className={styles.hint} style={{ color: 'var(--color-text-3)' }}>
                    Required regardless of preference — your submission confirmation is sent via email.
                  </span>
                </div>
              </div>

              {/* Download buttons */}
              <div className={styles.downloadBtns}>
                <a
                  href="https://www.irs.gov/pub/irs-pdf/f843.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
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

              <button className={styles.secondaryBtn} onClick={handleMarkSubmitted}>
                Form submitted
              </button>

              <button className={styles.goBackBtn} onClick={() => setStep(3)}>
                Go Back
              </button>
            </div>
          </div>
        )}

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* Step 5: Need Professional Help?                                   */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {step === 5 && (
          <div className={styles.stepCard}>
            <div className={styles.stepHeader}>
              <div className={styles.stepHeaderLeft}>
                <span className={styles.stepBadge}>Step 5</span>
                <h2 className={styles.stepTitle}>Need Professional Help?</h2>
              </div>
              <div className={styles.stepHeaderIcon}><UsersIcon /></div>
            </div>
            <div className={styles.stepBody}>
              <p className={styles.stepDesc}>
                If you need assistance completing your claim or have questions about the process, your tax professional is here to help.
              </p>

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
                          <a href={`tel:${pro.firm_phone}`} className={styles.contactPhone}>{pro.firm_phone}</a>
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
              <div className={styles.reachOutCard}>
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
              </div>

              {/* Professional fee note */}
              <div className={styles.infoBoxBlue}>
                <div className={styles.infoBoxTitle}>Professional Services</div>
                <p>
                  Your tax professional may charge a fee for personalized assistance with your Form 843 claim.
                  Contact them directly for fee information and engagement terms.
                </p>
              </div>

              {/* Get in Touch button */}
              {pro.firm_phone ? (
                <a href={`tel:${pro.firm_phone}`} className={styles.primaryBtn}>
                  Get in Touch
                </a>
              ) : pro.firm_website ? (
                <a
                  href={pro.firm_website.startsWith('http') ? pro.firm_website : `https://${pro.firm_website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.primaryBtn}
                >
                  Get in Touch
                </a>
              ) : (
                <div className={styles.infoBoxBlue}>
                  Contact your tax professional directly for personalized assistance with your Form 843 claim.
                </div>
              )}

              <button className={styles.goBackBtn} onClick={() => setStep(4)}>
                Go Back
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
