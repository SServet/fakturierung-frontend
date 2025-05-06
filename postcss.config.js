// postcss.config.js
module.exports = {
    plugins: {
      "@tailwindcss/postcss": {},  // <— the new Tailwind PostCSS plugin
      autoprefixer: {},             // <— vendor prefixes
    },
  };
  