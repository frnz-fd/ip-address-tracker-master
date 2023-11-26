/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'ssm': '500px',
      'sm':'640px',
      'vsm':'380px',
      'md':'768px',
      'xmd':'900px',
    },
    extend: {},
  },
  plugins: [],
}