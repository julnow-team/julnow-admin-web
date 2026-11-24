// Text field. Pass `icon` (a lucide icon) to show it on the left, and `trailing` for something on the right.
export default function Input({ icon: Icon, trailing, className = '', ...rest }) {
  return (
    <div
      className={`flex h-[38px] items-center gap-2 rounded-md border border-line bg-surface px-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-focus ${className}`}
    >
      {Icon && <Icon size={16} className="shrink-0 text-muted" />}
      <input
        className="min-w-0 flex-1 bg-transparent text-sm leading-5 text-ink outline-none placeholder:text-muted disabled:text-disabled"
        {...rest}
      />
      {trailing}
    </div>
  )
}
