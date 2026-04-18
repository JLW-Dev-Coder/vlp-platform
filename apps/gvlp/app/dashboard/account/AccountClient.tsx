'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Hash,
  User,
  Building2,
  CalendarDays,
  CheckCircle2,
  Crown,
  Check,
  KeyRound,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { HeroCard, StatusBadge } from '@vlp/member-ui';
import { API_BASE, updateOperator } from '@/lib/api';
import type { Operator } from '@/lib/api';
import { openBillingPortal, BillingPortalError } from '@/lib/billing';
import { useOperator } from '@/lib/operator-context';

type Preferences = {
  appearance: string | null;
  timezone: string | null;
  default_dashboard: string | null;
  accent_color: string | null;
  in_app_enabled: 0 | 1;
  sms_enabled: 0 | 1;
};

const TIER_FEATURES: Record<
  string,
  { label: string; price: string; features: string[] }
> = {
  starter: {
    label: 'Starter',
    price: 'Free',
    features: [
      '100 tokens / month',
      '1 game unlocked',
      'Embed code access',
      'Play analytics',
    ],
  },
  apprentice: {
    label: 'Apprentice',
    price: '$9/month',
    features: [
      '500 tokens / month',
      '3 games unlocked',
      'Embed code access',
      'Play analytics',
    ],
  },
  strategist: {
    label: 'Strategist',
    price: '$19/month',
    features: [
      '1,500 tokens / month',
      '6 games unlocked',
      'Embed code access',
      'Play analytics',
    ],
  },
  navigator: {
    label: 'Navigator',
    price: '$39/month',
    features: [
      '5,000 tokens / month',
      '9 games unlocked',
      'Embed code access',
      'Play analytics',
    ],
  },
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function AccountClient() {
  const { data: operator, setData: setOperator, loading, error, refetch } = useOperator();
  const [memberSince, setMemberSince] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotateError, setRotateError] = useState<string | null>(null);
  const [rotateSuccess, setRotateSuccess] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [prefsLoading, setPrefsLoading] = useState(true);
  const [prefsError, setPrefsError] = useState<string | null>(null);
  const [prefsRetryToken, setPrefsRetryToken] = useState(0);
  const [togglePending, setTogglePending] = useState<
    null | 'in_app_enabled' | 'sms_enabled'
  >(null);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const accountId = operator?.account_id;

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    setPrefsLoading(true);
    setPrefsError(null);
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/v1/accounts/preferences/${accountId}`,
          { credentials: 'include', cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as {
          ok?: boolean;
          preferences?: Partial<Preferences>;
        };
        if (cancelled) return;
        const p = body.preferences ?? {};
        setPrefs({
          appearance: (p.appearance as string | null) ?? 'system',
          timezone: (p.timezone as string | null) ?? null,
          default_dashboard: (p.default_dashboard as string | null) ?? null,
          accent_color: (p.accent_color as string | null) ?? null,
          in_app_enabled: Number(p.in_app_enabled) ? 1 : 0,
          sms_enabled: Number(p.sms_enabled) ? 1 : 0,
        });
        setPrefsLoading(false);
      } catch (err) {
        if (cancelled) return;
        setPrefsError(
          err instanceof Error
            ? err.message
            : 'Failed to load notification preferences'
        );
        setPrefsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accountId, prefsRetryToken]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/dashboard`, {
          credentials: 'include',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) return;
        const body = (await res.json()) as {
          dashboard?: { account?: { member_since?: string | null } };
        };
        if (cancelled) return;
        setMemberSince(body.dashboard?.account?.member_since ?? null);
      } catch {
        // best-effort; member-since is optional
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading && !operator) return <AccountSkeleton />;
  if (error) return <AccountFallback message={error.message} onRetry={refetch} />;
  if (!operator) return <AccountFallback message="Could not load account" onRetry={refetch} />;

  const hasActiveSubscription =
    operator.status === 'active' && !!operator.stripe_customer_id;

  const tierKey = operator.tier;
  const tierInfo =
    TIER_FEATURES[tierKey] ?? {
      label: tierKey || 'Unknown',
      price: '',
      features: [] as string[],
    };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      await openBillingPortal({
        accountId: operator.account_id,
        customerId: operator.stripe_customer_id ?? '',
        returnUrl: window.location.origin + '/dashboard/account',
      });
    } catch (err) {
      setPortalError(
        err instanceof BillingPortalError
          ? err.message
          : 'Could not open billing portal'
      );
      setPortalLoading(false);
    }
  };

  const handleRotateRequest = () => {
    setConfirming(true);
    setRotateError(null);
    setRotateSuccess(false);
  };

  const handleRotateConfirm = async () => {
    setRotating(true);
    setRotateError(null);
    try {
      const updated = await updateOperator(
        operator.account_id,
        { rotate_client_id: true } as unknown as Partial<Operator>
      );
      setOperator(updated);
      setRotateSuccess(true);
      setConfirming(false);
    } catch (e) {
      setRotateError(e instanceof Error ? e.message : 'Failed to rotate client ID');
    } finally {
      setRotating(false);
    }
  };

  const handleRotateCancel = () => {
    setConfirming(false);
    setRotateError(null);
  };

  const handleToggle = async (key: 'in_app_enabled' | 'sms_enabled') => {
    if (!prefs || !accountId) return;
    if (togglePending) return;

    const previous = prefs[key];
    const next: 0 | 1 = previous ? 0 : 1;
    const nextPrefs: Preferences = { ...prefs, [key]: next };

    setPrefs(nextPrefs);
    setTogglePending(key);
    setToggleError(null);

    try {
      const res = await fetch(
        `${API_BASE}/v1/accounts/preferences/${accountId}`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nextPrefs),
        }
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      setPrefs({ ...prefs, [key]: previous });
      setToggleError("Couldn't save preference. Try again.");
    } finally {
      setTogglePending(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your account and API credentials.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
          <h3 className="text-xs uppercase tracking-widest text-white/40">Account Details</h3>
          <div className="mt-5 space-y-4">
            <Detail
              icon={<Mail className="h-4 w-4 text-brand-primary" />}
              label="Email"
              value={operator.email}
            />
            <Detail
              icon={<Hash className="h-4 w-4 text-brand-primary" />}
              label="Account ID"
              value={operator.account_id}
              mono
            />
            <Detail
              icon={<User className="h-4 w-4 text-brand-primary" />}
              label="Name"
              value={operator.name || '—'}
            />
            {operator.firm_name && (
              <Detail
                icon={<Building2 className="h-4 w-4 text-brand-primary" />}
                label="Firm"
                value={operator.firm_name}
              />
            )}
            <Detail
              icon={<CalendarDays className="h-4 w-4 text-brand-primary" />}
              label="Member Since"
              value={formatDate(memberSince)}
            />
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">
                <CheckCircle2 className="h-4 w-4 text-brand-primary" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/40">Status</p>
                <div className="mt-0.5">
                  <StatusBadge status={operator.status ?? 'active'} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <HeroCard brandColor="#22c55e">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-primary/70">Current Plan</p>
              <p className="mt-2 text-3xl font-bold text-brand-primary">{tierInfo.label}</p>
              {tierInfo.price && (
                <p className="mt-1 text-sm text-white/50">{tierInfo.price}</p>
              )}
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary/20">
              <Crown className="h-5 w-5 text-brand-primary" />
            </div>
          </div>
          {tierInfo.features.length > 0 && (
            <ul className="mt-5 space-y-2.5">
              {tierInfo.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                  <Check className="h-4 w-4 shrink-0 text-emerald-400" />
                  {f}
                </li>
              ))}
            </ul>
          )}
        </HeroCard>
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <h3 className="text-xs uppercase tracking-widest text-white/40">Change Plan</h3>
        <p className="mt-3 text-sm text-white/60">
          Need more tokens or more games? Upgrade your plan anytime.
        </p>
        {hasActiveSubscription ? (
          <>
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={portalLoading}
              className="mt-4 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(34,197,94,0.3)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
            >
              {portalLoading ? 'Opening…' : 'Manage Billing →'}
            </button>
            {portalError && (
              <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                ⚠️ {portalError}
              </div>
            )}
          </>
        ) : (
          <Link
            href="/dashboard/upgrade"
            className="mt-4 inline-block rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(34,197,94,0.3)] transition-opacity hover:opacity-90"
          >
            View Plans &amp; Upgrade →
          </Link>
        )}
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">
            <KeyRound className="h-4 w-4 text-brand-primary" />
          </div>
          <h3 className="text-xs uppercase tracking-widest text-white/40">Client ID</h3>
        </div>
        <p className="mt-3 text-sm text-white/60">
          Your Client ID is used in embed codes. Rotating it will invalidate all
          existing embeds immediately.
        </p>

        <div className="mt-4">
          <code className="inline-block rounded-md bg-white/[0.04] px-3 py-2 font-mono text-sm text-white/80">
            {operator.client_id}
          </code>
        </div>

        {rotateSuccess && (
          <div className="mt-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
            ✓ Client ID rotated successfully. Update your embeds with the new value above.
          </div>
        )}

        {rotateError && (
          <div className="mt-3 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            ⚠️ {rotateError}
          </div>
        )}

        {!confirming ? (
          <button
            type="button"
            onClick={handleRotateRequest}
            className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/15"
          >
            Rotate Client ID
          </button>
        ) : (
          <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-sm text-amber-200">
              Are you sure? All existing embed codes will stop working until updated.
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleRotateConfirm}
                disabled={rotating}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {rotating ? 'Rotating…' : 'Yes, Rotate'}
              </button>
              <button
                type="button"
                onClick={handleRotateCancel}
                disabled={rotating}
                className="rounded-lg border border-[var(--member-border)] px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">
            <Bell className="h-4 w-4 text-brand-primary" />
          </div>
          <h3 className="text-xs uppercase tracking-widest text-white/40">Notifications</h3>
        </div>

        {prefsLoading && (
          <div className="mt-4 space-y-3">
            <div className="h-12 animate-pulse rounded-md bg-white/[0.04]" />
            <div className="h-12 animate-pulse rounded-md bg-white/[0.04]" />
          </div>
        )}

        {prefsError && !prefsLoading && (
          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm text-amber-200">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div className="flex-1">
              <p>Could not load notification preferences.</p>
              <button
                type="button"
                onClick={() => setPrefsRetryToken((t) => t + 1)}
                className="mt-2 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-500/10"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {prefs && !prefsLoading && !prefsError && (
          <div className="mt-3">
            <ToggleRow
              label="In-app notifications"
              description="Show alerts in the topbar bell."
              checked={prefs.in_app_enabled === 1}
              disabled={togglePending === 'in_app_enabled'}
              onChange={() => handleToggle('in_app_enabled')}
            />
            <ToggleRow
              label="SMS notifications"
              description="Text me for urgent account alerts."
              checked={prefs.sms_enabled === 1}
              disabled={togglePending === 'sms_enabled'}
              onChange={() => handleToggle('sms_enabled')}
            />
            {toggleError && (
              <div className="mt-3 text-sm text-amber-400">⚠️ {toggleError}</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--member-border)] py-3 last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-white/50">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-500' : 'bg-white/10'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function Detail({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-primary/10">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-widest text-white/40">{label}</p>
        <p
          className={`text-sm font-medium text-white ${mono ? 'font-mono break-all' : ''}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">Loading account…</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
        <div className="h-64 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
      </div>
      <div className="h-32 animate-pulse rounded-xl border border-[var(--member-border)] bg-[var(--member-card)]" />
    </div>
  );
}

function AccountFallback({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Account</h1>
        <p className="mt-1 text-sm text-white/50">
          Manage your account and API credentials.
        </p>
      </div>
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-sm text-amber-200">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        <div className="flex-1">
          <p className="font-medium">Could not load live data</p>
          <p className="mt-1 text-amber-200/70">{message}</p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-200 transition-colors hover:bg-amber-500/10"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
