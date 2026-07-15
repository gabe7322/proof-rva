/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        proof: {
          bg:        '#F7F2E7',
          'bg-alt':  '#F0E9D8',
          'bg-surf': '#EAE1CB',
          text:      '#1A1510',
          mute:      'rgba(26,21,16,0.6)',
          faint:     'rgba(26,21,16,0.3)',
          accent:    '#EF1A26',
          border:    'rgba(26,21,16,0.09)',
          'border-md': 'rgba(26,21,16,0.16)',
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
