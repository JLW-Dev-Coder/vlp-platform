import LandingPage from '@/components/marketing/LandingPage'

// TPP homepage uses the bespoke SD-built landing page (LandingPage.tsx),
// which ships its own header + footer. It deliberately lives OUTSIDE the
// `(marketing)` route group so the shared MarketingHeader/MarketingFooter
// from `@vlp/member-ui` do not stack on top of the ported SD chrome.
export default function HomePage() {
  return <LandingPage />
}
