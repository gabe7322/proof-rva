import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function HowItWorks() {
  const { eyebrow, blocks } = COPY.howItWorks

  return (
    <section className="bg-proof-bg-alt px-6 md:px-16 lg:px-24 py-24 md:py-32">
      <ScrollReveal>
        <p className="eyebrow mb-10">{eyebrow}</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {blocks.map((block, i) => (
          <ScrollReveal key={block.num} delay={0.1 * i}>
            <div className="bg-proof-bg border border-proof-border rounded-lg p-6 h-full">
              <p className="text-proof-accent text-xs font-bold tracking-wide mb-3">{block.num}</p>
              <h3 className="text-proof-text font-bold text-base mb-3">{block.label}</h3>
              <p className="text-proof-mute text-sm leading-relaxed">{block.text}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  )
}
