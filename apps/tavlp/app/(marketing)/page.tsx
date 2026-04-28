import type { Metadata } from 'next'
import LandingPage from '@/components/marketing/LandingPage'

export const metadata: Metadata = {
  title: 'Tax Avatar Pro — AI YouTube Channels for Tax Professionals',
  description:
    'We build and manage a faceless AI YouTube channel for your tax practice. Your AI avatar publishes IRS code explainers that drive qualified leads to your branded intake page. $29/mo.',
}

export default function HomePage() {
  return <LandingPage />
}
