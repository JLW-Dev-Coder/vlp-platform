import { generatePageMeta } from '@vlp/member-ui'
import HomePricingSection from '@/components/marketing/HomePricingSection'
import Link from 'next/link'

export const metadata = generatePageMeta({
  title: 'Virtual Launch Pro — Speed to Lead for Tax Professionals',
  description: 'Virtual Launch Pro finds taxpayers who need your exact services and notifies you the moment they reach out. Respond first, win the client.',
  domain: 'virtuallaunch.pro',
  path: '/',
})

const valueProps = [
  {
    title: 'Instant Lead Delivery',
    body: "A taxpayer submits an inquiry. You get an email notification in seconds — not hours, not days. Respond while they're still thinking about their problem.",
  },
  {
    title: 'We Source, You Close',
    body: 'We actively find taxpayers who need your services in your area. Your directory profile does the marketing. You do the tax work.',
  },
  {
    title: 'One Profile, Total Visibility',
    body: "Set up once. Your credentials, services, and availability are visible to every taxpayer searching for help. Toggle on when you're ready. Toggle off when you're not.",
  },
]

const steps = [
  {
    n: '01',
    title: 'Create your profile',
    body: 'Sign up, add your credential (CPA, EA, Attorney), location, and services. Takes 5 minutes.',
  },
  {
    n: '02',
    title: 'We match you with taxpayers',
    body: 'When a taxpayer in your area needs your services, our system matches them to you based on credential, location, and service type.',
  },
  {
    n: '03',
    title: 'You get notified instantly',
    body: 'The moment a taxpayer reaches out, you receive an email with their details and a booking link. Respond first, win the client.',
  },
]

const stats = [
  { value: 'Under 60s', label: 'Average response time' },
  { value: 'Multi-state', label: 'Tax professionals across multiple states' },
  { value: '100%', label: 'Every inquiry matched to a qualified pro' },
]

const faqs = [
  {
    q: 'How do I get leads?',
    a: 'You set up your profile. We match taxpayers to you based on location, credential, and services. You get notified by email the moment they reach out.',
  },
  {
    q: 'What does it cost?',
    a: 'Free to create your profile and start receiving leads. Premium tiers unlock priority matching and additional tools.',
  },
  {
    q: 'Do I need to do any marketing?',
    a: 'No. Your profile in our directory is your marketing. We drive taxpayers to the directory through our own outreach.',
  },
  {
    q: 'How fast will I get my first lead?',
    a: "That depends on demand in your area. The faster you complete your profile, the sooner you're visible to taxpayers searching for help.",
  },
  {
    q: 'What information do I need to sign up?',
    a: "Your name, credential type (CPA, EA, Attorney), firm name, location, and the services you offer. That's it.",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-500/40 bg-orange-500/10 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-wide text-orange-300">Speed to Lead for tax professionals</span>
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
            Your next client is{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">looking for you right now.</span>
          </h1>
          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-slate-400 md:text-2xl">
            We find taxpayers who need your exact services. You get notified the moment they reach out. Respond first, win the client.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/sign-in" className="inline-block rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:scale-105 hover:from-orange-400 hover:to-orange-500">Get Your First Leads →</Link>
            <Link href="/how-it-works" className="inline-block rounded-lg border border-slate-700 bg-slate-900/60 px-8 py-4 text-lg font-semibold text-slate-100 transition-all duration-200 hover:bg-slate-800/80">See How It Works</Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-orange-400">WHY VIRTUAL LAUNCH PRO</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Stop chasing. Start closing.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {valueProps.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <h3 className="text-lg font-extrabold mb-3">{item.title}</h3>
                <p className="text-sm text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-orange-400">HOW IT WORKS</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Three steps to your first lead</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
                <div className="text-sm font-semibold tracking-widest text-orange-400">STEP {s.n}</div>
                <h3 className="mt-3 text-xl font-extrabold">{s.title}</h3>
                <p className="mt-3 text-sm text-white/70">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex justify-center">
            <Link href="/how-it-works" className="rounded-xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-extrabold text-white hover:bg-white/10 transition-colors">See How It Works</Link>
          </div>
        </div>
      </section>

      {/* Social Proof — Stat Blocks */}
      <section className="border-t border-white/10 bg-[#070a10]">
        <div className="mx-auto max-w-[77.5rem] px-4 py-16 md:py-20">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-orange-400">THE NUMBERS</p>
            <h2 className="mt-3 text-4xl font-extrabold md:text-5xl">Built for speed</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {/* PLACEHOLDER: verify stat */}
            {/* PLACEHOLDER: verify stat */}
            {/* PLACEHOLDER: verify stat */}
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-8 text-center">
                <div className="text-4xl font-extrabold text-orange-400 md:text-5xl">{s.value}</div>
                <p className="mt-3 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="border-t border-white/10">
        <HomePricingSection />
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-white/10">
        <div className="mx-auto max-w-[77.5rem] px-4 py-14 md:py-16">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <h2 className="text-3xl font-extrabold md:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-white/10 bg-white/5 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between text-left font-semibold">
                  {f.q}<span className="ml-4 text-white/60 transition-transform group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-3 text-sm text-white/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-[#0f172a] via-[#1c1917] to-[#7c2d12] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to stop chasing clients?</h2>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">Set up your profile in 5 minutes. Start receiving leads the moment a taxpayer in your area needs your services.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in" className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl">Get Your First Leads</Link>
            <Link href="/how-it-works" className="bg-white/10 hover:bg-white/15 text-white font-semibold px-10 py-4 rounded-xl text-lg border border-orange-400/20 transition-all">See How It Works</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
