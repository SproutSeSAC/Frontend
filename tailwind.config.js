/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        sm: { max: '767px' },
        md: { max: '1023px' },
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        bg: '#F5F5F7',
        text: '#2b2b2b',

        gray1: '#6d6d6d',
        gray2: '#b5b5b5',
        gray3: '#dedede',
        gray4: '#e9e9e9',

        white: '#fff',

        oliveGreen1: '#6fa235',
        oliveGreen2: '#b4d780',
        oliveGreen3: '#cae3a5',

        vividGreen1: '#00ad49',
        vividGreen2: '#69c57e',
        vividGreen3: '#c0e5c7',

        skyBlue1: '#00b2e3',
        skyBlue2: '#7bd2ec',
      },
      boxShadow: {
        card: '2px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        modal: '2px 2px 16px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
};
