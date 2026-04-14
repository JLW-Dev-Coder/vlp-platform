'use client'

import { useState } from 'react'
import { ContentCard } from '@vlp/member-ui'
import { TmpAppShell } from '@/components/TmpAppShell'
import AuthGuard from '@/components/AuthGuard'

interface FaqItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I add a professional to my monitoring list?',
    answer:
      'Navigate to the Directory page and find a licensed tax professional. Click their profile to view details, then use the "Add to Monitoring" button. Once added, you\'ll receive alerts whenever their transcript records change.',
  },
  {
    question: 'How does transcript change detection work?',
    answer:
      'Tax Monitor Pro periodically checks IRS transcript records for changes. When a change is detected — such as a new filing, adjusted balance, or status update — you\'ll receive a notification in your dashboard and via email (if enabled). Changes are compared against the last known snapshot stored securely in your account.',
  },
  {
    question: 'How do I purchase tokens?',
    answer:
      'Go to your Dashboard and select "Tokens" from the sidebar. Choose a token package that fits your needs and complete the purchase via our secure Stripe checkout. Tokens are credited instantly and can be used for transcript pulls, report generation, and other premium features.',
  },
  {
    question: 'How do I contact support?',
    answer:
      'You can reach our support team by navigating to the Support page from the sidebar. Submit a ticket describing your issue and our team will respond within 24 hours. For urgent matters, include "URGENT" in your ticket subject.',
  },
  {
    question: 'What is the affiliate program?',
    answer:
      'The Tax Monitor Pro affiliate program lets you earn a 20% lifetime commission on every referral who becomes a paying member. Visit the Affiliate page in your dashboard to get your unique referral link. Commissions are paid out monthly via Stripe Connect.',
  },
]

export default function HelpPage() {
  return (
    <AuthGuard>
      {() => (
        <TmpAppShell>
          <HelpContent />
        </TmpAppShell>
      )}
    </AuthGuard>
  )
}

function HelpContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Help Center</h1>
        <p className="mt-2 text-sm text-white/50">
          Find answers to common questions about Tax Monitor Pro.
        </p>
      </div>

      <ContentCard title="Frequently Asked Questions">
        <div className="divide-y divide-white/[0.06]">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="flex w-full items-center justify-between py-4 text-left text-sm font-medium text-white/80 transition hover:text-white"
              >
                <span>{item.question}</span>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  className={`shrink-0 ml-4 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === idx && (
                <div className="pb-4 text-sm leading-relaxed text-white/50">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </ContentCard>

      <ContentCard title="Still need help?">
        <p className="text-sm text-white/50">
          Can&apos;t find what you&apos;re looking for? Our support team is here to help.
        </p>
        <a
          href="/support"
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/70 transition hover:bg-white/[0.1] hover:text-white"
        >
          Contact Support
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </ContentCard>
    </div>
  )
}
