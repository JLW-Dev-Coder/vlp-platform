import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to Tax Avatar Pro.',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-surface-bg">
      <div className="max-w-md w-full text-center">
        <div className="rounded-2xl bg-surface-card border border-subtle p-10">
          <h1 className="text-2xl font-bold text-text-primary mb-3">Sign in coming soon</h1>
          <p className="text-text-muted mb-8">
            Tax Avatar Pro is in early access. Member sign-in will go live alongside the first wave of channels.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-semibold bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary hover:shadow-lg transition-all"
          >
            Get on the early-access list
          </Link>
        </div>
      </div>
    </div>
  );
}
