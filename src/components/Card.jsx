export default function Card({ className = '', children }) {
  return <section className={`rounded-xl border border-line bg-surface ${className}`}>{children}</section>
}