'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  getAssetPage,
  submitSiteRequest,
  getSiteRequestStatus,
  getCustomSiteUrl,
  type AssetPageData,
  type ConversionLeakReport,
} from '@/lib/api';

interface Props {
  initialSlug: string;
}

const PAGE = 'min-h-screen flex flex-col text-text-primary';
const HEADER = 'sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-border-subtle';
const HEADER_INNER = 'max-w-[1100px] mx-auto px-6 h-16 flex items-center';
const LOGO = 'font-sora font-extrabold text-[1.25rem] text-brand-primary no-underline [text-shadow:0_0_20px_rgba(168,85,247,0.5)] -tracking-[0.3px]';
const SECTION_TITLE = 'font-sora font-bold text-[clamp(1.5rem,3vw,2rem)] text-text-primary -tracking-[0.5px]';
const SECTION_HEADING = 'font-sora font-bold text-[clamp(1.4rem,3vw,1.9rem)] -tracking-[0.5px] text-text-primary';
const PRIMARY_CTA = 'inline-block px-8 py-4 bg-brand-primary text-white font-sora font-bold text-base rounded-[10px] no-underline transition-all shadow-brand hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]';
const SCRATCH_CTA = 'inline-block px-8 py-4 bg-brand-primary text-white font-sora font-bold text-base rounded-[10px] no-underline transition-all shadow-brand hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]';
const BOOKING_CTA = 'inline-block px-8 py-4 bg-transparent text-brand-primary font-sora font-bold text-base rounded-[10px] no-underline border border-brand-primary/50 transition-all hover:bg-brand-primary/[0.08] hover:border-brand-primary';
const GHOST_CTA = 'inline-block px-7 py-3.5 bg-transparent text-text-muted font-sora font-semibold text-[0.95rem] rounded-[10px] no-underline border border-border-subtle transition-all hover:text-brand-primary hover:border-brand-primary';

