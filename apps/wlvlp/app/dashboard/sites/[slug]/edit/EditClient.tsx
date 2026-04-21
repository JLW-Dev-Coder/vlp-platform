'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import catalog from '@/wlvlp-catalog.json';
import {
  getSiteData,
  saveSiteData,
  uploadLogo,
  connectDomain,
  getSiteDomain,
  DomainConnectResponse,
} from '@/lib/api';

const FIELD = 'flex flex-col gap-1.5';
const LABEL = 'text-[0.82rem] font-semibold text-white/75';
const INPUT =
  'bg-black/40 border border-white/[0.12] rounded-lg px-3 py-2.5 text-white text-[0.9rem] transition-colors focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_2px_rgba(0,212,255,0.15)] placeholder:text-white/30';
const HINT = 'text-[0.75rem] text-white/40 m-0';
const SAVE_BTN =
  'px-7 py-3 bg-brand-primary text-white font-bold text-[0.9rem] border-0 rounded-lg cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed';
const SECTION_CARD =
  'flex flex-col gap-[18px] bg-white/[0.02] border border-white/[0.07] rounded-[14px] p-7';
const SECTION_TITLE = 'font-sora text-[1.15rem] font-bold text-white m-0';
const SECTION_SUB = 'text-white/55 text-[0.85rem] m-0 -mt-2';
const ERROR_BOX = 'bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.25)] rounded-lg px-4 py-3.5';
const ERROR_TITLE = 'text-[var(--color-error)] font-bold m-0 mb-1 text-[0.9rem]';
const ERROR_MSG = 'text-white/60 text-[0.85rem] m-0';

interface FormFields {
  business_name: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  logo_url: string;
  brand_color: string;
  about: string;
}

const EMPTY: FormFields = {
  business_name: '',
  tagline: '',
  phone: '',
  email: '',
  address: '',
  logo_url: '',
  brand_color: '',
  about: '',
};

