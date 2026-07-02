export default function Logo({ className = '' }) {
  return (
    <span
      className={`font-display font-black tracking-[0.2em] text-proof-text uppercase ${className}`}
      aria-label="Proof RVA"
    >
      Proof
    </span>
  )
}
