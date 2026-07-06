import ScrollReveal from './ScrollReveal'
import { COPY } from '../constants/copy'

export default function TheConnection() {
  const { text } = COPY.connection

  return (
    <section className="bg-proof-bg-alt px-6 md:px-16 lg:px-24 py-16 md:py-20">
      <ScrollReveal>
        <p
          className="text-proof-text font-bold leading-snug max-w-2xl"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)' }}
        >
          {text}
        </p>
      </ScrollReveal>
    </section>
  )
}
