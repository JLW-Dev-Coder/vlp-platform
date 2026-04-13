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
          blue: '#3b82f6',
          indigo: '#6366f1',
          400: '#60a5fa',
          500: '#3b82f6',
        },
        ink: {
          900: '#020617',
        },
      },
      fontFamily: {
        sans: ['Sora', 'var(--font-raleway)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #3b82f6, #6366f1)',
      },
    },
  },
  plugins: [],
}

export default config
