'use client';

import { useState } from 'react';
import { createCheckout } from '@/lib/api';
import { openBillingPortal, BillingPortalError } from '@/lib/billing';
import { useOperator } from '@/lib/operator-context';

const GVLP_TIERS = {
  starter:    { tokens: 100,  games: 1, monthly: 0,  label: 'Starter'    },
  apprentice: { tokens: 500,  games: 3, monthly: 9,  label: 'Apprentice' },
  strategist: { tokens: 1500, games: 6, monthly: 19, label: 'Strategist' },
  navigator:  { tokens: 5000, games: 9, monthly: 39, label: 'Navigator'  },
} as const;

type TierKey = keyof typeof GVLP_TIERS;

const TIER_ORDER: TierKey[] = ['starter', 'apprentice', 'strategist', 'navigator'];

export default function UpgradeClient() {
  const { data: operator } = useOperator();
  const [loadingTier, setLoadingTier] = useState<TierKey | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  if (!operator) return null;

  const currentIdx = TIER_ORDER.indexOf(operator.tier as TierKey);
  const hasActiveSubscription =
    operator.status === 'active' && !!operator.stripe_customer_id;

  const handleManageBilling = async () => {
    setPortalLoading(true);
    setPortalError(null);
    try {
      await openBillingPortal({
        accountId: operator.account_id,
        customerId: operator.stripe_customer_id ?? '',
        returnUrl: window.location.origin + '/dashboard/upgrade',
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

  const handleUpgrade = async (tier: TierKey) => {
    setLoadingTier(tier);
    setCheckoutError(null);
    try {
      const { session_url } = await createCheckout(operator.account_id, tier);
      window.location.href = session_url;
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : 'Checkout failed. Please try again.');
      setLoadingTier(null);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[var(--fg)] mb-1.5">Upgrade Your Plan</h1>
      <p className="text-sm text-[var(--muted)] mb-8">
        Choose a plan that fits your practice. Upgrade anytime — pay monthly, cancel anytime.
      </p>

      {checkoutError && (
        <div className="mb-6 rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          ⚠️ {checkoutError}
        </div>
      )}

      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
        {TIER_ORDER.map((key) => {
          const tier = GVLP_TIERS[key];
          const isCurrent = key === operator.tier;
          const tierIdx = TIER_ORDER.indexOf(key);
          const isUpgrade = tierIdx > currentIdx;
          const isDowngrade = tierIdx < currentIdx;
          const isFeatured = key === 'strategist';

          const cardClasses = [
            'relative flex flex-col gap-5 rounded-xl border p-7 pb-6 transition-colors',
            'bg-[var(--member-card)]',
            isCurrent
              ? 'border-brand-500 shadow-[0_0_20px_rgba(34,197,94,0.15)]'
              : isFeatured
              ? 'border-brand-500/60 shadow-[0_0_24px_rgba(34,197,94,0.18)]'
              : 'border-[var(--member-border)] hover:border-brand-500/50',
          ].join(' ');

          return (
            <div key={key} className={cardClasses}>
              {isFeatured && (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-lg bg-brand-500 px-3 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider text-white">
                  Most Popular
                </div>
              )}

              <div className="flex flex-col gap-2">
                <span className="text-base font-bold uppercase tracking-wider text-[var(--fg)]">
                  {tier.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  {tier.monthly === 0 ? (
                    <span className="text-2xl font-extrabold text-[var(--muted)]">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-extrabold leading-none text-brand-500">
                        ${tier.monthly}
                      </span>
                      <span className="ml-0.5 text-sm text-[var(--muted)]">/mo</span>
                    </>
                  )}
                </div>
              </div>

              <ul className="flex flex-1 flex-col gap-2.5 text-sm text-[var(--fg)]">
                <li className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-base leading-none">🪙</span>
                  <span><strong>{tier.tokens.toLocaleString()}</strong> tokens / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-base leading-none">🎮</span>
                  <span><strong>{tier.games}</strong> game{tier.games > 1 ? 's' : ''} unlocked</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-base leading-none">🔗</span>
                  <span>Embed code access</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="flex-shrink-0 text-base leading-none">📊</span>
                  <span>Play analytics</span>
                </li>
              </ul>

              <div className="mt-1">
                {isCurrent ? (
                  <span className="flex w-full items-center justify-center rounded-lg border border-brand-500/40 bg-brand-500/10 px-3 py-2.5 text-sm font-bold uppercase tracking-wider text-brand-500">
                    Current Plan
                  </span>
                ) : isUpgrade ? (
                  <button
                    type="button"
                    className="w-full rounded-lg bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(34,197,94,0.3)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
                    onClick={() => handleUpgrade(key)}
                    disabled={loadingTier !== null}
                  >
                    {loadingTier === key ? 'Redirecting…' : `Upgrade to ${tier.label}`}
                  </button>
                ) : isDowngrade ? (
                  <button
                    type="button"
                    className="w-full rounded-lg border border-[var(--member-border)] bg-transparent px-3 py-2.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:border-brand-500/40 hover:text-[var(--fg)] disabled:cursor-not-allowed disabled:opacity-55"
                    onClick={() => handleUpgrade(key)}
                    disabled={loadingTier !== null}
                  >
                    {loadingTier === key ? 'Redirecting…' : `Switch to ${tier.label}`}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {hasActiveSubscription && (
        <div className="mt-8 rounded-xl border border-[var(--member-border)] bg-[var(--member-card)] p-7">
          <h2 className="text-base font-bold uppercase tracking-wider text-[var(--fg)]">
            Manage Your Billing
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Update your payment method, download invoices, or cancel your
            subscription.
          </p>
          <button
            type="button"
            onClick={handleManageBilling}
            disabled={portalLoading}
            className="mt-4 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_2px_12px_rgba(34,197,94,0.3)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-55"
          >
            {portalLoading ? 'Opening…' : 'Open Billing Portal'}
          </button>
          {portalError && (
            <div className="mt-3 rounded-lg border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              ⚠️ {portalError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
