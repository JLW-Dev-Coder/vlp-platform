'use client';

import { AppShell, AuthGate } from '@vlp/member-ui';
import { gsvlpConfig } from '@/lib/platform-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate apiBaseUrl={gsvlpConfig.apiBaseUrl}>
      <AppShell config={gsvlpConfig}>{children}</AppShell>
    </AuthGate>
  );
}
