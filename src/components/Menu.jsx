// Popover list that opens under a button. The parent element must be `relative`.
// Put MenuItem components inside. Use align="right" near the right edge of the screen.
// fixed: place it with style={{ top, right }} so a scrolling parent (like a table) cannot cut it off.
export default function Menu({ align = 'left', fixed = false, className = '', children, ...rest }) {
  const place = fixed ? 'fixed' : `absolute top-full mt-1.5 ${align === 'right' ? 'right-0' : 'left-0'}`

  return (
    <div
      className={`${place} z-20 flex min-w-52 flex-col gap-0.5 rounded-lg border border-line bg-surface p-1.5 shadow-popover ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
