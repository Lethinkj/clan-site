module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#f5f8ff',
          100: '#0b2545',
          200: '#123a6b',
          300: '#1b5bb0',
          400: '#2a7fe0',
          500: '#2563eb',
          600: '#1f4fb8',
          700: '#17366f',
          800: '#0f2547',
          900: '#07122a'
        },
        yellow: {
          50: '#fffaf0',
          100: '#fff3cc',
          200: '#f6d36b',
          300: '#f3c04a',
          400: '#f1b011',
          500: '#d99a00',
          600: '#b38600',
          700: '#8b6500',
          800: '#634500',
          900: '#3f2a00'
        }
      },
      keyframes: {
        pulse: {
          '0%': { opacity: '0.2', transform: 'scale(0.9)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
          '100%': { opacity: '0.2', transform: 'scale(0.9)' }
        }
      },
      animation: {
        pulse: 'pulse 3s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
