import Link from 'next/link'
import type { Metadata } from 'next'
import { getAllGames } from '@/lib/games'

export const metadata: Metadata = {
  title: 'Tax Tools Arcade — Interactive Tax Games',
  description: 'Learn tax concepts through 21 interactive games covering notices, deductions, Circular 230, audits, and more.',
}

export default function GamesIndexPage() {
  const games = getAllGames()

  return (
    <main className="arcade-grid-bg min-h-screen py-16 px-6">
      <section className="max-w-6xl mx-auto text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-neon-violet border border-neon-violet/40 bg-neon-violet/10 mb-6 animate-neon-pulse">
          21 Games · Tax Season 2026
        </span>
        <h1 className="font-sora text-5xl md:text-6xl font-bold text-white neon-text-violet mb-4">
          Tax Tools Arcade
        </h1>
        <p className="text-lg text-arcade-text-muted max-w-2xl mx-auto">
          Step inside. Each game teaches a real tax concept through play — from notice triage to transaction codes to Circular 230.
        </p>
      </section>

      <section className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="arcade-card-interactive animate-fade-up p-6 flex flex-col group"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-neon-cyan/90 bg-neon-cyan/10 border border-neon-cyan/30 px-2.5 py-1 rounded-full">
                  {game.category}
                </span>
                <span className={`token-badge token-badge-${game.tokenCost}`}>
                  {game.tokenCost}t
                </span>
              </div>
              <h2 className="font-sora text-xl font-bold text-white mb-2 group-hover:text-neon-violet transition-colors">
                {game.title}
              </h2>
              <p className="text-sm text-arcade-text-muted leading-relaxed flex-1 mb-5">
                {game.description}
              </p>
              <span className="text-sm font-semibold text-neon-green group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Play Now <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
