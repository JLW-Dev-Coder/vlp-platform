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
          DEFAULT: '#FF6B00',
          light: 'rgba(255, 107, 0, 0.12)',
          dark: '#CC5200',
          400: '#FF8533',
          500: '#FF6B00',
          primary: '#FF6B00',
          hover: '#E85D00',
          glow: 'rgba(255, 107, 0, 0.25)',
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
        'gradient-brand': 'linear-gradient(to right, #FF6B00, #F59E0B)',
      },
    },
  },
  plugins: [],
}

export default config
