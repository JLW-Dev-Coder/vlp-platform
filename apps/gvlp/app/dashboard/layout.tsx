'use client';

import { AppShell, AuthGate } from '@vlp/member-ui';
import { gvlpConfig } from '@/lib/platform-config';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGate apiBaseUrl={gvlpConfig.apiBaseUrl}>
      <AppShell config={gvlpConfig}>{children}</AppShell>
    </AuthGate>
  );
}
