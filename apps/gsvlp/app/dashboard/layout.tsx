'use client';

import { AppShell, AuthGate } from '@vlp/member-ui';
import { gsvlpConfig } from '@/lib/platform-config';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate apiBaseUrl={gsvlpConfig.apiBaseUrl}>
      <AppShell config={gsvlpConfig}>
        <style jsx global>{`
          aside nav > div > div.space-y-0\\.5 { display: flex; flex-direction: column; align-items: stretch; }
          aside nav > div > div.space-y-0\\.5 > div { display: block; width: 100%; box-sizing: border-box; }
          aside nav > div > div.space-y-0\\.5 > div > .flex.items-center { display: flex; width: 100%; box-sizing: border-box; }
          aside nav > div > div.space-y-0\\.5 > div > .flex.items-center > a,
          aside nav > div > div.space-y-0\\.5 > div > .flex.items-center > button {
            flex: 1 1 100% !important;
            width: 100% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
          }
        `}</style>
        {children}
      </AppShell>
    </AuthGate>
  );
}
