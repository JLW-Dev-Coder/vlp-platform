'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppShell } from '@vlp/member-ui';

type PayoutMethod = 'stripe' | 'payoneer' | null;

interface PayoutSettings {
  payout_method: PayoutMethod;
  payoneer_email: string;
  payoneer_account_id: string;
}

interface ConnectStatus {
  connected: boolean;
  onboarding_complete?: boolean;
}

export default function AccountPage() {
  const { session, signOut, config } = useAppShell();
  const apiBase = config.apiBaseUrl;

  const [selected, setSelected] = useState<PayoutMethod>(null);
  const [payoneerEmail, setPayoneerEmail] = useState('');
  const [payoneerAccountId, setPayoneerAccountId] = useState('');
  const [connect, setConnect] = useState<ConnectStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      fetch(`${apiBase}/v1/gsvlp/account/payout-method`, { credentials: 'include' })
        .then((r) => r.json())
        .catch(() => null),
      fetch(`${apiBase}/v1/gsvlp/stripe-connect/status`, { credentials: 'include' })
        .then((r) => r.json())
        .catch(() => null),
    ]).then(([payout, conn]) => {
      if (cancelled) return;
      if (payout?.ok) {
        setSelected((payout.payout_method as PayoutMethod) ?? null);
        setPayoneerEmail(payout.payoneer_email || '');
        setPayoneerAccountId(payout.payoneer_account_id || '');
      }
      if (conn?.ok) {
        setConnect({
          connected: !!conn.connected,
          onboarding_complete: !!conn.onboarding_complete,
        });
      } else {
        setConnect({ connected: false });
      }
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [apiBase]);

  const startConnectOnboarding = useCallback(async () => {
    setConnecting(true);
    setMessage(null);
    try {
      const res = await fetch(`${apiBase}/v1/gsvlp/stripe-connect/onboard`, {
        method: 'POST',
        credentials: 'include',
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok || !d.onboarding_url) {
        throw new Error(d.error || 'Could not start Stripe onboarding');
      }
      window.location.href = d.onboarding_url;
    } catch (e) {
      setConnecting(false);
      setMessage({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Could not start Stripe onboarding',
      });
    }
  }, [apiBase]);

  const save = useCallback(async () => {
    if (!selected) {
      setMessage({ kind: 'err', text: 'Pick a payout method first.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const body =
        selected === 'payoneer'
          ? {
              payout_method: 'payoneer',
              payoneer_email: payoneerEmail.trim(),
              payoneer_account_id: payoneerAccountId.trim(),
            }
          : { payout_method: 'stripe' };
      const res = await fetch(`${apiBase}/v1/gsvlp/account/payout-method`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok || !d.ok) {
        throw new Error(d.error || 'Could not save payout method');
      }
      setMessage({ kind: 'ok', text: 'Payout method saved.' });
    } catch (e) {
      setMessage({
        kind: 'err',
        text: e instanceof Error ? e.message : 'Could not save payout method',
      });
    } finally {
      setSaving(false);
    }
  }, [apiBase, selected, payoneerEmail, payoneerAccountId]);

  const stripeConnected = !!(connect?.connected && connect?.onboarding_complete);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">Your setter account details.</p>
      </header>

      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/50">Email</span>
            <span className="text-white">{session.email ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Account ID</span>
            <span className="font-mono text-xs text-white/70">
              {session.account_id ?? '—'}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-base font-semibold text-white">Payout Method</h2>
        <p className="mt-1 text-sm text-white/50">
          Choose how you&rsquo;d like to receive your commission payouts.
        </p>

        {loading ? (
          <div className="mt-4 h-24 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.02]" />
        ) : (
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => setSelected('stripe')}
              className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition ${
                selected === 'stripe'
                  ? 'border-[#22C55E] bg-[#22C55E]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected === 'stripe' ? 'border-[#22C55E]' : 'border-white/30'
                }`}
              >
                {selected === 'stripe' && (
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">💳</span>
                  <span className="font-semibold text-white">Stripe</span>
                  {stripeConnected && (
                    <span className="rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-300">
                      Connected
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Automatic payouts via Stripe Connect.
                </p>
                {selected === 'stripe' && !stripeConnected && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      startConnectOnboarding();
                    }}
                    disabled={connecting}
                    className="mt-3 inline-flex items-center justify-center rounded-md bg-[#FFD700] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95 disabled:opacity-60"
                  >
                    {connecting ? 'Opening Stripe…' : 'Connect Stripe'}
                  </button>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelected('payoneer')}
              className={`flex w-full items-start gap-4 rounded-lg border p-4 text-left transition ${
                selected === 'payoneer'
                  ? 'border-[#22C55E] bg-[#22C55E]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <div
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                  selected === 'payoneer' ? 'border-[#22C55E]' : 'border-white/30'
                }`}
              >
                {selected === 'payoneer' && (
                  <span className="block h-2.5 w-2.5 rounded-full bg-[#22C55E]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">$</span>
                  <span className="font-semibold text-white">Payoneer</span>
                </div>
                <p className="mt-1 text-sm text-white/60">
                  Receive payouts to your Payoneer account.
                </p>

                {selected === 'payoneer' && (
                  <div
                    className="mt-3 space-y-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div>
                      <label className="block text-xs font-semibold text-white/70">
                        Payoneer Email
                      </label>
                      <input
                        type="email"
                        value={payoneerEmail}
                        onChange={(e) => setPayoneerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#22C55E] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/70">
                        Payoneer Account ID
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={payoneerAccountId}
                        onChange={(e) => setPayoneerAccountId(e.target.value)}
                        placeholder="e.g., 104017702"
                        className="mt-1 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/30 focus:border-[#22C55E] focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-white/50">
                      Enter your Payoneer email or Account ID (found in your Payoneer
                      dashboard under Settings).
                    </p>
                  </div>
                )}
              </div>
            </button>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                {message && (
                  <span
                    className={
                      message.kind === 'ok' ? 'text-green-300' : 'text-amber-300'
                    }
                  >
                    {message.text}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={save}
                disabled={saving || !selected}
                className="inline-flex items-center justify-center rounded-md bg-[#22C55E] px-4 py-2 text-sm font-semibold text-black transition hover:brightness-95 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Payout Method'}
              </button>
            </div>
          </div>
        )}
      </section>

      <button
        type="button"
        onClick={signOut}
        className="rounded border border-white/10 px-4 py-2 text-sm text-red-400/80 hover:text-red-400"
      >
        Sign out
      </button>
    </div>
  );
}
