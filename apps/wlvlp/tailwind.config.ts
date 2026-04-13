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
