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
          light: 'rgba(234, 179, 8, 0.15)',    // was #fbbf24 (shade swatch)
          dark: '#c79807',     // was #ca8a04 (shade swatch)
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
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
        display: ['var(--font-sora)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #eab308, #ca8a04)',
      },
    },
  },
  plugins: [],
}

export default config
