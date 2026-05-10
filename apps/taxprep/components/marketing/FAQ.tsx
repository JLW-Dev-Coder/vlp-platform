'use client'

import { useState } from 'react'

type FaqItem = { question: string; answer: string }

const DEFAULT_ITEMS: FaqItem[] = [
  {
    question: 'What exactly is Tax Prep Pro?',
    answer:
      'Tax Prep Pro is a managed SuiteDash workspace, configured for tax practitioners, that handles client intake, document collection, e-signature, and the full 8-phase return journey from first contact to filing. We build it under our reseller, brand it for your firm, and hand you the keys — you don’t need to learn SuiteDash from scratch or hire a workflow consultant.',
  },
  {
    question: 'Do I need to be a service bureau or credentialed preparer?',
    answer:
      'TPP is built for credentialed practitioners (CPAs, EAs, AFSPs) and service bureau owners running multiple preparers. If you’re a solo preparer just starting out, the workflow may be more than you need yet — book a Discovery Call and we’ll tell you straight whether TPP fits your stage.',
  },
  {
    question: 'How long does the buildout take?',
    answer:
      'About 30 days from your Discovery Call to a live workspace, assuming we have your branding assets and you’re available for the training session. The 8-phase journey, intake forms, e-signature flow, and member training are all included in the one-time $5,000 setup.',
  },
  {
    question: 'Can my members access their own portal?',
    answer:
      'Yes — that’s the Tax Prep Pro + Members tier. Each active member gets their own SuiteDash login, intake forms, document vault, and e-signature flow under your branded workspace. Pricing is $779/mo per active member on top of the $5,000 setup.',
  },
  {
    question: 'What happens after the buildout — am I on my own?',
    answer:
      'You can be, or you can keep us on retainer. The Ongoing Support tier ($497/mo) gets you SuiteDash admin coverage, workflow tuning between filing seasons, intake-field updates, and priority response during peak weeks. Optional add-on to either of the other tiers.',
  },
  {
    question: 'What if I already use SuiteDash?',
    answer:
      'Great — the workspace migrates cleanly. We assess what you have, map it to the 8-phase journey, and either rebuild on a fresh workspace under our reseller (cleanest) or refactor your existing one. Discovery Call is the right first step to figure out which path fits.',
  },
]

export default function FAQ({ items = DEFAULT_ITEMS }: { items?: FaqItem[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set())

  const toggle = (idx: number) => {
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  return (
    <div className="mx-auto max-w-[800px] px-6 md:px-8">
      <ul className="border-t border-tpp-rose/20">
        {items.map((item, idx) => {
          const isOpen = open.has(idx)
          const panelId = `tpp-faq-panel-${idx}`
          return (
            <li key={idx} className="border-b border-tpp-rose/20">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-semibold text-tpp-noir transition-colors hover:text-tpp-crimson focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tpp-rose focus-visible:ring-offset-2 focus-visible:ring-offset-tpp-champagne"
              >
                <span className="text-base md:text-lg leading-snug">{item.question}</span>
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`flex-shrink-0 text-tpp-rose transition-transform duration-300 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <div
                id={panelId}
                role="region"
                className={`grid overflow-hidden transition-all duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[15px] leading-relaxed text-tpp-noir/75">{item.answer}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
