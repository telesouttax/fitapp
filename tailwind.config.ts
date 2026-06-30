import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14171C",
        "ink-soft": "#1C2027",
        "ink-line": "#2A2F38",
        paper: "#F2EFE9",
        "paper-dim": "#B9B6AE",
        coral: "#FF6B4A",
        "coral-dim": "#7A3C2E",
        sage: "#8FB996",
        "sage-dim": "#3E4F40",
        sand: "#E8B86D",
        "sand-dim": "#5C4A2C",
        slate: "#5C6470",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "14px",
      },
    },
  },
  plugins: [],
};
export default config;
