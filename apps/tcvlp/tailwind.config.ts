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
          DEFAULT: '#eab308',
          light: '#fbbf24',
          dark: '#ca8a04',
          400: '#fbbf24',
          500: '#eab308',
          primary: '#eab308',
          hover: '#ecb91c',
          glow: 'rgba(234, 179, 8, 0.40)',
          'text-on-primary': '#ffffff',
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
        'gradient-brand': 'linear-gradient(to right, #eab308, #ca8a04)',
      },
    },
  },
  plugins: [],
}

export default config
