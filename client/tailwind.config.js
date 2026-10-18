/** @type {import('tailwindcss').Config} */
export default {
  // Toggle dark mode via both .dark class AND data-theme="dark" attribute
  darkMode: ['selector', '[data-theme="dark"]'],
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
        // ── Semantic tokens — driven by CSS custom properties ──
        // These respond automatically to light/dark theme switching.
        bg:       'var(--bg)',
        surface:  'var(--surface)',
        'surface-2': 'var(--surface-2)',

        // Page / surface aliases (backward compat)
        page:     'var(--bg)',
        elevated: 'var(--surface)',
        subtle:   'var(--surface-2)',

        // Border
        border: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },
        hairline: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },

        // Text
        text: {
          DEFAULT: 'var(--text)',
          2:       'var(--text-2)',
          muted:   'var(--text-muted)',
        },
        ink: {
          DEFAULT: 'var(--text)',
          soft:    'var(--text-2)',
          muted:   'var(--text-muted)',
          faint:   'var(--text-muted)',
        },

        // Accent
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          soft:    'var(--accent-soft)',
          strong:  'var(--accent-strong)',
          on:      'var(--on-accent)',
        },

        // ── Portal Brand Palette (Teal / Navy / Gold) ──
        brand: {
          DEFAULT:  'var(--brand-primary)',
          primary:  'var(--brand-primary)',
          dark:     'var(--brand-dark)',
          gold:     'var(--brand-gold)',
          teal:     'var(--brand-teal)',
          flame:    'var(--brand-flame)',
          // Numeric scale for components that use brand-50 … brand-900
          50:  '#e6f3f6',
          100: '#c2e0e7',
          200: '#9accd8',
          300: '#71b8c8',
          400: '#4ea9bc',
          500: '#2b9aaf',
          600: '#1B6F81', // primary
          700: '#155f6f',
          800: '#0e4f5d',
          900: '#09324A', // dark
        },

        // Navy fixed surfaces (dark Hero Banner etc.)
        navy: {
          950: '#0b1020',
          900: '#0d1426',
          800: '#121a2e',
          700: '#182232',
          600: '#1e2c40',
        },

        // Status
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger:  'var(--danger)',
        info:    'var(--info)',
      },

      borderRadius: {
        badge:  '6px',
        btn:    '8px',
        row:    '10px',
        card:   '12px',
        panel:  '14px',
        dialog: '16px',
        pill:   '999px',
      },

      spacing: {
        18: '4.5rem',    // 72px  — header height / collapsed sidebar
        65: '16.25rem',  // 260px — expanded sidebar
      },

      boxShadow: {
        sm:       'var(--shadow-sm)',
        md:       'var(--shadow-md)',
        lg:       'var(--shadow-lg)',
        card:     'var(--shadow-sm)',
        cardhover:'0 8px 24px rgba(11, 29, 54, 0.10)',
        rail:     '0 1px 2px rgba(11, 29, 54, 0.03), 0 1px 8px rgba(11, 29, 54, 0.05)',
        focus:    'var(--focus-ring)',
      },

      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-left': {
          '0%':   { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',    opacity: '1' },
        },
        'slide-right': {
          '0%':   { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)',      opacity: '1' },
        },
        'spin-slow': {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'slide-in': {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1',   transform: 'scale(1)' },
          '50%':      { opacity: '0.5', transform: 'scale(0.85)' },
        },
        'marquee': {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'bounce-dot': {
          '0%, 80%, 100%': { transform: 'scale(0)' },
          '40%':           { transform: 'scale(1)' },
        },
        'pulse-ring': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '0',   transform: 'scale(1.5)' },
        },
        'ping-once': {
          '0%':         { transform: 'scale(1)',   opacity: '0.6' },
          '80%, 100%':  { transform: 'scale(1.6)', opacity: '0' },
        },
      },
      animation: {
        'fade-in':      'fade-in 0.25s ease-out both',
        'slide-left':   'slide-left 0.3s cubic-bezier(.4,0,.2,1) both',
        'slide-right':  'slide-right 0.3s cubic-bezier(.4,0,.2,1) both',
        'spin-slow':    'spin-slow 26s linear infinite',
        'slide-in':     'slide-in 0.3s ease-out both',
        'shimmer':      'shimmer 2s linear infinite',
        'pulse-dot':    'pulse-dot 2s ease-in-out infinite',
        'marquee':      'marquee 38s linear infinite',
        'bounce-dot':   'bounce-dot 1.4s ease-in-out infinite both',
        'pulse-ring':   'pulse-ring 1.8s ease-out infinite',
        'ping-once':    'ping-once 0.45s ease-out forwards',
      },

      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #071d49, #0066f5)',
        'hero-gradient':  'linear-gradient(180deg, #e3eefc, #eef4fc)',
        'gold-shimmer':   'linear-gradient(90deg, transparent 0%, rgba(255,251,8,.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
}
