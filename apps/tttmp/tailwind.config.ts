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
          violet: '#8b5cf6',
          purple: '#7c3aed',
          400: '#a78bfa',
          500: '#8b5cf6',
          primary: '#8b5cf6',
          hover: '#9469f7',
          dark: '#764ed1',
          light: 'rgba(139, 92, 246, 0.15)',
          glow: 'rgba(139, 92, 246, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': 'rgba(139, 92, 246, 0.15)',
        },
        ink: {
          900: '#0F0F1A',
        },
        // Arcade / neon palette
        neon: {
          violet: '#8b5cf6',
          cyan: '#06b6d4',
          pink: '#ec4899',
          green: '#22c55e',
          amber: '#f59e0b',
        },
        arcade: {
          bg: '#0a0a1a',
          'bg-alt': '#0f0f22',
          surface: '#12122a',
          'surface-hover': '#1a1a3a',
          border: 'rgba(139, 92, 246, 0.3)',
          text: '#e2e8f0',
          'text-muted': '#94a3b8',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #8b5cf6, #7c3aed)',
        'gradient-neon': 'linear-gradient(135deg, #8b5cf6, #06b6d4, #ec4899)',
      },
      boxShadow: {
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.1)',
        'glow-cyan':   '0 0 20px rgba(6, 182, 212, 0.4), 0 0 60px rgba(6, 182, 212, 0.1)',
        'glow-pink':   '0 0 20px rgba(236, 72, 153, 0.4), 0 0 60px rgba(236, 72, 153, 0.1)',
        'glow-green':  '0 0 20px rgba(34, 197, 94, 0.4), 0 0 60px rgba(34, 197, 94, 0.1)',
        'glow-amber':  '0 0 20px rgba(245, 158, 11, 0.4), 0 0 60px rgba(245, 158, 11, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
