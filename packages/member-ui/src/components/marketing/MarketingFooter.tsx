/**
 * MarketingFooter — shared marketing-site footer for all 8 VLP apps.
 *
 * Config-driven via PlatformConfig.marketing. Conforms to:
 *   - canonical-site-nav.md §1 footer (4-column structure) + §5 footer layout
 *   - canonical-style.md (tokens, typography)
 *   - canonical-app-components.md §5.5 (button variants)
 *
 * Renders a 4-column grid on lg+, 2-col on md, 1-col on mobile.
 * Top border, py-16 spacing per canonical §5.
 *
 * Server component — no 'use client', no hooks, no interactivity.
 */

import Link from 'next/link'
import type { FooterLink, PlatformConfig } from '../../types/config'

export interface MarketingFooterProps {
  config: PlatformConfig
}

interface PrimaryLink {
  label: string
  href: string
}

export function MarketingFooter({ config }: MarketingFooterProps) {
  if (!config.marketing) {
    throw new Error(
      'MarketingFooter: config.marketing is required. Add a marketing field to your PlatformConfig.'
    )
  }

  const marketing = config.marketing
  const year = new Date().getFullYear()
  const copyright =
    marketing.footerCopyright ?? `© ${year} ${config.brandName}`

  const primaryLinks: PrimaryLink[] = [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Features', href: '/features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Sign In', href: config.routes.signIn },
  ]

  return (
    <footer className="border-t border-subtle bg-surface-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href={config.routes.home}
              className="flex items-center gap-3 focus:outline-none focus:shadow-focus rounded-md"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-light font-bold text-brand-text-on-primary"
                aria-hidden="true"
              >
                {config.logoText}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-text-primary">
                  {config.brandName}
                </span>
                {marketing.footerTagline && (
                  <span className="text-xs text-text-muted">
                    {marketing.footerTagline}
                  </span>
                )}
              </span>
            </Link>

            <p className="text-sm text-text-muted leading-relaxed">
              {marketing.summary}
            </p>

            <div className="flex flex-col gap-2">
              <Link
                href={marketing.ctaPath}
                className="inline-flex items-center justify-center rounded-md bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary px-4 py-2 text-sm font-semibold transition-colors duration-fast focus:outline-none focus:shadow-focus"
              >
                {marketing.ctaLabel}
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-default bg-transparent hover:bg-surface-elevated text-text-primary px-4 py-2 text-sm font-semibold transition-colors duration-fast focus:outline-none focus:shadow-focus"
              >
                View pricing
              </Link>
            </div>
          </div>

          {/* Column 2 — Links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-text-primary">Links</h3>
            <nav className="grid gap-2" aria-label="Footer primary">
              {primaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-text-muted hover:text-text-primary transition-colors duration-fast"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Column 3 — Resources */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Resources
            </h3>
            {marketing.footerResources.length > 0 && (
              <nav className="grid gap-2" aria-label="Footer resources">
                {marketing.footerResources.map((item) => (
                  <FooterLinkItem key={item.href} item={item} />
                ))}
              </nav>
            )}
          </div>

          {/* Column 4 — Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-semibold text-text-primary">Legal</h3>
            {marketing.footerLegal.length > 0 && (
              <nav className="grid gap-2" aria-label="Footer legal">
                {marketing.footerLegal.map((item) => (
                  <FooterLinkItem key={item.href} item={item} />
                ))}
              </nav>
            )}
            <p className="mt-6 text-xs text-text-muted">{copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterLinkItem({ item }: { item: FooterLink }) {
  const className =
    'text-sm text-text-muted hover:text-text-primary transition-colors duration-fast'

  if (item.external) {
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {item.label}
      </a>
    )
  }

  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  )
}
