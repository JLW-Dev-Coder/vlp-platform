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
          red: '#ef4444',
          rose: '#f43f5e',
          400: '#f87171',
          500: '#ef4444',
        },
        ink: {
          900: '#0f1117',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'DM Sans', 'var(--font-raleway)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Raleway', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #ef4444, #dc2626)',
      },
    },
  },
  plugins: [],
}

export default config
