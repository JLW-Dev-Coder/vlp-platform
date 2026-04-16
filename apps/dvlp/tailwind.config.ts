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
          blue: '#3b82f6',
          indigo: '#6366f1',
          400: '#60a5fa',
          500: '#3b82f6',
          primary: '#3b82f6',
          hover: '#4b8cf7',
          dark: '#326fd1',
          light: 'rgba(59, 130, 246, 0.15)',
          glow: 'rgba(59, 130, 246, 0.40)',
          'text-on-primary': '#ffffff',
          'gradient-to': 'rgba(59, 130, 246, 0.15)',
        },
        ink: {
          900: '#020617',
        },
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #3b82f6, #6366f1)',
      },
    },
  },
  plugins: [],
}

export default config
