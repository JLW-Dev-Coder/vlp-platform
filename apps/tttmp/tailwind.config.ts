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
          violet: '#8b5cf6',
          purple: '#7c3aed',
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        ink: {
          900: '#0F0F1A',
        },
      },
      fontFamily: {
        sans: ['var(--font-raleway)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #8b5cf6, #7c3aed)',
      },
    },
  },
  plugins: [],
}

export default config
