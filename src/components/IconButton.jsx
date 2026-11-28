const SIZES = {
  md: 'size-8',
  sm: 'size-6',
}

// Square button with only an icon. Always pass `label`, it is the name for screen readers and the tooltip.
export default function IconButton({
  icon: Icon,
  label,
  size = 'md',
  iconSize = 18,
  bordered = false,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md text-ink-soft hover:bg-hover focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:text-disabled disabled:hover:bg-transparent ${SIZES[size]} ${bordered ? 'border border-line' : ''} ${className}`}
      {...rest}
    >
      <Icon size={iconSize} />
    </button>
  )
}
