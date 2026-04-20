'use client';
import { useState } from 'react';
import { updateConfig } from '@/lib/api';
import { useBuyer } from '@/lib/account-context';

const PANEL = 'bg-white/[0.02] border border-white/[0.07] rounded-2xl p-7 flex flex-col gap-5';
const PANEL_TITLE = 'font-sora text-[1.3rem] font-bold text-brand-primary -tracking-[0.3px] m-0';
const FIELD = 'flex flex-col gap-1.5';
const LABEL = 'text-[0.82rem] font-semibold text-white/55 uppercase tracking-wider';
const INPUT = 'bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-white text-[0.9rem] outline-none transition-colors focus:border-brand-primary/45 placeholder:text-white/25 w-full';
const SAVE_BTN = 'px-7 py-[11px] bg-brand-primary/[0.12] border border-brand-primary/40 rounded-lg text-brand-primary font-bold text-[0.9rem] cursor-pointer transition-all w-fit hover:enabled:bg-brand-primary/20 hover:enabled:border-brand-primary disabled:opacity-60 disabled:cursor-not-allowed';

export default function EditContent() {
  const { data: dashboard, setData: setDashboard } = useBuyer();
  const [form, setForm] = useState(() => ({
    brand_name: dashboard?.site_config.brand_name ?? '',
    tagline: dashboard?.site_config.tagline ?? '',
    hero_title: dashboard?.site_config.hero_title ?? '',
    hero_subtitle: dashboard?.site_config.hero_subtitle ?? '',
    cta_text: dashboard?.site_config.cta_text ?? '',
  }));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!dashboard) return null;
  const { template, site_config } = dashboard;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!dashboard) return;
    setSaving(true);
    try {
      await updateConfig(template.slug, form);
      setDashboard({ ...dashboard, site_config: { ...site_config, ...form } });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={PANEL}>
      <h2 className={PANEL_TITLE}>Edit Content</h2>
      <form className="flex flex-col gap-4" onSubmit={handleSave}>
        {([
          ['brand_name', 'Brand Name'],
          ['tagline', 'Tagline'],
          ['hero_title', 'Hero Title'],
          ['hero_subtitle', 'Hero Subtitle'],
          ['cta_text', 'CTA Button Text'],
        ] as const).map(([key, label]) => (
          <div key={key} className={FIELD}>
            <label className={LABEL}>{label}</label>
            <input
              className={INPUT}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <button type="submit" className={SAVE_BTN} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
