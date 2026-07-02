/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        proof: {
          bg:        '#10141A',
          'bg-alt':  '#141820',
          'bg-surf': '#181D26',
          text:      '#F0F2F5',
          mute:      'rgba(240,242,245,0.55)',
          faint:     'rgba(240,242,245,0.25)',
          accent:    '#D63B3B',
          border:    'rgba(240,242,245,0.07)',
          'border-md': 'rgba(240,242,245,0.13)',
        },
      },
      fontFamily: {
        display: ['Anton', 'Arial Black', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        eyebrow: '0.2em',
      },
    },
  },
  plugins: [],
}
