// client/tailwind.config.js
module.exports = {
    content: [
      './src/**/*.{js,jsx,ts,tsx}',
      './public/index.html',
    ],
    darkMode: 'class', // 'media' or 'class'
    theme: {
      extend: {
        colors: {
          // Updated to indigo/purple palette instead of green
          primary: {
            light: '#8C7DFF',
            DEFAULT: '#6B5AE0', // Changed from #128C7E
            dark: '#4A3AAF',
          },
          secondary: {
            DEFAULT: '#9869FF', // Changed from #25D366
          },
          tertiary: {
            DEFAULT: '#B85CFF', // Changed from #34B7F1
          },
          chat: {
            bg: '#F5F3FF', // Changed from #E5DDD5
            incoming: '#FFFFFF',
            outgoing: '#E9DBFF', // Changed from #DCF8C6
          },
          dark: {
            bg: '#1E1A2D', // Changed from #111B21
            panel: '#2D2844', // Changed from #1F2C33
            hover: '#3B3460', // Changed from #2A3942
            text: {
              primary: '#F0EEFF', // Changed from #E9EDEF
              secondary: '#BEB8D8', // Changed from #8696A0
            },
            chat: {
              bg: '#171223', // Changed from #0B141A
              incoming: '#2D2844', // Changed from #202C33
              outgoing: '#493A80', // Changed from #005C4B
            },
          },
        },
        fontFamily: {
          sans: ['Helvetica', 'Arial', 'sans-serif'],
        },
        boxShadow: {
          message: '0 1px 0.5px rgba(0, 0, 0, 0.13)',
        },
      },
    },
    variants: {
      extend: {
        opacity: ['disabled'],
        cursor: ['disabled'],
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
    ],
  };