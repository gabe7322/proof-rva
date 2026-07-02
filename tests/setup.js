import '@testing-library/jest-dom'

// Polyfill IntersectionObserver for Framer Motion's whileInView
global.IntersectionObserver = class IntersectionObserver {
  constructor(cb) { this.cb = cb }
  observe() {}
  unobserve() {}
  disconnect() {}
}
