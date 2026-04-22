import { notFound } from 'next/navigation'
import { getGame } from '@/lib/games'
import PlayClient from './PlayClient'

export const runtime = 'edge'

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const game = getGame(slug)
  if (!game) notFound()
  return <PlayClient slug={game.slug} title={game.title} />
}
