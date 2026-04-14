'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export interface ReviewCardProps {
  displayName: string;
  credential?: string;
  firm?: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  themeColor: string;
}

const TRUNCATE_LENGTH = 200

export function ReviewCard({
  displayName,
  credential,
  firm,
  rating,
  reviewText,
  createdAt,
  themeColor,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false)
  const needsTruncation = reviewText.length > TRUNCATE_LENGTH
  const displayText = !expanded && needsTruncation
    ? reviewText.slice(0, TRUNCATE_LENGTH) + '...'
    : reviewText

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className="group rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(17, 24, 39, 0.5)',
        border: `1px solid ${hexToRgba(themeColor, 0.1)}`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = hexToRgba(themeColor, 0.5)
        el.style.boxShadow = `0 8px 32px ${hexToRgba(themeColor, 0.15)}`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget
        el.style.borderColor = hexToRgba(themeColor, 0.1)
        el.style.boxShadow = 'none'
      }}
    >
      {/* Star rating */}
      <div className="flex gap-1 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={18}
            fill={i <= rating ? '#fbbf24' : 'transparent'}
            stroke={i <= rating ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
          />
        ))}
      </div>

      {/* Review text */}
      <p className="text-gray-300 text-sm leading-relaxed mb-4">
        &ldquo;{displayText}&rdquo;
        {needsTruncation && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="ml-1 font-medium hover:underline"
            style={{ color: themeColor }}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      {/* Divider */}
      <div className="border-t border-white/10 pt-4">
        {/* Name + credential */}
        <p className="text-white font-semibold text-sm">
          {displayName}
          {credential && <span className="text-gray-400 font-normal">, {credential}</span>}
        </p>

        {/* Firm */}
        {firm && <p className="text-gray-400 text-sm mt-0.5">{firm}</p>}

        {/* Date */}
        <p className="text-gray-500 text-xs mt-1">{formattedDate}</p>
      </div>
    </div>
  )
}
