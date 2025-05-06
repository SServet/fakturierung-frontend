// tailwind.config.js
module.exports = {
    content: [
      "./src/app/**/*.{ts,tsx,js,jsx}",
      "./src/components/**/*.{ts,tsx,js,jsx}",
      "./src/styles/**/*.{css}",
    ],
    theme: {
      extend: { 
        colors: {
            primary: "#0071E3",
            background: "#F5F5F7",
            border: "#D1D1D6",
          },
          borderRadius: {
            lg: "1rem",
            xl: "1.5rem",
          },
          boxShadow: {
            card: "0 4px 16px rgba(0,0,0,0.08)",
          }
       },
    },
    plugins: [],
  };
  