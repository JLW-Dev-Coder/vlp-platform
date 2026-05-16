'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';

interface Receipt {
  submission_id: string;
  created_at: string;
  taxpayer_name: string;
  tax_year: string;
  penalty_type: string;
  penalty_amount: number;
  status: string;
  pro_name: string;
  pro_firm: string;
  pro_phone: string;
}

const PENALTY_LABELS: Record<string, string> = {
  'failure-to-file': 'Failure-to-File',
  'failure-to-pay': 'Failure-to-Pay',
  'estimated-tax': 'Estimated Tax',
};

function humanPenaltyType(raw: string): string {
  if (!raw) return 'Penalty';
  return PENALTY_LABELS[raw] ?? raw;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPhoneLink(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

function ReceiptContent() {
  const searchParams = useSearchParams();
  const submissionId = searchParams.get('id') ?? '';
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!submissionId) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/v1/tcvlp/forms/843/${submissionId}/receipt`);
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          if (data?.ok && data.receipt) setReceipt(data.receipt);
          else setError('Unable to load submission.');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [submissionId]);

  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: 'var(--color-bg)',
    color: 'var(--color-text-1)',
    fontFamily: 'var(--font-body)',
  };
  const header: React.CSSProperties = {
    borderBottom: '1px solid var(--color-border)',
    background: 'rgba(15, 17, 23, 0.92)',
    backdropFilter: 'blur(12px)',
  };
  const headerInner: React.CSSProperties = {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '0.875rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };
  const logo: React.CSSProperties = {
    width: '2rem',
    height: '2rem',
    borderRadius: '0.5rem',
    background: '#eab308',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1a1a2e',
    fontWeight: 700,
    fontSize: '0.875rem',
  };
  const main: React.CSSProperties = {
    maxWidth: '720px',
    margin: '0 auto',
    padding: '2rem 1rem 4rem',
  };
  const card: React.CSSProperties = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1rem',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '0.8125rem',
    color: 'var(--color-text-3, #9ca3af)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
  const valueStyle: React.CSSProperties = {
    fontSize: '0.9375rem',
    color: 'var(--color-text-1)',
    fontWeight: 600,
    marginTop: '0.25rem',
  };
  const rowGrid: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  };
  const secondaryLink: React.CSSProperties = {
    color: '#eab308',
    textDecoration: 'underline',
    fontSize: '0.9375rem',
  };
  const badgeStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    background: receipt?.status === 'submitted' ? '#22c55e' : '#6b7280',
    color: '#0a0a0f',
  };

  return (
    <div style={wrap}>
      <header style={header}>
        <div style={headerInner}>
          <div style={logo}>T</div>
          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>TaxClaim Pro</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-3, #9ca3af)' }}>
              taxclaim.virtuallaunch.pro
            </div>
          </div>
        </div>
      </header>

      <main style={main}>
        {loading && (
          <div style={card}>
            <p style={{ margin: 0, color: 'var(--color-text-2)' }}>Loading your submission…</p>
          </div>
        )}

        {!loading && notFound && (
          <div style={card}>
            <h1 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)' }}>Submission Not Found</h1>
            <p style={{ margin: 0, color: 'var(--color-text-2)' }}>
              We couldn&apos;t find a submission for this link. Please check the URL or contact your tax professional.
            </p>
          </div>
        )}

        {!loading && !notFound && error && (
          <div style={{ ...card, borderColor: '#ef4444' }}>
            <p style={{ margin: 0, color: '#ef4444' }}>{error}</p>
          </div>
        )}

        {!loading && receipt && (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <h1 style={{ margin: '0 0 0.5rem', fontFamily: 'var(--font-display)', fontSize: '1.75rem' }}>
                Your Form 843 Submission
              </h1>
              <p style={{ margin: 0, color: 'var(--color-text-2)' }}>
                Keep this page for your records.
              </p>
            </div>

            <div style={card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={labelStyle}>Submission ID</div>
                  <div style={{ ...valueStyle, fontFamily: 'monospace', fontSize: '0.8125rem', wordBreak: 'break-all' }}>
                    {receipt.submission_id}
                  </div>
                </div>
                <span style={badgeStyle}>{receipt.status}</span>
              </div>

              <div style={rowGrid}>
                <div>
                  <div style={labelStyle}>Date Submitted</div>
                  <div style={valueStyle}>{formatDate(receipt.created_at)}</div>
                </div>
                <div>
                  <div style={labelStyle}>Taxpayer</div>
                  <div style={valueStyle}>{receipt.taxpayer_name}</div>
                </div>
                <div>
                  <div style={labelStyle}>Tax Year</div>
                  <div style={valueStyle}>{receipt.tax_year}</div>
                </div>
                <div>
                  <div style={labelStyle}>Penalty Type</div>
                  <div style={valueStyle}>{humanPenaltyType(receipt.penalty_type)}</div>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border)' }}>
                <div style={labelStyle}>Amount Claimed</div>
                <div style={{ ...valueStyle, fontSize: '1.75rem', color: '#eab308' }}>
                  {formatCurrency(receipt.penalty_amount)}
                </div>
              </div>
            </div>

            {(receipt.pro_name || receipt.pro_firm || receipt.pro_phone) && (
              <div style={card}>
                <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontFamily: 'var(--font-display)' }}>
                  Your Tax Professional
                </h2>
                {receipt.pro_name && (
                  <div style={{ fontSize: '0.9375rem', fontWeight: 600 }}>{receipt.pro_name}</div>
                )}
                {receipt.pro_firm && receipt.pro_firm !== receipt.pro_name && (
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-2)', marginTop: '0.125rem' }}>
                    {receipt.pro_firm}
                  </div>
                )}
                {receipt.pro_phone && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <a href={`tel:${formatPhoneLink(receipt.pro_phone)}`} style={secondaryLink}>
                      {receipt.pro_phone}
                    </a>
                  </div>
                )}
                <p style={{ margin: '0.875rem 0 0', fontSize: '0.875rem', color: 'var(--color-text-2)' }}>
                  If you have questions about your claim, contact your tax professional directly.
                </p>
              </div>
            )}

            <div style={card}>
              <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', fontFamily: 'var(--font-display)' }}>
                Resources
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://www.irs.gov/pub/irs-pdf/f843.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={secondaryLink}
                >
                  Download Official Form 843 →
                </a>
                <Link href="/news" style={secondaryLink}>
                  Learn more about the Kwong claim →
                </Link>
                <Link href="/gala" style={secondaryLink}>
                  Talk to Gala →
                </Link>
              </div>
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.8125rem', color: 'var(--color-text-3, #9ca3af)', textAlign: 'center' }}>
              This is a preparation guide receipt — not an official IRS document. Your tax professional will advise you on next steps.
            </p>
          </>
        )}
      </main>
    </div>
  );
}

export default function ReceiptPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--color-bg)' }} />}>
      <ReceiptContent />
    </Suspense>
  );
}
