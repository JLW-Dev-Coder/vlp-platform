'use client';

import { AppShell, AuthGate, useAppShell } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';
import { OperatorProvider } from '@/lib/operator-context';

function DashboardInner({ children }: { children: React.ReactNode }) {
  const { session } = useAppShell();
  return (
    <OperatorProvider accountId={session.account_id}>
      {children}
    </OperatorProvider>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate apiBaseUrl={gvlpConfig.apiBaseUrl}>
      <AppShell config={gvlpConfig}>
        <DashboardInner>{children}</DashboardInner>
      </AppShell>
    </AuthGate>
  );
}
