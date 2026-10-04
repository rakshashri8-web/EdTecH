import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563eb",
          purple: "#7c3aed",
          dark: "#0f172a",
          navy: "#172554",
          indigo: "#4f46e5",
          muted: "#64748b",
          light: "#f6f9ff",
          border: "#e5edf8",
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'tech-pattern': "radial-gradient(circle at 50% 50%, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
