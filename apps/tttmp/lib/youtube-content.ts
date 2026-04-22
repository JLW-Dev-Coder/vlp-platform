import { GAME_CATALOG, type VesperiGame } from './vesperi-tree'

export interface YouTubeVideo {
  id: string
  gameSlug: string
  type: 'walkthrough' | 'short' | 'deep-dive'
  title: string
  description: string
  tags: string[]
  companionSlug: string
  companionTitle: string
  companionDescription: string
  youtubeUrl?: string
  duration?: string
}

export const YOUTUBE_CHANNEL_URL =
  'https://www.youtube.com/channel/UC2AeZcuISEo3yt_6EsKQtzQ'

export const YOUTUBE_DESCRIPTION_TEMPLATE = `[VIDEO_TITLE]

In this video:
[SUMMARY]

Play the game yourself:
https://taxtools.taxmonitor.pro/games/[GAME_SLUG]

Find the right game for you with Vesperi:
https://taxtools.taxmonitor.pro/vesperi

Explore the full Tax Tools Arcade:
https://taxtools.taxmonitor.pro

---
Tax Tools Arcade — interactive games that teach real IRS forms, tax concepts, and filing requirements.

Disclaimer: This content is for educational purposes and does not constitute legal or tax advice.

#TaxTools #IRS #TaxEducation #TaxGames #TaxProfessional #TaxFiling
`

export const GAME_TAG_MAP: Record<string, string[]> = {
  'irs-tax-detective': ['IRS', 'transaction codes', 'tax detective', 'IRS codes', 'tax transcript'],
  'tax-mythbusters-interactive-quiz': ['tax myths', 'tax facts', 'tax quiz', 'common tax mistakes'],
  'tax-scavenger-hunt': ['tax documents', 'W-2', '1099', 'tax forms', 'document checklist'],
  'tax-time-machine': ['tax history', 'tax law', 'income tax history', '16th amendment'],
  'match-the-tax-notice': ['IRS notice', 'CP notice', 'IRS letters', 'tax notice codes'],
  'irs-notice-jackpot': ['IRS notice', 'notice matching', 'CP2000', 'IRS correspondence'],
  'irs-notice-showdown': ['IRS notice', 'notice identification', 'tax notice response'],
  'tax-deadline-master': ['tax deadlines', 'April 15', 'estimated tax', 'extension deadline', 'quarterly taxes'],
  'tax-deduction-quest': ['tax deductions', 'itemized deductions', 'standard deduction', 'tax write-offs'],
  'taxpayer-journey-map': ['life events taxes', 'marriage taxes', 'new baby taxes', 'retirement taxes'],
  'tax-filing-race': ['tax filing', 'filing status', 'tax return', 'e-file'],
  'tax-tips-refund-boost': ['tax refund', 'maximize refund', 'tax tips', 'refund boost'],
  'circular-230-quest': ['Circular 230', 'tax practice', 'Treasury regulations', 'tax practitioner ethics'],
  'tax-jargon-game': ['tax vocabulary', 'tax terms', 'tax glossary', 'AGI', 'MAGI'],
  'tax-strategy-adventures': ['tax strategy', 'tax planning', 'tax optimization', 'tax-loss harvesting'],
  'tax-escape-room-adventure': ['tax code', 'tax puzzle', 'IRC', 'tax escape room'],
  'irs-publication-maze': ['IRS publications', 'IRS guidance', 'Publication 17', 'tax reference'],
  'audit-defense-showdown': ['IRS audit', 'audit defense', 'tax audit preparation', 'audit response'],
  'international-tax-explorer': ['international tax', 'FBAR', 'FATCA', 'foreign income', 'tax treaty'],
  'tax-return-simulator': ['tax return', 'tax calculator', 'tax liability', 'income tax calculation'],
  'tax-document-hunter': ['tax documents', 'tax records', 'document organization', 'tax filing checklist'],
}

export function generateContentPlan(): YouTubeVideo[] {
  return GAME_CATALOG.map((game: VesperiGame) => ({
    id: `${game.slug}-walkthrough`,
    gameSlug: game.slug,
    type: 'walkthrough' as const,
    title: `${game.title} — Tax Tools Arcade Game Walkthrough`,
    description: `Learn ${game.description.replace(/\.$/, '')} with this interactive game walkthrough. Vesperi walks you through the game and explains the key tax concepts.`,
    tags: [
      ...(GAME_TAG_MAP[game.slug] || []),
      'Tax Tools Arcade',
      'tax education',
      'interactive learning',
      `${game.tokens} token game`,
    ],
    companionSlug: game.slug,
    companionTitle: `Learn: ${game.title}`,
    companionDescription: `${game.description} Watch the walkthrough video and play the game in the Tax Tools Arcade.`,
  }))
}

export const CONTENT_PLAN = generateContentPlan()

export function getVideoBySlug(slug: string): YouTubeVideo | undefined {
  return CONTENT_PLAN.find((v) => v.companionSlug === slug)
}

export type TopicClusterId =
  | 'notices'
  | 'strategy'
  | 'client-ed'
  | 'filing'
  | 'concepts'
  | 'documents'

export interface TopicCluster {
  id: TopicClusterId
  label: string
  description: string
  gameSlugs: string[]
}

export const TOPIC_CLUSTERS: TopicCluster[] = [
  {
    id: 'notices',
    label: 'IRS Notices & Codes',
    description: 'Decode IRS notices and transaction codes.',
    gameSlugs: ['irs-tax-detective', 'match-the-tax-notice', 'irs-notice-jackpot', 'irs-notice-showdown'],
  },
  {
    id: 'strategy',
    label: 'Strategy & Compliance',
    description: 'Advanced games for serious practitioners.',
    gameSlugs: [
      'circular-230-quest',
      'tax-strategy-adventures',
      'audit-defense-showdown',
      'irs-publication-maze',
      'international-tax-explorer',
      'tax-escape-room-adventure',
    ],
  },
  {
    id: 'client-ed',
    label: 'Client Education',
    description: 'Games to share with clients.',
    gameSlugs: ['tax-mythbusters-interactive-quiz', 'taxpayer-journey-map', 'tax-deduction-quest', 'tax-return-simulator'],
  },
  {
    id: 'filing',
    label: 'Filing & Deadlines',
    description: 'Get filing-ready with these games.',
    gameSlugs: ['tax-deadline-master', 'tax-filing-race', 'tax-tips-refund-boost'],
  },
  {
    id: 'concepts',
    label: 'Tax Concepts',
    description: 'Build your tax knowledge from the ground up.',
    gameSlugs: ['tax-time-machine', 'tax-jargon-game'],
  },
  {
    id: 'documents',
    label: 'Documents & Forms',
    description: 'Hands-on practice with tax documents.',
    gameSlugs: ['tax-scavenger-hunt', 'tax-document-hunter'],
  },
]
