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
          DEFAULT: '#22C55E',
          light: 'rgba(34, 197, 94, 0.12)',
          dark: '#15803D',
          400: '#4ADE80',
          500: '#22C55E',
          primary: '#22C55E',
          hover: '#16A34A',
          glow: 'rgba(34, 197, 94, 0.25)',
          'text-on-primary': '#FFFFFF',
          'gradient-to': '#F59E0B',
        },
        ink: {
          900: '#0f1117',
        },
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #22C55E, #F59E0B)',
      },
    },
  },
  plugins: [],
}

export default config
