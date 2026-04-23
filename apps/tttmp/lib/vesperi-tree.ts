/**
 * Vesperi decision-tree data.
 *
 * Videos are served via the Worker at:
 *   https://api.taxmonitor.pro/v1/tttmp/vesperi/clips/{node-id}.mp4
 *
 * Clips live in R2 at `tttmp/vesperi/clips/{node-id}.mp4`. Missing videos
 * fall back to the context line + transcript — the page is functional
 * without any videos present.
 */

export type GameType =
  | 'Matching'
  | 'Quiz'
  | 'Scavenger'
  | 'Timeline'
  | 'Adventure'
  | 'RPG'
  | 'Puzzle'
  | 'Simulator'

export type Audience = 'tax-pro' | 'taxpayer'

export type TopicId =
  | 'notices'
  | 'strategy'
  | 'client-ed'
  | 'filing'
  | 'concepts'
  | 'documents'
  | 'all-games'

export interface VesperiGame {
  title: string
  slug: string
  type: GameType
  tokens: 2 | 5 | 8
  description: string
}

export interface VesperiOption {
  label: string
  targetNodeId: string
}

export interface VesperiNode {
  id: string
  videoFallbackText: string
  contextLine: string
  transcript: string
  type: 'branch' | 'leaf' | 'all-games'
  options?: VesperiOption[]
  gameSlugs?: string[]
  audience?: Audience
  topic?: TopicId
}

export const GAME_CATALOG: VesperiGame[] = [
  // Tier 1 — Starter (2 tokens)
  { title: 'IRS Tax Detective', slug: 'irs-tax-detective', type: 'Matching', tokens: 2, description: 'Decode IRS transaction codes in a detective-themed matching game.' },
  { title: 'Tax Mythbusters Quiz', slug: 'tax-mythbusters-interactive-quiz', type: 'Quiz', tokens: 2, description: 'True-or-false quiz debunking common tax myths.' },
  { title: 'Tax Scavenger Hunt', slug: 'tax-scavenger-hunt', type: 'Scavenger', tokens: 2, description: 'Find hidden tax documents in an office scene.' },
  { title: 'Tax Time Machine', slug: 'tax-time-machine', type: 'Timeline', tokens: 2, description: 'Interactive timeline of U.S. tax law evolution.' },
  // Tier 2 — Intermediate (5 tokens)
  { title: 'Match the Tax Notice', slug: 'match-the-tax-notice', type: 'Matching', tokens: 5, description: 'Match notice descriptions to CP-series codes in a speed round.' },
  { title: 'IRS Notice Jackpot', slug: 'irs-notice-jackpot', type: 'Matching', tokens: 5, description: 'Slot-machine matching — spin and match notice codes to clues.' },
  { title: 'IRS Notice Showdown', slug: 'irs-notice-showdown', type: 'Matching', tokens: 5, description: 'Drag-and-drop matching of notice excerpts to IRS notices.' },
  { title: 'Tax Deadline Master', slug: 'tax-deadline-master', type: 'Quiz', tokens: 5, description: 'Challenge covering every major IRS and federal deadline.' },
  { title: 'Tax Deduction Quest', slug: 'tax-deduction-quest', type: 'Matching', tokens: 5, description: 'Match deductions to categories across 15 categories.' },
  { title: 'Taxpayer Journey Map', slug: 'taxpayer-journey-map', type: 'Adventure', tokens: 5, description: 'Follow a taxpayer through life events and tax impacts.' },
  { title: 'Tax Filing Race', slug: 'tax-filing-race', type: 'Quiz', tokens: 5, description: 'Rapid-fire filing questions against the clock.' },
  { title: 'Tax Tips Refund Boost', slug: 'tax-tips-refund-boost', type: 'Quiz', tokens: 5, description: '20-question quiz on practical refund-boosting tips.' },
  // Tier 3 — Advanced (8 tokens)
  { title: 'Circular 230 Quest', slug: 'circular-230-quest', type: 'RPG', tokens: 8, description: 'Zone-based quest through Circular 230 Treasury rules.' },
  { title: 'Tax Jargon Game', slug: 'tax-jargon-game', type: 'Quiz', tokens: 8, description: 'Vocabulary trainer with flashcards for 200+ tax terms.' },
  { title: 'Tax Strategy Adventures', slug: 'tax-strategy-adventures', type: 'RPG', tokens: 8, description: 'RPG-style progression through tax-planning strategies.' },
  { title: 'Tax Escape Room Adventure', slug: 'tax-escape-room-adventure', type: 'Puzzle', tokens: 8, description: 'Puzzle-based escape room themed around tax code.' },
  { title: 'IRS Publication Maze', slug: 'irs-publication-maze', type: 'Puzzle', tokens: 8, description: 'Navigate IRS publications and answer questions.' },
  { title: 'Audit Defense Showdown', slug: 'audit-defense-showdown', type: 'Quiz', tokens: 8, description: 'Audit procedures and defense strategy scenarios.' },
  { title: 'International Tax Explorer', slug: 'international-tax-explorer', type: 'Adventure', tokens: 8, description: 'World map navigation for foreign income rules and treaties.' },
  { title: 'Tax Return Simulator', slug: 'tax-return-simulator', type: 'Simulator', tokens: 8, description: 'Enter income/deductions/credits and watch liability change.' },
  { title: 'Tax Document Hunter', slug: 'tax-document-hunter', type: 'Scavenger', tokens: 8, description: 'Collect tax documents across 10 categories.' },
]

