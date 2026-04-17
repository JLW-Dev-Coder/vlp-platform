'use client'

import Link from 'next/link'
import Script from 'next/script'
import { tcvlpConfig } from '@/lib/platform-config'

const CAL_LINK = 'tax-monitor-pro/tcvlp-intro'
const CAL_NAMESPACE = 'tcvlp-intro'
const CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'

// Icon components
function PhoneIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

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

function QuestionIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function TagIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
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

function UsersIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function InboxIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

const contactOptions = [
  {
    title: 'General questions',
    description: 'Ask about TaxClaim Pro features, Kwong eligibility, Form 843 preparation, or how the platform fits your firm.',
    icon: <QuestionIcon className="w-6 h-6 text-brand-primary" />,
    useCal: true,
  },
  {
    title: 'Pricing and plans',
    description: 'Starter, Professional, or Firm — ask about tier differences, volume limits, or annual billing.',
    icon: <TagIcon className="w-6 h-6 text-brand-primary" />,
    useCal: true,
  },
  {
    title: 'Product demo',
    description: 'See the Form 843 generator, branded client intake, and Kwong eligibility checker in action.',
    icon: <CalendarIcon className="w-6 h-6 text-brand-primary" />,
    useCal: true,
  },
  {
    title: 'Account and billing',
    description: 'Subscription changes, invoices, payment updates, or questions tied to your current TaxClaim Pro account.',
    icon: <InboxIcon className="w-6 h-6 text-brand-primary" />,
    useCal: true,
  },
]

const trustItems = [
  {
    title: 'Kwong-aware guidance',
    description: 'We built TaxClaim Pro around the Kwong v. US ruling and its July 10, 2026 deadline. Our team knows the eligibility window and the Form 843 mechanics.',
  },
  {
    title: 'No commitment to book',
    description: 'Scheduling a call, asking a question, or requesting a demo does not obligate you to subscribe. Every conversation is a conversation, not a sales trap.',
  },
  {
    title: 'Subscription clarity',
    description: 'Pricing is public, limits are documented, and cancellation happens inside your dashboard. No hidden terms, no retention playbooks.',
  },
  {
    title: 'Data privacy',
    description: 'Your questions, firm details, and any transcript data you share stay private. We do not resell or repurpose any information shared during contact or demo.',
  },
]

const processSteps = [
  { step: 1, title: 'You reach out', desc: 'Book a call, send an email, or tap a topic card that matches what you need.' },
  { step: 2, title: 'We review', desc: 'We read your message and route it to the right person: sales, support, or product.' },
  { step: 3, title: 'We respond', desc: 'Expect a response by email or a confirmed call slot, usually within one business day.' },
  { step: 4, title: 'You decide', desc: 'No pressure to subscribe. Most conversations end with information, not obligation.' },
]

