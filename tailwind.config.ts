import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          page: "var(--bg-page)",
          card: "var(--bg-card)",
          "card-hover": "var(--bg-card-hover)",
          elevated: "var(--bg-elevated)",
          subtle: "var(--bg-subtle)",
          inset: "var(--bg-inset)",
        },
        border: {
          default: "var(--border-default)",
          subtle: "var(--border-subtle)",
        },
        fg: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
          muted: "var(--text-muted)",
        },
        accent: { green: "var(--accent-green)" },
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  plugins: [typography],
};

export default config;
