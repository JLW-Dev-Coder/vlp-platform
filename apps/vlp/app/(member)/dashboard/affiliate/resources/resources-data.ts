export type ResourceCategory = 'scripts' | 'talking-points' | 'templates' | 'faq'

export interface Resource {
  id: string
  category: ResourceCategory
  title: string
  description: string
  body: string
}

export const RESOURCE_CATEGORIES: Array<{ id: ResourceCategory; label: string; description: string }> = [
  {
    id: 'scripts',
    label: 'Outreach Scripts',
    description: 'Copy-paste messages for cold outreach across LinkedIn, Threads, Facebook, and email.',
  },
  {
    id: 'talking-points',
    label: 'Talking Points',
    description: 'What to say when prospects ask about VLP, pricing, or how the program works.',
  },
  {
    id: 'templates',
    label: 'Proposal Templates',
    description: 'Ready-to-send proposal language for service bureau and tax pro prospects.',
  },
  {
    id: 'faq',
    label: 'FAQ Responses',
    description: 'Pre-written answers to common objections and questions.',
  },
]

export const RESOURCES: Resource[] = [
  {
    id: 'placeholder-script-1',
    category: 'scripts',
    title: 'Placeholder script — to be authored',
    description: 'Outreach scripts will land here in a follow-up commit.',
    body: 'Content pending.',
  },
  {
    id: 'placeholder-talking-points-1',
    category: 'talking-points',
    title: 'Placeholder talking points — to be authored',
    description: 'Talking points will land here in a follow-up commit.',
    body: 'Content pending.',
  },
  {
    id: 'placeholder-template-1',
    category: 'templates',
    title: 'Placeholder proposal template — to be authored',
    description: 'Proposal templates will land here in a follow-up commit.',
    body: 'Content pending.',
  },
  {
    id: 'placeholder-faq-1',
    category: 'faq',
    title: 'Placeholder FAQ — to be authored',
    description: 'FAQ responses will land here in a follow-up commit.',
    body: 'Content pending.',
  },
]
