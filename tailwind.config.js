// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{ts,tsx,js,jsx}",
      "./src/components/**/*.{ts,tsx,js,jsx}",
      "./src/hooks/**/*.{ts,tsx,js,jsx}",
      "./src/app/**/*.css",            // ← this line
    ],
    theme: { extend: {} },
    plugins: [
      require('@tailwindcss/typography'),
      require('daisyui'),
    ],
    daisyui: {
      themes: ['emerald'],
      styled: true,
      base: true,
    },
  };
  