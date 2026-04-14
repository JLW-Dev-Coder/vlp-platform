'use client'

import { useState, useEffect } from 'react'
import { Star, ArrowRight, AlertCircle } from 'lucide-react'
import { ReviewCard } from './ReviewCard'
import type { ReviewConfig, ReviewCardData } from '../../types/review'

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

interface ReviewDisplayPageProps {
  config: ReviewConfig;
  submitPath: string;
}

export function ReviewDisplayPage({ config, submitPath }: ReviewDisplayPageProps) {
  const [reviews, setReviews] = useState<ReviewCardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(
          `${config.apiBase}/v1/submissions/public?platform=${config.platform}&form_type=review&limit=50`
        )
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        const items: ReviewCardData[] = Array.isArray(json)
          ? json
          : json.data || json.submissions || []
        setReviews(items)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [config.apiBase, config.platform])

  const totalReviews = reviews.length
  const averageRating = totalReviews > 0
    ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews
    : 0

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section
        className="relative py-20 px-4 text-center overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(${hexToRgba(config.themeColor, 0.03)} 1px, transparent 1px),
            linear-gradient(90deg, ${hexToRgba(config.themeColor, 0.03)} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Tax Professionals Say About{' '}
            <span style={{ color: config.themeColor }}>{config.platformName}</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Real feedback from professionals who use the platform every day.
          </p>
        </div>
        {/* Gradient fade at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: 'linear-gradient(transparent, rgb(3, 7, 18))' }}
        />
      </section>

      {/* Stats bar */}
      {!loading && !error && totalReviews > 0 && (
        <section className="max-w-5xl mx-auto px-4 py-8">
          <div
            className="flex flex-wrap items-center justify-center gap-8 rounded-xl p-6"
            style={{
              background: 'rgba(17, 24, 39, 0.5)',
              border: `1px solid ${hexToRgba(config.themeColor, 0.15)}`,
            }}
          >
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: config.themeColor }}>
                {totalReviews}
              </p>
              <p className="text-gray-400 text-sm">
                {totalReviews === 1 ? 'Review' : 'Reviews'}
              </p>
            </div>
            <div className="w-px h-10 bg-white/10 hidden sm:block" />
            <div className="text-center">
              <div className="flex items-center gap-2 justify-center">
                <p className="text-3xl font-bold" style={{ color: config.themeColor }}>
                  {averageRating.toFixed(1)}
                </p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i <= Math.round(averageRating) ? '#fbbf24' : 'transparent'}
                      stroke={i <= Math.round(averageRating) ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-400 text-sm">Average Rating</p>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div
              className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${config.themeColor} transparent ${config.themeColor} ${config.themeColor}` }}
            />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="text-center py-20">
            <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
            <p className="text-gray-300 text-lg">Unable to load reviews. Please try again later.</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && totalReviews === 0 && (
          <div className="text-center py-20">
            <Star className="mx-auto mb-4 text-gray-600" size={48} />
            <p className="text-gray-300 text-lg mb-2">No reviews yet.</p>
            <p className="text-gray-500 mb-6">Be the first to share your experience.</p>
            <a
              href={submitPath}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: config.themeColor }}
            >
              Write a Review <ArrowRight size={18} />
            </a>
          </div>
        )}

        {/* Review cards grid */}
        {!loading && !error && totalReviews > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, idx) => (
              <ReviewCard
                key={review.id || idx}
                displayName={review.display_name}
                credential={review.credential}
                firm={review.anonymous ? undefined : review.firm}
                rating={review.rating}
                reviewText={review.content}
                createdAt={review.created_at}
                themeColor={config.themeColor}
              />
            ))}
          </div>
        )}
      </section>

      {/* CTA section */}
      {!loading && !error && (
        <section className="py-16 px-4 text-center" style={{ background: hexToRgba(config.themeColor, 0.05) }}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Used {config.platformName}?
          </h2>
          <p className="text-gray-400 mb-6">Share your experience and help fellow professionals.</p>
          <a
            href={submitPath}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: config.themeColor }}
          >
            Share Your Experience <ArrowRight size={18} />
          </a>
        </section>
      )}
    </div>
  )
}
