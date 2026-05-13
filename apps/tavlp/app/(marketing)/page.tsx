import type { Metadata } from 'next'
import LandingPage from '@/components/marketing/LandingPage'

export const metadata: Metadata = {
  title: 'Tax Avatar Pro — AI YouTube Channels for Tax Professionals',
  description:
    'We build and manage a faceless AI YouTube channel for your tax practice. Your AI avatar publishes content tailored to your practice area that drives qualified leads to your branded intake page. Plans starting at $49/mo.',
}

export default function HomePage() {
  return <LandingPage />
}
