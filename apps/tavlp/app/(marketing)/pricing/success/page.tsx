import type { Metadata } from 'next';
import Link from 'next/link';
import { tavlpConfig } from '@/lib/platform-config';

export const metadata: Metadata = {
  title: 'Welcome to Tax Avatar Pro',
  description: 'Your Tax Avatar Pro channel is being set up.',
};

const STEPS = [
  "We'll configure your branded YouTube channel within 24 hours.",
  "You'll receive an email to select your avatar and confirm your topic niche.",
  "Your first batch of video scripts will be ready for review within 48 hours.",
  "Once you approve, we render and publish your first videos.",
];

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
      <p className="text-lg text-white/70 mb-10">
        Your channel is being set up. Here&apos;s what happens next:
      </p>
      <ol className="text-left max-w-xl mx-auto space-y-4 mb-12">
        {STEPS.map((step, i) => (
          <li key={i} className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <span
              className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold"
              style={{ backgroundColor: tavlpConfig.brandColor, color: '#fff' }}
            >
              {i + 1}
            </span>
            <span className="text-white/85 text-sm leading-relaxed pt-1">{step}</span>
          </li>
        ))}
      </ol>
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
