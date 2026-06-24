import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#1B2A4A",
        accent: "#C9A84C",
        surface: "#F8FAFC",
      },
      fontFamily: { inter: ["var(--font-inter)"] },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
