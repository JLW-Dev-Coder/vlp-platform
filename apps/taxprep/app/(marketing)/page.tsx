import type { Metadata } from 'next'
import LandingPage from '@/components/marketing/LandingPage'

export const metadata: Metadata = {
  title: 'Tax Prep Pro — Productized service bureau buildouts',
  description:
    'Productized SuiteDash buildouts for service bureaus and credentialed tax practitioners. 8-phase client journey, branded portal, member training included.',
}

export default function HomePage() {
  return <LandingPage />
}
