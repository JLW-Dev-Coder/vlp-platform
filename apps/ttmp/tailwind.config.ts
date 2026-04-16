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
          teal: '#14b8a6',
          'teal-dark': '#0d9488',
          'teal-darker': '#0f766e',
          400: '#2dd4bf',
          500: '#14b8a6',
          primary: '#14b8a6',
          hover: '#27bead',
          dark: '#119c8d',
          light: 'rgba(20, 184, 166, 0.15)',
          glow: 'rgba(20, 184, 166, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': 'rgba(20, 184, 166, 0.15)',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #14b8a6, #0d9488)',
      },
    },
  },
  plugins: [],
}

export default config
