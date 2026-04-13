'use client';

import { useEffect, useState } from 'react';
import { Session, TaxPro, ProfileData, getProfile, updateProfile, tcvlpOnboarding } from '@/lib/api';
import styles from './shared.module.css';

interface Props {
  session: Session;
  pro: TaxPro | null;
  onUpdated: (pro: TaxPro) => void;
}

export default function Settings({ session, pro, onUpdated }: Props) {
  const [firmName, setFirmName] = useState(pro?.firm_name ?? '');
  const [displayName, setDisplayName] = useState(pro?.display_name ?? '');
  const [welcomeMessage, setWelcomeMessage] = useState(pro?.welcome_message ?? '');
  const [firmPhone, setFirmPhone] = useState('');
  const [firmWebsite, setFirmWebsite] = useState('');
  const [firmLogoUrl, setFirmLogoUrl] = useState(pro?.logo_url ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    getProfile().then((p: ProfileData | null) => {
      if (cancelled || !p) return;
      if (p.firm_name) setFirmName(p.firm_name);
      if (p.firm_phone) setFirmPhone(p.firm_phone);
      if (p.firm_website) setFirmWebsite(p.firm_website);
      if (p.firm_logo_url) setFirmLogoUrl(p.firm_logo_url);
    });
    return () => { cancelled = true; };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Keep the existing onboarding update (firm_name, display_name, welcome_message)
      // so client-facing landing page copy stays in sync.
      const updated = await tcvlpOnboarding({
        firm_name: firmName,
        display_name: displayName,
        welcome_message: welcomeMessage,
      });
      onUpdated(updated);

      // Persist white-label branding fields via the profile endpoint.
      await updateProfile({
        firm_name: firmName,
        firm_phone: firmPhone,
        firm_website: firmWebsite,
        firm_logo_url: firmLogoUrl,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Settings & Profile</h1>
      <p className={styles.pageDesc}>
        Update your firm information and white-label branding shown on client-facing claim pages.
      </p>

      <div className={styles.urlCard}>
        <div className={styles.urlCardLabel}>Account</div>
        <div className={styles.urlRow}>
          <div className={styles.urlCode}>{session.email}</div>
        </div>
        <div className={styles.urlNote}>Account ID: {session.account_id}</div>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Firm Name <span className={styles.required}>*</span></label>
          <input
            type="text"
            value={firmName}
            onChange={(e) => setFirmName(e.target.value)}
            placeholder="Jones Tax Solutions"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Display Name</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Jane Jones, CPA"
            className={styles.input}
          />
          <span className={styles.hint}>Shown on your client landing page</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Firm Phone</label>
          <input
            type="tel"
            value={firmPhone}
            onChange={(e) => setFirmPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Firm Website</label>
          <input
            type="url"
            value={firmWebsite}
            onChange={(e) => setFirmWebsite(e.target.value)}
            placeholder="https://jonestax.com"
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Firm Logo URL</label>
          <input
            type="url"
            value={firmLogoUrl}
            onChange={(e) => setFirmLogoUrl(e.target.value)}
            placeholder="https://cdn.example.com/logo.png"
            className={styles.input}
          />
          <span className={styles.hint}>Displayed on your white-labeled claim page</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Welcome Message</label>
          <textarea
            value={welcomeMessage}
            onChange={(e) => setWelcomeMessage(e.target.value)}
            placeholder="Welcome! I help clients like you recover IRS penalties using the Kwong ruling…"
            rows={4}
            className={styles.textarea}
          />
          <span className={styles.hint}>Displayed on your client-facing landing page</span>
        </div>

        {error && <div className={styles.errorMsg}>{error}</div>}
        {saved && <div className={styles.successMsg}>✓ Settings saved successfully</div>}

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
