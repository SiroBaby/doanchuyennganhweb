/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/.{js,ts,jsx,tsx,mdx}",
    "./app/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/\\(auth\\)/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{html,js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'outline': '#E8E8E8',
        'selected-corlor': '#E2ECF1',
        'custom-red': '#FF5E5E',
        'admin-nav': '#E5ECF6',
      },
    },
  },
  plugins: [],
}