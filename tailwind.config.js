/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F3D3E',
          hover: '#164F50',
          light: '#E8F1F0',
          dark: '#092E2F',
        },
        surface: '#FFFFFF',
        background: '#F7F8F8',
        neutral: {
          50: '#F8FAFA',
          100: '#F1F3F3',
          200: '#E5E8E8',
          300: '#D5DADA',
          500: '#858D8D',
          700: '#414949',
          900: '#182121',
        },
        success: {
          DEFAULT: '#16845B',
          light: '#E8F5EE',
        },
        warning: {
          DEFAULT: '#B7791F',
          light: '#FFF5DF',
        },
        danger: {
          DEFAULT: '#C44545',
          light: '#FCECEC',
        },
        info: {
          DEFAULT: '#3478A5',
          light: '#EAF3FA',
        },
      },
      borderRadius: {
        'sm-control': '8px',
        'btn': '10px',
        'input': '12px',
        'card': '16px',
        'modal': '20px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'tactile-light': '0 2px 8px -2px rgba(15, 61, 62, 0.06), 0 4px 16px -4px rgba(15, 61, 62, 0.08)',
        'modal': '0 20px 40px -15px rgba(15, 61, 62, 0.15)',
      },
    },
  },
  plugins: [],
};
