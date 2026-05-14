'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { gsvlpConfig } from '@/lib/platform-config';

function SignInRedirect() {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/dashboard';

  useEffect(() => {
    const returnTo = `https://growthsetters.virtuallaunch.pro${redirect.startsWith('/') ? redirect : `/${redirect}`}`;
    const qs = `?return_to=${encodeURIComponent(returnTo)}`;
    window.location.replace(`${gsvlpConfig.apiBaseUrl}/v1/auth/google/start${qs}`);
  }, [redirect]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f1117', color: '#9ca3af', fontFamily: 'system-ui, sans-serif' }}>
      <p>Redirecting to Google sign-in…</p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInRedirect />
    </Suspense>
  );
}
