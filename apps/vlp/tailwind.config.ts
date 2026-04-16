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
        // VLP design tokens mapped to Tailwind
        brand: {
          // Canonical six-token brand scale (see canonical-style.md §13)
          primary: '#f97316',
          hover: '#f97e29',
          dark: '#d46213',
          light: 'rgba(249, 115, 22, 0.15)',
          glow: 'rgba(249, 115, 22, 0.40)',
          'text-on-primary': '#ffffff',
        },
        ink: {
          900: '#0f172a',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        // Keep hex values in sync with brand.primary and brand.hover above.
        'gradient-brand': 'linear-gradient(to right, #f97316, #f97e29)',
      },
    },
  },
  plugins: [],
}

export default config
