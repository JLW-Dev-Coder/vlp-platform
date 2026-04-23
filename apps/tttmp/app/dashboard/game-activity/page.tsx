'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { AppShell, AuthGate } from '@vlp/member-ui'
import { tttmpConfig } from '@/lib/platform-config'
import { api } from '@/lib/api'
import { GAMES } from '@/lib/games'

interface GameSession {
  id: string
  game_slug: string
  grant_id: string
  tokens_cost: number
  started_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function GameActivityContent() {
  const [sessions, setSessions] = useState<GameSession[] | null>(null)
  const [total, setTotal] = useState(0)
  const [tokensSpent, setTokensSpent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const gameTitleBySlug = useMemo(() => {
    const map: Record<string, string> = {}
    for (const g of GAMES) map[g.slug] = g.title
    return map
  }, [])

  useEffect(() => {
    let cancelled = false
    api.getGameSessions()
      .then((data) => {
        if (cancelled) return
        setSessions(data.sessions)
        setTotal(data.total)
        setTokensSpent(data.tokens_spent)
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load game activity.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const favoriteGame = useMemo(() => {
    if (!sessions || sessions.length === 0) return null
    const counts: Record<string, number> = {}
    for (const s of sessions) {
      counts[s.game_slug] = (counts[s.game_slug] || 0) + 1
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? { slug: top[0], count: top[1] } : null
  }, [sessions])

  const sectionStyle: React.CSSProperties = {
    background: 'var(--arcade-surface)',
    border: '1px solid var(--arcade-border)',
    borderRadius: '1rem',
  }

  return (
    <div className="arcade-grid-bg min-h-full px-6 py-10 md:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-sora text-3xl font-extrabold text-white mb-2">
          Game Activity
        </h1>
        <p className="text-sm text-[var(--arcade-text-muted)] mb-8">
          Your full history of games played in the Arcade.
        </p>

        {/* Summary Stats */}
        <section className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard
            label="Total Games"
            value={loading ? '—' : String(total)}
            color="var(--neon-violet)"
            glow="var(--arcade-glow-violet)"
          />
          <StatCard
            label="Tokens Spent"
            value={loading ? '—' : String(tokensSpent)}
            color="var(--neon-amber)"
            glow="var(--arcade-glow-amber)"
          />
          <StatCard
            label="Favorite Game"
            value={
              loading
                ? '—'
                : favoriteGame
                  ? (gameTitleBySlug[favoriteGame.slug] || favoriteGame.slug)
                  : '—'
            }
            color="var(--neon-green)"
            glow="var(--arcade-glow-green)"
            small
          />
          <StatCard
            label="Unique Games"
            value={
              loading
                ? '—'
                : sessions
                  ? String(new Set(sessions.map((s) => s.game_slug)).size)
                  : '0'
            }
            color="#06b6d4"
            glow="0 0 20px rgba(6, 182, 212, 0.35)"
          />
        </section>

        {/* History */}
        <section className="p-6" style={sectionStyle}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)] mb-4">
            Recent Plays
          </h2>

          {loading ? (
            <p className="text-center text-[var(--arcade-text-muted)] py-8">
              Loading…
            </p>
          ) : error ? (
            <p className="text-center text-red-400 py-8">{error}</p>
          ) : !sessions || sessions.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-[var(--arcade-text-muted)] mb-4">
                No games played yet. Browse the Arcade to get started.
              </p>
              <Link
                href="/games"
                className="arcade-btn arcade-btn-primary inline-flex h-11 items-center px-6"
              >
                Browse Games
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-left"
                    style={{ borderBottom: '1px solid var(--arcade-border)' }}
                  >
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Game
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Date
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Tokens
                    </th>
                    <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-[var(--neon-violet)]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s) => (
                    <tr
                      key={s.id}
                      style={{ borderBottom: '1px solid var(--arcade-border)' }}
                    >
                      <td className="py-3 px-3 font-semibold text-white">
                        {gameTitleBySlug[s.game_slug] || s.game_slug}
                      </td>
                      <td className="py-3 px-3 text-[var(--arcade-text)]">
                        {formatDate(s.started_at)}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[var(--neon-amber)]">
                        {s.tokens_cost}
                      </td>
                      <td className="py-3 px-3">
                        <Link
                          href={`/games/${s.game_slug}`}
                          className="text-[var(--neon-violet)] hover:underline"
                        >
                          View game →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  color,
  glow,
  small,
}: {
  label: string
  value: string
  color: string
  glow: string
  small?: boolean
}) {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: 'var(--bg, #0a0a1a)',
        border: `1px solid ${color}`,
        boxShadow: glow,
      }}
    >
      <div className="text-xs font-semibold uppercase tracking-widest text-[var(--arcade-text-muted)]">
        {label}
      </div>
      <div
        className={`font-sora font-extrabold mt-1 ${small ? 'text-base' : 'text-3xl'}`}
        style={{ color, textShadow: `0 0 20px ${color}55` }}
      >
        {value}
      </div>
    </div>
  )
}

export default function GameActivityPage() {
  return (
    <AuthGate apiBaseUrl={tttmpConfig.apiBaseUrl}>
      <AppShell config={tttmpConfig}>
        <GameActivityContent />
      </AppShell>
    </AuthGate>
  )
}
