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
        },
        ink: {
          900: '#1a0a10',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'var(--font-raleway)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #22c55e, #10b981)',
      },
    },
  },
  plugins: [],
}

export default config
