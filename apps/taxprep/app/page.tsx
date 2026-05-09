import { MarketingHeader } from '@vlp/member-ui'
import { tppConfig } from '@/lib/platform-config'
import LandingPage from '@/components/marketing/LandingPage'

// TPP homepage uses the bespoke SD-built landing page (LandingPage.tsx),
// which ships its own footer. The shared MarketingHeader from
// `@vlp/member-ui` renders above it so nav/mega-menu are unified across
// every TPP route. MarketingFooter is intentionally omitted — the homepage
// keeps its custom .tpp-footer until footer unification is decided.
export default function HomePage() {
  return (
    <div
      className="flex min-h-screen flex-col bg-surface-bg text-text-primary"
      data-theme={tppConfig.themeMode === 'light' ? 'light' : undefined}
    >
      <MarketingHeader config={tppConfig} />
      <main className="flex-1">
        <LandingPage />
      </main>
    </div>
  )
}
