// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Scan all JSX files in the src directory
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}