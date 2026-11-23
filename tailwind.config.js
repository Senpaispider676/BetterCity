/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spatial: {
          bg: 'var(--bg-primary)',
          bgSec: 'var(--bg-secondary)',
          card: 'var(--card-surface)',
          cardHover: 'var(--card-surface-hover)',
          border: 'var(--border-subtle)',
          borderHover: 'var(--border-hover)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
          input: 'var(--input-bg)',
          inputBorder: 'var(--input-border)',
          blue: '#3B82F6',
          green: '#2E9D68',
          orange: '#FFB547',
          red: '#EF4444',
        }
      },
      borderRadius: {
        'spatial-sm': '14px',
        'spatial': '18px',
        'spatial-lg': '24px',
        'spatial-xl': '30px',
      },
      boxShadow: {
        'spatial': '0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 0 0 1px var(--border-subtle)',
        'spatial-sm': '0 4px 16px 0 rgba(0, 0, 0, 0.25), inset 0 0 0 1px var(--border-subtle)',
        'spatial-lg': '0 16px 48px 0 rgba(0, 0, 0, 0.45), inset 0 0 0 1px var(--border-hover)',
        'spatial-light': '0 10px 30px -10px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        'spatial': '16px',
        'spatial-lg': '24px',
      }
    },
  },
  plugins: [],
}
