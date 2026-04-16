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
        },
        ink: {
          900: '#020617',
        },
      },
      fontFamily: {
        sans: ['var(--font-raleway)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #f59e0b, #d97706)',
      },
    },
  },
  plugins: [],
}

export default config
