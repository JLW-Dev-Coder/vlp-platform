import type { Config } from 'tailwindcss'

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
          violet: '#8b5cf6',
          purple: '#7c3aed',
          400: '#a78bfa',
          500: '#8b5cf6',
          primary: '#8b5cf6',
          hover: '#9469f7',
          dark: '#764ed1',
          light: 'rgba(139, 92, 246, 0.15)',
          glow: 'rgba(139, 92, 246, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': 'rgba(139, 92, 246, 0.15)',
        },
        ink: {
          900: '#0F0F1A',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      },
    },
  },
  plugins: [],
}

export default config
