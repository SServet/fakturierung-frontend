// File: tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/app/**/*.{ts,tsx}",
      "./src/pages/**/*.{ts,tsx}",
      "./src/components/**/*.{ts,tsx}",
    ],
    theme: {
      extend: {
        // any customizations you still want
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
      require('daisyui'),
    ],
    daisyui: {
      themes: ['synthwave'],  // or 'cupcake','corporate', etc.
      styled: true,
      base: true,
    },
  };
  