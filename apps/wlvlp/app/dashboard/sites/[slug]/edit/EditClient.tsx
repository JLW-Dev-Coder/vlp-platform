'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { connectDomain, getSiteDomain, DomainConnectResponse } from '@/lib/api';

interface SchemaField {
  id: string;
  type: 'text' | 'image' | 'tel' | string;
  label: string;
  default: string;
}

interface SiteSchema {
  slug: string;
  fields: SchemaField[];
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'https://api.virtuallaunch.pro';

const FIELD = 'flex flex-col gap-1.5';
const LABEL = 'text-[0.82rem] font-semibold text-white/75';
const INPUT = 'bg-black/40 border border-white/[0.12] rounded-lg px-3 py-2.5 text-white text-[0.9rem] transition-colors focus:outline-none focus:border-brand-primary focus:shadow-[0_0_0_2px_rgba(168,85,247,0.15)] placeholder:text-white/30';
const HINT = 'text-[0.75rem] text-white/40 m-0';
const SAVE_BTN = 'px-7 py-3 bg-brand-primary text-white font-bold text-[0.9rem] border-0 rounded-lg cursor-pointer transition-all shadow-brand hover:enabled:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed';
const ERROR_BOX = 'bg-[rgba(239,68,68,0.06)] border border-[rgba(239,68,68,0.25)] rounded-lg px-4 py-3.5';
const ERROR_TITLE = 'text-[var(--color-error)] font-bold m-0 mb-1 text-[0.9rem]';
const ERROR_MSG = 'text-white/60 text-[0.85rem] m-0';

export default function EditClient({ slug }: { slug: string }) {
  const [schema, setSchema] = useState<SiteSchema | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    fetch(`/sites/${slug}/schema.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`Schema ${r.status}`);
        return r.json() as Promise<SiteSchema>;
      })
      .then((data) => {
        if (cancelled) return;
        setSchema(data);
        const initial: Record<string, string> = {};
        for (const f of data.fields) initial[f.id] = '';
        setValues(initial);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setLoadError(e instanceof Error ? e.message : 'Failed to load schema');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  function setField(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!schema) return;
    setSaving(true);
    setSaveState('idle');
    setSaveError('');
    try {
      const fields: Record<string, string> = {};
      for (const f of schema.fields) {
        const v = values[f.id];
        if (v && v.trim() !== '') fields[f.id] = v;
      }
      const res = await fetch(`${API_BASE}/v1/wlvlp/sites/${slug}/data`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setSaveState('success');
    } catch (err: unknown) {
      setSaveState('error');
      setSaveError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 max-w-[760px] w-full mx-auto pt-10 px-6 pb-15">
      <header className="mb-7">
        <Link href="/dashboard/sites" className="inline-block text-[0.85rem] text-white/50 no-underline mb-4 hover:text-brand-primary">← Back to My Sites</Link>
        <h1 className="font-sora text-3xl font-extrabold text-white m-0 mb-1.5 -tracking-[0.5px]">Edit Site</h1>
        <p className="text-white/50 text-[0.9rem] m-0 font-mono">{slug}</p>
      </header>

      {loading && <div className="flex justify-center py-20"><span className="spinner" /></div>}

      {!loading && loadError && (
        <div className={ERROR_BOX}>
          <p className={ERROR_TITLE}>Couldn&apos;t load template schema</p>
          <p className={ERROR_MSG}>{loadError}</p>
        </div>
      )}

      {!loading && !loadError && schema && (
        <form className="flex flex-col gap-[18px] bg-white/[0.02] border border-white/[0.07] rounded-[14px] p-7" onSubmit={handleSave}>
          {schema.fields.map((f) => (
            <FieldRow
              key={f.id}
              field={f}
              value={values[f.id] ?? ''}
              onChange={(v) => setField(f.id, v)}
            />
          ))}

          {saveState === 'success' && (
            <div className="bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.3)] text-[var(--color-success)] px-4 py-3 rounded-lg text-[0.88rem] font-semibold">
              Saved successfully.
            </div>
          )}
          {saveState === 'error' && (
            <div className={ERROR_BOX}>
              <p className={ERROR_TITLE}>Save failed</p>
              <p className={ERROR_MSG}>{saveError}</p>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button type="submit" className={SAVE_BTN} disabled={saving}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}

      {!loading && !loadError && schema && <DomainSection slug={slug} />}
    </main>
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
    status === 'verified' ? 'bg-[rgba(34,197,94,0.12)] text-[var(--color-success)] border border-[rgba(34,197,94,0.3)]'
    : status === 'failed' ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-error)] border border-[rgba(239,68,68,0.3)]'
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
              <div className="text-[0.72rem] font-semibold text-white/50 uppercase tracking-wider mb-1">Connected domain</div>
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
          <button
            type="submit"
            className={SAVE_BTN}
            disabled={submitting || !domain.trim()}
          >
            {submitting ? 'Connecting…' : 'Connect Domain'}
          </button>
        </div>
      </form>
    </section>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: SchemaField;
  value: string;
  onChange: (v: string) => void;
}) {
  const inputType =
    field.type === 'tel' ? 'tel' :
    field.type === 'image' ? 'url' :
    'text';

  return (
    <div className={FIELD}>
      <label className={LABEL} htmlFor={field.id}>{field.label}</label>
      <input
        id={field.id}
        type={inputType}
        className={INPUT}
        value={value}
        placeholder={field.default}
        onChange={(e) => onChange(e.target.value)}
      />
      {field.type === 'image' && (
        <p className={HINT}>Paste an image URL. File upload coming soon.</p>
      )}
    </div>
  );
}
