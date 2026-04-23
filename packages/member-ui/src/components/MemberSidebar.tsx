'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  ArrowUpRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  icons,
} from 'lucide-react'
import type { PlatformConfig } from '../types/config'

interface MemberSidebarProps {
  config: PlatformConfig
  onSignOut: () => void
}

// Aliases for Lucide icons renamed in newer versions. Keeps existing
// `icon: 'HelpCircle'` entries in platform configs working after the lucide
// rename to `CircleQuestionMark` (which dropped the legacy names from the
// `icons` registry but kept the direct named exports).
const iconAliases: Record<string, string> = {
  HelpCircle: 'CircleQuestionMark',
  CircleHelp: 'CircleQuestionMark',
}

function NavIcon({ name, className }: { name: string; className?: string }) {
  const resolved = iconAliases[name] ?? name
  const Icon = icons[resolved as keyof typeof icons]
  if (!Icon) return null
  return <Icon className={className} />
}

export function MemberSidebar({ config, onSignOut }: MemberSidebarProps) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [collapsed, setCollapsed] = useState(false)

  function toggleExpand(href: string) {
    setExpanded((prev) => ({ ...prev, [href]: !prev[href] }))
  }

  const allHrefs = config.navSections.flatMap((s) =>
    s.items.flatMap((i) => [i.href, ...(i.children?.map((c) => c.href) ?? [])])
  )

  function isActive(href: string) {
    if (pathname === href) return true
    const hasChildNavItem = allHrefs.some((h) => h !== href && h.startsWith(href + '/'))
    if (hasChildNavItem) return false
    return pathname.startsWith(href + '/')
  }

  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-white/[0.08] bg-[var(--member-bg)] transition-[width] duration-200 ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center ${collapsed ? 'justify-center px-2' : 'gap-3 px-6'} py-5`}>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${config.brandColor}, ${config.brandColor}cc)` }}
        >
          {config.logoText}
        </span>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight text-white">
              {config.brandName}
            </span>
            <span className="text-[11px] text-white/40">{config.brandSubtitle}</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 sidebar-scroll">
        {config.navSections.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-widest text-white/30">
                {section.title}
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const hasChildren = !collapsed && item.children && item.children.length > 0
                const isOpen =
                  expanded[item.href] ||
                  (hasChildren && item.children!.some((c) => isActive(c.href)))

                const linkClassName = `flex flex-1 items-center rounded-lg py-2 text-sm font-medium transition ${
                  collapsed ? 'justify-center px-0' : 'gap-3 px-3'
                } ${
                  active
                    ? `${collapsed ? '' : 'border-l-2'} text-white`
                    : `${collapsed ? '' : 'border-l-2 border-transparent'} text-white/60 hover:bg-white/[0.04] hover:text-white`
                }`
                const linkStyle = active
                  ? {
                      borderColor: collapsed ? undefined : config.brandColor,
                      backgroundColor: `${config.brandColor}1a`,
                      color: config.brandColor,
                    }
                  : undefined
                const linkBody = (
                  <>
                    <span
                      className={active ? '' : 'text-white/40'}
                      style={active ? { color: config.brandColor } : undefined}
                    >
                      <NavIcon name={item.icon} className="h-5 w-5" />
                    </span>
                    {!collapsed && (
                      <span className="flex flex-1 items-center justify-between gap-2">
                        <span>{item.label}</span>
                        {item.external && (
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/30" />
                        )}
                      </span>
                    )}
                  </>
                )

                return (
                  <div key={item.href}>
                    <div className="flex items-center">
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={collapsed ? item.label : undefined}
                          className={linkClassName}
                          style={linkStyle}
                        >
                          {linkBody}
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={linkClassName}
                          style={linkStyle}
                        >
                          {linkBody}
                        </Link>
                      )}
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.href)}
                          className="mr-1 rounded p-1 text-white/30 transition hover:text-white/60"
                          aria-label={`Expand ${item.label}`}
                        >
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {hasChildren && isOpen && (
                      <div className="ml-5 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-3">
                        {item.children!.map((child) => {
                          const childActive = isActive(child.href) && pathname !== item.href
                          return (
                            <Link
                              key={child.href + child.label}
                              href={child.href}
                              className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition ${
                                childActive ? '' : 'text-white/40 hover:text-white/70'
                              }`}
                              style={childActive ? { color: config.brandColor } : undefined}
                            >
                              {child.icon && (
                                <span
                                  className={childActive ? '' : 'text-white/30'}
                                  style={childActive ? { color: config.brandColor } : undefined}
                                >
                                  <NavIcon name={child.icon} className="h-4 w-4" />
                                </span>
                              )}
                              {child.label}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/[0.06] px-2 py-3">
        <div className="space-y-1">
          <Link
            href={config.routes.home}
            title={collapsed ? 'Back to site' : undefined}
            className={`flex items-center rounded-lg py-1.5 text-sm text-white/50 transition hover:text-white/80 ${
              collapsed ? 'justify-center px-0' : 'gap-2.5 px-2'
            }`}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            {!collapsed && 'Back to site'}
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            title={collapsed ? 'Sign out' : undefined}
            className={`flex w-full items-center rounded-lg py-1.5 text-sm text-red-400/70 transition hover:text-red-400 ${
              collapsed ? 'justify-center px-0' : 'gap-2.5 px-2'
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && 'Sign out'}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className={`mt-2 flex w-full items-center rounded-lg py-1.5 text-sm text-white/30 transition hover:bg-white/[0.04] hover:text-white/60 ${
            collapsed ? 'justify-center px-0' : 'gap-2.5 px-2'
          }`}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4 shrink-0" />
          ) : (
            <>
              <PanelLeftClose className="h-4 w-4 shrink-0" />
              Collapse
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
