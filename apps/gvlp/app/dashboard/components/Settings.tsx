'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Operator, updateOperator } from '@/lib/api';
import { openBillingPortal, BillingPortalError } from '@/lib/billing';
import { useOperator } from '@/lib/operator-context';
import styles from './Settings.module.css';

export default function Settings() {
  const { data: operator, setData: setOperator } = useOperator();
  const [confirming, setConfirming] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [rotateError, setRotateError] = useState<string | null>(null);
  const [rotateSuccess, setRotateSuccess] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  if (!operator) return null;

  const hasActiveSubscription =
    operator.status === 'active' && !!operator.stripe_customer_id;

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

  const tierLabel = operator.tier.charAt(0).toUpperCase() + operator.tier.slice(1);

  const handleRotateRequest = () => {
    setConfirming(true);
    setRotateError(null);
    setRotateSuccess(false);
  };

  const handleRotateConfirm = async () => {
    setRotating(true);
    setRotateError(null);
    try {
      const updated = await updateOperator(operator.account_id, { rotate_client_id: true } as unknown as Partial<Operator>);
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

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Settings</h1>
      <p className={styles.subheading}>Manage your account and API credentials.</p>

      {/* Account info */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Account Information</h2>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{operator.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Name</span>
          <span className={styles.rowValue}>{operator.name || '—'}</span>
        </div>
        {operator.firm_name && (
          <div className={styles.row}>
            <span className={styles.rowLabel}>Firm</span>
            <span className={styles.rowValue}>{operator.firm_name}</span>
          </div>
        )}
        <div className={styles.row}>
          <span className={styles.rowLabel}>Current Plan</span>
          <span className={styles.tierBadge}>{tierLabel}</span>
        </div>
      </div>

      {/* Client ID */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Client ID</h2>
        <p className={styles.cardDesc}>
          Your Client ID is used in embed codes. Rotating it will invalidate all existing embeds immediately.
        </p>

        <div className={styles.clientIdRow}>
          <code className={styles.clientIdValue}>{operator.client_id}</code>
        </div>

        {rotateSuccess && (
          <div className={styles.successMsg}>
            ✓ Client ID rotated successfully. Update your embeds with the new value above.
          </div>
        )}

        {rotateError && (
          <div className={styles.errorMsg}>⚠️ {rotateError}</div>
        )}

        {!confirming ? (
          <button className={styles.dangerBtn} onClick={handleRotateRequest}>
            Rotate Client ID
          </button>
        ) : (
          <div className={styles.confirmBox}>
            <p className={styles.confirmText}>
              Are you sure? All existing embed codes will stop working until updated.
            </p>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmBtn}
                onClick={handleRotateConfirm}
                disabled={rotating}
              >
                {rotating ? 'Rotating…' : 'Yes, Rotate'}
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleRotateCancel}
                disabled={rotating}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade link */}
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Change Plan</h2>
        <p className={styles.cardDesc}>
          Need more tokens or more games? Upgrade your plan anytime.
        </p>
        {hasActiveSubscription ? (
          <>
            <button
              type="button"
              onClick={handleManageBilling}
              disabled={portalLoading}
              className={styles.upgradeLink}
            >
              {portalLoading ? 'Opening…' : 'Manage Billing →'}
            </button>
            {portalError && (
              <div className={styles.errorMsg}>⚠️ {portalError}</div>
            )}
          </>
        ) : (
          <Link href="/dashboard/upgrade" className={styles.upgradeLink}>
            View Plans &amp; Upgrade →
          </Link>
        )}
      </div>
    </div>
  );
}
