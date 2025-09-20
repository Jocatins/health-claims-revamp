// ESM export because package.json has "type": "module"
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {

        primary: 'var(--color-primary)',

         brand: {
          DEFAULT: "#186255",
          hover: "#145247",
          active: "#104036",
        },

      },
      fontFamily: {
        avenir: ['Avenir','ui-sans-serif','system-ui']
      },
      letterSpacing: {
        tightpx: '-0.25px'
      }
    }
  },
plugins: [require("@tailwindcss/forms")],
};
