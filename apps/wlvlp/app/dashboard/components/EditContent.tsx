'use client';
import { useState } from 'react';
import { updateConfig } from '@/lib/api';
import { useBuyer } from '@/lib/account-context';
import styles from './components.module.css';

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
    <div className={styles.panel}>
      <h2 className={styles.panelTitle}>Edit Content</h2>
      <form className={styles.form} onSubmit={handleSave}>
        {([
          ['brand_name', 'Brand Name'],
          ['tagline', 'Tagline'],
          ['hero_title', 'Hero Title'],
          ['hero_subtitle', 'Hero Subtitle'],
          ['cta_text', 'CTA Button Text'],
        ] as const).map(([key, label]) => (
          <div key={key} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              className={styles.input}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
