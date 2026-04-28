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
          DEFAULT: '#ec4899',
          light: 'rgba(236, 72, 153, 0.15)',
          dark: '#db2777',
          400: '#f472b6',
          500: '#ec4899',
          primary: '#ec4899',
          hover: '#f472b6',
          glow: 'rgba(236, 72, 153, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': '#be185d',
        },
        ink: {
          900: '#0f1117',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #ec4899, #be185d)',
      },
    },
  },
  plugins: [],
}

export default config
