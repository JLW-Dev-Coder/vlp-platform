'use client';

import { AppShell, AdminGate } from '@vlp/member-ui';
import { dvlpConfig } from '@/lib/platform-config';

export default function OperatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate apiBaseUrl={dvlpConfig.apiBaseUrl}>
      <AppShell config={dvlpConfig}>{children}</AppShell>
    </AdminGate>
  );
}
