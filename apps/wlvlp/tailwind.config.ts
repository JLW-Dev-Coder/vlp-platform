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
        // 6 required canonical brand tokens + gradient-to (harmonized to neon blue primary)
        brand: {
          primary: '#00D4FF',
          hover: '#33DEFF',
          dark: '#00A8CC',
          light: 'rgba(0, 212, 255, 0.15)',
          glow: 'rgba(0, 212, 255, 0.40)',
          'text-on-primary': '#07070A',
          'gradient-to': 'rgba(255, 45, 138, 0.25)',
        },
        // WLVLP extended neon palette (Owner directive, 2026-04-19) — see Theming Divergences
        neon: {
          blue: '#00D4FF',
          yellow: '#FFE534',
          magenta: '#FF2D8A',
          cyan: '#00F0D0',
          purple: '#a855f7',
        },
        void: '#07070A',
        charcoal: '#12121A',
        glass: 'rgba(255,255,255,0.04)',
        glassBorder: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, var(--brand-primary), var(--brand-gradient-to))',
      },
    },
  },
  plugins: [],
}

export default config
