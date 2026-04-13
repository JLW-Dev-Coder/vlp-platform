'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ClaimLoader from './ClaimLoader';

function ClaimContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') ?? '';

  if (!slug) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>No claim slug provided.</div>
      </div>
    );
  }

  return <ClaimLoader slug={slug} />;
}

export default function ClaimPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f1117' }}>
        <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading…</div>
      </div>
    }>
      <ClaimContent />
    </Suspense>
  );
}
