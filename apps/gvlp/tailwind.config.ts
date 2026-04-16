import type { Config } from 'tailwindcss'

const config: Config = {
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
          green: '#22c55e',
          emerald: '#10b981',
          400: '#4ade80',
          500: '#22c55e',
          primary: '#22c55e',
          hover: '#34ca6b',
          dark: '#1da750',
          light: 'rgba(34, 197, 94, 0.15)',
          glow: 'rgba(34, 197, 94, 0.40)',
          'text-on-primary': '#ffffff',
        },
        ink: {
          900: '#1a0a10',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #22c55e, #10b981)',
      },
    },
  },
  plugins: [],
}

export default config
