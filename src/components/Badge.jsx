const TONES = {
  success: 'bg-success-subtle text-success',
  warning: 'bg-warning-subtle text-warning',
  danger: 'bg-danger-subtle text-danger',
  info: 'bg-info-subtle text-info',
  neutral: 'bg-subtle text-muted',
  brand: 'bg-primary-subtle text-primary',
}

// dot = true shows a small dot before the label (used in tables)
export default function Badge({ tone = 'neutral', dot = false, children }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs leading-4 font-medium tracking-[0.01em] whitespace-nowrap ${TONES[tone]}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}
