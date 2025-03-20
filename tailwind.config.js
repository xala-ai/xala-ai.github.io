/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{svelte,js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Vice City theme (dark)
        'vc': {
          'pink': '#ff41b4',
          'blue': '#00b8ff',
          'dark': '#121220',
          'light': '#f8fafc',
          'card': 'rgba(18, 18, 32, 0.8)',
        },
        // Light theme
        'light': {
          'pink': '#ff71c8',
          'blue': '#41e2ff',
          'bg': '#f8fafc',
          'text': '#334155',
        },
        // Executive theme
        'exec': {
          'primary': '#8B2131',
          'secondary': '#D7B98E',
          'tertiary': '#412925',
          'bg': '#F6F1EB',
          'gold': '#D7B98E',
        },
        // Keep original primary shades for compatibility
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      backgroundImage: {
        'vc-gradient': 'linear-gradient(135deg, #ff41b4 0%, #00b8ff 100%)',
        'vc-gradient-alt': 'linear-gradient(45deg, #ff41b4 0%, #00b8ff 100%)',
        'light-gradient': 'linear-gradient(135deg, rgba(255, 65, 180, 0.7) 0%, rgba(0, 184, 255, 0.7) 100%)',
        'exec-gradient': 'linear-gradient(135deg, #8B2131 0%, #D7B98E 100%)',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right bottom'
          }
        }
      },
      boxShadow: {
        'vc': '0 4px 20px rgba(0, 184, 255, 0.3)',
        'light': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'exec': '0 4px 20px rgba(139, 33, 49, 0.15)',
      },
    },
  },
  plugins: [],
} 