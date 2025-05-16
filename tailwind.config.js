/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        ds_surface: "hsl(0, 0%, 100%)",
        ds_hover: "hsl(0, 0%, 96%)",
        ds_text: "hsl(195, 3%, 24%)",
        ds_border: "hsl(210, 0%, 89%)",
        ds_primary: {
          600: "hsl(213, 97%, 53%)",
          700: "hsl(213, 97%, 33%)",
        },
      },
      spacing: {
        DEFAULT: "16px",
      },
      fontSize: {
        base: "14px",
      },
      borderRadius: {
        DEFAULT: "3px",
      },
    },
  },
  plugins: [],
};
