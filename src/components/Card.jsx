export default function Card({ className = '', children }) {
  return <section className={`rounded-lg border border-line bg-surface shadow-card ${className}`}>{children}</section>
}
