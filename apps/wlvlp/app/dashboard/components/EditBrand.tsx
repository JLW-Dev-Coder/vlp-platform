'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { updateConfig, uploadLogo } from '@/lib/api';
import { useBuyer } from '@/lib/account-context';

const PANEL = 'bg-white/[0.02] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5';
const PANEL_TITLE = 'font-sora text-[1.3rem] font-bold text-brand-primary -tracking-[0.3px] m-0';
const FIELD = 'flex flex-col gap-1.5';
const LABEL = 'text-[0.82rem] font-semibold text-white/55 uppercase tracking-wider';
const INPUT = 'bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-[0.9rem] outline-none transition-colors focus:border-brand-primary/45 placeholder:text-white/25 w-full';
const SAVE_BTN = 'px-7 py-[11px] bg-brand-primary/[0.12] border border-brand-primary/40 rounded-lg text-brand-primary font-bold text-[0.9rem] cursor-pointer transition-all w-fit hover:enabled:bg-brand-primary/20 hover:enabled:border-brand-primary disabled:opacity-60 disabled:cursor-not-allowed';

const COLOR_DEFAULTS = { bg: '#ffffff', action: '#000000', text: '#000000' }; // canonical: HTML color input defaults — user-editable site colors, not page chrome

export default function EditBrand() {
  const { data: dashboard, setData: setDashboard } = useBuyer();
  const fileRef = useRef<HTMLInputElement>(null);
  // canonical: HTML <input type="color"> requires hex defaults; these are user-data initial values, not page styling
  const [colors, setColors] = useState(() => ({
    background_color: dashboard?.site_config.background_color ?? COLOR_DEFAULTS.bg,
    primary_action_color: dashboard?.site_config.primary_action_color ?? COLOR_DEFAULTS.action,
    text_color: dashboard?.site_config.text_color ?? COLOR_DEFAULTS.text,
  }));
  const [logoUrl, setLogoUrl] = useState(dashboard?.site_config.logo_url ?? '');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!dashboard) return null;
  const { template, site_config } = dashboard;

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadLogo(template.slug, file);
      setLogoUrl(res.url);
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dashboard) return;
    setSaving(true);
    try {
      const config = { ...colors, logo_url: logoUrl };
      await updateConfig(template.slug, config);
      setDashboard({ ...dashboard, site_config: { ...site_config, ...config } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={PANEL}>
      <h2 className={PANEL_TITLE}>Edit Brand</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        <div className={FIELD}>
          <label className={LABEL}>Logo</label>
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Logo"
              width={180}
              height={80}
              unoptimized
              className="max-w-[180px] max-h-[80px] rounded-md object-contain bg-white/[0.06] p-1.5 h-auto w-auto"
            />
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          <button
            type="button"
            className="px-5 py-2.5 bg-white/[0.05] border border-white/[0.14] rounded-md text-white/70 text-[0.85rem] font-medium cursor-pointer transition-all w-fit hover:enabled:bg-white/[0.09] hover:enabled:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload Logo'}
          </button>
        </div>
        {([
          ['background_color', 'Background Color'],
          ['primary_action_color', 'Primary Action Color'],
          ['text_color', 'Text Color'],
        ] as const).map(([key, label]) => (
          <div key={key} className={FIELD}>
            <label className={LABEL}>{label}</label>
            <div className="flex gap-2.5 items-center">
              <input
                type="color"
                value={colors[key]}
                onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))}
                className="w-11 h-[38px] rounded-md border border-white/15 bg-transparent cursor-pointer p-0.5 flex-shrink-0"
              />
              <input
                type="text"
                value={colors[key]}
                onChange={e => setColors(c => ({ ...c, [key]: e.target.value }))}
                className={INPUT}
              />
            </div>
          </div>
        ))}
        <button type="submit" className={SAVE_BTN} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
