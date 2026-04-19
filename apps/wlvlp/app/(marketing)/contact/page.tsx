import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'

export const metadata = generatePageMeta({
  title: 'Contact - Website Lotto',
  description:
    'Get in touch with the Website Lotto team. Email, phone, or book a call — we answer questions about templates, bidding, hosting, and custom domains.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/contact',
})

export default function ContactPage() {
  const calLink =
    'https://cal.com/tax-monitor-pro/wlvlp-intro'

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center">
          <div className="inline-block rounded-full border border-brand-primary bg-brand-light px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-primary mb-6">
            Contact
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary mb-5">
            Talk to us
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-muted leading-relaxed">
            Questions about templates, bidding, custom domains, or how the marketplace works? Reach
            out. We respond within one business day.
          </p>
        </div>
      </section>

      {/* Contact methods */}
      <section className="border-b border-subtle">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="mailto:outreach@virtuallaunch.pro"
              className="rounded-xl border border-default bg-surface-card p-6 hover:border-hover transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Mail size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Email</h3>
              <p className="text-text-muted leading-relaxed mb-3">
                Best for product questions, billing, or anything that needs a paper trail.
              </p>
              <span className="text-brand-primary font-semibold">outreach@virtuallaunch.pro</span>
            </a>

            <a
              href="tel:+16198005457"
              className="rounded-xl border border-default bg-surface-card p-6 hover:border-hover transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Phone size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Phone</h3>
              <p className="text-text-muted leading-relaxed mb-3">
                Available during business hours, Pacific Time. Voicemail forwards to email.
              </p>
              <span className="text-brand-primary font-semibold">619-800-5457</span>
            </a>

            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-default bg-surface-card p-6 hover:border-hover transition-colors"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
                <Calendar size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-text-primary mb-2">Book a call</h3>
              <p className="text-text-muted leading-relaxed mb-3">
                Skip the back-and-forth. Pick a time that works for you and we&apos;ll meet on
                video.
              </p>
              <span className="text-brand-primary font-semibold">Schedule on Cal.com →</span>
            </a>
          </div>
        </div>
      </section>

      {/* Address */}
      <section className="border-b border-subtle bg-surface-card">
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand-light text-brand-primary mb-4">
              <MapPin size={22} />
            </div>
            <h2 className="font-sora text-2xl md:text-3xl font-extrabold tracking-tight text-text-primary mb-4">
              Mailing address
            </h2>
            <p className="text-text-muted leading-relaxed">
              Lenore, Inc.
              <br />
              1175 Avocado Avenue, Suite 101 PMB 1010
              <br />
              El Cajon, CA 92020
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary mb-4">
            Not sure where to start?
          </h2>
          <p className="text-text-muted text-lg mb-8 max-w-xl mx-auto">
            Take a look at the catalog while you wait — most questions answer themselves once you
            see a template you like.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-brand-primary px-6 py-3 font-semibold text-brand-text-on-primary hover:bg-brand-hover transition-colors"
            >
              Browse Templates
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center rounded-lg border border-default bg-surface-card px-6 py-3 font-semibold text-text-primary hover:border-hover transition-colors"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
