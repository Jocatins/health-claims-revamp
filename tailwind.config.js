// ESM export because package.json has "type": "module"
export default {
  content: ['./index.html','./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)'
      },
      fontFamily: {
        avenir: ['Avenir','ui-sans-serif','system-ui']
      },
      letterSpacing: {
        tightpx: '-0.25px'
      }
    }
  },
  plugins: []
};
