'use client';
import { useState } from 'react';
import { updateConfig } from '@/lib/api';
import { useBuyer } from '@/lib/account-context';
import styles from './components.module.css';

export default function EditContact() {
  const { data: dashboard, setData: setDashboard } = useBuyer();
  const [form, setForm] = useState(() => ({
    phone: dashboard?.site_config.phone ?? '',
    email: dashboard?.site_config.email ?? '',
    address: dashboard?.site_config.address ?? '',
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
      <h2 className={styles.panelTitle}>Edit Contact</h2>
      <form className={styles.form} onSubmit={handleSave}>
        {([
          ['phone', 'Phone Number'],
          ['email', 'Email Address'],
          ['address', 'Business Address'],
        ] as const).map(([key, label]) => (
          <div key={key} className={styles.field}>
            <label className={styles.label}>{label}</label>
            <input
              className={styles.input}
              value={form[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
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
