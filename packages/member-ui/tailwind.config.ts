import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Legacy — keep until all components migrated
        member: {
          bg: "var(--member-bg)",
          card: "var(--member-card)",
          "card-hover": "var(--member-card-hover)",
          border: "var(--member-border)",
          accent: "var(--member-accent)",
          "accent-strong": "var(--member-accent-strong)",
          "hero-bg": "var(--member-hero-bg)",
          "hero-bg-end": "var(--member-hero-bg-end)",
        },
        // Canonical (canonical-style.md §2)
        surface: {
          bg: "var(--surface-bg)",
          card: "var(--surface-card)",
          elevated: "var(--surface-elevated)",
          input: "var(--surface-input)",
        },
        text: {
          primary: "var(--text-primary)",
          muted: "var(--text-muted)",
          disabled: "var(--text-disabled)",
        },
      },
      borderColor: {
        subtle: "var(--border-subtle)",
        DEFAULT: "var(--border-default)",
        hover: "var(--border-hover)",
        focus: "var(--border-focus)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.25)",
        md: "0 4px 12px 0 rgba(0, 0, 0, 0.35)",
        lg: "0 10px 30px 0 rgba(0, 0, 0, 0.50)",
        focus: "0 0 0 3px var(--brand-glow, rgba(255, 255, 255, 0.40))",
        brand: "0 8px 24px 0 var(--brand-glow, rgba(255, 255, 255, 0.40))",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "slide-up": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-down": {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-out",
        "fade-out": "fade-out 150ms ease-in",
        "slide-up": "slide-up 250ms ease-out",
        "slide-down": "slide-down 250ms ease-out",
        "scale-in": "scale-in 250ms ease-out",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      zIndex: {
        base: "0",
        dropdown: "10",
        sticky: "20",
        overlay: "30",
        modal: "40",
        toast: "50",
      },
    },
  },
  plugins: [],
};

export default config;
