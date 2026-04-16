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
          purple: '#a855f7',
          violet: '#8b5cf6',
          400: '#c084fc',
          500: '#a855f7',
          primary: '#a855f7',
          hover: '#af63f8',
          dark: '#8f48d2',
          light: 'rgba(168, 85, 247, 0.15)',
          glow: 'rgba(168, 85, 247, 0.40)',
          'text-on-primary': '#ffffff',
        },
        ink: {
          900: '#07070A',
        },
      },
      fontFamily: {
        sans: ['Sora', 'var(--font-raleway)', 'DM Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #a855f7, #8b5cf6)',
      },
    },
  },
  plugins: [],
}

export default config
