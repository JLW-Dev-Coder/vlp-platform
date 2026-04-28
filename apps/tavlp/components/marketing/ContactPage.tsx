'use client'

import Link from 'next/link'
import Script from 'next/script'
import { tavlpConfig } from '@/lib/platform-config'

const CAL_LINK = tavlpConfig.calIntroSlug
const CAL_NAMESPACE = tavlpConfig.calIntroNamespace
const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
const API_BASE = tavlpConfig.apiBaseUrl

function MailIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function CalendarIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function CheckCircleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

const trustItems = [
  {
    title: 'Done-for-you channel',
    description: 'You pick an avatar. We handle scripting, recording, editing, publishing, and growth. You stay focused on tax work.',
  },
  {
    title: 'Add-on, not replacement',
    description: 'Tax Avatar Pro is a $29/mo add-on to TaxClaim Pro. Your existing client work and tools stay exactly where they are.',
  },
  {
    title: 'Transparent pricing',
    description: 'Public pricing, monthly billing, cancel anytime inside your dashboard. No setup fees, no annual contracts.',
  },
  {
    title: 'Your channel, your audience',
    description: 'The YouTube channel and the audience you build belong to you. We hand off cleanly if you ever want to go in-house.',
  },
]

const processSteps = [
  { step: 1, title: 'You reach out', desc: 'Book a call or email and tell us about your tax practice.' },
  { step: 2, title: 'Pick an avatar', desc: 'We walk you through the roster and help you choose the right host.' },
  { step: 3, title: 'We launch', desc: 'Channel set up, first episodes scripted and recorded, publishing schedule live.' },
  { step: 4, title: 'It runs', desc: 'New episodes drop on a steady cadence. You get monthly performance reports.' },
]

export default function ContactPage() {
  const { businessInfo } = tavlpConfig
  if (!businessInfo) {
    throw new Error('ContactPage: tavlpConfig.businessInfo is required.')
  }
  const { phone, supportEmail } = businessInfo
  const phoneDigits = phone ? phone.replace(/[^0-9+]/g, '') : ''

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <CheckCircleIcon className="w-4 h-4 text-brand-primary" />
            <span className="text-sm text-text-muted">Talk to us about your AI YouTube channel.</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Contact{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Tax Avatar Pro
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Reach out about avatars, pricing, channel setup, or how Tax Avatar Pro fits your tax practice.
          </p>

          {phone && (
            <div className="mb-10">
              <a
                href={`tel:${phoneDigits}`}
                className="block text-3xl md:text-5xl font-bold text-brand-primary hover:text-brand-hover transition-colors focus-visible:outline-none focus-visible:shadow-focus"
              >
                {phone}
              </a>
              <p className="mt-2 text-sm text-text-muted">Sales, support, demos, and general questions</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              type="button"
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={CAL_LINK}
              data-cal-config={CAL_CONFIG}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              <CalendarIcon className="w-5 h-5" />
              Book a call
            </button>
            <a
              href={`mailto:${supportEmail}`}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              <MailIcon className="w-5 h-5" />
              Email us
            </a>
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Quick contact form */}
      <section id="contact-form" className="w-full px-4 py-20 md:py-28">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Send us a message</h2>
            <p className="text-text-muted">We read every message and respond within one business day.</p>
          </div>
          <form
            action={`${API_BASE}/v1/contact/submit`}
            method="POST"
            className="space-y-4 p-8 rounded-2xl bg-surface-card border border-subtle"
          >
            <input type="hidden" name="platform" value="tavlp" />
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-lg bg-surface-bg border border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg bg-surface-bg border border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-lg bg-surface-bg border border-subtle px-4 py-3 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Send message
            </button>
          </form>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* What happens next */}
      <section className="w-full px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">What happens next</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">From first conversation to live channel.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-brand-primary to-brand-gradient-to flex items-center justify-center text-lg font-bold text-brand-text-on-primary">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-text-muted text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Trust */}
      <section className="w-full px-4 py-20 md:py-28 bg-surface-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">What you can expect</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-6 rounded-2xl bg-surface-bg border border-subtle">
                <div className="shrink-0 mt-0.5">
                  <CheckCircleIcon className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text-primary mb-1">{item.title}</h3>
                  <p className="text-sm text-text-muted">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Final CTA */}
      <section className="w-full px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              launch your channel
            </span>
            ?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              type="button"
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={CAL_LINK}
              data-cal-config={CAL_CONFIG}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-xl hover:scale-105 transition-all"
            >
              <CalendarIcon className="w-5 h-5" />
              Book a call
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg text-lg font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Cal.com init script */}
      <Script id="cal-init-tavlp-intro" strategy="afterInteractive">{`
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", ${JSON.stringify(CAL_NAMESPACE)}, {origin:"https://app.cal.com"});
Cal.ns[${JSON.stringify(CAL_NAMESPACE)}]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":${JSON.stringify(tavlpConfig.brandColor)}}},"hideEventTypeDetails":false,"layout":"month_view"});
`}</Script>
    </>
  )
}
