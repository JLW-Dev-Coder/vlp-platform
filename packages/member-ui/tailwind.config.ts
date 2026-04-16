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
    },
  },
  plugins: [],
};

export default config;
