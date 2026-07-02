import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function TheFeeling() {
  const { eyebrow, lines } = COPY.theFeeling

  return (
    <section className="bg-proof-bg-surf px-6 md:px-16 lg:px-24 py-28 md:py-40">
      <ScrollReveal>
        <p className="text-xs tracking-eyebrow uppercase font-semibold text-proof-faint mb-14">
          {eyebrow}
        </p>
      </ScrollReveal>

      <div className="flex flex-col gap-7 max-w-2xl">
        {lines.map((line, i) => (
          <ScrollReveal key={i} delay={0.12 * i}>
            <p
              className={`font-semibold leading-snug ${
                line.faded
                  ? 'text-proof-mute text-xl md:text-2xl'
                  : 'text-proof-text text-2xl md:text-3xl'
              }`}
            >
              {line.text}
            </p>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
