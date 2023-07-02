/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-red-hat)'],
      },
      colors: {
        menu: '#fafcff',
        profile: '#fafcff',
        sidebar: '#f6f8fb',
        send: '#fafcff',
        'message-header': '#fafcff',
        'message-list': '#f6f8fb',
        'input-message': '#f6f8fb',
      },
    },
  },
  plugins: [],
};
