'use client';

import { AppShell, AuthGate, useAppShell } from '@vlp/member-ui';
import { wlvlpConfig } from '@/lib/platform-config';
import { BuyerProvider } from '@/lib/account-context';

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { session } = useAppShell();
  return (
    <BuyerProvider accountId={session.account_id}>
      {children}
    </BuyerProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate apiBaseUrl={wlvlpConfig.apiBaseUrl}>
      <AppShell config={wlvlpConfig}>
        <DashboardInner>{children}</DashboardInner>
      </AppShell>
    </AuthGate>
  );
}
