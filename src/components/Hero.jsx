import { motion, useReducedMotion } from 'framer-motion'
import { COPY } from '../constants/copy'
import { TOKENS } from '../constants/tokens'
import Logo from './Logo'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function Hero() {
  const { headline, headlineSub, sub, cta } = COPY.hero
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 lg:px-24 overflow-hidden bg-proof-bg"
      aria-label="Hero"
    >
      {/* Ambient orb */}
      <motion.div
        className="absolute pointer-events-none rounded-full"
        style={{
          top: '-10%',
          right: '-5%',
          width: '55vw',
          height: '55vw',
          background: `radial-gradient(circle, ${TOKENS.accent}14 0%, transparent 65%)`,
        }}
        animate={prefersReduced ? {} : { x: [0, 18, -8, 0], y: [0, -12, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 max-w-4xl">
        <motion.div {...fadeUp(0)} className="mb-8">
          <Logo className="h-20 md:h-28" />
        </motion.div>

        <h1
          className="font-display font-black uppercase leading-none tracking-tight text-proof-text mb-5"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
        >
          {headline.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: '110%', skewY: 4 }}
                animate={{ y: '0%', skewY: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + i * 0.1 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <span className="block overflow-hidden mb-5">
          <motion.span
            className="block font-display font-semibold normal-case tracking-tight text-proof-accent"
            style={{ fontSize: 'clamp(1.25rem, 3.5vw, 2.25rem)' }}
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 + headline.length * 0.1 }}
          >
            {headlineSub}
          </motion.span>
        </span>

        <motion.p
          className="text-proof-accent italic mb-10"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.375rem)' }}
          {...fadeUp(0.35)}
        >
          {sub}
        </motion.p>

        <motion.a
          href="#apply"
          className="relative inline-flex items-center gap-2 bg-proof-accent text-proof-bg font-bold uppercase tracking-widest text-xs px-7 py-4 rounded-sm"
          {...fadeUp(0.45)}
          whileHover={{
            scale: 1.02,
            boxShadow: `0 0 0 1px ${TOKENS.accent}, 0 0 28px 4px ${TOKENS.accent}55`,
            transition: { duration: 0.25, ease: 'easeOut' },
          }}
          whileTap={{ scale: 0.98 }}
        >
          {cta}
        </motion.a>
      </div>

      <motion.div
        className="absolute bottom-8 left-6 md:left-16 flex items-center gap-3 opacity-25"
        {...fadeUp(0.7)}
      >
        <div className="w-6 h-px bg-proof-text" />
        <span className="text-proof-text text-xs tracking-widest uppercase">Scroll</span>
      </motion.div>
    </section>
  )
}
