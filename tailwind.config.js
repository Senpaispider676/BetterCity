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
        evergreen: {
          frosted: '#d8f3dc',
          celadon: '#b7e4c7',
          celadon2: '#95d5b2',
          mint: '#74c69d',
          mint2: '#52b788',
          sea: '#40916c',
          emerald: '#2d6a4f',
          pine: '#1b4332',
          dark: '#081c15',
        },
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
          blue: 'var(--primary-accent)', // Dynamic accent (#52b788 in dark, #2d6a4f in light)
          green: '#52b788',
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