function getTemplateTitle(slug: string): string {
  const sites = (catalog as { sites: { slug: string; title: string }[] }).sites;
  const found = sites.find((s) => s.slug === slug);
  if (found?.title) return found.title;
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function normalizeHex(input: string): string {
  const v = input.trim();
  if (!v) return '';
  const withHash = v.startsWith('#') ? v : `#${v}`;
  return withHash.toLowerCase();
}

function isValidHex(v: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(v);
}

export default function EditClient({ slug }: { slug: string }) {
  const templateTitle = useMemo(() => getTemplateTitle(slug), [slug]);

  const [values, setValues] = useState<FormFields>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [notOwner, setNotOwner] = useState(false);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    getSiteData(slug)
      .then((res) => {
        if (cancelled) return;
        const f = res.fields ?? {};
        setValues({
          business_name: f.business_name ?? '',
          tagline: f.tagline ?? '',
          phone: f.phone ?? '',
          email: f.email ?? '',
          address: f.address ?? '',
          logo_url: f.logo_url ?? '',
          brand_color: f.brand_color ?? '',
          about: f.about ?? '',
        });
      })
      .catch((e: Error & { status?: number; code?: string }) => {
        if (cancelled) return;
        if (e.status === 403 || e.code === 'UNAUTHORIZED' || e.code === 'not_owner') {
          setNotOwner(true);
        } else {
          setLoadError(e.message || 'Failed to load site data');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (!saveSuccess) return;
    const t = setTimeout(() => setSaveSuccess(false), 3500);
    return () => clearTimeout(t);
  }, [saveSuccess]);

  function setField<K extends keyof FormFields>(key: K, v: FormFields[K]) {
    setValues((prev) => ({ ...prev, [key]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      const fields: Record<string, string> = {};
      (Object.keys(values) as (keyof FormFields)[]).forEach((k) => {
        const v = values[k];
        if (v && v.trim() !== '') fields[k] = v.trim();
      });
      await saveSiteData(slug, fields);
      setSaveSuccess(true);
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 max-w-[820px] w-full mx-auto pt-10 px-6 pb-15">
      <header className="mb-7">
        <Link
          href="/dashboard/sites"
          className="inline-block text-[0.85rem] text-white/50 no-underline mb-4 hover:text-brand-primary"
        >
          ← Back to My Sites
        </Link>
        <h1 className="font-sora text-3xl font-extrabold text-white m-0 mb-2 -tracking-[0.5px]">Edit Site</h1>
        <p className="text-white/55 text-[0.95rem] m-0">
          Customize <span className="text-white font-semibold">{templateTitle}</span> with your brand.
        </p>
      </header>

      {loading && (
        <div className="flex flex-col gap-3">
          <div className="h-32 bg-white/[0.03] border border-white/[0.06] rounded-[14px] animate-pulse" />
          <div className="h-48 bg-white/[0.03] border border-white/[0.06] rounded-[14px] animate-pulse" />
          <div className="h-40 bg-white/[0.03] border border-white/[0.06] rounded-[14px] animate-pulse" />
        </div>
      )}

      {!loading && notOwner && (
        <div className={ERROR_BOX}>
          <p className={ERROR_TITLE}>You don&apos;t own this site</p>
          <p className={ERROR_MSG}>
            This template isn&apos;t linked to your account. If you recently purchased it, try refreshing — or head
            back to <Link href="/dashboard/sites" className="text-brand-primary underline">My Sites</Link>.
          </p>
        </div>
      )}

      {!loading && !notOwner && loadError && (
        <div className={ERROR_BOX}>
          <p className={ERROR_TITLE}>Couldn&apos;t load site data</p>
          <p className={ERROR_MSG}>{loadError}</p>
        </div>
      )}

      {!loading && !notOwner && !loadError && (
        <form className="flex flex-col gap-6" onSubmit={handleSave}>
          <section className={SECTION_CARD}>
            <div>
              <h2 className={SECTION_TITLE}>Business Info</h2>
            </div>
            <p className={SECTION_SUB}>How your business is introduced across the site.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              <div className={FIELD}>
                <label className={LABEL} htmlFor="business_name">Business Name</label>
                <input
                  id="business_name"
                  type="text"
                  className={INPUT}
                  value={values.business_name}
                  onChange={(e) => setField('business_name', e.target.value)}
                  placeholder="Acme Co."
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL} htmlFor="tagline">Tagline</label>
                <input
                  id="tagline"
                  type="text"
                  className={INPUT}
                  value={values.tagline}
                  onChange={(e) => setField('tagline', e.target.value)}
                  placeholder="A short subtitle"
                />
              </div>
            </div>

            <div className={FIELD}>
              <label className={LABEL} htmlFor="about">About / Description</label>
              <textarea
                id="about"
                rows={5}
                className={INPUT}
                value={values.about}
                onChange={(e) => setField('about', e.target.value)}
                placeholder="Tell visitors what you do and why it matters."
              />
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className={SECTION_TITLE}>Contact</h2>
            <p className={SECTION_SUB}>Where customers reach you.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              <div className={FIELD}>
                <label className={LABEL} htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  type="tel"
                  className={INPUT}
                  value={values.phone}
                  onChange={(e) => setField('phone', e.target.value)}
                  placeholder="(555) 555-1234"
                />
              </div>
              <div className={FIELD}>
                <label className={LABEL} htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={INPUT}
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  placeholder="hello@yourbusiness.com"
                />
              </div>
            </div>

            <div className={FIELD}>
              <label className={LABEL} htmlFor="address">Address</label>
              <textarea
                id="address"
                rows={3}
                className={INPUT}
                value={values.address}
                onChange={(e) => setField('address', e.target.value)}
                placeholder="123 Main St, Suite 200, City, ST 00000"
              />
            </div>
          </section>

          <section className={SECTION_CARD}>
            <h2 className={SECTION_TITLE}>Branding</h2>
            <p className={SECTION_SUB}>Logo and color to match your brand.</p>

            <LogoUploader
              slug={slug}
              logoUrl={values.logo_url}
              onChange={(url) => setField('logo_url', url)}
            />

            <ColorPickerRow
              value={values.brand_color}
              onChange={(v) => setField('brand_color', v)}
            />
          </section>

          {saveSuccess && (
            <div className="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.3)] text-[var(--color-success)] px-4 py-3 rounded-lg text-[0.88rem] font-semibold">
              Changes saved.
            </div>
          )}
          {saveError && (
            <div className={ERROR_BOX}>
              <p className={ERROR_TITLE}>Save failed</p>
              <p className={ERROR_MSG}>{saveError}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button type="submit" className={SAVE_BTN} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {!loading && !notOwner && !loadError && <DomainSection slug={slug} />}
    </main>
  );
}

function LogoUploader({
  slug,
  logoUrl,
  onChange,
}: {
  slug: string;
  logoUrl: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setUploading(true);
    setError('');
    try {
      const { url } = await uploadLogo(slug, file);
      onChange(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={FIELD}>
      <label className={LABEL}>Logo</label>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="w-20 h-20 rounded-lg bg-black/40 border border-white/[0.12] flex items-center justify-center overflow-hidden flex-shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-white/30 text-[0.7rem] uppercase tracking-wider">No logo</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="px-4 py-2 bg-white/[0.06] border border-white/[0.12] rounded-lg text-white text-[0.85rem] font-semibold cursor-pointer transition-all hover:enabled:bg-white/[0.1] hover:enabled:border-brand-primary/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading…' : logoUrl ? 'Change Logo' : 'Upload Logo'}
          </button>
          {logoUrl && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="text-[0.75rem] text-white/45 hover:text-[var(--color-error)] self-start cursor-pointer bg-transparent border-0 p-0"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {error && <p className="text-[var(--color-error)] text-[0.8rem] m-0">{error}</p>}
      <p className={HINT}>PNG, JPG, or SVG. Square images work best.</p>
    </div>
  );
}

function ColorPickerRow({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const colorForPicker = isValidHex(value) ? value : '#00D4FF';
  const [hexText, setHexText] = useState(value);

  useEffect(() => {
    setHexText(value);
  }, [value]);

  return (
    <div className={FIELD}>
      <label className={LABEL} htmlFor="brand_color">Primary Brand Color</label>
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className="w-11 h-11 rounded-lg border border-white/[0.12] flex-shrink-0"
          style={{ background: isValidHex(value) ? value : 'rgba(255,255,255,0.04)' }}
          aria-hidden
        />
        <input
          id="brand_color"
          type="color"
          value={colorForPicker}
          onChange={(e) => {
            const v = e.target.value.toLowerCase();
            setHexText(v);
            onChange(v);
          }}
          className="w-11 h-11 rounded-lg bg-black/40 border border-white/[0.12] cursor-pointer p-0"
        />
        <input
          type="text"
          className={`${INPUT} flex-1 min-w-[140px] font-mono uppercase`}
          value={hexText}
          onChange={(e) => setHexText(e.target.value)}
          onBlur={() => {
            const normalized = normalizeHex(hexText);
            if (!normalized) {
              onChange('');
              setHexText('');
              return;
            }
            if (isValidHex(normalized)) {
              onChange(normalized);
              setHexText(normalized);
            } else {
              setHexText(value);
            }
          }}
          placeholder="#00D4FF"
          maxLength={7}
        />
      </div>
      <p className={HINT}>Use a 6-digit hex like #00D4FF.</p>
    </div>
  );
}

function DomainSection({ slug }: { slug: string }) {
  const [domain, setDomain] = useState('');
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  const [status, setStatus] = useState<'pending' | 'verified' | 'failed' | null>(null);
  const [instructions, setInstructions] = useState<DomainConnectResponse['instructions'] | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getSiteDomain(slug)
      .then((info) => {
        if (cancelled) return;
        if (info.domain) {
          setCurrentDomain(info.domain);
          setStatus(info.status ?? 'pending');
          if (info.instructions) setInstructions(info.instructions);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    if (!domain.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await connectDomain(slug, domain.trim());
      setCurrentDomain(res.domain);
      setStatus(res.status);
      setInstructions(res.instructions ?? null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to connect domain');
    } finally {
      setSubmitting(false);
    }
  }

  const statusBadge =
    status === 'verified'
      ? 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]'
      : status === 'failed'
      ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] border border-[rgba(239,68,68,0.3)]'
      : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30';

  return (
    <section className="mt-7 bg-white/[0.02] border border-white/[0.07] rounded-[14px] p-7">
      <h2 className="font-sora text-[1.25rem] font-bold text-white m-0 mb-1.5">Custom Domain</h2>
      <p className="text-white/55 text-[0.88rem] m-0 mb-5">
        Connect your own domain to host this site at your own URL.
      </p>

      {currentDomain && (
        <div className="bg-brand-primary/[0.06] border border-brand-primary/25 rounded-[10px] px-[18px] py-3.5 mb-[18px]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1">
                Connected domain
              </div>
              <div className="font-sora text-base font-bold text-brand-primary">{currentDomain}</div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[0.72rem] font-bold uppercase tracking-wider ${statusBadge}`}>
              {status === 'verified' ? 'Verified' : status === 'failed' ? 'Failed' : 'Pending'}
            </span>
          </div>
        </div>
      )}

      {instructions && instructions.length > 0 && (
        <div className="bg-black/35 border border-white/[0.08] rounded-[10px] px-[18px] py-4 mb-[18px]">
          <p className="text-[0.85rem] font-semibold text-white/80 m-0 mb-3">
            Add these DNS records at your domain registrar:
          </p>
          <div className="flex flex-col gap-1.5 font-mono text-[0.78rem]">
            <div className="grid grid-cols-[70px_1fr_2fr] gap-3 text-white/40 uppercase text-[0.7rem] font-bold tracking-wider pb-1.5 border-b border-white/[0.08]">
              <span>Type</span>
              <span>Name</span>
              <span>Value</span>
            </div>
            {instructions.map((rec, i) => (
              <div key={i} className="grid grid-cols-[70px_1fr_2fr] gap-3 text-white/85 py-1">
                <span>{rec.type}</span>
                <span>{rec.name}</span>
                <span className="break-all text-brand-primary">{rec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <form className="flex flex-col gap-[18px]" onSubmit={handleConnect}>
        <div className={FIELD}>
          <label className={LABEL} htmlFor="custom-domain">
            {currentDomain ? 'Change domain' : 'Domain name'}
          </label>
          <input
            id="custom-domain"
            type="text"
            className={INPUT}
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <p className={HINT}>Enter your domain without https:// or www.</p>
        </div>

        {error && (
          <div className={ERROR_BOX}>
            <p className={ERROR_TITLE}>Couldn&apos;t connect domain</p>
            <p className={ERROR_MSG}>{error}</p>
          </div>
        )}

        <div className="flex justify-end mt-2">
          <button type="submit" className={SAVE_BTN} disabled={submitting || !domain.trim()}>
            {submitting ? 'Connecting…' : 'Connect Domain'}
          </button>
        </div>
      </form>
    </section>
  );
}
