'use client';

import { useEffect, useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import {
  Affiliate,
  AffiliateEvent,
  getAffiliate,
  getAffiliateEvents,
  startAffiliateOnboarding,
  requestPayout,
} from '@/lib/api';
import styles from './page.module.css';

function fmt(cents: number) {
  return '$' + (cents / 100).toFixed(2);
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function AffiliateInner({ session }: { session: { account_id: string; email: string } }) {
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [events, setEvents] = useState<AffiliateEvent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutResult, setPayoutResult] = useState<{ payout_id: string; amount: number } | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getAffiliate(session.account_id),
      getAffiliateEvents(session.account_id),
    ]).then(([aff, evts]) => {
      setAffiliate(aff);
      setEvents(evts);
    }).finally(() => setLoading(false));
  }, [session.account_id]);

  function handleCopy() {
    if (!affiliate) return;
    navigator.clipboard.writeText(affiliate.referral_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function handlePayout() {
    if (!affiliate) return;
    setPayoutLoading(true);
    try {
      const result = await requestPayout(affiliate.balance_pending);
      setPayoutResult({ payout_id: result.payout_id, amount: result.amount });
      setAffiliate((prev) => prev ? { ...prev, balance_pending: 0 } : prev);
    } finally {
      setPayoutLoading(false);
    }
  }

  async function handleConnect() {
    setConnectLoading(true);
    try {
      const { onboard_url } = await startAffiliateOnboarding();
      window.location.href = onboard_url;
    } catch {
      setConnectLoading(false);
    }
  }

  const canPayout =
    affiliate !== null &&
    affiliate.balance_pending >= 1000 &&
    affiliate.connect_status === 'active';

  const payoutDisabledReason =
    !affiliate ? '' :
    affiliate.connect_status !== 'active' ? 'Connect your bank account to withdraw' :
    affiliate.balance_pending < 1000 ? 'Minimum payout is $10' : '';

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Affiliate Program</h1>

      {/* Section 1 — Referral Link */}
      <div className={styles.section}>
        <div className={styles.sectionHeading}>Your Referral Link</div>
        {loading ? (
          <>
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
          </>
        ) : (
          <>
            <div className={styles.referralRow}>
              <input
                className={styles.referralInput}
                readOnly
                value={affiliate?.referral_url ?? ''}
              />
              <button
                className={`${styles.copyBtn} ${copied ? styles.copyBtnCopied : ''}`}
                onClick={handleCopy}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p className={styles.referralSubtext}>
              Share this link. Earn 20% commission on every purchase your referrals make, for life.
            </p>
          </>
        )}
      </div>

      {/* Section 2 — Earnings Summary */}
      <div className={styles.section}>
        <div className={styles.sectionHeading}>Earnings Summary</div>
        {loading ? (
          <>
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
          </>
        ) : (
          <>
            <div className={styles.statCards}>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Pending</div>
                <div className={styles.statValue}>{fmt(affiliate?.balance_pending ?? 0)}</div>
                <div className={styles.statSub}>Available to withdraw</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statLabel}>Paid Out</div>
                <div className={styles.statValue}>{fmt(affiliate?.balance_paid ?? 0)}</div>
                <div className={styles.statSub}>Total earned and paid</div>
              </div>
            </div>
            <div>
              <button
                className={styles.payoutBtn}
                disabled={!canPayout || payoutLoading}
                onClick={handlePayout}
                title={payoutDisabledReason}
              >
                {payoutLoading ? 'Requesting…' : 'Request Payout'}
              </button>
              {!canPayout && payoutDisabledReason && (
                <span className={styles.tooltip}>{payoutDisabledReason}</span>
              )}
            </div>
            {payoutResult && (
              <div className={styles.payoutSuccess}>
                Payout of {fmt(payoutResult.amount)} requested — ID: {payoutResult.payout_id}
              </div>
            )}
          </>
        )}
      </div>

      {/* Section 3 — Stripe Connect */}
      <div className={styles.section}>
        <div className={styles.sectionHeading}>Bank Account</div>
        {loading ? (
          <div className={`${styles.skeleton} ${styles.skeletonRow}`} />
        ) : affiliate?.connect_status === 'active' ? (
          <div className={styles.connectedBadge}>✓ Bank account connected</div>
        ) : (
          <div className={styles.onboardCard}>
            <p className={styles.onboardBody}>
              Connect via Stripe to receive commission payouts directly to your bank.
            </p>
            <button
              className={styles.connectBtn}
              onClick={handleConnect}
              disabled={connectLoading}
            >
              {connectLoading ? 'Redirecting…' : 'Connect Bank Account'}
            </button>
          </div>
        )}
      </div>

      {/* Section 4 — Commission History */}
      <div className={styles.section}>
        <div className={styles.sectionHeading}>Commission History</div>
        {loading ? (
          <>
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} style={{ width: '100%' }} />
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} style={{ width: '100%' }} />
            <div className={`${styles.skeleton} ${styles.skeletonRow}`} style={{ width: '100%' }} />
          </>
        ) : !events || events.length === 0 ? (
          <div className={styles.emptyState}>
            No commissions yet. Share your referral link to start earning.
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Platform</th>
                  <th>Sale Amount</th>
                  <th>Your Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={i}>
                    <td>{fmtDate(ev.created_at)}</td>
                    <td>{ev.platform}</td>
                    <td>{fmt(ev.gross_amount)}</td>
                    <td>{fmt(ev.commission_amount)}</td>
                    <td>
                      {ev.status === 'paid' ? (
                        <span className={styles.badgePaid}>paid</span>
                      ) : (
                        <span className={styles.badgePending}>pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return (
    <AuthGuard>
      {(session) => <AffiliateInner session={session} />}
    </AuthGuard>
  );
}
