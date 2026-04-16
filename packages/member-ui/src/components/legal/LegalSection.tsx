/**
 * LegalSection — individual content card for legal pages.
 *
 * Renders the canonical rounded-2xl + border + semi-transparent bg pattern
 * used across all legal pages in the VLP ecosystem. Children are free-form
 * (body text, lists, inline links, etc.).
 */
import type { ReactNode } from 'react'

export interface LegalSectionProps {
  title?: string
  children: ReactNode
}

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="rounded-2xl border border-subtle bg-surface-card p-8">
      {title && (
        <h2 className="mb-3 text-lg font-semibold text-text-primary">{title}</h2>
      )}
      <div className="text-sm leading-relaxed text-text-muted">
        {children}
      </div>
    </section>
  )
}
