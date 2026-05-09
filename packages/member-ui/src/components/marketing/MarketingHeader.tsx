'use client'

/**
 * MarketingHeader — shared marketing-site header for all 8 VLP apps.
 *
 * Config-driven via PlatformConfig.marketing. Conforms to:
 *   - canonical-app-blueprint.md §4.5 (brand tokens), §4.14 (max-widths), §4.19 (z-index)
 *   - canonical-site-nav.md §1 (header + 4-column mega menu), §4 (a11y + mobile)
 *   - canonical-app-components.md §5.5 (button variants)
 *
 * Renders:
 *   - Sticky top header, h-16, max-w-7xl container, backdrop-blur
 *   - Logo (brandAbbrev gradient square + brandName + tagline)
 *   - Primary nav: About, Features, Pricing, How It Works, Contact, Reviews
 *   - Resources dropdown with 4-column mega menu (Discover / Explore / Tools & Extras / CTA)
 *   - Vertical divider
 *   - Log In text link + CTA button
 *   - Mobile hamburger with slide-in drawer (motion-safe)
 */

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'
import type { MegaMenuItem, PlatformConfig, PrimaryNavItem } from '../../types/config'

export interface MarketingHeaderProps {
  config: PlatformConfig
}

const DEFAULT_PRIMARY_NAV: PrimaryNavItem[] = [
  { label: 'About', href: '/about' },
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Contact', href: '/contact' },
  { label: 'Reviews', href: '/reviews' },
]

