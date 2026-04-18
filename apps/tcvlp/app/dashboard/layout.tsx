'use client';

import { AppShell, AuthGate, useAppShell } from '@vlp/member-ui';
import { tcvlpConfig } from '@/lib/platform-config';
import {
  TaxProProvider,
  SubscriptionStatusProvider,
} from '@/lib/account-context';

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { session } = useAppShell();
  return (
    <TaxProProvider accountId={session.account_id}>
      <SubscriptionStatusProvider accountId={session.account_id}>
        {children}
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
