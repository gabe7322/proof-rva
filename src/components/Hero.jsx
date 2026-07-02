import { motion, useReducedMotion } from 'framer-motion'
import { COPY } from '../constants/copy'
import { TOKENS } from '../constants/tokens'

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut', delay },
})

export default function Hero() {
  const { eyebrow, headline, sub, cta } = COPY.hero
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
        <motion.p className="eyebrow text-proof-faint mb-6" {...fadeUp(0)}>
          {eyebrow}
        </motion.p>

        <h1
          className="font-display font-black uppercase leading-none tracking-tight text-proof-text mb-5"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}
        >
          {headline.map((line, i) => (
            <motion.span key={i} className="block" {...fadeUp(0.15 + i * 0.08)}>
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.p
          className="text-proof-mute italic mb-10"
          style={{ fontSize: 'clamp(1rem, 2.5vw, 1.375rem)' }}
          {...fadeUp(0.35)}
        >
          {sub}
        </motion.p>

        <motion.a
          href="#apply"
          className="inline-flex items-center gap-2 bg-proof-accent text-proof-text font-bold uppercase tracking-widest text-xs px-7 py-4 rounded-sm hover:opacity-90 transition-opacity"
          {...fadeUp(0.45)}
          whileHover={{ scale: 1.02 }}
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
