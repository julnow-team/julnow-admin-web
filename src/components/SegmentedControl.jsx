// Pick one of 2 to 5 options, like the status tabs "All 12,847 · Owners 2,598". options: [{ value, label }].
// Works like a radio group: the arrow keys move and pick, and only the picked option is in the Tab order.
export default function SegmentedControl({ value, onChange, options, label, className = '' }) {
  function handleKeyDown(event) {
    const buttons = [...event.currentTarget.querySelectorAll('[role=radio]')]
    const current = options.findIndex((option) => option.value === value)
    const steps = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }

    let next
    if (event.key in steps) next = (current + steps[event.key] + options.length) % options.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = options.length - 1
    else return

    event.preventDefault()
    buttons[next].focus()
    onChange(options[next].value)
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={`inline-flex max-w-full flex-wrap gap-0.5 rounded-md bg-segment p-0.5 ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={`min-h-7 cursor-pointer rounded-sm px-3 text-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-primary ${selected ? 'bg-segment-active font-semibold text-ink shadow-card' : 'text-ink-soft hover:text-ink'}`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
