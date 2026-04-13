export const GVLP_TIERS = {
  starter:    { tokens: 100,  games: 1, monthly: 0  },
  apprentice: { tokens: 500,  games: 3, monthly: 9  },
  strategist: { tokens: 1500, games: 6, monthly: 19 },
  navigator:  { tokens: 5000, games: 9, monthly: 39 },
} as const;

export const GVLP_GAME_UNLOCK = {
  starter:    ['tax-trivia'],
  apprentice: ['tax-trivia', 'tax-match-mania', 'tax-spin-wheel'],
  strategist: ['tax-trivia', 'tax-match-mania', 'tax-spin-wheel', 'tax-word-search', 'irs-fact-or-fiction', 'capital-gains-climb'],
  navigator:  ['tax-trivia', 'tax-match-mania', 'tax-spin-wheel', 'tax-word-search', 'irs-fact-or-fiction', 'capital-gains-climb', 'deduction-dash', 'refund-rush', 'audit-escape-room'],
} as const;

export const GAME_SLUGS = [
  'tax-trivia', 'tax-match-mania', 'tax-spin-wheel',
  'tax-word-search', 'irs-fact-or-fiction', 'capital-gains-climb',
  'deduction-dash', 'refund-rush', 'audit-escape-room',
] as const;

export type TierKey = keyof typeof GVLP_TIERS;
export type GameSlug = typeof GAME_SLUGS[number];

export const GAME_META: Record<GameSlug, { name: string; description: string; emoji: string }> = {
  'tax-trivia':            { name: 'Tax Trivia',           description: 'Test your clients\' tax knowledge with 10 rapid-fire questions. Fun, educational, and surprisingly addictive.',  emoji: '🏛️' },
  'tax-match-mania':       { name: 'Tax Match Mania',       description: 'Match tax terms to definitions in this fast-paced memory game. Great for learning deductions and credits.',       emoji: '🃏' },
  'tax-spin-wheel':        { name: 'Tax Spin Wheel',        description: 'Spin to win! Each spin reveals a tax tip, discount, or bonus. Clients love the suspense.',                        emoji: '🎰' },
  'tax-word-search':       { name: 'Tax Word Search',       description: 'Hunt for hidden tax terms in a grid of letters. A calming, educational puzzle for all ages.',                     emoji: '🔍' },
  'irs-fact-or-fiction':   { name: 'IRS Fact or Fiction',   description: 'Can you tell real IRS rules from tax myths? Swipe left or right on statements and learn the truth.',              emoji: '🤔' },
  'capital-gains-climb':   { name: 'Capital Gains Climb',   description: 'Answer capital gains questions to climb the leaderboard. Perfect for investors and business owners.',               emoji: '📈' },
  'deduction-dash':        { name: 'Deduction Dash',        description: 'Race against the clock to identify valid deductions. Fast-paced and full of surprises.',                           emoji: '⚡' },
  'refund-rush':           { name: 'Refund Rush',           description: 'Help clients maximize their refunds by making smart filing decisions in this strategy game.',                      emoji: '💰' },
  'audit-escape-room':     { name: 'Audit Escape Room',     description: 'Solve tax puzzles to escape a simulated audit. Thrilling, educational, and perfect for compliance training.',      emoji: '🔐' },
};
