// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1A6B3A',
        'brand-dark': '#0F4A28',
        'brand-mid': '#2D8A52',
        'brand-light': '#F7FAF5',
        'brand-cream': '#FDFAF4',
        'brand-secondary': '#E8F0E5',
        'brand-accent': '#F5A623',
        'brand-muted': '#EEF5EB',
        'brand-border': '#D4E8CE',
        primary: {
          DEFAULT: '#1A6B3A',
          foreground: '#FFFFFF',
          dark: '#0F4A28',
          light: '#2D8A52',
        },
        secondary: {
          DEFAULT: '#E8F0E5',
          foreground: '#031309',
        },
        accent: {
          DEFAULT: '#F5A623',
          foreground: '#1A2E1A',
        },
        background: '#F7FAF5',
        foreground: '#1A2E1A',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A2E1A',
        },
        muted: {
          DEFAULT: '#EEF5EB',
          foreground: '#5C7A5C',
        },
        border: '#D4E8CE',
      },
      fontFamily: {
        'display': ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        'body': ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 74, 40, 0.08)',
        'card': '0 10px 30px -5px rgba(26, 107, 58, 0.08)',
        'card-hover': '0 20px 40px -5px rgba(26, 107, 58, 0.16)',
        'green-lg': '0 12px 28px -4px rgba(26, 107, 58, 0.35)',
        'accent-lg': '0 12px 28px -4px rgba(245, 166, 35, 0.4)',
      },
    },
  },
  plugins: [],
}