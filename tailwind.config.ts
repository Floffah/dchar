/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: [
    "variant",
    [
      "@media (prefers-color-scheme: dark) { &:not(.light *) }",
      "&:is(.dark *)",
    ],
  ],
  theme: {
    fontFamily: {
      sans: "var(--font-sans)",
    },
  },
  plugins: [],
};

export default tailwindConfig;