export default function ContactPage() {
  const { businessInfo } = tcvlpConfig
  if (!businessInfo) {
    throw new Error('ContactPage: tcvlpConfig.businessInfo is required.')
  }
  const { phone, supportEmail } = businessInfo
  const phoneDigits = phone ? phone.replace(/[^0-9+]/g, '') : ''

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          {/* Trust badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <CheckCircleIcon className="w-4 h-4 text-brand-primary" />
            <span className="text-sm text-text-muted">Talk to us about Form 843, Kwong eligibility, pricing, or the product.</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Contact{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              TaxClaim Pro
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Reach out about subscriptions, Form 843 preparation, Kwong ruling questions, or how TaxClaim Pro fits your tax practice.
          </p>

          {/* Phone */}
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

          {/* Primary CTAs */}
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

          {/* Pill row */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#contact-options" className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all focus-visible:outline-none focus-visible:shadow-focus">
              Choose a topic
            </a>
            <a href="#what-happens-next" className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all focus-visible:outline-none focus-visible:shadow-focus">
              What happens next
            </a>
            <a href="#trust" className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all focus-visible:outline-none focus-visible:shadow-focus">
              What to expect
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Contact options */}
      <section id="contact-options" className="w-full px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Choose the right topic</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">Every path leads to the same team, but choosing the right topic helps us respond faster.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactOptions.map((opt) => (
              <button
                key={opt.title}
                type="button"
                data-cal-namespace={CAL_NAMESPACE}
                data-cal-link={CAL_LINK}
                data-cal-config={CAL_CONFIG}
                className="text-left flex items-start gap-4 p-6 rounded-2xl bg-surface-card border border-subtle hover:border-brand-primary/40 hover:-translate-y-1 transition-all duration-base focus-visible:outline-none focus-visible:shadow-focus"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-surface-bg flex items-center justify-center border border-subtle">
                  {opt.icon}
                </div>
                <div>
                  <div className="text-lg font-semibold text-text-primary mb-1">{opt.title}</div>
                  <div className="text-sm text-text-muted">{opt.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Choose Your Path */}
      <section className="w-full px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">Start with the path that fits</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">Book live or reach us async — both paths get you a person, not a queue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Book live */}
            <div className="p-8 rounded-3xl bg-surface-card border border-subtle text-center hover:border-brand-primary/40 transition-all duration-base">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-gradient-to/10 flex items-center justify-center border border-subtle">
                <CalendarIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Book a consultation</h3>
              <p className="text-text-muted mb-8">
                Pick a time that works. Real conversation with the team — product questions, Kwong strategy, or a guided demo.
              </p>
              <button
                type="button"
                data-cal-namespace={CAL_NAMESPACE}
                data-cal-link={CAL_LINK}
                data-cal-config={CAL_CONFIG}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
              >
                <CalendarIcon className="w-5 h-5" />
                Book a call
              </button>
            </div>

            {/* Email async */}
            <div className="p-8 rounded-3xl bg-surface-card border border-subtle text-center hover:border-brand-primary/40 transition-all duration-base">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-gradient-to/10 flex items-center justify-center border border-subtle">
                <MailIcon className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Email us directly</h3>
              <p className="text-text-muted mb-8">
                Prefer writing? Send a message and we&apos;ll respond within one business day with a clear next step.
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-base font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
              >
                <MailIcon className="w-5 h-5" />
                {supportEmail}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* What happens next */}
      <section id="what-happens-next" className="w-full px-4 py-20 md:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">What happens after you reach out</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">A simple, transparent process from first contact to answer.</p>
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

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Trust */}
      <section id="trust" className="w-full px-4 py-20 md:py-28 bg-surface-card">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">What you can expect from TaxClaim Pro</h2>
            <p className="text-text-muted text-lg max-w-xl mx-auto">The contact experience reflects how we actually work — no pressure, no tricks.</p>
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

      {/* Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Final CTA */}
      <section className="w-full px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
            Ready to{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              work Kwong claims at scale
            </span>
            ?
          </h2>
          <p className="text-text-muted text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Book a quick call or email us. Most conversations end with a clear next step — and often, that&apos;s a free demo account.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button
              type="button"
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={CAL_LINK}
              data-cal-config={CAL_CONFIG}
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-xl hover:scale-105 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              <CalendarIcon className="w-5 h-5" />
              Book a call
            </button>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg text-lg font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              See pricing
            </Link>
          </div>
          <p className="text-sm text-text-muted">
            Your inquiry stays private. No obligation to subscribe.
          </p>
        </div>
      </section>

      {/* Cal.com init script — element-click popup pattern */}
      <Script id="cal-init-tcvlp-intro" strategy="afterInteractive">{`
(function (C, A, L) { let p = function (a, ar) { a.q.push(ar); }; let d = C.document; C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api;p(cal.ns[namespace], ar);p(cal, ["initNamespace", namespace]);} else p(cal, ar); return;} p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "tcvlp-intro", {origin:"https://app.cal.com"});
Cal.ns["tcvlp-intro"]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":"#f97316"}},"hideEventTypeDetails":false,"layout":"month_view"});
`}</Script>
    </>
  )
}
