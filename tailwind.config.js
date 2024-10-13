/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        lg: { max: '1280px' },
        md: { max: '1023px' },
        sm: { max: '767px' },
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },
      colors: {
        bg: '#F5F5F7',
        text: '#2b2b2b', //black 900

        gray1: '#6d6d6d', //black 700
        gray2: '#b5b5b5', //black 400
        gray3: '#dedede', //white 300
        gray4: '#e9e9e9', //black 100
        gray5: '#d9d9d9', //black 300

        white: '#fff', //white 50

        oliveGreen1: '#6fa235', //primary 700
        oliveGreen2: '#b4d780', //primary 400
        oliveGreen3: '#cae3a5', //primary 200

        vividGreen1: '#00ac49', //secondary 500
        vividGreen2: '#69c57e', //secondary 300
        vividGreen3: '#c0e5c7', //secondary 100

        skyBlue1: '#00b2e3', //point 400
        skyBlue2: '#7bd2ec', //point 200
      },
      boxShadow: {
        card: '2px 4px 12px 0px rgba(0, 0, 0, 0.08)',
        modal: '2px 2px 16px 0px rgba(0, 0, 0, 0.25)',
      },
      gridAutoColumns: {
        '2fr': 'minmax(0, 2fr)',
        '3fr': 'minmax(0, 3fr)',
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
  plugins: [require('tailwind-scrollbar-hide')],
};

// regular : 400
// medium : 500
// semiBold : 600
// bold : 700
