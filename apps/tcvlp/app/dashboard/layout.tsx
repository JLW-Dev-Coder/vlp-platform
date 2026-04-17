'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, AuthGate, useAppShell } from '@vlp/member-ui';
import { tcvlpConfig } from '@/lib/platform-config';
import {
  TaxProProvider,
  SubscriptionStatusProvider,
  useTaxPro,
} from '@/lib/account-context';

function OnboardingGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: pro, loading } = useTaxPro();

  useEffect(() => {
    if (!loading && pro === null) {
      router.replace('/onboarding');
    }
  }, [loading, pro, router]);

  if (loading || pro === null) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-[var(--member-text-muted)]">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { session } = useAppShell();
  return (
    <TaxProProvider accountId={session.account_id}>
      <SubscriptionStatusProvider accountId={session.account_id}>
        <OnboardingGate>{children}</OnboardingGate>
      </SubscriptionStatusProvider>
    </TaxProProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate apiBaseUrl={tcvlpConfig.apiBaseUrl}>
      <AppShell config={tcvlpConfig}>
        <DashboardInner>{children}</DashboardInner>
      </AppShell>
    </AuthGate>
  );
}
