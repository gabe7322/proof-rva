import { motion } from 'framer-motion'
import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function WhatWeAre() {
  const { eyebrow, headline, paras, tags } = COPY.whatWeAre

  return (
    <section className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-2xl">
        <ScrollReveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2
            className="text-proof-text font-bold italic leading-tight mb-6"
            style={{ fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}
          >
            {headline}
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-5 mb-10">
          {paras.map((para, i) => (
            <ScrollReveal key={i} delay={0.1 + i * 0.05}>
              <p className="text-proof-mute leading-relaxed text-base md:text-lg">{para}</p>
            </ScrollReveal>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <ScrollReveal key={tag} delay={0.12 + i * 0.04}>
              <motion.span
                className="text-xs font-semibold uppercase tracking-wide px-4 py-2 rounded-full border border-proof-border-md text-proof-mute cursor-default"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.12 }}
              >
                {tag}
              </motion.span>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
