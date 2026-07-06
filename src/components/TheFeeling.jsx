import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

function FeelingLine({ line }) {
  const ref = useRef(null)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'start 0.4'],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [0.18, 1])
  const y = useTransform(scrollYProgress, [0, 1], [16, 0])

  return (
    <motion.p
      ref={ref}
      style={prefersReduced ? {} : { opacity, y }}
      className={`font-semibold leading-snug ${
        line.faded ? 'text-proof-mute text-xl md:text-2xl' : 'text-proof-text text-2xl md:text-3xl'
      }`}
    >
      {line.text}
    </motion.p>
  )
}

export default function TheFeeling() {
  const { eyebrow, headline, lines, closing } = COPY.theFeeling

  return (
    <section className="bg-proof-bg-surf px-6 md:px-16 lg:px-24 py-28 md:py-40">
      <ScrollReveal>
        <p className="text-xs tracking-eyebrow uppercase font-semibold text-proof-faint mb-6">
          {eyebrow}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <h2
          className="text-proof-text font-bold leading-snug mb-14 max-w-2xl"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
        >
          {headline}
        </h2>
      </ScrollReveal>

      <div className="flex flex-col gap-7 max-w-2xl mb-14">
        {lines.map((line, i) => (
          <FeelingLine key={i} line={line} />
        ))}
      </div>

      <ScrollReveal delay={0.1}>
        <p className="text-proof-text font-bold leading-snug max-w-2xl" style={{ fontSize: 'clamp(1.25rem, 3vw, 1.625rem)' }}>
          {closing}
        </p>
      </ScrollReveal>
    </section>
  )
}
