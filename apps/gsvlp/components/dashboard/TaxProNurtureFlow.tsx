'use client';

import { useState } from 'react';
import type { TaxPro } from './CallListTable';

interface TaxProNurtureFlowProps {
  lead: TaxPro;
  apiBaseUrl: string;
}

function splitName(fullName: string): { first: string; last: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  if (parts.length === 1) return { first: parts[0], last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
}

export function TaxProNurtureFlow({ lead, apiBaseUrl }: TaxProNurtureFlowProps) {
  const initialName = splitName(lead.fullName);
  const [mode, setMode] = useState<'idle' | 'form' | 'submitting' | 'sent'>('idle');
  const [firstName, setFirstName] = useState(initialName.first);
  const [lastName, setLastName] = useState(initialName.last);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const fn = firstName.trim();
    const ln = lastName.trim();
    const em = email.trim().toLowerCase();
    if (!fn || !ln || !em) {
      setError('All fields are required.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setError('Please enter a valid email.');
      return;
    }

    setMode('submitting');
    try {
      const res = await fetch(`${apiBaseUrl}/v1/gsvlp/nurture/subscribe`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: em,
          first_name: fn,
          last_name: ln,
          credential: lead.profession,
          phone: lead.phone,
          source: 'wants_more_info',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Failed to start nurture drip');
      }
      setMode('sent');
    } catch (e: any) {
      setError(e?.message || 'Failed to send');
      setMode('form');
    }
  }

  if (mode === 'sent') {
    return (
      <div className="rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/[0.08] p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#3B82F6]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <div className="text-base font-bold text-white">
              Nurture drip started for {firstName.trim()} {lastName.trim()}
            </div>
            <div className="mt-1 text-sm text-white/70">
              They&rsquo;ll receive their first email in 24 hours with an overview of all VLP products.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'idle') {
    return (
      <button
        type="button"
        onClick={() => setMode('form')}
        className="w-full min-h-[56px] rounded-md bg-[#3B82F6] px-4 text-base font-bold text-white hover:bg-[#2563EB]"
      >
        Send Email — Start nurture drip
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-lg border border-[#3B82F6]/40 bg-[#3B82F6]/[0.06] p-6 space-y-4"
    >
      <div className="text-sm font-semibold uppercase tracking-widest text-[#3B82F6]">
        Start tax pro nurture drip
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">First name</span>
          <input
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">Last name</span>
          <input
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-xs uppercase tracking-widest text-white/40">Email</span>
        <input
          type="email"
          required
          placeholder="taxpro@firm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white"
        />
      </label>

      {error && (
        <div className="rounded border border-amber-500/30 bg-amber-500/[0.06] px-3 py-2 text-sm text-amber-300">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={mode === 'submitting'}
        className="w-full min-h-[56px] rounded-md bg-[#3B82F6] px-4 text-base font-bold text-white hover:bg-[#2563EB] disabled:opacity-60"
      >
        {mode === 'submitting' ? 'Sending…' : 'Send Nurture Email'}
      </button>
    </form>
  );
}
