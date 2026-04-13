'use client';

import { useState, useEffect } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Header from '@/components/Header';
import {
  Session,
  AffiliateData,
  AffiliateEvent,
  PayoutResult,
  getAffiliate,
  getAffiliateEvents,
  startAffiliateOnboarding,
  requestPayout,
} from '@/lib/api';
import styles from './page.module.css';

function AffiliateContent({ session }: { session: Session }) {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(null);
  const [events, setEvents] = useState<AffiliateEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [payoutResult, setPayoutResult] = useState<PayoutResult | null>(null);
  const [connectLoading, setConnectLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      getAffiliate(session.account_id),
      getAffiliateEvents(session.account_id),
    ])
      .then(([aff, evts]) => {
        setAffiliate(aff);
        setEvents(evts);
      })
      .finally(() => setLoading(false));
  }, [session.account_id]);

  const handleCopy = () => {
    if (!affiliate?.referral_url) return;
    navigator.clipboard.writeText(affiliate.referral_url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePayout = async () => {
    if (!affiliate) return;
    setPayoutLoading(true);
    try {
      const result = await requestPayout(affiliate.balance_pending);
      setPayoutResult(result);
      setAffiliate((prev) =>
        prev ? { ...prev, balance_pending: 0, balance_paid: prev.balance_paid + result.amount } : prev
      );
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleConnect = async () => {
    setConnectLoading(true);
    try {
      const { onboard_url } = await startAffiliateOnboarding();
      window.location.href = onboard_url;
    } catch {
      setConnectLoading(false);
    }
  };

  const isPayoutDisabled =
    !affiliate ||
    affiliate.balance_pending < 1000 ||
    affiliate.connect_status !== 'active' ||
    payoutLoading ||
    !!payoutResult;

  const payoutHint =
    affiliate && affiliate.connect_status !== 'active'
      ? 'Connect your bank account to withdraw'
      : affiliate && affiliate.balance_pending < 1000
      ? 'Minimum payout is $10'
      : null;

  const fmtUsd = (cents: number) =>
    `$${(cents / 100).toFixed(2)}`;

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div className={styles.root}>
      <Header showNav={false} />
      <div className={styles.body}>
        <h1 className={styles.pageTitle}>Affiliate Program</h1>

        {/* Section 1 — Referral Link */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Your Referral Link</h2>
          {loading ? (
            <div className={styles.skeletonRow} />
          ) : (
            <>
              <div className={styles.referralRow}>
                <input
                  className={styles.referralInput}
                  type="text"
                  readOnly
                  value={affiliate?.referral_url ?? ''}
                />
                <button
                  className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ''}`}
                  onClick={handleCopy}
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
              <p className={styles.referralSubtext}>
                Share this link. Earn 20% commission on every purchase your referrals make, for life.
              </p>
            </>
          )}
        </section>

        {/* Section 2 — Earnings Summary */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Earnings Summary</h2>
          {loading ? (
            <>
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
            </>
          ) : (
            <>
              <div className={styles.statsRow}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Pending</div>
                  <div className={styles.statValue}>{fmtUsd(affiliate?.balance_pending ?? 0)}</div>
                  <div className={styles.statSubtext}>Available to withdraw</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Paid Out</div>
                  <div className={styles.statValue}>{fmtUsd(affiliate?.balance_paid ?? 0)}</div>
                  <div className={styles.statSubtext}>Total earned and paid</div>
                </div>
              </div>
              <div className={styles.payoutRow}>
                <button
                  className={styles.payoutBtn}
                  onClick={handlePayout}
                  disabled={isPayoutDisabled}
                  title={payoutHint ?? undefined}
                >
                  {payoutLoading ? 'Requesting…' : 'Request Payout'}
                </button>
                {payoutHint && !payoutResult && (
                  <span className={styles.payoutHint}>{payoutHint}</span>
                )}
                {payoutResult && (
                  <span className={styles.payoutSuccess}>
                    Payout requested — ID: {payoutResult.payout_id}
                  </span>
                )}
              </div>
            </>
          )}
        </section>

        {/* Section 3 — Stripe Connect */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Bank Account</h2>
          {loading ? (
            <div className={styles.skeletonRow} />
          ) : affiliate?.connect_status === 'active' ? (
            <div className={styles.connectedBadge}>✓ Bank account connected</div>
          ) : (
            <div className={styles.connectCard}>
              <h3 className={styles.connectCardTitle}>Connect your bank account</h3>
              <p className={styles.connectCardBody}>
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
        </section>

        {/* Section 4 — Commission History */}
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Commission History</h2>
          {loading ? (
            <>
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
              <div className={styles.skeletonRow} />
            </>
          ) : events.length === 0 ? (
            <div className={styles.emptyState}>
              No commissions yet. Share your referral link to start earning.
            </div>
          ) : (
            <div className={styles.tableWrapper}>
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
                  {events.map((evt, i) => (
                    <tr key={i}>
                      <td>{fmtDate(evt.created_at)}</td>
                      <td>{evt.platform}</td>
                      <td>{fmtUsd(evt.gross_amount)}</td>
                      <td>{fmtUsd(evt.commission_amount)}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${
                            evt.status === 'paid' ? styles.statusPaid : styles.statusPending
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return <AuthGuard>{(session) => <AffiliateContent session={session} />}</AuthGuard>;
}
