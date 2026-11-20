/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a192f',
        card: '#0e2443',
        'card-hover': '#244773',
        accent: '#64ffda',
        'accent-line': 'rgba(38,185,185,0.49)',
        'tab-active': '#1f2937',
        'text-heading': '#f3f4f6',
        'text-primary': '#e5e7eb',
        'text-secondary': '#d1d5db',
        'text-muted': '#9ca3af',
        'text-faint': '#6b7280',
        'slider-btn-bg': 'rgba(156,163,175,0.3)',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
        tiny5: ['Tiny5', 'monospace'],
        mono: ['"Reddit Mono"', 'monospace'],
      },
      screens: {
        'custom-xm': { max: '1024px' },
        'custom-m': { max: '768px' },
        'custom-sm': { max: '640px' },
        'custom-xs': { max: '480px' },
      },
      transitionTimingFunction: {
        'scroll-reveal': 'cubic-bezier(0, 0, 0.2, 1)',
        'slider-track': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