export default function AssetClient({ initialSlug }: Props) {
  const [slug, setSlug] = useState(initialSlug);
  const [data, setData] = useState<AssetPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let realSlug = initialSlug;
    if (typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const idx = parts.indexOf('asset');
      if (idx !== -1 && parts[idx + 1]) {
        realSlug = parts[idx + 1];
      }
    }
    setSlug(realSlug);

    let cancelled = false;
    (async () => {
      const result = await getAssetPage(realSlug);
      if (cancelled) return;
      if (!result) {
        setNotFound(true);
      } else {
        setData(result);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [initialSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="spinner" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className={PAGE}>
        <header className={HEADER}>
          <div className={HEADER_INNER}>
            <Link href="/" className={LOGO}>Website Lotto</Link>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center gap-5 py-20 px-6 text-center max-w-[600px] mx-auto">
          <h1 className="font-sora font-extrabold text-[2rem] text-text-primary">This preview isn&apos;t available</h1>
          <p className="text-text-muted leading-relaxed">
            The personalized template preview for <strong>{slug}</strong> couldn&apos;t be loaded.
            Browse our full catalog of 210+ ready-made templates instead.
          </p>
          <div className="flex gap-3.5 flex-wrap justify-center mt-3">
            <Link href="/" className={PRIMARY_CTA}>Browse the Marketplace</Link>
            <Link href="/scratch" className={SCRATCH_CTA}>Try a Free Scratch Ticket</Link>
          </div>
        </main>
        <footer className="border-t border-border-subtle py-8 px-6 text-center text-text-muted text-[0.85rem]">
          <p>© Website Lotto · websitelotto.virtuallaunch.pro</p>
        </footer>
      </div>
    );
  }

  if (data.conversion_leak_report) {
    return <LeakReport data={data} report={data.conversion_leak_report} slug={slug} />;
  }

  return (
    <div className={PAGE}>
      <header className={HEADER}>
        <div className={HEADER_INNER}>
          <Link href="/" className={LOGO}>Website Lotto</Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 pt-12 pb-20 flex flex-col gap-20 max-md:pt-8 max-md:px-4 max-md:pb-16 max-md:gap-14">
        <section className="flex flex-col items-center text-center gap-5 pt-6">
          <h1 className="font-sora font-extrabold text-[clamp(2rem,5vw,3.4rem)] leading-[1.1] -tracking-[1px] max-w-[820px] bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            {data.headline}
          </h1>
          <p className="text-[clamp(1rem,2vw,1.2rem)] text-text-muted max-w-[640px] leading-snug">{data.subheadline}</p>
          <div className="flex gap-3.5 flex-wrap justify-center mt-3 max-md:flex-col max-md:w-full max-md:items-stretch">
            <a href={data.cta_claim_url} className={`${PRIMARY_CTA} max-md:text-center`}>
              Claim This Template — $249
            </a>
            <a href={data.cta_scratch_url} className={`${SCRATCH_CTA} max-md:text-center`}>
              Try a Free Scratch Ticket
            </a>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4">
          <div className="w-full bg-[var(--surface-elevated)] border border-border-subtle rounded-[14px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <iframe
              src={data.template_preview_url}
              className="w-full h-[600px] border-0 block bg-white max-md:h-[460px]"
              title="Template preview"
              loading="lazy"
            />
          </div>
          <p className="text-text-muted text-[0.95rem] text-center">
            This is one of 210+ ready-made templates. Yours to claim and customize.
          </p>
        </section>

        <section className="grid grid-cols-3 gap-5 max-md:grid-cols-1">
          {[
            { t: 'Live in minutes', d: 'No design skills needed. Claim it and the template is yours to customize.' },
            { t: '$249 one-time', d: 'No monthly fees for the template. Hosting starts at $14/mo after year one.' },
            { t: 'Built for tax pros', d: `Templates designed for ${data.practice_type} practices like yours.` },
          ].map(v => (
            <div key={v.t} className="bg-surface-card border border-border-subtle rounded-[14px] py-7 px-6 flex flex-col gap-2.5">
              <h3 className="font-sora font-bold text-[1.15rem] text-brand-primary">{v.t}</h3>
              <p className="text-text-muted text-[0.95rem] leading-snug">{v.d}</p>
            </div>
          ))}
        </section>

        <section className="flex flex-col items-center gap-6 text-center">
          <h2 className={SECTION_TITLE}>How it works</h2>
          <ol className="list-none flex flex-col gap-4 text-left bg-surface-card border border-border-subtle rounded-[14px] py-7 px-8 w-full max-w-[640px] [counter-reset:steps] max-md:py-6 max-md:px-5 [&>li]:relative [&>li]:pl-10 [&>li]:text-white/[0.78] [&>li]:text-base [&>li]:leading-snug [&>li]:[counter-increment:steps] [&>li]:before:content-[counter(steps)] [&>li]:before:absolute [&>li]:before:left-0 [&>li]:before:top-0 [&>li]:before:w-[26px] [&>li]:before:h-[26px] [&>li]:before:bg-brand-primary/15 [&>li]:before:border [&>li]:before:border-brand-primary/40 [&>li]:before:rounded-full [&>li]:before:text-brand-primary [&>li]:before:font-sora [&>li]:before:text-[0.82rem] [&>li]:before:font-bold [&>li]:before:flex [&>li]:before:items-center [&>li]:before:justify-center">
            <li>Browse or claim the template above.</li>
            <li>Customize with your firm name, logo, and contact info.</li>
            <li>Go live — hosting starts at $14/mo after year one.</li>
          </ol>
        </section>

        <section className="flex flex-col items-center gap-4 text-center bg-surface-card border border-border-subtle rounded-[14px] py-10 px-6 max-md:py-8 max-md:px-5">
          <h2 className={SECTION_TITLE}>Not ready to commit?</h2>
          <p className="text-text-muted text-base leading-snug max-w-[540px]">
            Try a free scratch ticket — you might win a discount or free hosting.
          </p>
          <a href={data.cta_scratch_url} className={SCRATCH_CTA}>Get a Free Scratch Ticket</a>
        </section>

        <section className="flex flex-col items-center gap-4 text-center bg-surface-card border border-border-subtle rounded-[14px] py-10 px-6 max-md:py-8 max-md:px-5">
          <h2 className={SECTION_TITLE}>Want to see more options?</h2>
          <p className="text-text-muted text-base leading-snug max-w-[540px]">
            Book a 15-minute walkthrough and I&apos;ll show you the full catalog.
          </p>
          <a href={data.cta_booking_url} className={`${BOOKING_CTA} max-md:text-center`}>Book a Call</a>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-8 px-6 text-center text-text-muted text-[0.85rem]">
        <p>
          © Website Lotto ·{' '}
          <Link href="/" className="text-text-muted no-underline hover:text-brand-primary">websitelotto.virtuallaunch.pro</Link>
        </p>
      </footer>
    </div>
  );
}

function formatMoney(n: number): string {
  if (!isFinite(n)) return '$0';
  return '$' + Math.round(n).toLocaleString('en-US');
}

function formatInt(n: number): string {
  if (!isFinite(n)) return '0';
  return Math.round(n).toLocaleString('en-US');
}

function scoreColor(score: number): string {
  if (score >= 70) return 'var(--color-success)';
  if (score >= 40) return 'var(--color-warning)';
  return 'var(--color-error)';
}

interface LeakReportProps {
  data: AssetPageData;
  report: ConversionLeakReport;
  slug: string;
}

function LeakReport({ data, report, slug }: LeakReportProps) {
  const firm = data.firm ?? data.practice_type ?? 'your firm';
  const [visitors, setVisitors] = useState(report.metrics.visitors_month);
  const [currentRate, setCurrentRate] = useState(report.metrics.current_rate);
  const [avgValue, setAvgValue] = useState(report.metrics.avg_client_value);
  const [closeRate, setCloseRate] = useState(report.metrics.close_rate);

  const optimizedRate = report.metrics.optimized_rate ?? 3.6;

  const calc = useMemo(() => {
    const leadsCaptured = (visitors * currentRate) / 100;
    const leadsOptimized = (visitors * optimizedRate) / 100;
    const leadsLost = Math.max(0, leadsOptimized - leadsCaptured);
    const revenueLostMonth = leadsLost * (closeRate / 100) * avgValue;
    const revenueLostYear = revenueLostMonth * 12;
    const recoveryEstimate = leadsOptimized * (closeRate / 100) * avgValue * 12;
    return { leadsCaptured, leadsLost, revenueLostMonth, revenueLostYear, recoveryEstimate };
  }, [visitors, currentRate, optimizedRate, avgValue, closeRate]);

  const color = scoreColor(report.score);
  const circumference = 2 * Math.PI * 54;
  const progress = (report.score / 100) * circumference;

  return (
    <div className={PAGE}>
      <header className={HEADER}>
        <div className="max-w-[1100px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="font-sora font-extrabold text-[1.15rem] text-brand-primary [text-shadow:0_0_20px_rgba(168,85,247,0.4)] -tracking-[0.3px]">
            Conversion Leak Report
          </div>
          <span className="font-sora text-[0.75rem] font-bold uppercase tracking-[0.08em] px-3 py-1.5 rounded-full bg-brand-primary/[0.12] border border-brand-primary text-brand-primary">
            Tax professionals
          </span>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 pt-12 pb-20 flex flex-col gap-16 max-md:pt-8 max-md:px-4 max-md:pb-16 max-md:gap-12">
        <section className="flex flex-col gap-3.5 text-center items-center">
          <div className="font-sora text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-brand-primary">
            Prepared for {firm} — {data.city}, {data.state}
          </div>
          <h1 className="font-sora font-extrabold text-[clamp(2rem,5vw,3.2rem)] leading-[1.1] -tracking-[1px] max-w-[820px] text-text-primary">
            {data.headline}
          </h1>
          <p className="text-[clamp(1rem,2vw,1.15rem)] text-text-muted max-w-[680px] leading-snug">{data.subheadline}</p>
        </section>

        <section className="grid grid-cols-[auto_1fr] gap-8 items-center bg-surface-card border border-border-subtle rounded-xl p-8 max-[600px]:grid-cols-1 max-[600px]:text-center max-[600px]:p-6">
          <div className="flex flex-col items-center gap-2.5">
            <svg viewBox="0 0 120 120" width="160" height="160" className="block">
              <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${progress} ${circumference}`}
                transform="rotate(-90 60 60)"
              />
              <text
                x="60"
                y="66"
                textAnchor="middle"
                fontFamily="Sora, sans-serif"
                fontSize="32"
                fontWeight="800"
                fill={color}
              >
                {report.score}
              </text>
            </svg>
            <div className="font-sora text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-text-muted">Conversion score</div>
          </div>
          <div className="flex flex-col gap-2 max-[600px]:items-center">
            <div className="font-sora text-[0.85rem] font-semibold uppercase tracking-[0.08em] text-text-muted">Estimated revenue recovery / year</div>
            <div className="font-sora font-extrabold text-[clamp(2rem,4vw,3rem)] text-brand-primary leading-none [text-shadow:0_0_24px_rgba(168,85,247,0.35)]">
              {formatMoney(calc.recoveryEstimate)}
            </div>
            <div className="text-text-muted text-[0.9rem] leading-snug">
              If your site converted at the {optimizedRate}% industry benchmark.
            </div>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-4 max-[820px]:grid-cols-2 max-[600px]:grid-cols-1">
          <MetricCard label="Leads captured / month" value={formatInt(calc.leadsCaptured)} />
          <MetricCard label="Leads lost / month" value={formatInt(calc.leadsLost)} danger />
          <MetricCard label="Revenue lost / month" value={formatMoney(calc.revenueLostMonth)} danger />
          <MetricCard label="Revenue lost / year" value={formatMoney(calc.revenueLostYear)} danger />
        </section>

        <section className="flex flex-col gap-5">
          <h2 className={SECTION_HEADING}>Where the leaks are</h2>
          <div className="grid grid-cols-2 gap-4 max-[820px]:grid-cols-1">
            {report.leaks.map((leak, i) => (
              <div key={i} className="flex gap-3.5 bg-surface-card border border-border-subtle rounded-xl p-5">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.4)] text-[var(--color-error)] font-sora font-extrabold text-[1.1rem] flex items-center justify-center" aria-hidden="true">
                  !
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-sora font-bold text-[1.05rem] text-text-primary">{leak.title}</h3>
                  <p className="text-text-muted text-[0.92rem] leading-snug">{leak.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className={SECTION_HEADING}>Before vs After</h2>
          <div className="grid grid-cols-2 gap-5 max-[600px]:grid-cols-1">
            <div className="bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.3)] rounded-xl p-6 flex flex-col gap-3.5">
              <div className="font-sora text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[var(--color-error)]">Current</div>
              <h3 className="font-sora font-bold text-[1.2rem] text-text-primary leading-tight">{report.before_after.current_headline}</h3>
              <div className="flex flex-wrap gap-2">
                {report.before_after.current_problems.map((p, i) => (
                  <span
                    key={i}
                    className="font-sora text-[0.78rem] font-semibold px-3 py-1.5 rounded-full leading-tight bg-transparent border border-[rgba(239,68,68,0.4)] text-[var(--color-error)]"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-brand-primary/[0.08] border border-brand-primary rounded-xl p-6 flex flex-col gap-3.5">
              <div className="font-sora text-[0.75rem] font-bold uppercase tracking-[0.1em] text-brand-primary">Upgraded</div>
              <h3 className="font-sora font-bold text-[1.2rem] text-text-primary leading-tight">{report.before_after.upgraded_headline}</h3>
              <p className="text-text-muted text-[0.95rem] leading-snug">{report.before_after.upgraded_description}</p>
              <div className="flex flex-wrap gap-2">
                {report.before_after.upgraded_chips.map((c, i) => (
                  <span
                    key={i}
                    className="font-sora text-[0.78rem] font-semibold px-3 py-1.5 rounded-full leading-tight bg-brand-primary border border-brand-primary text-white"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-4 bg-surface-card border border-border-subtle rounded-xl p-8 max-[600px]:p-6">
          <h2 className={SECTION_HEADING}>Run your own numbers</h2>
          <p className="text-text-muted text-[0.92rem] leading-snug">
            Adjust any field — the leak estimate updates live. Optimized benchmark: {optimizedRate}%.
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2 max-[600px]:grid-cols-1">
            <CalcField label="Visitors / month" value={visitors} step={1} onChange={setVisitors} />
            <CalcField label="Current conversion rate (%)" value={currentRate} step={0.1} onChange={setCurrentRate} />
            <CalcField label="Avg client value ($)" value={avgValue} step={1} onChange={setAvgValue} />
            <CalcField label="Close rate (%)" value={closeRate} step={0.1} onChange={setCloseRate} />
          </div>
        </section>

        <Questionnaire slug={slug} data={data} />

        <section className="flex flex-col gap-3.5 items-center">
          <a href={data.cta_booking_url} className={BOOKING_CTA}>
            Talk through my numbers — 15 min call
          </a>
          <a href="https://websitelotto.virtuallaunch.pro" className={GHOST_CTA}>
            Browse tax professional templates
          </a>
        </section>
      </main>

      <footer className="border-t border-border-subtle py-8 px-6 text-center text-text-muted text-[0.85rem]">
        <p>
          Prepared for {firm} ·{' '}
          <Link href="/" className="text-text-muted no-underline hover:text-brand-primary">websitelotto.virtuallaunch.pro</Link>
        </p>
      </footer>
    </div>
  );
}

function MetricCard({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={`rounded-xl p-5 flex flex-col gap-2 ${
      danger
        ? 'bg-[rgba(239,68,68,0.12)] border border-[rgba(239,68,68,0.35)]'
        : 'bg-surface-card border border-border-subtle'
    }`}>
      <div className="font-sora text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-text-muted">{label}</div>
      <div className={`font-sora font-extrabold text-[1.75rem] leading-tight ${danger ? 'text-[var(--color-error)]' : 'text-text-primary'}`}>
        {value}
      </div>
    </div>
  );
}

function CalcField({
  label,
  value,
  step,
  onChange,
}: {
  label: string;
  value: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-sora text-[0.8rem] font-semibold uppercase tracking-[0.08em] text-text-muted">{label}</span>
      <input
        type="number"
        min={0}
        step={step}
        className="bg-[var(--surface-elevated)] border border-border-subtle rounded-lg px-3.5 py-3 text-text-primary font-sora text-base font-semibold transition-all focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]"
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </label>
  );
}

const SERVICE_OPTIONS = [
  'Tax Preparation',
  'Tax Resolution',
  'IRS Representation',
  'Bookkeeping',
  'Estate Planning',
  'Business Advisory',
  'Payroll Services',
];

interface ColorSwatch {
  id: string;
  label: string;
  primary: string;
  secondary: string;
}

const COLOR_SWATCHES: ColorSwatch[] = [
  { id: 'professional-blue', label: 'Professional Blue', primary: '#1d4ed8', secondary: '#f8fafc' }, // canonical: user-selectable brand swatches shown to the visitor (content, not page chrome)
  { id: 'modern-teal', label: 'Modern Teal', primary: '#0d9488', secondary: '#f0fdfa' }, // canonical: user-selectable brand swatches shown to the visitor (content, not page chrome)
  { id: 'classic-navy', label: 'Classic Navy', primary: '#1e3a5f', secondary: '#f8fafc' }, // canonical: user-selectable brand swatches shown to the visitor (content, not page chrome)
  { id: 'warm-charcoal', label: 'Warm Charcoal', primary: '#374151', secondary: '#f9fafb' }, // canonical: user-selectable brand swatches shown to the visitor (content, not page chrome)
];

const Q_INPUT = 'bg-[var(--surface-elevated)] border border-border-subtle rounded-lg px-3.5 py-3 text-text-primary font-sans text-base font-medium transition-all w-full focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_3px_rgba(168,85,247,0.18)]';
const Q_TEXTAREA = Q_INPUT + ' resize-y min-h-[100px]';
const Q_LABEL = 'font-sora text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-text-muted';
const Q_FIELD = 'flex flex-col gap-2';
const Q_SECTION = 'flex flex-col gap-6 bg-surface-card border border-border-subtle rounded-[14px] p-9 backdrop-blur-md max-[720px]:py-6 max-[720px]:px-5';
const SUBMIT_CTA = 'w-full px-8 py-[18px] bg-brand-primary text-white font-sora font-bold text-[1.05rem] border-0 rounded-[10px] cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 hover:enabled:shadow-[0_0_40px_rgba(168,85,247,0.6)] disabled:opacity-60 disabled:cursor-not-allowed';
const CUSTOM_COLOR_PLACEHOLDER = 'e.g., #1d4ed8 or describe your brand colors'; // canonical: hex example shown in placeholder copy is user input guidance, not styling

interface QuestionnaireProps {
  slug: string;
  data: AssetPageData;
}

function Questionnaire({ slug, data }: QuestionnaireProps) {
  const [firmName, setFirmName] = useState(data.firm ?? '');
  const [services, setServices] = useState<Set<string>>(new Set());
  const [otherChecked, setOtherChecked] = useState(false);
  const [otherService, setOtherService] = useState('');
  const [targetClients, setTargetClients] = useState('');
  const [colorScheme, setColorScheme] = useState<string>('professional-blue');
  const [customColor, setCustomColor] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedReady, setGeneratedReady] = useState(false);

  const toggleService = (svc: string) => {
    setServices((prev) => {
      const next = new Set(prev);
      if (next.has(svc)) next.delete(svc);
      else next.add(svc);
      return next;
    });
  };

  useEffect(() => {
    if (!submitted || generatedReady) return;
    let cancelled = false;
    const interval = setInterval(async () => {
      const result = await getSiteRequestStatus(slug);
      if (cancelled) return;
      if (result.ok && result.status === 'generated') {
        setGeneratedReady(true);
        clearInterval(interval);
      }
    }, 30000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [submitted, generatedReady, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firmName.trim()) {
      setError('Please enter your firm name.');
      return;
    }
    const allServices = Array.from(services);
    if (otherChecked && otherService.trim()) {
      allServices.push(otherService.trim());
    }
    if (allServices.length === 0) {
      setError('Please select at least one service.');
      return;
    }

    setSubmitting(true);
    const colorValue =
      colorScheme === 'custom'
        ? `Custom: ${customColor}`
        : COLOR_SWATCHES.find((c) => c.id === colorScheme)?.label ?? colorScheme;

    const payload = {
      slug,
      firm_name: firmName.trim(),
      credential: '',
      city: data.city ?? '',
      state: data.state ?? '',
      services: allServices,
      target_clients: targetClients.trim(),
      color_scheme: colorValue,
      logo_url: logoUrl.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website_url: '',
      additional_notes: notes.trim(),
    };

    const result = await submitSiteRequest(payload);
    setSubmitting(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  if (submitted) {
    return (
      <section className={Q_SECTION}>
        <div className="flex flex-col items-center gap-4 text-center p-4">
          {generatedReady ? (
            <>
              <h2 className="font-sora font-extrabold text-[clamp(1.6rem,3vw,2.2rem)] text-brand-primary [text-shadow:0_0_24px_rgba(168,85,247,0.35)] -tracking-[0.5px]">
                Your homepage is ready.
              </h2>
              <p className="text-text-muted text-[1.05rem] leading-relaxed max-w-[600px]">
                We&apos;ve generated a custom homepage for {firmName}. Preview it below or open in a new tab.
              </p>
              <a
                href={getCustomSiteUrl(slug)}
                target="_blank"
                rel="noopener noreferrer"
                className={PRIMARY_CTA}
              >
                Preview your new homepage
              </a>
              <div className="w-full bg-[var(--surface-elevated)] border border-border-subtle rounded-xl overflow-hidden mt-6">
                <iframe
                  src={getCustomSiteUrl(slug)}
                  className="w-full h-[600px] border-0 block bg-white max-[720px]:h-[460px]"
                  title="Your custom homepage"
                  loading="lazy"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="font-sora font-extrabold text-[clamp(1.6rem,3vw,2.2rem)] text-brand-primary [text-shadow:0_0_24px_rgba(168,85,247,0.35)] -tracking-[0.5px]">
                Your homepage is being built.
              </h2>
              <p className="text-text-muted text-[1.05rem] leading-relaxed max-w-[600px]">
                We are generating a custom homepage for {firmName}.
                {email
                  ? ` You will receive an email at ${email} when it is ready`
                  : " We'll let you know when it is ready"}
                {' '}— typically within 24 hours.
              </p>
              <a href="https://websitelotto.virtuallaunch.pro" className={GHOST_CTA}>
                In the meantime, browse 210+ templates
              </a>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={Q_SECTION}>
      <div className="flex flex-col gap-2.5 text-center items-center">
        <h2 className={SECTION_HEADING}>Fix these leaks. Your upgraded homepage ships in 24 hours.</h2>
        <p className="text-text-muted text-base leading-snug max-w-[640px]">
          Answer a few questions and we will generate a custom homepage for your practice — free, no commitment.
        </p>
      </div>

      <form className="flex flex-col gap-[22px]" onSubmit={handleSubmit}>
        <label className={Q_FIELD}>
          <span className={Q_LABEL}>Firm name</span>
          <input
            type="text"
            className={Q_INPUT}
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="e.g., Acme Tax & Accounting"
          />
        </label>

        <div className={Q_FIELD}>
          <span className={Q_LABEL}>What services do you offer?</span>
          <div className="grid grid-cols-2 gap-2.5 max-[720px]:grid-cols-1">
            {SERVICE_OPTIONS.map((svc) => (
              <CheckboxItem key={svc} label={svc} checked={services.has(svc)} onToggle={() => toggleService(svc)} />
            ))}
            <CheckboxItem label="Other" checked={otherChecked} onToggle={() => setOtherChecked(v => !v)} />
          </div>
          {otherChecked && (
            <input
              type="text"
              className={Q_INPUT}
              value={otherService}
              onChange={(e) => setOtherService(e.target.value)}
              placeholder="Tell us what other services you offer"
              style={{ marginTop: 10 }}
            />
          )}
        </div>

        <label className={Q_FIELD}>
          <span className={Q_LABEL}>Who are your ideal clients?</span>
          <input
            type="text"
            className={Q_INPUT}
            value={targetClients}
            onChange={(e) => setTargetClients(e.target.value)}
            placeholder="e.g., small business owners in Texas, high-net-worth individuals"
          />
        </label>

        <div className={Q_FIELD}>
          <span className={Q_LABEL}>Preferred color scheme</span>
          <div className="grid grid-cols-5 gap-3 max-[720px]:grid-cols-2">
            {COLOR_SWATCHES.map((sw) => (
              <SwatchButton
                key={sw.id}
                active={colorScheme === sw.id}
                label={sw.label}
                onClick={() => setColorScheme(sw.id)}
                style={{
                  background: `linear-gradient(135deg, ${sw.primary} 0%, ${sw.primary} 50%, ${sw.secondary} 50%, ${sw.secondary} 100%)`,
                }}
              />
            ))}
            <CustomSwatchButton active={colorScheme === 'custom'} onClick={() => setColorScheme('custom')} />
          </div>
          {colorScheme === 'custom' && (
            <input
              type="text"
              className={Q_INPUT}
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              placeholder={CUSTOM_COLOR_PLACEHOLDER}
              style={{ marginTop: 10 }}
            />
          )}
        </div>

        <label className={Q_FIELD}>
          <span className={Q_LABEL}>Your logo</span>
          <input
            type="url"
            className={Q_INPUT}
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://yoursite.com/logo.png (optional)"
          />
        </label>

        <div className="grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
          <label className={Q_FIELD}>
            <span className={Q_LABEL}>Phone number</span>
            <input
              type="tel"
              className={Q_INPUT}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 123-4567"
            />
          </label>
          <label className={Q_FIELD}>
            <span className={Q_LABEL}>Email</span>
            <input
              type="email"
              className={Q_INPUT}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourfirm.com"
            />
          </label>
        </div>

        <label className={Q_FIELD}>
          <span className={Q_LABEL}>Anything else we should know?</span>
          <textarea
            className={Q_TEXTAREA}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional — anything that should shape your homepage"
            rows={4}
          />
        </label>

        {error && (
          <div className="bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.4)] rounded-lg px-4 py-3 text-[var(--color-error)] font-sans text-[0.92rem]">
            {error}
          </div>
        )}

        <button type="submit" className={SUBMIT_CTA} disabled={submitting}>
          {submitting ? 'Submitting…' : 'Generate My Upgraded Homepage'}
        </button>
      </form>
    </section>
  );
}

function CheckboxItem({ label, checked, onToggle }: { label: string; checked: boolean; onToggle: () => void }) {
  return (
    <label
      className={`flex items-center gap-3 px-3.5 py-3 bg-[var(--surface-elevated)] border rounded-lg text-text-primary font-sans text-[0.95rem] font-medium cursor-pointer transition-all ${
        checked
          ? 'border-brand-primary bg-brand-primary/[0.08]'
          : 'border-border-subtle hover:border-brand-primary/40'
      }`}
    >
      <input type="checkbox" className="absolute opacity-0 pointer-events-none" checked={checked} onChange={onToggle} />
      <span
        className={`relative w-[18px] h-[18px] rounded flex-shrink-0 transition-all ${
          checked
            ? 'bg-brand-primary border-[1.5px] border-brand-primary shadow-[0_0_12px_rgba(168,85,247,0.5)] after:content-[""] after:absolute after:left-[5px] after:top-px after:w-[5px] after:h-2.5 after:border-solid after:border-white after:border-[0_2px_2px_0] after:rotate-45'
            : 'border-[1.5px] border-white/30 bg-transparent'
        }`}
        aria-hidden="true"
      />
      <span>{label}</span>
    </label>
  );
}

function SwatchButton({
  active,
  label,
  onClick,
  style,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  style: React.CSSProperties;
}) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-2 px-2 py-3 bg-[var(--surface-elevated)] border rounded-[10px] font-sans text-[0.78rem] font-medium cursor-pointer transition-all ${
        active
          ? 'border-brand-primary bg-brand-primary/[0.08] shadow-[0_0_0_2px_rgba(168,85,247,0.25)] text-text-primary'
          : 'border-border-subtle text-text-primary hover:border-brand-primary/40 hover:-translate-y-px'
      }`}
      onClick={onClick}
      aria-label={label}
    >
      <span
        className={`w-11 h-11 rounded-full block border-2 ${
          active ? 'border-brand-primary shadow-[0_0_16px_rgba(168,85,247,0.4)]' : 'border-white/15'
        }`}
        style={style}
      />
      <span className={`text-center leading-tight ${active ? 'text-text-primary' : 'text-text-muted'}`}>{label}</span>
    </button>
  );
}

function CustomSwatchButton({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center gap-2 px-2 py-3 bg-[var(--surface-elevated)] border rounded-[10px] font-sans text-[0.78rem] font-medium cursor-pointer transition-all ${
        active
          ? 'border-brand-primary bg-brand-primary/[0.08] shadow-[0_0_0_2px_rgba(168,85,247,0.25)]'
          : 'border-border-subtle hover:border-brand-primary/40 hover:-translate-y-px'
      }`}
      onClick={onClick}
      aria-label="Match my current branding"
    >
      <span
        className={`w-11 h-11 rounded-full block border-2 bg-white/[0.06] flex items-center justify-center text-text-muted font-sora font-extrabold text-[1.2rem] ${
          active ? 'border-brand-primary shadow-[0_0_16px_rgba(168,85,247,0.4)]' : 'border-white/15'
        }`}
      >
        ?
      </span>
      <span className={`text-center leading-tight ${active ? 'text-text-primary' : 'text-text-muted'}`}>Match my branding</span>
    </button>
  );
}