export function MarketingHeader({ config }: MarketingHeaderProps) {
  if (!config.marketing) {
    throw new Error(
      'MarketingHeader: config.marketing is required. Add a marketing field to your PlatformConfig.'
    )
  }

  const marketing = config.marketing
  const navItems = marketing.primaryNav ?? DEFAULT_PRIMARY_NAV
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false)

  const resourcesMenuId = useId()
  const mobileDrawerId = useId()

  const resourcesTriggerRef = useRef<HTMLButtonElement | null>(null)
  const resourcesMenuRef = useRef<HTMLDivElement | null>(null)
  const hamburgerRef = useRef<HTMLButtonElement | null>(null)
  const drawerRef = useRef<HTMLDivElement | null>(null)
  const drawerCloseRef = useRef<HTMLButtonElement | null>(null)

  const closeResources = useCallback(() => setResourcesOpen(false), [])
  const closeMobile = useCallback(() => setMobileOpen(false), [])

  const isLight = config.themeMode === 'light'
  const headerClass = isLight
    ? 'sticky top-0 z-sticky'
    : 'sticky top-0 z-sticky bg-surface-bg/80 backdrop-blur border-b border-subtle'
  const headerStyle = isLight
    ? {
        background: 'rgba(245, 230, 211, 0.85)',
        backdropFilter: 'saturate(140%) blur(12px)',
        WebkitBackdropFilter: 'saturate(140%) blur(12px)',
        borderBottom: '1px solid rgba(139, 21, 56, 0.14)',
      }
    : undefined
  const iconBtnClass = isLight
    ? 'inline-flex items-center justify-center h-10 w-10 rounded-md text-[#1A0B14] hover:bg-[rgba(139,21,56,0.06)] focus-visible:outline-none focus-visible:shadow-focus transition-colors duration-fast'
    : 'inline-flex items-center justify-center h-10 w-10 rounded-md text-text-primary hover:bg-surface-elevated focus-visible:outline-none focus-visible:shadow-focus transition-colors duration-fast'
  const navLinkClass = isLight
    ? 'text-sm text-[#1A0B14] hover:text-[#E91E63] transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus rounded-sm'
    : 'text-sm text-text-muted hover:text-text-primary transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus rounded-sm'
  const resourcesBtnClass = isLight
    ? 'inline-flex items-center gap-1 text-sm text-[#1A0B14] hover:text-[#E91E63] transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus rounded-sm'
    : 'inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus rounded-sm'
  const dividerClass = isLight
    ? 'border-l border-[rgba(139,21,56,0.14)] h-6 mx-4'
    : 'border-l border-subtle h-6 mx-4'
  const mobileDrawerClass = isLight
    ? 'md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm border-r overflow-y-auto motion-safe:transition-transform motion-safe:duration-base translate-x-0 z-modal'
    : 'md:hidden fixed top-0 left-0 bottom-0 w-[85vw] max-w-sm bg-surface-popover border-r border-subtle z-modal overflow-y-auto motion-safe:transition-transform motion-safe:duration-base translate-x-0'
  const mobileDrawerStyle = isLight
    ? { background: '#F5E6D3', borderRightColor: 'rgba(139, 21, 56, 0.14)' }
    : undefined
  const mobileDrawerHeaderClass = isLight
    ? 'flex items-center justify-between h-16 px-6 border-b border-[rgba(139,21,56,0.14)]'
    : 'flex items-center justify-between h-16 px-6 border-b border-subtle'
  const mobileNavLinkClass = isLight
    ? 'px-3 py-3 text-base text-[#1A0B14] hover:bg-[rgba(139,21,56,0.06)] rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus'
    : 'px-3 py-3 text-base text-text-primary hover:bg-surface-elevated rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus'
  const mobileResourcesBtnClass = isLight
    ? 'w-full flex items-center justify-between px-3 py-3 text-base text-[#1A0B14] hover:bg-[rgba(139,21,56,0.06)] rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus'
    : 'w-full flex items-center justify-between px-3 py-3 text-base text-text-primary hover:bg-surface-elevated rounded-md transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus'
  const brandNameStyle = isLight ? { color: '#8B1538' } : undefined
  const taglineStyle = isLight ? { color: '#E91E63' } : undefined
  const brandNameClass = isLight
    ? 'text-sm font-semibold'
    : 'text-sm font-semibold text-text-primary'
  const taglineClass = isLight ? 'text-xs' : 'text-xs text-text-muted'

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false)
    setResourcesOpen(false)
    setMobileResourcesOpen(false)
  }, [pathname])

  // Mega menu: outside click + Escape
  useEffect(() => {
    if (!resourcesOpen) return

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        resourcesMenuRef.current?.contains(target) ||
        resourcesTriggerRef.current?.contains(target)
      ) {
        return
      }
      setResourcesOpen(false)
    }

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setResourcesOpen(false)
        resourcesTriggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [resourcesOpen])

  // Mobile drawer: scroll lock + focus management + Escape
  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      drawerCloseRef.current?.focus()
    }, 0)

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', onKeyDown)
      hamburgerRef.current?.focus()
    }
  }, [mobileOpen])

  const handleResourcesKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown' && !resourcesOpen) {
      event.preventDefault()
      setResourcesOpen(true)
    }
  }

  return (
    <header className={headerClass} style={headerStyle}>
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-6">
        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            ref={hamburgerRef}
            type="button"
            onClick={() => setMobileOpen(true)}
            className={`md:hidden ${iconBtnClass}`}
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            aria-controls={mobileDrawerId}
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <Link
            href={config.routes.home}
            className="flex items-center gap-3 focus-visible:outline-none focus-visible:shadow-focus rounded-md"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary text-sm font-semibold"
              aria-hidden="true"
            >
              {config.logoText}
            </span>
            <span className="flex flex-col leading-tight">
              <span className={brandNameClass} style={brandNameStyle}>
                {config.brandName}
              </span>
              <span className={taglineClass} style={taglineStyle}>
                {marketing.tagline}
              </span>
            </span>
          </Link>
        </div>

        {/* Center: primary nav (desktop) */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Primary"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={navLinkClass}
            >
              {item.label}
            </Link>
          ))}

          <div className="relative">
            <button
              ref={resourcesTriggerRef}
              type="button"
              onClick={() => setResourcesOpen((v) => !v)}
              onKeyDown={handleResourcesKeyDown}
              className={resourcesBtnClass}
              aria-expanded={resourcesOpen}
              aria-haspopup="true"
              aria-controls={resourcesMenuId}
            >
              Resources
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-fast ${resourcesOpen ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>

            {resourcesOpen && (
              <div
                ref={resourcesMenuRef}
                id={resourcesMenuId}
                role="menu"
                className="absolute left-1/2 mt-3 w-[min(1024px,calc(100vw-3rem))] -translate-x-1/2 rounded-xl border border-subtle bg-surface-popover shadow-md z-dropdown motion-safe:animate-fade-in p-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1.2fr] gap-4">
                  <MegaMenuColumn
                    label="Discover"
                    items={marketing.megaMenu.discover}
                    showDescription
                    onItemClick={closeResources}
                  />
                  <MegaMenuColumn
                    label="Explore"
                    items={marketing.megaMenu.explore}
                    onItemClick={closeResources}
                  />
                  <MegaMenuColumn
                    label="Tools & Extras"
                    items={marketing.megaMenu.toolsExtras}
                    onItemClick={closeResources}
                  />
                  <div
                    className="bg-surface-card border border-subtle rounded-lg p-4 flex flex-col gap-4"
                    role="none"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Get Started
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {marketing.megaMenu.ctaText}
                    </p>
                    <div className="mt-auto flex flex-col gap-2">
                      <Link
                        href={marketing.megaMenu.ctaMagnetPath}
                        role="menuitem"
                        onClick={closeResources}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary px-4 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
                      >
                        {marketing.megaMenu.ctaMagnetLabel}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                      <Link
                        href={config.routes.signIn}
                        role="menuitem"
                        onClick={closeResources}
                        className="inline-flex items-center justify-center rounded-md border border-subtle hover:border-hover text-text-primary px-4 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
                      >
                        Log In
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Right: divider + auth actions (desktop) */}
        <div className="hidden md:flex items-center">
          <span
            className={dividerClass}
            aria-hidden="true"
          />
          <Link
            href={config.routes.signIn}
            className={`${navLinkClass} mr-4`}
          >
            Log In
          </Link>
          <Link
            href={marketing.ctaPath}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary px-6 py-3 h-12 text-base font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
          >
            {marketing.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile-only CTA (hamburger handles the rest) */}
        <div className="md:hidden">
          <Link
            href={marketing.ctaPath}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-primary hover:bg-brand-hover text-brand-text-on-primary px-4 py-2 text-sm font-semibold transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
          >
            {marketing.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 bg-surface-overlay backdrop-blur-sm z-overlay motion-safe:animate-fade-in"
            onClick={closeMobile}
            aria-hidden="true"
          />
          <div
            ref={drawerRef}
            id={mobileDrawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={mobileDrawerClass}
            style={mobileDrawerStyle}
          >
            <div className={mobileDrawerHeaderClass}>
              <Link
                href={config.routes.home}
                onClick={closeMobile}
                className="flex items-center gap-2 focus-visible:outline-none focus-visible:shadow-focus rounded-md"
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-brand-primary to-brand-gradient-to text-brand-text-on-primary text-xs font-semibold"
                  aria-hidden="true"
                >
                  {config.logoText}
                </span>
                <span className={brandNameClass} style={brandNameStyle}>
                  {config.brandName}
                </span>
              </Link>
              <button
                ref={drawerCloseRef}
                type="button"
                onClick={closeMobile}
                className={iconBtnClass}
                aria-label="Close navigation menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <nav
              className="flex flex-col p-6 gap-1"
              aria-label="Mobile primary"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobile}
                  className={mobileNavLinkClass}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setMobileResourcesOpen((v) => !v)}
                  className={mobileResourcesBtnClass}
                  aria-expanded={mobileResourcesOpen}
                >
                  <span>Resources</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-fast ${mobileResourcesOpen ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>

                {mobileResourcesOpen && (
                  <div className="flex flex-col gap-4 mt-2 pl-3 motion-safe:animate-slide-up">
                    <MobileMegaColumn
                      label="Discover"
                      items={marketing.megaMenu.discover}
                      showDescription
                      onItemClick={closeMobile}
                    />
                    <MobileMegaColumn
                      label="Explore"
                      items={marketing.megaMenu.explore}
                      onItemClick={closeMobile}
                    />
                    <MobileMegaColumn
                      label="Tools & Extras"
                      items={marketing.megaMenu.toolsExtras}
                      onItemClick={closeMobile}
                    />
                    <Link
                      href={marketing.megaMenu.ctaMagnetPath}
                      onClick={closeMobile}
                      className={mobileNavLinkClass}
                    >
                      {marketing.megaMenu.ctaMagnetLabel}
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href={config.routes.signIn}
                onClick={closeMobile}
                className={`mt-2 ${mobileNavLinkClass}`}
              >
                Log In
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  )
}

interface MegaMenuColumnProps {
  label: string
  items: MegaMenuItem[]
  showDescription?: boolean
  onItemClick: () => void
}

function MegaMenuColumn({
  label,
  items,
  showDescription,
  onItemClick,
}: MegaMenuColumnProps) {
  return (
    <div className="bg-surface-card border border-subtle rounded-lg p-4" role="none">
      <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-3">
        {label}
      </div>
      <ul className="flex flex-col gap-1" role="none">
        {items.map((item) => (
          <li key={item.href} role="none">
            <Link
              href={item.href}
              role="menuitem"
              onClick={onItemClick}
              className="group flex items-start justify-between gap-3 rounded-md p-2 hover:bg-surface-elevated transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">
                  {item.label}
                </span>
                {showDescription && item.description && (
                  <span className="text-xs text-text-muted mt-0.5">
                    {item.description}
                  </span>
                )}
                {!showDescription && item.description && (
                  <span className="text-xs text-text-muted mt-0.5">
                    {item.description}
                  </span>
                )}
              </span>
              <ArrowRight
                className="h-4 w-4 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity duration-fast mt-0.5"
                aria-hidden="true"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface MobileMegaColumnProps {
  label: string
  items: MegaMenuItem[]
  showDescription?: boolean
  onItemClick: () => void
}

function MobileMegaColumn({
  label,
  items,
  showDescription,
  onItemClick,
}: MobileMegaColumnProps) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-2 px-3">
        {label}
      </div>
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onItemClick}
              className="flex flex-col px-3 py-2 rounded-md hover:bg-surface-elevated transition-colors duration-fast focus-visible:outline-none focus-visible:shadow-focus"
            >
              <span className="text-sm font-semibold text-text-primary">
                {item.label}
              </span>
              {showDescription && item.description && (
                <span className="text-xs text-text-muted mt-0.5">
                  {item.description}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
