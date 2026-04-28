import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Tax Avatar Pro is $29/mo as an add-on to TaxClaim Pro ($10/mo). Combined: $39/mo for a fully-managed AI YouTube channel and Form 843 toolkit.',
};

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const TCVLP_FEATURES = [
  'Form 843 generation',
  'Branded client claim page',
  'Penalty calculations',
  'Kwong eligibility checker',
  'Email support',
];

const TAVLP_FEATURES = [
  'Choose your AI avatar',
  'Scripts written for you',
  'Episodes recorded & edited',
  'Published to your YouTube channel',
  'Channel growth handled end-to-end',
];

const COMBINED_FEATURES = [
  'Everything in TaxClaim Pro',
  'Everything in Tax Avatar Pro',
  'One bill, one team, one rollout',
  'Priority onboarding',
];

export default function PricingPage() {
  return (
    <section className="mx-auto max-w-[77.5rem] px-4 pb-20 pt-16 md:pt-24">
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-text-primary">
          Simple,{' '}
          <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
            stacked pricing
          </span>
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          Tax Avatar Pro is an add-on to TaxClaim Pro. The base subscription is required, the avatar channel is optional.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* TCVLP base */}
        <div className="rounded-2xl bg-surface-card border border-subtle p-8 flex flex-col">
          <div className="text-sm uppercase tracking-wide text-text-muted mb-2">Required base</div>
          <div className="text-xl font-semibold text-text-primary mb-1">TaxClaim Pro</div>
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold text-text-primary">$</span>
            <span className="text-5xl font-bold text-text-primary">10</span>
            <span className="text-text-muted ml-1">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {TCVLP_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                <span className="mt-0.5"><CheckIcon /></span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="block text-center px-6 py-3 rounded-full text-sm font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all"
          >
            Start with TaxClaim Pro
          </Link>
        </div>

        {/* TAVLP add-on */}
        <div className="rounded-2xl bg-surface-card border border-subtle p-8 flex flex-col">
          <div className="text-sm uppercase tracking-wide text-text-muted mb-2">Add-on</div>
          <div className="text-xl font-semibold text-text-primary mb-1">Tax Avatar Pro</div>
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold text-text-primary">$</span>
            <span className="text-5xl font-bold text-text-primary">29</span>
            <span className="text-text-muted ml-1">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {TAVLP_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                <span className="mt-0.5"><CheckIcon /></span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="block text-center px-6 py-3 rounded-full text-sm font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all"
          >
            Add Tax Avatar Pro
          </Link>
        </div>

        {/* Combined — highlighted */}
        <div className="rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-gradient-to/5 border-2 border-brand-primary p-8 flex flex-col relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-primary text-brand-text-on-primary text-xs font-bold uppercase tracking-wide">
            Most Popular
          </div>
          <div className="text-sm uppercase tracking-wide text-brand-primary mb-2">Combined</div>
          <div className="text-xl font-semibold text-text-primary mb-1">TCP + TAP</div>
          <div className="flex items-baseline mb-6">
            <span className="text-3xl font-bold text-text-primary">$</span>
            <span className="text-5xl font-bold text-text-primary">39</span>
            <span className="text-text-muted ml-1">/mo</span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {COMBINED_FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-text-muted">
                <span className="mt-0.5"><CheckIcon /></span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="block text-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>

      <p className="text-center text-sm text-text-muted mt-12 max-w-2xl mx-auto">
        Cancel anytime. Tax Avatar Pro requires an active TaxClaim Pro subscription.
      </p>
    </section>
  );
}
