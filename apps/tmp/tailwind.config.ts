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
          amber: '#f59e0b',
          orange: '#f97316',
          400: '#fbbf24',
          500: '#f59e0b',
          primary: '#f59e0b',
          hover: '#f6a61f',
          dark: '#d08609',
          light: 'rgba(245, 158, 11, 0.15)',
          glow: 'rgba(245, 158, 11, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': 'rgba(245, 158, 11, 0.15)',
        },
        ink: {
          900: '#020617',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #f59e0b, #d97706)',
      },
    },
  },
  plugins: [],
}

export default config
