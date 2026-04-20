'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import { getBuyerDashboard, BuyerDashboard, updateConfig, uploadLogo } from '@/lib/api';

const PAGE = 'min-h-screen flex items-center justify-center py-10 px-4';
const CARD = 'w-full max-w-[520px] bg-white/[0.03] border border-white/[0.08] rounded-2xl py-10 px-9 max-[540px]:py-7 max-[540px]:px-5';
const TITLE = 'font-sora text-[1.55rem] font-bold text-white leading-tight';
const FIELD = 'flex flex-col gap-1.5';
const LABEL = 'text-[0.85rem] font-semibold text-white/75';
const OPTIONAL = 'font-normal text-white/[0.35] text-[0.8rem]';
const INPUT = 'px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.12] rounded-lg text-white text-[0.95rem] outline-none transition-colors focus:border-brand-primary/50 focus:bg-brand-primary/[0.04] placeholder:text-white/25';
const TEXTAREA = INPUT + ' resize-y min-h-[80px]';
const CHAR_COUNT = 'text-[0.75rem] text-white/30 text-right mt-0.5';
const NEXT_BTN = 'px-7 py-2.5 bg-brand-primary border-0 rounded-lg text-white text-[0.9rem] font-bold cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed';
const BACK_BTN = 'px-5 py-2.5 bg-transparent border border-white/[0.14] rounded-lg text-white/60 text-[0.9rem] font-medium cursor-pointer transition-all hover:bg-white/5 hover:text-white/90';

const COLOR_PLACEHOLDER = '#FF6B00'; // canonical: hex example shown to user as input format guidance, not page styling
const COLOR_LABEL_HINT = '(optional, hex e.g. #FF6B00)'; // canonical: hex example in label copy is user input guidance, not page styling

export default function OnboardingPage() {
  return (
    <AuthGuard>
      {(session) => <OnboardingWizard accountId={session.account_id} />}
    </AuthGuard>
  );
}

function OnboardingWizard({ accountId }: { accountId: string }) {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<BuyerDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);

  const [siteName, setSiteName] = useState('');
  const [tagline, setTagline] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  const fileRef = useRef<HTMLInputElement>(null);
  const [logoUrl, setLogoUrl] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [uploading, setUploading] = useState(false);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getBuyerDashboard(accountId)
      .then((d) => {
        if (!d.template) {
          router.replace('/');
          return;
        }
        setDashboard(d);
        setSiteName(d.site_config.site_name ?? d.template.title);
        setTagline(d.site_config.tagline ?? '');
        setWelcomeMessage(d.site_config.welcome_message ?? '');
        setLogoUrl(d.site_config.logo_url ?? '');
        setPrimaryColor(d.site_config.primary_color ?? '');
        setPhone(d.site_config.phone ?? '');
        setEmail(d.site_config.email ?? '');
        setAddress(d.site_config.address ?? '');
      })
      .catch(() => router.replace('/'))
      .finally(() => setLoading(false));
  }, [accountId, router]);

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !dashboard) return;
    setUploading(true);
    try {
      const res = await uploadLogo(dashboard.template.slug, file);
      setLogoUrl(res.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleFinish(e: React.FormEvent) {
    e.preventDefault();
    if (!dashboard) return;
    setSaving(true);
    try {
      const config: Record<string, string> = {
        site_name: siteName,
        tagline,
        welcome_message: welcomeMessage,
        primary_color: primaryColor,
        phone,
        email,
        address,
      };
      if (logoUrl) config.logo_url = logoUrl;
      await updateConfig(dashboard.template.slug, config);
      router.push('/dashboard');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-bg">
        <span
          className="block w-8 h-8 border-[3px] border-brand-primary/20 border-t-brand-primary rounded-full motion-safe:animate-[spin_0.7s_linear_infinite]"
        />
      </div>
    );
  }
  if (!dashboard) return null;

  return (
    <div className={PAGE}>
      <div className={CARD}>
        <div className="mb-8">
          <p className="text-[0.78rem] font-semibold tracking-widest uppercase text-brand-primary mb-2.5">Step {step} of 3</p>
          <div className="h-[3px] bg-white/[0.08] rounded-sm mb-6 overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-sm transition-[width] duration-300 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <h1 className={TITLE}>
            {step === 1 && 'Set up your site identity'}
            {step === 2 && 'Add your branding'}
            {step === 3 && 'Add your contact info'}
          </h1>
        </div>

        {step === 1 && (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => { e.preventDefault(); setStep(2); }}
          >
            <div className={FIELD}>
              <label className={LABEL} htmlFor="site_name">Site Name</label>
              <input id="site_name" type="text" className={INPUT} value={siteName} onChange={(e) => setSiteName(e.target.value)} required />
            </div>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="tagline">
                Tagline <span className={OPTIONAL}>(optional)</span>
              </label>
              <input id="tagline" type="text" className={INPUT} value={tagline} maxLength={100} onChange={(e) => setTagline(e.target.value)} />
              <p className={CHAR_COUNT}>{tagline.length}/100</p>
            </div>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="welcome_message">
                Welcome Message <span className={OPTIONAL}>(optional)</span>
              </label>
              <textarea id="welcome_message" className={TEXTAREA} value={welcomeMessage} maxLength={300} rows={4} onChange={(e) => setWelcomeMessage(e.target.value)} />
              <p className={CHAR_COUNT}>{welcomeMessage.length}/300</p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button type="submit" className={NEXT_BTN}>Next →</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => { e.preventDefault(); setStep(3); }}
          >
            <div className={FIELD}>
              <label className={LABEL}>Logo <span className={OPTIONAL}>(optional)</span></label>
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt="Logo preview"
                  width={160}
                  height={80}
                  unoptimized
                  className="max-w-[160px] max-h-[80px] object-contain rounded-md bg-white/[0.05] p-2 border border-white/[0.08] h-auto w-auto"
                />
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                type="button"
                className="inline-flex items-center justify-center px-4 py-2 bg-white/[0.06] border border-white/[0.14] rounded-lg text-white/80 text-[0.88rem] font-medium cursor-pointer transition-all self-start hover:enabled:bg-white/10 hover:enabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : logoUrl ? 'Replace Logo' : 'Upload Logo'}
              </button>
            </div>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="primary_color">
                Primary Color <span className={OPTIONAL}>{COLOR_LABEL_HINT}</span>
              </label>
              <input
                id="primary_color"
                type="text"
                className={INPUT}
                value={primaryColor}
                placeholder={COLOR_PLACEHOLDER}
                pattern="^#[0-9A-Fa-f]{6}$"
                onChange={(e) => setPrimaryColor(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button type="button" className={BACK_BTN} onClick={() => setStep(1)}>← Back</button>
              <button type="submit" className={NEXT_BTN}>Next →</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form className="flex flex-col gap-5" onSubmit={handleFinish}>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="phone">Phone Number</label>
              <input id="phone" type="tel" className={INPUT} value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="contact_email">Email Address</label>
              <input id="contact_email" type="email" className={INPUT} value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={FIELD}>
              <label className={LABEL} htmlFor="address">
                Business Address <span className={OPTIONAL}>(optional)</span>
              </label>
              <textarea id="address" className={TEXTAREA} value={address} rows={3} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="flex items-center justify-end gap-3 mt-2">
              <button type="button" className={BACK_BTN} onClick={() => setStep(2)}>← Back</button>
              <button type="submit" className={NEXT_BTN} disabled={saving}>
                {saving ? 'Saving…' : 'Launch My Site →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
