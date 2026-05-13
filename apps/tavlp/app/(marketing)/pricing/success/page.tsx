import type { Metadata } from 'next';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

export const metadata: Metadata = {
  title: 'Welcome to Tax Avatar Pro',
  description: 'Your Tax Avatar Pro subscription is being set up.',
};

export default function PricingSuccessPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center text-white">
      <div
        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
        style={{ backgroundColor: `${tavlpConfig.brandColor}20`, color: tavlpConfig.brandColor }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Welcome to Tax Avatar Pro!
      </h1>
      <p className="text-lg text-white/70 mb-8">
        Your subscription is being set up. You&apos;ll receive an email with next steps shortly — including how to pick your avatar and kick off your channel setup.
      </p>
      <Link
        href="/"
        className="inline-block px-8 py-3 rounded-full text-sm font-semibold transition-all"
        style={{ backgroundColor: tavlpConfig.brandColor, color: '#fff' }}
      >
        Back to homepage
      </Link>
    </section>
  );
}
