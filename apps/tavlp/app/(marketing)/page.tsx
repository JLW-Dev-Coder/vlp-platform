import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tax Avatar Pro — AI YouTube Channel for Tax Pros',
  description: 'A fully-managed AI YouTube channel for tax professionals. We pick the avatar, write the scripts, publish the episodes, and grow your audience.',
};

export default function HomePage() {
  return (
    <div>
      {/* TODO: full landing page port from tavlp-site/index.html */}
      <section className="mx-auto max-w-[77.5rem] px-4 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-subtle bg-surface-card px-4 py-2">
            <span className="text-sm text-text-muted">$29/mo add-on to TaxClaim Pro</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight text-text-primary">
            Tax{' '}
            <span className="bg-gradient-to-br from-brand-primary to-brand-gradient-to bg-clip-text text-transparent">
              Avatar Pro
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            A fully-managed AI YouTube channel for tax professionals. Pick an avatar, we handle the rest — scripts, recording, publishing, and growth.
          </p>

          <div className="mb-10 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 p-6 max-w-xl mx-auto">
            <div className="text-sm uppercase tracking-wide text-brand-primary mb-2">Coming soon</div>
            <p className="text-text-muted">
              Full marketing site is in production. Get on the early-access list and we&rsquo;ll reach out when avatars open up.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg hover:-translate-y-0.5 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              Get Started
            </Link>
            <Link
              href="/avatars"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-lg font-semibold text-text-primary border border-subtle hover:bg-brand-primary/10 hover:border-brand-primary/40 transition-all duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              See Avatars
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