export function getGameBySlug(slug: string): VesperiGame | undefined {
  return GAME_CATALOG.find((g) => g.slug === slug)
}

export const VESPERI_TREE: Record<string, VesperiNode> = {
  root: {
    id: 'root',
    type: 'branch',
    contextLine: '21 games. Let’s find your starting point.',
    videoFallbackText: 'Hi! I’m Vesperi — your guide to the Tax Tools Arcade.',
    transcript:
      "Hi! I'm Vesperi, your guide to the Tax Tools Arcade. We've got 21 games covering everything from IRS notice codes to international tax treaties. Let me help you find the right ones. First — who are you?",
    options: [
      { label: 'I’m a Tax Professional', targetNodeId: 'tax-pro' },
      { label: 'I’m a Taxpayer', targetNodeId: 'taxpayer' },
    ],
  },
  'tax-pro': {
    id: 'tax-pro',
    type: 'branch',
    audience: 'tax-pro',
    contextLine: 'Pick a focus area or browse everything.',
    videoFallbackText: 'Welcome — tax pros use the Arcade to sharpen skills and prep clients.',
    transcript:
      "Welcome! Tax pros use the Arcade to sharpen their own skills and to prep clients before appointments. When your client plays through a game before they walk in, they already understand the basics. What do you want to focus on?",
    options: [
      { label: 'IRS Notices & Codes', targetNodeId: 'notices' },
      { label: 'Strategy & Compliance', targetNodeId: 'strategy' },
      { label: 'Client Education', targetNodeId: 'client-ed' },
      { label: 'Browse All Games', targetNodeId: 'all-games-pro' },
    ],
  },
  taxpayer: {
    id: 'taxpayer',
    type: 'branch',
    audience: 'taxpayer',
    contextLine: 'Pick a topic or explore everything.',
    videoFallbackText: 'Welcome — our games make tax concepts click.',
    transcript:
      "Welcome! Our games make tax concepts click — no jargon, no tricks. Each one teaches something real about how taxes work. What are you most interested in?",
    options: [
      { label: 'Filing & Deadlines', targetNodeId: 'filing' },
      { label: 'Understanding Tax Concepts', targetNodeId: 'concepts' },
      { label: 'Documents & Forms', targetNodeId: 'documents' },
      { label: 'Browse All Games', targetNodeId: 'all-games-tp' },
    ],
  },
  notices: {
    id: 'notices',
    type: 'leaf',
    audience: 'tax-pro',
    topic: 'notices',
    contextLine: 'Master IRS notices from basics to speed rounds.',
    videoFallbackText: 'IRS notices and transaction codes — start with the Detective game.',
    transcript:
      "IRS notices and transaction codes are the bread and butter of tax practice. These games train your pattern recognition — start with the Detective game to learn the codes, then level up to the speed rounds.",
    gameSlugs: ['irs-tax-detective', 'match-the-tax-notice', 'irs-notice-jackpot', 'irs-notice-showdown'],
  },
  strategy: {
    id: 'strategy',
    type: 'leaf',
    audience: 'tax-pro',
    topic: 'strategy',
    contextLine: 'Advanced games for serious practitioners.',
    videoFallbackText: 'The deep-dive games for practitioners.',
    transcript:
      "These are the deep-dive games for practitioners. Circular 230, audit defense, international compliance — the kind of knowledge that separates good tax pros from great ones.",
    gameSlugs: [
      'circular-230-quest',
      'tax-strategy-adventures',
      'audit-defense-showdown',
      'irs-publication-maze',
      'international-tax-explorer',
    ],
  },
  'client-ed': {
    id: 'client-ed',
    type: 'leaf',
    audience: 'tax-pro',
    topic: 'client-ed',
    contextLine: 'Games to share with your clients.',
    videoFallbackText: 'Perfect to share with clients before an appointment.',
    transcript:
      "These games are perfect to share with clients. Send them the link before an appointment — they'll arrive understanding deductions, tax impacts of life events, and how a return actually works.",
    gameSlugs: ['tax-mythbusters-interactive-quiz', 'taxpayer-journey-map', 'tax-deduction-quest', 'tax-return-simulator'],
  },
  filing: {
    id: 'filing',
    type: 'leaf',
    audience: 'taxpayer',
    topic: 'filing',
    contextLine: 'Get filing-ready with these games.',
    videoFallbackText: 'Filing season doesn’t have to be stressful.',
    transcript:
      "Filing season doesn't have to be stressful. These games cover deadlines, common myths, and practical tips to maximize your refund. Start with Mythbusters — it's quick and eye-opening.",
    gameSlugs: ['tax-mythbusters-interactive-quiz', 'tax-deadline-master', 'tax-filing-race', 'tax-tips-refund-boost'],
  },
  concepts: {
    id: 'concepts',
    type: 'leaf',
    audience: 'taxpayer',
    topic: 'concepts',
    contextLine: 'Build your tax knowledge from the ground up.',
    videoFallbackText: 'Build your tax vocabulary and understanding.',
    transcript:
      "Tax doesn't have to be confusing. These games build your vocabulary, show how tax law evolved, and walk you through real-life tax scenarios — all at your own pace.",
    gameSlugs: ['tax-time-machine', 'tax-jargon-game', 'taxpayer-journey-map', 'tax-deduction-quest'],
  },
  documents: {
    id: 'documents',
    type: 'leaf',
    audience: 'taxpayer',
    topic: 'documents',
    contextLine: 'Hands-on practice with tax documents and forms.',
    videoFallbackText: 'Learn what each tax form is and where it goes.',
    transcript:
      "If tax forms make your eyes glaze over, these games fix that. You'll learn what each document is, where it goes, and how it all fits together on a real return.",
    gameSlugs: ['tax-scavenger-hunt', 'tax-document-hunter', 'tax-return-simulator'],
  },
  'all-games-pro': {
    id: 'all-games-pro',
    type: 'all-games',
    audience: 'tax-pro',
    topic: 'all-games',
    contextLine: 'All 21 games, grouped by level.',
    videoFallbackText: 'Here’s the full Arcade — 21 games, grouped by token cost.',
    transcript:
      "Here's the full Arcade — 21 games, organized by how many tokens they cost. Start with the 2-token games if you're new, or jump straight to the 8-token deep dives if you're ready.",
  },
  'all-games-tp': {
    id: 'all-games-tp',
    type: 'all-games',
    audience: 'taxpayer',
    topic: 'all-games',
    contextLine: 'All 21 games, grouped by level.',
    videoFallbackText: 'Here’s the full Arcade — 21 games, grouped by token cost.',
    transcript:
      "Here's the full Arcade — 21 games, organized by how many tokens they cost. Start with the 2-token games if you're new, or jump straight to the 8-token deep dives if you're ready.",
  },
}

export const VESPERI_VIDEO_BASE = 'https://api.taxmonitor.pro/v1/tttmp/vesperi/clips'

// Node id → R2 clip name. Tree nodes split all-games into pro/taxpayer variants
// to persist audience through "Back" navigation, but both use the same clip.
export function clipNameForNode(nodeId: string): string {
  if (nodeId === 'all-games-pro' || nodeId === 'all-games-tp') return 'all-games'
  return nodeId
}
