'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, Bell, HelpCircle, LogOut, Settings, UserCircle } from 'lucide-react'
import type { PlatformConfig } from '../types/config'

interface MemberTopbarProps {
  config: PlatformConfig
  session: { email: string | null; avatar: string | null }
  onSignOut: () => void
}

export function MemberTopbar({ config, session, onSignOut }: MemberTopbarProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const initial = session.email ? session.email[0].toUpperCase() : '?'

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-white/[0.08] bg-[--member-bg]/80 px-6 backdrop-blur">
      {/* Search */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] py-2.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition"
          style={{
            // @ts-expect-error -- CSS custom property focus style handled via class
            '--tw-ring-color': `${config.brandColor}66`,
          }}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">
        <Link
          href="/notifications"
          className="relative rounded-lg p-2.5 text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </Link>

        <Link
          href="/help"
          className="rounded-lg p-2.5 text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          aria-label="Help Center"
        >
          <HelpCircle className="h-5 w-5" />
        </Link>

        {/* Avatar + dropdown */}
        <div className="relative ml-2" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition hover:ring-2"
            style={{ '--tw-ring-color': `${config.brandColor}66` } as React.CSSProperties}
            aria-label="Account menu"
          >
            {session.avatar ? (
              <img src={session.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
            ) : (
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${config.brandColor}, ${config.brandColor}cc)` }}
              >
                {initial}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 top-full z-50 mt-2 min-w-52 rounded-xl border border-white/[0.08] bg-[#0f1333] p-2 shadow-2xl">
              {session.email && (
                <div className="truncate px-3 py-2 text-xs text-white/40">{session.email}</div>
              )}
              <div className="my-1 border-t border-white/[0.06]" />
              <Link
                href={config.routes.account}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <Settings className="h-4 w-4" />
                Account
              </Link>
              <Link
                href={config.routes.profile}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <UserCircle className="h-4 w-4" />
                Profile
              </Link>
              <Link
                href={config.routes.support}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 transition hover:bg-white/[0.06] hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
                Support
              </Link>
              <div className="my-1 border-t border-white/[0.06]" />
              <button
                type="button"
                onClick={onSignOut}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400/70 transition hover:bg-red-900/20"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
