import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function WhatWeMake() {
  const { eyebrow, headline, blocks } = COPY.whatWeMake

  return (
    <section className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <ScrollReveal>
        <p className="eyebrow mb-5">{eyebrow}</p>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <h2
          className="text-proof-text font-bold leading-snug mb-10 max-w-2xl"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
        >
          {headline}
        </h2>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {blocks.map((block, i) => (
          <ScrollReveal key={block.label} delay={0.1 * i}>
            <motion.div
              className="bg-proof-bg-alt border border-proof-border rounded-lg p-6 h-full"
              whileHover={{
                y: -6,
                borderColor: 'rgba(214,59,59,0.4)',
                boxShadow: '0 12px 32px -12px rgba(214,59,59,0.25)',
              }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <h3 className="text-proof-text font-bold text-base mb-3">{block.label}</h3>
              <p className="text-proof-mute text-sm leading-relaxed">{block.text}</p>
            </motion.div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
