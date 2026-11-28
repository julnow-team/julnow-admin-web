const TONES = {
  info: 'bg-subtle text-ink-soft',
  danger: 'bg-danger-subtle text-danger',
}

// A short message box inside a form
export default function Notice({ tone = 'info', icon: Icon, children }) {
  return (
    <div
      role={tone === 'danger' ? 'alert' : undefined}
      className={`flex items-center gap-2.5 rounded-md p-3 text-xs font-medium tracking-[0.01em] ${TONES[tone]}`}
    >
      {Icon && <Icon size={20} className="shrink-0" />}
      <p className="min-w-0 flex-1">{children}</p>
    </div>
  )
}
