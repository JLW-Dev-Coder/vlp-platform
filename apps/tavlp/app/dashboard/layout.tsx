'use client';

import { AppShell, AuthGate } from '@vlp/member-ui';
import { tavlpConfig } from '@/lib/platform-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate apiBaseUrl={tavlpConfig.apiBaseUrl}>
      <AppShell config={tavlpConfig}>{children}</AppShell>
    </AuthGate>
  );
}
