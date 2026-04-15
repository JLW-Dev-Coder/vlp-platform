import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing — TaxClaim Pro',
  description:
    'TaxClaim Pro pricing: Starter $10/mo, Professional $29/mo, Firm $79/mo. Automate IRS Form 843 penalty abatement claims.',
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
