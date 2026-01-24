/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cosmic Depths - Navy/Cyan Color System
        navy: {
          deep: '#0A1628',    // Darkest - page background, deep panels
          mid: '#1A2942',      // Cards, elevated panels
          light: '#2A3F5F',    // Hover states, subtle borders
        },
        cyan: {
          electric: '#00E5FF', // Primary actions, focus states
          bright: '#5CFFFF',   // Highlights, interactive elements
          muted: '#1ACFEF',    // Secondary text, icons
        },
        cosmic: {
          white: '#E8F4F8',    // Primary text (cool-tinted)
          grey: '#8BA3B8',     // Secondary text (cool grey)
          dim: '#4A5F7A',      // Disabled states, borders
        },

        // Semantic colors (derived from cyan)
        success: '#00FFB8',    // Cyan-green
        warning: '#FFB800',    // Gold (complements navy)
        error: '#FF3366',      // Magenta-red with cyan undertone

        // MTG Affinity colors (used as hints/accents)
        affinity: {
          white: '#FFF8DC',    // Warm cream
          blue: '#4A90E2',     // Clear blue
          black: '#2D2D2D',    // Dark grey
          red: '#E74C3C',      // Vibrant red
          green: '#27AE60',    // Natural green
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', 'monospace'],
      },
      fontWeight: {
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        header: '0.02em',
      },
      lineHeight: {
        relaxed: '1.6',
      },
      boxShadow: {
        'glow-cyan-sm': '0 0 10px rgba(0, 229, 255, 0.3)',
        'glow-cyan-md': '0 0 20px rgba(0, 229, 255, 0.4)',
        'glow-cyan-lg': '0 0 30px rgba(0, 229, 255, 0.5)',
        'panel': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'panel-hover': '0 8px 16px -2px rgba(0, 229, 255, 0.2), 0 4px 8px -1px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'constellation-pulse': 'constellation-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 229, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 229, 255, 0.6)' },
        },
        'constellation-pulse': {
          '0%, 100%': { opacity: '0.15' },
          '50%': { opacity: '0.25' },
        },
      },
    },
  },
  plugins: [],
}
