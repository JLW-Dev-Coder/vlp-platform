import type { Config } from 'tailwindcss'

// TPP palette — registered in canonical-app-blueprint §4.5 (added in Phase 3 commit).
// Authoritative source for the rose/crimson/champagne/gold scheme.
const config: Config = {
  presets: [require('@vlp/member-ui/tailwind-preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/member-ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#E91E63',
          light: 'rgba(233, 30, 99, 0.15)',
          dark: '#C2185B',
          400: '#EC407A',
          500: '#E91E63',
          primary: '#E91E63',
          hover: '#D81B60',
          glow: 'rgba(233, 30, 99, 0.40)',
          'text-on-primary': '#FFFFFF',
          'gradient-to': '#8B1538',
        },
        tpp: {
          rose: '#E91E63',
          'rose-deep': '#C2185B',
          crimson: '#8B1538',
          'crimson-deep': '#5C0D24',
          champagne: '#F5E6D3',
          blush: '#FFE5EC',
          noir: '#1A0B14',
          'gold-leaf': '#D4A574',
          'gold-bright': '#E8C088',
        },
        ink: {
          900: '#1A0B14',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #E91E63, #8B1538)',
      },
    },
  },
  plugins: [],
}

export default config
