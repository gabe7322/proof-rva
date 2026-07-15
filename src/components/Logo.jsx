export default function Logo({ className = '' }) {
  return (
    <img
      src="/proof-logo.png"
      alt="Proof RVA"
      className={`w-auto object-contain ${className}`}
    />
  )
}
