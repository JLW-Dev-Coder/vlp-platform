'use client';

import { AppShell, AuthGate } from '@vlp/member-ui';
import { gsvlpConfig } from '@/lib/platform-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate apiBaseUrl={gsvlpConfig.apiBaseUrl}>
      <AppShell config={gsvlpConfig}>
        <style jsx global>{`
          aside nav > div > div > div { width: 100%; }
          aside nav a, aside nav button { width: 100%; box-sizing: border-box; }
        `}</style>
        {children}
      </AppShell>
    </AuthGate>
  );
}
