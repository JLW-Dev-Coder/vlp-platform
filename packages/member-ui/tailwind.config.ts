import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
};

export default config;
