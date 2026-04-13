'use client'

import type { ReactNode } from 'react'

interface HeroCardProps {
  brandColor: string
  userName?: string
  planName?: string
  tierLabel?: string
  memberSince?: string
  children?: ReactNode
  className?: string
}

export function HeroCard({
  brandColor,
  userName,
  planName,
  tierLabel,
  memberSince,
  children,
  className = '',
}: HeroCardProps) {
  return (
    <div
      className={`rounded-xl border p-6 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${brandColor}20, ${brandColor}08)`,
        borderColor: `${brandColor}33`,
      }}
    >
      {children ?? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {userName && (
              <>
                <p
                  className="text-xs uppercase tracking-widest"
                  style={{ color: `${brandColor}b3` }}
                >
                  Welcome back
                </p>
                <h2 className="mt-1 text-xl font-semibold text-white">{userName}</h2>
              </>
            )}
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm text-white/60">
              {tierLabel && (
                <span>
                  <span className="text-white/40">Tier:</span>{' '}
                  <span className="font-medium" style={{ color: brandColor }}>
                    {tierLabel}
                  </span>
                </span>
              )}
              {planName && (
                <span>
                  <span className="text-white/40">Plan:</span>{' '}
                  <span className="text-white/80">{planName}</span>
                </span>
              )}
            </div>
          </div>
          {memberSince && (
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Member since</p>
              <p className="text-sm font-medium text-white/80">{memberSince}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
