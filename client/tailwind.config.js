/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Fixed accent — never themed.
        brand: {
          50: '#eef0ff',
          100: '#e0e4ff',
          200: '#c7ccff',
          300: '#a5abfc',
          400: '#868bf8',
          500: '#6d70f0',
          600: '#5558e6', // primary
          700: '#4649cc',
          800: '#3a3ca5',
          900: '#333782',
        },
        // Fixed dark surfaces for the hero banner + "Now Playing".
        navy: {
          950: '#0b1220',
          900: '#0f1729',
          800: '#152037',
          700: '#1c2b49',
          600: '#243660',
        },
        // Semantic tokens — driven by CSS variables so they respond to the
        // .dark class on <html>. See index.css for the light/dark values.
        page: 'var(--bg-page)',
        surface: 'var(--bg-surface)',
        elevated: 'var(--bg-elevated)',
        subtle: 'var(--bg-subtle)',
        hairline: 'var(--border-hairline)',
        ink: {
          DEFAULT: 'var(--text-strong)',
          soft: 'var(--text-soft)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
      },
      spacing: {
        18: '4.5rem',   /* 72px — collapsed sidebar */
        65: '16.25rem', /* 260px — expanded sidebar */
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)',
        cardhover: '0 10px 30px rgba(16, 24, 40, 0.12)',
        rail: '0 1px 2px rgba(16, 24, 40, 0.03), 0 1px 8px rgba(16, 24, 40, 0.05)',
        'sidebar-glow': '0 0 20px rgba(85, 88, 230, 0.15)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'spin-slow': 'spin-slow 26s linear infinite',
        'slide-in': 'slide-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
}
