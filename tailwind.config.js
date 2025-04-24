/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.js',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/_document.tsx',
    './public/**/*.html',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{js,ts,jsx,tsx,mdx}',
    './utils/**/*.{js,ts,jsx,tsx,mdx}',
    './theme/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  plugins: [require('flowbite/plugin')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'cryo-blue': '#1371FD',
        'cryo-cyan': '#18E3BB',
        'cryo-dark-grey': '#292B2C',
        'cryo-grey': '#1E2021',
        'cryo-light-grey': '#4F4F4F',
        'dark-grey': {
          100: '#212121',
          200: '#424242',
          300: '#4F4F4F',
          400: '#292B2C',
          500: '#383838',
        },
        purple: {
          300: '#CABFFD',
        },
        green: {
          300: '#84E1BC',
        },
      },
      gridTemplateColumns: {
        'auto-fit-cards': 'repeat(auto-fit, minmax(240px, 1fr))',
      },
    },
  },
};
