/**
 * LegalPageLayout — outer shell for all legal pages (privacy, terms, refund).
 *
 * Reads businessInfo from PlatformConfig for address card content. Renders:
 *   - "Legal" pill badge
 *   - H1 + subtitle + last-updated line
 *   - Address card (gradient logo + legal entity + formatted address)
 *   - Children (page-specific LegalSection elements)
 *   - Footer nav between the 3 legal pages, highlighting the current page
 *
 * Consumers provide content via children; this component handles scaffolding.
 */
import type { ReactNode } from 'react'
import Link from 'next/link'
import type { PlatformConfig } from '../../types/config'

export interface LegalPageLayoutProps {
  config: PlatformConfig
  title: string
  subtitle: string
  lastUpdated: string
  currentPage: 'privacy' | 'terms' | 'refund'
  children: ReactNode
}

export function LegalPageLayout({
  config,
  title,
  subtitle,
  lastUpdated,
  currentPage,
  children,
}: LegalPageLayoutProps) {
  if (!config.businessInfo) {
    throw new Error(
      'LegalPageLayout: config.businessInfo is required. Add a businessInfo field to your PlatformConfig.'
    )
  }

  const { businessInfo, brandName, logoText } = config
  const { legalEntity, address } = businessInfo

  const formattedAddress = [
    address.line1,
    address.line2,
    `${address.city}, ${address.state} ${address.zip}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="mb-10">
        <p className="mb-4 inline-flex items-center rounded-full border border-subtle bg-surface-card px-3 py-1 text-xs text-text-muted">
          Legal
        </p>
        <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl text-text-primary">
          {title}
        </h1>
        <p className="mt-2 text-base text-text-muted">{subtitle}</p>
        <p className="mt-1 text-sm text-text-muted opacity-70">Last updated: {lastUpdated}</p>
      </div>

      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-subtle bg-surface-card px-6 py-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-primary to-brand-gradient-to font-bold text-brand-text-on-primary">
          {logoText}
        </div>
        <div className="text-sm text-text-muted">
          <div className="font-semibold text-text-primary">{brandName}</div>
          <div>{legalEntity} · {formattedAddress}</div>
        </div>
      </div>

      <div className="space-y-4">
        {children}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 text-sm text-text-muted">
        <Link
          href="/legal/privacy"
          className={currentPage === 'privacy'
            ? 'text-brand-primary hover:text-brand-hover transition-colors'
            : 'hover:text-text-primary transition-colors'
          }
        >
          Privacy Policy
        </Link>
        <span>·</span>
        <Link
          href="/legal/refund"
          className={currentPage === 'refund'
            ? 'text-brand-primary hover:text-brand-hover transition-colors'
            : 'hover:text-text-primary transition-colors'
          }
        >
          Refund Policy
        </Link>
        <span>·</span>
        <Link
          href="/legal/terms"
          className={currentPage === 'terms'
            ? 'text-brand-primary hover:text-brand-hover transition-colors'
            : 'hover:text-text-primary transition-colors'
          }
        >
          Terms of Service
        </Link>
      </div>
    </div>
  )
}
