import ScrollReveal from './ScrollReveal'
import Logo from './Logo'
import { COPY } from '../constants/copy'

export default function Footer() {
  const { closing, cta, tagline } = COPY.footer

  return (
    <footer className="bg-proof-bg-alt px-6 md:px-16 lg:px-24 py-20 md:py-28">
      <ScrollReveal>
        <p className="text-proof-text font-bold leading-snug mb-6"
          style={{ fontSize: 'clamp(1.25rem, 3.5vw, 1.75rem)', maxWidth: '28rem' }}
        >
          {closing}
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <a
          href="#apply"
          className="inline-block text-proof-accent text-xs font-bold uppercase tracking-widest mb-16 hover:opacity-80 transition-opacity"
        >
          {cta}
        </a>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="flex items-center justify-between pt-6 border-t border-proof-border">
          <Logo className="h-16" />
          <p className="text-proof-faint text-xs tracking-widest uppercase">{tagline}</p>
          {/* Social links placeholder — add handles when available */}
        </div>
      </ScrollReveal>
    </footer>
  )
}
