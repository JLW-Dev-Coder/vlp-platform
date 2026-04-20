import Link from 'next/link'
import { generatePageMeta } from '@vlp/member-ui'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import CalBookingButton from '@/components/CalBookingButton'

export const metadata = generatePageMeta({
  title: 'Contact - Website Lotto',
  description:
    'Get in touch with the Website Lotto team. Email, phone, or book a call — we answer questions about templates, bidding, hosting, and custom domains.',
  domain: 'websitelotto.virtuallaunch.pro',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bokeh hidden md:block" style={{ top: '10%', left: '12%', width: '250px', height: '250px', background: 'radial-gradient(circle, #00F0D0, transparent 70%)' }} />
        <div className="bokeh hidden md:block" style={{ top: '40%', left: '78%', width: '260px', height: '260px', background: 'radial-gradient(circle, #FF2D8A, transparent 70%)', animationDelay: '3s' }} />
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-20 md:py-28 text-center relative z-10">
          <div className="inline-block rounded-full neon-border px-3 py-1 text-xs font-bold uppercase tracking-wider text-neon-blue mb-6">
            Contact
          </div>
          <h1 className="font-sora text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-5 glow-blue">
            Talk to us
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/70 leading-relaxed">
            Questions about templates, bidding, custom domains, or how the marketplace works? Reach
            out. We respond within one business day.
          </p>
        </div>
      </section>

      <div className="neon-line" />

      {/* Contact methods */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="mailto:outreach@virtuallaunch.pro"
              className="glass-card rounded-xl p-6 neon-border anim-float block"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(0,212,255,0.1)] text-neon-blue mb-4 anim-icon-bounce">
                <Mail size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-blue mb-2">Email</h3>
              <p className="text-white/65 leading-relaxed mb-3">
                Best for product questions, billing, or anything that needs a paper trail.
              </p>
              <span className="text-neon-blue font-bold">outreach@virtuallaunch.pro</span>
            </a>

            <a
              href="tel:+16198005457"
              className="glass-card rounded-xl p-6 neon-border-yellow anim-dance block"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(255,229,52,0.1)] text-neon-yellow mb-4 anim-icon-bounce">
                <Phone size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-yellow mb-2">Phone</h3>
              <p className="text-white/65 leading-relaxed mb-3">
                Available during business hours, Pacific Time. Voicemail forwards to email.
              </p>
              <span className="text-neon-yellow font-bold">619-800-5457</span>
            </a>

            <CalBookingButton className="glass-card rounded-xl p-6 neon-border-magenta anim-sway w-full text-left block cursor-pointer">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(255,45,138,0.1)] text-neon-magenta mb-4 anim-icon-bounce">
                <Calendar size={22} />
              </div>
              <h3 className="font-sora text-xl font-bold text-neon-magenta mb-2">Book a call</h3>
              <p className="text-white/65 leading-relaxed mb-3">
                Skip the back-and-forth. Pick a time that works for you and we&apos;ll meet on
                video.
              </p>
              <span className="text-neon-magenta font-bold">Schedule on Cal.com →</span>
            </CalBookingButton>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* Address */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center glass-card neon-border-cyan rounded-2xl p-10 anim-float">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-[rgba(0,240,208,0.1)] text-neon-cyan mb-4 anim-icon-bounce">
              <MapPin size={22} />
            </div>
            <h2 className="font-sora text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-4 glow-cyan">
              Mailing address
            </h2>
            <p className="text-white/70 leading-relaxed">
              Lenore, Inc.
              <br />
              1175 Avocado Avenue, Suite 101 PMB 1010
              <br />
              El Cajon, CA 92020
            </p>
          </div>
        </div>
      </section>

      <div className="neon-line" />

      {/* CTA */}
      <section>
        <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-16 md:py-20 text-center">
          <h2 className="font-sora text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4 glow-yellow">
            Not sure where to start?
          </h2>
          <p className="text-white/65 text-lg mb-8 max-w-xl mx-auto">
            Take a look at the catalog while you wait — most questions answer themselves once you
            see a template you like.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-lg bg-neon-yellow px-6 py-3 font-extrabold text-[#07070A] btn-glow-yellow hover:-translate-y-0.5 transition-transform"
            >
              Browse Templates
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center rounded-lg bg-[rgba(0,212,255,0.06)] neon-border px-6 py-3 font-bold text-neon-blue"
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
