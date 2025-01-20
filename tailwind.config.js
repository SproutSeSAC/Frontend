/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        bg: '#f5f5f7',
        black: '#4c4c4c', // +텍스트 기본값

        //white 회색조 컬러
        mainGray: '#d9d9d9',
        'mainGray-hover': '#c3c3c3',
        'mainGray-active': '#aeaeae',
        lightGray: '#fbfbfb',
        'lightGray-hover': '#f9f9f9',
        'lightGray-active': '#f3f3f3',
        darkGray: '#a3a3a3',
        'darkGray-hover': '#828282',
        'darkGray-active': '#626262',
        darkerGray: '#4c4c4c',

        //green
        mainGreen: '#6fa235',
        'mainGreen-hover': '#649230',
        'mainGreen-active': '#59822a',
        lightGreen: '#f1f6eb',
        'lightGreen-hover': '#e9f1e1',
        'lightGreen-active': '#d2e2c0',
        darkGreen: '#537a28',
        'darkGreen-hover': '#436120',
        'darkGreen-active': '#324918',
        darkerGreen: '#273913',

        //blue
        mainBlue: '#81e2ff',
        'mainBlue-hover': '#74cbe6',
        'mainBlue-active': '#67b5cc',
        lightBlue: '#f2fcff',
        'lightBlue-hover': '#ecfbff',
        'lightBlue-active': '#d8f6ff',
      },
      boxShadow: {
        card: '2px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        modal: '2px 2px 16px 0px rgba(0, 0, 0, 0.25)',
      },
      gridAutoColumns: {
        '2fr': 'minmax(0, 2fr)',
        '3fr': 'minmax(0, 3fr)',
      },
      height: {
        inherit: 'inherit',
      },
    },
    animation: {
      'slide-fade-in-dropdown': 'slide-fade-in-dropdown-animation 0.4s ease',
      'slide-fade-out-dropdown': 'slide-fade-out-dropdown-animation 0.4s ease',
      spin: 'spin 1.3s linear infinite',
    },
    keyframes: {
      'slide-fade-in-dropdown-animation': {
        '0%': {
          transform: 'translateY(-10%)',
        },
        '100%': {
          transform: 'translateY(0)',
        },
      },
      'slide-fade-out-dropdown-animation': {
        '0%': {
          transform: 'translateY(0)',
        },
        '100%': {
          transform: 'translateY(-10%)',
        },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    },
  },

  plugins: [
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/typography'),
  ],
};
