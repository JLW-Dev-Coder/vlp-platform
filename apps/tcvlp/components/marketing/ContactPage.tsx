'use client'

import Script from 'next/script'
import Link from 'next/link'
import { tcvlpConfig } from '@/lib/platform-config'

const CAL_LINK = 'tax-claim-virtual-launch-pro'
const CAL_NAMESPACE = 'tax-claim-virtual-launch-pro'

function PhoneIcon() {
  return (
    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg className="w-5 h-5 text-brand-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

export default function ContactPage() {
  const { businessInfo } = tcvlpConfig
  if (!businessInfo) {
    throw new Error('ContactPage: tcvlpConfig.businessInfo is required.')
  }
  const { address, phone, supportEmail } = businessInfo
  const formattedAddress = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.zip}`,
  ].filter(Boolean)

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="cal-init-general"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function (C, A, L) {
  let p = function (a, ar) { a.q.push(ar); };
  let d = C.document;
  C.Cal = C.Cal || function () {
    let cal = C.Cal; let ar = arguments;
    if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; }
    if (ar[0] === L) { const api = function () { p(api, arguments); }; const namespace = ar[1]; api.q = api.q || []; if(typeof namespace === "string"){cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]);} else p(cal, ar); return; }
    p(cal, ar);
  };
})(window, "https://app.cal.com/embed/embed.js", "init");
Cal("init", "tax-claim-virtual-launch-pro", {origin:"https://app.cal.com"});
Cal.ns["tax-claim-virtual-launch-pro"]("ui", {"cssVarsPerTheme":{"light":{"cal-brand":"#292929"},"dark":{"cal-brand":"#f97316"}},"hideEventTypeDetails":false,"layout":"month_view"});
`,
        }}
      />

      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <svg className="h-4 w-4 text-brand-primary" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-text-muted">Talk to us about Form 843, Kwong eligibility, or TaxClaim Pro pricing.</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Get in touch
          </h1>

          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Book a call, send us an email, or reach out by phone. We&apos;re based in El Cajon, California, and we answer inquiries about tax professional subscriptions, Kwong-eligible client intake, and Form 843 preparation.
          </p>
        </div>
      </section>

      {/* Contact card + Cal embed */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-16 md:pb-24 w-full">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          {/* Contact info card */}
          <div className="rounded-2xl border border-subtle bg-surface-card p-8 h-fit">
            <h2 className="text-lg font-semibold text-text-primary mb-6">Direct contact</h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPinIcon />
                <div className="text-sm text-text-muted">
                  <div className="font-semibold text-text-primary mb-0.5">{businessInfo.legalEntity}</div>
                  {formattedAddress.map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>

              {phone && (
                <div className="flex items-start gap-3">
                  <PhoneIcon />
                  <div className="text-sm">
                    <div className="font-semibold text-text-primary mb-0.5">Phone</div>
                    <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-text-muted hover:text-brand-primary transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <EmailIcon />
                <div className="text-sm">
                  <div className="font-semibold text-text-primary mb-0.5">Email</div>
                  <a href={`mailto:${supportEmail}`} className="text-text-muted hover:text-brand-primary transition-colors break-all">
                    {supportEmail}
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-subtle">
              <p className="text-xs text-text-muted">
                Need technical help with an existing TaxClaim Pro subscription? Visit the{' '}
                <Link href="/support" className="text-brand-primary hover:text-brand-hover transition-colors">
                  support page
                </Link>{' '}
                for product-specific questions, FAQs, and technical booking.
              </p>
            </div>
          </div>

          {/* Cal.com embed */}
          <div className="rounded-2xl border border-subtle bg-surface-card p-8">
            <h2 className="text-lg font-semibold text-text-primary mb-2">Book a consultation</h2>
            <p className="text-sm text-text-muted mb-6">Schedule a conversation with the TaxClaim Pro team — pre-sales questions, Kwong ruling specifics, or how TaxClaim Pro fits your firm.</p>

            <div
              data-cal-namespace={CAL_NAMESPACE}
              data-cal-link={CAL_LINK}
              data-cal-config='{"layout":"month_view"}'
              className="min-h-[600px]"
            />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-16 md:py-24 bg-surface-card border-t border-subtle">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">Ready to start filing?</h2>
          <p className="text-base text-text-muted mb-8">
            Skip the conversation and go straight to a subscription — monthly billing, cancel anytime, and your branded client page is live in 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/pricing" className="bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary font-bold px-8 py-3 rounded-lg text-base transition-all">
              View pricing
            </a>
            <a href="/demo" className="bg-surface-elevated hover:bg-surface-bg text-text-primary font-semibold px-8 py-3 rounded-lg text-base border border-subtle transition-all">
              See the demo
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
