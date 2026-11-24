// Popover list that opens under a button. The parent element must be `relative`.
// Put MenuItem components inside. Use align="right" near the right edge of the screen.
export default function Menu({ align = 'left', className = '', children, ...rest }) {
  return (
    <div
      className={`absolute top-full z-20 mt-1.5 flex min-w-52 flex-col gap-0.5 rounded-lg border border-line bg-surface p-1.5 shadow-popover ${align === 'right' ? 'right-0' : 'left-0'} ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
