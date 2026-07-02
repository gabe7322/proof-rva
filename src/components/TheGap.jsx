import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function TheGap() {
  const { eyebrow, headline, paras } = COPY.gap

  return (
    <section className="bg-proof-bg px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <div className="max-w-2xl">
        <ScrollReveal>
          <p className="eyebrow mb-5">{eyebrow}</p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <h2
            className="text-proof-text font-bold leading-snug mb-10"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}
          >
            {headline}
          </h2>
        </ScrollReveal>

        <div className="flex flex-col gap-6">
          {paras.map((para, i) => (
            <ScrollReveal key={i} delay={0.08 * (i + 1)}>
              <p className="text-proof-mute leading-relaxed text-base md:text-lg">{para}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
