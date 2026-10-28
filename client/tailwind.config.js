/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vanisetu: {
          primary: {
            DEFAULT: '#214B32', // forest-600 brand primary
            dark: '#1A3C28', // forest-700
          },
          accent: {
            DEFAULT: '#E9A23B', // gold-400
            dark: '#CF841C', // gold-500
          },
          cream: {
            DEFAULT: '#F7F5EB', // cream-200
            dark: '#EDE9D6', // cream-300
          },
          'text-muted': '#54888D', // muted teal/slate
        },
        forest: {
          DEFAULT: '#214B32',
          50: '#F0F5F2',
          100: '#DCE8E0',
          200: '#BCD3C3',
          300: '#94BA9F',
          400: '#649973',
          500: '#3D794F',
          600: '#214B32', // Brand Primary
          700: '#1A3C28',
          800: '#152F20',
          900: '#0F2117',
        },
        cream: {
          DEFAULT: '#F7F5EB', // Warm Cream Background
          50: '#FFFFFF',
          100: '#FCFAF5',
          200: '#F7F5EB',
          300: '#EDE9D6',
          400: '#E1D9BA',
          500: '#D2C69B',
        },
        gold: {
          DEFAULT: '#E9A23B', // Golden Orange
          50: '#FDF7EC',
          100: '#FAECD0',
          200: '#F5D79E',
          300: '#F0C06A',
          400: '#E9A23B',
          500: '#CF841C',
          600: '#A76612',
        },
        teal: {
          DEFAULT: '#173E40', // Deep Teal
          50: '#F2F8F8',
          100: '#DCEAEB',
          200: '#B8D4D6',
          300: '#8FB9BD',
          400: '#54888D',
          500: '#326064',
          600: '#173E40',
          700: '#112F30',
        },
        sage: {
          DEFAULT: '#668A70', // Sage Green
          50: '#F3F6F4',
          100: '#E3EAE5',
          200: '#C7D5CB',
          300: '#A6BDAE',
          400: '#84A48D',
          500: '#668A70',
          600: '#516E59',
        },
        mutedblue: {
          DEFAULT: '#6894A0', // Muted Blue
          50: '#F2F6F8',
          100: '#E1EDF1',
          200: '#C3DBE3',
          300: '#9DC3CE',
          400: '#7EACB9',
          500: '#6894A0',
          600: '#4D7581',
        },
        tribalpurple: {
          DEFAULT: '#806A91', // Tribal Purple
          50: '#F6F4F8',
          100: '#ECE6F0',
          200: '#D8CCE0',
          300: '#BFADC9',
          400: '#9D86AD',
          500: '#806A91',
          600: '#655274',
        },
        terracotta: {
          DEFAULT: '#D97860', // Terracotta
          50: '#FCF5F3',
          100: '#F7E7E2',
          200: '#EFCFC5',
          300: '#E4AEA1',
          400: '#D97860',
          500: '#C7573B',
          600: '#A43E25',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'earthy': '0 4px 20px -2px rgba(33, 75, 50, 0.08)',
        'earthy-lg': '0 10px 30px -4px rgba(33, 75, 50, 0.12)',
        'button-gold': '0 4px 0 #CF841C',
        'button-forest': '0 4px 0 #1A3C28',
      },
    },
  },
  plugins: [],
}
