'use client'

import { useEffect, useState } from 'react'
import type { PlatformConfig } from '../types/config'

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void
      ns: Record<string, (action: string, ...args: unknown[]) => void>
      loaded?: boolean
    }
  }
}

export interface HelpTopic {
  id: string
  title: string
  body: string[]
  links?: Array<{ label: string; href: string }>
}

export interface HelpCenterProps {
  config: PlatformConfig
  topics: HelpTopic[]
  contactPath?: string
}

function TopicModal({
  topic,
  onClose,
  brandColor,
}: {
  topic: HelpTopic
  onClose: () => void
  brandColor: string
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`help-topic-${topic.id}`}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <h2 id={`help-topic-${topic.id}`} className="mb-4 pr-8 text-2xl font-semibold text-slate-900">
          {topic.title}
        </h2>
        <div className="space-y-4">
          {topic.body.map((para, i) => (
            <p key={i} className="leading-relaxed text-slate-700">
              {para}
            </p>
          ))}
        </div>
        {topic.links && topic.links.length > 0 && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
              Related
            </h3>
            <ul className="space-y-2">
              {topic.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm font-medium hover:underline"
                    style={{ color: brandColor }}
                  >
                    {link.label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function HelpCenter({ config, topics, contactPath = '/contact' }: HelpCenterProps) {
  const [activeTopic, setActiveTopic] = useState<HelpTopic | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const brandColor = config.brandColor

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initNamespace = () => {
      const Cal = window.Cal
      if (!Cal) return
      Cal('init', config.calBookingNamespace, {
        origin: 'https://app.cal.com',
      })
      Cal.ns[config.calBookingNamespace]('ui', {
        cssVarsPerTheme: {
          light: { 'cal-brand': '#292929' },
          dark: { 'cal-brand': brandColor },
        },
        hideEventTypeDetails: false,
        layout: 'month_view',
      })
    }

    if (window.Cal) {
      initNamespace()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    script.onload = initNamespace
    document.head.appendChild(script)
  }, [config.calBookingNamespace, brandColor])

  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {config.brandName} Help Center
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-300">
            Answers, guides, and support for getting the most out of {config.brandName}.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topics.map((topic) => (
              <div
                key={topic.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveTopic(topic)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActiveTopic(topic)
                  }
                }}
                onMouseEnter={() => setHoveredCard(topic.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group cursor-pointer rounded-2xl border-2 border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  borderColor: hoveredCard === topic.id ? brandColor : undefined,
                }}
              >
                <h3 className="mb-2 text-lg font-semibold text-slate-900">{topic.title}</h3>
                <p className="line-clamp-3 text-sm text-slate-600">{topic.body[0]}</p>
                <span
                  className="mt-4 inline-block text-sm font-medium"
                  style={{ color: brandColor }}
                >
                  Read more →
                </span>
              </div>
            ))}

            <div
              role="button"
              tabIndex={0}
              data-cal-link={config.calBookingSlug}
              data-cal-namespace={config.calBookingNamespace}
              data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  ;(e.currentTarget as HTMLElement).click()
                }
              }}
              onMouseEnter={() => setHoveredCard('__book__')}
              onMouseLeave={() => setHoveredCard(null)}
              className="cursor-pointer rounded-2xl border-2 p-6 text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                backgroundColor: brandColor,
                borderColor: hoveredCard === '__book__' ? brandColor : 'transparent',
              }}
            >
              <h3 className="mb-2 text-lg font-semibold">Book a Call</h3>
              <p className="text-sm text-white/90">
                Schedule time with our team — 15 minute virtual meeting.
              </p>
              <span className="mt-4 inline-block text-sm font-medium text-white">
                Pick a time →
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 text-3xl font-bold">Still need help?</h2>
          <p className="mb-8 text-slate-300">
            Reach out and a real human will get back to you.
          </p>
          <a
            href={contactPath}
            className="inline-block rounded-lg px-8 py-3 font-semibold text-white shadow-md transition-transform hover:scale-105"
            style={{
              background: `linear-gradient(135deg, ${brandColor}, ${brandColor}dd)`,
            }}
          >
            Contact Support
          </a>
        </div>
      </section>

      {activeTopic && (
        <TopicModal
          topic={activeTopic}
          onClose={() => setActiveTopic(null)}
          brandColor={brandColor}
        />
      )}
    </>
  )
}
