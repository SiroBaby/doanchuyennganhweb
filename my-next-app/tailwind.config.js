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
        'custom-blue':'#DAEFFF',
        'admin-nav': '#E5ECF6',
        'dark-sidebar': '#3C3C3C',
        'dark-text': '#ECECEC',
        'dark-body': '#444444',
        'dark-selected': '#4A4A4A',
        'dark-outline': '#555555',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}